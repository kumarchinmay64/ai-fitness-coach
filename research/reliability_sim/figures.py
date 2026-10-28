import pandas as pd, numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'axes.spines.top':False,'axes.spines.right':False})
import sys
d=pd.read_csv(sys.argv[1] if len(sys.argv)>1 else 'corr_results_reps_enriched.csv')
C={'deep':'#1f5f99','parallel':'#d08a1a','shallow':'#5a9e57'}
# Fig A: angle error and yaw estimate
fig,ax=plt.subplots(1,2,figsize=(7.2,2.7))
for lab in ['deep','parallel','shallow']:
    s=d[d.depth_label==lab].groupby('yaw').ang_err.mean()
    ax[0].plot(s.index,s.values,'o-',ms=3,color=C[lab],label=f'{lab} (true min ≈ {int(d[d.depth_label==lab].true_min_knee.mean())}°)')
ax[0].axhline(0,color='#888',lw=0.6); ax[0].set_xlabel('Camera yaw (0° = facing camera, 90° = side-on)'); ax[0].set_ylabel('Measured − true minimum\nknee angle (°)')
ax[0].legend(frameon=False,fontsize=7.5); ax[0].set_title('(a) 2D knee-angle error at the bottom of the squat',fontsize=9,loc='left')
s=d.groupby('yaw').est_yaw.agg(['mean','std'])
ax[1].errorbar(s.index,s['mean'],yerr=s['std'],fmt='o',ms=3,color='#333',capsize=2)
ax[1].plot([0,90],[0,90],'--',color='#999',lw=0.8); ax[1].set_xlabel('True camera yaw (°)'); ax[1].set_ylabel('Estimated yaw (°)')
ax[1].set_title('(b) View estimate from shoulder/hip width',fontsize=9,loc='left')
fig.tight_layout(); fig.savefig('figA_angle_error.png',dpi=220)
# Fig B: outcomes for deep squats by yaw
fig,ax=plt.subplots(1,2,figsize=(7.2,2.7),sharey=True)
for k,lab in enumerate(['deep','shallow']):
    x=d[d.depth_label==lab]; g=x.groupby('yaw')
    corr=g.correct_verdict.mean(); wrong=g.wrong_verdict.mean(); unreg=1-g.registered.mean()
    ax[k].bar(corr.index,corr,width=7,color='#5a9e57',label='correct verdict')
    ax[k].bar(wrong.index,wrong,width=7,bottom=corr,color='#c0392b',label='wrong verdict')
    ax[k].bar(unreg.index,unreg,width=7,bottom=corr+wrong,color='#bbbbbb',label='not registered')
    ax[k].set_xlabel('Camera yaw (°)'); ax[k].set_title(f'({"ab"[k]}) {lab} squats (true min ≈ {int(x.true_min_knee.mean())}°)',fontsize=9,loc='left')
ax[0].set_ylabel('Share of repetitions')
h,l=ax[0].get_legend_handles_labels(); fig.legend(h,l,frameon=False,fontsize=7.5,loc='upper center',ncol=3)
fig.tight_layout(rect=(0,0,1,0.9)); fig.savefig('figB_outcomes.png',dpi=220)
# Fig C: risk-coverage for three gating signals
N=len(d); reg=d.registered
def curve(stat, ths, ge=True):
    pts=[]
    for t in ths:
        st=reg & (stat>=t if ge else stat<=t)
        cov=st.sum()/N; risk=(st & d.wrong_verdict).sum()/max(1,st.sum())
        pts.append((cov,risk,t))
    return np.array(pts)
vis=curve(d.depth_vis.fillna(0), np.linspace(0.0,1.0,41))
mar=curve(d.depth_margin.fillna(0), np.linspace(0,12,49))
view=curve(d.depth_view_suit.fillna(0), np.linspace(0,1.0,41))
obs=curve(np.minimum(d.depth_view_suit.fillna(0), ((d.depth_vis.fillna(0)-0.5)/0.4).clip(0,1)), np.linspace(0,1,41))
fig,ax=plt.subplots(figsize=(4.4,3.9))
ax.plot(vis[:,0],vis[:,1],'-',color='#888',label='visibility only (baseline)')
ax.plot(mar[:,0],mar[:,1],'-',color='#d08a1a',label='decision margin only (baseline)')
ax.plot(obs[:,0],obs[:,1],'-',color='#1f5f99',lw=1.8,label='observability: min(visibility, view)')
# default operating point
dflt=(d.stated.sum()/N,(d.wrong_stated.sum()/max(1,d.stated.sum())))
ax.plot([reg.mean()],[d.wrong_verdict.sum()/reg.sum()],'s',color='#c0392b',ms=5,label='ungated analyzer')
ax.plot([dflt[0]],[dflt[1]],'o',color='#1f5f99',ms=5,mfc='white',label='proposed gate, default settings')
ax.set_xlabel('Coverage (repetitions given a definite depth verdict)'); ax.set_ylabel('Risk (wrong among stated verdicts)')
ax.legend(frameon=False,fontsize=7,loc='upper center',bbox_to_anchor=(0.5,-0.2),ncol=2); fig.tight_layout(); fig.savefig('figC_risk_coverage.png',dpi=220)
# print some numbers for the text
def at_cov(arr,c):
    ok=arr[arr[:,0]>=c]; return ok[:,1].min() if len(ok) else np.nan
for name,arr in [('vis',vis),('margin',mar),('view',view),('obs',obs)]:
    print(name, 'min risk with coverage>=0.30:', round(at_cov(arr,0.30),3), ' >=0.40:', round(at_cov(arr,0.40),3))
print('ungated: coverage',round(reg.mean(),3),'risk',round(d.wrong_verdict.sum()/reg.sum(),3))
print('default gate: coverage',round(dflt[0],3),'risk',round(dflt[1],3))
# wrong verdicts stated under baselines at their most permissive useful thresholds
for t in [0.7,0.9]:
    st=reg&(d.depth_vis>=t); print('vis>=',t,'cov',round(st.sum()/N,3),'risk',round((st&d.wrong_verdict).sum()/max(1,st.sum()),3))
for t in [2,4]:
    st=reg&(d.depth_margin>=t); print('margin>=',t,'cov',round(st.sum()/N,3),'risk',round((st&d.wrong_verdict).sum()/max(1,st.sum()),3))
for t in [0.7,0.9,0.95]:
    o=np.minimum(d.depth_view_suit.fillna(0), ((d.depth_vis.fillna(0)-0.5)/0.4).clip(0,1))
    st=reg&(o>=t); print('obs>=',t,'cov',round(st.sum()/N,3),'risk',round((st&d.wrong_verdict).sum()/max(1,st.sum()),3))
    st2=st&(d.depth_margin>=2); print('   obs>=',t,'& margin>=2: cov',round(st2.sum()/N,3),'risk',round((st2&d.wrong_verdict).sum()/max(1,st2.sum()),3))
