/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import "./NewOfferPhoto.scss";
import { ALLOWED_IMAGES } from "../../../../constants/AllowedImageUploads";

function NewOfferPhoto({ inputValueReceiver }) {
  const imageList = useRef();
  const [list, setList] = useState();

  const [isImageActive, setIsImageActive] = useState(
    Array.from({ length: ALLOWED_IMAGES.length }, () => false)
  );

  const setImage = async (index, path) => {
    const img = await fetch(path)
    const imgToBlob = await img.blob()

    setIsImageActive(isImageActive.map((x, i) => i === index));
    inputValueReceiver(imgToBlob);
  };

  useEffect(() => {
    setList(
      ALLOWED_IMAGES.map((image, index) => (
        <li
          key={index}
          data-category={image.title}
          className={`${
            isImageActive[index]
              ? "active flex ai-center "
              : "flex ai-center"
          }`}
          onClick={(e) => setImage(index, image.imagePath)}
        >
          <img src={image.imagePath} alt={image.title} id="image-id-test"/>
          {image.title}
        </li>
      ))
    );
  }, [isImageActive]);

  return (
    <div ref={imageList} className="images">
      <div className="input focus no-border">
        <ul>{list ? list : null}</ul>
      </div>
    </div>
  );
}

export default NewOfferPhoto;
