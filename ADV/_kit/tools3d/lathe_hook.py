# Haixing hook: steel shaft spinning in a lathe chuck, tool insert cutting, spark streaks. Dark studio.
import bpy, math, random, sys
from mathutils import Vector
A=sys.argv[sys.argv.index('--')+1:]; OUT=A[0]; FR=A[1] if len(A)>1 else None
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; sc.render.fps=30; sc.frame_start=1; sc.frame_end=150
H='/mnt/project-files/Motion Library/hdri/studio_small_09-2k.hdr'
def metal(n,c,r):
    m=bpy.data.materials.new(n); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*c,1); b.inputs['Metallic'].default_value=1; b.inputs['Roughness'].default_value=r
    return m
steel=metal('steel',(0.8,0.8,0.82),0.18); dark=metal('dark',(0.08,0.08,0.09),0.35)
gold=metal('insert',(0.75,0.55,0.15),0.3)
# shaft profile (radius by x), lathe-swept around X axis
prof=[(0,0.30),(0.4,0.30),(0.42,0.24),(0.9,0.24),(0.92,0.36),(1.3,0.36),(1.32,0.20),(2.2,0.20),(2.22,0.16),(2.6,0.16)]
verts=[];faces=[];S=96
for i,(x,r) in enumerate(prof):
    for k in range(S):
        a=2*math.pi*k/S; verts.append((x,r*math.cos(a),r*math.sin(a)))
for i in range(len(prof)-1):
    for k in range(S):
        a=i*S+k; b=i*S+(k+1)%S; faces.append((a,b,b+S,a+S))
me=bpy.data.meshes.new('shaft'); me.from_pydata(verts,[],faces); me.update()
shaft=bpy.data.objects.new('shaft',me); sc.collection.objects.link(shaft); me.materials.append(steel)
for p in me.polygons: p.use_smooth=True
bpy.context.view_layer.objects.active=shaft; shaft.select_set(True)
bpy.ops.object.modifier_add(type='BEVEL'); shaft.modifiers[-1].width=0.01; shaft.modifiers[-1].segments=2
# thread grooves on thin section: torus rings
for i in range(14):
    bpy.ops.mesh.primitive_torus_add(major_radius=0.2,minor_radius=0.012,location=(1.4+i*0.055,0,0),rotation=(0,math.pi/2,0))
    t=bpy.context.object; t.data.materials.append(dark); t.parent=shaft
# chuck
bpy.ops.mesh.primitive_cylinder_add(radius=0.75,depth=0.45,location=(-0.22,0,0),rotation=(0,math.pi/2,0),vertices=64)
ch=bpy.context.object; ch.data.materials.append(dark); bpy.ops.object.transform_apply(rotation=True)
for k in range(3):
    a=k*2*math.pi/3
    bpy.ops.mesh.primitive_cube_add(size=1,location=(0.06,0.42*math.cos(a),0.42*math.sin(a)))
    j=bpy.context.object; j.scale=(0.18,0.12,0.22); j.rotation_euler=(a,0,0); j.data.materials.append(steel); j.parent=ch
# spin: drive X rotation of an empty parent
sp=bpy.data.objects.new('spin',None); sc.collection.objects.link(sp); ch.parent=sp; shaft.parent=sp
d=sp.driver_add('rotation_euler',0).driver; d.expression='frame*0.9'
# tool insert
bpy.ops.mesh.primitive_cone_add(vertices=3,radius1=0.12,depth=0.06,location=(1.0,0,-0.42),rotation=(math.pi/2,0,0))
ins=bpy.context.object; ins.data.materials.append(gold)
bpy.ops.mesh.primitive_cube_add(size=1,location=(1.0,0,-0.75)); hold=bpy.context.object; hold.scale=(0.14,0.14,0.6); hold.data.materials.append(dark)
for o in (ins,hold):
    o.keyframe_insert('location',frame=1); o.location.x+=0.9; o.keyframe_insert('location',frame=150)
