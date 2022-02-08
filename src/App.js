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
                <div className="title">Arithmetix</div>
                <div className="difficulty">
                    Difficulty
                    <select
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
            </div>
            <div className="body">
                <div className="targetNumber">
                    Target: {targetNumberObj.value}
                </div>
                <Solution
                    parenPositions={parenPositions}
                    setParenPositions={setParenPositions}
                    numbersSelected={numbersSelected}
                    symbolsSelected={symbolsSelected}
                    computedTotal={currentSolution}
                />
                {currentSolution}
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
                <button
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
                <button
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
                {
                    winner
                        ? "You're a winner"
                        : "Combine the numbers to get to the target"
                }
            </div>
        </div>
    )
}

export default App
