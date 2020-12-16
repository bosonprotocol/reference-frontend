import React from 'react'

function Currencies(props) {
  const { name, updateData } = props
  return (
    <select name={name} id={name}
    onChange={(e) => updateData(name, e.target.value)}>
      <option value="eth">ETH</option>
    </select>
  )
}

export default Currencies
