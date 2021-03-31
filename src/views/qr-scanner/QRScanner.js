import React from "react";
import QRCodeScanner from "../../components/shared/qr-code-scanner/QRCodeScanner";

import { Link } from "react-router-dom";

import { ROUTE } from "../../helpers/configs/Dictionary";

function QRScanner() {
  return (
    <section className="qr-scanner static-page">
      <div className="button-container">
        <Link to={ROUTE.Home}>
          <div className="cancel new">
            <span className="icon"></span>
          </div>
        </Link>
      </div>
      <div className="target">
        <div className="layer-1"></div>
        <div className="layer-2"></div>
      </div>
      <QRCodeScanner />
    </section>
  );
}

export default QRScanner;
