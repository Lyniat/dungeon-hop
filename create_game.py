import time
import re
import os

version = time.time()
print "actual version will be: "+str(version)

lines = []
with open('./main/client/GameInstance.js') as infile:
    for line in infile:
	line = re.sub('GAME_VERSION.*,','GAME_VERSION = '+str(version)+',',line)
        lines.append(line)
infile.close()

print "new content will be: "+str(lines)

with open('./main/client/GameInstance.js', 'w') as outfile:
    for line in lines:
        outfile.write(line)
outfile.close()




lines = []
with open('./server/server.js') as infile:
    for line in infile:
	line = re.sub('GAME_VERSION.*,','GAME_VERSION = '+str(version)+',',line)
        lines.append(line)
infile.close()

print "new content will be: "+str(lines)

with open('./server/server.js', 'w') as outfile:
    for line in lines:
        outfile.write(line)
outfile.close()

os.system('sh ./obfuscate.sh')
