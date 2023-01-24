import json, os

data = {}
data["sections"] = []

tmpData = {}
for section in os.listdir("problems"):
    if section == "order.txt":
        continue
    section_object = {}
    section_object["sectionName"] = section
    section_object["years"] = []
    for year in os.listdir("problems/" + section + "/"):
        f = open("problems/" + section + "/" + year)
        year_data = json.load(f)
        section_object["years"].append(year_data)
    section_object["years"].sort(key=lambda x: -x["year"])
    tmpData[section] = section_object


with open("problems/order.txt") as f:
    contents = f.readlines()
    for section in contents:
        data["sections"].append(tmpData[section.strip()])
    
json_object = json.dumps(data, indent=2)
with open("problem_data.json", "w") as outfile:
    outfile.write(json_object)
