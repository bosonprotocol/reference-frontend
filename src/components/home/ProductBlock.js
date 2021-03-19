import React     from 'react'

import { Link } from "react-router-dom"

import "./ProductBlock.scss"

import { IconEth, IconDeposit, IconBsn } from "../shared/Icons"

import { ROUTE } from "../../helpers/Dictionary"


function ProductBlock(props) {
    const { id, title, image, price, deposit, col, paymentType} = props
    const productType = col ? "col" : ""

    const priceCurrency = paymentType === 1 || paymentType === 2 ? 'ETH' : 'BSN';
    const depositsCurrency = paymentType === 1 || paymentType === 3 ? 'ETH' : 'BSN';

    return (
        <Link to={ `${ ROUTE.Activity }/${ id }${ROUTE.Details}` }>
        <div
            // onClick={ openProduct }
            className={ `product-block ${ productType } ` } //${ animate ? 'animate' : '' }
        >
            <div className={ `product-image flex center ${ productType }` } style={{backgroundImage: `url('${image}')`}}></div>
            <h3>{ title }</h3>
            <div className="price flex ai-center">
                {
                    priceCurrency === 'ETH' ?  <span><IconEth/>{ price } ETH</span> :  <span><IconBsn/>{ price } BSN </span>
                    
                }
               {
                    depositsCurrency === 'ETH' ?   <span><IconDeposit/> { deposit } ETH</span> :   <span><IconDeposit/> { deposit } BSN </span>
                    
                }
            </div>
        </div>
        </Link>
    )
}

export default ProductBlock
