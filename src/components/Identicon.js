import React, { useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Jazzicon from "jazzicon";

export default function Identicon() {
    const ref = useRef();

    const { account } = useWeb3React();

    useEffect(() => {
        if (account && ref.current) {
            ref.current.innerHTML = "";
            ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
        }
    }, [account]);

    return <div className="" ref={ ref }/>;
}
