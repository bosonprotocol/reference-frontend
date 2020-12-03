import React from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/Header";
import ProductBlock from "../components/ProductBlock";
import CardBlock from "../components/CardBlock";
import CategoryMenu from "../components/CategoryMenu"
import NavigationBar from "../components/NavigationBar"
import ProductListing from "../components/ProductListing"

import { productBlocks, cardBlocks } from "../PlaceholderAPI"

function Home() {
  const productListSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: window.innerWidth <= 960 ? 2 : 4,
    slidesToScroll: 2
  };

  const cardListSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: window.innerWidth <= 960 ? 1 : 2,
    centerMode: window.innerWidth <= 960 ? true : false,
    centerPadding: '25px',
  };

  return (
    <div className="home atomic-scoped">
      <div className="container o-hidden">
        <Header />
        <CategoryMenu />
      </div>
      <section className="product-list">
        <div className="container">
          <Slider {...productListSettings}>
            {productBlocks.map(block => <ProductBlock {...block} />)}
          </Slider>
        </div>
      </section>
      <section className="card-list">
        <div className="container erase-right">
          <Slider {...cardListSettings}>
            {cardBlocks.map(block => <CardBlock {...block} />)}
          </Slider>
        </div>
      </section>
      <section className="home-products">
        <div className="container">
          <ProductListing />
        </div>
      </section>
      <NavigationBar />
    </div>
  )
}

export default Home
