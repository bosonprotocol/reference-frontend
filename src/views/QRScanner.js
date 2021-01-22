import React from 'react'
import QRCodeScanner from "../components/shared/QRCodeScanner"

function QRScanner() {
  return (
    <section className="qr-scanner">
      <div className="target">
        <div className="layer-1"></div>
        <div className="layer-2"></div>
      </div>
      <QRCodeScanner />
    </section>
  )
}

export default QRScanner
