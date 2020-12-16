import React, { useRef } from 'react'

import "./Categories.scss"

import { categories } from "../PlaceholderAPI"

function Categories() {
  const categoryTarget = useRef()

  return (
    <div className="categories">
      <ul>
        {
          categories.map((category, id) => 
            <li key={id} className="flex ai-center">
              <img src={category.image} alt={category.title}/>
              {category.title}
            </li>  
          )
        }
      </ul>
      <input ref={categoryTarget} id="offer-category" type="text"/>
    </div>
  )
}

export default Categories
