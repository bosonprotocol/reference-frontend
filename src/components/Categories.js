import React from 'react'

import "./Categories.scss"

import { categories } from "../PlaceholderAPI"

function Categories() {

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
    </div>
  )
}

export default Categories
