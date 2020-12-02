import React, { useRef } from 'react'
import './Onboarding.scss'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import EscrowDiagram from '../components/EscrowDiagram';

function slide1() {
  return(
    <>
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
    </>
  )
}

function slide2() {
  return(
    <>
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
    </>
  )
}

function slide3(completeOnboarding) {
  return(
    <>
      <div className="top">
        <div className="logo flex jc-center"><img src="images/boson-logo.png" alt="Boson Protocol Logo" className="pe-none" /></div>
        <h2 className="ta-center">Welcome to Boson Protocol</h2>
      </div>
      <div className="slide-image flex center">
        <div className="qr-display relative">
          <div className="scan">
            <div className="phone-bg flex center">
              <p>Scan the QR code</p>
              <img src="images/onboarding-slide-3-qr.svg" alt="QR Code Read"/>
            </div>
          </div>
          <div className="show"><img src="images/onboarding-slide-3-show.svg" alt="Show QR Code"/></div>
          <div className="background"><img src="images/onboarding-slide-3-net.svg" alt="Net"/></div>
        </div>
      </div>
      <div className="text flex column ai-center">
        <p className="number">3</p>
        <h1>Offer items for sale</h1>
        <p className="ta-center color-secondary">Lorem Ipsum is simply dummied text of the printing and typesetting industry.</p>
      </div>
      <div className="button primary" role="button" onClick={completeOnboarding}>START</div>
    </>
  )
}

function Onboarding(props) {
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

  return (
    <section className="onboarding relative">
      <div className="container">
        <Slider ref={slider} {...settings}>
          {sequence.map((slide, id) => 
            <div key={id} className="container atomic-scoped animate">
              <div className="screen relative flex column jc-sa">
                {slide(props.completeOnboarding)}
              </div>
            </div>
          )}
        </Slider>
      </div>
    </section>
  )
}

export default Onboarding
