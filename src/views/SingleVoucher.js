import React, { useContext } from 'react'

import "../components/shared/ProductView.scss"

import { TableRow, DateTable, PriceTable, TableLocation } from "./TableContent"

import { GlobalContext } from "../../contexts/Global"

// import EscrowDiagram from "./EscrowDiagram"

function SingleVoucher() {
  const globalContext = useContext(GlobalContext);

  const selectedProduct = globalContext.state.allVoucherSets.find(x => x.id === globalContext.state.productView.id);

  const description = selectedProduct?.description;

  const tableContent = [
      ['Category', selectedProduct?.category],
      // ['Remaining Quantity', selectedProduct?.qty],
  ];

  const tablePrices = [
      ['Payment Price', selectedProduct?.price, 'ETH', 0],
      false,
      ['Buyer’s deposit', selectedProduct?.buyerDeposit, 'ETH', 1],
      ['Seller’s deposit', selectedProduct?.sellerDeposit, 'ETH', 1]
  ];

  function formatDate(date) {
      if (!date) {
          return "NA";
      }

      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [year, month, day].join('-');
  }

  const tableDate = [
      formatDate(selectedProduct?.startDate),
      formatDate(selectedProduct?.expiryDate)
  ];

  const tableLocation = 'Los Angeles';

  return (
    <>
      <section className="product-view no-bg">
        <div className="container erase">
          <div className="window">
            <div className="thumbnail flex center">
              <img className="mw100" src={ selectedProduct?.image } alt={ selectedProduct?.title }/>
            </div>
            <div className="content">
                {/* <div className="escrow-container">
                    <EscrowDiagram status={ 'commited' }/>
                </div> */}
                <div className="product-info">
                  <h2 className="elipsis">{ selectedProduct?.title }</h2>
                  <p>{ description }</p>
                </div>
                { tableLocation ? <TableLocation data={ tableLocation }/> : null }
                { tableContent.some(item => item) ? <TableRow data={ tableContent }/> : null }
                { tablePrices.some(item => item) ? <PriceTable data={ tablePrices }/> : null }
                { tableDate.some(item => item) ? <DateTable data={ tableDate }/> : null }
                {/* <div className="button refund" role="button">REFUND</div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SingleVoucher
