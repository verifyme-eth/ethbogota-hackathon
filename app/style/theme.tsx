import { extendTheme } from "@chakra-ui/react";

import { StepsStyleConfig } from "chakra-ui-steps";

const CustomSteps = {
  ...StepsStyleConfig,
  baseStyle: (props: any) => {
    return {
      ...StepsStyleConfig.baseStyle(props),
      icon: {
        ...StepsStyleConfig.baseStyle(props).icon,
        // your custom styles here
        strokeWidth: "2px",
        color: "white",
      },
      stepIconContainer: {
        ...StepsStyleConfig.baseStyle(props).stepContainer,
        // your custom styles here
        bg: "#757575",
        borderColor: "#757575",
        color: "white",
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
        _highlighted: {
          bg: "#F72585",
          borderColor: "#F72585",
        },
      },
      connector: {
        ...StepsStyleConfig.baseStyle(props).connector,
        // your custom styles here
        borderColor: "#757575",
        opacity: 0.3,
        _highlighted: {
          borderColor: "#F72585",
          opacity: 1.0,
        },
      },
      labelContainer: {
        ...StepsStyleConfig.baseStyle(props).labelContainer,
        // your custom styles here
        width: "45%",
      },
      label: {
        ...StepsStyleConfig.baseStyle(props).label,
        // your custom styles here
        fontSize: "sm",
      },
    };
  },
};

export const theme = extendTheme({
  fonts: {
    heading: "Plus Jakarta Sans, sans-serif",
    body: "Plus Jakarta Sans, sans-serif",
  },
  colors: {
    first: "#ffbe0b",
    second: "#3A86FF",
    third: "#FF006E",
  },
  components: {
    Steps: CustomSteps,
  },
});
