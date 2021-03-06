import axios from "axios";
import React from "react"
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
const io = require("socket.io-client")

let wsURL = `${process.env.REACT_APP_WEBSOCKET}/signup`
let socket = io.connect(wsURL, { transports: ["websocket"] })

class Welcome extends React.Component {
    constructor(props) {
        super(props)

        this.container = {
            display: "grid",
            height: "100vh",
            width: "100vw",
            gridTemplateRows : "repeat(4, 1fr)",
            gridTemplateColumns : "repeat(4, 1fr)"
        }

        this.form = {
            gridArea: "2/2/4/4",
        }

        this.apiURL = process.env.REACT_APP_API_URL;
        

        this.state = {
            wantLogin: true
        }
    }

    componentDidMount = () => {
        // socket.disconnect()
    }

    handleClickSignUp = async (e) => {
        e.preventDefault()
        await this.setState({wantLogin: !this.state.wantLogin})
    }


    handleSignUp = async (e) => {
        e.preventDefault()
        let username = e.target.Username.value
        let password = e.target.Password.value
        let confirmPassword = e.target.ConfirmPassword.value
        if (password !== confirmPassword){
            alert("password doesn't match")
            return
        }

        let config = {
            method: "post",
            url: `${this.apiURL}/register`,
            data: {
                "Username": username
            },
            params: {
                "password": password
            }
        }

        let response
        try {
            response = await axios(config)
            socket.emit("userSignUp", response.data.data)
        } catch (error) {
            alert(error)
            return
        }

        alert("Register Success")
        await this.setState({wantLogin: !this.state.wantLogin})
    }

    conditionalRender = () => {
        if (this.state.wantLogin === true){
            return (
                <LoginForm form={this.form} handleClickSignUp={this.handleClickSignUp} props={this.props}></LoginForm>
            )
        } else {
            return (
                <SignUpForm form={this.form} handleSignUp={this.handleSignUp} handleClickBack={this.handleClickSignUp} props={this.props}></SignUpForm>
            )
        }
    }

    render() {
        return (
            <div style={this.container}>
                {this.conditionalRender()}
                {/* {localStorage.getItem("isLogin") === "true" && <Navigate replace to="/messaging"></Navigate>} */}
            </div>
        );
    }
}

export default Welcome;
