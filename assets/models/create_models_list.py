import os
import json
files = []
path = os.getcwd()+"/json"
print("\nadding files:")
for file in os.listdir(path):
    if file.endswith(".js"):
        name = file.split(".")[0]
        files.append(name)
        print(name)

with open(path+"/files.json", 'w') as outfile:
    json.dump(files, outfile)

print("\nfinished")
