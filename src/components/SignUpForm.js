import {useNavigate} from "react-router-dom"
function SignUpForm(props) {
    let navigate = useNavigate()

    let handleSubmit = (e) => {
        e.preventDefault()
        let username = e.target.Username.value
        let password = e.target.Password.value
        let confirmPassword = e.target.ConfirmPassword.value

        if (password !== confirmPassword){
            alert("password doesn't match")
            return
        }

        console.log(password, confirmPassword, username);
        navigate("/messaging")
    }

    let width100 = {
        width: "100%",
        marginBottom: "20px",
        marginTop: "10px"
    }

    return (
        <div style={props.form}>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Username">Username</label><br></br>
                <input style={width100} id="Username" placeholder="Username"></input><br></br>
                <label htmlFor="Password">Password</label><br></br>
                <input type="password" style={width100} id="Password" placeholder="Password"></input><br />
                <label htmlFor="ConfirmPassword">Confirm Password</label><br></br>
                <input type="password" style={width100} id="ConfirmPassword" placeholder="Confirm Password"></input><br></br>
                <button onClick={props.handleClickBack}>{"<-"}</button>
                <input type="submit" value="Sign Up"></input>
            </form>
        </div>
    );
}

export default SignUpForm;
