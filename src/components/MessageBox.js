function MessageBox(props) {

    let singleMessage = {
        padding: "5px 10px",
        border: "1px solid",
        borderRadius: "5px",
        marginTop: "10px",
        height: "7%"
    }

    let createSingleMessage = (msg, index) => {
        let status = (msg.ownerID === props.userID) ? "right" : "left"
        return (
            <div key={`message${index}`} style={{ ...singleMessage, textAlign: status }}>
                {msg.text}
            </div>
        )
    }

    let emptyMessage = {
        textAlign: "center",
        justifySelf: "center",
        alignSelf: "center"
    }
    emptyMessage = {
        ...props.style,
        ...emptyMessage,
    }
    emptyMessage.overflow = null

    let conditionRender = () => {
        if (props.messages.length === 0) {
            return (
                <div style={emptyMessage}>
                    Welcome to Syamsul Messaging, Let's Start Chatting
                </div>
            )
        }

        let msgs = props.messages.map((msg, index) => {
            return createSingleMessage(msg, index)
        })
        return msgs
    }


    return (
        <div id={props.messageBoxID} style={props.style}>
            {conditionRender()}
        </div>
    );
}

export default MessageBox;
