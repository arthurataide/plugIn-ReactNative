import { Dimensions } from "react-native";

import { Platform } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  GREY: "#898989",
  THEME: "#B23AFC",
  PRIMARY: "#f5b333",
  INFO: "#1232FF",
  ERROR: "red",
  WARNING: "#f6c23e",
  SUCCESS: "#45DF31",
  TRANSPARENT: "transparent",
  INPUT: "#808080",
  PLACEHOLDER: "#9FA5AA",
  NAVBAR: "#F9F9F9",
  BLOCK: "#808080",
  MUTED: "#9FA5AA",
  LIGHTGRAY: "rgba(42,44,52, 0.1)",
  FACEBOOK: "#3B5998",
  TWITTER: "#5BC0DE",
  DRIBBBLE: "#EA4C89",
  ICON: "#000000",
  TITLE: "#979ca8",
  INNER_TEXT: "#707880",
};

const SIZES = {
  BASE: 16,
  FONT: 16,
  OPACITY: 0.8,
  MAX_WIDTH: width - 10
};

const FONT = {
  DEFAULT_FONT_FAMILY: Platform.OS === "android" ? "Roboto" : "Helvetica",
};

const HORIZONTAL_ANIMATION = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

export default {
  COLORS,
  SIZES,
  FONT,
  HORIZONTAL_ANIMATION,
};
