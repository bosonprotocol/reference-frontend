/* eslint-disable array-callback-return */
import { QRCodeScaner } from "../components/shared/Icons"
import { Link } from 'react-router-dom'
import { ROUTE } from "../helpers/Dictionary"
import { SingleVoucherBlock, VoucherSetBlock } from "../views/Activity"



export const blockTypes = {
  account: 1,
  voucherSet: 2,
}

export const sortBlocks = (blocksArray, blockType, globalContext) => {

  const sortedBlocks = {
    active: [],
    inactive: [],
  }

  if(blockType === blockTypes.account) {
    let voucherDetails = globalContext.state.accountVouchers
    
    sortedBlocks.inactive = voucherDetails.filter(block => {
      if(block.FINALIZED) return block
      sortedBlocks.active.push(block)
    })
  } else {
    sortedBlocks.inactive = blocksArray.filter(block => {
      if(block.qty <= 0) return block
      sortedBlocks.active.push(block)
    })

  }

  return sortedBlocks
}

export const ChildVoucherBlock = ({title, expiration, id}) => (
  <Link to={ `${ ROUTE.VoucherSetDetails }/${ id }` }>
      <div className="voucher-block solo sub flex ai-center">
          <div className="img no-shrink">
              <QRCodeScaner />
          </div>
          <div className="description">
              <h2 className="title elipsis">{title}</h2>
              {/* <div className="expiration">{expiration}</div> */}
          </div>
          {/* <div className="statuses">
              <div className="label">COMMITED</div>
              <div className="label">REDEEMED</div>
          </div> */}
      </div>
  </Link>
)

export const ActiveTab = (props) => {
  const { products, blockType } = props
  return (
      <div className="vouchers-container">
          {
              products.map((block, id) => getDesiredBlockType(blockType, block, id))
          }
      </div>
  )
}

export const getDesiredBlockType = (blockType, props, id) => ( blockType === blockTypes.account ?
  <SingleVoucherBlock { ...props } key={id} />:
  <VoucherSetBlock { ...props } key={id} />
)