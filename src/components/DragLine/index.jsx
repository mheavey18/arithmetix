import { evaluate } from "mathjs"

const displayNum3 = (num1, symbol, num2) => (
    evaluate(`${num1}${symbol}${num2}`)
)

const DragLine = (props) => {
    return (
        <div>
            {props.num1}
            {props.symbol}
            {props.num2}
            =
            {
                props.num1 && props.num2 && props.symbol
                    ? evaluate(`${props.num1}${props.symbol}${props.num2}`)
                    : "TBD"
            }
        </div>
    )
}

export default DragLine
