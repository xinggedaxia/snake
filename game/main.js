class Snake {
    constructor(container, size) {
        this.container = container;//渲染的容器
        this.size = size || 40;//蛇的大小
        this.bodyData = [
            [this.size * 3, 0],
            [this.size * 2, 0],
            [this.size * 1, 0],
            [0, 0],
        ];
        this.lastBodyData = [
            [this.size * 3, 0],
            [this.size * 2, 0],
            [this.size * 1, 0],
            [0, 0],
        ];//存储上一次位置
        this.bodyNode = [];
        this.bodyText = [0, 1, 2, 3]
        this.direction = 2;
        this.shouldUpdateDirection = [];//标识是否应该更新运动方向
        this.speed = 2;
        this.counter = 0;
        this.timer = null;
        this.status = 0;//运行状态 0 未运行，1 运行中
        this.food = [this.size * 5, this.size * 5];
        this.createSnake(this.container);
    }

    // 开始游戏
    beginGame() {
        this.status = 1;
        this.timer = setInterval(() => {
            if (this.counter === parseInt(100 / this.speed)) {
                this.move();
                this.counter = 0;
            }
            this.counter++;
        }, 10);
    }

    // 暂停游戏
    pauseGame() {
        this.status = 0;
        clearInterval(this.timer);
        this.timer = null;
    }

    // 继续游戏
    continueGame() {
        this.beginGame();
    }

    createSnake(container) {
        this.bodyNode = this.bodyData.map((item, index) => {
            const node = $(`<span class="snakeNode" style="width:${this.size + "px"};height:${this.size + "px"};line-height:${this.size + "px"}">${this.bodyText[index]}</span>`);
            if (index === 0) {
                node.addClass("snakeHead")
            }
            node.css({
                left: item[0] + "px",
                top: item[1] + "px",
            });
            container.append(node);
            return node;
        });
        this.createFood();
        const x = document.body.clientWidth;
        const y = document.body.clientHeight;
        const XNumber = parseInt(x / this.size);
        const YNumber = parseInt(y / this.size);
        const total = XNumber * YNumber;
        for (let i = 1, len = total; i <= len; i++) {
            const grid = $(`<span class="grid" style="width:${this.size + "px"};height:${this.size + "px"};line-height:${this.size + "px"}"></span>`);
            container.append(grid);
        }
    }

    /*
    移动上1   右2   下3   左4
    */
    move() {
        //直接赋值会导致值会在后面变化  //引用类型
        const bodyData = this.bodyData.map((item) => {
            return [...item]
        });
        let lastBodyPosition = [];//最后一个节点的位置
        for (let i = this.bodyData.length - 1; i >= 0; i--) {
            if (i === 0) {//头部移动
                switch (this.direction) {
                    case 1: {//上
                        this.bodyData[i][1] -= this.size;
                        break;
                    }
                    case 2: {//右
                        this.bodyData[i][0] += this.size;
                        break;
                    }
                    case 3: {//下
                        this.bodyData[i][1] += this.size;
                        break;
                    }
                    case 4: {//左
                        this.bodyData[i][0] -= this.size;
                        break;
                    }
                }
                if (this.checkPosition(lastBodyPosition)) {
                    this.lastBodyData = this.bodyData.map((item) => {
                        return [...item]
                    });//最新的实际位置
                }
            } else {//身体移动
                if (i === this.bodyData.length - 1) {
                    lastBodyPosition = lastBodyPosition.concat([...this.bodyData[i]]);
                }
                this.bodyData[i] = [...this.bodyData[i - 1]];
            }
            this.bodyNode[i].animate({
                left: this.bodyData[i][0] + "px",
                top: this.bodyData[i][1] + "px",
            }, parseInt(900 / this.speed), () => {
                if (i === 0) {
                    //判断方向是否发生改变
                    if (this.shouldUpdateDirection.length !== 0) {
                        this.direction = this.shouldUpdateDirection[0];
                        this.shouldUpdateDirection = this.shouldUpdateDirection.slice(1);
                    }
                }
            })
        }
    }

    //改变运动方向
    changeDirection(direction) {
        let currentDirection = 0;
        if (this.shouldUpdateDirection.length > 0) {
            currentDirection = this.shouldUpdateDirection[this.shouldUpdateDirection.length]
        } else {
            currentDirection = this.direction;
        }
        if (currentDirection + direction === 4 || currentDirection + direction === 6 || currentDirection === direction) {
            console.log("不允许反向,同向移动");
            return;
        }
        this.shouldUpdateDirection.push(direction);//应该等动画执行完再更改

    }

    checkPosition(lastBodyPosition) {
        const x = document.body.clientWidth;
        const y = document.body.clientHeight;
        const currentX = this.bodyData[0][0];
        const currentY = this.bodyData[0][1];
        const foodX = this.food[0];
        const foodY = this.food[1];
        // 是否碰到食物
        if (currentX === foodX && currentY === foodY) {
            this.bodyData.push(lastBodyPosition);
            const node = $(`<span class="snakeNode" style="width:${this.size + "px"};height:${this.size + "px"};line-height:${this.size + "px"}">${this.bodyText[this.bodyData.length - 1] || this.bodyData.length - 1}</span>`);
            node.css({
                left: lastBodyPosition[0] + "px",
                top: lastBodyPosition[1] + "px",
            });
            this.bodyNode.push(node);
            this.container.append(node);
            this.createFood();
        }
        //是否与自身发生碰撞

        const flag = this.lastBodyData.some((item) => {
            return currentX === item[0] && currentY === item[1];
        })
        //是否与墙壁发生碰撞
        if (currentX < 0 || currentX + this.size > x || currentY < 0 || currentY + this.size > y || flag) {
            alert("游戏结束");
            this.reset();
            return false;
        }
        return true;
    }

    reset() {
        clearInterval(this.timer);
        this.container.html("");
        this.bodyData = [
            [this.size * 3, 0],
            [this.size * 2, 0],
            [this.size * 1, 0],
            [0, 0],
        ];
        this.createSnake(this.container);
        this.direction = 2;
        this.speed = 2;
        this.timer = null;
        this.status = 0;
    }

    randomNumber(x, y) {
        const food = [
            Math.floor(Math.random() * x) * this.size,
            Math.floor(Math.random() * y) * this.size
        ]
        const flag = this.bodyData.some((item) => {
            return item[0] === food[0] && item[1] === food[1];
        })
        if (flag) {
            return this.randomNumber(x, y);
        }
        return food;
    }

    createFood() {
        const x = document.body.clientWidth;
        const y = document.body.clientHeight;
        const XNumber = parseInt(x / this.size);
        const YNumber = parseInt(y / this.size);
        if (this.bodyData.length === XNumber * YNumber) {
            alert("恭喜通关");
            this.reset();
            return;
        }
        this.food = this.randomNumber(XNumber, YNumber);
        const food = $(`<span class="food" style="width:${this.size + "px"};height:${this.size + "px"};line-height:${this.size + "px"}"></span>`);
        food.css({
            left: this.food[0] + "px",
            top: this.food[1] + "px",
        });
        $(".food").remove();
        this.container.append(food);
        this.speed = this.speed + 0.2;
    }
}
