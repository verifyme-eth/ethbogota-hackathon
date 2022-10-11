import { Flex, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      as="footer"
      marginTop={"auto"}
      height={"50px"}
      align="center"
      alignItems={"center"}
      bottom={0}
      position={"fixed"}
    >
      <Text
        padding={3}
        color={"grayLetter"}
        fontWeight="light"
        fontSize={"16px"}
      >
        Verify me ! ©. All rights reserved
      </Text>
    </Flex>
  );
}
