import React, {  useContext } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import "./FormUploadPhoto.scss"

import { IconPlus } from "../shared/Icons"

import { NAME } from "../../helpers/Dictionary"





function UploadPhoto({inputValueReceiver, uploadImageErrorMessage}) {
  const sellerContext = useContext(SellerContext)


  const getOfferingData = getData(sellerContext.state.offeringData)


  return ( 
    <div className="upload-photo">
      <div className="step-title">
        <h1>Photo</h1>
      </div>
      <input id="offer-image-upload" type="file" onChange={(e) => inputValueReceiver(e && e.target ? e.target?.files[0] : null)}/>
      <div className={`image-upload-container flex center ${sellerContext.state.offeringData && (getOfferingData(NAME.IMAGE) ? 'uploaded' : 'awaiting')}`}>
        <div className="image-upload input" data-error={uploadImageErrorMessage}>
          <div className="thumb-container">
            <img src={getOfferingData(NAME.IMAGE)} className="thumbnail" alt="thmbnail"/> 
          </div>
          <div className="label">
            <label htmlFor="offer-image-upload" className="flex center column">
              <IconPlus />
              <span>Add photo</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPhoto
