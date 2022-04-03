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
        if (props.userID === user.ID) {
            return (<div key={user.ID}></div>)
        }

        let color = (user.ID === props.friend.ID) ? "orange" : "white"

        let isActive = {
            background: color
        }

        let localStyle = { ...singleList, ...isActive }

        return (
            <div key={`${user.ID}`} className={user.ID} style={localStyle} onClick={props.handleFriendClick}>
                <div onClick={props.handleFriendClick} >{user.Username}</div>
                <p onClick={props.handleFriendClick} style={{textAlign: "right", margin: "0", color: "blue"}}>{(user.unread === undefined ? "" : user.unread)}</p>
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
