// @ts-nocheck
import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";
import _ from "lodash";

import data from "../data/problem_data.json";

type OverallProgressBarProps = {
  userId?: string;
};

const ProblemCounts: React.FC<OverallProgressBarProps> = ({ userId }) => {
  const solvedProblemsQuery = trpc.view.getSolvedSlugs.useQuery({ userId });
  const [solvedSlugs, setSolvedSlugs] = React.useState<
    { problemSlug: string; status: string }[]
  >([]);
  let olympiadSlugs = data.sections
    .map((s) => s.years
    .map((x) => x.problems
    .map((p) => p.slug))
  );
  olympiadSlugs = [].concat.apply([], olympiadSlugs);
  olympiadSlugs = [].concat.apply([], olympiadSlugs);

  React.useEffect(() => {
    const ss = (solvedProblemsQuery.data ?? [])
      .filter((x) => olympiadSlugs.includes(x.problemSlug))
      .map((x) => ({ problemSlug: x.problemSlug, status: x.attemptingState }));
    setSolvedSlugs(ss);
  }, [solvedProblemsQuery.data]);
  return (
    <>
      {/* <pre>{JSON.stringify(solvedSlugs, null, 2)}</pre> */}
      <Flex mr={20} mt={6}>
        <Flex
          flexDirection="column"
          alignItems="center"
          borderColor="gray.100"
          borderWidth={1}
          borderRightWidth={0}
          borderStyle="solid"
          pl={5}
          pr={5}
          pt={2}
          pb={2}
        >
          <Text fontSize="xl" userSelect="none">
            {String(
              solvedSlugs.filter(
                (x) => x.status === "Unimplemented" || x.status === "Solved"
              ).length
            )}
          </Text>
          <Text fontSize="md" userSelect="none">
            Total Solved
          </Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          borderColor="gray.100"
          borderWidth={1}
          borderStyle="solid"
          pl={5}
          pr={5}
          pt={2}
          pb={2}
        >
          <Text fontSize="xl" userSelect="none">
            {String(
              solvedSlugs.filter((x) => x.status === "Attempting").length
            )}
          </Text>
          <Text fontSize="md" userSelect="none">
            Total Attempting
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default ProblemCounts;
