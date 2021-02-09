export const bgColorPrimary = '0, 0, 0'
export const bgColorSecondary = '22, 27, 40'
export const cssBackgroundColor = '--page-color'
export const updateCssVar = (prop, value) => document.documentElement.style.setProperty(prop, value)
export const updateBackgroundColor = (value) => document.documentElement.style.setProperty(cssBackgroundColor, value)