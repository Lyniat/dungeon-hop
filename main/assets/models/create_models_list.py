import os
import json
files = {}
players = []
enemies = []
obstacles = []
path = os.getcwd()+"/json"

#player models

id = 0
print("\nadding files for player:")
for file in os.listdir(path+"/players"):
    if file.endswith(".js"):
        name = file.split(".")[0]
        players.append({"name":name,"id":id})
        id += 1
        print(name)

print("\nfinished player files")

#obstacle models

id = 0
print("\nadding files for obstacles:")
for file in os.listdir(path+"/obstacles"):
    if file.endswith(".js"):
        name = file.split(".")[0]
        obstacles.append({"name":name,"id":id})
        id += 1
        print(name)

print("\nfinished obstacle files")

#enemy models

id = 0
print("\nadding files for enemies:")
for file in os.listdir(path+"/enemies"):
    if file.endswith(".js"):
        name = file.split(".")[0]
        enemies.append({"name":name,"id":id})
        id += 1
        print(name)

print("\nmerging different objects")

files["players"] = players
files["enemies"] = enemies
files["obstacles"] = obstacles

with open(path+"/files.json", 'w') as outfile:
    json.dump(files, outfile)

print("\nfinished enemy files")
