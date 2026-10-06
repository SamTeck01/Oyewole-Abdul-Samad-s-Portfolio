# Procedural stylised fasteners -> turntable PNG sequences with alpha.
# blender -b -P build.py -- <outdir> [frames] [size] [only_id]
import bpy, bmesh, math, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
OUT = argv[0]
FRAMES = int(argv[1]) if len(argv) > 1 else 48
SIZE = int(argv[2]) if len(argv) > 2 else 640
ONLY = argv[3] if len(argv) > 3 else None

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.samples = 24
    s.cycles.use_denoising = True
    s.render.film_transparent = True
    s.render.resolution_x = s.render.resolution_y = SIZE
    s.render.image_settings.color_mode = "RGBA"
    s.frame_start, s.frame_end = 1, FRAMES
    s.view_settings.view_transform = "AgX"; s.view_settings.exposure = -0.3
    w = bpy.data.worlds.new("w"); s.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.93, 0.96, 0.99, 1); bg.inputs[1].default_value = 0.5
    return s

def mat(name, base, rough=0.32, metal=0.0, trans=0.0, coat=0.6):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*base, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["Transmission Weight"].default_value = trans
    p.inputs["Coat Weight"].default_value = coat
    return m

def finish_mats():
    return {
        "frost": mat("frost", (0.50, 0.70, 0.92), 0.3, 0.0, 0.25),
        "accent": mat("accent", (0.12, 0.40, 0.85), 0.3),
    }

def cyl(r, d, verts=48, loc=(0, 0, 0), rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=d, location=loc, rotation=rot)
    o = bpy.context.object; bevel(o, min(r, d) * 0.08); return o

def hexp(r, d, loc=(0, 0, 0), rot=(0, 0, 0)):
    return cyl(r, d, 6, loc, rot)

def bevel(o, w):
    m = o.modifiers.new("b", "BEVEL"); m.width = w; m.segments = 3; m.limit_method = "ANGLE"
    o.modifiers.new("n", "WEIGHTED_NORMAL"); bpy.ops.object.shade_smooth()

def torus(R, r, loc=(0, 0, 0), rot=(0, 0, 0), maj=64, mn=16):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=maj, minor_segments=mn)
    o = bpy.context.object; bpy.ops.object.shade_smooth(); return o

def thread(r, length, z0=0.0, pitch=None, axis="Z", off=(0, 0, 0)):
    """Real helical thread: screw modifier on a triangle profile + core."""
    pitch = pitch or r * 0.35
    core = cyl(r * 0.86, length, 40)
    me = bpy.data.meshes.new("tp"); bm = bmesh.new()
    a = bm.verts.new((r * 0.84, 0, -pitch * 0.45)); b = bm.verts.new((r, 0, 0)); c = bm.verts.new((r * 0.84, 0, pitch * 0.45))
    bm.edges.new((a, b)); bm.edges.new((b, c)); bm.to_mesh(me)
    t = bpy.data.objects.new("thr", me); bpy.context.collection.objects.link(t)
    s = t.modifiers.new("s", "SCREW"); s.screw_offset = pitch; s.iterations = max(1, int(length / pitch)); s.steps = 32; s.render_steps = 32
    t.location = (0, 0, -length / 2 + pitch / 2)
    bpy.context.view_layer.objects.active = t; t.select_set(True); bpy.ops.object.shade_smooth()
    grp = [core, t]
    for o in grp:
        o.location = Vector(o.location) + Vector((0, 0, z0))
    if axis == "X":
        for o in grp:
            o.rotation_euler = (0, math.pi / 2, 0); o.location = (o.location.z, 0, 0)
    for o in grp:
        o.location = Vector(o.location) + Vector(off)
    return grp

# ---------- models (units ~ M10 = r 0.5) ----------
def m_hex_bolt():
    hexp(0.85, 0.6, (0, 0, 2.3)); cyl(0.5, 0.8, loc=(0, 0, 1.6)); thread(0.5, 2.6, -0.1)
def m_flange_bolt():
    hexp(0.75, 0.55, (0, 0, 2.35)); cyl(1.05, 0.14, loc=(0, 0, 2.0)); thread(0.5, 3.4, 0.25)
