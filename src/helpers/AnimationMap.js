const isMobile = window.innerWidth <= 960


// home
export const animateEl = {
  'PL': isMobile ? 2 : 4,
  'CL': isMobile ? 1 : 2,
  'HP': isMobile ? 2 : 6,
}

export const animateDel = {
  'PL': 1,
  'CL': 7,
  'HP': 5,
  'NAV': 400,
}