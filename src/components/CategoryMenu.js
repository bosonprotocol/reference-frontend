import React, { useState, useEffect, useRef } from 'react'

import "./CategoryMenu.scss"

import { categoryMenu } from "../PlaceholderAPI"

function CategoryMenu() {
  const [selected, setSelected] = useState(0)
  const categoryList = useRef()
  const selectedRef = useRef()

  const switchSelected = (el) => {
    setSelected(parseInt((el.target).dataset.key))
  }

  useEffect(() => {
    categoryList.current.classList.add('arrange')
    selectedRef.current.classList.add('arrange')
  }, [])

  return (
    <div className="category-menu flex ai-center">
      <p className="selected-item" ref={selectedRef}>{categoryMenu[selected]}</p>
      <div className="category-container">
        <ul className="flex ai-center" ref={categoryList}>
          {categoryMenu.map((item, id) => id !== selected && <li
            style={{transitionDelay: `${id * 50}ms`}}
            role="button" data-key={id}
            key={id}
            onClick={(el) => switchSelected(el)}>
            {item}
          </li>)}
        </ul>
      </div>
    </div>
  )
}

export default CategoryMenu
