import React, { useState } from "react"

import { sampleSize } from "lodash"
import { evaluate } from "mathjs"

import "./App.css"

// import Grid from "./components/NumberGrid"
import Grid from "./components/Grid"
import Solution from "./components/Solution"
import {
    decks,
    stringToMath,
    symbols,
} from "./constants"

const evaluateSelections = (numbersSelected, symbolsSelected, parenPositions) => {
    const solution = []
    for (let i = 0; i < 5; i++) {
        // check if we need a left paren
        if (parenPositions.some(obj => obj.position === i && obj.location === "left")) {
            solution.push("(")
        }
        // push number
        solution.push(numbersSelected[i])
        // check if we need a right paren
        if (parenPositions.some(obj => obj.position === i && obj.location === "right")) {
            solution.push(")")
        }
        // push symbol (use string to math object)
        if (symbolsSelected[i] in stringToMath) {
            solution.push(stringToMath[symbolsSelected[i]])
        } else {
            solution.push(symbolsSelected[i])
        }
    }
    // combine array into string
    // evaluate string
    return evaluate(solution.join(""))
}

const getNumberOptions = (deck, numOptions) => {
    const numbers = sampleSize(deck, numOptions)
    // map numbers to if they can still be used
    return numbers.map(number => ({ canUse: true, value: number }))
}

const App = () => {
    const [currentSolution, setCurrentSolution] = useState("")
    const [numbersSelected, setNumbersSelected] = useState([])
    const [symbolsSelected, setSymbolsSelected] = useState([])
    const [parenPositions, setParenPositions] = useState([])
    const [difficulty, setDifficulty] = useState("standard")
    const [numberOptions, setNumberOptions] = useState(getNumberOptions(decks[difficulty], 6))
    const [winner, setWinner] = useState(false)
    const [targetNumberObj, ...remainingNumberObjs] = numberOptions
    const symbolOptions = symbols.map(symbol => ({ canUse: true, value: symbol }))

    return (
        <div className="App">
            <div className="header">
                <div className="col1">
                    <div className="title">Arithmetix</div>
                    <div>
                    {
                        winner
                            ? "You're a winner"
                            : "Combine the numbers to get to the target"
                    }
                    </div>
                </div>
                <div className="col2">
                    <div className="difficulty">
                        Difficulty
                        <select
                            className="select"
                            value={difficulty}
                            onChange={(e) => {
                                if (e.target.value !== difficulty) {
                                    const newDifficulty = e.target.value
                                    setDifficulty(newDifficulty)
                                    setNumberOptions(getNumberOptions(decks[newDifficulty], 6))
                                }
                            }}
                        >
                            <option value="easy">Easy</option>
                            <option value="standard">Standard</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>                    
                    <div className="targetNumber">
                        Target: <b>{targetNumberObj.value}</b>
                    </div>
                </div>
            </div>
            <div className="body">
                <Solution
                    parenPositions={parenPositions}
                    setParenPositions={setParenPositions}
                    numbersSelected={numbersSelected}
                    symbolsSelected={symbolsSelected}
                    computedTotal={currentSolution}
                />
                {currentSolution}
                <div className="buttonGrids">
                    {/* number button grid */}
                    <Grid
                        options={remainingNumberObjs}
                        gridButtonOnClick={(valueToAdd, index) => {
                            setNumbersSelected([...numbersSelected, valueToAdd])
                            remainingNumberObjs[index].canUse = false
                        }}
                    />
                    {/* symbol button grid */}
                    <Grid
                        options={symbolOptions}
                        gridButtonOnClick={(valueToAdd, index) => {
                            setSymbolsSelected([...symbolsSelected, valueToAdd])
                        }}
                    />
                </div>
                <div className="buttonGrids">
                    <button
                        className="textButton"
                        onClick={() => {
                            setNumbersSelected([])
                            setParenPositions([])
                            setSymbolsSelected([])
                            setNumberOptions(numberOptions.map(obj => ({ ...obj, canUse: true})))
                            setCurrentSolution("")
                        }}
                    >
                        Clear
                    </button>
                    <button
                        className="textButton"
                        onClick={() => {
                            const answer = evaluateSelections(numbersSelected, symbolsSelected, parenPositions)
                            setCurrentSolution(answer)
                            if (answer.toString() === targetNumberObj.value.toString()) {
                                setWinner(true)
                            }
                        }}
                        disabled={!(symbolsSelected.length === 4 && numbersSelected.length === 5)}
                    >
                        Submit
                    </button>
                    <button
                        className="textButton"
                        onClick={() => {
                            if (numbersSelected.length > symbolsSelected.length) {
                                // remove a number
                                const numbersCopy = [...numbersSelected]
                                const lastNumber = numbersCopy.pop()
                                setNumbersSelected(numbersCopy)
                                const index = numberOptions.findIndex(({ value, canUse } )=> value === lastNumber && !canUse)
                                if (index !== -1) {
                                    numberOptions[index].canUse = true
                                    setNumberOptions(numberOptions)
                                }
                            } else {
                                // remove a symbol
                                const symbolsCopy = [...symbolsSelected]
                                symbolsCopy.pop()
                                setSymbolsSelected(symbolsCopy)
                            }
                        }}
                    >
                        Backspace
                    </button>
                </div>
            </div>
            <div className="footer">
                Marty Heavey 2022
            </div>
        </div>
    )
}

export default App
