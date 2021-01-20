import React, { useEffect, useState } from 'react'

import { useHistory } from "react-router"

import * as ethers from "ethers";
import { getAllVoucherSets } from "../hooks/api";
import { formatDate } from "../helpers/Format"

import "./VoucherDetails.scss"

import { TableRow, DateTable, TableLocation } from "../components/shared/TableContent"

import EscrowDiagram from "../components/redemptionFlow/EscrowDiagram"

import { Arrow } from "../components/shared/Icons"

function VoucherDetails(props) {
  const [selectedProduct, setSelectedProduct] = useState([])
  const voucherId = props.match.params.id

  const history = useHistory()

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
          <div className="button square new" role="button"
            onClick={ () => history.push('/') }
          >
            <Arrow color="#80F0BE"/>
          </div>
          <div className="content">
            <div className="section title">
              <h1>{title}</h1>
            </div>
            <div className="section status">
              <h2>Status</h2>
              <div className="status"></div>
            </div>
            <div className="section expiration">
              <div className="expiration"></div>
            </div>
            <div className="section escrow">
              <EscrowDiagram status={ 'commited' }/>
            </div>
            <div className="section info">
              <div className="section description">
                <h2 className="flex split">
                  <span>Description</span>
                  <div className="image flex center">
                    <img src={selectedProduct?.image} alt={selectedProduct?.title} />
                  </div>
                </h2>
                <div className="description">
                  {description}
                </div>
              </div>
              <div className="section general">
                { tableLocation ? <TableLocation data={ tableLocation }/> : null }
                { tableCategory.some(item => item) ? <TableRow data={ tableCategory }/> : null }
              </div>
              <div className="section date">
                { tableDate.some(item => item) ? <DateTable data={ tableDate }/> : null }
              </div>
              <div className="section seller">
                { tableSellerInfo.some(item => item) ? <TableRow data={ tableSellerInfo }/> : null }
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default VoucherDetails
