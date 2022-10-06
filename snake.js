
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

const timeTotal = 30;
var start_time;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);
    const d = new Date();
    start_time = d.getTime();
    // update();
    setInterval(update, 200); //100 milliseconds
}

function update() {
    if (gameOver) {
        return;
    }
    
    const dd = new Date();
    let current_time = dd.getTime();

    document.getElementById('remain_time').innerHTML = timeTotal - Math.round((current_time - start_time) / 1000);
    document.getElementById('score_food').innerHTML = snakeBody.length;
    context.fillStyle="black";
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

    context.fillStyle="lime";
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
        snakeX = (cols-1)*blockSize;
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