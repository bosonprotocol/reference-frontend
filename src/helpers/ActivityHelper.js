/* eslint-disable array-callback-return */
import { QRCodeScaner } from "../components/shared/Icons"
import { Link } from 'react-router-dom'
import { ROUTE } from "../helpers/Dictionary"
import { SingleVoucherBlock, VoucherSetBlock } from "../views/Activity"



export const VOUCHER_TYPE = {
  accountVoucher: 1,
  voucherSet: 2,
}

export const sortBlocks = (blocksArray, voucherType, globalContext) => {
  const tabGroup = {
    active: [],
    inactive: [],
  }

  if(voucherType === VOUCHER_TYPE.voucherSet) {
    blocksArray.forEach(voucherSet => {
      voucherSet.qty <= 0 ?
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

export const ActiveTab = (props) => {
  const { products, voucherType } = props
  return (
      <div className="vouchers-container">
          {
              products.map((block, id) => getDesiredBlockType(voucherType, block, id))
          }
      </div>
  )
}

export const getDesiredBlockType = (voucherType, props, id) => ( voucherType === VOUCHER_TYPE.accountVoucher ?
  <SingleVoucherBlock { ...props } key={id} />:
  <VoucherSetBlock { ...props } key={id} />
)