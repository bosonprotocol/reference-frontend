import React from 'react'
import { useHistory } from 'react-router-dom'
import { IconSuccess, IconError, LockedIcon } from "./Icons"
import { MESSAGE } from "../../helpers/Dictionary"

import "./MessageScreen.scss"

function MessageScreen({messageType, title, text, link, setMessageType}) {
  const history = useHistory()
 
  return (
    <section className="message">
      <div className="container flex column split">
        <div className="top-side flex column center">
          <div className="status-icon">{
            messageType === MESSAGE.SUCCESS ?
              <IconSuccess /> :
            messageType === MESSAGE.ERROR ?
              <IconError /> : 
            messageType === MESSAGE.LOCKED ?
              <LockedIcon /> :
            null
          }</div>
          <p className="title">{title}</p>
          <p className="description">{text}</p>
        </div>
        <div className="action">
          <div className="button primary" onClick={()=> !setMessageType ? history.push(link) : setMessageType(false)}>CLOSE</div>
        </div>
      </div>
    </section>
  )
}

export default MessageScreen
