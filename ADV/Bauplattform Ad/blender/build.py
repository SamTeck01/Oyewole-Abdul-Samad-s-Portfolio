# Baucheck24 film: all 3D shots, built procedurally. Light clay look, EEVEE.
# usage: blender -b -P build.py -- <shot> [--still] [--frames a b]
import bpy, bmesh, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['rise']
SHOT = argv[0]
STILL = '--still' in argv
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'renders', SHOT)
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene
S.render.engine = 'BLENDER_EEVEE'
S.render.fps = 30
S.render.resolution_x, S.render.resolution_y = (1920, 1080)
S.render.image_settings.file_format = 'PNG'
S.view_settings.view_transform = 'Standard'
S.view_settings.look = 'None'
E = S.eevee
E.taa_render_samples = 48
E.use_gtao = True; E.gtao_distance = 1.2; E.gtao_factor = 1.2
E.use_soft_shadows = True
E.shadow_cube_size = '2048'; E.shadow_cascade_size = '4096'
E.use_bloom = True; E.bloom_intensity = 0.03; E.bloom_threshold = 1.2
try:
    E.use_ssr = True
except Exception:
    pass

def hexc(h, a=1.0):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return (*c, a)

MATS = {}
def mat(name, col, rough=0.6, emit=None, emit_s=0.0, alpha=1.0, metal=0.0):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexc(col)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = hexc(emit)
        b.inputs['Emission Strength'].default_value = emit_s
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        m.blend_method = 'BLEND'; m.shadow_method = 'NONE'; m.use_backface_culling = False
    MATS[name] = m
    return m

WHITE = lambda: mat('clay', '#EEF1F6', 0.75)
WARM = lambda: mat('warm', '#D9E2EE', 0.7)
NAVY = lambda: mat('navy', '#0B2A63', 0.55)
BLUE = lambda: mat('blue', '#1B74FF', 0.45)
GREEN = lambda: mat('green', '#2DB453', 0.5)
GLASS = lambda: mat('glass', '#7FA9E6', 0.05, alpha=0.8, metal=0.2)
ORANGE = lambda: mat('orange', '#F28A30', 0.5)
GREY = lambda: mat('grey', '#C9D1DE', 0.7)

