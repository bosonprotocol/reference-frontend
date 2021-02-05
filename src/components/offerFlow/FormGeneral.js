import React, { useRef, useEffect, useContext } from 'react'

import { NAME } from "../../helpers/Dictionary"
import { SellerContext, getData } from "../../contexts/Seller"

function FormGeneral() {
  const conditionTarget = useRef()
  const titleInput = useRef()
  const titleClear = useRef()

  const sellerContext = useContext(SellerContext)
  const getOfferingData = getData(sellerContext.state.offeringData)
  
  const selectedCategory = getOfferingData(NAME.CONDITION)

  const selectLabel = (el) => {
    Array.from(el.parentElement.parentElement.querySelectorAll('label')).forEach(label => {
      label.classList.remove('active')
    })
    el.parentElement.querySelector('label').classList.add('active') 
  }
  
  const handleClearField = (e) => {
    e.target.parentElement.getElementsByTagName('input')[0].value = ''
  }

  useEffect(() => {
    // state
    let element = conditionTarget.current?.querySelector(`[data-condition="${selectedCategory}"]`)
    
    if(element) {
      element.style.transition = 'none'
      selectLabel(element)
      element.removeAttribute('transition');
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="general">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-title">
            <div className="step-title">
              <h1>Title</h1>
            </div>
          </label>
          <div className="input focus">
            <input ref={titleInput} id="offer-title" type="text" name={NAME.TITLE} />
            <div 
              ref={titleClear}
              className={`clear-field ${titleInput.current && (titleInput.current.value !== '' ? 'active' : 'hidden')}`}
              onClick={(e) => handleClearField(e)}
            ></div>
          </div>
        </div>
      </div> 
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <div className="input focus">
            <input id="offer-quantity" type="number" name={NAME.QUANTITY}/>
          </div>
        </div>
      </div>
      <div ref={conditionTarget} className="row flex">
        <div className="field radio-label">
          <label data-condition="new" htmlFor="condition-new">New</label>
          <input className="hidden" id="condition-new" value="new" type="radio" 
          name={NAME.CONDITION} 
          onClick={(e) => selectLabel(e.target)} />
        </div>
        <div className="field radio-label">
          <label data-condition="used" htmlFor="condition-used">Used</label>
          <input className="hidden" id="condition-used" value="used" type="radio"
          name={NAME.CONDITION} 
          onClick={(e) => selectLabel(e.target)} />
        </div>
      </div>
    </div>
  )
}

export default FormGeneral
