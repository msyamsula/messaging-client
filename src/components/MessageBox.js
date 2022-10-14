
function MessageBox(props) {

    let createSingleMessage = (msg, index) => {
        let status = (msg.sender_id === props.userID) ? "right" : "left"
        let checkColor = (msg.is_read === undefined) ? "white" : (msg.is_read === false) ? "grey" : "green"
        let checkType = (msg.is_read === undefined || msg.is_read === false) ? "v" : "vv"

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
                <div style={readStatus}>{(msg.sender_id === props.userID) ? checkType : ""}</div>
            </div>
        )
    }

    let emptyMessage = {
        textAlign: "center",
        heigh: "100%"
    }
    emptyMessage = {
        ...emptyMessage,
    }

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
            {conditionRender()}
        </div>
    );
}

export default MessageBox;
