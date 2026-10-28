"""Synthetic squat landmark generator for the reliability proof of concept.

Builds a simple 3D kinematic squat model, rotates it relative to a pinhole camera
(yaw 0 deg = facing the camera, 90 deg = side-on), projects 33 MediaPipe-style
landmarks to normalised image coordinates, adds pixel noise and a visibility
model, and writes one JSON file per condition.

This is a simulation of geometry and noise only. It does not reproduce
MediaPipe's own estimation errors, which can only be measured on real video.
"""
import json, math, os, sys
import numpy as np

W, H = 1280, 720            # image size (as in the app)
F = 900.0                   # focal length in pixels
CAM_DIST = 3.2              # metres from camera to person
CAM_HEIGHT = 0.9            # camera height above floor (m)
SEG = dict(shank=0.43, thigh=0.45, torso=0.52, neck=0.12, uarm=0.30, farm=0.27,
           hip_w=0.28, sh_w=0.38, foot=0.18)
FPS = 30

def pose_3d(knee_deg, valgus_deg=0.0):
    """Return dict name->(x,y,z) in body frame: x forward, y up, z to subject's left."""
    flex = 180.0 - knee_deg                 # total flexion
    a = math.radians(0.42 * flex)           # shank forward tilt
    b = math.radians(0.58 * flex)           # thigh backward tilt from vertical
    c = math.radians(0.55 * math.degrees(b) + 5.0)  # trunk forward lean
    P = {}
    for side, s in (('L', 1), ('R', -1)):
        z = s * SEG['hip_w'] / 2
        ankle = np.array([0.0, 0.08, z])
        knee = ankle + SEG['shank'] * np.array([math.sin(a), math.cos(a), 0.0])
        # optional knee valgus: knee drifts medially
        knee[2] -= s * SEG['shank'] * math.sin(math.radians(valgus_deg)) * min(1, flex / 80)
        hip = knee + SEG['thigh'] * np.array([-math.sin(b), math.cos(b), 0.0])
        hip[2] = z
        P[f'{side}ankle'] = ankle; P[f'{side}knee'] = knee; P[f'{side}hip'] = hip
        P[f'{side}heel'] = ankle + np.array([-0.05, -0.06, 0]); P[f'{side}toe'] = ankle + np.array([SEG['foot'] - 0.05, -0.07, 0])
    midhip = (P['Lhip'] + P['Rhip']) / 2
    up = np.array([math.sin(c), math.cos(c), 0.0])
    midsh = midhip + SEG['torso'] * up
    for side, s in (('L', 1), ('R', -1)):
        sh = midsh + np.array([0, 0, s * SEG['sh_w'] / 2])
        P[f'{side}shoulder'] = sh
        # arms held forward for balance, more so at depth
        arm_dir = np.array([math.cos(c * 0.3) * min(1, flex / 60 + 0.2), -0.6, 0.0]); arm_dir /= np.linalg.norm(arm_dir)
        el = sh + SEG['uarm'] * arm_dir; P[f'{side}elbow'] = el
        P[f'{side}wrist'] = el + SEG['farm'] * np.array([1.0, 0.1, 0.0]) / np.linalg.norm([1.0, 0.1])
    P['nose'] = midsh + SEG['neck'] * up + np.array([0.09, 0.08, 0])
    return P

MP_INDEX = {'nose': 0, 'Lshoulder': 11, 'Rshoulder': 12, 'Lelbow': 13, 'Relbow': 14, 'Lwrist': 15, 'Rwrist': 16,
            'Lhip': 23, 'Rhip': 24, 'Lknee': 25, 'Rknee': 26, 'Lankle': 27, 'Rankle': 28,
            'Lheel': 29, 'Rheel': 30, 'Ltoe': 31, 'Rtoe': 32}

