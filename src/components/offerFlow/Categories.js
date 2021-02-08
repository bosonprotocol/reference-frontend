import React, { useRef } from 'react'
import "./Categories.scss"
import { categories } from "../../PlaceholderAPI"
import { useState } from 'react/cjs/react.development'

function Categories({inputValueReceiver}) {
  const categoryTarget = useRef()
  const categoryList = useRef()

  const [isCategoryActive, setIsCategoryActive] = useState(Array.from({length: categories.length},() => false));  


  const setCategory = (el, id, index) => {
    categoryTarget.current.value = id;
    setIsCategoryActive((prev) => {
      prev = prev.map(x => 0);
      prev[index] = true;
      return prev;
    })

    inputValueReceiver(id);
    
  }

  return (
    <div ref={categoryList} className="categories">
      <div className="input focus no-border">
        <ul>
          {
            categories.map((category, index) => 
              <li key={index} data-category={category.title} className={isCategoryActive[index] ? 'active flex ai-center' : 'flex ai-center'} onClick={(e) => setCategory(e.target, category.title, index)}>
                <img src={category.image} alt={category.title}/>
                {category.title}
              </li>
            )
          }
        </ul>
      </div>
      <input ref={categoryTarget} id="offer-category" type="text" onChange={(e) => console.log(e)}/>
    </div>
  )
}

export default Categories