def m_socket_cap():
    o = cyl(0.8, 0.9, loc=(0, 0, 2.2)); h = hexp(0.38, 0.6, (0, 0, 2.5)); cut(o, h); thread(0.5, 3.2, 0.15)
def m_hex_nut():
    o = hexp(0.95, 0.8); h = cyl(0.52, 1.2, 40); cut(o, h); torus(0.52, 0.06, (0, 0, 0), maj=48)
def m_nylon_nut():
    o = hexp(0.95, 0.7); cut(o, cyl(0.52, 1.2)); r = cyl(0.8, 0.35, loc=(0, 0, 0.5)); cut(r, cyl(0.5, 1)); r.data.materials.append(M["accent"])
def m_cap_nut():
    o = hexp(0.95, 0.7); cut(o, cyl(0.52, 1.2)); bpy.ops.mesh.primitive_uv_sphere_add(radius=0.82, location=(0, 0, 0.35)); s = bpy.context.object; bpy.ops.object.shade_smooth(); cut(s, cyl(2, 1.2, loc=(0, 0, -0.25)))
def m_wing_nut():
    o = cyl(0.6, 0.8); cut(o, cyl(0.38, 1.2))
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(sx * 1.0, 0, 0.45), rotation=(0, sx * 0.35, 0)); w = bpy.context.object; w.scale = (0.9, 0.18, 0.9); bevel(w, 0.08)
def m_machine_screw():
    o = cyl(0.85, 0.45, loc=(0, 0, 2.2)); cross(o, 2.45); thread(0.4, 3.2, 0.35)
def m_self_tapper():
    o = cyl(0.85, 0.45, loc=(0, 0, 2.2)); cross(o, 2.45); thread(0.42, 2.8, 0.55, pitch=0.32); cone(0.36, 0.7, -1.2)
def m_self_drill():
    hexp(0.6, 0.5, (0, 0, 2.3)); cyl(0.85, 0.08, loc=(0, 0, 2.0)); e = cyl(0.8, 0.22, loc=(0, 0, 1.85)); e.data.materials.append(M["accent"]); thread(0.4, 2.6, 0.45, pitch=0.3); cone(0.3, 0.9, -1.3)
def m_t_bolt():
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 2.2)); h = bpy.context.object; h.scale = (2.0, 0.8, 0.5); bevel(h, 0.06); thread(0.45, 3.0, 0.4)
def m_eye_bolt():
    torus(0.75, 0.25, (0, 0, 2.6), (math.pi / 2, 0, 0)); cyl(0.9, 0.12, loc=(0, 0, 1.8)); thread(0.45, 3.2, 0.1)
def m_threaded_rod():
    thread(0.4, 5.0, 0.4)
def m_u_bolt():
    torus(1.1, 0.28, (0, 0, 2.2), (math.pi / 2, 0, 0)); cut(bpy.context.object, cyl(3, 2, loc=(0, 0, 1.2)))
    for sx in (-1.1, 1.1):
        cyl(0.28, 1.0, loc=(sx, 0, 1.7)); thread(0.28, 1.4, 0.5, pitch=0.12, off=(sx, 0, 0))
def m_flat_washer():
    torus(0.95, 0.4, mn=24); o = bpy.context.object; o.scale = (1, 1, 0.22)
def m_spring_washer():
    torus(0.85, 0.16, mn=12); o = bpy.context.object; o.scale = (1, 1, 1.6); cut(o, scale_cube((0.25, 1, 1), (0, -0.85, 0))); o.rotation_euler = (0.08, 0, 0); return
def _unused():
    me = bpy.data.meshes.new("sw"); bm = bmesh.new()
    bmesh.ops.create_circle(bm, segments=8, radius=0.14)
    me_o = bpy.data.objects.new("sw", me); bm.to_mesh(me); bpy.context.collection.objects.link(me_o)
    me_o.location = (0.85, 0, 0); me_o.rotation_euler = (math.pi / 2, 0, 0)
    bpy.context.view_layer.objects.active = me_o
    s = me_o.modifiers.new("s", "SCREW"); s.angle = math.radians(340); s.screw_offset = 0.25; s.steps = 64; s.use_merge_vertices = False
    me_o.modifiers.new("sol", "SOLIDIFY").thickness = 0.01; bpy.ops.object.shade_smooth()
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
def m_circlip():
    torus(1.0, 0.09, maj=64, mn=12); o = bpy.context.object; o.scale = (1, 1, 0.6); cut(o, cyl(0.25, 1, loc=(0, -1.0, 0)))
    for sx in (-0.3, 0.3):
        c = cyl(0.17, 0.11, loc=(sx, -0.95, 0)); cut(c, cyl(0.07, 1, loc=(sx, -0.95, 0)))
