const io = require("socket.io-client")

let socket = io.connect(process.env.REACT_APP_WEBSOCKET, {transports: ["websocket", "polling"]})

export default socket