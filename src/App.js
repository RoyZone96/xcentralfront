import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./routes/Landing";
import Registration from "./routes/Registration";
import CreateCombo from "./routes/CreateCombo";
import RankingPage from "./routes/RankingPage";
import Login from "./routes/Login";
import MyPage from "./routes/MyPage";
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
            <Route exact path="/login" Component={Login} />
            <Route exact path="/registration" Component={Registration} />
            <Route exact path="/myPage" Component={MyPage} />
            <Route exact path="/createPage" Component={CreateCombo} />
            <Route exact path="/rankingPage" Component={RankingPage} /> 
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
