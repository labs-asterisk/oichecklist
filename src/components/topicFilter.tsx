// @ts-nocheck
import { MenuOptionGroup, Select } from "@chakra-ui/react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { Box, Text } from "@chakra-ui/react";

import { useAtom } from "jotai";
import { useState } from "react";

import filterTags from "../data/filter_tags.json";
import {
  problemsAtom,
  filterTopicsAtom,
} from "../utils/store";

import problems from "../data/problem_data.json";

function toPascalCase(s: string) {
  return `${s}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w*)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

const filterTopicsOptions = Object.entries(filterTags.topicWise).map(
  ([tag, occ], j) => ({
    label: `${toPascalCase(tag)} (${occ})`,
    value: tag,
  })
);

const TopicFilterMenu = () => {
  const [_, setProblems] = useAtom(problemsAtom);
  const [filterTopics, setFilterTopics] = useAtom(filterTopicsAtom);
  const [value, setValue] = useState<string[]>([]);

  return (
    <Box>
      <Text my={1} fontSize="sm" fontWeight="bold">
        By Topic
      </Text>
      <MultiSelect
        onChange={(_value) => {
          const _topics =
            _value.length === 0
              ? filterTopicsOptions.map((option) => option.value)
              : _value;
          setProblems({
            sections: problems.sections.map((section) => ({
              ...section,
              years: section.years.map((year) => ({
                ...year,
                problems: year.problems.filter((problem) =>
                 (_value.length === 0 || (problem.tags.some((tag) => _topics.includes(tag))))
                ),
              })),
            }))
          });
          setFilterTopics(_topics);
          setValue(_value);
          console.log({_});

        }}
        value={value}
        // label="Filter Topicwise"
        borderColor="gray.200"
        backgroundColor="black"
        textColor="black"
        options={filterTopicsOptions}
      />
    </Box>
  );
};

export default TopicFilterMenu;
