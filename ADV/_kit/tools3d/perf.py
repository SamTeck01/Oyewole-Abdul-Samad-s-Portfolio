# Directed Tunde performance: talk/walk mocap base + timed world-axis gesture layers, toon render.
import bpy,math,re,sys,os,json
from mathutils import Vector, Matrix, Quaternion
A=sys.argv[sys.argv.index('--')+1:]; CFG=json.load(open(A[0])); OUT=A[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
key=lambda n: re.sub(r'_\d+$','',n.split(':')[-1])
src={}
for nm,fp in (('talk','an_c9b573195b154835b39e8697901956d6/m.glb'),('walk','dl_9075b0deb11b40bca7f5ce8a8e7b63cb/m.glb')):
    bpy.ops.import_scene.gltf(filepath=fp)
    acts=[a for a in bpy.data.actions if a.name not in [x.name for x in src.values()]]
    src[nm]=[a for a in acts if 'Walk' in a.name][0] if nm=='walk' else acts[0]
    for o in list(bpy.data.objects): bpy.data.objects.remove(o)
bpy.ops.import_scene.gltf(filepath='dl_14cb64770751479094e2ca07fb5e4793/m.glb')
arm=[o for o in bpy.data.objects if o.type=='ARMATURE' and o.animation_data][0]
for o in bpy.data.objects:
    if o.name=='Icosphere': o.hide_render=True
    if o.type=='MESH' and o.data.materials and o.data.materials[0].name.startswith('Ch17_hair') and not CFG.get('real'): o.hide_render=True
names={key(b.name):b.name for b in arm.pose.bones}
piv=bpy.data.objects.new('piv',None); bpy.context.scene.collection.objects.link(piv)
for o in [o for o in bpy.data.objects if o.parent is None and o is not piv]: o.parent=piv
for b in arm.pose.bones: b.rotation_mode='QUATERNION'
def sample(act):  # {bone:[quat per source frame]}
    d={}; L=int(act.frame_range[1])
    for fc in act.fcurves:
        m=re.match(r'pose\.bones\["(.+)"\]\.rotation_quaternion',fc.data_path)
        if not m or key(m.group(1)) not in names: continue
        b=names[key(m.group(1))]; d.setdefault(b,[[1,0,0,0] for _ in range(L)])
        for i in range(L): d[b][i][fc.array_index]=fc.evaluate(i+1)
    return d,L
T,TL=sample(src['talk']); W,WL=sample(src['walk'])
arm.animation_data.action=None
def sm(x): x=max(0,min(1,x)); return x*x*(3-2*x)
def env(t,a,b,r): return min(sm((t-a)/r),sm((b-t)/r))
FPS=30; N=CFG['frames']
order=sorted(arm.pose.bones,key=lambda b: len(b.parent_recursive))
aw=arm.matrix_world.to_3x3()
img=bpy.data.images.load(os.path.abspath(CFG.get('tex','tex/tunde_flat.png')))
REAL=CFG.get('real')
for m in bpy.data.materials:
    nt=m.node_tree
    if not nt: continue
    for n in nt.nodes:
        if n.type=='TEX_IMAGE' and n.image and n.image.name.split('.')[0]=='Image_0': n.image=img
    if REAL: continue
    N_=nt.nodes; bsdf=N_.get('Principled BSDF'); out=N_.get('Material Output')
    if not bsdf or not bsdf.inputs['Base Color'].links: continue
    col=bsdf.inputs['Base Color'].links[0].from_node.outputs[0]
    toon=N_.new('ShaderNodeBsdfToon'); toon.inputs['Size'].default_value=0.55; toon.inputs['Smooth'].default_value=0.05
    em=N_.new('ShaderNodeEmission'); em.inputs['Strength'].default_value=0.55; add=N_.new('ShaderNodeAddShader')
    nt.links.new(col,toon.inputs['Color']); nt.links.new(col,em.inputs['Color'])
    nt.links.new(toon.outputs[0],add.inputs[0]); nt.links.new(em.outputs[0],add.inputs[1]); nt.links.new(add.outputs[0],out.inputs['Surface'])
sc=bpy.context.scene
sc.render.engine='CYCLES'; sc.cycles.samples=CFG.get('samples',8); sc.cycles.use_denoising=True
sc.render.resolution_x=CFG.get('w',800); sc.render.resolution_y=CFG.get('h',1120); sc.render.film_transparent=True; sc.view_settings.view_transform='Standard'
sc.render.use_freestyle=not CFG.get('real'); sc.render.line_thickness_mode='ABSOLUTE'; sc.render.line_thickness=CFG.get('line',0.9)
fs=sc.view_layers[0].freestyle_settings; ls=fs.linesets[0] if len(fs.linesets) else fs.linesets.new('L'); ls.linestyle=ls.linestyle or bpy.data.linestyles.new('S'); ls.linestyle.color=(0.08,0.06,0.1)
cam=bpy.data.cameras.new('c'); co=bpy.data.objects.new('cam',cam); sc.collection.objects.link(co); sc.camera=co
cam.type='ORTHO'; cam.ortho_scale=2.3; co.location=Vector((0,-6,0.9)); co.rotation_euler=(math.radians(90),0,0)
l=bpy.data.lights.new('k','SUN'); l.energy=3.5 if CFG.get('real') else 3; o=bpy.data.objects.new('k',l); o.rotation_euler=(math.radians(40),0,math.radians(-35)); sc.collection.objects.link(o)
sc.world=bpy.data.worlds.new('w'); sc.world.use_nodes=True; sc.world.node_tree.nodes['Background'].inputs[1].default_value=0.8 if CFG.get('real') else 0
if CFG.get('real'): sc.world.node_tree.nodes['Background'].inputs[0].default_value=(1,0.88,0.75,1)
sc.render.image_settings.color_mode='RGBA'
G=CFG['gest']  # [bone, axis, deg, start_s, end_s, ramp_s, wiggle_hz?]
WK=CFG.get('walk',[])  # [start,end]
only=CFG.get('only')
for f in range(1,N+1):
    if only and f not in only: continue
    if not CFG.get('measure') and os.path.exists(f'{OUT}{f:04d}.png'): continue
    t=(f-1)/FPS
    ww=max([env(t,a,b,0.35) for a,b in WK]+[0])
    ti=int(t*FPS)%(TL-1); wi=int(t*24)%(WL-1)
    for pb in arm.pose.bones:
        q=Quaternion(T[pb.name][ti]) if pb.name in T else Quaternion()
        if ww>0 and pb.name in W: q=q.slerp(Quaternion(W[pb.name][wi]),ww)
        pb.rotation_quaternion=q
    piv.rotation_euler[2]=math.radians(CFG.get('turn',80))*max([env(t,a-0.2,b+0.2,0.45) for a,b in WK]+[0])
    bpy.context.view_layer.update()
    for g in G:
        bn,ax,deg,a,b,r=g[:6]; hz=g[6] if len(g)>6 else 0; loc=len(g)>7 and g[7]
        w=env(t,a,b,r)
        if w<=0: continue
        d=deg*w*(math.sin(t*hz*2*math.pi) if hz else 1)
        pb=arm.pose.bones[names[bn]]
        M=pb.matrix.copy(); tr=M.to_translation()
        R=aw.inverted().to_4x4()@Matrix.Rotation(math.radians(d),4,Vector(ax))@aw.to_4x4()
        Nm=M@Matrix.Rotation(math.radians(d),4,Vector(ax)) if loc else R@M; Nm.translation=tr; pb.matrix=Nm
        bpy.context.view_layer.update()
    if CFG.get('measure'):
        from bpy_extras.object_utils import world_to_camera_view as w2c
        ps=[w2c(sc,co,arm.matrix_world@arm.pose.bones[names[k]].head) for k in ('LeftToeBase','RightToeBase')]
        print('MS',f,round(ps[0].x*sc.render.resolution_x,1),round(ps[0].y,3),round(ps[1].x*sc.render.resolution_x,1),round(ps[1].y,3)); continue
    sc.render.filepath=f'{OUT}{f:04d}.png'; bpy.ops.render.render(write_still=True)
