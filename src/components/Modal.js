import React from "react";
import Icon from "./Icon";

export default function Modal({
                                  title,
                                  setModal,
                                  children,
                                  size = "24rem",
                                  canClose = true,
                              }) {
    function onClose() {
        if (canClose) setModal(null);
    }

    return (
        <div className="">
            <div className="" onClick={ onClose }/>
            <div
                className=""
                style={ { width: size } }
            >
                <div className="">
                    { title ? (
                        <div className="">
                            <div className="">{ title }</div>
                            <a className="" href="onClose" onClick={ onClose }>
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
