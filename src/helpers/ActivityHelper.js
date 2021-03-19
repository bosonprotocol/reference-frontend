/* eslint-disable array-callback-return */
import { QRCodeScaner } from "../components/shared/Icons"
import { Link } from 'react-router-dom'
import { ROUTE } from "../helpers/Dictionary"
import { SingleVoucherBlock, VoucherSetBlock } from "../views/Activity"



export const VOUCHER_TYPE = {
  accountVoucher: 1,
  voucherSet: 2,
}

export const sortBlocks = (blocksArray, voucherType) => {
  const tabGroup = {
    active: [],
    inactive: [],
  }

  if(voucherType === VOUCHER_TYPE.voucherSet) {
    blocksArray.forEach(voucherSet => {
      let quantity = voucherSet.qty > 0
      let activeVouchers = voucherSet.hasActiveVouchers
      let expired = new Date(voucherSet.expiryDate).getTime() < new Date().getTime()

      !activeVouchers && (!quantity || expired) ?
      tabGroup.inactive.push(voucherSet) :
      tabGroup.active.push(voucherSet)
    })
  }
  else if(voucherType === VOUCHER_TYPE.accountVoucher) {
    blocksArray?.forEach(voucher => {
      voucher.FINALIZED ?
        tabGroup.inactive.push(voucher) :
        tabGroup.active.push(voucher)
    })
  }

  return tabGroup
}

export const ChildVoucherBlock = ({title, expiration, id}) => (
  <Link to={ `${ ROUTE.Activity }/${ id }${ROUTE.Details}` }>
      <div className="voucher-block solo sub flex ai-center">
          <div className="img no-shrink">
              <QRCodeScaner />
          </div>
          <div className="description">
              <h2 className="title elipsis">{title}</h2>
              <div className="expiration">{expiration}</div>
          </div>
          {/* <div className="statuses">
              <div className="label">COMMITED</div>
              <div className="label">REDEEMED</div>
          </div> */}
      </div>
  </Link>
)

export const ActiveTab = (props) => {
  const { products, voucherType, voucherSetId } = props
  return (
      <div className="vouchers-container">
          {
              products.map((block, id) => getDesiredBlockType(voucherType, block, id, voucherSetId))
          }
      </div>
  )
}

export const getDesiredBlockType = (voucherType, props, id, voucherSetId) => ( voucherType === VOUCHER_TYPE.accountVoucher ?
  <SingleVoucherBlock voucherSetId={voucherSetId} { ...props } key={id} />:
  <VoucherSetBlock { ...props } key={id} />
)