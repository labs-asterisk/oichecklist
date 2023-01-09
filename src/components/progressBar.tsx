// @ts-nocheck
import React from "react";
import {
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import { trpc } from "../utils/trpc";
import * as _ from "lodash";

import { useSession } from "next-auth/react";

import data from "../data/problem_data.json"

type ProgressBarProps = {
  olympiad: string;
  userId?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ olympiad, userId }) => {
  const { status } = useSession();

  const solvedProblemsQuery = trpc.view.getSolvedSlugs.useQuery(
    { userId },
    { enabled: status === "unauthenticated" }
  );
  const [solvedSlugs, setSolvedSlugs] = React.useState<
    { problemSlug: string; status: string }[]
  >([]);
  let olympiadSlugs = data.sections
    .find((s) => s.sectionName === olympiad)
    .years.map((x) => x.problems
    .map((p) => p.slug));
  
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
      <Flex
        bg="gray.200"
        my={4}
        height="15px"
        width="100%"
        rounded="full"
        overflow="hidden"
      >
        <Popover
          isLazy
          trigger="hover"
          openDelay={10}
          closeDelay={10}
          placement="top"
        >
          <PopoverTrigger>
            <Flex
              bg="#49a75e"
              height="100%"
              width={
                String(
                  (solvedSlugs.filter((x) => x.status === "Solved").length /
                    olympiadSlugs.length) *
                    100
                ) + "%"
              }
            />
          </PopoverTrigger>
          <PopoverContent
            p={1}
            bg="#282828"
            textColor="white"
            borderColor="#282828"
            userSelect="none"
            w="auto"
          >
            <PopoverArrow bg="#282828" />
            <PopoverBody alignItems="center">
              {"Solved: " +
                String(
                  Math.round(
                    (solvedSlugs.filter((x) => x.status === "Solved").length /
                      olympiadSlugs.length) *
                      10000
                  ) / 100
                ) +
                "%"}
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover
          isLazy
          trigger="hover"
          openDelay={10}
          closeDelay={10}
          placement="top"
        >
          <PopoverTrigger>
            <Flex
              bg="#b8daff"
              height="100%"
              width={
                String(
                  (solvedSlugs.filter((x) => x.status === "Unimplemented")
                    .length /
                    olympiadSlugs.length) *
                    100
                ) + "%"
              }
            />
          </PopoverTrigger>
          <PopoverContent
            p={1}
            bg="#282828"
            textColor="white"
            borderColor="#282828"
            userSelect="none"
            w="auto"
          >
            <PopoverArrow bg="#282828" />
            <PopoverBody alignItems="center">
              {"Unimplemented: " +
                String(
                  Math.round(
                    (solvedSlugs.filter((x) => x.status === "Unimplemented")
                      .length /
                      olympiadSlugs.length) *
                      10000
                  ) / 100
                ) +
                "%"}
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover
          isLazy
          trigger="hover"
          openDelay={10}
          closeDelay={10}
          placement="top"
        >
          <PopoverTrigger>
            <Flex
              bg="#ffeeba"
              height="100%"
              width={
                String(
                  (solvedSlugs.filter((x) => x.status === "Attempting").length /
                    olympiadSlugs.length) *
                    100
                ) + "%"
              }
            />
          </PopoverTrigger>
          <PopoverContent
            p={1}
            bg="#282828"
            textColor="white"
            borderColor="#282828"
            userSelect="none"
            w="auto"
          >
            <PopoverArrow bg="#282828" />
            <PopoverBody alignItems="center">
              {"Attempting: " +
                String(
                  Math.round(
                    (solvedSlugs.filter((x) => x.status === "Attempting")
                      .length /
                      olympiadSlugs.length) *
                      10000
                  ) / 100
                ) +
                "%"}
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover
          isLazy
          trigger="hover"
          openDelay={10}
          closeDelay={10}
          placement="top"
        >
          <PopoverTrigger>
            <Flex bg="gray.200" height="100%" flex={1} />
          </PopoverTrigger>
          <PopoverContent
            p={1}
            bg="#282828"
            textColor="white"
            borderColor="#282828"
            userSelect="none"
            w="auto"
          >
            <PopoverArrow bg="#282828" />
            <PopoverBody alignItems="center">
              {"Unsolved: " +
                String(
                  Math.round(
                    ((olympiadSlugs.length - solvedSlugs.length) /
                      olympiadSlugs.length) *
                      10000
                  ) / 100
                ) +
                "%"}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </>
  );
};

export default ProgressBar;
