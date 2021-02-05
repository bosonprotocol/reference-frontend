import React, { useRef, useEffect, useContext } from 'react'

import "./Categories.scss"

import { categories } from "../../PlaceholderAPI"
import { NAME } from "../../helpers/Dictionary"

import { SellerContext, getData } from "../../contexts/Seller"

function Categories({inputValueReceiver}) {
  const categoryTarget = useRef()
  const categoryList = useRef()

  const sellerContext = useContext(SellerContext)
  const getOfferingData = getData(sellerContext.state.offeringData)
  
  const selectedCategory = getOfferingData(NAME.CATEGORY)

  // (html element, name to set on input field)
  const setCategory = (el, id) => {
    console.log('setting cat', el)
    categoryTarget.current.value = id

    Array.from(el.parentElement.querySelectorAll('[data-category]')).forEach(category => {
      category.classList.remove('active')
    })

    el.classList.add('active')
    inputValueReceiver(id);
    
  }

  useEffect(() => {
    // state
    let element = categoryList.current?.querySelector(`[data-category="${selectedCategory}"]`)
    
    if(element) {
      element.style.transition = 'none'
      setCategory(element, selectedCategory)
      element.removeAttribute('transition');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={categoryList} className="categories">
      <div className="input focus no-border">
        <ul>
          {
            categories.map((category, id) => 
              <li key={id} data-category={category.title} className="flex ai-center" onClick={(e) => setCategory(e.target, category.title)}>
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
