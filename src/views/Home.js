import React from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/Header";
import ProductBlock from "../components/ProductBlock";
import CardBlock from "../components/CardBlock";
import CategoryMenu from "../components/CategoryMenu"

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
    <section className="home">
      <div className="container">
        <Header />
        <CategoryMenu />
        <div className="product-list">
          <Slider {...productListSettings}>
            {productBlocks.map(block => <ProductBlock {...block} />)}
          </Slider>
        </div>
        <div className="card-list">
          <Slider {...cardListSettings}>
            {cardBlocks.map(block => <CardBlock {...block} />)}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default Home
