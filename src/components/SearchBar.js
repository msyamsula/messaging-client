function SearchBar(props) {

    let input = {
        width: "90%",
        padding: "5px 10px",
        justifySelf: "left"
    }

    let container = {
        display: "grid",
    }

    container = {...props.style, ...container}


    return (
        <div style={container}>
            <input id={props.searchBoxID} onChange={props.handleSearchText} style={input} placeholder="search"></input>
        </div>
    );
}

export default SearchBar;
