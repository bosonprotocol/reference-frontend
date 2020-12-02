import React from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/Header";
import ProductBlock from "../components/ProductBlock";
import CardBlock from "../components/CardBlock";
import CategoryMenu from "../components/CategoryMenu"
import NavigationBar from "../components/NavigationBar"

import { productBlocks, cardBlocks } from "../PlaceholderAPI"

function Home() {
  const productListSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2
  };

  const cardListSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '25px',
  };
  return (
    <div className="home">
      <div className="container">
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
      <NavigationBar />
    </div>
  )
}

export default Home
