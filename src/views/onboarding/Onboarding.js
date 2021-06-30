import "./Onboarding.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

import "swiper/swiper.min.css";

import FakeEscrowTable from "./components/fake-escrow-table/FakeEscrowTable";
import React from "react";

SwiperCore.use([Navigation, Pagination]);
const POLICY_ACCEPTED_KEY = "policy-accepted";

function slide1() {
  return (
    <>
      <div className="column-holder main-column">
        <div className="top">
          <div className="logo flex jc-left">
            <img
              src="images/onboarding/leptonite-main.png"
              alt="Leptonite Logo"
              className="pe-none"
            />
          </div>
          <h2 className="ta-left">
            <span>Welcome</span> to Leptonite
          </h2>
        </div>
        <div className="text flex column ai-center">
          <p className="number">1</p>
          <h1>Offer items for sale</h1>
          <p className="ta-center color-secondary">
            Create a Boson commitment NFT set to list your item(s) as available
            for purchase.
          </p>
        </div>
        <div className="footer color-secondary">
          ©{new Date().getFullYear()} Leptonite.io
        </div>
      </div>
      <div className="column-holder animated-column-1"></div>
    </>
  );
}

function slide2() {
  return (
    <>
      <div className="column-holder main-column">
        <div className="top">
          <div className="logo flex jc-left">
            <img
              src="images/onboarding/leptonite-main.png"
              alt="Leptonite Logo"
              className="pe-none"
            />
          </div>
          <h2 className="ta-left">
            <span>Welcome</span> to Leptonite
          </h2>
        </div>
        <div className="text flex column ai-center">
          <p className="number">2</p>
          <h1>Boson Protocol escrow code</h1>
          <p className="ta-center color-secondary">
            The escrow code is governed by the Core Exchange Mechanism which
            takes deposits from both supplier and buyer to grow trust in a p2p
            exchange.
          </p>
        </div>
        <div className="footer color-secondary">
          ©{new Date().getFullYear()} Leptonite.io
        </div>
      </div>
      <div className="column-holder animated-column">
        <div className="slide-image center-flex">
          <FakeEscrowTable />
        </div>
      </div>
    </>
  );
}

function slide3() {
  return (
    <>
      <div className="column-holder main-column">
        <div className="top">
          <div className="logo flex jc-left">
            <img
              src="images/onboarding/leptonite-main.png"
              alt="Leptonite Logo"
              className="pe-none"
            />
          </div>
          <h2 className="ta-left">
            <span>Welcome</span> to Leptonite
          </h2>
        </div>
        <div className="text flex column ai-center">
          <p className="number">3</p>
          <h1>Disclaimer</h1>
        </div>
        <div className="footer color-secondary">
          ©{new Date().getFullYear()} Leptonite.io
        </div>
      </div>

      <div className="column-holder animated-column">
        <div className="policy-holder">
          <div className="policy-text color-secondary">
            <div className="policy-header">
              UNAUDITED TESTNET ALPHA RELEASE:
            </div>
            <div className="policy-content">
              Leptonite is still undergoing extensive development before mainnet
              release. LEPTONITE IS PROVIDED "AS IS" AND "AS AVAILABLE", AT YOUR
              OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.
              <br />
              Do not send mainnet assets to Leptonite. Your assets will be lost
              and will be unrecoverable.
              <br />
              We will not be liable for any loss, whether such loss is direct,
              indirect, special or consequential, suffered by any party as a
              result of their use of Leptonite.
            </div>
          </div>
          <div className="divider"></div>
          <div className="accept-policy-holder">
            <label className="checkbox">
              <span className="checkbox__input">
                <input type="checkbox" name="checkbox" onClick={handleClick} />
                <span className="checkbox__control">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="none"
                      stroke="#80F0BE"
                      strokeWidth="3"
                      d="M1.73 12.91l6.37 6.37L22.79 4.59"
                    />
                  </svg>
                </span>
              </span>
              <span className="radio__label color-secondary">
                I've read and accept the disclaimer above
              </span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

function handleClick(e) {
  localStorage.setItem(POLICY_ACCEPTED_KEY, e?.target?.checked);

  if (e?.target?.checked) {
    document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
      el.classList.remove("swiper-button-disabled");
    });
  } else {
    document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
      el.classList.add("swiper-button-disabled");
    });
  }
}

function slide4(completeOnboarding) {
  return (
    <>
      <div className="column-holder main-column">
        <div className="top">
          <div className="logo flex jc-left">
            <img
              src="images/onboarding/leptonite-main.png"
              alt="Leptonite Logo"
              className="pe-none"
            />
          </div>
          <h2 className="ta-left">
            <span>Welcome</span> to Leptonite
          </h2>
        </div>
        <div className="text flex column ai-center">
          <p className="number">4</p>
          <h1>Redeem</h1>
          <p className="ta-center color-secondary">
            When the seller hands over the item, the buyer signs the redemption
            which transfers the funds to the seller.
          </p>
        </div>
        <div
          className="primary complete-onboarding"
          role="button"
          onClick={completeOnboarding}
        >
          START
        </div>
        <div className="footer color-secondary">
          ©{new Date().getFullYear()} Leptonite.io
        </div>
      </div>

      <div className="column-holder animated-column">
        <div className="slide-image flex center">
          <div className="qr-display relative">
            <div className="scan">
              <div className="phone-bg flex center">
                <p>Scan the QR code</p>
                <img
                  src="images/onboarding/onboarding-slide-3-qr.svg"
                  alt="QR Code Read"
                />
              </div>
            </div>
            <div className="show">
              <img
                src="images/onboarding/onboarding-slide-3-show.svg"
                alt="Show QR Code"
              />
            </div>
            <div className="background">
              <img
                src="images/onboarding/onboarding-slide-3-net.svg"
                alt="Net"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Onboarding(props) {
  const initialSlide = localStorage.getItem("onboarding-slide");

  if (+initialSlide === 2) {
    document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
      el.classList.add("swiper-button-disabled");
    });
  }

  const playSlide = (currentSlide) => {
    const policyAccepted = localStorage.getItem(POLICY_ACCEPTED_KEY);

    const isPolicyAccepted = policyAccepted === "true";

    if (isPolicyAccepted && currentSlide === 2) {
      document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
        el.classList.remove("swiper-button-disabled");
      });
    }

    if (!isPolicyAccepted && currentSlide === 2) {
      document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
        el.classList.add("swiper-button-disabled");
      });
    }

    if (currentSlide === 3) {
      document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
        el.classList.add("swiper-button-disabled");
        el.classList.add("last-slide");
      });
    }

    if (currentSlide < 2) {
      document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
        el.classList.remove("swiper-button-disabled");
      });
    }

    if (currentSlide < 3) {
      document.querySelectorAll(`.swiper-button-next`).forEach((el) => {
        el.classList.remove("last-slide");
      });
    }

    // reactize later
    document.querySelectorAll(`.onboarding [data-slide]`).forEach((slide) => {
      slide.classList.add("pause");
    });
    document
      .querySelector(`.onboarding [data-slide="${currentSlide}"]`)
      .classList.remove("pause");

    localStorage.setItem("onboarding-slide", currentSlide.toString());
  };

  const allowSlideNextDelayed = (swiper) => {
    const LOCAL_STORAGE_TIMEOUT_MS = 200;

    setTimeout(() => {
      const policyAccepted = localStorage.getItem(POLICY_ACCEPTED_KEY);
      const isPolicyAccepted = policyAccepted === "true";

      swiper.allowSlideNext = !(swiper.activeIndex === 2 && !isPolicyAccepted);
    }, LOCAL_STORAGE_TIMEOUT_MS);
  };

  const sequence = [slide1, slide2, slide3, slide4];

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
          onSlideChangeTransitionStart={(swiper) =>
            allowSlideNextDelayed(swiper)
          }
          onClick={(swiper) => allowSlideNextDelayed(swiper)}
        >
          {sequence.map((slide, id) => (
            <SwiperSlide key={id}>
              <div
                data-slide={id}
                className="container atomic-scoped animate pause"
              >
                <div className="screen relative flex jc-sb">
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
