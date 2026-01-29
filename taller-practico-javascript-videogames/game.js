const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

let canvasSize;
let elementSize;

window.addEventListener('load',startGame);
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

    game.font = elementSize + 'px Verdana';
    game.textAling = 'end';

    const map = maps[1];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''))

    mapRowCols.forEach((row,rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = elementSize * (colI + 1) 
            const posY = elementSize * (rowI + 1)
            game.fillText(emoji,posX,posY)            
        });
    });

    

   /*  for (let row = 1; row <= 10 ; row++) {
        for (let col = 1; col <= 10; col++) {
            game.fillText(emojis[mapRowCols[row - 1][col - 1]],elementSize * col , elementSize * row);
        }  
    } */
}