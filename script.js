class Menu{
  constructor(ballClass){
    this.principalsMenu = document.querySelectorAll('.options')
    this.optionsMenu = document.querySelectorAll('.options li')
    this.game = document.querySelector('.game')
    this.menu = document.querySelector('.menu-game')

    this.optionsMenu.forEach((option) =>{
      option.addEventListener('click', (event) =>{
        console.log(event.target.textContent)
        switch(event.target.textContent){
          case 'Start game':
            this.principalsMenu[0].classList.add('hide')
            this.principalsMenu[1].classList.remove('hide') 
            break;
          
          case 'Player vs Player':
            this.game.classList.remove('hide')
            this.menu.classList.add('hide')
            ballClass.startGame = true
            ballClass.resetGame()
            break;
        }
      })
    } )
  }

}

class Player {
  constructor(idElement, startPosX, startPosY, gameArea) {
    this.element = document.getElementById(idElement)
    this.gameArea = document.getElementById(gameArea)
    this.posX = startPosX
    this.posY = startPosY
    this.width = this.element.offsetWidth
    this.height = this.element.offsetHeight
    this.velocityMoviment = 15

    this.updateMoviment()
  }

  moveUp() {
    if (this.posY > 0) this.posY -= this.velocityMoviment
  }

  moveDown() {
    if (this.posY + this.height < this.gameArea.offsetHeight) this.posY += this.velocityMoviment
  }

  updateMoviment() {
    this.element.style.top = `${this.posY}px`
    this.element.style.left = `${this.posX}px`
  }
}

class Ball {
  constructor(idElement, gameArea, players) {
    this.element = document.getElementById(idElement)
    this.gameArea = document.getElementById(gameArea)
    this.playerWin = document.querySelector('.game-over')
    this.posX = 100
    this.posY = 100
    this.velocityX = 7
    this.velocityY = 7
    this.menu = document.querySelector('.menu')
    this.size = this.element.offsetHeight
    this.gameAreaWidth = this.gameArea.offsetWidth
    this.gameAreaHeight = this.gameArea.offsetHeight
    this.players = players
    this.startGame = false
  }

  resetGame(){
    this.posX = this.gameAreaWidth / 2 - this.size / 2
    this.posY = this.gameAreaHeight / 2 - this.size / 2
    this.velocityX = 7
    this.velocityY = 7

    this.players[0].posX = 0;
    this.players[0].posY = 250;
    this.players[1].posX = this.gameAreaWidth - this.players[1].width;
    this.players[0].posY = 250;

    this.players[0].velocityMoviment = 15
    this.players[1].velocityMoviment = 15

    this.menu.classList.add('hide')
  }

  updateMoviment() {
    this.element.style.top = `${this.posY}px`
    this.element.style.left = `${this.posX}px`
  }

  playerWins(player){
    this.playerWin.textContent = `${player} wins!`
    this.menu.classList.remove('hide')
    this.velocityX = 0
    this.velocityY = 0
    
    this.players[0].velocityMoviment = 0
    this.players[1].velocityMoviment = 0
  }
  move() {
    this.posX += this.velocityX
    this.posY += this.velocityY

    if (this.posY + this.size > this.gameAreaHeight || this.posY + this.size <= this.size) {
      this.velocityY = -this.velocityY
    }

    if (this.posX + this.size > this.gameAreaWidth) {
       !self.startGame ? this.velocityX = -this.velocityX : this.playerWins('Player 1')
    }
    if (this.posX + this.size <= this.size) {
        !self.startGame ? this.velocityX = -this.velocityX : this.playerWins('Player 2')
    }    
  }

  colisionPlayer() {
    let player1 = this.players[0]
    let player2 = this.players[1]
    if (
      this.posX <= player1.posX + player1.width && 
      this.posX + this.size >= player1.posX &&  
      this.posY + this.size >= player1.posY &&  
      this.posY <= player1.posY + player1.height
    ) {
      this.velocityX = -this.velocityX;  
    }    
    if (
      this.posX + this.size >= player2.posX &&
      this.posX <= player2.posX + player2.width &&
      this.posY + this.size >= player2.posY &&
      this.posY <= player2.posY + player2.height
    ) {
      this.velocityX = -this.velocityX;  
    }
  }
}
let activeKeys = {}

const player1 = new Player('player1', 0, 250, 'game-area')
const player2 = new Player('player2', 988, 250, 'game-area')
const ball = new Ball('ball', 'game-area',[player1,player2])
const menu = new Menu(ball)
const restartBtn = document.querySelector('.restart-game')

restartBtn.addEventListener('click', () =>{
  ball.resetGame()
})

document.addEventListener('keydown', (event) => {
  activeKeys[event.key] = true
})

document.addEventListener('keyup', (event) => {
  activeKeys[event.key] = false
})

setInterval(() => {
  if (activeKeys['w']) player1.moveUp()
  if (activeKeys['s']) player1.moveDown()
  if (activeKeys['ArrowUp']) player2.moveUp()
  if (activeKeys['ArrowDown']) player2.moveDown()

  ball.move()
  player1.updateMoviment()
  player2.updateMoviment()
  ball.updateMoviment()
  ball.colisionPlayer(player1, player2)
}, 16.67)