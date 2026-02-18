const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const buttonUp = document.querySelector('#up');
const buttonDown = document.querySelector('#down');
const buttonLeft = document.querySelector('#left');
const buttonRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const spanlevel = document.querySelector('#level');
const startScreen = document.querySelector('#start-screen');
const btnStart = document.querySelector('#btn-start');
const btnMute = document.querySelector('#btn-mute');
const gameOverScreen = document.querySelector('#gameOver-screen');
const btnRetry = document.querySelector('#btn-retry');
const finalStats = document.querySelector('#final-stats')


let canvasSize;
let elementSize;
let lives = 3;
let level = 0;
let timeStart;
let timePlayer;
let timeInterval;
let currentMap;
let music = null;
let isMuted = false;

const explosiónAudio = new Audio('./Assets/explosión.mp3');
explosiónAudio.volume = 0.5;

const playerPosicion = {
    x: undefined,
    y: undefined
}


window.addEventListener('resize',setCanvasSize);

btnStart.addEventListener('click', () =>{
    startScreen.classList.add('hidden');
    backgroundSound();
    setCanvasSize();
})

 btnMute.addEventListener('click', () => {
    isMuted = !isMuted;

    btnMute.innerHTML = isMuted ? "🔇" : "🔊";

    if(music){
        music.muted = isMuted;
        music.play().catch(() => {});
    }
})

