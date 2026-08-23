const light = {
  paper: "#FFFFFF",
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
    DEFAULT: "#F7F7F7",
    muted: "#F7F7F7",
  },
  border: {
    DEFAULT: "#E5E5E5",
  },
};

const dark = {
  paper: "#1A1A1A",
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
    DEFAULT: "#111111",
    muted: "#111111",
  },
  border: {
    DEFAULT: "#2A2A2A",
  },
};

const theme = { colors: light };

module.exports = { theme, light, dark };
