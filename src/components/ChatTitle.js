function ChatTitle(props) {
    let container = {
        display: "grid",
        width: "100%",
        height: "100%",
        textAlign: "center",
        background: "orange"
    }

    container = {...props.chatTitle, ...container}

    let text = {
        alignSelf: "center"

    }
    return (
        <div style={container}>
            <div style={text}>{props.friend.Username}</div>
        </div>
    )
}

export default ChatTitle