import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel('small', compute_type='int8')
for p in sys.argv[2:]:
    a = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout, np.float32)
    s, _ = m.transcribe(a, language=sys.argv[1], word_timestamps=True)
    print(p, [(w.word.strip(), round(w.start,2), round(w.end,2)) for x in s for w in x.words])
