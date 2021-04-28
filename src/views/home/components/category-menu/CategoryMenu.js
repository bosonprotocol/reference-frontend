import React, { useState, useEffect, useRef } from "react";

import "./CategoryMenu.scss";

import { categoryMenu } from "../../../../PlaceholderAPI";

function CategoryMenu({ handleCategory }) {
  const [selected, setSelected] = useState(0);
  const categoryList = useRef();

  const switchSelected = (el, item) => {
    setSelected(parseInt(el.target.dataset.key));
    handleCategory(item);
  };

  useEffect(() => {
    categoryList.current.classList.add("arrange");
  }, []);

  return (
    <div className="category-menu flex ai-center">
      <div className="category-container">
        {/* remove classes "arrange no-animation" to trigger animation */}
        <ul className="flex ai-center arrange no-animation" ref={categoryList}>
          {categoryMenu.map((item, id) => (
            <li
              style={{ transitionDelay: `${id * 50}ms` }}
              role="button"
              data-key={id}
              key={id}
              onClick={(el) => switchSelected(el, item)}
              className={`${id === selected ? "selected-item" : ""}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryMenu;
