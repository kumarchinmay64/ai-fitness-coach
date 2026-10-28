"""Figure: geometric 2D knee-angle error at the bottom of each simulated repetition by camera yaw
(pixel-proportional coordinates), and the yaw estimate of the reliability layer."""
import json, glob, math
import numpy as np, pandas as pd, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'axes.spines.top':False,'axes.spines.right':False})
A=1280/720
def ang(a,b,c,s=A):
    v1=np.array([(a['x']-b['x'])*s, a['y']-b['y']]); v2=np.array([(c['x']-b['x'])*s, c['y']-b['y']])
    return math.degrees(math.acos(np.clip(v1@v2/np.linalg.norm(v1)/np.linalg.norm(v2),-1,1)))
rows=[]
for f in sorted(glob.glob('data/*.json')):
    d=json.load(open(f))
    for i,(s,e) in enumerate(d['rep_windows_ms']):
        fr=[x['landmarks'] for x in d['frames'] if s<=x['t']<=e]
        # near-side leg (left), as the analyser selects the more visible side
        m=min(ang(L[23],L[25],L[27]) for L in fr)
        rows.append((d['yaw'],d['depth_label'],d['true_min_knee'][i],m))
g=pd.DataFrame(rows,columns=['yaw','lab','true','meas']); g['err']=g.meas-g.true
e=pd.read_csv('corr_results_reps_enriched.csv')
C={'deep':'#1f5f99','parallel':'#d08a1a','shallow':'#5a9e57'}
fig,ax=plt.subplots(1,2,figsize=(7.2,2.7))
for lab in ['deep','parallel','shallow']:
    s=g[g.lab==lab].groupby('yaw').err.mean()
    ax[0].plot(s.index,s.values,'o-',ms=3,color=C[lab],label=f'{lab} (true min ≈ {int(g[g.lab==lab].true.mean())}°)')
ax[0].axhline(0,color='#888',lw=0.6); ax[0].set_xlabel('Camera yaw (0° = facing camera, 90° = side-on)'); ax[0].set_ylabel('Measured − true minimum\nknee angle (°)')
ax[0].legend(frameon=False,fontsize=7.5); ax[0].set_title('(a) 2D knee-angle error at the bottom of the squat',fontsize=9,loc='left')
s=e.groupby('yaw').est_yaw.agg(['mean','std'])
ax[1].errorbar(s.index,s['mean'],yerr=s['std'],fmt='o',ms=3,color='#333',capsize=2)
ax[1].plot([0,90],[0,90],'--',color='#999',lw=0.8); ax[1].set_xlabel('True camera yaw (°)'); ax[1].set_ylabel('Estimated yaw (°)')
ax[1].set_title('(b) View estimate from shoulder/hip width',fontsize=9,loc='left')
fig.tight_layout(); fig.savefig('figA_angle_error.png',dpi=220)
print(g[g.lab=='deep'].groupby('yaw').err.mean().round(1).to_dict())
