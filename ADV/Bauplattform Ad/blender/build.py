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
GLASS = lambda: mat('glass', '#8FB4E4', 0.03, alpha=0.72, metal=0.45)
ORANGE = lambda: mat('orange', '#F28A30', 0.5)
GREY = lambda: mat('grey', '#C9D1DE', 0.7)

def tmat(name, c1, c2, kind='noise', scale=3.0, rough=0.8, bump=0.25, mortar='#E6E1D8'):
    # procedural surface (concrete, plaster, brick, dirt) in object space, so it reads as a real material
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = rough
    tc = nt.nodes.new('ShaderNodeTexCoord')
    if kind == 'brick':
        t = nt.nodes.new('ShaderNodeTexBrick'); t.inputs['Scale'].default_value = scale
        t.inputs['Color1'].default_value = hexc(c1); t.inputs['Color2'].default_value = hexc(c2); t.inputs['Mortar'].default_value = hexc(mortar)
        t.inputs['Mortar Size'].default_value = 0.012; t.offset = 0.5
        # wall-plane mapping: horizontal = x + y, vertical = z, so bricks read on any wall orientation
        sep = nt.nodes.new('ShaderNodeSeparateXYZ'); add = nt.nodes.new('ShaderNodeMath'); add.operation = 'ADD'; com = nt.nodes.new('ShaderNodeCombineXYZ')
        nt.links.new(tc.outputs['Object'], sep.inputs[0]); nt.links.new(sep.outputs['X'], add.inputs[0]); nt.links.new(sep.outputs['Y'], add.inputs[1])
        nt.links.new(add.outputs[0], com.inputs['X']); nt.links.new(sep.outputs['Z'], com.inputs['Y'])
        nt.links.new(com.outputs[0], t.inputs['Vector']); nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
        fac = t.outputs['Fac']
    else:
        t = nt.nodes.new('ShaderNodeTexNoise'); t.inputs['Scale'].default_value = scale; t.inputs['Detail'].default_value = 8
        ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = hexc(c1); ramp.color_ramp.elements[1].color = hexc(c2)
        nt.links.new(tc.outputs['Object'], t.inputs['Vector']); nt.links.new(t.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
        fac = t.outputs['Fac']
    bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = bump; bm.inputs['Distance'].default_value = 0.02
    nt.links.new(fac, bm.inputs['Height']); nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
    MATS[name] = m
    return m

CONCRETE = lambda: tmat('concrete', '#D9DBDE', '#BFC3C9', scale=2.5, rough=0.85, bump=0.35)
PLASTER = lambda: tmat('plaster', '#F4F2EE', '#E4E0D8', scale=7, rough=0.8, bump=0.12)
BRICK = lambda: tmat('brick_w', '#C8795C', '#B5684D', 'brick', scale=2.2, rough=0.85, bump=0.4)
FRAME = lambda: mat('frame', '#3B4352', 0.4, metal=0.6)
DIRT = lambda: tmat('dirt', '#C9B49A', '#A98F72', scale=0.6, rough=1.0, bump=0.6)
STEEL = lambda: mat('steel', '#8E98A8', 0.35, metal=0.8)
RUST = lambda: mat('rebar', '#8A5A3C', 0.6, metal=0.4)

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
    box(f'slab{i}', (FW + 0.6, FD + 0.6, 0.32), (0, 0, 0.16), CONCRETE(), 0.04, g)
    if walls:
        # corner piers + window bands
        for sx in (-1, 1):
            for sy in (-1, 1):
                box(f'pier{i}{sx}{sy}', (0.6, 0.6, FH - 0.32), (sx * (FW / 2 - 0.3), sy * (FD / 2 - 0.3), 0.32 + (FH - 0.32) / 2), PLASTER(), 0.03, g)
        nwin = 6
        for k in range(nwin):
            x = -FW / 2 + 1.2 + k * (FW - 2.4) / (nwin - 1)
            for sy in (-1, 1):
                if glass:
                    box(f'win{i}_{k}_{sy}', (1.6, 0.1, FH - 1.3), (x, sy * (FD / 2 - 0.18), 0.32 + 0.4 + (FH - 1.3) / 2), mats or GLASS(), 0.0, g)
                    wz = 0.32 + 0.4 + (FH - 1.3) / 2
                    for (fw, fh, dx, dz) in [(1.7, 0.08, 0, (FH - 1.3) / 2), (1.7, 0.08, 0, -(FH - 1.3) / 2), (0.08, FH - 1.3, 0.81, 0), (0.08, FH - 1.3, -0.81, 0), (0.05, FH - 1.3, 0, 0)]:
                        box(f'winf{i}_{k}_{sy}_{dx}_{dz}', (fw, 0.14, fh), (x + dx, sy * (FD / 2 - 0.16), wz + dz), FRAME(), 0.0, g)
                    if i > 0 and sy == -1 and k % 2 == 0:  # balconies with glass balustrade on the street side
                        box(f'balc{i}_{k}', (2.1, 1.1, 0.16), (x, -(FD / 2 + 0.75), 0.4), CONCRETE(), 0.02, g)
                        box(f'winrail{i}_{k}', (2.1, 0.04, 0.95), (x, -(FD / 2 + 1.28), 0.95), mat('railglass', '#BFD3EE', 0.05, alpha=0.45), 0.0, g)
                        box(f'rail{i}_{k}', (2.1, 0.06, 0.06), (x, -(FD / 2 + 1.28), 1.45), STEEL(), 0.0, g)
                # mullion fins (vertical white blades, the "architectural" detail)
                box(f'fin{i}_{k}_{sy}', (0.18, 0.5, FH - 0.32), (x + 1.05, sy * (FD / 2 + 0.05), 0.32 + (FH - 0.32) / 2), PLASTER(), 0.02, g)
        for sx in (-1, 1):
            box(f'side{i}{sx}', (0.25, FD - 1.2, FH - 0.32), (sx * (FW / 2 - 0.12), 0, 0.32 + (FH - 0.32) / 2), BRICK(), 0.0, g)
        if i == 0:  # shop: blue awning + big glass
            box('awning', (FW - 1.2, 1.2, 0.12), (0, -FD / 2 - 0.6, 2.7), BLUE(), 0.03, g)
    return g

def roof(parent):
    z = NF * FH
    r = empty('roof', (0, 0, z), parent)
    box('roofslab', (FW + 0.8, FD + 0.8, 0.4), (0, 0, 0.2), CONCRETE(), 0.05, r)
    box('parapet', (FW + 0.8, 0.25, 0.7), (0, -(FD / 2 + 0.28), 0.75), PLASTER(), 0.03, r)
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
    k = float(os.environ.get('STRETCH', '1'))  # slows the whole animation so clips outlast longer scenes
    if k != 1:
        S.render.frame_map_old = 100; S.render.frame_map_new = int(100 * k); S.frame_end = int(S.frame_end * k)
    S.render.resolution_percentage = int(os.environ.get('PCT', '100'))
    if os.environ.get('SAMPLES'): S.eevee.taa_render_samples = int(os.environ['SAMPLES'])
    bpy.ops.render.render(animation=True)


# ---------------- construction-site props ----------------
YEL = lambda: mat('craneY', '#F2B82E', 0.45, metal=0.3)

def strut(name, a, b, r, m, parent=None):
    # thin cylinder from point a to point b (lattice members, rebar, scaffold tubes)
    import mathutils
    a = mathutils.Vector(a); b = mathutils.Vector(b); d = b - a
    o = cyl(name, r, d.length, tuple((a + b) / 2), m, verts=6, parent=parent)
    o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = d.to_track_quat('Z', 'Y')
    return o

def worker(name, loc, vest='#F28A30', helmet='#FFFFFF', parent=None, rot=0):
    w = empty(name, loc, parent); w.rotation_euler = (0, 0, rot)
    for sx in (-0.11, 0.11):
        cyl(f'{name}_leg{sx}', 0.085, 0.85, (sx, 0, 0.43), mat('workwear', '#2C3A55', 0.8), verts=8, parent=w)
    box(f'{name}_torso', (0.42, 0.26, 0.6), (0, 0, 1.17), mat(f'vest{vest}', vest, 0.6), 0.06, w)
    box(f'{name}_stripe', (0.43, 0.27, 0.05), (0, 0, 1.1), mat('reflect', '#E8EEF5', 0.2, metal=0.5), 0.0, w)
    for sx in (-0.27, 0.27):
        cyl(f'{name}_arm{sx}', 0.06, 0.55, (sx, 0, 1.15), mat(f'vest{vest}', vest, 0.6), verts=8, parent=w)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.13, location=(0, 0, 1.6)); h = bpy.context.active_object; h.name = f'{name}_head'
    h.data.materials.append(mat('skin', '#D7A985', 0.6)); h.parent = w
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.165, location=(0, 0, 1.66)); hm = bpy.context.active_object; hm.name = f'{name}_helmet'
    hm.scale = (1, 1.1, 0.75); hm.data.materials.append(mat(f'helmet{helmet}', helmet, 0.3)); hm.parent = w
    for o in (h, hm):
        for pp in o.data.polygons: pp.use_smooth = True
    return w

