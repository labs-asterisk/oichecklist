import { Box, Grid, Text, GridItem, Flex } from "@chakra-ui/react";
import { type NextPage } from "next";
import GridLoader from "react-spinners/GridLoader";

import Layout from "../components/layout";
// import ProblemBox from "../components/problemBox";
import ProblemGrid from "../components/problemGrid";
import ProblemCounts from "../components/problemCounts";

import { type Problem, AttemptingState, Year } from "../types/problem-data";

import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { UserProblem } from "@prisma/client";
import { useAtom } from "jotai";
import { problemsAtom } from "../utils/store";

const ProblemsPage: NextPage = () => {
  const [problems] = useAtom(problemsAtom);
  const { data, status } = useSession();

  const {
    isLoading,
    data: problemAttemptingStates,
    isError,
  } = trpc.attempt.getProblemAttemptingStates.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (status === "authenticated" && isLoading)
    return (
      <Layout title="Problems">
        <Flex minH="100vh" alignItems="center" justifyContent="center">
          <GridLoader color="#172237" size={20} />
        </Flex>
      </Layout>
    );

  if (status === "authenticated" && isError)
    return <div>Error in loading data</div>;

  return (
    <Layout title="Problems">
      {status === "authenticated" ? (
        <Flex justifyContent="space-between" userSelect="none">
          <Text
            ml={16}
            mt={8}
            fontSize="4xl"
            fontWeight="bold"
            color="gray.700"
          >{`${data?.user?.name}'s Checklist`}</Text>
          <ProblemCounts />
        </Flex>
      ) : (
        <></>
      )}

      {status === "unauthenticated" ? <Box pt={10} /> : <></>}

      <Box p={8} pt={0}>
        {problems.sections
          .map(({ sectionName, years }, i) => {

            return status === "unauthenticated" ? (
              <ProblemGrid
                years={years as Year[]}
                sectionName={sectionName}
                userProbs={problemAttemptingStates as UserProblem[]}
                key={i}
                viewOnly
              />
            ) : (
              <ProblemGrid
                years={years as Year[]}
                sectionName={sectionName}
                userProbs={problemAttemptingStates as UserProblem[]}
                key={i}
              />
            );

          })}
      </Box>
    </Layout>
  );
};

export default ProblemsPage;
