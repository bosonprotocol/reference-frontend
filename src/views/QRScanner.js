import React from 'react'
import QRCodeScanner from "../components/shared/QRCodeScanner"

import { Link } from 'react-router-dom'

import { ROUTE } from "../helpers/Dictionary"

function QRScanner() {
  return (
    <section className="qr-scanner static-page">
      <Link to={ROUTE.Home}>
        <div className="cancel new"><span className="icon"></span></div>
      </Link>
      <div className="target">
        <div className="layer-1"></div>
        <div className="layer-2"></div>
      </div>
      <QRCodeScanner />
    </section>
  )
}

export default QRScanner
