import "./Onboarding.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

import "swiper/swiper.min.css";

import EscrowDiagram from "../components/shared/EscrowDiagram";

SwiperCore.use([Navigation, Pagination]);

function slide1() {
  return (
    <>
      <div className="top">
        <div className="logo flex jc-center">
          <img
            src="images/boson/boson-logo.png"
            alt="Boson Protocol Logo"
            className="pe-none"
          />
        </div>
        <h2 className="ta-center">Welcome to Boson Protocol</h2>
      </div>
      <div className="slide-image flex center">
        <img
          src="images/onboarding/onboarding-slide-1.jpg"
          alt="Boson Network"
          className="pe-none"
        />
      </div>
      <div className="text flex column ai-center">
        <p className="number">1</p>
        <h1>Offer items for sale</h1>
        <p className="ta-center color-secondary">
          Lorem Ipsum is simply dummied text of the printing and typesetting
          industry.
        </p>
      </div>
    </>
  );
}

function slide2() {
  return (
    <>
      <div className="top">
        <div className="logo flex jc-center">
          <img
            src="images/boson/boson-logo.png"
            alt="Boson Protocol Logo"
            className="pe-none"
          />
        </div>
        <h2 className="ta-center">Welcome to Boson Protocol</h2>
      </div>
      <div className="slide-image center-flex">
        <EscrowDiagram />
      </div>
      <div className="text flex column ai-center">
        <p className="number">2</p>
        <h1>Offer items for sale</h1>
        <p className="ta-center color-secondary">
          Lorem Ipsum is simply dummied text of the printing and typesetting
          industry.
        </p>
      </div>
    </>
  );
}

function slide3(completeOnboarding) {
  return (
    <>
      <div className="top">
        <div className="logo flex jc-center">
          <img
            src="images/boson/boson-logo.png"
            alt="Boson Protocol Logo"
            className="pe-none"
          />
        </div>
        <h2 className="ta-center">Welcome to Boson Protocol</h2>
      </div>
      <div className="slide-image flex center">
        <div className="qr-display relative">
          <div className="scan">
            <div className="phone-bg flex center">
              <p>Scan the QR code</p>
              <img src="images/onboarding/onboarding-slide-3-qr.svg" alt="QR Code Read" />
            </div>
          </div>
          <div className="show">
            <img src="images/onboarding/onboarding-slide-3-show.svg" alt="Show QR Code" />
          </div>
          <div className="background">
            <img src="images/onboarding/onboarding-slide-3-net.svg" alt="Net" />
          </div>
        </div>
      </div>
      <div className="text flex column ai-center">
        <p className="number">3</p>
        <h1>Offer items for sale</h1>
        <p className="ta-center color-secondary">
          Lorem Ipsum is simply dummied text of the printing and typesetting
          industry.
        </p>
      </div>
      <div
        className="button primary"
        role="button"
        onClick={completeOnboarding}
      >
        START
      </div>
    </>
  );
}

function Onboarding(props) {
  const initialSlide = localStorage.getItem("onboarding-slide");

  const playSlide = (currentSlide) => {
    // reactize later
    document.querySelectorAll(`.onboarding [data-slide]`).forEach((slide) => {
      slide.classList.add("pause");
    });
    document
      .querySelector(`.onboarding [data-slide="${currentSlide}"]`)
      .classList.remove("pause");

    localStorage.setItem("onboarding-slide", currentSlide.toString());
  };

  const sequence = [slide1, slide2, slide3];

  return (
    <section className="onboarding relative">
      <div className="container">
        <Swiper
          spaceBetween={20}
          navigation
          pagination
          slidesPerView={1}
          threshold={6}
          loop={false}
          shortSwipes={true}
          resistance={true}
          observer={true}
          observeParents={true}
          onSlideChange={(slider) => playSlide(slider.snapIndex)}
          initialSlide={initialSlide ? initialSlide : 0}
        >
          {sequence.map((slide, id) => (
            <SwiperSlide key={id}>
              <div
                data-slide={id}
                className="container atomic-scoped animate pause"
              >
                <div className="screen relative flex column jc-sb">
                  {slide(props.completeOnboarding)}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Onboarding;
