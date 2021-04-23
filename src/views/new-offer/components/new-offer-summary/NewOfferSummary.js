import React, { useContext } from "react";
import { ethers } from "ethers";

import {
  TableRow,
  DateTable,
  TableLocation,
} from "../../../../shared-components/table-content/TableContent";
import { SellerContext } from "../../../../contexts/Seller";
import { formatDate, totalDepositCalcEth } from "../../../../utils/FormatUtils";
import { capitalize } from "./../../../../utils/FormatUtils";

function NewOfferSummary() {
  const sellerContext = useContext(SellerContext);
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
    condition,
    address_line_one, 
    address_line_two,
    city,
    country,
    postcode,
  } = sellerContext.state.offeringData;
  const tableContent = [
    category && ["Category", category],
    condition && ["Condition", capitalize(condition)],
  ];

  const tablePrices = [
    quantity && ["Quantity", quantity],
    price &&
      price_currency && [
        "Payment Price",
        ethers.utils.formatEther(price) + price_currency,
      ],
    buyer_deposit &&
      deposits_currency && [
        `Buyer’s Deposit  x  ${quantity} voucher${quantity > 1 ? "s" : ""}`,
        totalDepositCalcEth(buyer_deposit, quantity) + deposits_currency,
      ],
    seller_deposit &&
      deposits_currency && [
        `Seller’s Deposit  x  ${quantity} voucher${quantity > 1 ? "s" : ""}`,
        totalDepositCalcEth(seller_deposit, quantity) + deposits_currency,
      ],
  ];

  const tableLocation = [
    address_line_one && [address_line_one],
    address_line_two && [address_line_two],
    city && [city],
    postcode && [postcode],
    country && [country],
  ]

  const tableDate = [
    start_date && formatDate(start_date),
    end_date && formatDate(end_date),
  ];

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
        {tableContent.some((item) => item) ? (
          <TableRow data={tableContent} />
        ) : null}
        {tableLocation.some((item) => item) ? (
          <TableLocation data={tableLocation} />
        ) : null}
        {tableDate.some((item) => item) ? <DateTable data={tableDate} /> : null}
        {tablePrices.some((item) => item) ? (
          <TableRow data={tablePrices} />
        ) : null}
      </div>
    </div>
  );
}

export default NewOfferSummary;
