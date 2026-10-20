import bpy,math,re,sys
from mathutils import Vector
A=sys.argv[sys.argv.index('--')+1:]; SRC,OUT=A[0],A[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
key=lambda n: re.sub(r'_\d+$','',n.split(':')[-1]).replace('mixamorig','')
bpy.ops.import_scene.gltf(filepath=SRC)
sa=bpy.data.actions[0]; L=sa.frame_range[1]
sarm=[o for o in bpy.data.objects if o.type=='ARMATURE'][0]; sb=[b.name for b in sarm.data.bones][:6]
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
bpy.ops.import_scene.gltf(filepath='dl_14cb64770751479094e2ca07fb5e4793/m.glb')
arm=[o for o in bpy.data.objects if o.type=='ARMATURE' and o.animation_data][0]
for o in bpy.data.objects:
    if o.name=='Icosphere': o.hide_render=True
names={key(b.name):b.name for b in arm.pose.bones}
a=bpy.data.actions.new('x'); n=0
for fc in sa.fcurves:
    m=re.match(r'pose\.bones\["(.+)"\]\.(\w+)',fc.data_path)
    if not m or m.group(2)!='rotation_quaternion': continue
    k=key(m.group(1))
    if k not in names: continue
    n+=1
    nf=a.fcurves.new(f'pose.bones["{names[k]}"].rotation_quaternion',index=fc.array_index)
    pts=[p.co[:] for p in fc.keyframe_points]; nf.keyframe_points.add(len(pts))
    for p,c in zip(nf.keyframe_points,pts): p.co=c
print('MAPPED',n,sb)
arm.animation_data.action=a
sc=bpy.context.scene; sc.render.engine='CYCLES'; sc.cycles.samples=6; sc.cycles.use_denoising=True
sc.render.resolution_x=300; sc.render.resolution_y=420; sc.render.film_transparent=True; sc.view_settings.view_transform='Standard'
cam=bpy.data.cameras.new('c'); co=bpy.data.objects.new('cam',cam); sc.collection.objects.link(co); sc.camera=co
cam.lens=50; co.location=Vector((0.6,-4.2,1.0)); co.rotation_euler=(Vector((0,0,0.92))-co.location).to_track_quat('-Z','Y').to_euler()
l=bpy.data.lights.new('k','SUN'); l.energy=3.5; o=bpy.data.objects.new('k',l); o.rotation_euler=(0.6,0,-0.5); sc.collection.objects.link(o)
sc.world=bpy.data.worlds.new('w'); sc.world.use_nodes=True; sc.world.node_tree.nodes['Background'].inputs[1].default_value=0.8
for i in range(6):
    sc.frame_set(int(1+i*(L-2)/5)); sc.render.filepath=f'{OUT}_{i}.png'; bpy.ops.render.render(write_still=True)
