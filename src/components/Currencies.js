import React from 'react'

function Currencies(props) {
  const { name } = props
  return (
    <select className="currencies" name={name} id={name} >
      <option value="ETH">e</option>
      <option value="USD"></option>
    </select>
  )
}

export default Currencies
