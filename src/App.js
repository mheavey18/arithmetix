import React, { useState } from "react"

import { sampleSize } from "lodash"
import { evaluate } from "mathjs"

import "./App.css"

import Grid from "./components/NumberGrid"
import {
    decks,
    stringToMath,
    mathToString,
} from "./constants"

const appendToSolution = (currentSolution, value) => {
    if (value in stringToMath) {
        return [...currentSolution, stringToMath[value]]
    }
    return [...currentSolution, value]
}

const presentSolution = (currentSolution) => {
    return currentSolution.map((value) => {
        if (value in mathToString) {
            return mathToString[value]
        }
        return value
    })
}

const getNumberOptions = (deck, numOptions) => {
    const numbers = sampleSize(deck, numOptions)
    // map numbers to if they can still be used
    return numbers.map(number => ({ canUse: true, number }))
}

const hasUsedAllNumbers = (numberOptions) => {
    return numberOptions.every(numberObj => !numberObj.canUse)
}

const App = () => {
    const [currentSolution, setCurrentSolution] = useState([])
    const [difficulty, setDifficulty] = useState("standard")
    const [numberOptions, setNumberOptions] = useState(getNumberOptions(decks[difficulty], 6))
    const [winner, setWinner] = useState(false)
    const [targetObj, ...remainingObjs] = numberOptions

    return (
        <div className="App">
        <header className="App-header">
            Arithmetix
            <select
                for="difficulty"
                value={difficulty}
                onChange={(e) => {
                    console.log(e.target.value)
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
            <Grid
                updateSolution={(value) => setCurrentSolution(appendToSolution(currentSolution, value))}
                numberOptions={remainingObjs}
            />
            <div>
                {targetObj.number}
            </div>
            {presentSolution(currentSolution).join("")}
            <button
                onClick={() => {
                    const answer = evaluate(currentSolution.join("")).toString()
                    setCurrentSolution([answer])
                    console.log(answer, targetObj.number)
                    if (answer === targetObj.number.toString()) {
                        setWinner(true)
                    }
                }}
                disabled={!hasUsedAllNumbers(remainingObjs)}
            >
                Submit
            </button>
            <button
                onClick={() => {
                    const currentSolutionCopy = [...currentSolution]
                    const lastElement = currentSolutionCopy.pop()
                    setCurrentSolution(currentSolutionCopy)
                    const index = numberOptions.findIndex(({ number, canUse } )=> number === lastElement && !canUse)
                    if (index !== -1) {
                        numberOptions[index].canUse = true
                        setNumberOptions(numberOptions)
                    }
                }}
            >
                Backspace
            </button>
            <button
                onClick={() => {
                    setCurrentSolution([])
                    setNumberOptions(
                        numberOptions.map((numberObj) => ({ ...numberObj, canUse: true }))
                    )
                }}
            >
                Clear
            </button>
            {
                winner
                    ? "You're a winner"
                    : "Combine the numbers to get to the target"
            }
        </header>
        </div>
    )
}

export default App
