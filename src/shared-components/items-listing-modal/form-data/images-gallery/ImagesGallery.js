/* eslint-disable react-hooks/exhaustive-deps */
import "../../ItemsListingModal.scss";
import "../../../wallet-connect/WalletConnect.scss";
import { useState, useEffect } from "react";

function ImagesGallery() {
  const [index, setIndex] = useState(0);
  const [target, setTarget] = useState(false);
  const images = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (!target) return;

    window.addEventListener("keyup", arrowPressKey);

    return () => {
      window.removeEventListener("keyup", arrowPressKey);
      setTarget(false)
    };
  }, [target]);

  useEffect(() => {
    console.log(index)
  }, [index])

  const arrowPressKey = ({ key }) => {
    if (key === 'ArrowRight') {
      onNext();
    } else if (key === 'ArrowLeft') {
      onPrevious();
    }
  }

  const onNext = () => {
    setIndex((prevIndex) => {
      return prevIndex < images.length - 1 ? (prevIndex += 1) : images.length - 1;
    });
  };

  const onPrevious = () => {
    setIndex((prevIndex) => {
      return prevIndex > 0 ? (prevIndex -= 1) : 0;
    });
  };

  return (
    <section className="images-listing-modal" onClick={() => setTarget(true)}>
      {
        images.map((image, index) => {
          return <div
            className='image'
            onClick={() => setIndex(index)}
          >{index + 1}</div>
        })
      }


    </section>
  );
}

export default ImagesGallery;
