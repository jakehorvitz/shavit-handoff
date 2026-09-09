#!/usr/bin/env python3
"""Re-cut REEL 1 / REEL 2 in Palmier from new base renders + bed, then export.
usage: recut.py <reel1-base.mp4> <reel2-base.mp4> <bed.m4a> <version-tag>"""
import json, subprocess, sys, time, os
S='/Users/jakehorvitz/projects/shavit-pipeline/docs/reel-specs/_scripts/pmcp.py'
D=os.path.dirname(os.path.abspath(__file__))
def call(tool,args,to=600):
    out=subprocess.run(['python3',S,'call',tool,json.dumps(args)],capture_output=True,text=True,timeout=to).stdout
    try: return json.loads(out)
    except Exception: return {"raw":out[:400]}
r1,r2,bed,tag=sys.argv[1:5]
print('open', call('manage_project',{"action":"open","path":"/Users/jakehorvitz/Documents/Palmier Pro/Shavit Website Edit - The Turn (previs).palmier"}).get('status'))
ids=json.load(open(f'{D}/palmier-reel-timelines.json'))
m1=call('import_media',{"source":{"path":os.path.abspath(r1)},"name":f"REEL 1 base {tag}","folder":"Reels"})
m2=call('import_media',{"source":{"path":os.path.abspath(r2)},"name":f"REEL 2 base {tag}","folder":"Reels"})
mb=call('import_media',{"source":{"path":os.path.abspath(bed)},"name":f"bed {tag} "+os.path.basename(bed),"folder":"Reels"})
print('imported',m1.get('mediaRef'),m2.get('mediaRef'),mb.get('mediaRef'))
outs={}
for (name,tid),ref,fn in zip(ids.items(),[m1['mediaRef'],m2['mediaRef']],[f"REEL-1-the-website-{tag}.mp4",f"REEL-2-kendall-street-{tag}.mp4"]):
    call('set_active_timeline',{"timelineId":tid})
    tl=call('get_timeline',{})
    clip_ids=[c['id'] for t in tl.get('tracks',[]) for c in t.get('clips',[])]
    if clip_ids: print(name,'removing',len(clip_ids),'clips', call('remove_clips',{"clipIds":clip_ids}).get('type') or 'ok')
    v=call('add_clips',{"entries":[{"mediaRef":ref,"startFrame":0}]}); a=call('add_clips',{"entries":[{"mediaRef":mb['mediaRef'],"startFrame":0}]})
    print(name,'video',[c.get('frames') for c in v.get('clips',[])],'audio',[c.get('frames') for c in a.get('clips',[])], a.get('raw',''))
    out=f"{D}/exports/{fn}"
    e=call('export_project',{"mode":"video","timelineId":tid,"outputPath":out,"resolution":"Match Timeline","codec":"H.264","overwrite":True})
    print(name,'export job',e.get('jobId'),e.get('durationSeconds'))
    outs[name]=out
for i in range(90):
    time.sleep(8)
    st=call('manage_exports',{"action":"list"}); ex=st.get('exports') or []
    mine=[e for e in ex if any(os.path.basename(o)==e.get('filename') for o in outs.values())]
    states=[(e.get('filename'),e.get('status'),e.get('progress')) for e in mine[:2]]
    if all(s[1]=='completed' for s in states) and len(states)==2: print('exports completed',states); break
    if any((s[1] or '')=='failed' for s in states): print('EXPORT FAILED',states); sys.exit(2)
for o in outs.values(): print(o, os.path.getsize(o) if os.path.exists(o) else 'MISSING')
