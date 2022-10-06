
//board
var blockSize = 50;
var rows = 10;
var cols = 10;
var board;
var context; 

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;
var speed = 1;//1 is unit

var snakeBody = [];

//food
var foodX;
var foodY;

var gameOver = false;
var food = new Image();
food.src = "./elements/Website Mirinda 12.png";
food.width = blockSize;
food.height = blockSize * 2;
var arrow_key = new Image();
arrow_key.src = "./elements/windows-photo-app-arrow-keys-not-working.png";
arrow_key.width = blockSize * rows / 2;
arrow_key.height = blockSize * cols / 2;
arrow_key.id = "arrow_key";
// arrow_key.style.opacity = "55";

const timeTotal = 30;
var start_time;
var gameStop = false;

var thresh = 10;

var snake_color = "#8700C7";
var board_color = "#C6A9D4";

var rule = `
Hướng dẫn chơi
`;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board


    function rule_and_key(){
        context.fillStyle= "gray";
        context.fillRect(0, 0, board.width, board.height);
        context.font = "30px Comic Sans MS";
        context.fillStyle = "white";
        context.textAlign = "left";
        context.fillText(rule, 0, board.height/2);
    }
    rule_and_key();

    // context.drawImage(arrow_key, board.width / 2 - arrow_key.width / 2, board.height / 2 - arrow_key.height / 2, arrow_key.width, arrow_key.height)
    
}

function guide_to_play(){
    document.getElementById("rule_intro").remove();

    

    placeFood(); 
    // start_time = 0;

    update();
    context.drawImage(arrow_key, board.width / 2 - arrow_key.width / 2, board.height / 2 - arrow_key.height / 2, arrow_key.width, arrow_key.height);
    document.addEventListener("keyup", start_game_funct);
}

function start_game_funct(e){ 
    // changeDirection();
    document.removeEventListener("keyup", start_game_funct);
    changeDirection(e);
    // placeFood();
    document.addEventListener("keyup", changeDirection);
    const d = new Date();
    start_time = d.getTime();
    update();
    // lucky_wheel();//test
    setInterval(update, 200); //100 milliseconds
}

function lucky_wheel(){
    let wheel = document.getElementById("wheelOfFortune");
    wheel.style.display = "flex";
    const sectors = [
        {color:"#f82", label:"Lucky"},
        {color:"#0bf", label:"10"},
        {color:"#fb0", label:"200"},
        {color:"#0fb", label:"50"},
        {color:"#b0f", label:"100"},
        {color:"#f0b", label:"5"},
        {color:"#bf0", label:"500"},
    ];
    
      // Generate random float in range min-max:
    const rand = (m, M) => Math.random() * (M - m) + m;
    
    const tot = sectors.length;
    const elSpin = document.querySelector("#spin");
    const ctx = document.querySelector("#wheel").getContext`2d`;
    const dia = ctx.canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const arc = TAU / sectors.length;
    const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
    const angVelMin = 0.002; // Below that number will be treated as a stop
    let angVelMax = 0; // Random ang.vel. to acceletare to 
    let angVel = 0;    // Current angular velocity
    let ang = 0;       // Angle rotation in radians
    let isSpinning = false;
    let isAccelerating = false;
    
    //* Get index of current sector */
    const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;
    
    //* Draw sectors and prizes texts to canvas */
    const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    //
    ctx.restore();
    };
    
    //* CSS rotate CANVAS Element */
    const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    elSpin.textContent = !angVel ? "SPIN" : sector.label;
    elSpin.style.background = sector.color;
    };
    
    const frame = () => {
    
    if (!isSpinning) return;
    
    if (angVel >= angVelMax) isAccelerating = false;
    
    // Accelerate
    if (isAccelerating) {
        angVel ||= angVelMin; // Initial velocity kick
        angVel *= 1.06; // Accelerate
    }
    
    // Decelerate
    else {
        isAccelerating = false;
        angVel *= friction; // Decelerate by friction  
    
        // SPIN END:
        if (angVel < angVelMin) {
        isSpinning = false;
        angVel = 0; 
        }
    }
    
    ang += angVel; // Update angle
    ang %= TAU;    // Normalize angle
    rotate();      // CSS rotate!
    };
    
    const engine = () => {
    frame();
    requestAnimationFrame(engine)
    };
    
    elSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.40);
    });
    
    // INIT!
    sectors.forEach(drawSector);
    rotate(); // Initial rotation
    engine(); // Start engine!
}

function update() {
    if (gameOver) {
        return;
    }
    else if (!gameOver && gameStop) {//winner
        // alert("Winner!");
        console.log("Winner!");
        lucky_wheel();
        gameOver = true;
    }    
    const dd = new Date();
    let current_time = dd.getTime();

    let remain_time = timeTotal - Math.round((current_time - start_time) / 1000);
    if (remain_time < 0) {
        if (snakeBody.length >= thresh){
            gameStop = true;
        }
        return;
    }
    
    document.getElementById('remain_time').innerHTML = remain_time;
    document.getElementById('score_food').innerHTML = snakeBody.length;
    context.fillStyle=board_color;
    context.fillRect(0, 0, board.width, board.height);
    
    // context.fillStyle="red";
    // context.fillRect(foodX, foodY, blockSize, blockSize);
    
    context.drawImage(food, foodX, foodY, food.width, food.height)

    // Condition satisfied to eat food
    let cond1 = (snakeX == foodX && snakeY == foodY);
    let cond2 = (snakeX == foodX && snakeY == foodY + blockSize);
    if (cond1 || cond2) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    // Draw body snake
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle= snake_color;
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        if (0 <= snakeBody[i][0] && snakeBody[i][0] < cols*blockSize){
            if (0 <= snakeBody[i][1] && snakeBody[i][1] < rows*blockSize){
                context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
            }
        }
    }

    // jump to another side
    if (snakeX < 0){
        snakeX = (cols - 1)*blockSize;
    }
    if (snakeX >= cols*blockSize){
        snakeX = 0;
    }
    if (snakeY < 0){
        snakeY = (rows-1)*blockSize;
    }
    if (snakeY >= rows*blockSize){
        snakeY = 0;
    }

    // console.log(snakeX);
    // console.log(snakeY);

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != speed) {
        velocityX = 0;
        velocityY = -speed;
    }
    else if (e.code == "ArrowDown" && velocityY != -speed) {
        velocityX = 0;
        velocityY = speed;
    }
    else if (e.code == "ArrowLeft" && velocityX != speed) {
        velocityX = -speed;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -speed) {
        velocityX = speed;
        velocityY = 0;
    }
}


function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * (rows - 1)) * blockSize;

    let food_on_body = false;
    for (let i = 0; i < snakeBody.length; i++){
        if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY){
            food_on_body = true; break;
        }
        if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY + blockSize){
            food_on_body = true; break;
        }
    }

    while (food_on_body){

        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * (rows - 1)) * blockSize;
        food_on_body = false;
        for (let i = 0; i < snakeBody.length; i++){
            if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY){
                food_on_body = true; break;
            }
            if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY + blockSize){
                food_on_body = true; break;
            }
        }
    }
}