import React from "react"
import { Navigate } from "react-router-dom";
import ChatTitle from "../components/ChatTitle";
import { withRouter } from "../withRouter"
import { getAllUsers, getConversation, getCountUnread, logOut, readMessages, saveMessage } from "../utility/function"
const { default: ChatBox } = require("../components/ChatBox");
const { default: MessageBox } = require("../components/MessageBox");
const { default: SearchBar } = require("../components/SearchBar");
const { default: UserList } = require("../components/UserList");
const io = require("socket.io-client")

const wsBaseURL = process.env.REACT_APP_WEBSOCKET
let mainSocket = io.connect(wsBaseURL, { transports: ["websocket"] })

class MainPage extends React.Component {
    constructor(props) {
        super(props)

        this.container = {
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            gridTemplateRows: "repeat(10, 1fr)",
            height: "100vh",
            width: "100vw"
        }

        this.searchBar = {
            gridArea: "1/1/2/2",
            alignSelf: "center",
            padding: "0 15px",
            height: "50%"
        }

        this.messageBox = {
            gridArea: "2/2/10/3",
            padding: "40px",
            overflow: "scroll",
        }

        this.userList = {
            gridArea: "2/1/span 8/2",
            overflow: "scroll",
            padding: "0 15px"
        }

        this.logoutButton = {
            gridArea: "10/1/11/2",
            margin: "10px",
            cursor: "pointer"
        }

        this.chatBox = {
            gridArea: "10/2/11/3",
        }

        this.chatTitle = {
            gridArea: "1/2/2/3"
        }

        this.messageBoxID = "messageBox"
        this.sendButtonID = "sendButton"
        this.searchBoxID = "searchBox"

        this.state = {
            userID: parseInt(localStorage.getItem("userID")),
            token: localStorage.getItem("token"),
            currentUser: {
                username: localStorage.getItem("username"),
                id: parseInt(localStorage.getItem("userID"))
            },
            myMsg: "",
            messages: [],
            users: [],
            shownUsers: [],
            friend: {
                "username": "Welcome to Syamsul Messaging",
                "id": -1,
            },
            socket: null
        }

    }

    refreshUserState = (users, userID, status) => {
        let ns = users.map(usr => {
            if (usr.id == userID) {
                usr.is_active = status
            }

            return usr
        })

        return ns
    }


    wsLogic = async () => {

        mainSocket.on("userLogin", async userID => {
            let newUserState = this.refreshUserState(this.state.users, userID, true)
            let newShownUserState = this.refreshUserState(this.state.shownUsers, userID, true)

            await this.setState({ users: newUserState, shownUsers: newShownUserState })
        })

        mainSocket.on("userLogout", async userID => {
            let newUserState = this.refreshUserState(this.state.users, userID, false)
            let newShownUserState = this.refreshUserState(this.state.shownUsers, userID, false)

            await this.setState({ users: newUserState, shownUsers: newShownUserState })
        })

        mainSocket.on(this.state.userID.toString(), async msgObj => {

            if (msgObj.sender_id == this.state.friend.id) {
                // if engage with conversation


                // update message box
                let messages = this.state.messages
                messages = [...messages, msgObj]
                await this.setState({ messages })
                this.scrollBot()

                // notify read
                mainSocket.emit("readMessage", msgObj)

                // read message
                await readMessages(msgObj.sender_id, msgObj.receiver_id, this.state.token)

            } else {
                // increment unread message for users and shownUsers
                let shownUsers = this.state.shownUsers
                shownUsers = shownUsers.map(u => {
                    if (u.id == msgObj.sender_id) {
                        u.unread += 1
                    }
                    return u
                })

                let users = this.state.users
                users = users.map(u => {
                    if (u.id == msgObj.sender_id) {
                        u.unread += 1
                    }
                    return u
                })

                await this.setState({ shownUsers, users })
            }

        })

        let event = `immediateRead${this.state.userID}`
        mainSocket.on(event, async (msgObj) => {
            console.log(msgObj);
            if (this.state.friend.id == msgObj.receiver_id) {
                let messages = this.state.messages
                messages[messages.length - 1].is_read = 1
                await this.setState({ messages })
            }
        })

        let lateRead = `lateRead${this.state.userID}`
        mainSocket.on(lateRead, async (msg)=>{
            if (msg.receiver_id == this.state.friend.id){

                // read all message if engage in correct conversation
                let messages = this.state.messages.map(m=>{
                    m.is_read = true
                    return m
                })

                await this.setState({messages})
            }
        })


    }

    scrollBot = () => {
        let element = document.getElementById(this.messageBoxID)
        if (element !== null) {
            element.scrollTop = element.scrollHeight
        }
    }

