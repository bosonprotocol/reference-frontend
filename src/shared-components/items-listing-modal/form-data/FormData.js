/* eslint-disable react-hooks/exhaustive-deps */
import "../ItemsListingModal.scss";
import "../../wallet-connect/WalletConnect.scss";
import { useState, Fragment } from "react";
import ContextModal from "../../modals/context-modal/ContextModal";
import PopupMessage from "../../popup-message/PopupMessage";
import GenericMessage from "../../../views/generic-message/GenericMessage";
import { MESSAGE } from "../../../helpers/configs/Dictionary";

function FormData({ item }) {
    const [popupMessage, setPopupMessage] = useState();

    const itemEntries = Object.entries(item);

    const rowOfItems = () => {
        let rows = [];
        for (let i = 0; i < itemEntries.length; i += 2) {
            if (
                itemEntries[i][0] !== "Ready To Process" &&
                itemEntries[i][0] !== "Creation Status"
            ) {
                rows.push(
                    <article className="row" style={{ width: "90%" }}>
                        {itemEntries[i] && (
                            <article style={{ fontSize: "calc(0.6vw + 0.6vh)" }}>
                                <span>{itemEntries[i][0]}</span>
                                <input
                                    style={{ marginLeft: "-20%" }}
                                    disabled="true"
                                    value={itemEntries[i][1]}
                                />
                            </article>
                        )}
                        <article style={{ width: "25%" }}></article>
                        {itemEntries[i + 1] && (
                            <article style={{ fontSize: "calc(0.6vw + 0.6vh)" }}>
                                <span>{itemEntries[i + 1][0]}</span>
                                <input
                                    style={{ marginLeft: "-20%" }}
                                    disabled="true"
                                    value={itemEntries[i + 1][1]}
                                />
                            </article>
                        )}
                    </article>
                );
            }
        }
        return rows;
    };

    return (
        <Fragment>
            <section className="item-form">
                {itemEntries && rowOfItems()}

                {<PopupMessage {...popupMessage} />}

                <button className="button create-offer" role="button" onClick={() =>
                    setPopupMessage({
                        // toDo insert message here
                        text: 'message',
                        controls: (
                            <div className="flex split button-pair">
                                <div
                                    className="button gray"
                                    role="button"
                                    onClick={() => setPopupMessage(false)}
                                >
                                    BACK
                                </div>
                                <div
                                    className="button primary"
                                    role="button"
                                    onClick={() => console.log('CONFIRM')}
                                >
                                    CONFIRM
                             </div>
                            </div>
                        ),
                    })}>
                    CREATE OFFER
        </button>
            </section>
        </Fragment >
    );
}

export default FormData;
