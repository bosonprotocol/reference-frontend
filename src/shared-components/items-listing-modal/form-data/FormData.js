/* eslint-disable react-hooks/exhaustive-deps */
import "../ItemsListingModal.scss";
import "../../wallet-connect/WalletConnect.scss";
import { Fragment } from "react";
import ContextModal from "../../modals/context-modal/ContextModal";
import PopupMessage from "../../popup-message/PopupMessage";
import GenericMessage from "../../../views/generic-message/GenericMessage";
import { MESSAGE } from "../../../helpers/configs/Dictionary";

function FormData({ item }) {
  const itemEntries = Object.entries(item);

  const rowOfItems = () => {
    let rows = [];
    for (let i = 0; i < itemEntries.length; i += 2) {
      if (
        itemEntries[i][0] !== "Ready To Process" &&
        itemEntries[i][0] !== "Creation Status"
      ) {
        rows.push(
          <div className="row" style={{ width: "90%" }}>
            {itemEntries[i] && (
              <div style={{ fontSize: "calc(0.6vw + 0.6vh)" }}>
                <span>{itemEntries[i][0]}</span>
                <input
                  style={{ marginLeft: "-20%" }}
                  disabled="true"
                  value={itemEntries[i][1]}
                />
              </div>
            )}
            <div style={{ width: "25%" }}></div>
            {itemEntries[i + 1] && (
              <div style={{ fontSize: "calc(0.6vw + 0.6vh)" }}>
                <span>{itemEntries[i + 1][0]}</span>
                <input
                  style={{ marginLeft: "-20%" }}
                  disabled="true"
                  value={itemEntries[i + 1][1]}
                />
              </div>
            )}
          </div>
        );
      }
    }
    return rows;
  };

  return (
    <Fragment>
      <section className="item-form">
        {itemEntries && rowOfItems()}
        <button className="button" role="button">
          CREATE OFFER
        </button>
      </section>
    </Fragment>
  );
}

export default FormData;
