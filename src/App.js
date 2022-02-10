import React, { useState } from "react"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { sampleSize } from "lodash"
import { evaluate } from "mathjs"

import "./App.css"

// import Grid from "./components/NumberGrid"
import Grid from "./components/Grid"
import Solution from "./components/Solution"
import DragLine from "./components/DragLine"
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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1)
    console.log(removed)
    result.splice(endIndex, 0, removed)
  
    return result
}

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    num1: undefined,
    symbol: undefined,
    num2: undefined,
}))

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

    const [testItems, setTestItems] = useState(getItems(4))
    const currentPosition = useState({ item: 0, position: 0 })

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
          return
        }

        const items = reorder(
          testItems,
          result.source.index,
          result.destination.index
        )

        setTestItems(items)
    }

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
                                    setNumbersSelected([])
                                    setParenPositions([])
                                    setSymbolsSelected([])
                                    setCurrentSolution("")
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
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                // style={{ backgroundColor: "black" }}
                                >
                                {testItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <DragLine
                                                    num1={item.num1}
                                                    num2={item.num2}
                                                    symbol={item.symbol}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <div className="body">
                <Solution
                    parenPositions={parenPositions}
                    setParenPositions={setParenPositions}
                    numbersSelected={numbersSelected}
                    symbolsSelected={symbolsSelected}
                    computedTotal={currentSolution}
                />
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
