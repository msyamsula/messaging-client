import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
// import MyRouter from "./router"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import MainPage from "./pages/MainPage"
// import LoginForm from "./components/LoginForm"
import SignUpForm from './components/SignUpForm';
import Welcome from "./pages/Welcome"
import ChatTitle from './components/ChatTitle';

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Routes>
            <Route path="/" element={<Welcome/>}/>
            <Route path="/signup" element={<SignUpForm/>}/>
            <Route path="/messaging" element={<MainPage/>}/>
            <Route path="/testing" element={<ChatTitle/>}></Route>
        </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
