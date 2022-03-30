import React from "react"
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

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

        this.state = {
            status: true
        }
    }

    handleClickSignUp = async (e) => {
        e.preventDefault()
        await this.setState({status: !this.state.status})
    }

    conditionalRender = () => {
        if (this.state.status === true){
            return (
                <LoginForm form={this.form} handleClickSignUp={this.handleClickSignUp} props={this.props}></LoginForm>
            )
        } else {
            return (
                <SignUpForm form={this.form} handleClickBack={this.handleClickSignUp} props={this.props}></SignUpForm>
            )
        }
    }

    render() {
        return (
            <div style={this.container}>
                {this.conditionalRender()}
            </div>
        );
    }
}

export default Welcome;
