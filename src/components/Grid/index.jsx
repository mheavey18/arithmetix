import "./style.css"

const Grid = (props) => {
    const buttons = []
    for (let i = 0; i < props.options.length; i++) {
        buttons.push(
            <button
                className="numberButton"
                onClick={() => {
                    props.gridButtonOnClick(props.options[i].value, i)
                }}
                key={`${i}-${props.options[i]}`}
                disabled={!props.options[i].canUse}
            >
                {props.options[i].value}
            </button>
        )
    }
    return (
        <div className="buttons">
            {buttons}
        </div>
    )
}

export default Grid