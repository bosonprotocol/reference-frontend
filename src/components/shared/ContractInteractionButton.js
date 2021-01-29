import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from 'react-router-dom';

export default function ContractInteractionButton(props) {
    let handleClick = null;
    let label = "";
    const { library, account } = useWeb3React();

    const history = useHistory();

    createButton();

    useEffect(() => {
        createButton()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [library, account]);

    function createButton() {
        if (library && account) {
            handleClick = props.handleClick;
            label = props.label;
        } else {
            label = "Connect";
            handleClick = goToConnectScreen;
        }
    }

    function goToConnectScreen() {
        history.push("/connect");
    }

    return (
        <div className={ props.className } role="button"
             onClick={ handleClick }>
            { label }
        </div>
    );
}
