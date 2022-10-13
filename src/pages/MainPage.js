import axios from "axios";
import React from "react"
import { Navigate} from "react-router-dom";
import ChatTitle from "../components/ChatTitle";
import { withRouter } from "../withRouter"
import {getConversation, saveMessage} from "../utility/function"
// import socket from "../websocket/service"
// import NewService from "../nsq/service";
// import {Reader} from "nsqjs"
// import {Axios} from "axios"
// import { fetchEventSource } from '@microsoft/fetch-event-source';
const { default: ChatBox } = require("../components/ChatBox");
const { default: MessageBox } = require("../components/MessageBox");
const { default: SearchBar } = require("../components/SearchBar");
const { default: UserList } = require("../components/UserList");
// const nsq = require("nsqjs")
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

        // this.wsBaseURL = process.env.REACT_APP_WEBSOCKET
        // this.socket = 
        // this.loginSocket = io.connect(this.wsBaseURL+"/login", { transports: ["websocket", "polling"] })
        // this.signupSocket = io.connect(this.wsBaseURL+"/signup", { transports: ["websocket", "polling"] })
        // this.mainSocket = io.connect(this.wsBaseURL, { transports: ["websocket"] })
 

        this.chatBox = {
            gridArea: "10/2/11/3",
        }

        this.chatTitle = {
            gridArea: "1/2/2/3"
        }

        // this.socket = io.connect(process.env.REACT_APP_WEBSOCKET, { transports: ["websocket", "polling"] })
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
            shownUsers:  [],
            friend: {
                "username": "Welcome to Syamsul Messaging",
                "id": -1,
            },
            socket: null
        }
    }

    refreshUserState = (users, userID, status) => {
        let ns = users.map(usr => {
            if (usr.id == userID){
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

            await this.setState({users: newUserState, shownUsers: newShownUserState})
        })

        mainSocket.on("userLogout", async userID => {
            let newUserState = this.refreshUserState(this.state.users, userID, false)
            let newShownUserState = this.refreshUserState(this.state.shownUsers, userID, false)

            await this.setState({users: newUserState, shownUsers: newShownUserState})
        })

        mainSocket.on(this.state.userID.toString(), async msgObj => {

            // console.log(msgObj);
            if (msgObj.sender_id == this.state.friend.id) {
                // if engage with conversation
                let messages = [...this.state.messages, msgObj]
                await this.setState({messages})
                console.log(messages);
                await this.scrollBot()
            } else {
                // increment unread message
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
        
        let is_active = element.getAttribute("isactive");

        if (is_active == "1"){
            is_active = true   
        } else {
            is_active = false
        }

        id = parseInt(element.className)
        username = element.childNodes[0].innerHTML
        let friend = {
            id,
            username,
            is_active,
        }

        let response = await getConversation(this.state.userID, friend.id, localStorage.getItem("token"))
        let messages = response.data == null  ? [] : response.data


        await this.setState({ friend, messages })

        // let config = {
        //     method: "get",
        //     url: `${process.env.REACT_APP_API_URL}/message/${this.state.userID}/${ID}`
        // }
        // let response = await axios(config)
        // let messages = response.data.data



        // let users = this.state.users.map((user) => {
        //     if (user.ID === ID) {
        //         user.UnreadMessages = 0
        //     }
        //     return user
        // })
        // await this.setState({ messages, users })

        // let config2 = {
        //     method: "post",
        //     url: `${process.env.REACT_APP_API_URL}/message/${ID}`,
        //     params: {
        //         activeID: this.state.userID
        //     }
        // }
        // await axios(config2)
        
        let textArea = document.getElementById("myMsg")
        textArea.focus()
        this.scrollBot()
        
        // let websocketRead = {
        //     SenderID: this.state.friend.ID,
        //     ReceiverID: this.state.userID
        // }
        // this.socket.emit("readMessage", websocketRead)
    }

    handleLogout = async (e) => {
        e.preventDefault()
        
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
        
        // this.socket.emit("userLogout", this.state.userID)
        mainSocket.emit("userLogout", this.state.userID)
        localStorage.clear()
        this.props.navigate("/dashboard")
        // window.location.reload()
        // this.state.socket.disconnect()
    }

    filterUser = async (searchText) => {

        // let config = {
        //     method: 'get',
        //     url: `${process.env.REACT_APP_API_URL}/user`,
        //     headers: {
        //         "x-api-token": localStorage.getItem("token")
        //     }
        // }

        // let response = await axios(config)
        // this.initUsers = response.data.data
        

        if (searchText !== "") {
            

            // let activeUsers = this.initUsers.filter(user=>{
            //     return user.IsActive
            // })

            // let inActiveUsers = this.initUsers.filter(user=>{
            //     return !user.IsActive
            // })

            // let users = [...activeUsers, ...inActiveUsers]

            let su = this.state.users.filter((user) => {
                return user.username.toLowerCase().includes(searchText.toLowerCase())
            })

            await this.setState({ shownUsers: su })
        } else {
            
            await this.setState({ shownUsers: this.state.users })
        }
    }

    componentDidMount = async () => {
        // const socket = io(process.env.REACT_APP_WEBSOCKET, {transports: ["websocket", "polling"]})
        // await this.setState({socket})
        mainSocket = io.connect(wsBaseURL, { transports: ["websocket"] })

        if (this.state.token === null) {
            return
        }
        this.wsLogic()


        let chatbox = document.getElementById("myMsg")
        chatbox.focus()

        // if (this.firstLoad) {

            let config = {
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/users`,
                headers: {
                    "x-api-token": localStorage.getItem("token")
                }
            }

            let users
            try {
                let response = await axios(config)
                users = response.data.data
            } catch (error) {
                alert(error)
                users = []
            }

            users = users.filter(usr => {
                return usr.id !== this.state.currentUser.id
            })
            await this.setState({users, shownUsers: users})



        //     this.firstLoad = false
        // }

        // this.scrollBot()
        // await this.filterUser()

        // let myEvent = this.state.userID.toString()
        // this.socket.on(myEvent, async (msg) => {

        //     let msgObject = {
        //         Text: msg.text,
        //         SenderID: parseInt(msg.from),
        //         ReceiverID: parseInt(msg.to)
        //     }

        //     if (this.state.friend.ID === parseInt(msg.from)) {
        //         let messages = [...this.state.messages, msgObject]
        //         await this.setState({ messages })
        //         this.scrollBot()

        //         let config = {
        //             method: "post",
        //             url: `${process.env.REACT_APP_API_URL}/message/${this.state.friend.ID}`,
        //             params: {
        //                 activeID: this.state.userID
        //             }
        //         }

        //         await axios(config)

        //         this.socket.emit("readMessage", {
        //             ReceiverID: this.state.userID,
        //             SenderID: this.state.friend.ID
        //         })

        //     } else {
        //         let users = this.state.users.map((user) => {
        //             if (user.ID === parseInt(msg.from)) {
        //                 user.UnreadMessages += 1
        //             }
        //             return user
        //         })

        //         await this.setState({ users })
        //     }

        //     let sender = this.state.users.filter( usr => {
        //         return usr.ID === parseInt(msg.from)
        //     })

        //     let withOutSender = this.state.users.filter(usr=>{
        //         return usr.ID !== parseInt(msg.from)
        //     })

        //     let users = [...sender, ...withOutSender]
        //     await this.setState({users})




        // })

        // this.socket.on("userLogin", async (userID) => {
        //     if (userID !== this.state.userID) {
        //         let users = this.state.users.map((usr)=>{
        //             if (usr.ID === userID){
        //                 usr.IsActive = true
        //             }

        //             return usr
        //         })

        //         await this.setState({users})
        //     }
        // })

        // this.socket.on("userLogout", async (userID) => {
        //     let users = this.state.users.map((usr)=>{
        //         if (usr.ID === userID){
        //             usr.IsActive = false
        //         }

        //         return usr
        //     })

        //     await this.setState({users})
        // })

        // this.socket.on("messageHasBeenRead", async data => {
        //     if (data.SenderID === this.state.userID && this.state.friend.ID === data.ReceiverID){
        //         let messages = this.state.messages.map(msg => {
        //             msg.IsRead = true
        //             return msg
        //         })

        //         await this.setState({messages})
        //     }
        // })
    
        // this.socket.on("userSignUp", async user => {
        //     let users = [...this.state.users, user]
        //     await this.setState({users})
        // })
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

        // let websocketMsg = {
        //     text: this.state.myMsg,
        //     to: this.state.friend.ID.toString(),
        //     from: this.state.userID.toString()
        // }

        let msgObject = {
            text: this.state.myMsg,
            sender_id: this.state.userID,
            receiver_id: this.state.friend.id,
            is_read: this.state.friend.is_active
        }

        // send to websocket
        mainSocket.emit("incomingMessage", msgObject)

        // let config = {
            //     method: "post",
        //     url: `${process.env.REACT_APP_API_URL}/message`,
        //     data: msgObject
        // }
        
        // await axios(config)
        
        let messages = [...this.state.messages, msgObject]
        await this.setState({ messages, myMsg: "" })
        
        // this.socket.emit("incomingMessage", websocketMsg, async () => {
            //     let messages = this.state.messages
        //     messages[messages.length-1].IsRead = false
        //     await this.setState({messages})
        // })
        
        
        element.value = ""
        this.scrollBot()
        
        // element.focus()
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
                { localStorage.getItem("isLogin") !== "true" && <Navigate replace to="/dashboard"></Navigate>}
            </div>
        );
    }
}

export default withRouter(MainPage);
