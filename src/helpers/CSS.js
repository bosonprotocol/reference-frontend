export const bgColorPrimary = '#000000'
export const bgColorSecondary = '#161B21'
export const cssBackgroundColor = '--page-color'
export const updateCssVar = (prop, value) => document.documentElement.style.setProperty(prop, value)
export const updateBackgroundColor = (value) => document.documentElement.style.setProperty(cssBackgroundColor, value)