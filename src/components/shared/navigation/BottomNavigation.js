import React, { useContext, useEffect, useState } from 'react'
import { ROUTE } from "../../../helpers/Dictionary"
import { IconHome, IconBuyer, IconNewOffer, IconSeller, IconWallet } from "../Icons"
import { Link } from "react-router-dom"
import { NavigationContext } from '../../../contexts/Navigation'


const selectedColor = '#80F0BE'

function BottomNavigation() {
  const navigationContext = useContext(NavigationContext)
  const [selected, setSelected] = useState(new Array(5).fill(0))
  const selectedNavitem = navigationContext.state.bottomNavItem

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

  return (
    <section className="bottom-navigation">
      <div className="container">
        <nav className="flex center">
          {Object.entries(routing).map(route => <div className="link">
            <Link to={ROUTE[route[0]]}>{route[1]}</Link>
          </div>)}
        </nav>
      </div>
    </section>
  )
}

export default BottomNavigation
