import React, { useRef, useEffect, useContext } from 'react'

import "./ProductView.scss"

import { TableRow, DateTable, PriceTable, TableLocation } from "./TableContent"

import { GlobalContext, Action } from "../../contexts/Global"
import { DIC } from "../../helpers/Dictionary"

// import EscrowDiagram from "./EscrowDiagram"


const closePoint = window.innerHeight / 4


function ProductView(props) {
    const productWindow = useRef();
    const windowContainer = useRef();
    const touchControl = useRef();

    const globalContext = useContext(GlobalContext);

    const selectedProduct = globalContext.state.allVoucherSets.find(x => x.id === globalContext.state.productView.id);

    const description = selectedProduct?.description;

    const tableContent = [
        ['Category', selectedProduct?.category],
        // ['Remaining Quantity', selectedProduct?.qty],
    ];

    const tablePrices = [
        ['Payment Price', selectedProduct?.price, 'ETH', 0],
        false,
        ['Buyer’s deposit', selectedProduct?.buyerDeposit, 'ETH', 1],
        ['Seller’s deposit', selectedProduct?.sellerDeposit, 'ETH', 1]
    ];

    function formatDate(date) {
        if (!date) {
            return "NA";
        }

        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const tableDate = [
        formatDate(selectedProduct?.startDate),
        formatDate(selectedProduct?.expiryDate)
    ];

    const tableLocation = 'Los Angeles';

    const delta = {
        offset: 0,
        state: 0,
        end: 0
    };


    const clearDialog = () => {
        productWindow.current.removeAttribute('style');
        productWindow.current.style.transition = '0.4s ease-in-out'
        windowContainer.current.classList.remove('open')
        globalContext.dispatch(Action.navigationControl(DIC.NAV.DEF))

        setTimeout(() => {
            globalContext.dispatch(Action.closeProduct())
        }, 400);
    }

    const dragControlerEnable = (e) => {
        productWindow.current.style.transition = 'none'
        delta.offset = e.clientY
        delta.state = 1
        productWindow.current.classList.add('noselect')
    }

    const dragControlerDisable = () => {
        if (!delta.state)
            return

        productWindow.current.style.transition = '0.4s ease-in-out'
        delta.state = 0

        productWindow.current.style.transform = delta.end > closePoint ?
            `translateY(100vh)` :
            `translateY(0px)`

        if (delta.end > closePoint) {
            clearDialog()
        }

        productWindow.current.classList.remove('noselect')
    }

    const dragControler = (e) => {
        delta.end = e.clientY - delta.offset

        if (delta.state)
            productWindow.current.style.transform = `translateY(${ delta.end }px)`
    }

    const touchHandler = (e) => {
        e.preventDefault()
        delta.state = 2
        productWindow.current.style.transition = 'none'
        productWindow.current.classList.add('noselect')

        delta.end = e.touches[0].clientY - productWindow.current.offsetTop

        productWindow.current.style.transform = `translateY(${ delta.end }px)`
    }

    useEffect(() => {
        setTimeout(() => {
            windowContainer.current.classList.add('open')
        }, 100)

        windowContainer.current.addEventListener('mousemove', dragControler, { passive: true })
        touchControl.current.addEventListener('touchmove', touchHandler, { passive: false })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <section
                ref={ windowContainer }
                className="product-view no-bg"
                onMouseLeave={ dragControlerDisable }
                onMouseUp={ dragControlerDisable }

                onTouchStart={ dragControlerDisable }
                onTouchEnd={ dragControlerDisable }
            >
                <div className="container erase">
                    <div className="window" ref={ productWindow }>
                        <div className="drag-controler"
                             onMouseDown={ (e) => dragControlerEnable(e) }
                             ref={ touchControl }
                        ></div>
                        <div className="thumbnail flex center">
                            <img className="mw100" src={ selectedProduct?.image } alt={ selectedProduct?.title }/>
                        </div>
                        <div className="content">
                            {/* <div className="escrow-container">
                                <EscrowDiagram status={ 'commited' }/>
                            </div> */}
                            <div className="product-info">
                                <h2>{ selectedProduct?.title }</h2>
                                <p>{ description }</p>
                            </div>
                            { tableLocation ? <TableLocation data={ tableLocation }/> : null }
                            { tableContent.some(item => item) ? <TableRow data={ tableContent }/> : null }
                            { tablePrices.some(item => item) ? <PriceTable data={ tablePrices }/> : null }
                            { tableDate.some(item => item) ? <DateTable data={ tableDate }/> : null }
                            {/* <div className="button refund" role="button">REFUND</div> */}
                        </div>
                    </div>
                </div>
                <div className="hide-dialog" onClick={ clearDialog }></div>
            </section>
            <div className="disable-scroll-propagation"></div>
        </>
    )
}

export default ProductView
