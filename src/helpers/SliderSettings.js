const isMobile = window.innerWidth <= 960


// home
export const productListSettings = {
  dots: false,
  arrows: isMobile ? false : true,
  infinite: true,
  speed: 500,
  slidesToShow: isMobile ? 2 : 4,
  slidesToScroll: 2,
  autoplay: isMobile ? false : true,
  autoplaySpeed: 5000,
};

export const cardListSettings = {
  dots: false,
  arrows: isMobile ? false : true,
  infinite: true,
  speed: 500,
  slidesToShow: isMobile ? 1 : 2,
  centerMode: isMobile ? true : false,
  centerPadding: '25px',
  autoplay: isMobile ? false : true,
  autoplaySpeed: 5000,
};