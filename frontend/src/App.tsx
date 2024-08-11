import { BrowserRouter, Route, Routes } from "react-router-dom";

import './App.css'
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import GameWrapper from "./GameWrapper";

function App() {

  return (
    <div className="flex-1 flex items-center justify-center p-4">
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Landing/>}/>
        <Route path="/login" element={<GameWrapper/>}/>
        <Route path="/game" element= {<Game user={null} />}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
