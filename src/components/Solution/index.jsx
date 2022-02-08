import { Fragment } from "react"
import "./style.css"

const NumberBox = (props) => {
    const leftParen = props.parenPositions.some(obj => obj.position === props.position && obj.location === "left")
    const rightParen = props.parenPositions.some(obj => obj.position === props.position && obj.location === "right")
    return (
        <div className="numberBox">
            <div
                className="leftParen"
                onClick={() => {
                    if (leftParen) {
                        props.setParenPositions(
                            props.parenPositions.filter(obj => obj.position !== props.position && obj.location !== "left"),
                        )
                    } else {
                        props.setParenPositions(
                            [
                                ...props.parenPositions,
                                { position: props.position, location: "left" }
                            ]
                        )
                    }
                }}
            >
                {
                    leftParen && "("
                }
            </div>
            <div className="numberInput">
                {props.numberInput}
            </div>
            <div
                className="rightParen"
                onClick={() => {
                    if (rightParen) {
                        props.setParenPositions(
                            props.parenPositions.filter(obj => obj.position !== props.position && obj.location !== "right"),
                        )
                    } else {
                        props.setParenPositions(
                            [
                                ...props.parenPositions,
                                { position: props.position, location: "right" }
                            ]
                        )
                    }
                }}
            >
                {
                    rightParen && ")"
                }
            </div>
        </div>
    )
}

const SymbolBox = (props) => {
    return (
        <div className="symbolBox">
            {props.symbolInput}
        </div>
    )
}

const Solution = (props) => {
    const boxes = []
    for (let i = 0; i < 5; i++) {
        if (i === 4) {
            boxes.push(
                <Fragment key={i}>
                    <NumberBox
                        numberInput={props.numbersSelected[i]}
                        position={i}
                        parenPositions={props.parenPositions}
                        setParenPositions={props.setParenPositions}
                    />
                    <SymbolBox
                        symbolInput="="
                    />
                </Fragment>
            )
        } else {
            boxes.push(
                <Fragment key={i}>
                    <NumberBox
                        numberInput={props.numbersSelected[i]}
                        position={i}
                        parenPositions={props.parenPositions}
                        setParenPositions={props.setParenPositions}
                    />
                    <SymbolBox
                        symbolInput={props.symbolsSelected[i]}
                    />
                </Fragment>
            )
        }
    }
    return (
        <div className="solution">
            {boxes}
            <div>
                {props.computedTotal}
            </div>
        </div>
    )
}

export default Solution