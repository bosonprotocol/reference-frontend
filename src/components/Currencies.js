import React from 'react'

function Currencies(props) {
  const { name } = props
  return (
    <select name={name} id={name} >
      <option value="eth">Ether</option>
      <option value="test currency">Test</option>
    </select>
  )
}

export default Currencies
