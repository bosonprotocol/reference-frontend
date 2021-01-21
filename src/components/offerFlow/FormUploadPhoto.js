import React, { useRef, useContext } from 'react'

import { SellerContext, Seller, getData } from "../../contexts/Seller"

import "./FormUploadPhoto.scss"

import { IconPlus } from "../shared/Icons"

import { NAME } from "../../helpers/Dictionary"


const maxSize =  ( 3 ) * (1000 * 1000) // in mb
const acceptedImageFormats = ['image/jpeg', 'image/png']

const Image = {
  name: null,
  size: null,
  type: null, 
  rules: null,
}

function UploadPhoto() {
  const sellerContext = useContext(SellerContext)
  const thumbnailRef = useRef()
  const errorHandle = useRef()

  const getOfferingData = getData(sellerContext.state.offeringData)

  const previewImage = (submited) => {
    sellerContext.dispatch(Seller.updateOfferingData({
      [NAME.IMAGE]: submited.currentTarget.result,
    }))
  }

  const imageUploadHandler = (e) => {
    errorHandle.current.removeAttribute('data-error')
    const fileReader = new FileReader()
    fileReader.addEventListener('load', previewImage)

    Image.name = e?.target?.files[0]?.name
    Image.size = e?.target?.files[0]?.size
    Image.type = e?.target?.files[0]?.type


    // check for errors
    Image.rules = {
      size: Image.size > maxSize,
      type: !acceptedImageFormats.includes(Image.type) && Image.type !== undefined,
      existing: !Image.name
    }

    const error = 
    Image.rules.type ? `This file type is not allowed.` :
    Image.rules.size ? `Image is too large! Maximum file size is ${maxSize / (1000 * 1000)}mb` :
    false

    error && errorHandle.current.setAttribute('data-error', error)

    sellerContext.dispatch(Seller.updateOfferingData({
      [NAME.SELECTED_FILE]: e.target.files[0]
    }))
    if(!Image.rules.size && !Image.rules.type && !Image.rules.existing) {
      fileReader.readAsDataURL(e.target.files[0]) 
    }
    //  else {
    //   const error = 
    //   Image.rules.type ? `This file type is not allowed.` :
    //   Image.rules.size ? `Image is too large! Maximum file size is ${maxSize / (1000 * 1000)}mb` :
    //   'There was an error. Please try again.'

    //   errorHandle.current.setAttribute('data-error', error)
    // }
  }

  return ( 
    <div className="upload-photo">
      <div className="step-title">
        <h1>Photo</h1>
      </div>
      <input id="offer-image-upload" type="file" onChange={(e) => imageUploadHandler(e)}/>
      <div className={`image-upload-container flex center ${sellerContext.state.offeringData && (getOfferingData(NAME.IMAGE) ? 'uploaded' : 'awaiting')}`}>
        <div ref={errorHandle} className="image-upload input">
          <div className="thumb-container">
            <img src={getOfferingData(NAME.IMAGE)} ref={thumbnailRef} className="thumbnail" alt="thmbnail"/> 
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
