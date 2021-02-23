import * as React from "react";
import QrReader from "react-qr-reader";
import "./QRCodeScanner.scss";
import { useState, useContext } from "react";

import { GlobalContext, Action } from '../../contexts/Global'

import { useHistory } from "react-router-dom";
import { MODAL_TYPES, ROUTE } from "../../helpers/Dictionary";
import { ModalContext, ModalResolver } from "../../contexts/Modal";

function QRCodeScanner() {
    const globalContext = useContext(GlobalContext);
    const [delay, setDelay] = useState(300);
    const history = useHistory();
    const modalContext = useContext(ModalContext);

    const stopRecording = () => {
        globalContext.dispatch(Action.toggleQRReader(0))
        setDelay(false)
    };

    const handleScan = (data) => {
        if (data) {
            //ToDo: Should validate the result
            // const { result, error } = validate(data);

            history.push(`/voucher/${ data }`);
            stopRecording();
        }
    };

    const handleError = (error) => {
        if (error) {
            history.push(ROUTE.Home);

            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: 'Please grant permission to use the Camera so that you can check if the voucher is valid'
            }));
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
            delay={ delay }
            onError={ handleError }
            onScan={ handleScan }
            onClose={ onClose }
            className={ "qr-reader-container" }
        />
    );
}

export default QRCodeScanner;
