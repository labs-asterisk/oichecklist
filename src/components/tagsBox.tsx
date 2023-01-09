import { Flex, Box, Text } from "@chakra-ui/react";
import Link from "next/link";



interface TagsBoxProps {
  typeTags: string[];
  editorial: string;
  solveCount: number;
}

const TagsBox: React.FC<TagsBoxProps> = ({
  typeTags, editorial, solveCount,
}) => {

  return (
    <Flex width="100%" flexWrap="wrap" alignItems="center" gap={2}>

      {typeTags.map((typeTag) => (
        <Box
          px={3}
          py={1}
          bgColor="#3F3E3F"
          borderRadius="20px"
          textColor="#C3C4C8"
          key={typeTag}
        >
          <Text fontSize="14px" whiteSpace="nowrap" align="center">
            {typeTag}
          </Text>
        </Box>
      ))}
      <Box
        px={3}
        py={1}
        bgColor="#3F3E3F"
        borderRadius="20px"
        textColor="#C3C4C8"
      >
        <Link href={editorial} >
          <Text fontSize="14px" whiteSpace="nowrap" align="center">
            Editorial
          </Text>
        </Link>
      </Box>
      {solveCount < 0 ? <></> :
        <Box
          px={3}
          py={1}
          bgColor="#3F3E3F"
          borderRadius="20px"
          textColor="#C3C4C8"
        >
          <Text fontSize="14px" whiteSpace="nowrap" align="center">
            {"Solves: " + solveCount.toString()}
          </Text>
        </Box>
      }
    </Flex>
  );
};

export default TagsBox;
