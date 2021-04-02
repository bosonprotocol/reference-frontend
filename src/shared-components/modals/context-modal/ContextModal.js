import React, { useContext } from "react";

import { ModalContext, ModalResolver } from "../../../contexts/Modal";

import "./ContextModal.scss";
import { MODAL_TYPES } from "../../../helpers/configs/Dictionary";

const ContextModal = () => {
  const modalContext = useContext(ModalContext);

  function hideModal() {
    modalContext.dispatch(ModalResolver.showModal(false));
  }

  return (
    <ModalContext.Consumer>
      {(context) => {
        if (context.state.showModal.show) {
          return (
            <div className="contextModalWrapper">
              <div className="contextModalBase">
                <div className="contextModalContent">
                  {context.state.showModal.type ===
                  MODAL_TYPES.GENERIC_ERROR ? (
                    <GenericErrorTemplate
                      message={context.state.showModal.content}
                    />
                  ) : null}
                </div>
                <div className="contextModalFooter">
                  <div className="closeContext" onClick={hideModal}>
                    <img
                      src="/images/icons/close-context-modal.png"
                      alt="Close"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
      }}
    </ModalContext.Consumer>
  );
};

function GenericErrorTemplate({ message }) {
  return (
    <div>
      <h1>An error occurred</h1>
      <p className="genericErrorMessage">{message}</p>
    </div>
  );
}

export default ContextModal;
