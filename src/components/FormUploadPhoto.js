import React, { useState, useEffect, useRef } from 'react'

import "./FormUploadPhoto.scss"

import { IconPlus } from "./Icons"

const maxSize =  2 * (1000 * 1000) // in mb

const acceptedImageFormats = ['image/gif', 'image/jpeg', 'image/png']

const Image = {
  name: null,
  size: null,
  type: null, 
  rules: null,
}

function UploadPhoto() {
  const thumbnailRef = useRef()
  const [imageUploaded, setImageUploaded] = useState(0)
  const [imageData, setImageData] = useState({
    name: null,
    error: {
      size: false,
      type: false
    }
  })

  const fileReader = new FileReader()

  const previewImage = (submited) => {
    console.log(thumbnailRef.current.style.backgroundImage )
    thumbnailRef.current.src = submited.currentTarget.result // sanitize
  }

  useEffect(() => {
    fileReader.addEventListener('load', previewImage)
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

    if(Image.rules.size || Image.rules.type) {
      // set errors
      setImageData({...imageData, error: Image.rules})
      setImageUploaded(0)

    } else {
      // set image
      console.log('read')
      fileReader.readAsDataURL(e.target.files[0])
      setImageUploaded(1)
      setImageData({...imageData, name: Image.name})

    }
  }

  return ( 
    <div className="upload-photo">
      <h1>Photo</h1>
      <input id="offer-image-upload" type="file" onChange={(e) => imageUploadHandler(e)}/>
      <div className={`image-upload-container flex center ${imageUploaded ? 'uploaded' : 'awaiting'}`}>
        <div className="image-upload">
          {imageUploaded ? 
          <div className="thumb-container">
            <img ref={thumbnailRef} className="thumbnail" alt="thumbnail"/> 
          </div> : null
        }
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
