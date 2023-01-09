import { Box, Text, Grid, GridItem, Flex } from "@chakra-ui/react";

import ProblemBox from "./problemBox";
import ProblemViewBox from "./problemViewBox";
import ProgressBar from "./progressBar";

import { type Problem, AttemptingState, Year } from "../types/problem-data";
import { type UserProblem } from "@prisma/client";

import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

interface ProblemGridProps {
  sectionName: string;
  years: Year[];
  userProbs: UserProblem[];
  viewOnly?: boolean;
}

const ProblemGrid: React.FC<ProblemGridProps> = ({
  sectionName,
  years,
  userProbs,
  viewOnly,
}) => {
  const { status } = useSession();

  const {
    isLoading: isProgressLoading,
    data: progressData,
    isError: isProgressError,
  } = trpc.view.getProgress.useQuery(
    {
      olympiadName: sectionName,
    },
    { enabled: status === "authenticated" }
  );

  if (!isProgressLoading) {
    console.log({ sectionName, progressData });
  }

  return (
    <Box
      p={8}
      pt={2}
      borderBottomColor="gray.100"
      borderBottomStyle="solid"
      borderBottomWidth={2}
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.700">
        {sectionName}
      </Text>

      {viewOnly ? <></> : <ProgressBar olympiad={sectionName} />}

      <Grid
        templateColumns="100px auto"
        gap="1px"
        p="1px"
        background="gray.100"
        my={4}
        overflowX="auto"

      >
        {years.map((year, j) => {
          return (
            [<GridItem key={j} background ="white" rowStart={j+1}>
              <Flex
                position="relative"
                userSelect="none"
                height="100%"
                width="100%"
                alignItems="center"
                justifyContent="center"
                zIndex={1}
                p={3}
                bgColor="rgba(234, 234, 234, 0.17)"
              >
                <Text
                  fontSize="14px"
                  textAlign="center"
                  fontWeight="bold">
                  {year.year}
                </Text>
              </Flex>
              
            </GridItem>,
            year.problems.map((problem, k) => {
              let userP;
              if (userProbs) {
                userP = userProbs.find((obj) => obj.problemSlug === problem.slug);
              }

              let initAS = AttemptingState.Untouched;
              if (userP) {
                initAS = userP.attemptingState as AttemptingState;
              }
              return (
                <GridItem background="white" key={k} rowStart={j+1} colSpan="auto">
                {viewOnly ? (
                  <ProblemViewBox
                    initAttemptingState={initAS}
                    problem={problem as Problem}
                    olympiadName={sectionName}
                  />
                ) : (
                  <ProblemBox
                    initAttemptingState={initAS}
                    problem={problem as Problem}
                    olympiadName={sectionName}
                  />
                )}
              </GridItem>
              )
            })
            ]
          )
        })}
      </Grid>
    </Box>
  );
};

export default ProblemGrid;
