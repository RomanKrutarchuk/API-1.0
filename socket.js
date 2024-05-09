
export default function (io, connections) {
  io.on("connection", (socket) => {
    console.log("socket connect");
    socket.handshake.headers.origin = "*";
    let id = null
    socket.on("clientSendUserId", (data) => {
      id = data
      if (id) {
        connections.push(id);
        io.emit("serverEmitAllUsers", JSON.stringify(connections))
        console.log("connection-connections: ", connections);
      }
    })
    socket.on("disconnect", () => {
      connections = connections.filter((conId) => conId !== id);
      console.log("disconnect-connections", connections);
      io.emit("serverEmitAllUsers", JSON.stringify(connections));
    });
  });
}
