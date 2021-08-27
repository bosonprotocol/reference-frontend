/* eslint-disable react-hooks/exhaustive-deps */
import '../ItemsListingModal.scss';
import '../../wallet-connect/WalletConnect.scss';
import { Fragment } from 'react';

function FormData({ item }) {
    const itemEntries = Object.entries(item);

    return <Fragment>
        {/* <section className='seller-category'>
            <img
                src="./images/categories/electronics.png"
                alt="Leptonite Architecture"
            />
            <div className="wrapper">
                <div className="header">
                    <div className="header-title"></div>
                </div>
                <div className="ist">
                    <button className="list-item"></button>
                    <button className="list-item"></button>
                    <button className="list-item"></button>
                </div>
            </div>
        </section> */}

        <form className='item-form'>
            {
                itemEntries?.map((entry) =>
                    <div>
                        <span>{entry[0]}</span>
                        <input disabled='true' value={entry[1]} />
                    </div>
                )
            }
            <button className='button' role='button'>OFFER</button>
        </form>
    </Fragment>
}

export default FormData;