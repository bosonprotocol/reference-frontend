// classifies how many elements from each section to animate

const isMobile = window.innerWidth <= 960

// home
export const animateEl = {
  'PL': isMobile ? 2 : 4, // product list
  'CL': isMobile ? 1 : 2, // category list
  'HP': isMobile ? 4 : 6, // home products
}

// note that the result correlates with the number of elements animated ∑{animateEl*(50ms)}
export const animateDel = {
  'PL': 3,
  // 'CL': 50,
  'HP': 4,
  'NAV': 400, // in miliseconds
}