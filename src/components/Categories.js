import React, { useRef, useEffect } from 'react'

import "./Categories.scss"

import { categories } from "../PlaceholderAPI"

function Categories(props) {
  const { listenerType } = props
  const categoryTarget = useRef()

  const customChange = new Event(listenerType)

  const setCategory = (id) => {
    categoryTarget.current.value = id

    categoryTarget.current.dispatchEvent(customChange)
  }

  return (
    <div className="categories">
      <ul>
        {
          categories.map((category, id) => 
            <li key={id} className="flex ai-center" onClick={() => setCategory(category.title)}>
              <img src={category.image} alt={category.title}/>
              {category.title}
            </li>  
          )
        }
      </ul>
      <input ref={categoryTarget} id="offer-category" type="text" name="category"/>
    </div>
  )
}

export default Categories
