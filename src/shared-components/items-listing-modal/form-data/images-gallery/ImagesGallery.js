/* eslint-disable react-hooks/exhaustive-deps */
import "../../ItemsListingModal.scss";
import "../../../wallet-connect/WalletConnect.scss";
import { useState, useEffect } from "react";

function ImagesGallery({ images, setImages }) {
  const [selectedIndex, setIndex] = useState(0);
  const [target, setTarget] = useState(false);

  useEffect(() => {
    if (!target) return;

    window.addEventListener("keyup", arrowPressKey);

    return () => {
      window.removeEventListener("keyup", arrowPressKey);
      setTarget(false);
    };
  }, [target]);

  const arrowPressKey = ({ key }) => {
    if (key === "ArrowRight") {
      onNext();
    } else if (key === "ArrowLeft") {
      onPrevious();
    } else if (key === "Backspace") {
      onDelete();
    }
  };

  const onNext = () => {
    setIndex((prevIndex) => {
      return prevIndex < images.length - 1
        ? (prevIndex += 1)
        : images.length - 1;
    });
  };

  const onPrevious = () => {
    setIndex((prevIndex) => {
      return prevIndex > 0 ? (prevIndex -= 1) : 0;
    });
  };

  const onDelete = () => {
    setImages((images) => {
      return images.splice(1, selectedIndex);
    });
  };

  return (
    <section className="container-images">
      <section className="images-listing-modal" onClick={() => setTarget(true)}>
        {images.map((element, index) => {
          return (
            <div className={`box ${selectedIndex === index && "selected"}`}>
              {element.split(":")[0] === "blob" ? (
                <img
                  className="image"
                  src={element}
                  onClick={() => setIndex(index)}
                />
              ) : null}
            </div>
          );
        })}
      </section>
    </section>
  );
}

export default ImagesGallery;
