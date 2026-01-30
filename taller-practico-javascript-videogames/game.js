const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const buttonUp = document.querySelector('#up');
const buttonDown = document.querySelector('#down');
const buttonLeft = document.querySelector('#left');
const buttonRight = document.querySelector('#right');

let canvasSize;
let elementSize;

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
 
    const map = maps[1];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''))

    mapRowCols.forEach((row,rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = elementSize * colI + (elementSize / 2);
            const posY = elementSize * rowI + (elementSize / 2);   
            
            if (emoji) {
                game.fillText(emoji,posX,posY)  
            }
        });
    });

}

window.addEventListener('keydown', moveByKeys);
buttonUp.addEventListener('click',moveUp)
buttonDown.addEventListener('click',moveDown)
buttonRight.addEventListener('click',moveLeft)
buttonLeft.addEventListener('click',moveRight)

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
/* if (event.key == 'ArrowUp') {
        moveUp()
    } */

function moveUp() {
    console.log('sube');
    
}

function moveDown() {
    console.log('baja');
    
}

function moveLeft() {
    console.log('izquierda');
    
}

function moveRight() {
    console.log('derecha');
    
}