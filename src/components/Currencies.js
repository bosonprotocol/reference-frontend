import React from 'react'

function Currencies(props) {
  const { name } = props
  return (
    <select name={name} id={name}>
      <option value="eth">ETH</option>
    </select>
  )
}

export default Currencies
