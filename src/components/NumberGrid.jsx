// TODO: Delete this; it's is no longer used
const Grid = (props) => {
    const buttons = []
    for (let i = 0; i < props.numberOptions.length; i++) {
        buttons.push(
            <button
                onClick={() => {
                    props.updateSolution(props.numberOptions[i].number)
                    props.numberOptions[i].canUse = false
                }}
                key={`${i}-${props.numberOptions[i]}`}
                disabled={!props.numberOptions[i].canUse}
            >
                {props.numberOptions[i].number}
            </button>
        )
    }
    const symbols = ["+", "-", "x", "÷", "(", ")"]
    for (let j = 0; j < symbols.length; j++) {
        buttons.push(
            <button
                onClick={() => props.updateSolution(symbols[j])}
                key={symbols[j]}
            >
                {symbols[j]}
            </button>
        )
    }
    return (
        <div>{buttons}</div>
    )
}

export default Grid
