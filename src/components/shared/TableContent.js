import { IconCalendar, IconDeposit, IconEth, IconLocation } from "./Icons"

function setRows(list, howMany) {
  var result = []
  let input = JSON.parse(JSON.stringify(list))

  while (input[0] !== undefined) {
    result.push(input.splice(0, howMany))
  }
  return result
}

export const DescriptionBlock = (props) => {
  const { voucherSetDetails, getProp, toggleImageView } = props
  return (
    <>
      <h2>
          <div>Description</div>
          {!voucherSetDetails ?
            <div className="image flex center" onClick={()=>toggleImageView(1)}>
              <img src={ getProp('image') } alt={ getProp('title')}/>
            </div>
          :null}
      </h2>
      <div className="description">
          { getProp('description') }
      </div>
    </>
  )
}


export const PriceTable = (props) => {
  const { data } = props
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

  return (
    <div className="table price flex column">{
      dataCopy.map((row, key) => 
        <div key={key} className="row flex jc-sb ai-center">
          {row.map((block, id) => block ? jsxBlock(block[0], block[1], block[2], block[3], id) : null)}
        </div>
      )
    }</div>
  )
}

export const DateTable = (props) => {
  const { data } = props
  const start = data[0]
  const expiry = data[1]

  return (
    <div className="table date flex jc-sb ai-center">
      {start ? 
      <div className="block flex">
        <div className="icon">
          <IconCalendar direction />
        </div>
        <div className="text">
          <p className="title">Start Date</p>
          <p className="value">{start}</p>
        </div>
      </div> : null }

      {expiry ?
      <div className="block flex">
        <div className="icon">
          <IconCalendar />
        </div>
        <div className="text">
          <p className="title">End Date</p>
          <p className="value">{expiry}</p>
        </div>
      </div> : null }
    </div>
  )
}

export const TableRow = (props) => {
  const { data } = props

  const block = (title, value, id) => <div key={id} className="row flex jc-sb ai-center">
    <p className="title">{title}</p>
    <p className="value">{value}</p>
  </div>

  return (
    <div className="table product-info flex column">
      {data.map((row, id) => row && block(row[0], row[1], id))}
    </div>
  )
}

export const TableLocation = (props) => {
  const { data } = props
  return (
  <div className="table location flex ai-center jc-sb">
    <p className="flex center"><IconLocation />{data}</p>
    <div className="arrow expand"></div>
  </div>
  )
}