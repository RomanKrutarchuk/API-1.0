
export default function (io, connections) {
  const room = [{ id: null }, { id: null }]
  io.on("connection", (socket) => {
    console.log("socket connect");
    socket.handshake.headers.origin = "*";
    let id = null
    socket.on("clientSendUserId", (data) => {
      id = data
      if (id) {
        connections.push(id);
        io.emit("serverEmitAllUsers", JSON.stringify(connections))
        io.emit("Room_update", JSON.stringify(room))
        console.log("connection-connections: ", connections);
      }
    })
    socket.on("disconnect", () => {
      const plase = room.find((plase) => plase.id === id)
      if (plase) plase.id = null

      connections = connections.filter((conId) => conId !== id);
      console.log("disconnect-connections", connections);
      io.emit("Room_update", JSON.stringify(room))
      io.emit("serverEmitAllUsers", JSON.stringify(connections));
    });
    socket.on("Room_enter", (data) => {
      const { plaseIndex, id } = JSON.parse(data)
      console.log("Room-enter", { plaseIndex, id });
      if (
        room.find((plase) => plase.id === id)
      ) {
        return console.log("user-is-enter");
      }
      if (room[plaseIndex].id === null) {
        room[plaseIndex].id = id
      } else {
        return console.log("plase-reserved");
      }
      io.emit("Room_update", JSON.stringify(room))
    })
    socket.on("Room_exit", (id) => {
      console.log("Room-exit", id);
      const plase = room.find((plase) => plase.id === id)
      if (plase) plase.id = null
      io.emit("Room_update", JSON.stringify(room))
    })

  });
}
