# Tumbling watch PNG sequence (transparent). blender -b -P watch_tumble.py -- face.png outdir nframes
import bpy, math, sys
a = sys.argv[sys.argv.index('--') + 1:]; FACE, OUT, N = a[0], a[1], int(a[2])
L = "/mnt/project-files/Motion Library"
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 12; sc.cycles.use_denoising = True
sc.render.resolution_x = 660; sc.render.resolution_y = 880; sc.render.film_transparent = True
sc.render.image_settings.color_mode = 'RGBA'; sc.frame_start = 1; sc.frame_end = N; sc.render.fps = 30
w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True; nt = w.node_tree
env = nt.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(f"{L}/hdri/studio_small_09-2k.hdr")
nt.links.new(env.outputs[0], nt.nodes["Background"].inputs[0]); nt.nodes["Background"].inputs[1].default_value = 1.0
before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f"{L}/3d/watch.glb")
new = [o for o in bpy.data.objects if o not in before]
root = bpy.data.objects.new("root", None); sc.collection.objects.link(root)
for o in new:
    if o.parent is None: o.parent = root
img = bpy.data.images.load(FACE)
for o in new:
    if o.type == 'MESH' and any(m and m.name.startswith('Screen') for m in o.data.materials):
        me = o.data; xs = [v.co.x for v in me.vertices]; ys = [v.co.y for v in me.vertices]; zs = [v.co.z for v in me.vertices]
        # pick the two axes with the largest extent as the screen plane
        ext = sorted([(max(c) - min(c), i, c) for i, c in enumerate([xs, ys, zs])], reverse=True)
        (_, ia, ca), (_, ib, cb) = ext[0], ext[1]
        if ia > ib: (ia, ca), (ib, cb) = (ib, cb), (ia, ca)
        uv = me.uv_layers.active or me.uv_layers.new()
        for poly in me.polygons:
            for li in poly.loop_indices:
                co = me.vertices[me.loops[li].vertex_index].co
                uv.data[li].uv = ((co[ia] - min(ca)) / (max(ca) - min(ca)), (co[ib] - min(cb)) / (max(cb) - min(cb)))
for m in bpy.data.materials:
    if m.name.startswith("Screen"):
        t = m.node_tree; tex = t.nodes.new("ShaderNodeTexImage"); tex.image = img
        b = t.nodes["Principled BSDF"]; t.links.new(tex.outputs[0], b.inputs["Emission Color"]); t.links.new(tex.outputs[0], b.inputs["Base Color"])
        b.inputs["Emission Strength"].default_value = 1.2
root.scale = (3.2, 3.2, 3.2)
# keyframes: tumble in from tilted/spun to face camera with a soft overshoot
keys = [(1, (-35, 0, 160), (0, 0, -0.18)), (int(N * 0.6), (88, 0, -6), (0, 0, 0.005)), (N, (90, 0, 0), (0, 0, 0))]
for f, r, loc in keys:
    root.rotation_euler = [math.radians(x) for x in r]; root.location = loc
    root.keyframe_insert("rotation_euler", frame=f); root.keyframe_insert("location", frame=f)
for fc in root.animation_data.action.fcurves:
    for k in fc.keyframe_points: k.interpolation = 'BEZIER'; k.easing = 'AUTO'
cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (0, -0.75, 0); cam.rotation_euler = (math.radians(90), 0, 0); cam.data.lens = 60
sc.render.filepath = OUT.rstrip('/') + '/w_'
import os
if os.environ.get("ONE"):
    sc.frame_set(int(os.environ["ONE"])); sc.render.filepath=OUT+"/test.png"; bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
