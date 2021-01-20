import React, { useEffect, useState } from 'react'

import * as ethers from "ethers";
import { getAllVoucherSets } from "../hooks/api";
import { formatDate } from "../helpers/Format"

import "./VoucherDetails.scss"

import { TableRow, DateTable, PriceTable, TableLocation } from "../components/shared/TableContent"

import EscrowDiagram from "../components/redemptionFlow/EscrowDiagram"

// import EscrowDiagram from "./EscrowDiagram"

function VoucherDetails(props) {
  const [selectedProduct, setSelectedProduct] = useState([])
  const voucherId = props.match.params.id

  useEffect(() => {
    async function getVoucherSets() {
      const allVoucherSets = await getAllVoucherSets();
      prepareVoucherSetData(allVoucherSets)
    }

    getVoucherSets()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prepareVoucherSetData = (rawVoucherSets) => {
    let parsedVoucherSets = [];

    for (const voucherSet of rawVoucherSets.voucherSupplies) {
        let parsedVoucherSet = {
            id: voucherSet._id,
            title: voucherSet.title,
            image: voucherSet.imagefiles[0]?.url ? voucherSet.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
            price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
            deposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
            qty: voucherSet.qty
        };

        parsedVoucherSets.push(parsedVoucherSet)
    }

    setSelectedProduct(parsedVoucherSets.find(x => x.id === voucherId))
  };

  const title = 'Nike Adapt Self-Lacing Smart Sneaker'

  // const description = selectedProduct?.description;
  const description = 'A breakthrough lacing system that electronically adjusts to the shape of your foot. Get the right fit, every game, every step.'

  // const tableCategory = [
  //   ['Category', selectedProduct?.category],
  // ];

  const tableCategory = [
    ['Category', 'Clothing'],
  ];

  const tableSellerInfo= [
    ['Seller', 'David'],
    ['Phone', '1-415-542-5050'],
  ];

  const tableDate = [
      formatDate(selectedProduct?.startDate),
      formatDate(selectedProduct?.expiryDate)
  ];

  const tableLocation = 'Los Angeles';

  return (
    <>
      <section className="voucher-details no-bg">
        <div className="container erase">
          <div className="content">
            <h1>{title}</h1>
            <div className="status"></div>
            <div className="expiration"></div>
            <EscrowDiagram status={ 'commited' }/>
            <div className="description">
              {description}
            </div>
            { tableLocation ? <TableLocation data={ tableLocation }/> : null }
            { tableCategory.some(item => item) ? <TableRow data={ tableCategory }/> : null }
            { tableDate.some(item => item) ? <DateTable data={ tableDate }/> : null }
            { tableSellerInfo.some(item => item) ? <TableRow data={ tableSellerInfo }/> : null }
          </div>
        </div>
      </section>
    </>
  )
}

/* <div className="container erase">
          <EscrowDiagram />
          <div className="thumbnail flex center">
            <img className="mw100" src={ selectedProduct?.image } alt={ selectedProduct?.title }/>
          </div>
          <div className="content">
              <div className="escrow-container">
                  <EscrowDiagram status={ 'commited' }/>
              </div>
              <div className="product-info">
                <h2 className="elipsis">{ selectedProduct?.title }</h2>
                <p>{ description }</p>
              </div>
              { tableLocation ? <TableLocation data={ tableLocation }/> : null }
              { tableContent.some(item => item) ? <TableRow data={ tableContent }/> : null }
              { tablePrices.some(item => item) ? <PriceTable data={ tablePrices }/> : null }
              { tableDate.some(item => item) ? <DateTable data={ tableDate }/> : null }
              <div className="button refund" role="button">REFUND</div>
          </div>
        </div> */

export default VoucherDetails
