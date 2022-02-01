const Grid = (props) => {
    const buttons = []
    for (let i = 0; i < props.numberOptions.length; i++) {
        buttons.push(
            <button
                onClick={() => props.onClick(props.numberOptions[i])}
                key={props.numberOptions[i]}
            >
                {props.numberOptions[i]}
            </button>
        )
    }
    const symbols = ["+", "-", "x", "÷"]
    for (let j = 0; j < symbols.length; j++) {
        buttons.push(
            <button
                onClick={() => props.onClick(symbols[j])}
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