def lattice_crane(loc, height=30, jib_len=28):
    cr = empty('crane', loc)
    seg = 1.6; n = int(height / seg); a = 0.75
    corners = [(-a, -a), (a, -a), (a, a), (-a, a)]
    for (x, y) in corners:
        strut(f'mast_c{x}{y}', (x, y, 0), (x, y, height), 0.07, YEL(), cr)
    for k in range(n):
        z0, z1 = k * seg, (k + 1) * seg
        for j in range(4):
            (x0, y0), (x1, y1) = corners[j], corners[(j + 1) % 4]
            strut(f'mast_d{k}{j}', (x0, y0, z0), (x1, y1, z1), 0.035, YEL(), cr)
            strut(f'mast_h{k}{j}', (x0, y0, z1), (x1, y1, z1), 0.03, YEL(), cr)
    box('crane_base', (4, 4, 0.8), (0, 0, 0.4), CONCRETE(), 0.05, cr)
    jib = empty('jib', (0, 0, height), cr)
    L = jib_len; c = 0.55
    for (y, z) in [(-c, 0), (c, 0), (0, 0.9)]:
        strut(f'jib_ch{y}{z}', (-L, y, z), (8, y, z), 0.06, YEL(), jib)
    for k in range(int((L + 8) / 1.4)):
        x0 = -L + k * 1.4; x1 = x0 + 1.4
        strut(f'jib_d{k}a', (x0, -c, 0), (x1, 0, 0.9), 0.03, YEL(), jib)
        strut(f'jib_d{k}b', (x0, c, 0), (x1, 0, 0.9), 0.03, YEL(), jib)
    strut('tower_top', (0, 0, 0), (0, 0, 4.5), 0.12, YEL(), jib)
    strut('tie1', (0, 0, 4.5), (-L * 0.6, 0, 0.9), 0.025, STEEL(), jib)
    strut('tie2', (0, 0, 4.5), (7, 0, 0.9), 0.025, STEEL(), jib)
    box('counter', (2.6, 1.6, 1.6), (6.5, 0, -0.6), CONCRETE(), 0.05, jib)
    box('cab', (1.6, 1.6, 1.5), (0.4, 1.5, -0.6), mat('cab', '#FFFFFF', 0.4), 0.08, jib)
    box('cabwin', (1.62, 1.0, 0.7), (0.4, 1.6, -0.4), GLASS(), 0.0, jib)
    box('trolley', (1.0, 1.4, 0.5), (-L * 0.55, 0, -0.3), NAVY(), 0.03, jib)
    strut('hook_cable', (-L * 0.55, 0, -0.3), (-L * 0.55, 0, -10), 0.02, STEEL(), jib)
    load = empty('load', (-L * 0.55, 0, -10.6), jib)
    for q in range(6):  # bundle of rebar hanging on the hook
        strut(f'lrb{q}', (-2.5, -0.3 + q * 0.12, 0), (2.5, -0.3 + q * 0.12, 0), 0.04, RUST(), load)
    return cr, jib

