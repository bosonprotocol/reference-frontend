export const bgColorPrimary = "21, 30, 39";
export const bgColorBlack = "0, 0, 0";
export const bgColorSecondary = "22, 27, 33";
export const cssBackgroundColor = "--page-color";
export const updateCssVar = (prop, value) =>
  document.documentElement.style.setProperty(prop, value);
export const updateBackgroundColor = (value) =>
  document.documentElement.style.setProperty(cssBackgroundColor, value);