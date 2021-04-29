import React, { useState, useEffect, useRef, useContext } from "react";

import "./CategoryMenu.scss";
import { GlobalContext } from "../../../../contexts/Global";
import { DEFAULT_FILTER } from "../../../../PlaceholderAPI";
import { useWeb3React } from "@web3-react/core";

function CategoryMenu({ handleCategory }) {
  const [selected, setSelected] = useState(0);
  const [categories, setCategories] = useState([]);
  const categoryList = useRef();

  const { account } = useWeb3React();

  const switchSelected = (el, item) => {
    setSelected(parseInt(el.target.dataset.key));
    handleCategory(item);
  };

  const globalContext = useContext(GlobalContext);

  const voucherSets = globalContext.state.allVoucherSets;

  useEffect(() => {
    generateExistingCategoriesList();
  }, [voucherSets]);

  const generateExistingCategoriesList = () => {
    let filteredSets = voucherSets?.filter(
      (x) =>
        new Date(x?.expiryDate) > new Date() &&
        x.voucherOwner !== account?.toLowerCase() &&
        x.qty > 0
    );

    const voucherSetsGroupedByCategory = groupBy(
      filteredSets,
      (voucherSet) => voucherSet.category
    );
    const existingCategories = [];
    existingCategories.push(DEFAULT_FILTER);

    voucherSetsGroupedByCategory.forEach((categoryGroup, key) => {
      existingCategories.push(key);
    });

    setCategories(existingCategories);
  };

  function groupBy(list, keyGetter) {
    const map = new Map();
    list?.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  return voucherSets?.length
  ? (
    <div className="category-menu flex ai-center">
      <div className="category-container">
        {/* remove classes "arrange no-animation" to trigger animation */}
        <ul className="flex ai-center arrange no-animation" ref={categoryList}>
          {categories?.map((item, id) => (
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
  ) 
  : null
}

export default CategoryMenu;
