import React from 'react'

function Activity() {
  const status = 'OFFERED';
  const date = 'Oct 26th 2020';
  const title = 'Nike Adapt Self-Lacing Smart Sneaker';
  const value = 0.1;
  const currency = 'ETH';
  const quantity = 1;
  const thumbnail = 'images/temp/product-block-image-temp-2.png';

  return (
    <section className="activity">
      <div className="container">
        <div className="vouchers-container">
          <div className="voucher-block flex">
            <div className="thumb no-shrink">
              <img src={thumbnail} alt={title}/>
            </div>
            <div className="info w100">
              <div className="status flex split">
                <div className="label">{status}</div>
                <div className="date">{date}</div>
              </div>
              <div className="title">{title}</div>
              <div className="price flex split">
                <div className="value">{value} {currency}</div>
                <div className="quantity">QTY: {quantity}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Activity
 