def m_wedge_anchor():
    hexp(0.8, 0.6, (0, 0, 2.5)); cyl(1.0, 0.1, loc=(0, 0, 2.15)); thread(0.45, 1.6, 1.3); cyl(0.45, 1.6, loc=(0, 0, -0.3)); s = cyl(0.5, 0.9, loc=(0, 0, -0.8)); s.data.materials.append(M["accent"]); cone(0.5, 0.4, -1.45, top=0.35)
def m_chem_anchor():
    thread(0.42, 5.0, 0.3, pitch=0.14); hexp(0.75, 0.55, (0, 0, 2.2)); cyl(0.95, 0.1, loc=(0, 0, 1.85))
def m_rivet():
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.8, location=(0, 0, 1.6)); s = bpy.context.object; bpy.ops.object.shade_smooth(); s.scale = (1, 1, 0.45); cut(s, cyl(2, 1, loc=(0, 0, 1.1)))
    cyl(0.4, 2.0, loc=(0, 0, 0.6)); p = cyl(0.14, 4.4, loc=(0, 0, 1.6)); p.data.materials.append(M["accent"])
def m_dowel_pin():
    for x in (-0.8, 0.8):
        cyl(0.35, 3.6, loc=(x, 0, 0.6))
    torus(0.35, 0.09, (0, 0, 2.6), (math.pi / 2, 0, 0))
def m_solar():
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.3)); r = bpy.context.object; r.scale = (5, 1.2, 0.6); bevel(r, 0.08)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.35)); c = bpy.context.object; c.scale = (1.2, 1.3, 0.7); bevel(c, 0.08); c.data.materials.append(M["accent"])
    cyl(0.45, 0.35, loc=(0, 0, 0.85)); thread(0.3, 1.4, 0.2)
def m_rope_clip():
    torus(0.75, 0.2, (0, 0, 1.1), (math.pi / 2, 0, 0)); cut(bpy.context.object, cyl(3, 2, loc=(0, 0, 0.1)))
    for sx in (-0.75, 0.75):
        thread(0.2, 1.6, 0.25, pitch=0.1, off=(sx, 0, 0))
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0)); s = bpy.context.object; s.scale = (2.3, 0.7, 0.45); bevel(s, 0.12)
def m_turnbuckle():
    bpy.ops.mesh.primitive_cube_add(size=1); b = bpy.context.object; b.scale = (2.4, 0.5, 0.7); bevel(b, 0.2); cut(b, scale_cube((1.8, 2, 0.45)))
    for sx in (-1, 1):
        cyl(0.18, 1.2, loc=(sx * 1.7, 0, 0), rot=(0, math.pi / 2, 0)); torus(0.38, 0.12, (sx * 2.6, 0, 0), (math.pi / 2, 0, 0))
def m_shackle():
    torus(0.8, 0.2, (0, 0, 0.6), (math.pi / 2, 0, 0)); cut(bpy.context.object, cyl(3, 2, loc=(0, 0, -0.4)))
    for sx in (-0.8, 0.8):
        cyl(0.2, 1.0, loc=(sx, 0, 0.1))
    cyl(0.18, 2.4, loc=(0, 0, -0.4), rot=(0, math.pi / 2, 0)); cyl(0.32, 0.4, loc=(1.15, 0, -0.4), rot=(0, math.pi / 2, 0))
def m_pipe_clamp():
    torus(1.2, 0.2, (0, 0, 0), (math.pi / 2, 0, 0))
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(sx * 1.6, 0, 0)); e = bpy.context.object; e.scale = (0.8, 0.6, 0.12); bevel(e, 0.04)
        cyl(0.13, 0.9, loc=(sx * 1.7, 0, 0))
    cyl(0.25, 1.4, loc=(0, 0, -1.9)); thread(0.25, 1.2, -2.8, pitch=0.12)
