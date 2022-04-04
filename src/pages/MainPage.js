import axios from "axios";
import React from "react"
import { Navigate } from "react-router-dom";
import ChatTitle from "../components/ChatTitle";
import { withRouter } from "../withRouter"
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

        this.messageBoxID = "messageBox"
        this.sendButtonID = "sendButton"
        this.searchBoxID = "searchBox"

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

        this.socket = io.connect(process.env.REACT_APP_WEBSOCKET, { transports: ["websocket", "polling"] })


        this.chatBox = {
            gridArea: "10/2/11/3",
        }

        this.chatTitle = {
            gridArea: "1/2/2/3"
        }

        this.initMessages = []
        this.initUsers = []
        this.firstLoad = true
        this.initFriend = {
            "Username": "Welcome to Syamsul Messaging",
            "ID": -1
        }
        this.state = {
            userID: parseInt(localStorage.getItem("userID")),
            activeUser: {
                Username: "User",
                ID: 0
            },
            myMsg: "",
            messages: this.initMessages,
            users: this.initUsers,
            searchText: "",
            friend: this.initFriend,
            socket: null
        }
    }

    scrollBot = () => {
        let element = document.getElementById(this.messageBoxID)
        if (element !== null) {
            element.scrollTop = element.scrollHeight
        }
    }

    handleFriendClick = async (e) => {
        e.preventDefault()
        // console.log(e.target.tagName, e.target.className === "");
        let ID, Username, element

        if (e.target.className !== "") {
            element = e.target
        } else {
            element = e.target.parentNode
        }

        ID = parseInt(element.className)
        Username = element.childNodes[0].innerHTML
        // console.log(ID, Username);
        // console.log(e.target.childNodes);
        let friend = {
            ID,
            Username
        }

        await this.setState({ friend })

        let config = {
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/message/${this.state.userID}/${ID}`
        }


        let response = await axios(config)

        let users = this.state.users.map((user) => {
            if (user.ID === ID) {
                user.UnreadMessages = 0
            }
            return user
        })
        let messages = response.data.data
        await this.setState({ messages, users })

        let config2 = {
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/message/${ID}`,
            params: {
                activeID: this.state.userID
            }
        }

        await axios(config2)

        let textArea = document.getElementById("myMsg")
        textArea.focus()
        this.scrollBot()

    }

    handleLogout = async (e) => {
        e.preventDefault()
        localStorage.clear()

        let config = {
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/logout/${this.state.userID}`
        }

        await axios(config)

        this.socket.emit("userLogout", this.state.userID)

        this.socket.disconnect()

        this.props.navigate("/")
        // window.location.reload()
        // this.state.socket.disconnect()
    }

    filterUser = async () => {

        let config = {
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/user`,
            params: {
                activeID: this.state.userID
            }
        }

        let response = await axios(config)
        this.initUsers = response.data.data
        // await this.setState({users})

        if (this.state.searchText !== "") {
            let filteredUser = this.initUsers.filter((user) => {
                return user.Username.toLowerCase().includes(this.state.searchText.toLowerCase())
            })
            await this.setState({ users: filteredUser })
        } else {
            await this.setState({ users: this.initUsers })
        }
    }

    componentDidMount = async () => {
        // const socket = io(process.env.REACT_APP_WEBSOCKET, {transports: ["websocket", "polling"]})
        // await this.setState({socket})
        

        let chatbox = document.getElementById("myMsg")
        chatbox.focus()

        if (this.firstLoad) {

            let config = {
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/user`,
                params: {
                    activeID: this.state.userID
                }
            }

            try {
                let response = await axios(config)
                this.initUsers = response.data.data
            } catch (error) {
                alert(error)
                this.initUsers = []
            }


            let activeUser = this.initUsers.filter((usr) => {
                return usr.ID === this.state.userID
            })

            activeUser = activeUser[0]

            this.setState({ activeUser })

            this.firstLoad = false
        }

        this.scrollBot()
        await this.filterUser()

        let myEvent = this.state.userID.toString()
        this.socket.on(myEvent, async (msg) => {

            let msgObject = {
                Text: msg.text,
                SenderID: parseInt(msg.from),
                ReceiverID: parseInt(msg.to)
            }

            if (this.state.friend.ID === parseInt(msg.from)) {
                let messages = [...this.state.messages, msgObject]
                await this.setState({ messages })
                this.scrollBot()

                let config = {
                    method: "post",
                    url: `${process.env.REACT_APP_API_URL}/message/${this.state.friend.ID}`,
                    params: {
                        activeID: this.state.userID
                    }
                }

                await axios(config)

            } else {
                let users = this.state.users.map((user) => {
                    if (user.ID === parseInt(msg.from)) {
                        user.UnreadMessages += 1
                    }
                    return user
                })

                await this.setState({ users })
            }




        })

        this.socket.on("userLogin", async (userID) => {
            if (userID !== this.state.userID) {
                let users = this.state.users.map((usr)=>{
                    if (usr.ID === userID){
                        usr.IsActive = true
                    }

                    return usr
                })

                await this.setState({users})
            }
        })

        this.socket.on("userLogout", async (userID) => {
            let users = this.state.users.map((usr)=>{
                if (usr.ID === userID){
                    usr.IsActive = false
                }

                return usr
            })

            await this.setState({users})
        })
    }

    handleTextArea = async (e) => {
        e.preventDefault()
        let myMsg = e.target.value
        await this.setState({ myMsg })
    }

    handleSearchText = async (e) => {
        e.preventDefault()
        let searchText = e.target.value
        await this.setState({ searchText })
        await this.filterUser()
    }

    handleSendMessageEnter = async (e) => {
        if (e.key === "Enter") {
            await this.handleSendMessage(e)
        }
    }

    handleSendMessage = async (e) => {
        e.preventDefault()
        let element = document.getElementById("myMsg")
        if (element.value === "" || this.state.friend.ID === -1) {
            element.value = ""
            await this.setState({ myMsg: "" })
            element.focus()
            return
        }

        let websocketMsg = {
            text: this.state.myMsg,
            to: this.state.friend.ID.toString(),
            from: this.state.userID.toString()
        }

        let msgObject = {
            Text: this.state.myMsg,
            SenderID: this.state.userID,
            ReceiverID: this.state.friend.ID
        }

        let config = {
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/message`,
            data: msgObject
        }

        await axios(config)

        let messages = [...this.state.messages, msgObject]
        await this.setState({ messages, myMsg: "" })

        // console.log(socket);
        this.socket.emit("incomingMessage", websocketMsg)


        element.value = ""
        this.scrollBot()
        element.focus()

    }

    render() {
        return (
            <div style={this.container}>
                <SearchBar searchBoxID={this.searchBoxID} handleSearchText={this.handleSearchText} style={this.searchBar}></SearchBar>
                <UserList handleFriendClick={this.handleFriendClick} friend={this.state.friend} users={this.state.users} userID={this.state.userID} style={this.userList}></UserList>
                <ChatTitle friend={this.state.friend} activeUser={this.state.activeUser} chatTitle={this.chatTitle} />
                <MessageBox messageBoxID={this.messageBoxID} userID={this.state.userID} style={this.messageBox} messages={this.state.messages} ></MessageBox>
                <ChatBox sendButtonID={this.sendButtonID} handleSendMessageEnter={this.handleSendMessageEnter} handleTextArea={this.handleTextArea} handleSendMessage={this.handleSendMessage} style={this.chatBox}></ChatBox>
                <button onClick={this.handleLogout} style={this.logoutButton}>Logout</button>
                { localStorage.getItem("isLogin") !== "true" && <Navigate replace to="/"></Navigate>}
            </div>
        );
    }
}

export default withRouter(MainPage);
