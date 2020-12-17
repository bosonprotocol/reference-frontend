import React from 'react'
import { Link } from 'react-router-dom'

import "./StaticPage.scss"

import { productAPI } from "../PlaceholderAPI"
import { ROUTE } from '../helpers/Dictionary'

function ShowQR() {
  const imageThumb = JSON.parse(localStorage.getItem('productsReviewed'))
  const imageThumbId = imageThumb[imageThumb.length - 1]

  return (
    <section className="show-qr-code static-page atomic-scoped flex ai-center">
    <div className="container l infinite">
      <div className="wrapper w100 relative flex column center">
        <div className="top-nav">
          <Link to={ROUTE.Home}>
            <div className="cancel"><span className="icon"></span></div>
          </Link>
        </div>
        <div className="info show-qr flex column ai-center">
          <div className="thumbnail">
            <img src={productAPI[imageThumbId].image} alt=""/>
          </div>
          <h1>Show the QR code to the seller</h1>
          <p className="descrption">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text.</p>
          <div className="qr-container">
            <img src="images/temp/qr-code.jpg" alt=""/>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ShowQR
