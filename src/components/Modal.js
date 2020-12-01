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
        <div className="flex items-center justify-center bg-black-80 fixed absolute--fill z-2">
            <div className="fixed absolute--fill" onClick={ onClose }/>
            <div
                className="modal relative flex flex-column items-center mw6 mw7-ns mb7 mb4-ns"
                style={ { width: size } }
            >
                <div className="br0 shadow-4 bg-white br4-ns center w-100">
                    { title ? (
                        <div className="flex items-center justify-between pa3">
                            <div className="di f5 fw5">{ title }</div>
                            <a className="gray4 hover-gray2" onClick={ onClose }>
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
