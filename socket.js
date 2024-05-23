
export default function (io, connections) {
  const room = [{ id: null }, { id: null }]
  let cells = [
    { id: null, index: 1 },
    { id: null, index: 2 },
    { id: null, index: 3 },
    { id: null, index: 4 },
    { id: null, index: 5 },
    { id: null, index: 6 },
    { id: null, index: 7 },
    { id: null, index: 8 },
    { id: null, index: 9 },
  ]
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let currentWalker = 0

  io.on("connection", (socket) => {
    // console.log("socket connect");
    socket.handshake.headers.origin = "*";
    let id = null
    socket.on("clientSendUserId", (data) => {
      id = data
      if (id) {
        connections.push(id);
        io.emit("serverEmitAllUsers", JSON.stringify(connections))
        emitUpdate()
        // console.log("connection-connections: ", connections);
      }
    })
    //
    socket.on("disconnect", () => {
      const plase = room.find((plase) => plase.id === id)
      if (plase) plase.id = null

      connections = connections.filter((conId) => conId !== id);
      // console.log("disconnect-connections", connections);
      emitUpdate()
      io.emit("serverEmitAllUsers", JSON.stringify(connections));

    });
    //
    socket.on("room.enter", (data) => {
      const { plaseIndex, id } = JSON.parse(data)
      // console.log("Room-enter", { plaseIndex, id });
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

      // checkFullRoom(place)
      emitUpdate()
    })
    //
    socket.on("room.exit", (id) => {
      // console.log("Room-exit", id);
      const plase = room.find((plase) => plase.id === id)
      if (plase) plase.id = null
      emitUpdate()
    })

    function checkFullRoom() {
      if (room.find(place => place.id === null)) {
        console.log("room.enter.twoPlayers:", false)
        io.emit("room.isReady", false)
      } else {
        console.log("room.enter.twoPlayers:", true)
        io.emit("room.isReady", true)
        clearGame()
        startGame()
      }
    }
    function emitUpdate() {
      // console.log("emitUpdate");
      checkFullRoom()
      io.emit("room.update", JSON.stringify(room))
    }
    function startGame() {
      console.log("startGame");
      io.emit("room.updateGame", JSON.stringify({ cells, currentWalker }))
    }
    function clearGame() {
      console.log("clearGame");
      currentWalker = 0
      cells = [
        { id: null, index: 0 },
        { id: null, index: 1 },
        { id: null, index: 2 },
        { id: null, index: 3 },
        { id: null, index: 4 },
        { id: null, index: 5 },
        { id: null, index: 6 },
        { id: null, index: 7 },
        { id: null, index: 8 },
      ]
    }
    //
    socket.on("selectCell", (data) => {
      const select = JSON.parse(data)
      const index = select.index;
      const id = select.id
      // console.log({ index, id });
      cells.find(cell => cell.index === index).id = id
      if (playerWin(id)) io.emit("room.playerWin", id)
      if (currentWalker == 0) {
        currentWalker = 1
      } else {
        currentWalker = 0
      }
      // console.log({ cells, currentWalker });
      io.emit("room.updateGame", JSON.stringify({ cells, currentWalker }))
    })
    function playerWin(id) {
      if (!cells.find(cell => !cell.id)) {
        console.log("full");
        setTimeout(() => {
          clearGame()
          startGame()
        }, 2000)
      }
      for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (cells[a].id === id && cells[b].id === id && cells[c].id === id) {
          setTimeout(() => {
            clearGame()
            startGame()
          }, 2000)
          return true
        }
      }
      return false;
    }
  });
}

