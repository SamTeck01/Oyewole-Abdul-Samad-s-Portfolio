# Builds the Tunde performance timeline for Safety3D (t in video seconds). Usage: gen_safety.py out.json [w h samples only...]
import json,sys
G=[];X=[1,0,0];Y=[0,1,0];Z=[0,0,1];FING=['Index','Middle','Ring','Pinky']
def g(b,ax,d,a,e,r=0.3,hz=0,loc=False): G.append([b,ax,d,a,e,r,hz,loc] if (hz or loc) else [b,ax,d,a,e,r])
def curl(side,fs,a,e,d=75,r=0.2):
    for f in fs:
        for i in (1,2,3): g(f'{side}Hand{f}{i}',X,d,a,e,r,0,True)
def point(side,a,e): curl(side,['Middle','Ring','Pinky'],a,e); curl(side,['Thumb'],a,e,40)
def fist(side,a,e): curl(side,FING,a,e); curl(side,['Thumb'],a,e,40)
def wave(a,e):
    g('RightArm',Y,72,a,e,0.4); g('RightForeArm',Y,95,a,e,0.4); g('RightForeArm',Y,22,a+0.3,e-0.3,0.25,2.2); g('Head',Y,6,a,e,0.4)
def present(a,e,x=-25):
    g('LeftArm',Y,-38,a,e,0.4); g('LeftArm',X,x,a,e,0.4); g('LeftForeArm',X,-55,a,e,0.4); g('LeftHand',Y,-20,a,e,0.4)
def ptR(a,e,head=True):  # point screen-right with index
    g('LeftArm',Y,-80,a,e,0.35); g('LeftForeArm',Y,-8,a,e,0.35); point('Left',a,e)
    if head: g('Head',Z,-18,a,e,0.35)
def handup(side,a,e):
    s=1 if side=='Left' else 1
    g(side+'Arm',X,-40,a,e,0.35); g(side+'ForeArm',X,-105,a,e,0.35)
wave(1.9,3.5)
g('LeftArm',X,-30,5.3,8.2,0.4); g('LeftForeArm',X,-85,5.3,8.2,0.4)
for (a,e,d) in ((5.5,6.2,-12),(6.5,7.2,-32),(7.5,8.2,-52)): g('LeftArm',Y,d,a,e,0.2)
for s,sg in (('Left',-1),('Right',1)): g(s+'Arm',Y,25*sg,8.8,10.6,0.35); g(s+'ForeArm',X,-75,8.8,10.6,0.35)
g('Head',Y,8,8.9,10.5,0.35)
present(10.9,13.7)
handup('Left',13.9,17.0); curl('Left',['Index'],13.9,14.3); curl('Left',['Middle'],13.9,15.3); curl('Left',['Ring'],13.9,16.3); curl('Left',['Pinky'],13.9,17.0); curl('Left',['Thumb'],13.9,17.0,40)
for a in (14.2,15.2,16.2): g('LeftForeArm',X,14,a,a+0.4,0.15)
g('LeftArm',Y,-45,17.3,18.9,0.35); g('LeftArm',X,-20,17.3,18.9,0.35); g('LeftForeArm',X,-40,17.3,18.9,0.35); g('LeftArm',Y,15,17.5,18.7,0.25,1.4)
g('LeftArm',Y,-125,19.3,20.4,0.3); g('LeftForeArm',Y,-130,19.3,20.4,0.3); point('Left',19.3,20.4)
ptR(20.4,21.5)
g('LeftArm',Y,-145,22.1,23.1,0.3); g('LeftForeArm',Y,-120,22.1,23.1,0.3); g('LeftForeArm',Y,8,22.3,22.9,0.15,3)
for s,sg in (('Left',-1),('Right',1)): g(s+'Arm',X,-15,23.2,24.5,0.3); g(s+'ForeArm',X,-110,23.2,24.5,0.3); fist(s,23.2,24.5)
handup('Right',24.7,26.3); fist('Right',24.7,26.3); curl('Right',['Thumb'],24.7,26.3,-40); g('Head',X,8,24.8,26.2,0.2,2)
g('RightArm',X,-35,26.5,28.1,0.3); g('RightArm',Y,10,26.5,28.1,0.3); g('RightForeArm',X,-70,26.5,28.1,0.3); g('RightForeArm',X,25,26.7,27.9,0.2,2.5); fist('Right',26.5,28.1)
for s in ('Left','Right'): g(s+'Arm',X,-30,28.2,30.0,0.35); g(s+'ForeArm',X,-50,28.2,30.0,0.35); g(s+'ForeArm',X,10,28.4,29.8,0.2,1.3)
for s,sg in (('Left',-1),('Right',1)): g(s+'Arm',Y,45*sg,34.1,35.3,0.35); g(s+'ForeArm',X,-30,34.1,35.3,0.35)
g('Spine',X,-18,35.3,36.9,0.35); g('Spine1',X,-10,35.3,36.9,0.35); g('LeftArm',X,-55,35.3,36.9,0.35); g('LeftArm',Y,-25,35.3,36.9,0.35); g('LeftArm',Y,20,35.6,36.7,0.2,1.4)
g('LeftArm',Y,-70,37.0,37.8,0.25); g('LeftArm',X,-15,37.0,37.8,0.25); g('LeftForeArm',Y,-10,37.0,37.8,0.25); g('Head',Z,-18,37.0,37.9,0.25)
handup('Left',37.9,39.1); point('Left',37.9,39.1); g('LeftForeArm',Y,15,38.1,38.9,0.15,3); g('Head',Z,10,38.1,39.0,0.2,2)
for s in ('Left','Right'): g(s+'Arm',X,-45,39.2,40.1,0.3); g(s+'ForeArm',X,-45,39.2,40.1,0.3)
g('LeftArm',Y,-140,40.0,41.2,0.35); g('LeftForeArm',Y,-15,40.0,41.2,0.35)
ptR(44.6,45.9)
g('Head',Z,55,46.1,47.0,0.3); g('Neck',Z,15,46.1,47.0,0.3); g('Head',Z,-55,47.0,47.9,0.3); g('Neck',Z,-15,47.0,47.9,0.3)
handup('Left',48.6,50.7); point('Left',48.6,49.25); curl('Left',['Ring','Pinky'],49.2,50.7); curl('Left',['Thumb'],49.2,50.7,40)
present(51.0,52.6,-25); present(52.7,54.1,-12); present(54.2,56.7,0)
wave(57.6,61.0)
W=[[-1,1.7],[30.5,33.72],[41.3,44.52]]
A=sys.argv[1:]; cfg={"frames":1830,"gest":G,"walk":W,"w":720,"h":1008,"samples":5,"real":True,"tex":"tex/tunde_body.png","only":list(range(1,1830,2))}
if len(A)>1: cfg.update(w=int(A[1]),h=int(A[2]),samples=int(A[3]),only=[int(x) for x in A[4:]])
json.dump(cfg,open(A[0],'w'))
