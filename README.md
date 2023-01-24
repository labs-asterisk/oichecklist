# OI Checklist [![GitHub license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/labs-asterisk/interview-checklist/blob/main/LICENSE) [![inspiration](https://img.shields.io/badge/inspiration-OIChecklist-yellow)](https://img.shields.io/badge/inspiration-OIChecklist-yellow) [![cf](https://img.shields.io/badge/codeforces-blog-red)](https://codeforces.com/blog/entry/111186)
This codebase is based off our [Interview Checklist](https://github.com/labs-asterisk/interview-checklist), please check it out if you're interested! 

## Contributing
The problem metadata is located [here](https://github.com/labs-asterisk/oichecklist/blob/main/src/data/problem_data.json). To add a problem, follow these steps:
1. Fork the repository.
2. Edit the corresponding problem JSON, or create a new one [here](https://github.com/labs-asterisk/oichecklist/blob/main/src/data/problems) as you see fit.
3. If you're adding a new olympiad, make sure to add that to the order file [here](https://github.com/labs-asterisk/oichecklist/blob/main/src/data/problems/order.txt).
4. Run this [script](https://github.com/labs-asterisk/oichecklist/blob/main/src/data/combine.py) to update the combined [JSON file](https://github.com/labs-asterisk/oichecklist/blob/main/src/data/problem_data.json) the webapp actually pulls data from.
```bash
python3 combine.py
```
5. Run this [script](https://github.com/labs-asterisk/oichecklist/blob/main/src/data/update_tags.py) to update the tags (it will edit the file [filter_tags.json](https://github.com/labs-asterisk/oichecklist/blob/main/src/data/filter_tags.json) automatically).
```bash
python3 update_tags.py
```
6. Open up a [pull request](https://github.com/labs-asterisk/oichecklist/pulls) with your changes!

All contributions are welcome! You can add functionality, edit the problem database, or make any other improvements. When you're done, [submit a pull request](https://github.com/labs-asterisk/oichecklist/pulls)!

## Future Improvements
- [ ] Add option to load user data from previous OI Checklist automatically 
- [ ] Customized problem lists
- [ ] Automatically update status based on judge activity
- [ ] Make problem list more extensive (update to add 2022 contests, tags for problems)
- [ ] Enhance problem crowdsourcing
- [ ] Add support for Google Authentication
- [ ] Add option to hide tags
- [ ] Add option to collapse section

# License
The code is licensed under the MIT license.
