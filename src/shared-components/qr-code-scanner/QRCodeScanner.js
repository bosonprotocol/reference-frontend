import * as React from "react";
import QrReader from "react-qr-reader";
import "./QRCodeScanner.scss";
import { useState, useContext } from "react";

import { GlobalContext, Action } from "../../contexts/Global";

import { useHistory } from "react-router-dom";
import { MODAL_TYPES, ROUTE } from "../../helpers/configs/Dictionary";
import { ModalContext, ModalResolver } from "../../contexts/Modal";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import { getVoucherDetails } from "../../hooks/api";

function QRCodeScanner() {
  const globalContext = useContext(GlobalContext);
  const [delay, setDelay] = useState(300);
  const history = useHistory();
  const modalContext = useContext(ModalContext);
  const { account } = useWeb3React();

  const stopRecording = () => {
    globalContext.dispatch(Action.toggleQRReader(0));
    setDelay(false);
  };

  const handleScan = async (data) => {
    if (data) {
      const authData = getAccountStoredInLocalStorage(account);

      if (!authData.activeToken) {
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content:
              "Please check your wallet for Signature Request. Once authentication message is signed you can proceed ",
          })
        );
        return;
      }

      try {
        await getVoucherDetails(data, authData.authToken);
      } catch (e) {
        document.errorr = e;
        if (e.response.status === 404) {
          modalContext.dispatch(
            ModalResolver.showModal({
              show: true,
              type: MODAL_TYPES.GENERIC_ERROR,
              content: "QR code seems to be invalid. Please try again.",
            })
          );
          return;
        }
      }

      history.push(`/vouchers/${data}/details`);
      stopRecording();
    }
  };

  const handleError = (error) => {
    if (error) {
      history.push(ROUTE.Home);

      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Please grant permission to use the Camera so that you can check if the voucher is valid",
        })
      );
    }
  };

  const onClose = async () => {
    try {
      await stopRecording();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <QrReader
      delay={delay}
      onError={handleError}
      onScan={handleScan}
      onClose={onClose}
      className={"qr-reader-container"}
    />
  );
}

export default QRCodeScanner;
