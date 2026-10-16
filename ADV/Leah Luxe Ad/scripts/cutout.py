# Copy client photos to named files and make background-removed PNG cutouts (rembg, isnet). usage: python cutout.py <assets_in> <outdir>
import sys, os
from PIL import Image, ImageOps
from rembg import remove, new_session
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
names = {'17.08.02 (1)': 'headbands', '17.08.02 (2)': 'ringlight', '17.08.02 (3)': 'aloe', '17.08.02 (4)': 'belt',
         '17.08.02.': 'stars', '17.08.03': 'cups', '17.08.04': 'mugs', '17.26.51 (1)': 'perfume', '17.26.51 (2)': 'masks',
         '17.26.51 (3)': 'totes', '17.26.51.': 'gloss'}
s = new_session('isnet-general-use')
for f in sorted(os.listdir(src)):
    key = next(k for k in names if k in f.replace('.jpeg', '.') if True)
    n = names[key]; im = ImageOps.exif_transpose(Image.open(os.path.join(src, f))).convert('RGB')
    im.save(f'{out}/{n}.jpg', quality=95); remove(im, session=s).save(f'{out}/{n}_cut.png'); print(n, im.size)
