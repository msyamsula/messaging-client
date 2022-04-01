import axios from "axios";
import React from "react"
import { Navigate } from "react-router-dom";
import ChatTitle from "../components/ChatTitle";
import { withRouter } from "../withRouter"
const { default: ChatBox } = require("../components/ChatBox");
const { default: MessageBox } = require("../components/MessageBox");
const { default: SearchBar } = require("../components/SearchBar");
const { default: UserList } = require("../components/UserList");

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
            // alignSelf: "center",
            // height: "100%"
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

        this.chatBox = {
            gridArea: "10/2/11/3",
        }

        this.chatTitle = {
            gridArea : "1/2/2/3"
        }

        this.initMessages = [
            { text: "assalamualaikum", ownerID: 1 },
            { text: "waalaikumsalam", ownerID: 2 },
            { text: "ada apa cuy?", ownerID: 2 },
            { text: "enggak nyapa doang, nge test app", ownerID: 3 },
        ]
        // this.dummyMessage = this.createMessage(10)
        // this.allMessages = [...this.allMessages, ...this.dummyMessage]
        // this.allMessages = []

        // this.users = this.createUser(5)
        // this.initMessages = []
        this.initUsers = []
        this.firstLoad = true
        this.initFriend = {
            "Username": "Welcome to Syamsul Messaging",
            "ID": -1
        }
        this.state = {
            userID: localStorage.getItem("userID"),
            myMsg: "",
            messages: this.initMessages,
            users: this.initUsers,
            searchText: "",
            friend: this.initFriend
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
        let ID = parseInt(e.target.className)
        let Username = e.target.innerHTML
        let friend = {
            ID,
            Username
        }

        await this.setState({friend})

        let textArea = document.getElementById("myMsg")
        textArea.focus()

    }

    handleLogout = (e) => {
        e.preventDefault()
        localStorage.clear()
        window.location.reload()
    }

    filterUser = async () => {
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
        let chatbox = document.getElementById("myMsg")
        chatbox.focus()
        if (this.firstLoad) {

            let config = {
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/user`
            }

            try {
                let response = await axios(config)
                this.initUsers = response.data.data
            } catch (error) {
                alert(error)
                this.initUsers = []
            }


            this.initMessages = []
            await this.setState({ messages: this.initMessages })

            

            this.firstLoad = false
        }

        this.scrollBot()
        await this.filterUser()
    }

    // createUser = (size) => {
    //     let users = []
    //     for (let i = 0; i < size; i++) {
    //         users.push({ name: "dummy" })
    //     }
    //     return users
    // }

    // createMessage = (size) => {
    //     let msgs = []
    //     for (let i = 0; i < size; i++) {
    //         msgs.push({ text: "dummy", owner: "2" })
    //     }

    //     return msgs
    // }


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
        if (element.value === "" || this.state.friend.ID === -1){
            element.value = ""
            await this.setState({myMsg: ""})
            element.focus()
            return
        }
        let msgObject = {
            text: this.state.myMsg,
            ownerID: this.state.userID
        }

        let newMessages = [...this.state.messages, msgObject]
        await this.setState({ messages: newMessages, myMsg: "" })
        element.value = ""
        this.scrollBot()
        element.focus()

    }

    render() {
        return (
            <div style={this.container}>
                <SearchBar searchBoxID={this.searchBoxID} handleSearchText={this.handleSearchText} style={this.searchBar}></SearchBar>
                <UserList handleFriendClick={this.handleFriendClick} users={this.state.users} style={this.userList}></UserList>
                <ChatTitle friend={this.state.friend} chatTitle={this.chatTitle} />
                <MessageBox messageBoxID={this.messageBoxID} userID={this.state.userID} style={this.messageBox} messages={this.state.messages} ></MessageBox>
                <ChatBox sendButtonID={this.sendButtonID} handleSendMessageEnter={this.handleSendMessageEnter} handleTextArea={this.handleTextArea} handleSendMessage={this.handleSendMessage} style={this.chatBox}></ChatBox>
                <button onClick={this.handleLogout} style={this.logoutButton}>Logout</button>
                { localStorage.getItem("isLogin") !== "true" && <Navigate replace to="/"></Navigate>}
            </div>
        );
    }
}

export default withRouter(MainPage);
