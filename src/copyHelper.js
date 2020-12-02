import React from "react";
import { CheckCircle, Copy } from "react-feather";
import { useCopyClipboard } from "./hooks";

const TransactionStatusText = ({ children }) => (
    <span className="ml1 f6 flex flex-nowrap items-center">{ children }</span>
);

export default function CopyHelper({ toCopy, children }) {
    const [isCopied, setCopied] = useCopyClipboard();

    return (
        <button
            className="gray3 hover-gray1 outline-0 bg-none bn pointer flex f6 justify-center button primary"
            onClick={ () => setCopied(toCopy) }
        >
            { isCopied ? (
                <TransactionStatusText>
                    <CheckCircle size={ "16" }/>
                    <TransactionStatusText>Copied</TransactionStatusText>
                </TransactionStatusText>
            ) : (
                <TransactionStatusText>
                    <Copy size={ "16" }/>
                </TransactionStatusText>
            ) }
            { isCopied ? "" : children }
        </button>
    );
}
