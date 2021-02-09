import React, { useContext, useEffect, useState } from 'react'
import { ROUTE, BOTTOM_NAV_TYPE } from "../../../helpers/Dictionary"
import { IconHome, IconBuyer, IconNewOffer, IconSeller, IconWallet } from "../Icons"
import { Link } from "react-router-dom"
import { NavigationContext } from '../../../contexts/Navigation'
import FormBottomNavigation from "../../offerFlow/FormBottomNavigation"


const selectedColor = '#80F0BE'

function BottomNavigation() {
  const navigationContext = useContext(NavigationContext)
  const [selected, setSelected] = useState(new Array(5).fill(0))
  const selectedNavitem = navigationContext.state.bottom.mainNavigationItem
  const formNavigation = navigationContext.state.offerFlowControl
  const navType = navigationContext.state.bottom.type

  const routing = {
    Home: <IconHome color={selected[0] && selectedColor} />,
    ActivityVouchers: <IconBuyer color={selected[1] && selectedColor} />,
    NewOffer: <IconNewOffer color={selected[2] && selectedColor} />,
    Activity: <IconSeller color={selected[3] && selectedColor} />,
    Connect: <IconWallet color={selected[4] && selectedColor} />,
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
    <section className="bottom-navigation">
      <div className="container">
        <nav className="flex">
          { navType === BOTTOM_NAV_TYPE.DEFAULT ?
            <div className="default-nav w100 flex center">
              <div className="nav-container flex center">
                {Object.entries(routing).map((route, i) => <div key={i} className="link">
                  <Link to={ROUTE[route[0]]}>{route[1]}</Link>
                </div>)}
              </div>
            </div>
            :
            <div className="offer-nav flex ai-center jc-end w100">
              <FormBottomNavigation {...formNavigation} />
            </div>
          }
          
        </nav>
      </div>
    </section>
  )
}

export default BottomNavigation
