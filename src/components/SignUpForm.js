function SignUpForm(props) {

    let width100 = {
        width: "100%",
        marginBottom: "20px",
        marginTop: "10px"
    }

    return (
        <div style={props.form}>
            <form onSubmit={props.handleSignUp}>
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
