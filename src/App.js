import React, { useState } from "react"

import { sampleSize } from "lodash"
import { evaluate } from "mathjs"

import "./App.css"

import Grid from "./components/NumberGrid"
import {
    standardDeck,
    stringToMath,
    mathToString,
} from "./constants"

const appendToSolution = (currentSolution, value) => {
    if (value in stringToMath) {
        return currentSolution.concat(stringToMath[value])
    }
    return currentSolution.concat(value)
}

const presentSolution = (currentSolution) => {
    return [...currentSolution].map((value) => {
        if (value in mathToString) {
            return mathToString[value]
        }
        return value
    })
}

const App = () => {
    const [currentSolution, setCurrentSolution] = useState("")
    const [numberOptions, setNumberOptions] = useState(sampleSize(standardDeck, 6))
    const [target, ...remaining] = numberOptions

    return (
        <div className="App">
        <header className="App-header">
            Arithmetix
            <p>
            Edit <code>src/App.js</code> and save to reload.
            </p>
            <Grid
                onClick={(value) => setCurrentSolution(appendToSolution(currentSolution, value))}
                numberOptions={remaining}
            />
            <div>
                {target}
            </div>
            {presentSolution(currentSolution)}
            <button onClick={() => setCurrentSolution(evaluate(currentSolution).toString())}>Submit</button>
            <button onClick={() => setCurrentSolution("")}>Clear</button>
        </header>
        </div>
    )
}

export default App
