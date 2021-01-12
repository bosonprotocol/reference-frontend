import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router"

import "./Activity.scss"

import { GlobalContext, Action } from '../contexts/Global'

import * as ethers from "ethers";
import { getAllVoucherSets } from "../hooks/api";

import { Arrow, IconQR } from "../components/shared/Icons"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function Activity() {
  const [productBlocks, setProductBlocks] = useState([])
  const globalContext = useContext(GlobalContext);

  const history = useHistory()

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
        <div className="top-navigation flex split">
          <div className="button square dark" role="button" 
            onClick={() => history.goBack()}
          >
            <Arrow color="#80F0BE" />
          </div>
          <div className="qr-icon" role="button"
            onClick={ () => globalContext.dispatch(Action.toggleQRReader(1)) }><IconQR color="#8393A6" noBorder /></div>
        </div>
        <div className="title">
          <h1>Activity</h1>
        </div>
        <Tabs>
          <TabList>
            <Tab>Title 1</Tab>
            <Tab>Title 2</Tab>
          </TabList>

          <TabPanel>
            {<ActiveView products={productBlocks} />}
          </TabPanel>
          <TabPanel>
            {<InactiveView products={productBlocks} />}
          </TabPanel>
        </Tabs>
        
      </div>
    </section>
  )
}


const ActiveView = (props) => {
  const { products } = props
  return (
    <div className="vouchers-container">
    {
      products.map((block, id) => <Block { ...block } key={ id }/>)
    }
  </div>
  )
}

const InactiveView = (props) => {
  // const { products } = props
  return (
    <div className="vouchers-container">
            ... No vouchers
    {/* {
      products.map((block, id) => <Block { ...block } key={ id }/>)
    } */}
  </div>
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
        <div className="title elipsis">{ title }</div>
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
