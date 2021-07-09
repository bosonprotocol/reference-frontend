import React, { useContext } from "react";
import { ModalContext, ModalResolver } from "../../../contexts/Modal";
import "./ContextModal.scss";
import { MODAL_TYPES } from "../../../helpers/configs/Dictionary";
import { getAccountStoredInLocalStorage } from "../../../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import { ROUTE } from "../../../helpers/configs/Dictionary";
const ContextModal = () => {
  const modalContext = useContext(ModalContext);
  const { account } = useWeb3React();

  function hideModal() {
    const authData = getAccountStoredInLocalStorage(account);
    if (!authData.activeToken) {
      localStorage.clear();
      /* 
        We use window.location.href, because we are unable to access useHistory hook,
        due to that we out of the scope of the Router.
      */
      window.location.href = ROUTE.Home;
    }
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
