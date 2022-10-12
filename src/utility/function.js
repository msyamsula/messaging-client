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