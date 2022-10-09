import { Flex, Spacer, Box, Text, Image, Icon } from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";
import { Landing } from "../components/LandingDesktop";

import { FaTwitterSquare } from "react-icons/fa";

import logo from "../../public/assets/LogoCompleto.png";
import iphone from "../../public/assets/iphone.png";
import gif from "../../public/assets/vme.gif";

export const loader: LoaderFunction = async () => {
  return { message: "Hello World" };
};

export default function Index() {
  return <Landing />;
}
