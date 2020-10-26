let currentBlock,
  nextBlock,
  blockPos,
  prevPos,
  isMoving,
  score,
  blockColor,
  nextColor

isMoving = false
prevPos = {
  x: 0,
  y: 5
}
score = 0

const gameState = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const getShape = () => {
  let characterText = ""
  const string = "OISZJLT"

  for (var i = 0; i < 1; i++)
    characterText += string.charAt(Math.floor(Math.random() * string.length))

  setColor(characterText)
  return shapes(characterText)
}

const shapes = (name) => {
  switch (name) {
    case "O":
      return [
        [-1, 0],
        [0, 0],
        [-1, 1],
        [0, 1]
      ]
    case "I":
      return [
        [-2, 0],
        [-1, 0],
        [0, 0],
        [1, 0]
      ]
    case "S":
      return [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1]
      ]
    case "Z":
      return [
        [-1, 0],
        [0, 0],
        [0, 1],
        [1, 1]
      ]
    case "J":
      return [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, 1]
      ]
    case "L":
      return [
        [-1, 0],
        [0, 0],
        [1, 0],
        [-1, 1]
      ]
    case "T":
      return [
        [-1, 0],
        [0, 0],
        [1, 0],
        [0, 1]
      ]
    default:
      return null
  }
}

const setColor = (name) => {
  switch (name) {
    case "O":
      nextColor = 1
      break
    case "I":
      nextColor = 2
      break
    case "S":
      nextColor = 3
      break
    case "Z":
      nextColor = 4
      break
    case "J":
      nextColor = 5
      break
    case "L":
      nextColor = 6
      break
    case "T":
      nextColor = 7
      break
    default:
      return null
  }
}

nextBlock = getShape()

const onTimerTick = () => {
  if (!isMoving) {
    currentBlock = nextBlock
    blockColor = nextColor
    nextBlock = getShape()
    blockPos = {
      x: 0,
      y: 5
    }
    checkIfLine()
    isMoving = true
  } else {
    updatePos("down")
  }
  moveBlock()
}

const moveBlock = () => {
  placeBlock(blockColor, blockPos)
  printToPage()
}

const placeBlock = (color, pos) => {
  const coordinates = getShapeCoords(pos)
  for (let i in coordinates) {
    gameState[coordinates[i][1]][coordinates[i][0]] = color
  }
}

const updatePos = (direction) => {
  prevPos = { ...blockPos }
  nextPos = { ...blockPos }
  switch (direction) {
    case "down":
      nextPos.x++
      break
    case "left":
      nextPos.y--
      break
    case "right":
      nextPos.y++
      break
    case "drop":
      nextPos.x++
      score++
      break
    default:
      console.log("shouldn't reach here")
  }
  placeBlock(0, prevPos)
  if (!causesCollision(nextPos)) {
    blockPos = { ...nextPos }
  }
  moveBlock()
}

const causesCollision = (pos) => {
  const nextCoordinates = getShapeCoords(pos)
  for (let i in nextCoordinates) {
    if (nextCoordinates[i][1] == 20) {
      endTurn()
      return true
    }
    if (nextCoordinates[i][0] == 10 || nextCoordinates[i][0] == -1) {
      return true
    }
    if (gameState[nextCoordinates[i][1]][nextCoordinates[i][0]] != 0) {
      endTurn()
      return true
    }
  }
  return false
}

const endTurn = () => {
  isMoving = false
  score++
}

const checkIfLine = () => {
  for (let row in gameState) {
    console.log(gameState[row].includes(0))
    if (!gameState[row].includes(0)) {
      removeLine(row)
      checkIfLine()
    }
  }
}

const removeLine = (row) => {
  gameState.splice(row, 1)
  gameState.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  score += 10
}

const getShapeCoords = (pos) => {
  let shapeCoords = []
  for (let coord in currentBlock) {
    const y = currentBlock[coord][0] + pos.y
    const x = currentBlock[coord][1] + pos.x
    shapeCoords.push([y, x])
  }

  return shapeCoords
}

const rotateShape = () => {
  // Put Rotate Here
}

const printToPage = () => {
  let arrayText = ""
  for (let y in gameState) {
    for (let x in gameState[y]) {
      arrayText += `${gameState[y][x]}, `
    }
    arrayText += "<br>"
  }
  document.getElementById("main").innerHTML = arrayText
  document.getElementById("score").innerHTML = `<br><br><br>Score: ${score}`
}

document.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "ArrowLeft":
      updatePos("left")
      break
    case "ArrowUp":
      alert("Up")
      break
    case "ArrowRight":
      updatePos("right")
      break
    case "ArrowDown":
      updatePos("drop")
      break
    default:
      console.log("no key needed")
  }
})

setInterval(() => {
  onTimerTick()
}, 1000)

printToPage()
