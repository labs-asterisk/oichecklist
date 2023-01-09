import json

f = open("problem_data.json")
data = json.load(f)

tags = {}

for section in data["sections"]:
    for year in section["years"]:
        for problem in year["problems"]:
            for tag in problem["tags"]:
                if tag in tags:
                    tags[tag] += 1
                else:
                    tags[tag] = 1

to_write = {}
to_write["topicWise"] = tags

json_object = json.dumps(to_write, indent=2)
with open("filter_tags.json", "w") as outfile:
    outfile.write(json_object)
