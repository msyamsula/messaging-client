
function MessageBox(props) {

    let singleMessage = {
        padding: "5px 10px",
        border: "1px solid",
        borderRadius: "5px",
        marginTop: "10px",
        height: "7%"
    }

    let createSingleMessage = (msg, index) => {
        let status = (msg.SenderID === props.userID) ? "right" : "left"
        return (
            <div key={`message${index}`} style={{ ...singleMessage, textAlign: status }}>
                {msg.Text}
            </div>
        )
    }

    let emptyMessage = {
        textAlign: "center",
        heigh: "100%"
        // justifySelf: "center",
        // alignSelf: "center"
    }
    emptyMessage = {
        // ...props.style,
        ...emptyMessage,
    }
    // emptyMessage.overflow = null

    let myStyle = JSON.parse(JSON.stringify(props.style))

    let conditionRender = () => {
        if (props.messages.length === 0) {
            myStyle.overflow = null
            myStyle.alignSelf = "center"
            return (
                <div style={emptyMessage}>
                    Let's Start Chatting
                </div>
            )
        }

        let msgs = props.messages.map((msg, index) => {
            return createSingleMessage(msg, index)
        })
        return msgs
    }


    return (
        <div id={props.messageBoxID} style={myStyle}>
            {/* <div>halo</div> */}
            {conditionRender()}
        </div>
    );
}

export default MessageBox;
