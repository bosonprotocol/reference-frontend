import React from 'react'
import { Link } from 'react-router-dom'
import QRCode from "qrcode.react";

import "./StaticPage.scss"

import { ROUTE } from '../helpers/Dictionary'

function ShowQR(props) {

    const voucherId = props.match.params.id;

    return (
        <section className="show-qr-code static-page atomic-scoped flex ai-center">
            <div className="container l infinite">
                <div className="wrapper w100 relative flex column center">
                    <div className="top-nav">
                        <Link to={ ROUTE.Home }>
                            <div className="cancel"><span className="icon"></span></div>
                        </Link>
                    </div>
                    <div className="info show-qr flex column ai-center">
                        <div className="thumbnail">
                            {/*<img src={productAPI[imageThumbId].image} alt=""/>*/ }
                        </div>
                        <h1>Show the QR code to the seller</h1>
                        <div className="qr-container">
                            <QRCode value={ voucherId } includeMargin={ true }/>
                        </div>
                        <p className="descrption">{ voucherId }</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShowQR
