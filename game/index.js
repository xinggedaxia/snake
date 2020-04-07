const mySnake = new Snake($("#app"), 80);
alert("按空格开始/暂停游戏");
$(document).keydown(function (event) {
    if (event.keyCode === 32) {
        if (mySnake.status === 0) {
            alert("开始游戏")
            mySnake.beginGame();
        } else if (mySnake.status === 1) {
            alert("游戏暂停！")
            mySnake.pauseGame();
        } else {
            alert("游戏继续！")
            mySnake.continueGame();
        }
    }
    if (mySnake.status === 0) {
        return;
    }
    if (event.keyCode === 37) {//左
        mySnake.changeDirection(4);
    } else if (event.keyCode === 38) {//上
        mySnake.changeDirection(1);
    } else if (event.keyCode === 39) {//右
        mySnake.changeDirection(2);
    } else if (event.keyCode === 40) {//下
        mySnake.changeDirection(3);
    }
});
