import bpy,math,re,sys,os
from mathutils import Vector
A=sys.argv[sys.argv.index('--')+1:]; OUT=A[0]; FR=A[1] if len(A)>1 and A[1]!='all' else None
bpy.ops.wm.read_factory_settings(use_empty=True)
key=lambda n: re.sub(r'_\d+$','',n.split(':')[-1])
bpy.ops.import_scene.gltf(filepath='an_c9b573195b154835b39e8697901956d6/m.glb')
talk=bpy.data.actions[0]; talk.name='talk_src'
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
bpy.ops.import_scene.gltf(filepath='dl_14cb64770751479094e2ca07fb5e4793/m.glb')
arm=[o for o in bpy.data.objects if o.type=='ARMATURE' and o.animation_data][0]
for o in bpy.data.objects:
    if o.name=='Icosphere': o.hide_render=True
names={key(b.name):b.name for b in arm.pose.bones}
a=bpy.data.actions.new('talk')
for fc in talk.fcurves:
    m=re.match(r'pose\.bones\["(.+)"\]\.(\w+)',fc.data_path)
    if not m or m.group(2)!='rotation_quaternion' or key(m.group(1)) not in names: continue
    nf=a.fcurves.new(f'pose.bones["{names[key(m.group(1))]}"].rotation_quaternion',index=fc.array_index)
    pts=[p.co[:] for p in fc.keyframe_points]; nf.keyframe_points.add(len(pts))
    for p,c in zip(nf.keyframe_points,pts): p.co=c
    nf.modifiers.new('CYCLES')
arm.animation_data.action=a
img=bpy.data.images.load(os.path.abspath('tex/tunde_flat.png'))
for m in bpy.data.materials:
    if m.node_tree:
        for n in m.node_tree.nodes:
            if n.type=='TEX_IMAGE' and n.image and n.image.name.split('.')[0]=='Image_0': n.image=img
for o in bpy.data.objects:
    if o.type=='MESH' and o.data.materials and o.data.materials[0].name.startswith('Ch17_hair'): o.hide_render=True
for m in bpy.data.materials:
    nt=m.node_tree; N=nt.nodes; bsdf=N.get('Principled BSDF'); out=N.get('Material Output')
    if not bsdf: continue
    src=bsdf.inputs['Base Color'].links[0].from_node if bsdf.inputs['Base Color'].links else None
    if m.name.startswith('Ch17_body') and src: src.image=img
    col=src.outputs[0] if src else None
    if m.name.startswith('Ch17_hair'):
        mul=N.new('ShaderNodeMixRGB'); mul.blend_type='MULTIPLY'; mul.inputs[0].default_value=1; mul.inputs[2].default_value=(0.12,0.08,0.06,1)
        nt.links.new(col,mul.inputs[1]); col=mul.outputs[0]
    toon=N.new('ShaderNodeBsdfToon'); toon.inputs['Size'].default_value=0.55; toon.inputs['Smooth'].default_value=0.05
    em=N.new('ShaderNodeEmission'); em.inputs['Strength'].default_value=0.55
    add=N.new('ShaderNodeAddShader')
    nt.links.new(col,toon.inputs['Color']); nt.links.new(col,em.inputs['Color'])
    nt.links.new(toon.outputs[0],add.inputs[0]); nt.links.new(em.outputs[0],add.inputs[1])
    if bsdf.inputs['Alpha'].links:
        tr=N.new('ShaderNodeBsdfTransparent'); mx=N.new('ShaderNodeMixShader')
        nt.links.new(bsdf.inputs['Alpha'].links[0].from_socket,mx.inputs[0]); nt.links.new(tr.outputs[0],mx.inputs[1]); nt.links.new(add.outputs[0],mx.inputs[2])
        nt.links.new(mx.outputs[0],out.inputs['Surface'])
    else: nt.links.new(add.outputs[0],out.inputs['Surface'])
sc=bpy.context.scene; sc.render.fps=30; sc.frame_start=1; sc.frame_end=150
sc.render.engine='CYCLES'; sc.cycles.samples=10; sc.cycles.use_denoising=True
sc.render.resolution_x=1000; sc.render.resolution_y=1400; sc.render.film_transparent=True; sc.view_settings.view_transform='Standard'
sc.render.use_freestyle=True; sc.render.line_thickness_mode='ABSOLUTE'; sc.render.line_thickness=1.1
fs=sc.view_layers[0].freestyle_settings; ls=fs.linesets[0] if len(fs.linesets) else fs.linesets.new('L'); ls.linestyle=ls.linestyle or bpy.data.linestyles.new('S'); ls.linestyle.color=(0.08,0.06,0.1); ls.select_by_visibility=True; ls.select_crease=False
cam=bpy.data.cameras.new('c'); co=bpy.data.objects.new('cam',cam); sc.collection.objects.link(co); sc.camera=co
cam.type='ORTHO'; cam.ortho_scale=2.3; co.location=Vector((0,-6,0.9)); co.rotation_euler=(math.radians(90),0,0)
l=bpy.data.lights.new('k','SUN'); l.energy=3; o=bpy.data.objects.new('k',l); o.rotation_euler=(math.radians(40),0,math.radians(-35)); sc.collection.objects.link(o)
sc.world=bpy.data.worlds.new('w'); sc.world.use_nodes=True; sc.world.node_tree.nodes['Background'].inputs[1].default_value=0.0
if FR:
    for f in FR.split(','): sc.frame_set(int(f)); sc.render.filepath=f'{OUT}_{f}.png'; bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath=OUT; sc.render.image_settings.color_mode='RGBA'; bpy.ops.render.render(animation=True)
