var width = 15;
var height = 15;
var incrementOnEat = 4;
var snake = null;
var direction = null;
var food = null;
var eaten = 0;
var score;
var directions = new Map();

function init()
{
    directions.set("down", [0, 1]);
    directions.set("up", [0, -1]);
    directions.set("right", [1, 0]);
    directions.set("left", [-1, 0]);
    var dirs = ["right", "left", "down", "up"];

    snake = [[Math.floor(Math.random() * width), Math.floor(Math.random() * height)]];
    direction = dirs[Math.floor(Math.random() * 4)];
    while(!validMove())
        direction = dirs[Math.floor(Math.random() * 4)];
    snake.push(nextHeadPosition());
    direction = dirs[Math.floor(Math.random() * 4)];
    while(!validMove())
        direction = dirs[Math.floor(Math.random() * 4)];

    food = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    while(!validMove(food))
        food = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];

    score = 0;
    drawTable();
}

function nextMove()
{
    if(!validMove())
    {
        gameOver();
        return;
    }
    newHead = nextHeadPosition();
    if(newHead[0] == food[0] && newHead[1] == food[1])
    {
        eaten += incrementOnEat;
        score++;
        food = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
        while(!validMove(food))
            food = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    }
    snake.unshift(newHead)
    if(eaten == 0)
        snake.pop();
    else
        eaten--;
}

function gameOver()
{
    // TODO: stop the game, check the score, etc.
    alert("game over!")
}

function nextHeadPosition()
{
    if(!directions.has(direction))
    {
        console.log("no direction for " + direction);
    }
    return [snake[0][0] + directions.get(direction)[0], snake[0][1] + directions.get(direction)[1]];
}


function validMove(point = null)
{
    if(point == null)
        point = nextHeadPosition();
    if(point[0] < 0 || point[0] >= width)
        return false;
    if(point[1] < 0 || point[1] >= height)
        return false;

    for(var i = 0; i < snake.length; i++)
        if(point[0] == snake[i][0] && point[1] == snake[i][1])
            return false;

    return true;
}

function drawTable()
{
    emptyCell = "<td class='gray cell'></td>";
    snakeCell = "<td class='black cell'></td>";
    foodCell = "<td class='red cell'></td>";

    if(snake == null)
        return "No game!"

    var table = "<table>";
    for(var j = 0; j < height; j++)
    {
        var row = [];
        table += "</tr>"
        for(var i = 0; i < width; i++)
            if(food[0] == i && food[1] == j)
                table += foodCell;
            else if (validMove([i, j]))
                table += emptyCell;
            else
                table += snakeCell;
        table += "</tr>"
    }
    table += "</table>"
    output = document.getElementById('output');
    output.innerHTML = table + '<br> Score: ' + score;
}