import * as React from "react";
import QrReader from "react-qr-reader";
import "./QRCodeScanner.scss";
import { useState } from "react";

function QRCodeScanner() {
    const [delay, setDelay] = useState(300);

    const stopRecording = () => {
        setDelay(false)
    };

    const handleScan = (data) => {
        if (data) {
            // console.log(data);
            //ToDo: Should validate the result
            // const { result, error } = validate(data);
            stopRecording();
        }
    };

    const handleError = (error) => {
        if (error) {
            this.props.onError(error);
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
