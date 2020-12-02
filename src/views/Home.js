import React, { useState, useEffect } from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/Header";
import ProductBlock from "../components/ProductBlock";
import CardBlock from "../components/CardBlock";
import CategoryMenu from "../components/CategoryMenu"
import NavigationBar from "../components/NavigationBar"

import { productBlocks, cardBlocks, homeProducts } from "../PlaceholderAPI"

function Home() {
  const [homeProductsState, setHomeProductsState] = useState(homeProducts)

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

  const getHomeProductSplice = (part) => {
    return part === 1 ?
    homeProductsState.splice(0,Math.ceil(homeProductsState.length / 2)) :
    homeProductsState.splice(Math.ceil(homeProductsState.length / 2) - 1,homeProductsState.length)
  }

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
      <section className="home-products">
        <div className="container">
          <div className="home-products-listing col-grid">
            <div className="col-2">
            {/* {getHomeProductSplice(1)} */}
            </div>
            <div className="col-2">

            </div>
          </div>
        </div>
      </section>
      <NavigationBar />
    </div>
  )
}

export default Home
