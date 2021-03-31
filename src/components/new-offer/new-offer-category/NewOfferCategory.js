/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import "./NewOfferCategory.scss";
import { categories } from "../../../PlaceholderAPI";

function NewOfferCategory({ inputValueReceiver }) {
  const categoryList = useRef();
  const [list, setList] = useState();

  const [isCategoryActive, setIsCategoryActive] = useState(
    Array.from({ length: categories.length }, () => false)
  );

  const setCategory = (el, id, index) => {
    setIsCategoryActive((prev) => {
      prev = prev.map((x) => false);
      prev[index] = true;
      return prev;
    });

    inputValueReceiver(id);
  };

  useEffect(() => {
    setList(
      categories.map((category, index) => (
        <li
          key={index}
          data-category={category.title}
          className={`${
            isCategoryActive[index]
              ? "active flex ai-center "
              : "flex ai-center"
          }`}
          onClick={(e) => setCategory(e.target, category.title, index)}
        >
          <img src={category.image} alt={category.title} />
          {category.title}
        </li>
      ))
    );
  }, []);

  return (
    <div ref={categoryList} className="categories">
      <div className="input focus no-border">
        <ul>{list ? list : null}</ul>
      </div>
    </div>
  );
}

export default NewOfferCategory;
