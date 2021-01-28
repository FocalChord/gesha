import { Flex, Text } from "@chakra-ui/core";
import React from "react";
import { colors as c } from "./colors";

const Title = ({ title }) => {
  let str = "";
  if (title !== "") {
    str =
      title === "true"
        ? ", Connected to the Grid"
        : ", Not Connected to the grid";
  }

  return (
    <Flex direction="column">
      <Flex>
        <Text color={c.white} fontSize="4xl">
          Smart Home Hub
        </Text>
      </Flex>
      <Flex alignContent="center" justifyContent="center">
        <Text align="center" color={c.white} fontSize="2xl">
          Owner: Nisarag {str}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Title;
