import React from "react"
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
            gridArea: "1/2/span 9 /3",
            padding: "40px",
            overflow: "scroll"
        }

        this.messageBoxID = "messageBox"
        this.sendButtonID = "sendButton"
        this.searchBoxID = "searchBox"

        this.userList = {
            gridArea: "2/1/span 9/2",
            overflow: "scroll",
            padding: "0 15px"
        }

        this.chatBox = {
            gridArea: "10/2/11/3",
        }


        this.allMessages = [
            { text: "assalamualaikum", ownerID: 1 },
            { text: "waalaikumsalam", ownerID: 2 },
            { text: "ada apa cuy?", ownerID: 2 },
            { text: "enggak nyapa doang, nge test app", ownerID: 3 },
        ]
        // this.dummyMessage = this.createMessage(10)
        // this.allMessages = [...this.allMessages, ...this.dummyMessage]
        // this.allMessages = []
        
        // this.users = this.createUser(5)
        this.initUsers = []
        this.state = {
            userID: 1,
            myMsg: "",
            messages: this.allMessages,
            users: this.initUsers,
            searchText: ""
        }
    }

    scrollBot = () => {
        let element = document.getElementById(this.messageBoxID)
        if (element!== ""){
            element.scrollTop = element.scrollHeight
        }
    }

    filterUser = async () => {
        if (this.state.searchText !== ""){
            let filteredUser = this.initUsers.filter((user) => {
                return user.name.includes(this.state.searchText)
            })
            await this.setState({users: filteredUser})
        } else {
            await this.setState({users: this.initUsers})
        }
    }

    componentDidMount = async () => {
        if (this.state.users.length === 0){
            this.initUsers = [
                {name: "syamsul"},
                {name: "arifin"},
                {name: "muhammad"},
                {name: "fajar"}
            ]
        }
        this.scrollBot()
        await this.filterUser()

        if (this.state.messages.length === 0){
            await this.setState({messages: this.allMessages})
        }
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
        await this.setState({searchText})
        await this.filterUser()
    }

    handleSendMessageEnter = async (e) => {
        if (e.key === "Enter"){
            await this.handleSendMessage(e)
        }
    }

    handleSendMessage = async (e) => {
        e.preventDefault()
        let element = document.getElementById("myMsg")
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
                <UserList users={this.state.users} style={this.userList}></UserList>
                <MessageBox messageBoxID={this.messageBoxID} userID={this.state.userID} style={this.messageBox} messages={this.state.messages} ></MessageBox>
                <ChatBox sendButtonID={this.sendButtonID} handleSendMessageEnter={this.handleSendMessageEnter} handleTextArea={this.handleTextArea} handleSendMessage={this.handleSendMessage} style={this.chatBox}></ChatBox>
            </div>
        );
    }
}

export default MainPage;
