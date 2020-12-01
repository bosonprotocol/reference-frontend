import React from 'react'

import "./Home.scss"

import Slider from "react-slick";
import ProductBlock from "../components/ProductBlock";

function Home() {
  const productListSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2
  };
  return (
    <section className="home">
      <div className="container">
        <header className="flex jc-sb ai-center">
          <h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>
          <nav className="flex ai-center">
            <div className="search flex center" role="button"><img src="images/search-icon.svg" alt="Search"/> <p>Search</p></div>
            <div className="qr-icon" role="button"><img src="images/qr-icon.svg" alt="Scan QR"/></div>
          </nav>
        </header>
        <div className="category-menu flex ai-center">
          <p className="selected-item">New</p>
          <div className="category-container">
            <ul className="flex ai-center">
              <li>Electronics</li>
              <li>Shoes</li>
              <li>Health &#38; Beauty- internal link</li>
              <li>Electronics</li>
              <li>Shoes</li>
            </ul>
          </div>
        </div>
        <div className="product-list">
          <Slider {...productListSettings}>
            <ProductBlock />
            <ProductBlock />
            <ProductBlock />
            <ProductBlock />
            <ProductBlock />
            <ProductBlock />
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default Home
