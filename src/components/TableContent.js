import { IconCalendar, IconDeposit, IconEth } from "./Icons"


export const PriceTable = (objPrices) => {
  const {payment, buyerD, sellerD} = objPrices

  return <>
    <div className="row flex ai-center jc-sb">
      <div className="block flex">
        <div className="icon">
          <IconEth color="#5D6F84" />
        </div>
        <div className="text">
          <p className="title">Payment Price</p>
          <p className="value">{payment} ETH</p>
        </div>
      </div>
      <div className="block flex">
        <div className="icon">
          <IconDeposit color="#5D6F84" />
        </div>
        <div className="text">
          <p className="title">Buyer’s deposit</p>
          <p className="value">{buyerD} ETH</p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="block flex">
        <div className="icon">
          <IconDeposit color="#5D6F84" />
        </div>
        <div className="text">
          <p className="title">Seller’s deposit</p>
          <p className="value">{sellerD} ETH</p>
        </div>
      </div>
    </div>
  </>
}

export const DateTable = (objPrices) => {
  const {start, expiry} = objPrices

  return <>
    <div className="block flex">
      <div className="icon">
        <IconCalendar />
      </div>
      <div className="text">
        <p className="title">Start Date</p>
        <p className="value">{start}</p>
      </div>
    </div>
    <div className="block flex">
      <div className="icon">
        <IconCalendar />
      </div>
      <div className="text">
        <p className="title">Start Date</p>
        <p className="value">{expiry}</p>
      </div>
    </div>
  </>
}

export const TableRow = (title, value) => {
  return <div className="row flex jc-sb ai-center">
    <p className="title">{title}</p>
    <p className="value">{value}</p>
  </div>
}