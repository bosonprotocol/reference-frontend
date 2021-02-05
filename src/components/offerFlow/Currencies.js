import React from 'react'

import { CURRENCY } from "../../helpers/Dictionary"

function Currencies(props) {
  const { name, inputValueHandler } = props
  return (
    <span className="currencies-container">
      <span className="icons">
        <div className={CURRENCY.ETH}></div>
        {/* <div className={CURRENCY.BSN}></div> */}
      </span>
      <select className="currencies" name={name} id={name} >
        <option value={CURRENCY.ETH}>{CURRENCY.ETH}</option>
        {/* <option value={CURRENCY.BSN}>{CURRENCY.BSN}</option> */}
      </select>
    </span>
  )
}

export default Currencies
