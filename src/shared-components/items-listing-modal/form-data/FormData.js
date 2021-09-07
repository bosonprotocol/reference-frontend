/* eslint-disable react-hooks/exhaustive-deps */
import "../ItemsListingModal.scss";
import "../../wallet-connect/WalletConnect.scss";
import { useState, Fragment } from "react";
import PopupMessage from "../../popup-message/PopupMessage";
import ImagesGallery from "./images-gallery/ImagesGallery";
import { useEffect, useRef } from "react/cjs/react.development";

function FormData({ item }) {
  const [popupMessage, setPopupMessage] = useState();
  const itemEntries = Object.entries(item);
  const fileInput = useRef();
  const [images, setImages] = useState(["PRODUCT PHOTO"]);

  const rowOfItems = () => {
    let rows = [];
    for (let i = 0; i < itemEntries.length; i += 2) {
      if (
        itemEntries[i][0] !== "Ready To Process" &&
        itemEntries[i][0] !== "Creation Status"
      ) {
        rows.push(
          <article className="row" style={{ width: "90%" }}>
            {itemEntries[i] && (
              <article style={{ fontSize: "calc(0.6vw + 0.6vh)" }}>
                <span>{itemEntries[i][0]}</span>
                <input
                  style={{ marginLeft: "-20%" }}
                  disabled="true"
                  value={itemEntries[i][1]}
                />
              </article>
            )}
            <article style={{ width: "25%" }}></article>
            {itemEntries[i + 1] && (
              <article style={{ fontSize: "calc(0.6vw + 0.6vh)" }}>
                <span>{itemEntries[i + 1][0]}</span>
                <input
                  style={{ marginLeft: "-20%" }}
                  disabled="true"
                  value={itemEntries[i + 1][1]}
                />
              </article>
            )}
          </article>
        );
      }
    }
    return rows;
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleChange = (event) => {
    const renderImages = (files) => {
      return files.map((f) => URL.createObjectURL(f));
    };
    if (event?.target?.files[0]) {
      setImages((previousImages) => {
        return [
          ...previousImages,
          ...renderImages(Array.from(event.target.files)),
        ];
      });
    }
  };

  return (
    <Fragment>
      <section className="item-form">
        <div className="form-header">
          Manage Draft Listing: #{itemEntries[0][1]}
        </div>

        {itemEntries && rowOfItems()}

        {<PopupMessage {...popupMessage} />}

        <input
          className="inputfile"
          type="file"
          multiple
          ref={fileInput}
          onChange={handleChange}
        />

        <button className="button upload-images" onClick={handleClick}>
          Upload Images
        </button>

        <ImagesGallery images={images} setImages={setImages} />

        <button
          className="button create-offer"
          role="button"
          onClick={() =>
            setPopupMessage({
              text: "This will open metamask and allow you to create a voucher set with the given form data.",
              controls: (
                <div className="flex split button-pair">
                  <div className="button gray" />
                  <div
                    className="button primary"
                    role="button"
                    onClick={() => setPopupMessage(false)}
                  >
                    Close
                  </div>
                </div>
              ),
            })
          }
        >
          CREATE OFFER
        </button>
      </section>
    </Fragment>
  );
}

export default FormData;
