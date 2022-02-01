import React, { useState } from "react"

import { sampleSize } from "lodash"

import "./App.css"

import Grid from "./components/NumberGrid"
import { standardDeck } from "./constants"

const App = () => {
  const [currentSolution, setCurrentSolution] = useState([])
  const [numberOptions, setNumberOptions] = useState(sampleSize(standardDeck, 6))

  return (
    <div className="App">
      <header className="App-header">
        Arithmetix
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Grid
          onClick={(value) => setCurrentSolution([...currentSolution, value])}
          numberOptions={numberOptions}
        />
        {currentSolution}
        <button onClick={() => setCurrentSolution([])}>Clear</button>
      </header>
    </div>
  )
}

export default App
