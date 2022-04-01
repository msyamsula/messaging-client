function UserList(props) {

    let singleList = {
        border: "1px solid",
        borderRadius: "5px",
        marginTop: "10px",
        height: "7%",
        padding: "5px 10px",
        cursor: "pointer"
    }

    let createSingleList = (user) => {
        return (
            <div key={`${user.ID}`} className={user.ID} style={singleList} onClick={props.handleFriendClick}>{user.Username}</div>
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
