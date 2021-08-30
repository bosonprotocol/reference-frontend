/* eslint-disable react-hooks/exhaustive-deps */
import '../ItemsListingModal.scss';
import '../../wallet-connect/WalletConnect.scss';
import { Fragment } from 'react';

function FormData({ item }) {
    const itemEntries = Object.entries(item);

    const rowOfItems = () => {
        let rows = [];
        for (let i = 0; i < itemEntries.length; i += 2) {
            rows.push(<div className='row'>
                {itemEntries[i] && <div>
                    <span>{itemEntries[i][0]}</span>
                    <input disabled='true' value={itemEntries[i][1]} />
                </div>}
                {itemEntries[i + 1] && <div>
                    <span>{itemEntries[i + 1][0]}</span>
                    <input disabled='true' value={itemEntries[i + 1][1]} />
                </div>}
            </div >)
        }
        return rows;
    }

    return <Fragment>
        <section className='item-form'>
            {itemEntries && rowOfItems()}
            <button
                className='button'
                role='button'
            >
                CREATE OFFER
            </button>
        </section>
    </Fragment>
}

export default FormData;