# EN Piper take: swap Ryan's anglicised "Bau-Kunden" for the German one from the Thorsten take.
from splice import load, dip, fade, nz, SR
import numpy as np, soundfile as sf
de = load('vo_th/l2.wav'); en = load('vo_ry/l2.wav')
cd = dip(de, nz(de)/SR + .86, .1); ce = dip(en, nz(en)/SR + .56, .1)
sf.write('vo_ry/l2.wav', np.concatenate([fade(de[:cd]), np.zeros(int(.03*SR), np.float32), fade(en[ce:], 240, out=False)]), SR)
