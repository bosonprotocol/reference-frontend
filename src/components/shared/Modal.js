import React from "react";
import Icon from "./Icon";

export default function Modal({
  title,
  setModal,
  children,
  size = "24rem",
  canClose = true,
}) 
{
  function onClose() {
    if (canClose) setModal(null);
  }

  return (
    <div>
      <div onClick={ onClose }/>
      <div
        style={ { width: size } }
      >
        <div>
          { title ? (
            <div>
              <div>{ title }</div>
              <a href="onClose" onClick={ onClose }>
                <Icon name="x"/>
              </a>
            </div>
          ) : null }
          { children }
        </div>
      </div>
    </div>
  );
}
