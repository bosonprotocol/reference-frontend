import React from 'react'
import QRCodeScanner from "../components/shared/QRCodeScanner"

function QRScanner() {
  return (
    <section className="qr-scanner">
      <div className="container">
        <QRCodeScanner />
      </div>
    </section>
  )
}

export default QRScanner
