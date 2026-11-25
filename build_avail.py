import glob,os,json
ids=sorted(os.path.basename(f)[:-4] for f in glob.glob('audio/mike/mk_*.m4a'))
open('js/mike-math-avail.js','w').write('var MIKE_MATH_AVAIL = %s;\n'%json.dumps({i:1 for i in ids}))
print(len(ids),'clips')
