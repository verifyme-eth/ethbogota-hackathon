import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Plus Jakarta Sans, sans-serif",
    body: "Plus Jakarta Sans, sans-serif",
  },
  components: {
    // Button: {
    // }
  },
  colors: {
    primary: "#ffbe0b",
    secondary: "#3A86FF",
    third: "#FF006E",
    defiForPeople: "#3A0CA3",
    ioled: "#05DBB2",
    botonVerde: "#FFBE0B",
  },
  config: {
    initialColorMode: "light",
  },
});
