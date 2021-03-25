import React, { useContext } from "react";
import { ethers } from "ethers";

import { TableRow, DateTable } from "../shared/TableContent";
import { SellerContext } from "../../contexts/Seller";
import { formatDate, exponentToDecimal } from "../../helpers/Format";

function FormSummary() {
  const sellerContext = useContext(SellerContext)
  const {
    category,
    title,
    description,
    quantity,
    start_date,
    end_date,
    price,
    price_currency,
    seller_deposit,
    deposits_currency,
    buyer_deposit,
    image,
  } = sellerContext.state.offeringData
  const tableContent = [
    category && ['Category', category],
  ]

  const tablePrices = [
    (price && price_currency) && ['Payment Price', ethers.utils.formatEther(price) + price_currency],
    (buyer_deposit && deposits_currency) && [`Buyer’s Deposit  x  ${quantity} voucher${quantity > 1 ? 's' : ''}`, totalDepositCalcEth(buyer_deposit, quantity) + deposits_currency],
    (seller_deposit && deposits_currency) && [`Seller’s Deposit  x  ${quantity} voucher${quantity > 1 ? 's' : ''}`, totalDepositCalcEth(seller_deposit, quantity) + deposits_currency],
  ]

  const tableDate = [
    start_date && formatDate(start_date),
    end_date && formatDate(end_date)
  ]

  return (
    <div className="summary product-view">
      <h1>Offer voucher</h1>
      <div className="thumbnail flex center">
        <img className="mw100" src={image} alt={title} />
      </div>
      <div className="content">
        <div className="product-info">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {tableContent.some(item => item) ? <TableRow data={tableContent} /> : null}
        {tableDate.some(item => item) ? <DateTable data={tableDate} /> : null}
        {tablePrices.some(item => item) ? <TableRow data={tablePrices} /> : null}
      </div>
    </div>
  )
}

/**
 * Calculates total (price * quantity) in ETH.
 * Required due to last digit shift in ethers multiplication.
 * @param value The value to be multiplied by the quantity
 * @param quantity The quantity
 * @returns {string} Total in ETH - formatted
 */
function totalDepositCalcEth(value, quantity) {
  if (!value || !quantity) {
    return "";
  }

  const weiToEth = 1000000000000000000;
  const newValue = ethers.utils.formatEther(value);
  const newQuantity = ethers.utils.parseEther(quantity.toString());
  const totalInWei = Math.trunc(newValue * newQuantity);
  const totalDeposit = totalInWei / weiToEth;

  return exponentToDecimal(totalDeposit.toString());
}

export default FormSummary
