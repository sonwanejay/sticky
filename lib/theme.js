const light = {
  paper: "#FAF9F6",
  ink: {
    DEFAULT: "#1C1917",
    secondary: "#57534E",
    muted: "#A8A29E",
  },
  accent: {
    DEFAULT: "#C2710C",
    soft: "#FFF7ED",
  },
  card: {
    DEFAULT: "#FFFFFF",
    muted: "#F0EBE3",
  },
  border: {
    DEFAULT: "#E8E2D9",
  },
};

const dark = {
  paper: "#121212",
  ink: {
    DEFAULT: "#EDEBE8",
    secondary: "#A8A29E",
    muted: "#6B6560",
  },
  accent: {
    DEFAULT: "#F0A54A",
    soft: "#3D2A14",
  },
  card: {
    DEFAULT: "#1E1E1E",
    muted: "#252220",
  },
  border: {
    DEFAULT: "#3A3630",
  },
};

const theme = { colors: light };

module.exports = { theme, light, dark };