def project(P, yaw_deg, rng, noise_px, vis_drop):
    """Camera looks along -x of world; subject rotated by yaw. yaw 0: subject faces camera."""
    psi = math.radians(yaw_deg)
    # body forward axis should point to camera at yaw 0. Rotate body about y.
    R = np.array([[math.cos(psi), 0, math.sin(psi)], [0, 1, 0], [-math.sin(psi), 0, math.cos(psi)]])
    lms = [{'x': 0.5, 'y': 0.5, 'z': 0.0, 'visibility': 0.0} for _ in range(33)]
    depths = {}
    for name, p in P.items():
        q = R @ p
        # camera at (CAM_DIST, CAM_HEIGHT, 0) looking toward -x; image u ~ -z (subject's left appears on image right), v ~ -y
        X = -q[2]; Y = q[1] - CAM_HEIGHT; Zc = CAM_DIST - q[0]
        u = W / 2 + F * X / Zc + rng.normal(0, noise_px)
        v = H / 2 - F * Y / Zc + rng.normal(0, noise_px)
        depths[name] = Zc
        lms[MP_INDEX[name]] = {'x': u / W, 'y': v / H, 'z': (Zc - CAM_DIST) / 1.0, 'visibility': 0.0}
    # visibility model: landmarks on the far side are progressively self-occluded as yaw grows
    for name in P:
        side = name[0] if name[0] in 'LR' else None
        base = 0.97
        if side is not None:
            far = (side == 'R') if yaw_deg >= 0 else (side == 'L')
            occl = vis_drop * abs(math.sin(math.radians(yaw_deg)))
            base = 0.97 - (occl if far else 0.0)
        lms[MP_INDEX[name]]['visibility'] = float(np.clip(base + rng.normal(0, 0.02), 0, 1))
    return lms

def true_angles(P, side='L'):
    def ang(a, b, c):
        v1 = P[a] - P[b]; v2 = P[c] - P[b]
        return math.degrees(math.acos(np.clip(v1 @ v2 / np.linalg.norm(v1) / np.linalg.norm(v2), -1, 1)))
    return dict(knee=ang(f'{side}hip', f'{side}knee', f'{side}ankle'), hip=ang(f'{side}shoulder', f'{side}hip', f'{side}knee'))

def rep_profile(n_frames, knee_min):
    t = np.linspace(0, 1, n_frames)
    s = 0.5 - 0.5 * np.cos(2 * math.pi * t)      # 0 -> 1 -> 0
    return 175.0 - (175.0 - knee_min) * s

def sequence(yaw, knee_min, n_reps, seed, noise_px=3.0, vis_drop=0.55, rep_s=2.4, pause_s=1.0):
    rng = np.random.default_rng(seed)
    frames, truth, windows = [], [], []
    t_ms = 0.0
    for r in range(n_reps):
        kmin = knee_min + rng.normal(0, 3.0)
        prof = list(np.full(int(pause_s * FPS), 175.0)) + list(rep_profile(int(rep_s * FPS), kmin))
        windows.append([t_ms + pause_s * 1000.0, t_ms + (pause_s + rep_s) * 1000.0])
        for k in prof:
            P = pose_3d(k)
            frames.append({'t': round(t_ms, 1), 'landmarks': project(P, yaw, rng, noise_px, vis_drop)})
            truth.append(true_angles(P))
            t_ms += 1000.0 / FPS
        truth[-1]['rep_end'] = True
    for _ in range(int(pause_s * FPS)):
        P = pose_3d(175.0); frames.append({'t': round(t_ms, 1), 'landmarks': project(P, yaw, rng, noise_px, vis_drop)}); truth.append(true_angles(P)); t_ms += 1000.0 / FPS
    true_mins = []
    cur = 999
    for tr in truth:
        cur = min(cur, tr['knee'])
        if tr.get('rep_end'):
            true_mins.append(cur); cur = 999
    return frames, true_mins, windows

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'data'
    os.makedirs(out, exist_ok=True)
    conds = []
    for yaw in range(0, 91, 10):
        for label, kmin in (('deep', 78.0), ('parallel', 96.0), ('shallow', 122.0)):
            for seed in range(5):
                frames, mins, wins = sequence(yaw, kmin, n_reps=5, seed=1000 * yaw + 10 * int(kmin) + seed)
                fn = f'{out}/squat_yaw{yaw:02d}_{label}_s{seed}.json'
                json.dump({'yaw': yaw, 'depth_label': label, 'seed': seed, 'true_min_knee': mins, 'rep_windows_ms': wins, 'frames': frames}, open(fn, 'w'))
                conds.append(fn)
    print('wrote', len(conds), 'sequences')