def box(name, size, loc, m, bevel=0.03, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object; o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        bv = o.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 3
    o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    if parent: o.parent = parent
    return o

def cyl(name, r, depth, loc, m, rot=(0, 0, 0), verts=24, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object; o.name = name; o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    if parent: o.parent = parent
    return o

def empty(name, loc=(0, 0, 0), parent=None):
    o = bpy.data.objects.new(name, None); S.collection.objects.link(o); o.location = loc
    if parent: o.parent = parent
    return o

def key(o, path, frame, val, interp='BEZIER'):
    setattr(o, path, val) if not isinstance(val, tuple) else setattr(o, path, val)
    o.keyframe_insert(path, frame=frame)
    if o.animation_data and o.animation_data.action:
        for fc in o.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = interp
                kp.easing = 'EASE_IN_OUT'

# ---------------- world, ground, light ----------------
BGCOL = ['#F2F5FA']
def world(strength=0.75, col='#F3F6FB', bg='#F2F5FA'):
    BGCOL[0] = bg
    w = bpy.data.worlds.new('w'); S.world = w; w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld')
    light = nt.nodes.new('ShaderNodeBackground'); light.inputs['Color'].default_value = hexc(col); light.inputs['Strength'].default_value = strength * 0.9
    cam = nt.nodes.new('ShaderNodeBackground'); cam.inputs['Color'].default_value = hexc(bg); cam.inputs['Strength'].default_value = 1.0
    lp = nt.nodes.new('ShaderNodeLightPath'); mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Camera Ray'], mix.inputs['Fac'])
    nt.links.new(light.outputs[0], mix.inputs[1]); nt.links.new(cam.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])

def ground(col='#F3F6FB', size=600):
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, 0))
    g = bpy.context.active_object; g.name = 'ground'
    m = bpy.data.materials.new('groundfade'); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = hexc(col); b.inputs['Roughness'].default_value = 0.9
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = hexc(BGCOL[0]); em.inputs['Strength'].default_value = 1.0
    tc = nt.nodes.new('ShaderNodeTexCoord'); vl = nt.nodes.new('ShaderNodeVectorMath'); vl.operation = 'LENGTH'
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 45; mr.inputs['From Max'].default_value = 140
    mr.interpolation_type = 'SMOOTHSTEP'
    mix = nt.nodes.new('ShaderNodeMixShader'); out = nt.nodes['Material Output']
    nt.links.new(tc.outputs['Object'], vl.inputs[0]); nt.links.new(vl.outputs['Value'], mr.inputs['Value'])
    nt.links.new(mr.outputs['Result'], mix.inputs['Fac']); nt.links.new(b.outputs[0], mix.inputs[1]); nt.links.new(em.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    g.data.materials.append(m)
    return g

def sun(rot=(math.radians(52), math.radians(8), math.radians(35)), energy=3.4, col='#FFFFFF', angle=6):
    l = bpy.data.lights.new('sun', 'SUN'); l.energy = energy; l.angle = math.radians(angle); l.color = hexc(col)[:3]
    o = bpy.data.objects.new('sun', l); S.collection.objects.link(o); o.rotation_euler = rot
    return o

def camera(lens=40):
    c = bpy.data.cameras.new('cam'); c.lens = lens; c.clip_end = 2000
    o = bpy.data.objects.new('cam', c); S.collection.objects.link(o); S.camera = o
    t = empty('cam_target')
    tr = o.constraints.new('TRACK_TO'); tr.target = t; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
    return o, t

def dof(cam, target, fstop=4.0):
    cam.data.dof.use_dof = True; cam.data.dof.focus_object = target; cam.data.dof.aperture_fstop = fstop

# ---------------- the building ----------------
FW, FD, FH = 16.0, 10.0, 3.2   # footprint and floor height (m)
NF = 5                           # ground-floor shop + 4 residential floors

def floor_group(i, parent, glass=True, walls=True, mats=None):
    z = i * FH
    g = empty(f'floor{i}', (0, 0, z), parent)
    box(f'slab{i}', (FW + 0.6, FD + 0.6, 0.32), (0, 0, 0.16), WHITE(), 0.04, g)
    if walls:
        # corner piers + window bands
        for sx in (-1, 1):
            for sy in (-1, 1):
                box(f'pier{i}{sx}{sy}', (0.6, 0.6, FH - 0.32), (sx * (FW / 2 - 0.3), sy * (FD / 2 - 0.3), 0.32 + (FH - 0.32) / 2), WHITE(), 0.03, g)
        nwin = 6
        for k in range(nwin):
            x = -FW / 2 + 1.2 + k * (FW - 2.4) / (nwin - 1)
            for sy in (-1, 1):
                if glass:
                    box(f'win{i}_{k}_{sy}', (1.6, 0.1, FH - 1.3), (x, sy * (FD / 2 - 0.18), 0.32 + 0.4 + (FH - 1.3) / 2), mats or GLASS(), 0.0, g)
                # mullion fins (vertical white blades, the "architectural" detail)
                box(f'fin{i}_{k}_{sy}', (0.18, 0.5, FH - 0.32), (x + 1.05, sy * (FD / 2 + 0.05), 0.32 + (FH - 0.32) / 2), WHITE(), 0.02, g)
        for sx in (-1, 1):
            box(f'side{i}{sx}', (0.25, FD - 1.2, FH - 0.32), (sx * (FW / 2 - 0.12), 0, 0.32 + (FH - 0.32) / 2), WARM(), 0.02, g)
        if i == 0:  # shop: blue awning + big glass
            box('awning', (FW - 1.2, 1.2, 0.12), (0, -FD / 2 - 0.6, 2.7), BLUE(), 0.03, g)
    return g

def roof(parent):
    z = NF * FH
    r = empty('roof', (0, 0, z), parent)
    box('roofslab', (FW + 0.8, FD + 0.8, 0.4), (0, 0, 0.2), WHITE(), 0.05, r)
    box('parapet', (FW + 0.8, 0.25, 0.7), (0, -(FD / 2 + 0.28), 0.75), WHITE(), 0.03, r)
    for k in range(5):  # solar panels (navy) on the roof
        p = box(f'pv{k}', (2.4, 1.4, 0.08), (-5 + k * 2.6, 1.5, 0.75), NAVY(), 0.02, r)
        p.rotation_euler = (math.radians(-18), 0, 0)
    box('plant', (2.6, 2.0, 1.3), (5.2, -2, 1.05), GREY(), 0.05, r)
    return r

def building(parent=None, glass=True):
    b = empty('building', (0, 0, 0), parent)
    floors = [floor_group(i, b, glass) for i in range(NF)]
    r = roof(b)
    return b, floors, r

def trees(n=10, radius=22, seed=1):
    import random
    rnd = random.Random(seed)
    for k in range(n):
        a = rnd.random() * math.tau; d = radius + rnd.random() * 10
        x, y = math.cos(a) * d, math.sin(a) * d
        if abs(y) < 9 and x > -10: continue
        cyl(f'trunk{k}', 0.15, 1.6, (x, y, 0.8), GREY(), verts=10)
        bpy.ops.mesh.primitive_ico_sphere_add(radius=1.4 + rnd.random() * 0.8, subdivisions=3, location=(x, y, 2.6 + rnd.random() * 0.6))
        t = bpy.context.active_object; t.data.materials.append(mat('tree', '#CFE6D6', 0.9))
        for p in t.data.polygons: p.use_smooth = True

def blueprint_plane(size=60):
    # paper with blueprint lines (generated texture)
    import numpy as np
    W = 2048
    img = bpy.data.images.new('bp', W, W)
    a = np.ones((W, W, 4), dtype=np.float32)
    a[..., 0] = 0.95; a[..., 1] = 0.965; a[..., 2] = 0.985
    blue = (0.11, 0.42, 1.0)
    def line(x0, y0, x1, y1, w=2, c=blue, alpha=1.0):
        if x0 == x1:
            a[min(y0, y1):max(y0, y1), x0 - w // 2:x0 + w // 2 + 1, :3] = c
        else:
            a[y0 - w // 2:y0 + w // 2 + 1, min(x0, x1):max(x0, x1), :3] = c
    for k in range(0, W, 64):  # fine grid
        a[:, k, :3] = (0.82, 0.88, 0.97); a[k, :, :3] = (0.82, 0.88, 0.97)
    # building footprint in the middle: 16 x 10 m -> 1 m = 34 px
    s = 34; cx = cy = W // 2
    x0, x1 = cx - 8 * s, cx + 8 * s; y0, y1 = cy - 5 * s, cy + 5 * s
    for (p, q, r_, t) in [(x0, y0, x1, y0), (x0, y1, x1, y1), (x0, y0, x0, y1), (x1, y0, x1, y1)]:
        line(p, q, r_, t, 6)
    for k in range(1, 6):
        line(x0 + k * (x1 - x0) // 6, y0, x0 + k * (x1 - x0) // 6, y1, 2)
    line(x0, cy, x1, cy, 2)
    # dimension lines
    line(x0, y1 + 50, x1, y1 + 50, 2); line(x0 - 50, y0, x0 - 50, y1, 2)
    for xx in (x0, x1): line(xx, y1 + 30, xx, y1 + 70, 2)
    for yy in (y0, y1): line(x0 - 70, yy, x0 - 30, yy, 2)
    # site boundary + street
    line(cx - 16 * s, cy - 12 * s, cx + 16 * s, cy - 12 * s, 3); line(cx - 16 * s, cy + 12 * s, cx + 16 * s, cy + 12 * s, 3)
    line(cx - 16 * s, cy - 12 * s, cx - 16 * s, cy + 12 * s, 3); line(cx + 16 * s, cy - 12 * s, cx + 16 * s, cy + 12 * s, 3)
    img.pixels.foreach_set(a.ravel())
    img.pack()
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, 0.005))
    p = bpy.context.active_object; p.name = 'blueprint'
    m = bpy.data.materials.new('bpm'); m.use_nodes = True
    nt = m.node_tree; tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = img
    nt.links.new(tex.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])
    nt.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.85
    p.data.materials.append(m)
    return p

def render(frames, name=None):
    S.frame_start, S.frame_end = frames
    if STILL:
        S.frame_set(int(sum(frames) / 2) if len(argv) < 3 else int(argv[argv.index('--still') + 1]))
        S.render.filepath = os.path.join(OUT, 'still.png')
        bpy.ops.render.render(write_still=True)
        return
    if '--frames' in argv:
        i = argv.index('--frames'); S.frame_start, S.frame_end = int(argv[i + 1]), int(argv[i + 2])
    S.render.filepath = os.path.join(OUT, 'f_')
    S.frame_step = int(os.environ.get('STEP', '1'))
    S.render.resolution_percentage = int(os.environ.get('PCT', '100'))
    if os.environ.get('SAMPLES'): S.eevee.taa_render_samples = int(os.environ['SAMPLES'])
    bpy.ops.render.render(animation=True)

# ================= SHOTS =================
def ease_cam(cam, tgt, keys):
    for f, loc, tl in keys:
        cam.location = loc; cam.keyframe_insert('location', frame=f)
        tgt.location = tl; tgt.keyframe_insert('location', frame=f)
    for o in (cam, tgt):
        for fc in o.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'

if SHOT == 'rise':
    world(0.45); ground('#E8EDF4'); sun(); trees()
    bp = blueprint_plane(70)
    b, floors, r = building()
    # floors rise one by one out of the plan
    parts = floors + [r]
    for i, g in enumerate(parts):
        z = g.location.z
        f0 = 40 + i * 22
        g.location.z = z - 4; g.scale = (1, 1, 0.001); key(g, 'location', 1, tuple(g.location)); key(g, 'scale', 1, (1, 1, 0.001))
        key(g, 'location', f0, tuple(g.location)); key(g, 'scale', f0, (1, 1, 0.001))
        g.location.z = z; key(g, 'location', f0 + 26, tuple(g.location)); key(g, 'scale', f0 + 26, (1, 1, 1))
    cam, tgt = camera(35)
    ease_cam(cam, tgt, [(1, (0.5, -2, 62), (0, 0, 0)), (70, (8, -30, 40), (0, 0, 2)), (240, (34, -30, 15), (0, 0, 7))])
    dof(cam, tgt, 5.6)
    render((1, 240))

elif SHOT == 'bim':
    world(0.45); ground('#E8EDF4'); sun(); trees()
    b, floors, r = building(glass=True)
    # hide side walls & fins partly so the services read: make walls glass-like
    for o in list(S.objects):
        if o.name.startswith(('side', 'fin', 'win')):
            o.data.materials.clear(); o.data.materials.append(mat('xray', '#DCE7F7', 0.2, alpha=0.18))
    # beams (navy), ducts (blue), pipes (green), cable trays (grey) on every floor
    for i in range(1, NF):
        z = i * FH - 0.35
        for k in range(5):
            box(f'beam{i}{k}', (0.35, FD - 0.6, 0.45), (-6.4 + k * 3.2, 0, z), NAVY(), 0.02)
        cyl(f'duct{i}', 0.32, FW - 1.2, (0, -2.2, z - 0.55), BLUE(), rot=(0, math.radians(90), 0))
        cyl(f'pipe{i}', 0.12, FW - 1.6, (0, 2.0, z - 0.5), GREEN(), rot=(0, math.radians(90), 0))
        box(f'tray{i}', (FW - 1.4, 0.5, 0.08), (0, 0.4, z - 0.5), GREY(), 0.01)
    for k in range(3):  # risers
        cyl(f'riser{k}', 0.25, NF * FH, (-5 + k * 5, 3.6, NF * FH / 2), BLUE())
    # clash markers (orange glow spheres where duct meets beam)
    for (x, z) in [(-3.2, 2 * FH - 0.9), (3.2, 1 * FH - 0.9), (0, 3 * FH - 0.9)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.6, location=(x, -2.2, z))
        s = bpy.context.active_object; s.data.materials.append(mat('clash', '#F28A30', 0.3, emit='#FF8A2A', emit_s=10))
    cam, tgt = camera(40)
    ease_cam(cam, tgt, [(1, (40, -34, 20), (0, 0, 7.5)), (210, (20, -46, 15), (0, 0, 7.5))])
    dof(cam, tgt, 8)
    render((1, 210))

elif SHOT == 'explode':
    world(0.45); ground('#E8EDF4'); sun()
    b, floors, r = building()
    parts = floors + [r]
    for i, g in enumerate(parts):
        z = g.location.z
        key(g, 'location', 1, (0, 0, z))
        key(g, 'location', 20, (0, 0, z))
        key(g, 'location', 95, (0, 0, z + i * 2.6))
    # quantity blocks rising beside: concrete (grey), drywall (white), cable (blue coil)
    cam, tgt = camera(38)
    ease_cam(cam, tgt, [(1, (-30, -30, 16), (0, 0, 9)), (150, (-24, -36, 22), (0, 0, 13))])
    dof(cam, tgt, 8)
    render((1, 150))

elif SHOT == 'site':
    world(0.45); ground('#EEF1F5'); sun(); trees(8, 28, 3)
    # site: 3 floors built, 4th as columns only, scaffold, crane, truck, drone
    b, floors, r = building()
    for i, g in enumerate(floors):
        if i >= 3:
            for ch in g.children: ch.hide_render = True
    r.hide_render = True
    for ch in floors[3].children:
        if ch.name.startswith(('slab', 'pier')): ch.hide_render = False
    # scaffold
    sc = empty('scaffold')
    for k in range(9):
        x = -FW / 2 + k * FW / 8
        cyl(f'sc_v{k}', 0.06, 4 * FH + 1, (x, -FD / 2 - 1.2, (4 * FH + 1) / 2), GREY(), verts=8, parent=sc)
    for lv in range(1, 5):
        box(f'sc_p{lv}', (FW + 0.4, 1.0, 0.08), (0, -FD / 2 - 1.2, lv * FH), mat('plank', '#E7D9C2', 0.8), 0.01, sc)
        box(f'sc_r{lv}', (FW + 0.4, 0.06, 0.06), (0, -FD / 2 - 1.7, lv * FH + 1), GREY(), 0, sc)
    # crane
    cr = empty('crane', (14, 8, 0))
    box('mast', (1.2, 1.2, 30), (0, 0, 15), mat('craneY', '#F5C542', 0.5), 0.02, cr)
    jib = empty('jib', (0, 0, 30), cr)
    box('jibarm', (26, 0.9, 0.9), (-8, 0, 0.6), mat('craneY', '#F5C542', 0.5), 0.02, jib)
    box('counter', (3, 1.6, 1.4), (6, 0, 0.3), GREY(), 0.05, jib)
    box('cab', (1.6, 1.6, 1.4), (0.8, 1.4, -0.4), WHITE(), 0.05, jib)
    cyl('cable', 0.03, 10, (-14, 0, -4.4), GREY(), verts=6, parent=jib)
    box('load', (2.4, 1.2, 0.8), (-14, 0, -9.6), mat('pallet', '#D9DEE7', 0.7), 0.04, jib)
    key(jib, 'rotation_euler', 1, (0, 0, math.radians(-20)))
    key(jib, 'rotation_euler', 300, (0, 0, math.radians(35)))
    # truck
    tk = empty('truck', (-40, -16, 0))
    box('cabin', (2.4, 2.4, 2.4), (3.6, 0, 1.6), BLUE(), 0.15, tk)
    box('bed', (5.6, 2.4, 0.6), (-0.6, 0, 1.0), WHITE(), 0.05, tk)
    cyl('drum', 1.0, 4.0, (-0.8, 0, 2.4), WHITE(), rot=(0, math.radians(80), 0), parent=tk)
    for wx in (-2.4, 0, 3.4):
        for wy in (-1.2, 1.2):
            cyl(f'wh{wx}{wy}', 0.5, 0.35, (wx, wy, 0.5), NAVY(), rot=(math.radians(90), 0, 0), parent=tk)
    key(tk, 'location', 1, (-40, -16, 0)); key(tk, 'location', 150, (-12, -16, 0))
    # drone + scan cone
    dr = empty('drone', (0, 0, 20))
    box('dbody', (0.9, 0.9, 0.25), (0, 0, 0), NAVY(), 0.08, dr)
    for ax in (-1, 1):
        for ay in (-1, 1):
            cyl(f'rot{ax}{ay}', 0.4, 0.04, (ax * 0.7, ay * 0.7, 0.15), GREY(), verts=16, parent=dr)
    bpy.ops.mesh.primitive_cone_add(radius1=0.01, radius2=7, depth=14, location=(0, 0, -7))
    cone = bpy.context.active_object; cone.parent = dr
    cone.data.materials.append(mat('scan', '#1B74FF', 0.3, emit='#1B74FF', emit_s=0.6, alpha=0.10))
    # circle around building
    for f in range(1, 301, 15):
        a = math.radians(-60 + f * 0.6)
        dr.location = (math.cos(a) * 14, math.sin(a) * 12, 19 + math.sin(f / 30) * 0.6)
        dr.keyframe_insert('location', frame=f)
    cam, tgt = camera(32)
    ease_cam(cam, tgt, [(1, (-34, -38, 14), (0, 0, 6)), (300, (-14, -46, 20), (0, 0, 9))])
    dof(cam, tgt, 8)
    render((1, 300))

elif SHOT == 'twin':
    world(0.55, '#F6EFE6')
    ground('#F2EEE8'); trees(12, 22, 5)
    sun((math.radians(74), math.radians(4), math.radians(-60)), 4.0, '#FFE2B8', 4)
    win = mat('winlit', '#FFE8C2', 0.2, emit='#FFD9A0', emit_s=2.2)
    b, floors, r = building()
    import random
    rnd = random.Random(4)
    for o in list(S.objects):
        if o.name.startswith('win') and rnd.random() < 0.45:
            o.data.materials.clear(); o.data.materials.append(win)
    # sensor dots
    for k, (x, y, z) in enumerate([(-6, -5.3, 4.5), (2, -5.3, 10.8), (7.9, -2, 7.4), (-3, -5.3, 14), (5, 5.3, 2)]):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.28, location=(x, y, z))
        s = bpy.context.active_object; s.data.materials.append(mat(f'sens{k}', '#1B74FF', 0.3, emit='#2D86FF', emit_s=4))
        for f in range(1, 211, 30):
            sc = 1.0 + 0.35 * ((f // 30 + k) % 2)
            s.scale = (sc, sc, sc); s.keyframe_insert('scale', frame=f)
    cam, tgt = camera(42)
    ease_cam(cam, tgt, [(1, (36, -30, 9), (0, 0, 8)), (210, (28, -24, 8.5), (0, 0, 8.5))])
    dof(cam, tgt, 5.6)
    render((1, 210))

elif SHOT.startswith('tile_'):
    kind = SHOT[5:]
    world(0.45, '#FFFFFF'); ground('#FFFFFF'); sun(energy=2.6)
    S.render.resolution_x, S.render.resolution_y = (600, 440)
    piv = empty('piv')
    if kind == 'paper':
        for k in range(9):
            o = box(f'p{k}', (2.1, 2.9, 0.06), (0, 0, 0.05 + k * 0.08), WHITE(), 0.01, piv); o.rotation_euler = (0, 0, math.radians((k * 37) % 23 - 11))
        box('clip', (0.5, 0.15, 0.1), (0, 1.3, 0.8), BLUE(), 0.02, piv)
    elif kind == 'cone':
        bpy.ops.mesh.primitive_cone_add(radius1=0.9, radius2=0.12, depth=2.4, location=(0, 0, 1.3)); o = bpy.context.active_object; o.data.materials.append(ORANGE()); o.parent = piv
        box('base', (2.0, 2.0, 0.15), (0, 0, 0.08), ORANGE(), 0.04, piv)
        cyl('band', 0.62, 0.3, (0, 0, 1.25), WHITE(), parent=piv)
    elif kind == 'helmet':
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1.1, location=(0, 0, 0.3)); o = bpy.context.active_object
        bm = bmesh.new(); bm.from_mesh(o.data)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -0.05], context='VERTS'); bm.to_mesh(o.data); bm.free()
        o.data.materials.append(mat('helmetY', '#F5C542', 0.4)); o.parent = piv
        for p in o.data.polygons: p.use_smooth = True
        cyl('brim', 1.4, 0.08, (0, 0.25, 0.28), mat('helmetY', '#F5C542', 0.4), parent=piv)
    elif kind == 'crane':
        box('m', (0.3, 0.3, 3.4), (0, 0, 1.7), mat('craneY', '#F5C542', 0.5), 0.02, piv)
        box('j', (3.2, 0.25, 0.25), (-0.8, 0, 3.4), mat('craneY', '#F5C542', 0.5), 0.02, piv)
        box('c', (0.6, 0.4, 0.4), (0.9, 0, 3.3), GREY(), 0.03, piv)
    elif kind == 'calc':
        box('body', (1.8, 2.6, 0.25), (0, 0, 0.15), NAVY(), 0.08, piv)
        box('scr', (1.4, 0.6, 0.05), (0, 0.8, 0.3), mat('scr', '#DCEAFF', 0.3), 0.02, piv)
        for k in range(12):
            box(f'k{k}', (0.32, 0.28, 0.08), (-0.45 + (k % 3) * 0.45, 0.15 - (k // 3) * 0.4, 0.3), WHITE() if k % 4 else BLUE(), 0.03, piv)
    elif kind == 'truck':
        box('cab', (1.0, 1.0, 1.0), (1.4, 0, 0.75), BLUE(), 0.08, piv)
        box('bed', (2.4, 1.1, 0.3), (-0.4, 0, 0.5), WHITE(), 0.04, piv)
        cyl('drum', 0.5, 1.8, (-0.4, 0, 1.1), WHITE(), rot=(0, math.radians(80), 0), parent=piv)
        for wx in (-1.1, 0.2, 1.4):
            for wy in (-0.55, 0.55):
                cyl(f'w{wx}{wy}', 0.25, 0.2, (wx, wy, 0.25), NAVY(), rot=(math.radians(90), 0, 0), parent=piv)
    elif kind == 'cable':
        bpy.ops.curve.primitive_bezier_circle_add(radius=1.0, location=(0, 0, 0.3))
        cu = bpy.context.active_object; cu.data.bevel_depth = 0.09; cu.data.bevel_resolution = 4
        bpy.ops.object.convert(target='MESH'); o = bpy.context.active_object
        o.data.materials.append(BLUE()); o.parent = piv
        for k in range(3):
            o2 = o.copy(); o2.data = o.data.copy(); S.collection.objects.link(o2); o2.location.z = 0.3 + k * 0.2; o2.rotation_euler = (math.radians(8 * k), math.radians(-6 * k), 0); o2.parent = piv
    elif kind == 'brick':
        for k in range(12):
            box(f'b{k}', (0.9, 0.42, 0.3), ((k % 3) * 0.95 - 0.95 + (0.47 if (k // 3) % 2 else 0), 0, 0.17 + (k // 3) * 0.32), mat('brick', '#E9DCCB', 0.8), 0.03, piv)
    key(piv, 'rotation_euler', 1, (0, 0, 0), 'LINEAR')
    key(piv, 'rotation_euler', 121, (0, 0, math.radians(360)), 'LINEAR')
    cam, tgt = camera(50)
    cam.location = (5.2, -5.2, 4.2); tgt.location = (0, 0, 0.9)
    S.eevee.taa_render_samples = 32
    render((1, 120))