def excavator(loc, rot=0):
    ex = empty('excavator', loc); ex.rotation_euler = (0, 0, rot)
    for sy in (-1.1, 1.1):
        box(f'track{sy}', (4.2, 0.7, 0.9), (0, sy, 0.45), mat('track', '#2A2F38', 0.8), 0.25, ex)
    body = empty('ex_body', (0, 0, 1.0), ex)
    box('ex_house', (3.2, 2.4, 1.3), (-0.4, 0, 0.75), YEL(), 0.12, body)
    box('ex_cab', (1.3, 1.1, 1.3), (0.7, 0.6, 2.0), YEL(), 0.08, body)
    box('ex_cabwin', (1.32, 1.12, 0.8), (0.75, 0.6, 2.15), GLASS(), 0.0, body)
    arm = empty('ex_arm', (1.2, -0.4, 1.3), body)
    strut('ex_boom', (0, 0, 0), (2.6, 0, 2.1), 0.28, YEL(), arm)
    strut('ex_stickm', (2.6, 0, 2.1), (3.7, 0, -0.7), 0.2, YEL(), arm)
    strut('ex_ram', (0.3, 0, 0.5), (2.0, 0, 1.9), 0.08, STEEL(), arm)
    box('ex_bucket', (0.9, 1.0, 0.7), (3.8, 0, -1.0), mat('track', '#2A2F38', 0.8), 0.1, arm)
    key(body, 'rotation_euler', 1, (0, 0, math.radians(-25)))
    key(body, 'rotation_euler', 420, (0, 0, math.radians(30)))
    return ex

