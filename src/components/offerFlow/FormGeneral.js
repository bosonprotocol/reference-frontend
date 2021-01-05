import React, { useRef, useEffect } from 'react'

import { NAME } from "../../helpers/Dictionary"

function FormGeneral() {
  const conditionTarget = useRef()

  const selectLabel = (el) => {
    Array.from(el.parentElement.parentElement.querySelectorAll('label')).forEach(label => {
      label.classList.remove('active')
    })
    el.parentElement.querySelector('label').classList.add('active') 
  }

  useEffect(() => {
    let fetchedBackup = localStorage.getItem('offeringData') && JSON.parse(localStorage.getItem('offeringData'))
    let element = conditionTarget.current?.querySelector(`[data-condition="${fetchedBackup?.condition}"]`)
    console.log(element)
    
    if(element) {
      element.style.transition = 'none'
      selectLabel(element)
      element.removeAttribute('transition');
    }
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
          <input id="offer-title" type="text" name={NAME.TITLE} />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <input id="offer-quantity" type="number" name={NAME.QUANTITY}/>
        </div>
      </div>
      <div ref={conditionTarget} className="row flex">
        <div className="field radio-label">
          <label data-condition="new" htmlFor="condition-new">New</label>
          <input className="hidden"   aid="condition-new" value="new" type="radio" 
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
