const { heroui } = require("@heroui/react");
import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const config: Config = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        trueGray: colors.neutral,
      },
    },
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      stock: [defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [heroui({
      "themes": {
    "light": {
      "colors": {
        "primary": {
          "50": "#DFF0F9",
          "100": "#D6E4FE",
          "200": "#AEC8FD",
          "300": "#86A9FB",
          "400": "#678EF7",
          "500": "#3665F3",
          "600": "#274DD0",
          "700": "#1B38AE",
          "800": "#11268C",
          "900": "#0A1974",
          "foreground": "#fff",
          "DEFAULT": "#3665F3"
        },
        "success": {
          "50": "#F4FAD7",
          "100": "#C8F8CB",
          "200": "#95F2A4",
          "300": "#5CD97D",
          "400": "#32B461",
          "500": "#05823f",
          "600": "#036F40",
          "700": "#025D3E",
          "800": "#014B39",
          "900": "#003E36",
          "foreground": "#fff",
          "DEFAULT": "#05823f"
        },
        "warning": {
          "50": "#FFFAE2",
          "100": "#FEF5CB",
          "200": "#FEE998",
          "300": "#FCD964",
          "400": "#F9C93E",
          "500": "#F5AF00",
          "600": "#D29000",
          "700": "#B07300",
          "800": "#8E5800",
          "900": "#754600",
          "foreground": "#000",
          "DEFAULT": "#F5AF00"
        },
        "danger": {
          "50": "#FFF4EF",
          "100": "#FCDDCC",
          "200": "#FCBFAD",
          "300": "#F28068",
          "400": "#E55042",
          "500": "#d50b0b",
          "600": "#B70817",
          "700": "#99051F",
          "800": "#7B0322",
          "900": "#660224",
          "foreground": "#fff",
          "DEFAULT": "#d50b0b"
        }
      }
    },
    "dark": {
      "colors": {
        "primary": {
          "50": "#DFF0F9",
          "100": "#D6E4FE",
          "200": "#AEC8FD",
          "300": "#86A9FB",
          "400": "#678EF7",
          "500": "#3665F3",
          "600": "#274DD0",
          "700": "#1B38AE",
          "800": "#11268C",
          "900": "#0A1974",
          "foreground": "#fff",
          "DEFAULT": "#3665F3"
        },
        "success": {
          "50": "#F4FAD7",
          "100": "#C8F8CB",
          "200": "#95F2A4",
          "300": "#5CD97D",
          "400": "#32B461",
          "500": "#05823f",
          "600": "#036F40",
          "700": "#025D3E",
          "800": "#014B39",
          "900": "#003E36",
          "foreground": "#000",
          "DEFAULT": "#05823f"
        },
        "warning": {
          "50": "#FFFAE2",
          "100": "#FEF5CB",
          "200": "#FEE998",
          "300": "#FCD964",
          "400": "#F9C93E",
          "500": "#F5AF00",
          "600": "#D29000",
          "700": "#B07300",
          "800": "#8E5800",
          "900": "#754600",
          "foreground": "#000",
          "DEFAULT": "#F5AF00"
        },
        "danger": {
          "50": "#FFF4EF",
          "100": "#FCDDCC",
          "200": "#FCBFAD",
          "300": "#F28068",
          "400": "#E55042",
          "500": "#d50b0b",
          "600": "#B70817",
          "700": "#99051F",
          "800": "#7B0322",
          "900": "#660224",
          "foreground": "#000",
          "DEFAULT": "#d50b0b"
        }
      }
    }
  }
  })],
};
export default config;