def site_fence(w=46, d=34):
    f = empty('fence')
    pm = mat('fencepanel', '#E9EDF3', 0.5, alpha=0.6); post = STEEL()
    for side, (x0, y0, x1, y1) in enumerate([(-w/2, -d/2, w/2, -d/2), (w/2, -d/2, w/2, d/2), (w/2, d/2, -w/2, d/2), (-w/2, d/2, -w/2, -d/2)]):
        n = int(max(abs(x1 - x0), abs(y1 - y0)) / 3.5)
        for k in range(n):
            if side == 0 and 5 < k < 9: continue  # gate opening for trucks
            t0, t1 = k / n, (k + 1) / n
            ax, ay = x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0; bx, by = x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1
            strut(f'fp{side}_{k}', (ax, ay, 0), (ax, ay, 2.0), 0.04, post, f)
            o = box(f'fpan{side}_{k}', (max(abs(bx - ax), 0.04), max(abs(by - ay), 0.04), 1.8), ((ax + bx) / 2, (ay + by) / 2, 1.0), pm, 0.0, f)
    return f

def stacks():
    st = empty('stacks')
    for q in range(3):  # brick pallets
        box(f'pal{q}', (1.2, 1.0, 0.15), (-14 + q * 1.5, 9, 0.08), mat('pallet', '#C8A97E', 0.9), 0.01, st)
        box(f'brk{q}', (1.1, 0.95, 0.9), (-14 + q * 1.5, 9, 0.62), BRICK(), 0.02, st)
    for q in range(14):  # rebar bundle
        strut(f'rb{q}', (-6, 11 + (q % 7) * 0.08, 0.1 + (q // 7) * 0.08), (2, 11 + (q % 7) * 0.08, 0.1 + (q // 7) * 0.08), 0.03, RUST(), st)
    for q in range(5):  # formwork boards
        box(f'ply{q}', (2.5, 1.25, 0.05), (9, 11, 0.05 + q * 0.06), mat('ply', '#D9B97C', 0.8), 0.0, st)
    box('container', (6, 2.4, 2.6), (16, -6, 1.3), BLUE(), 0.05, st)
    box('container_win', (1.4, 0.05, 0.9), (15, -7.22, 1.6), GLASS(), 0.0, st)
    box('container2', (6, 2.4, 2.6), (16, -6, 3.9), mat('cont2', '#FFFFFF', 0.5), 0.05, st)
    cyl('mixer_silo', 1.0, 4.5, (-17, -3, 3.6), mat('silo', '#C9D1DE', 0.35, metal=0.5), parent=st)
    for q in range(4): strut(f'silo_leg{q}', (-17 + (q % 2 - 0.5) * 1.6, -3 + (q // 2 - 0.5) * 1.6, 0), (-17 + (q % 2 - 0.5) * 1.2, -3 + (q // 2 - 0.5) * 1.2, 1.4), 0.06, STEEL(), st)
    return st

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
    for ch in r.children_recursive: ch.hide_render = True
    for ch in floors[3].children:
        if ch.name.startswith(('slab', 'pier')): ch.hide_render = False
    # dirt site area, fence, materials, site office
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0.01)); dpl = bpy.context.active_object; dpl.scale = (44, 32, 1); dpl.data.materials.append(DIRT())
    site_fence(); stacks()
    # exposed rebar on the open 4th floor
    for sx in (-1, 1):
        for sy in (-1, 1):
            for q in range(4):
                x = sx * (FW / 2 - 0.3) + (q % 2 - 0.5) * 0.3; y = sy * (FD / 2 - 0.3) + (q // 2 - 0.5) * 0.3
                strut(f'cbar{sx}{sy}{q}', (x, y, 4 * FH), (x, y, 4 * FH + 1.6), 0.025, RUST())
    # scaffold: tubes, ledgers, braces, planks, toe boards
    sc = empty('scaffold')
    for k in range(9):
        x = -FW / 2 + k * FW / 8
        for yy in (-FD / 2 - 0.9, -FD / 2 - 2.0):
            strut(f'sc_v{k}{yy}', (x, yy, 0), (x, yy, 4 * FH + 1.2), 0.05, STEEL(), sc)
        if k < 8:
            for lv in range(4):
                strut(f'sc_x{k}{lv}', (x, -FD / 2 - 2.0, lv * FH), (x + FW / 8, -FD / 2 - 2.0, (lv + 1) * FH), 0.03, STEEL(), sc)
    for lv in range(1, 5):
        box(f'sc_p{lv}', (FW + 0.4, 1.1, 0.06), (0, -FD / 2 - 1.45, lv * FH), mat('plank', '#D9B97C', 0.8), 0.01, sc)
        box(f'sc_t{lv}', (FW + 0.4, 0.03, 0.2), (0, -FD / 2 - 2.0, lv * FH + 0.12), mat('toe', '#F28A30', 0.6), 0.0, sc)
        for yy in (-FD / 2 - 2.0,):
            strut(f'sc_r{lv}', (-FW / 2 - 0.2, yy, lv * FH + 1.0), (FW / 2 + 0.2, yy, lv * FH + 1.0), 0.03, STEEL(), sc)
    # workers on scaffold, roof and ground
    worker('w1', (-4, -FD / 2 - 1.45, 2 * FH + 0.03), '#F28A30', '#FFFFFF')
    worker('w2', (3, -FD / 2 - 1.45, 3 * FH + 0.03), '#F5C542', '#F28A30', rot=0.6)
    worker('w3', (-5, 0, 3 * FH + 0.32), '#F28A30', '#F5C542', rot=1.2)
    worker('w4', (4, 2, 3 * FH + 0.32), '#F5C542', '#FFFFFF', rot=-0.8)
    worker('w5', (-11, -11, 0.02), '#F28A30', '#1B74FF', rot=0.3)
    w6 = worker('w6', (8, -12, 0.02), '#F5C542', '#FFFFFF', rot=2.4)
    key(w6, 'location', 1, (8, -12, 0.02)); key(w6, 'location', 420, (2, -13, 0.02))
    w7 = worker('w7', (-2, -14, 0.02), '#F28A30', '#FFFFFF', rot=1.6)
    key(w7, 'location', 1, (-2, -14, 0.02)); key(w7, 'location', 420, (-8, -13.5, 0.02))
    # lattice tower crane and excavator
    cr, jib = lattice_crane((14, 8, 0))
    key(jib, 'rotation_euler', 1, (0, 0, math.radians(-20)))
    key(jib, 'rotation_euler', 300, (0, 0, math.radians(35)))
    excavator((-12, 3, 0.02), rot=math.radians(30))
    # concrete mixer truck
    tk = empty('truck', (3, -45, 0)); tk.rotation_euler = (0, 0, math.radians(90))
    box('cabin', (2.4, 2.4, 2.4), (3.6, 0, 1.6), BLUE(), 0.15, tk)
    box('cabwin', (0.1, 2.0, 1.0), (4.82, 0, 2.2), GLASS(), 0.0, tk)
    box('bed', (5.6, 2.4, 0.6), (-0.6, 0, 1.0), mat('chassis', '#3B4352', 0.6), 0.05, tk)
    cyl('drum', 1.1, 4.0, (-0.8, 0, 2.5), mat('drum', '#F4F6F9', 0.35, metal=0.3), rot=(0, math.radians(80), 0), parent=tk)
    for wx in (-2.4, -1.2, 3.4):
        for wy in (-1.2, 1.2):
            cyl(f'wh{wx}{wy}', 0.5, 0.35, (wx, wy, 0.5), mat('tyre', '#22262E', 0.9), rot=(math.radians(90), 0, 0), parent=tk)
    key(tk, 'location', 1, (3, -45, 0)); key(tk, 'location', 170, (3, -21, 0))
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
