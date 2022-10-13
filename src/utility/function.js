import axios from "axios"

export let apiURL = process.env.REACT_APP_API_URL

export let saveMessage = async (msgObject, token) => {
    let config = {
        method: "post",
        url: `${apiURL}/message`,
        params: {
            senderID: msgObject.sender_id,
            receiverID: msgObject.receiver_id
        },
        data: {
            text: msgObject.text
        },
        headers: {
            "x-api-token": token
        }
    }

    let response
    try {
        response = await axios(config)
    } catch (error) {
        alert(error)
    }

}

export let getConversation = async (p1, p2, token) => {
    let config = {
        method: "get",
        url: `${apiURL}/message`,
        params: {
            senderID: p1,
            receiverID: p2
        },
        headers: {
            "x-api-token": token
        }
    }

    let messages = await axios(config)
    return messages.data
}