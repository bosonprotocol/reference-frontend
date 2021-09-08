/* eslint-disable react-hooks/exhaustive-deps */
import "../../ItemsListingModal.scss";
import "../../../wallet-connect/WalletConnect.scss";
import { useState, useEffect } from "react";

function ImagesGallery({ images, setImages }) {
  const [selectedImgURL, setIndex] = useState(0);
  // const [target, setTarget] = useState(false);

  // useEffect(() => {
  //   if (!target) return;

  //   window.addEventListener("keyup", arrowPressKey);

  //   return () => {
  //     window.removeEventListener("keyup", arrowPressKey);
  //     setTarget(false);
  //   };
  // }, [target]);

  // const arrowPressKey = ({ key }) => {
  //   if (key === "ArrowRight") {
  //     onNext();
  //   } else if (key === "ArrowLeft") {
  //     onPrevious();
  //   } else if (key === "Backspace") {
  //     onDelete();
  //   }
  // };

  // const onNext = () => {
  //   setIndex((prevIndex) => {
  //     const i =  prevIndex < images.length - 1 ? (prevIndex += 1) : images.length - 1;
  //     console.log(images[i])
  //     return images[i];
  //   });
  // };

  // const onPrevious = () => {
  //   setIndex((prevIndex) => {
  //     const i = prevIndex > 0 ? (prevIndex -= 1) : 0;
  //     console.log(images[i])
  //     return images[i];
  //   });
  // };

  const onDelete = (imgURL) => {
    setImages((images) => {
      return images.filter(imgURLCurr => imgURL !== imgURLCurr);
    });
  };

  return (
    <section className="container-images">
      <section className="images-listing-modal">
        {images.length > 0 ?
          images.map((imgURL) => {
            return <div className={`box ${imgURL == selectedImgURL && 'selected'}`}>
              <img
                className={`image ${imgURL == selectedImgURL && 'selected'}`}
                src={imgURL}
                onClick={() => { imgURL === selectedImgURL ? setIndex('') : setIndex(imgURL) }}
              />
              <button
                className={`delete ${imgURL == selectedImgURL && 'selected'}`}
                onClick={() => onDelete(imgURL)}>
                X
              </button>
            </div>
          })
          :
          <div className={`box empty `}>
            <div
              className='image'
            >
              PRODUCT PHOTO
            </div>
          </div>
        }
      </section>
    </section>
  );
}

export default ImagesGallery;
