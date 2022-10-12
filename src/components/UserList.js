function UserList(props) {

    let singleList = {
        border: "1px solid",
        borderRadius: "5px",
        marginTop: "10px",
        height: "7%",
        padding: "5px 10px",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "5fr 1fr"
    }

    let createSingleList = (user) => {
        if (props.userID === user.id) {
            return (<div key={user.id}></div>)
        }

        
        let color = (user.id === props.friend.id) ? "orange" : "white"
        
        let isActive = {
            background: color
        }
        if (!user.IsActive){
            isActive.background = "grey"
        }
        
        let localStyle = { ...singleList, ...isActive }

        return (
            <div key={`${user.id}`} className={user.id} style={localStyle} onClick={props.handleFriendClick}>
                <div onClick={props.handleFriendClick} >{user.username}</div>
                <p onClick={props.handleFriendClick} style={{textAlign: "right", margin: "0", color: "blue"}}>{(user.UnreadMessages === 0 ? "" : user.UnreadMessages)}</p>
            </div>
        )
    }


    return (
        <div style={props.style}>
            { props.users.map((user) => {
                return createSingleList(user)
            })}
        </div>
    );
}

export default UserList;
