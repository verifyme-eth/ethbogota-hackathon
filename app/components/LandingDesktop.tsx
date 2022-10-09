import { Flex, Spacer, Box, Text, Image, Icon } from "@chakra-ui/react";

import { FaTwitterSquare } from "react-icons/fa";

import logo from "../../public/assets/LogoCompleto.png";
import iphone from "../../public/assets/iphone.png";
import gif from "../../public/assets/vme.gif";

function Landing() {
  return (
    <Flex flexDirection="column" h="calc(100vh)">
      <Flex justifyContent="space-between" h="calc(12vh)" pr="2rem" pl="1rem">
        <Flex p="1rem" dir="column" alignItems="center">
          <Image maxH="4rem" src={logo} alt="logo" />
        </Flex>
        <Spacer />
        <Flex p="1rem" dir="column" alignItems="center">
          <Icon fontSize="4xl" color="green.800" as={FaTwitterSquare} />
        </Flex>
      </Flex>
      <Flex h="calc(80vh)" justifyContent="space-around">
        <Flex flexDirection="column" justifyContent="space-evenly">
          <Flex flexDirection="column" justifyContent="start" pt="5rem">
            <Text fontSize="4xl" as="b">
              Let's keep social
            </Text>
            <Text fontSize="4xl" as="b">
              Let's keep moving
            </Text>
          </Flex>
          <Flex justifyContent="end" pb="2rem">
            <Text fontSize="4xl" as="b">
              ... go mobile
            </Text>
          </Flex>
          <Flex>
            <Text>
              Sorry! we are{" "}
              <Text as="span" color="green.300">
                mobile
              </Text>{" "}
              only, to get the best experience visit us on your favorite
              handset.
            </Text>
          </Flex>
          <Flex justifyContent="center">
            <Image maxW="20rem" src={gif} alt="gif" />
          </Flex>
        </Flex>
        <Flex flexDirection="column" justifyContent="center">
          <Image maxW="18rem" src={iphone} alt="iphone" />
        </Flex>
      </Flex>
      <Box h="calc(8vh)" bg="orange.100"></Box>
    </Flex>
  );
}

export { Landing };
