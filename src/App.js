import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./routes/Landing/Landing";
import Registration from "./routes/Registration/Registration";
import CreateCombo from "./routes/CreateCombo/CreateCombo";
import RankingPage from "./routes/RankingPage/RankingPage";
import Login from "./routes/Login/Login";
import MyPage from "./routes/MyPage/MyPage";
import TopNav from "./components/TopNav/TopNav";
import Footer from "./components/Footer/Footer";
import UpdatePassword from "./routes/UpdatePassword/UpdatePassword";
import UpdateEmail from "./routes/UpdateEmail/UpdateEmail";
import ForgotAccount from "./routes/ForgotAccount/ForgotAccount";
import OtpEntry from "./routes/OtpEntry/OtpEntry";
import NewPassword from "./routes/NewPassword/NewPassword";
import AdminPage from "./routes/AdminPage/AdminPage";
import EmailConfirmed from "./routes/EmailConfirmed/EmailConfirmed";

import "./App.css";

function App() {
  return (
    <div id="background-img">
      <div className="general-app">
        <BrowserRouter>
          <TopNav />
          <div className="content-body">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/createPage" element={<CreateCombo />} />
            <Route path="/rankingPage" element={<RankingPage />} />
            <Route path="/updatePassword" element={<UpdatePassword />} />
            <Route path="/updateEmail" element={<UpdateEmail />} />
            <Route path="/forgotAccount" element={<ForgotAccount />} />
            <Route path="/otpEntry" element={<OtpEntry />} />
            <Route path="/newPassword" element={<NewPassword />} />
            <Route path="/verify" element={<EmailConfirmed />} />
            <Route path="/adminPage" element={<AdminPage />} />
          </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
