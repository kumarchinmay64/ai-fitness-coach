import pandas as pd, numpy as np
import sys
d=pd.read_csv(sys.argv[1] if len(sys.argv)>1 else 'results_reps.csv')
d['registered']=d.record_type.isin(['rep','incomplete','rejected'])
# analyzer depth verdict exists only for registered attempts
d['an_verdict']=np.where(d.registered, d.analyzer_depth, np.nan)
# "silent miss": deep or shallow rep performed but analyzer registered nothing
d['wrong_verdict']=d.registered & (d.analyzer_depth!=d.true_deep)
d['correct_verdict']=d.registered & (d.analyzer_depth==d.true_deep)
d['stated']=d.registered & (d.depth_action=='state')
d['wrong_stated']=d.stated & (d.analyzer_depth!=d.true_deep)
d['ang_err']=d.measured_min_knee-d.true_min_knee
g=d.groupby(['yaw','depth_label'])
t=g.agg(n=('rep','size'), registered=('registered','mean'), counted=('analyzer_counted','mean'),
        wrong=('wrong_verdict','mean'), correct=('correct_verdict','mean'), ang_err=('ang_err','mean'),
        est_yaw=('est_yaw','mean'), stated=('stated','mean'), wrong_stated=('wrong_stated','mean'),
        high=('depth_level',lambda s:(s=='HIGH').mean()), low=('depth_level',lambda s:(s=='LOW').mean()),
        uncounted_flag=('uncounted_flag','mean'))
pd.set_option('display.width',200); print(t.round(2).to_string())
# overall
print('\nOVERALL (all yaw, all depths)')
n=len(d)
print('analyzer definite verdict (coverage):', d.registered.mean().round(3), ' wrong among all reps:', d.wrong_verdict.mean().round(3), ' wrong | verdict:', (d.wrong_verdict.sum()/d.registered.sum()).round(3))
print('gated stated (coverage):', d.stated.mean().round(3), ' wrong stated among all:', d.wrong_stated.mean().round(3), ' wrong | stated:', (d.wrong_stated.sum()/max(1,d.stated.sum())).round(3))
print('unregistered reps:', (~d.registered).sum(), ' of which flagged as possible uncounted:', ((~d.registered)&(d.uncounted_flag==1)).sum())
pre=(sys.argv[2] if len(sys.argv)>2 else '')
t.to_csv(pre+'summary_by_condition.csv')
d.to_csv(pre+'results_reps_enriched.csv',index=False)
