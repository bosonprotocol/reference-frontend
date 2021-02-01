import React, { useState } from 'react'

import "./EscrowDiagram.scss"

function EscrowDiagram(props) {
    const [escrowData, setEscrowData] = useState({})

    props.escrowData.then(res => {
        setEscrowData(res)
    })

    return (
        <>
            {
                escrowData ?
                    <section className="escrow-diagram vertical no-bg">
                        <div className="section-title flex split">
                            <h2>Payment and Deposits</h2>
                            <div className="info" role="button">?</div>
                        </div>
                        <div className="semi-container">
                            <div className="top-row flex ai-center jc-end">
                                <div className="cell set">BUYER</div>
                                <div className="cell set">BOSON ESCROW</div>
                                <div className="cell set">SELLER</div>
                            </div>
                            <div className="body">
                                { Object.values(escrowData).map((row, key) => <EscrowRow
                                    key={ key } { ...row } />) }
                            </div>
                        </div>
                    </section> : null
            }
        </>
    )
}

const EscrowRow = (props) => {
    const { title, currency, position } = props

    const color = title !== 'SELLER DEPOSIT' ? '1' : '2'

    return (
        <div className="body-row flex ai-center">
            <div className={ `block cell set title color_${ color }` }>{ title }</div>
            <div className="block flex relative">
                
                {
                    position.map((block, index) => block ? <div key={index} className={ `cell val position_${ index+1 } color_${ color }` }>{ `${block} ${currency}` }</div> : null) 
                }
                <div className="cell"></div>
                <div className="cell"></div>
                <div className="cell"></div>
            </div>
        </div>
    )
}

export default EscrowDiagram
