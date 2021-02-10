import React, { useContext, useEffect, useState } from 'react'
import { ROUTE, BOTTOM_NAV_TYPE } from "../../../helpers/Dictionary"
import { IconHome, IconBuyer, IconNewOffer, IconSeller, IconWallet } from "../Icons"
import { Link } from "react-router-dom"
import { NavigationContext } from '../../../contexts/Navigation'
import { GlobalContext } from '../../../contexts/Global'
import FormBottomNavigation from "../../offerFlow/FormBottomNavigation"


const selectedColor = '#80F0BE'

function BottomNavigation() {
  const navigationContext = useContext(NavigationContext)
  const globalContext = useContext(GlobalContext)
  const [selected, setSelected] = useState(new Array(5).fill(0))
  const selectedNavitem = navigationContext.state.bottom.mainNavigationItem
  const formNavigation = navigationContext.state.offerFlowControl
  const voucherControls = navigationContext.state.redemptionFlowControl
  const navType = navigationContext.state.bottom.type

  const routing = {
    Home: <div className="set flex column ai-center"><IconHome color={selected[0] && selectedColor} /> Home</div>,
    ActivityVouchers: <div className="set flex column ai-center"><IconBuyer color={selected[1] && selectedColor} /> My Vouchers</div>,
    NewOffer: <div className="set flex column ai-center"><IconNewOffer color={selected[2] && selectedColor} /> Add Offer</div>,
    Activity: <div className="set flex column ai-center"><IconSeller color={selected[3] && selectedColor} /> Activity</div>,
    Connect: <div className="set flex column ai-center"><IconWallet color={selected[4] && selectedColor} /> Wallet</div>,
  }
  
  useEffect(() => {
    let navigationList = selected.map(i=>0)
    navigationList[selectedNavitem] = 1

    setSelected(navigationList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNavitem])

  useEffect(() => {
    console.log(navType)
  }, [navType])

  return (
    <section className={`bottom-navigation ${!globalContext.state.onboardingCompleted ? 'd-none' : ''}`}>
      <div className="container">
        <nav className="flex">
          { navType === BOTTOM_NAV_TYPE.DEFAULT ?
            <div className="default-nav w100 flex center">
              <div className="nav-container flex center">
                {Object.entries(routing).map((route, i) => <div key={i} className="link">
                  <Link to={ROUTE[route[0]]}>{route[1]}</Link>
                </div>)}
              </div>
            </div> :

            navType === BOTTOM_NAV_TYPE.OFFER ?
            <div className="offer-nav flex ai-center jc-end w100">
              <FormBottomNavigation {...formNavigation} />
            </div> :

            navType === BOTTOM_NAV_TYPE.VOUCHER ?
            <div className="control-wrap">
              {voucherControls}
            </div> :

            null
          }
          
        </nav>
      </div>
    </section>
  )
}

export default BottomNavigation
