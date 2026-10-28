"""Effect of computing joint angles in normalised MediaPipe coordinates (x / width, y / height)
instead of pixel-proportional coordinates, at the bottom of simulated squats."""
import json, glob, math, sys
import numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'axes.spines.top':False,'axes.spines.right':False})
A = 1280/720
def ang(a,b,c,s=1.0):
    v1=np.array([(a['x']-b['x'])*s, a['y']-b['y']]); v2=np.array([(c['x']-b['x'])*s, c['y']-b['y']])
    return math.degrees(math.acos(np.clip(v1@v2/np.linalg.norm(v1)/np.linalg.norm(v2),-1,1)))
res={}
for f in sorted(glob.glob('data/squat_yaw*_s0.json')):
    d=json.load(open(f)); yaw=d['yaw']; lab=d['depth_label']
    # bottom of the first repetition: frame with the smallest pixel-space knee angle in the first rep window
    s,e=d['rep_windows_ms'][0]
    fr=[x for x in d['frames'] if s<=x['t']<=e]
    lm=lambda x: x['landmarks']
    best=min(fr,key=lambda x: ang(lm(x)[23],lm(x)[25],lm(x)[27],A))
    L=lm(best)
    res.setdefault(lab,[]).append((yaw, d['true_min_knee'][0], ang(L[23],L[25],L[27],A), ang(L[23],L[25],L[27],1.0)))
fig,ax=plt.subplots(figsize=(4.4,2.8))
C={'deep':'#1f5f99','parallel':'#d08a1a','shallow':'#5a9e57'}
for lab,v in res.items():
    v=np.array(v); ax.plot(v[:,0],v[:,3],'o-',ms=3,color=C[lab],label=f'{lab}: normalised coordinates')
    ax.plot(v[:,0],v[:,2],'s--',ms=3,color=C[lab],alpha=0.6,label=f'{lab}: pixel-proportional')
ax.axhline(100,color='#c0392b',lw=0.8,ls=':'); ax.text(1,102,'depth threshold 100°',color='#c0392b',fontsize=7)
ax.set_xlabel('Camera yaw (°)'); ax.set_ylabel('Measured knee angle at bottom (°)'); ax.legend(frameon=False,fontsize=6.3,ncol=1,loc='upper right')
fig.tight_layout(); fig.savefig('figD_aspect.png',dpi=220)
for lab,v in res.items():
    for y,t,p,n in v:
        if y in (60,70,80,90): print(lab,y,'true',round(t,1),'pixel',round(p,1),'normalised',round(n,1))
