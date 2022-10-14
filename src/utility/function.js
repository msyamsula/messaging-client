import axios from "axios"

export let apiURL = process.env.REACT_APP_API_URL

export let saveMessage = async (msgObject, token) => {
    let config = {
        method: "post",
        url: `${apiURL}/message`,
        data: {
            receiver_id: msgObject.receiver_id,
            sender_id: msgObject.sender_id,
            text: msgObject.text,
            is_read: msgObject.is_read
        },
        headers: {
            "x-api-token": token
        }
    }

    await axios(config)

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

    let response = await axios(config)
    return response.data
}

export let getCountUnread = async (senderID, receiverID, token) => {
    let config = {
        method: "get",
        url: `${apiURL}/message/unread`,
        headers: {
            "x-api-token": token
        },
        params: {
            senderID,
            receiverID
        }
    }

    let response = await axios(config)
    return response.data.count
}

export let getAllUsers = async (token) => {
    let config = {
        method: "get",
        url: `${apiURL}/users`,
        headers: {
            "x-api-token": token
        }
    }

    let response
    try {
        response = await axios(config)
        return response.data.data
    } catch (error) {
        alert(error)
        return []
    }

}

export let readMessages = async (senderID, receiverID, token) => {
    let config = {
        method: "put",
        url: `${apiURL}/message`,
        headers: {
            "x-api-token": token
        },
        params: {
            senderID,
            receiverID
        }
    }

    await axios(config)

}

export let logOut = async () => {
    let config = {
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/logout`,
        headers: {
            "x-api-token": localStorage.getItem("token")
        },
        params: {
            "username": localStorage.getItem("username")
        }
    }

    await axios(config)
}