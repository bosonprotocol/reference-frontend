import React, { useEffect, useRef, useContext, useState } from 'react'

import { SellerContext, Seller } from "../../contexts/Seller"

import "./FormUploadPhoto.scss"

import { IconPlus } from "../shared/Icons"

import { NAME } from "../../helpers/Dictionary"


const maxSize =  ( 3 ) * (1000 * 1000) // in mb
const acceptedImageFormats = ['image/gif', 'image/jpeg', 'image/png']

const Image = {
  name: null,
  size: null,
  type: null, 
  rules: null,
}

function UploadPhoto(props) {
  const sellerContext = useContext(SellerContext)
  const thumbnailRef = useRef()

  const getData = (name) => sellerContext.state.offeringData[name]

  const fileReader = new FileReader()

  const previewImage = (submited) => {
    sellerContext.dispatch(Seller.updateOfferingData({
      [NAME.IMAGE]: submited.currentTarget.result,
    }))
  }

  useEffect(() => {
    fileReader.addEventListener('load', previewImage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const imageUploadHandler = (e) => {
    Image.name = e.target.files[0].name
    Image.size = e.target.files[0].size
    Image.type = e.target.files[0].type

    // check for errors
    Image.rules = {
      size: Image.size > maxSize,
      type: !acceptedImageFormats.includes(Image.type)
    }

    if(!Image.rules.size || !Image.rules.type) {
      fileReader.readAsDataURL(e.target.files[0])
    } else {
      // set errors
    }
  }

  return ( 
    <div className="upload-photo">
      <div className="step-title">
        <h1>Photo</h1>
      </div>
      <input id="offer-image-upload" type="file" onChange={(e) => imageUploadHandler(e)}/>
      <div className={`image-upload-container flex center ${sellerContext.state.offeringData && (getData(NAME.IMAGE) ? 'uploaded' : 'awaiting')}`}>
        <div className="image-upload">
          <div className="thumb-container">
            <img src={sellerContext.state.offeringData[NAME.IMAGE]} ref={thumbnailRef} className="thumbnail" alt="thmbnail"/> 
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
