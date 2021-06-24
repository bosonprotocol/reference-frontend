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
          <h1>Boson Protocol escrow </h1>
          <p className="ta-center color-secondary">
            The escrow is governed by the Core Exchange Mechanism which takes
            deposits from both supplier and buyer to grow trust in a p2p
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
          <p className="ta-center color-secondary">
            This is placeholder text for where our disclaimer and checkbox for
            accepting the disclaimer's terms will be.
          </p>
        </div>
        <div className="footer color-secondary">
          ©{new Date().getFullYear()} Leptonite.io
        </div>
      </div>

      <div className="column-holder animated-column">
        <div className="policy-holder">
          <div className="policy-text color-secondary">
            <div className="policy-header">ABOUT THIS POLICY</div>
            <div className="policy-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis
              egestas integer eget aliquet nibh. Nunc consequat interdum varius
              sit. Nisl suscipit adipiscing bibendum est ultricies integer.
              Dignissim cras tincidunt lobortis feugiat vivamus. Condimentum
              mattis pellentesque id nibh tortor id aliquet lectus proin. Sed
              odio morbi quis commodo. Facilisi cras fermentum odio eu feugiat.
              Tellus pellentesque eu tincidunt tortor aliquam nulla facilisi
              cras. Faucibus turpis in eu mi. Placerat duis ultricies lacus sed.
              Pretium quam vulputate dignissim suspendisse in est ante in nibh.
              Convallis tellus id interdum velit laoreet. Maecenas pharetra
              convallis posuere morbi leo urna. Sed libero enim sed faucibus.
              Elementum facilisis leo vel fringilla est ullamcorper eget. Urna
              cursus eget nunc scelerisque viverra mauris. Neque vitae tempus
              quam pellentesque nec nam aliquam. Iaculis urna id volutpat lacus.
              Fermentum iaculis eu non diam phasellus vestibulum lorem. Risus
              nullam eget felis eget. Lorem dolor sed viverra ipsum nunc aliquet
              bibendum enim facilisis. Pulvinar etiam non quam lacus suspendisse
              faucibus interdum posuere. Quis imperdiet massa tincidunt nunc
              pulvinar sapien et ligula. Ipsum suspendisse ultrices gravida
              dictum. Quam id leo in vitae turpis massa sed elementum tempus.
              Duis at consectetur lorem donec massa sapien faucibus et molestie.
              Et magnis dis parturient montes nascetur ridiculus mus. Sed
              elementum tempus egestas sed sed risus. Mauris commodo quis
              imperdiet massa tincidunt nunc pulvinar sapien et. Nec nam aliquam
              sem et. Phasellus vestibulum lorem sed risus ultricies tristique.
              Adipiscing enim eu turpis egestas pretium aenean pharetra magna
              ac. Nibh venenatis cras sed felis eget. Est placerat in egestas
              erat imperdiet sed euismod. Diam vel quam elementum pulvinar etiam
              non. Enim nulla aliquet porttitor lacus luctus accumsan tortor
              posuere. Ac ut consequat semper viverra nam libero justo laoreet
              sit. Odio morbi quis commodo odio aenean. Arcu non odio euismod
              lacinia at. Netus et malesuada fames ac. Habitasse platea dictumst
              quisque sagittis. Tellus cras adipiscing enim eu. Ac turpis
              egestas integer eget aliquet nibh praesent tristique magna.
              Sagittis purus sit amet volutpat consequat mauris nunc. Dictum non
              consectetur a erat nam at lectus urna duis. Elit sed vulputate mi
              sit amet mauris commodo quis. Diam quam nulla porttitor massa id
              neque aliquam vestibulum. Ac orci phasellus egestas tellus rutrum
              tellus. Tempus quam pellentesque nec nam aliquam sem et tortor
              consequat. Erat pellentesque adipiscing commodo elit at. Quis
              varius quam quisque id. Blandit massa enim nec dui nunc. Rhoncus
              mattis rhoncus urna neque viverra justo nec ultrices dui. Nisl
              purus in mollis nunc sed id. Nec tincidunt praesent semper
              feugiat. Fringilla phasellus faucibus scelerisque eleifend donec
              pretium vulputate. Id aliquet lectus proin nibh nisl condimentum
              id venenatis. Pellentesque id nibh tortor id. Volutpat ac
              tincidunt vitae semper. Et netus et malesuada fames ac turpis
              egestas. Ut consequat semper viverra nam libero justo. Sit amet
              porttitor eget dolor morbi non arcu risus quis. Egestas fringilla
              phasellus faucibus scelerisque. In hendrerit gravida rutrum
              quisque non tellus orci ac auctor. Sed ullamcorper morbi tincidunt
              ornare massa eget. Consectetur purus ut faucibus pulvinar
              elementum integer enim neque volutpat. Nam aliquam sem et tortor
              consequat id. In egestas erat imperdiet sed euismod nisi porta
              lorem. Enim blandit volutpat maecenas volutpat blandit. Sit amet
              commodo nulla facilisi nullam vehicula ipsum. Amet nisl suscipit
              adipiscing bibendum est ultricies integer. Arcu non sodales neque
              sodales ut etiam sit. Id consectetur purus ut faucibus pulvinar
              elementum integer. Non arcu risus quis varius quam quisque id diam
              vel. A erat nam at lectus urna duis. Morbi tincidunt ornare massa
              eget egestas purus viverra accumsan.
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
                I accept these{" "}
                <a href={"#"} target={"_blank"}>
                  terms
                </a>{" "}
                and{" "}
                <a href={"#"} target={"_blank"}>
                  conditions
                </a>
                .
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
