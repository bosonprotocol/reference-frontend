import React from 'react'

import Categories from "../components/Categories"
import UploadPhoto from "../components/UploadPhoto"

function NewOffer(props) {
  return (
    <section className="new-offer">
      <div className="container">
        <div className="top-navigation"></div>
        <div className="screen">
          <form>
            {/* <Categories /> */}
            <UploadPhoto />
          </form>
        </div>
        <div className="bottom-navigation"></div>
      </div>
    </section>
  )
}

export default NewOffer