    handleFriendClick = async (e) => {
        e.preventDefault()
        let id, username, element


        if (e.target.className !== "") {
            element = e.target
        } else {
            element = e.target.parentNode
        }

        // set talking partner/friend
        id = parseInt(element.className)
        username = element.childNodes[0].innerHTML
        let friend = {
            id,
            username,
            // is_active,
        }

        // set unread status of friend to 0
        let users = this.state.users.map(u => {
            if (u.id == friend.id) {
                u.unread = 0
            }
            return u
        })

        let shownUsers = this.state.shownUsers.map(u => {
            if (u.id == friend.id) {
                u.unread = 0
            }

            return u
        })

        // notify late read
        let lateReadMsg = {
            sender_id: friend.id,
            receiver_id: this.state.userID
        }
        mainSocket.emit(`lateRead`, lateReadMsg)
        
        // get conversation
        let response = await getConversation(this.state.userID, friend.id, this.state.token)
        let messages = response.data == null ? [] : response.data

        await this.setState({ friend, messages, users, shownUsers })


        let textArea = document.getElementById("myMsg")
        textArea.focus()
        this.scrollBot()

        // read message
        await readMessages(friend.id, this.state.userID, this.state.token)

    }

    handleLogout = async (e) => {
        e.preventDefault()

        await logOut()

        mainSocket.emit("userLogout", this.state.userID)
        localStorage.clear()
        this.props.navigate("/dashboard")
    }

    filterUser = async (searchText) => {


        if (searchText !== "") {

            let su = structuredClone(this.state.users)
            su = su.filter((user) => {
                return user.username.toLowerCase().includes(searchText.toLowerCase())
            })

            await this.setState({ shownUsers: su })
        } else {
            let su = structuredClone(this.state.users)
            await this.setState({ shownUsers: su })
        }
    }

    componentDidMount = async () => {
        mainSocket = io.connect(wsBaseURL, { transports: ["websocket"] })

        if (this.state.token === null) {
            return
        }
        this.wsLogic()


        let chatbox = document.getElementById("myMsg")
        chatbox.focus()

        // get all users
        let users = await getAllUsers(this.state.token)

        // don't show myself
        users = users.filter(usr => {
            return usr.id !== this.state.currentUser.id
        })

        // get unread message    
        for (let i = 0; i < users.length; i++) {
            users[i].unread = await getCountUnread(users[i].id, this.state.userID, this.state.token)
        }

        let shownUsers = structuredClone(users) // deep copy so it's copy to different memory and handled separately

        await this.setState({ users, shownUsers })

    }

    handleTextArea = async (e) => {
        e.preventDefault()
        let myMsg = e.target.value
        await this.setState({ myMsg })
    }

    handleSearchText = async (e) => {
        e.preventDefault()
        let searchText = e.target.value
        await this.filterUser(searchText)
    }

    handleSendMessageEnter = async (e) => {
        if (e.key === "Enter") {
            await this.handleSendMessage(e)
        }
    }

    handleSendMessage = async (e) => {
        e.preventDefault()
        let element = document.getElementById("myMsg")
        if (element.value === "" || this.state.friend.id === -1) {
            element.value = ""
            await this.setState({ myMsg: "" })
            element.focus()
            return
        }

        let msgObject = {
            text: this.state.myMsg,
            sender_id: this.state.userID,
            receiver_id: this.state.friend.id,
            is_read: false
        }

        // send to websocket
        mainSocket.emit("incomingMessage", msgObject)


        let messages = [...this.state.messages, msgObject]
        await this.setState({ messages, myMsg: "" })


        element.value = ""
        this.scrollBot()

        // save to mongo
        await saveMessage(msgObject, this.state.token)

    }

    render() {
        return (
            <div style={this.container}>
                <SearchBar searchBoxID={this.searchBoxID} handleSearchText={this.handleSearchText} style={this.searchBar}></SearchBar>
                <UserList handleFriendClick={this.handleFriendClick} friend={this.state.friend} users={this.state.shownUsers} userID={this.state.userID} style={this.userList}></UserList>
                <ChatTitle friend={this.state.friend} currentUser={this.state.currentUser} chatTitle={this.chatTitle} />
                <MessageBox messageBoxID={this.messageBoxID} userID={this.state.userID} style={this.messageBox} messages={this.state.messages} ></MessageBox>
                <ChatBox sendButtonID={this.sendButtonID} handleSendMessageEnter={this.handleSendMessageEnter} handleTextArea={this.handleTextArea} handleSendMessage={this.handleSendMessage} style={this.chatBox}></ChatBox>
                <button onClick={this.handleLogout} style={this.logoutButton}>Logout</button>
                {localStorage.getItem("isLogin") !== "true" && <Navigate replace to="/dashboard"></Navigate>}
            </div>
        );
    }
}

export default withRouter(MainPage);
