import { useNavigate } from "react-router-dom"

function LoginForm(props) {
    let navigate = useNavigate()
    let handleSubmit = (e)=>{
        e.preventDefault()
        let form = e.target
        let username = form.Username
        let password = form.password
        console.log(username, password);
        navigate("/messaging")
    }

    let width100 = {
        width: "100%",
        marginBottom: "20px",
        marginTop: "10px"
    }

    return (
        <div style={{...props.form, height: "100%"}}>
            <form onSubmit={handleSubmit}>
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
