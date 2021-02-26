import React from 'react'

import { Link } from "react-router-dom"

import "./ProductBlock.scss"

import { IconEth, IconDeposit } from "../shared/Icons"

import { ROUTE } from "../../helpers/Dictionary"


function ProductBlock(props) {
    const { id, title, image, price, deposit, col, delay, animate } = props
    const productType = col ? "col" : ""

    return (
        <Link to={ `${ ROUTE.Activity }/${ id }` }>
        <div
            // onClick={ openProduct }
            className={ `product-block ${ productType }  ${ animate ? 'animate' : '' }` }
        >
            <div className={ `product-image flex center ${ productType }` }>
                <img style={ { transitionDelay: delay } } src={ image } alt={ title }/>
            </div>
            <h3>{ title }</h3>
            <div className="price flex ai-center">
                <span><IconEth/>{ price } ETH</span>
                <span><IconDeposit/> { deposit } ETH</span>
            </div>
        </div>
        </Link>
    )
}

export default ProductBlock
