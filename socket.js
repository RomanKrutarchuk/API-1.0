function serverEmitAllUsers(io, connections) {
  io.emit("serverEmitAllUsers", connections);
}

export default function (io, connections) {
  io.on("connection", (socket) => {
    const id = socket.id;
    connections.push({ id, email: null, name: null });
    const socketProfile = connections.find((con) => con.id === socket.id);
    console.log({ socketProfile });
    socket.handshake.headers.origin = "*";
    console.log({ connections });

    //
    socket.on("sendUserProfile", (data) => {
      console.log("userData", data);
      const { email, name } = data;
      if (!email) return;
      socketProfile.email = email;
      socketProfile.name = name;
      io.emit("serverEmitAllUsers", connections);
    });
    // io.emit("hello", "hi from server");
    // socket.on("sendHi", (data) => {
    //   console.log(data);
    //   io.emit("sendHi", data);
    // });

    socket.on("disconnect", () => {
      connections = connections.filter((el) => el.id !== socket.id);
      console.log(connections);
      io.emit("serverEmitAllUsers", connections);
    });
  });
}
