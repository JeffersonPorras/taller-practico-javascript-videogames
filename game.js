const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const buttonUp = document.querySelector('#up');
const buttonDown = document.querySelector('#down');
const buttonLeft = document.querySelector('#left');
const buttonRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');


let canvasSize;
let elementSize;
let lives = 3;
let level = 0;

const playerPosicion = {
    x: undefined,
    y: undefined
}

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    }else{
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = canvasSize / 10

    startGame()
}

function startGame() {

    game.clearRect(0, 0, canvasSize, canvasSize)
    game.font = (elementSize * 0.8) + 'px Verdana';
    game.textAlign = 'center';
    game.textBaseline = 'middle';

    if (!maps[level]) {
    console.log("Juego Terminado - Ganaste Todo");
    return;
    }
 
    const map = maps[level];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''))

    mapRowCols.forEach((row,rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = elementSize * colI + (elementSize / 2);
            const posY = elementSize * rowI + (elementSize / 2);   
            
            if (emoji) {

                game.shadowBlur = 0;
                game.shadowColor = 'transaparent';

                if (col === 'X'){
                    game.shadowBlur = 25;
                    game.shadowColor = "#ff0000"
                }else if (col === 'I'){
                    game.shadowBlur = 20;
                    game.shadowColor = "#ffee00"
                }else if (col === 'O') {
                    game.shadowBlur = 15;
                    game.shadowColor = "#aa00ff";
                }

                game.fillText(emoji,posX,posY)  
            }

            if (col == 'O' && playerPosicion.x == undefined) {
                playerPosicion.x = colI;
                playerPosicion.y =rowI;
            }
        });
    });
    movePlayer();
    showLives();
}

window.addEventListener('keydown', moveByKeys);
buttonUp.addEventListener('click',moveUp)
buttonDown.addEventListener('click',moveDown)
buttonRight.addEventListener('click',moveRight)
buttonLeft.addEventListener('click',moveLeft)

function moveByKeys(event) {

    let flecha = event.key
    switch (flecha) {
        case 'ArrowUp':
            moveUp()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowRight':
            moveRight()
            break;
        case 'ArrowDown':
            moveDown()
            break;
        default:
            break;
    }
}


function moveUp() {
   if (playerPosicion.y > 0) {
     playerPosicion.y -= 1;
     startGame();
     checkCollision();
   }
    
}

function moveDown() {
    if (playerPosicion.y < 9) {
     playerPosicion.y += 1;
     startGame();
     checkCollision();
   }
    
}

function moveLeft() {
    if (playerPosicion.x > 0) {
     playerPosicion.x -= 1;
     startGame();
     checkCollision();
   }
    
}

function moveRight() {
   if (playerPosicion.x < 9) {
     playerPosicion.x += 1;
     startGame();
     checkCollision();
   }
    
}

function movePlayer() {
    const posX = elementSize * playerPosicion.x + (elementSize / 2);
    const posY= elementSize * playerPosicion.y + (elementSize / 2);

    game.shadowBlur = 30;
    game.shadowColor = "#00f2ff";

    game.font = (elementSize * 0.8) + 'px Verdana';

    game.fillText(emojis['PLAYER'], posX, posY)
}

function checkCollision() {
    
    const map = maps[level];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    const symbol = mapRowCols[playerPosicion.y][playerPosicion.x];

    if (symbol == 'X') {
        levelFail();
    }else if (symbol == 'I') {
        levelWin();
    }
}

function levelWin() {
    level++
    startGame();
}

function levelFail() {
    lives--;
    
    if (lives == 0) {
        level = 0;
        lives = 3; 
        console.log("GAME OVER - Reiniciando...");

    }
    playerPosicion.x = undefined;
    playerPosicion.y = undefined;
    startGame();
}

function showLives() {
    const heartsArray = Array(lives).fill('❤️');

    spanLives.innerHTML = "";
    heartsArray.forEach(heart => {
        spanLives.append(heart);
    });

}