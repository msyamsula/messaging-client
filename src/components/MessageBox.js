
function MessageBox(props) {

    let createSingleMessage = (msg, index) => {
        let status = (msg.senderID === props.userID) ? "right" : "left"
        let checkColor = (msg.IsRead === undefined) ? "white" : (msg.IsRead === false) ? "grey" : "green"
        let checkType = (msg.IsRead === undefined || msg.IsRead === false) ? "v" : "vv"
        let localContainer = {
            display: "grid",
            gridTemplateRows: "3fr 1fr",
            padding: "5px 10px",
            border: "1px solid",
            borderRadius: "5px",
            marginTop: "10px",
            height: "9%"
        }

        let readStatus = {
            gridArea: "2/1/3/2",
            textAlign: "right",
            fontSize: "80%",
            color: checkColor
        }

        let singleMessage = {
            gridArea: "1/1/2/2",
            alignItems: "bottom",
        }

        return (
            <div key={`message${index}`} style={localContainer}>
                <div style={{ ...singleMessage, textAlign: status }}>
                    {msg.text}
                </div>
                <div style={readStatus}>{(msg.senderID === props.userID) ? checkType : ""}</div>
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
