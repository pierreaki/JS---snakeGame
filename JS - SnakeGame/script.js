window.onload = function(){
    var canvas;
    var canvasWidth = 900;
    var canvasheight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100; //Temps exprimé en millisecondes
    var snakee;
    var pomme;
    var witdthInBlock = canvasWidth/blockSize;
    var heightInBlock = canvasheight/blockSize;
    var score;
    var timeout;
    
    init(); //Execute la fonction en question
    
    
    function init(){//Fonction pour initialiser
        canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasheight;
        canvas.style.border = "30px solid grey";
        canvas.style.backgroundColor = "#ddd";
        canvas.style.margin = "5Opx auto";
        canvas.style.display = "block";
        document.body.appendChild(canvas); //permet de créer le tag canvas dans le tag body de l'html
        ctx = canvas.getContext("2d"); //Pour pouvoir dessiner dans le canvas il faut créer un context
        snakee = new snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        pomme = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }
    
    function refreshCanvas(){
        snakee.advance();
        if(snakee.checkCollision()){
                gameOver();
            }
        else{
                if(snakee.isEatingApple(pomme)){
                        score++;
                        snakee.ateApple = true;
                        do{
                            pomme.setNewPosition();
                        }
                        while(pomme.isOnSnake(snakee))
                    }
                ctx.clearRect(0, 0, canvasWidth, canvasheight);
                drawScore();
                snakee.draw();
                pomme.draw();
                timeout = setTimeout(refreshCanvas, delay);
            }
    }
    
    
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasheight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }
    
    function restart(){
        snakee = new snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        pomme = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "grey";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasheight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }
        
        
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    
    function snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length/* tant que...*/; i++/*Alors...*/){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore(); 
        };
        
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case"down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                    default:
                        throw("Invalid direction");
                }
            this.body.unshift(nextPosition);
            if(!this.ateApple){
                    this.body.pop();
                }
            else{
                    this.ateApple = false;
                }
        };
        
        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction){
                    case "left":
                    case "right":
                        allowedDirections = ["up", "down"];
                        break;
                    case"down":
                    case "up":
                        allowedDirections = ["left", "right"];
                        break; 
                    default:
                        throw("Invalid direction");
                }
            if(allowedDirections.indexOf(newDirection) > -1){
                    this.direction = newDirection;
                }
        };
        
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = witdthInBlock - 1;
            var maxY = heightInBlock - 1;
            var isNotBetweenHorizontaleWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticaleWalls = snakeY < minY || snakeY > maxY;
            
            if(isNotBetweenHorizontaleWalls || isNotBetweenVerticaleWalls){
                    wallCollision = true;
                }
            
            for(var i=0; i<rest.length;i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }          
            }
            
            return wallCollision || snakeCollision;
        };
        
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                    return true;
                }
            else{
                    return false;
                }
        };
    }
    
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (witdthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            
            for(i = 0; i < snakeToCheck.body.length; i++){
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                            isOnSnake = true;
                        }
                }
            return isOnSnake;
        };
    }
    
    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
                case 37:
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break;
                case 40:
                    newDirection = "down";
                    break;
                case 32:
                    restart();
                    return;
                default:
                    return;      
            }
            snakee.setDirection(newDirection);
    }
}

    