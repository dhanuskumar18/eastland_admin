import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  "themes": {
    "light": {
      "colors": {
        "default": {
          "50": "#fafafa",
          "100": "#f2f2f3",
          "200": "#ebebec",
          "300": "#e3e3e6",
          "400": "#dcdcdf",
          "500": "#d4d4d8",
          "600": "#afafb2",
          "700": "#8a8a8c",
          "800": "#656567",
          "900": "#404041",
          "foreground": "#000",
          "DEFAULT": "#d4d4d8"
        },
        "primary": {
          "50": "#e2f6ff",
          "100": "#b8e9fe",
          "200": "#8fdbfd",
          "300": "#66cefc",
          "400": "#3cc1fc",
          "500": "#13b4fb",
          "600": "#1095cf",
          "700": "#0c75a3",
          "800": "#095677",
          "900": "#06364b",
          "foreground": "#000",
          "DEFAULT": "#13b4fb"
        },
        "secondary": {
          "50": "#e1e2e5",
          "100": "#b7b9c2",
          "200": "#8d909e",
          "300": "#64677a",
          "400": "#3a3e56",
          "500": "#101532",
          "600": "#0d1129",
          "700": "#0a0e21",
          "800": "#080a18",
          "900": "#05060f",
          "foreground": "#fff",
          "DEFAULT": "#101532"
        },
        "success": {
          "50": "#dfefe6",
          "100": "#b3d8c2",
          "200": "#86c29e",
          "300": "#59ab7a",
          "400": "#2d9557",
          "500": "#007e33",
          "600": "#00682a",
          "700": "#005221",
          "800": "#003c18",
          "900": "#00260f",
          "foreground": "#fff",
          "DEFAULT": "#007e33"
        },
        "warning": {
          "50": "#fff9e4",
          "100": "#fff1bf",
          "200": "#ffe999",
          "300": "#ffe074",
          "400": "#ffd84e",
          "500": "#ffd029",
          "600": "#d2ac22",
          "700": "#a6871b",
          "800": "#796313",
          "900": "#4d3e0c",
          "foreground": "#000",
          "DEFAULT": "#ffd029"
        },
        "danger": {
          "50": "#ffe7e7",
          "100": "#ffc5c5",
          "200": "#ffa3a3",
          "300": "#ff8181",
          "400": "#ff5f5f",
          "500": "#ff3d3d",
          "600": "#d23232",
          "700": "#a62828",
          "800": "#791d1d",
          "900": "#4d1212",
          "foreground": "#000",
          "DEFAULT": "#ff3d3d"
        },
        "background": "#FAFAFA",
        "foreground": "#000000",
        "content1": {
          "DEFAULT": "#ffffff",
          "foreground": "#000"
        },
        "content2": {
          "DEFAULT": "#f4f4f5",
          "foreground": "#000"
        },
        "content3": {
          "DEFAULT": "#e4e4e7",
          "foreground": "#000"
        },
        "content4": {
          "DEFAULT": "#d4d4d8",
          "foreground": "#000"
        },
        "focus": "#006FEE",
        "overlay": "#000000"
      }
    },
    "dark": {
      "colors": {
        "default": {
          "50": "#0d0d0e",
          "100": "#19191c",
          "200": "#26262a",
          "300": "#323238",
          "400": "#3f3f46",
          "500": "#65656b",
          "600": "#8c8c90",
          "700": "#b2b2b5",
          "800": "#d9d9da",
          "900": "#ffffff",
          "foreground": "#fff",
          "DEFAULT": "#3f3f46"
        },
        "primary": {
          "50": "#06364b",
          "100": "#095677",
          "200": "#0c75a3",
          "300": "#1095cf",
          "400": "#13b4fb",
          "500": "#3cc1fc",
          "600": "#66cefc",
          "700": "#8fdbfd",
          "800": "#b8e9fe",
          "900": "#e2f6ff",
          "foreground": "#000",
          "DEFAULT": "#13b4fb"
        },
        "secondary": {
          "50": "#05060f",
          "100": "#080a18",
          "200": "#0a0e21",
          "300": "#0d1129",
          "400": "#101532",
          "500": "#3a3e56",
          "600": "#64677a",
          "700": "#8d909e",
          "800": "#b7b9c2",
          "900": "#e1e2e5",
          "foreground": "#fff",
          "DEFAULT": "#101532"
        },
        "success": {
          "50": "#00260f",
          "100": "#003c18",
          "200": "#005221",
          "300": "#00682a",
          "400": "#007e33",
          "500": "#2d9557",
          "600": "#59ab7a",
          "700": "#86c29e",
          "800": "#b3d8c2",
          "900": "#dfefe6",
          "foreground": "#fff",
          "DEFAULT": "#007e33"
        },
        "warning": {
          "50": "#4d3e0c",
          "100": "#796313",
          "200": "#a6871b",
          "300": "#d2ac22",
          "400": "#ffd029",
          "500": "#ffd84e",
          "600": "#ffe074",
          "700": "#ffe999",
          "800": "#fff1bf",
          "900": "#fff9e4",
          "foreground": "#000",
          "DEFAULT": "#ffd029"
        },
        "danger": {
          "50": "#4d1212",
          "100": "#791d1d",
          "200": "#a62828",
          "300": "#d23232",
          "400": "#ff3d3d",
          "500": "#ff5f5f",
          "600": "#ff8181",
          "700": "#ffa3a3",
          "800": "#ffc5c5",
          "900": "#ffe7e7",
          "foreground": "#000",
          "DEFAULT": "#ff3d3d"
        },
        "background": "#FAFAFA",
        "foreground": "#ffffff",
        "content1": {
          "DEFAULT": "#18181b",
          "foreground": "#fff"
        },
        "content2": {
          "DEFAULT": "#27272a",
          "foreground": "#fff"
        },
        "content3": {
          "DEFAULT": "#3f3f46",
          "foreground": "#fff"
        },
        "content4": {
          "DEFAULT": "#52525b",
          "foreground": "#fff"
        },
        "focus": "#006FEE",
        "overlay": "#ffffff"
      }
    }
  },
  "layout": {
    "disabledOpacity": "0.5"
  },
  darkMode: "class",
  plugins: [],
}

module.exports = config;