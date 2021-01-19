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

  const getOfferingData = getData(sellerContext.state.offeringData)

  const previewImage = (submited) => {
    console.log(submited)
    sellerContext.dispatch(Seller.updateOfferingData({
      [NAME.IMAGE]: submited.currentTarget.result,
    }))
  }

  const imageUploadHandler = (e) => {
    const fileReader = new FileReader()
    fileReader.addEventListener('load', previewImage)

    console.log(e)
    Image.name = e?.target?.files[0]?.name
    Image.size = e?.target?.files[0]?.size
    Image.type = e?.target?.files[0]?.type

    // check for errors
    Image.rules = {
      size: Image.size > maxSize,
      type: !acceptedImageFormats.includes(Image.type) && Image.type !== undefined,
      existing: !Image.name
    }

    console.log('data: ', Image)
    console.log('file: ', e.target.files[0])

    console.log(!Image.rules.size && !Image.rules.type && !Image.rules.existing)

    if(!Image.rules.size && !Image.rules.type && !Image.rules.existing) {
      console.log('wtf')
      sellerContext.dispatch(Seller.updateOfferingData({
        [NAME.SELECTED_FILE]: e.target.files[0]
      }))
      console.log('past')
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
      <div className={`image-upload-container flex center ${sellerContext.state.offeringData && (getOfferingData(NAME.IMAGE) ? 'uploaded' : 'awaiting')}`}>
        <div className="image-upload">
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
