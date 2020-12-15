import React from 'react'

import Categories from "../components/Categories"

function NewOffer(props) {
  return (
    <section className="new-offer">
      <div className="container">
        <div className="top-navigation"></div>
        <div className="screen">
          <Categories />
        </div>
        <div className="bottom-navigation"></div>
      </div>
    </section>
  )
}

export default NewOffer
