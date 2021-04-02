import React, { useState } from "react";

import { CURRENCY } from "../../../../../helpers/configs/Dictionary";

function CurrencySelector(props) {
  const { name, inputValueHandler } = props;
  const [chosenCurrencyName, setChosenCurrencyName] = useState("ETH");
  const handleInputChange = (e) => {
    if (e?.target) {
      setChosenCurrencyName(e.target.value);
      inputValueHandler(e.target.value);
    }
  };

  return (
    <span className="currencies-container">
      <span
        className={"icons " + (chosenCurrencyName ? chosenCurrencyName : "")}
      >
        <div className={CURRENCY.ETH}></div>
        <div className={CURRENCY.BSN}></div>
      </span>
      <select
        className="currencies"
        name={name}
        id={name}
        onChange={(e) => handleInputChange(e)}
      >
        <option value={CURRENCY.ETH}>{CURRENCY.ETH}</option>
        <option value={CURRENCY.BSN}>{CURRENCY.BSN}</option>
      </select>
    </span>
  );
}

export default CurrencySelector;
