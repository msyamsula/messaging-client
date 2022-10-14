import axios from "axios"
import { useNavigate } from "react-router-dom"
import {hashString} from "../utility/hashing"

function LoginForm(props) {
    let apiURL = process.env.REACT_APP_API_URL
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

        password = hashString(password)
        let config = {
            method: "get",
            url: `${apiURL}/login`,
            params: {
                "username": username,
                "password": password
            }
        }

        
        let response
        let token
        try {
            response = await axios(config)
            token = response.data.token;
        } catch (error) {
            alert(error)
            return
        }
        
        localStorage.setItem("isLogin", true)
        localStorage.setItem("token", token)
        localStorage.setItem("userID", response.data.data.id)
        localStorage.setItem("username", response.data.data.username)
        props.loginSocket.emit("userLogin", response.data.data.id)
        navigate("/messaging")
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
