export const themeColor = {
  c1: "#dc143c", // "crimson"
  c2: "#c11f6d",
  c3: "#923d88",
  c4: "#5c4b8a",
  c5: "#344e76",
  c6: "#2f4858",
};

export const style = {
  canvasFonts: {
    hud: "18px sans-serif",
    pause: "italic 1.5rem monospace",
    menu: "1.7rem monospace",
    credits: "0.9rem monospace",
    menuControls: "1.5rem monospace",
    debug: "0.9rem sans-serif",
    debugSize: 16,
  },
  debugColor: {
    text: "white",
    shadow: "black",
  },
  menuColor: {
    bg: themeColor.c6,
    button: themeColor.c3,
    buttonSelected: themeColor.c2,
    buttonText: "black",
    pageLabel: themeColor.c1,
    text: themeColor.c1,
    credits: themeColor.c1,
    controls: themeColor.c1,
  },
  hud: {
    alpha: 0.3,
  },
  hudColor: {
    pauseBox: "darkgrey",
    pauseText: "purple",
    healthBg: "black",
    healthLow: "crimson",
    healthMed: "yellow",
    healthMax: "lightgreen",
    ability: "darkblue",
    weaponBg: "black",
    weapon: "lightblue",
  },
  worldColor: {
    bg: "teal",
    edge: "grey",
  },
  playerColor: {
    fill: "yellow",
    outline: "red",
  },
  entityColor: {
    default: "black",
  },
  enemyColor: {
    normal: "purple",
    fast: "orange",
    slow: "crimson",
  },
};
