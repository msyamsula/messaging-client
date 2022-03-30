function UserList(props) {

    let singleList = {
        border: "1px solid",
        borderRadius: "5px",
        marginTop: "10px",
        height: "7%",
        padding: "5px 10px"
    }

    let createSingleList = (user, id) => {
        return (
            <div key={`user${id}`} style={singleList}>{user.name}</div>
        )
    }

    return (
        <div style={props.style}>
            { props.users.map((user, index) => {
                return createSingleList(user, index)
            })}
        </div>
    );
}

export default UserList;
