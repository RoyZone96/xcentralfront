import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./routes/Landing";
import CreateCombo from "./routes/CreateCombo";

import TopNav from "./components/TopNav";
import "./App.css";

function App() {
  return (
    <div id="background-img">
      <div className="general-app">
        <BrowserRouter>
          <TopNav />
          <Routes>
            <Route exact path="/" Component={Landing} />
            <Route exact path="/createPage" Component={CreateCombo} />
            {/* <Route path="/rankingPage" element={<RankingPage />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
