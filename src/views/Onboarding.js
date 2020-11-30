import React, { useEffect, useRef } from 'react'
import './Onboarding.scss'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import EscrowDiagram from '../components/EscrowDiagram';

function slide1(id) {
  return(
    <div key={id} className="container h-100">
      <div className="screen flex column jc-sa">
        <div className="top">
          <div className="logo flex jc-center"><img src="images/boson-logo.png" alt="Boson Protocol Logo" className="pe-none" /></div>
          <h2 className="ta-center">Welcome to Boson Protocol</h2>
        </div>
        <div className="slide-image flex center"><img src="images/onboarding-slide-1.jpg" alt="Boson Network" className="pe-none"/></div>
        <div className="text flex column ai-center">
          <p className="number">1</p>
          <h1>Offer items for sale</h1>
          <p className="ta-center color-secondary">Lorem Ipsum is simply dummied text of the printing and typesetting industry.</p>
        </div>
      </div>
    </div>
  )
}

function slide2(id) {
  return(
    <div key={id} className="container h-100">
      <div className="screen flex column jc-sa">
        <div className="top">
          <div className="logo flex jc-center"><img src="images/boson-logo.png" alt="Boson Protocol Logo" className="pe-none" /></div>
          <h2 className="ta-center">Welcome to Boson Protocol</h2>
        </div>
        <div className="slide-image">
          <EscrowDiagram />
        </div>
        <div className="text flex column ai-center">
          <p className="number">2</p>
          <h1>Offer items for sale</h1>
          <p className="ta-center color-secondary">Lorem Ipsum is simply dummied text of the printing and typesetting industry.</p>
        </div>
      </div>
    </div>
  )
}

function slide3(id) {
  return(
    <div key={id} className="container h-100">
      <div className="screen flex column jc-sa">
        <div className="top">
          <div className="logo flex jc-center"><img src="images/boson-logo.png" alt="Boson Protocol Logo" className="pe-none" /></div>
          <h2 className="ta-center">Welcome to Boson Protocol</h2>
        </div>
        <div className="slide-image flex center"><img src="images/onboarding-slide-3-temp.png" alt="Boson Network" className="pe-none"/></div>
        <div className="text flex column ai-center">
          <p className="number">3</p>
          <h1>Offer items for sale</h1>
          <p className="ta-center color-secondary">Lorem Ipsum is simply dummied text of the printing and typesetting industry.</p>
        </div>
      </div>
    </div>
  )
}

function Onboarding() {
  const slider = useRef()
  const currentSlideMemo = localStorage.getItem('onboarding-slide')

  const settings = {
    dots: true,
    infinite: false,
    adaptiveHeight: true,
    arrows: false,
    accessibility: true,
    initialSlide: currentSlideMemo ? parseInt(currentSlideMemo) : 0,
    afterChange: (currentSlide) => localStorage.setItem('onboarding-slide', (currentSlide).toString()),
  };

  const sequence = [
    slide1,
    slide2,
    slide3,
  ]

  // let sliderMemo;

  // useEffect(() => {
  //   sliderMemo = localStorage.getItem('onboarding-slide'); 
  //   sliderMemo && slider.current.slickGoTo(parseInt(sliderMemo))
  // }, [])

  return (
    <section className="onboarding relative h-100">
      <Slider ref={slider} {...settings}>
        {sequence.map((slide, id) => slide(id))}
      </Slider>
    </section>
  )
}

export default Onboarding
