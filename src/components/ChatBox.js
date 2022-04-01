function ChatBox(props) {
    let textArea = {
        margin: "5px auto",
        width: "98%",
        gridColumn: "1/2",
        resize: "none",
        padding: "7px",
    }

    let button = {
        margin: "5px 0px",
        gridColumn: "2/3",
        width: "95%",
        cursor: "pointer"
    }

    let container = {
        display: "grid",
        gridTemplateColumns: "5fr 1fr"
    }

    container = { ...props.style, ...container }

    

    return (
        <div style={container}>
            <textarea id="myMsg" style={textArea} onKeyDown={props.handleSendMessageEnter} onChange={props.handleTextArea}></textarea>
            <button id={props.sendButtonID} style={button} onClick={props.handleSendMessage}>Send</button>
        </div>
    );
}

export default ChatBox;
