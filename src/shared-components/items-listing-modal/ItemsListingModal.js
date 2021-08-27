/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Arrow } from "../icons/Icons";
import FormData from './form-data/FormData';
import './ItemsListingModal.scss';

function ItemsListingModal({ items, setModal }) {
    const [index, setIndex] = useState(0);

    const onNext = () => {
        setIndex(prevIndex => {
            return prevIndex < items.length - 1 ? prevIndex += 1 : items.length - 1;
        })
    }

    const onPrevious = () => {
        setIndex(prevIndex => {
            return prevIndex > 0 ? prevIndex -= 1 : 0;
        })
    }

    return <section className='items-listing-background'
        onClick={(e) => {
            e.target.className === 'items-listing-background' ? setModal(false) : null
        }}>
        <section className='items-listing-modal'>

            <div
                className="button square new"
                role="button"
                id="topNavBackButton"
                onClick={() => {
                    setModal(false)
                }}
            >
                <Arrow color="#dc2cb8" />

            </div>

            {items[index] && <FormData item={items[index]} />}

            <p class="next" onClick={onNext} onKeyUp={onNext}>❯</p>
            <p class="prev" onClick={onPrevious} onKeyDown={onPrevious}>❮</p>

        </section>
    </section >
}

export default ItemsListingModal;