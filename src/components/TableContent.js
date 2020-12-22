import { IconCalendar, IconDeposit, IconEth } from "./Icons"

function setRows(list, howMany) {
  var result = []
  let input = list

  while (input[0]) {
    result.push(input.splice(0, howMany))
  }
  return result
}

export const PriceTable = (data) => {
  const dataCopy = setRows(data, 2)

  const iconList = [
    <IconEth color="#5D6F84" />,
    <IconDeposit color="#5D6F84" />
  ]

  const defaultCurrency = 'ETH'

  const jsxBlock = (title, value, currency, icon, id) => <div key={id} className="block flex">
    <div className="icon">{iconList[icon]}</div>
    <div className="text">
      <p className="title">{title}</p>
      <p className="value">{value} {currency ? currency : defaultCurrency}</p>
    </div>
  </div>

  return <>{
    dataCopy.map((row, key) => 
      <div key={key} className="row flex jc-sb ai-center">
        {row.map((block, id) => block ? jsxBlock(block[0], block[1], block[2], block[3], id) : null)}
      </div>
    )
  }</>
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

export const TableRow = (props) => {
  const { title, value } = props
  return <div className="row flex jc-sb ai-center">
    <p className="title">{title}</p>
    <p className="value">{value}</p>
  </div>
}