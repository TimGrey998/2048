var board = new Array(); //4*4的格子
var score = 0; //得分
var hasConflicted = Array();

$(document).ready(function () {
    newgame();
});

function newgame() {
    //初始化棋盘格
    init();
    //随机在两个格子中生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++)
            board[i][j] = 0;
        hasConflicted[i][j] = false;
    }
    updateBoardView();

    score = 0;
}

//根据board变量的值来对前端的number-cell进行操作，对整体数据进行刷新
function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
            var theNumberCell = $("#number-cell-" + i + "-" + j);

            if (board[i][j] == 0) {
                theNumberCell.css("width", "0");
                theNumberCell.css("height", "0");
                theNumberCell.css("top", getPosTop(i, j) + 50);
                theNumberCell.css("left", getPosLeft(i, j) + 50);
            } else {
                theNumberCell.css("width", "100px");
                theNumberCell.css("height", "100px");
                theNumberCell.css("top", getPosTop(i, j));
                theNumberCell.css("left", getPosLeft(i, j));
                theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color", getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
}

function updateScore(score) {
    $('#score').text(score);
}

function generateOneNumber() {
    if (nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    while (true) {
        if (board[randx][randy] == 0)
            break;

        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机位置显示随机数字    
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

//基于玩家响应的游戏循环
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37: //left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        default: //default
            break;
    }
});

function isgameover() {
    if (nospace(board) && nomove(board))
        gameover();
}

function gameover() {

}

function moveLeft() {
    if (canMoveLeft(board)) {
        for (var i = 0; i < 4; i++)
            for (var j = 1; j < 4; j++) {
                if (board[i][j] != 0) {
                    //遍历左侧所有格子
                    for (var k = 0; k < j; k++) {
                        if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            //add score
                            score += board[i][k];
                            updateScore(score);
                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        setTimeout("updateBoardView()", 200);

        return true;
    } else {
        return false;
    }
}

function moveRight() {
    if (canMoveRight(board)) {
        for (var i = 0; i < 4; i++)
            for (var j = 2; j >= 0; j--) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > j; k--) {
                        if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                            //move  
                            showMoveAnimation(i, j, i, k);
                            //add
                            board[i][k] *= 2;
                            board[i][j] = 0;
                            //add score
                            score += board[i][k];
                            updateScore(score);
                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        setTimeout("updateBoardView()", 200);

        return true;
    } else {
        return false;
    }
}

function moveUp() {
    if (canMoveUp(board)) {
        for (var j = 0; j < 4; j++)
            for (var i = 1; i < 4; i++) {
                if (board[i][j] != 0) {
                    for (var k = 0; k < i; k++) {
                        if (board[k][j] == 0 && noBlockAlignment(j, k, i, board)) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[k][j] == board[i][j] && noBlockAlignment(j, k, i, board) && !hasConflicted[k][j]) {
                            //move  
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] *= 2;
                            board[i][j] = 0;
                            //add score
                            score += board[k][j];
                            updateScore(score);
                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        setTimeout("updateBoardView()", 200);

        return true;
    } else {
        return false;
    }
}

function moveDown() {
    if (canMoveDown(board)) {
        for (var j = 0; j < 4; j++)
            for (var i = 2; i >= 0; i--) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > i; k--) {
                        if (board[k][j] == 0 && noBlockAlignment(j, i, k, board)) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[k][j] == board[i][j] && noBlockAlignment(j, i, k, board) && !hasConflicted[k][j]) {
                            //move  
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] *= 2;
                            board[i][j] = 0;
                            //add score
                            score += board[k][j];
                            updateScore(score);
                            hasConflicted[k][j] = true;         
                            continue;
                        }
                    }
                }
            }
        setTimeout("updateBoardView()", 200);

        return true;
    } else {
        return false;
    }
}