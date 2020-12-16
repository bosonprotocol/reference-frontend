import React, { useRef } from 'react'

import "./Categories.scss"

import { categories } from "../PlaceholderAPI"
import { NAME } from "../helpers/Dictionary"

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
      <input ref={categoryTarget} id="offer-category" type="text" name={NAME.CATEGORY} />
    </div>
  )
}

export default Categories
