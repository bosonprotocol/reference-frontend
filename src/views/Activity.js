import React, { useState, useEffect } from 'react'

import "./Activity.scss"

import * as ethers from "ethers";

import { getAllVoucherSets } from "../hooks/api";

function Activity() {
    const [productBlocks, setProductBlocks] = useState([])

    useEffect(() => {
        async function getVoucherSets() {
            const allVoucherSets = await getAllVoucherSets();
            prepareVoucherSetData(allVoucherSets)
        }

        getVoucherSets()
    }, [])


    const prepareVoucherSetData = (rawVoucherSets) => {
        if (!rawVoucherSets) {
            setProductBlocks([])
            return;
        }

        let parsedVoucherSets = [];

        for (const voucherSet of rawVoucherSets.voucherSupplies) {
            let parsedVoucherSet = {
                id: voucherSet._id,
                title: voucherSet.title,
                image: voucherSet.imagefiles[0]?.url ? voucherSet.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
                price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
                deposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal)
            };

            parsedVoucherSets.push(parsedVoucherSet)
        }

        console.log(parsedVoucherSets);
        setProductBlocks(parsedVoucherSets)
    };

    return (
        <section className="activity atomic-scoped">
            <div className="container">
                <div className="title">
                    <h1>Activity</h1>
                </div>
                <div className="vouchers-container">

                    {
                        productBlocks.map((block, id) => <Block { ...block } key={ id }/>)
                    }
                </div>
            </div>
        </section>
    )
}

const Block = (props) => {
    const { title, image, price } = props

    const status = 'OFFERED';
    const date = 'Oct 26th 2020';
    const currency = 'ETH';
    const quantity = 1;

    return (
        <div className="voucher-block flex">
            <div className="thumb no-shrink">
                <img src={ image } alt={ title }/>
            </div>
            <div className="info grow">
                <div className="status flex split">
                    <div className="label">{ status }</div>
                    <div className="date">{ date }</div>
                </div>
                <div className="title">{ title }</div>
                <div className="price flex split">
                    <div className="value flex center"><img src="images/icon-eth.png" alt="eth"/> { price } { currency }
                    </div>
                    <div className="quantity">QTY: { quantity }</div>
                </div>
            </div>
        </div>
    )
}

export default Activity
