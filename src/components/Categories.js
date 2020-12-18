import React, { useRef } from 'react'

import "./Categories.scss"

import { categories } from "../PlaceholderAPI"
import { NAME } from "../helpers/Dictionary"

function Categories(props) {
  const { listenerType } = props
  const categoryTarget = useRef()

  const customChange = new Event(listenerType)

  const setCategory = (e, id) => {
    categoryTarget.current.value = id

    Array.from(e.target.parentElement.querySelectorAll('[data-category]')).forEach(category => {
      category.classList.remove('active')
    })

    e.target.classList.add('active')

    categoryTarget.current.dispatchEvent(customChange)
  }

  return (
    <div className="categories">
      <ul>
        {
          categories.map((category, id) => 
            <li key={id} data-category={category.title} className="flex ai-center" onClick={(e) => setCategory(e, category.title)}>
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