# sparks: emissive thin streaks flying off the contact point
em=bpy.data.materials.new('spark'); em.use_nodes=True; N=em.node_tree.nodes; N.remove(N['Principled BSDF'])
e=N.new('ShaderNodeEmission'); e.inputs[0].default_value=(1,0.55,0.15,1); e.inputs[1].default_value=40
em.node_tree.links.new(e.outputs[0],N['Material Output'].inputs[0])
random.seed(4)
for i in range(70):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.004,depth=0.12,vertices=6)
    s=bpy.context.object; s.data.materials.append(em)
    born=random.randint(1,140); life=random.randint(6,12)
    v=Vector((random.uniform(-0.3,0.6),random.uniform(-1.6,-0.4),random.uniform(-1.2,0.2))).normalized()*random.uniform(1.2,2.4)
    s.rotation_euler=v.to_track_quat('Z','Y').to_euler()
    x0=1.0+0.9*born/150
    for f,k in ((born-1,0),(born,0),(born+life,1),(born+life+1,1)):
        s.location=Vector((x0,0,-0.34))+v*k; s.scale=(1,1,0 if f in (born-1,born+life+1) else 1)
        s.keyframe_insert('location',frame=f); s.keyframe_insert('scale',frame=f)
# camera macro dolly
cam=bpy.data.cameras.new('c'); co=bpy.data.objects.new('cam',cam); sc.collection.objects.link(co); sc.camera=co
cam.lens=50; cam.dof.use_dof=True; cam.dof.aperture_fstop=2.0; cam.dof.focus_object=ins
for f,loc in ((1,(3.2,-4.2,1.2)),(150,(2.2,-3.0,0.6))):
    co.location=loc; co.keyframe_insert('location',frame=f)
tgt=bpy.data.objects.new('t',None); sc.collection.objects.link(tgt); tgt.location=(1.1,0,-0.1)
c=co.constraints.new('TRACK_TO'); c.target=tgt; c.track_axis='TRACK_NEGATIVE_Z'; c.up_axis='UP_Y'
# lights: dark studio, red + blue brand rims
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; nt=w.node_tree
env=nt.nodes.new('ShaderNodeTexEnvironment'); env.image=bpy.data.images.load(H)
bg=nt.nodes['Background']; nt.links.new(env.outputs[0],bg.inputs[0]); bg.inputs[1].default_value=0.6
blk=nt.nodes.new('ShaderNodeBackground'); blk.inputs[0].default_value=(0.004,0.005,0.012,1)
lp=nt.nodes.new('ShaderNodeLightPath'); mx=nt.nodes.new('ShaderNodeMixShader')
nt.links.new(lp.outputs['Is Camera Ray'],mx.inputs[0]); nt.links.new(bg.outputs[0],mx.inputs[1]); nt.links.new(blk.outputs[0],mx.inputs[2])
nt.links.new(mx.outputs[0],nt.nodes['World Output'].inputs[0])
for col,loc,en in (((1,0.1,0.1),(-1,2,1.5),900),((0.15,0.3,1),(3,2,-1),900),((1,0.95,0.9),(1,-2,3),400)):
    l=bpy.data.lights.new('a','AREA'); l.color=col; l.energy=en; l.size=1.5
    o=bpy.data.objects.new('a',l); o.location=loc; sc.collection.objects.link(o)
    cc=o.constraints.new('TRACK_TO'); cc.target=tgt; cc.track_axis='TRACK_NEGATIVE_Z'; cc.up_axis='UP_Y'
sc.render.engine='CYCLES'; sc.cycles.samples=14; sc.cycles.use_denoising=True
sc.render.resolution_x=1920; sc.render.resolution_y=1080; sc.render.resolution_percentage=int(A[2]) if len(A)>2 else 100
sc.render.use_motion_blur=True; sc.render.motion_blur_shutter=0.6
sc.view_settings.view_transform='AgX'; sc.view_settings.look='AgX - Punchy'
if FR:
    for f in FR.split(','): sc.frame_set(int(f)); sc.render.filepath=f'{OUT}_{f}.png'; bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath=OUT; bpy.ops.render.render(animation=True)
