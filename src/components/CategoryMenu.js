import React, { useState } from 'react'

import "./CategoryMenu.scss"

import { categoryMenu } from "../PlaceholderAPI"

function CategoryMenu() {
  const [selected, setSelected] = useState(0)

  const switchSelected = (el) => {
    setSelected(parseInt((el.target).dataset.key))
  }

  return (
    <div className="category-menu flex ai-center">
      <p className="selected-item">{categoryMenu[selected]}</p>
      <div className="category-container">
        <ul className="flex ai-center">
          {categoryMenu.map((item, id) => id !== selected && <li role="button" data-key={id} key={id} onClick={(el) => switchSelected(el)}>{item}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default CategoryMenu
