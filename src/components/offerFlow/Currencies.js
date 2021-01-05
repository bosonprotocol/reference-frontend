import React from 'react'

function Currencies(props) {
  const { name } = props
  return (
    <select className="currencies" name={name} id={name} >
      <option value="ETH"></option>
      <option value="USD"></option>
    </select>
  )
}

export default Currencies