btnRetry.addEventListener('click', () =>{
    gameOverScreen.classList.add('hidden');

    level = 0;
    lives = 3;
    timeStart = undefined;
    currentMap = undefined;
    playerPosicion.x = undefined;
    playerPosicion.y = undefined;

    backgroundSound();
    startGame();
})

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

    

    if (level < maps.length) {
        currentMap = maps[level];
    }else if (level < 100) {
        if(!currentMap || level >= maps.length){
            if (!currentMap) currentMap = generateRandomMap();
        }
    }else{
        console.log("!HAS CONQUISTADO EL SISTEMA!");
        gameFinished();
        return;  
    }
 
    
    const mapRows = currentMap.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''))

    mapRowCols.forEach((row,rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = elementSize * colI + (elementSize / 2);
            const posY = elementSize * rowI + (elementSize / 2);   
            
            if (emoji) {

                game.shadowBlur = 0;
                game.shadowColor = 'transparent';

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

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    movePlayer();
    showLives();
    showLevel();
}

function showTime() {
    spanTime.innerHTML = ((Date.now() - timeStart) / 1000).toFixed(1);
    
}

window.addEventListener('keydown', moveByKeys);
buttonUp.addEventListener('click',moveUp)
buttonDown.addEventListener('click',moveDown)
buttonRight.addEventListener('click',moveRight)
buttonLeft.addEventListener('click',moveLeft)

function moveByKeys(event) {

    if (!startScreen.classList.contains('hidden')) return;

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

    if (!startScreen.classList.contains('hidden')) return;

   if (playerPosicion.y > 0) {
     playerPosicion.y -= 1;
     startGame();
     checkCollision();
   }
    
}

function moveDown() {

    if (!startScreen.classList.contains('hidden')) return;

    if (playerPosicion.y < 9) {
     playerPosicion.y += 1;
     startGame();
     checkCollision();
   }
    
}

function moveLeft() {

    if (!startScreen.classList.contains('hidden')) return;

    if (playerPosicion.x > 0) {
     playerPosicion.x -= 1;
     startGame();
     checkCollision();
   }
    
}

function moveRight() {

    if (!startScreen.classList.contains('hidden')) return;

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
    playStepSound();
}

function checkCollision() {
    
    const mapRows = currentMap.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    const symbol = mapRowCols[playerPosicion.y][playerPosicion.x];

    if (symbol == 'X') {
        levelFail();
    }else if (symbol == 'I') {
        levelWin();
    }
}

function levelWin() {
    console.log('!Nivel Superado!');
    level++;
    currentMap = undefined;
    playerPosicion.x = undefined;
    playerPosicion.y = undefined;
    startGame();
}

function saveRecord() {
    const recordTime = parseFloat(localStorage.getItem('record_time') || 999999);
    const recordLevel = parseFloat(localStorage.getItem('record_level') || 0);
    const playerTime = parseFloat(((Date.now() - timeStart) / 1000).toFixed(1));
    const playerLevel = level + 1;

    if (playerLevel > recordLevel || (playerLevel === recordLevel && playerTime > recordTime)) {
        localStorage.setItem('record_time', playerTime);
        localStorage.setItem('record_level', playerLevel);
        console.log('!Nuevo Récord De Sistema!');
        
    }
}

function showRecord() {
    const resultTime = localStorage.getItem('record_time') || "0.0";
    const resultLevel = localStorage.getItem('record_level') || "1";
    spanRecord.innerHTML = `LVL ${resultLevel} - ${resultTime}`;
}

function levelFail() {

    canvas.classList.add('shake');
    playExplosionSound();

    const posX = elementSize * playerPosicion.x + (elementSize / 2);
    const posY = elementSize * playerPosicion.y + (elementSize / 2);

    game.shadowBlur = 30;
    game.shadowColor = "#ff0000";
    game.fillText(emojis['BOMB_COLLISION'], posX, posY)
    
    setTimeout(() =>{

        canvas.classList.remove('shake');
        lives--;
    
    if (lives <= 0) {
        saveRecord();
        showRecord();
        /* level = 0;
        lives = 3; 
        timeStart = undefined;
        currentMap = undefined;
        clearInterval(timeInterval); */

        const totalTime = spanTime.innerHTML;
        finalStats.innerHTML = `LEVEL ${level + 1} - TIME ${totalTime}s`;

        if(music){
            music.pause();
            music.currentTime = 0;
        }

        playerPosicion.x = undefined;
        playerPosicion.y = undefined;

        gameOverScreen.classList.remove('hidden');
        return;
    }

    playerPosicion.x = undefined;
    playerPosicion.y = undefined;
   
    startGame();
    },150);
    
}

function showLives() {
    const heartsArray = Array(lives).fill('❤️');

    spanLives.innerHTML = "";
    heartsArray.forEach(heart => {
        spanLives.append(heart);
    });
}

function generateRandomMap() {

    let mapString = "";
    let solvable = false;

    while(!solvable){
        const newMap = [];
        const bombProbility = Math.min(0.15 + (level * 2), 0.5);

        for (let i = 0; i < 10; i++) {
            let row = "";
            for (let j = 0; j < 10; j++) {
                row += (Math.random() < bombProbility) ? "X" : "-"    
            }
            newMap.push(row);
        }
        newMap[9] = "O" + newMap[9].substring(1);
        newMap[0] = newMap[0].substring(0, 9) + "I"
        mapString = newMap.join("\n");

        solvable = isMapSolvable(mapString);
    }
    return mapString
}          

function isMapSolvable(mapSrting) {
    const rows = mapSrting.trim().split('\n').map(r => r.trim().split(''));
    let start = {x: 0, y: 9};
    let queue = [start];
    let visited = new Set(['0,9']);

    while(queue.length > 0){
        let {x, y} = queue.shift();
        if (rows[y][x] === 'I') return true;

        [[0,1],[0, -1],[1, 0],[-1, 0]].forEach(([dx, dy]) => {
            let nextX = x + dx;
            let nextY = y + dy;

            if (nextX >= 0 && nextX < 10 && nextY >= 0 && nextY < 10 && rows[nextY][nextX] !== 'X' && !visited.has(`${nextX},${nextY}`)) {
                visited.add(`${nextX},${nextY}`);
                queue.push({x: nextX, y: nextY});                
            }
        });
    }
    return false;
}
function showLevel() {
    spanlevel.innerHTML = level + 1;
}

function backgroundSound() {
    if (!music){
        music = new Audio('./Assets/backgroundSound.mp3')
        music.volume = 0.2;
        music.loop = true;
    };
 
   
    music.muted = isMuted;
    music.play().catch(e => console.warn("Audio nloqueado Temporalmente", e))

}

function playExplosionSound() {
    explosiónAudio.currentTime = 0;
    explosiónAudio.play();
}

function playStepSound() {
    const audioCtx = new (window.AudioContext || window.webAudioContext);
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gain)
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}