def m_strut():
    bpy.ops.mesh.primitive_cube_add(size=1); c = bpy.context.object; c.scale = (5, 1.6, 1.6); bevel(c, 0.06); cut(c, scale_cube((5.4, 1.2, 1.4), (0, 0, 0.35)))
    for x in (-1.6, 0, 1.6):
        cut(c, scale_cube((0.7, 0.3, 3), (x, 0, -0.5)))
def m_custom():
    o = cyl(1.3, 0.35, 64); cut(o, cyl(0.4, 2)); c = cyl(0.6, 1.4, loc=(0, 0, 0.7)); cut(c, cyl(0.4, 3))
    for a in range(3):
        x, y = math.cos(a * 2.09) * 1.0, math.sin(a * 2.09) * 1.0; cut(o, cyl(0.14, 2, loc=(x, y, 0)))
    thread(0.4, 1.6, 2.0, pitch=0.15)

def cone(r, d, z, top=0.02):
    bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=top, radius2=r, depth=d, location=(0, 0, z)); bpy.ops.object.shade_smooth(); return bpy.context.object
def scale_cube(sc, loc=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.scale = sc; return o
def cut(o, tool):
    m = o.modifiers.new("cut", "BOOLEAN"); m.object = tool; m.operation = "DIFFERENCE"; m.solver = "EXACT"
    bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_move_to_index(modifier="cut", index=0); bpy.ops.object.modifier_apply(modifier="cut")
    bpy.data.objects.remove(tool, do_unlink=True)
    if not any(md.type == "BEVEL" for md in o.modifiers): pass
def cross(o, z):
    cut(o, scale_cube((1.0, 0.16, 0.4), (0, 0, z))); cut(o, scale_cube((0.16, 1.0, 0.4), (0, 0, z)))

MODELS = {k[2:]: v for k, v in globals().items() if k.startswith("m_")}

def stage(s):
    objs = [o for o in s.objects if o.type == "MESH"]
    for o in objs:
        if not o.data.materials: o.data.materials.append(M["frost"])
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    objs = [o for o in s.objects if o.type == "MESH"]
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join(); j = bpy.context.object
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS"); j.location = (0, 0, 0)
    dim = max(j.dimensions); j.scale = [3.2 / dim] * 3
    bpy.ops.object.transform_apply(scale=True)
    piv = bpy.data.objects.new("piv", None); s.collection.objects.link(piv); j.parent = piv
    j.rotation_euler = (math.radians(-18), math.radians(12), 0)
    piv.rotation_euler = (0, 0, 0); piv.keyframe_insert("rotation_euler", frame=1)
    piv.rotation_euler = (0, 0, math.radians(360 * FRAMES / (FRAMES + 1))); piv.keyframe_insert("rotation_euler", frame=FRAMES)
    for fc in piv.animation_data.action.fcurves:
        for k in fc.keyframe_points: k.interpolation = "LINEAR"
    # shadow catcher
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, -1.7)); p = bpy.context.object; p.is_shadow_catcher = True
    cam = bpy.data.cameras.new("c"); cam.lens = 70; co = bpy.data.objects.new("cam", cam); s.collection.objects.link(co); s.camera = co
    co.location = (0, -9.5, 3.0); co.rotation_euler = (math.radians(74), 0, 0)
    for nm, loc, e, sz in (("key", (-4, -5, 7), 900, 6), ("fill", (6, -3, 3), 350, 8), ("rim", (2, 6, 5), 600, 4)):
        l = bpy.data.lights.new(nm, "AREA"); l.energy = e; l.size = sz; lo = bpy.data.objects.new(nm, l); s.collection.objects.link(lo); lo.location = loc
        lo.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()

for name, fn in MODELS.items():
    if ONLY and name != ONLY: continue
    s = reset(); M = finish_mats(); fn(); stage(s)
    s.render.filepath = f"{OUT}/{name}/f_"
    bpy.ops.render.render(animation=True)
    print("DONE", name, flush=True)
