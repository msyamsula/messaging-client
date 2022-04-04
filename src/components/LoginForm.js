import axios from "axios"
import { useNavigate } from "react-router-dom"
import socket from "../websocket/service"
const io = require("socket.io-client")

function LoginForm(props) {
    let apiURL = process.env.REACT_APP_API_URL
    let wsURL = `${process.env.REACT_APP_WEBSOCKET}/login`
    let socket = io.connect(wsURL, { transports: ["websocket", "polling"] })
    let navigate = useNavigate()

    let handleLogin = async (e)=>{
        e.preventDefault()
        let form = e.target
        let username = form.Username.value
        let password = form.Password.value
        if (username === "" || password === ""){
            alert("username & password must be filled")
            return
        }

        let config = {
            method: "post",
            url: `${apiURL}/login`,
            params: {
                "username": username,
                "password": password
            }
        }

        
        let response
        try {
            response = await axios(config)
        } catch (error) {
            alert(error)
            return
        }
        
        localStorage.setItem("isLogin", true)
        localStorage.setItem("userID", response.data.data.ID)
        socket.emit("userLogin", response.data.data.ID)
        navigate("/messaging")
        socket.disconnect()
    }

    let width100 = {
        width: "100%",
        marginBottom: "20px",
        marginTop: "10px"
    }

    return (
        <div style={{...props.form, height: "100%"}}>
            <form onSubmit={handleLogin}>
                <label htmlFor="Username">Username</label><br></br>
                <input style={width100} id="Username" placeholder="Username"></input><br></br>
                <label htmlFor="Password">Password</label><br></br>
                <input type="password" style={width100} id="Password" placeholder="Password"></input><br />
                <input type="submit" value="Login"></input>
                <button onClick={props.handleClickSignUp}>Sign Up</button>
            </form>
        </div>
    );
}

export default LoginForm;
