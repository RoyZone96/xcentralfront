import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./routes/Landing/Landing";
import Registration from "./routes/Registration/Registration";
import CreateCombo from "./routes/CreateCombo";
import RankingPage from "./routes/RankingPage/RankingPage";
import Login from "./routes/Login/Login";
import MyPage from "./routes/MyPage/MyPage";
import TopNav from "./components/TopNav/TopNav";
import Footer from "./components/Footer/Footer";
import UpdatePassword from "./routes/UpdatePassword/UpdatePassword";
import UpdateEmail from "./routes/UpdateEmail/UpdateEmail";
import ForgotAccount from "./routes/ForgotAccount/ForgotAccount";
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
            <Route exact path="/updatePassword" Component={UpdatePassword} />
            <Route exact path="/updateEmail" Component={UpdateEmail} />
            <Route exact path="/forgotAccount" Component={ForgotAccount} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
