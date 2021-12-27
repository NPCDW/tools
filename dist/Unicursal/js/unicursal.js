var unicursal = function () {
    // 步骤计数
    this.count = 1;
    this.path = null;
    this.success = false;

    this.matrix = null;
    this.x = null;
    this.y = null;
};

unicursal.prototype.run = function () {
    this.path = this.copyArr(this.matrix);
    this.pathfind(this.x, this.y, this.path)
}

unicursal.prototype.copyArr = function (obj) {
    var out = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        if (obj[i] instanceof Array) {
            out[i] = this.copyArr(obj[i]);
        } else {
            out[i] = obj[i];
        }
    }
    return out;
}

/**
 * 寻路 每走一步都会有三个方向可以走，如果无路可走，遍历一下是否还有未走的格子
 * 如果没有，则寻路成功，打印出路径，如果有，则退一步，走其他方向
 * 
 * @param x 起始位置第几行
 * @param y 起始位置第几列
 * @param matrix 棋盘数组（0代表可以走的路，-1代表障碍，1,2,3....代表路径）
 */
unicursal.prototype.pathfind = function (x, y, matrix) {
    matrix[x][y] = this.count++;
    // 如果下一步没有超出y的最大边界，并且下一步可以走
    if (y + 1 < matrix[x].length && matrix[x][y + 1] == 0) {
        this.pathfind(x, y + 1, matrix);
        if (this.success) {
            return
        }
    }
    // 如果下一步没有超出y的最小边界，并且下一步可以走
    if (y - 1 >= 0 && matrix[x][y - 1] == 0) {
        this.pathfind(x, y - 1, matrix);
        if (this.success) {
            return
        }
    }
    // 如果下一步没有超出x的最大边界，并且下一步可以走
    if (x + 1 < matrix.length && matrix[x + 1][y] == 0) {
        this.pathfind(x + 1, y, matrix);
        if (this.success) {
            return
        }
    }
    // 如果下一步没有超出x的最小边界，并且下一步可以走
    if (x - 1 >= 0 && matrix[x - 1][y] == 0) {
        this.pathfind(x - 1, y, matrix);
        if (this.success) {
            return
        }
    }

    // 走到此，说明已经无路可走，遍历一下是否还有未走的格子
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            // 如果有未走的格子，说明寻路失败，退一步继续寻路
            if (matrix[i][j] == 0) {
                matrix[x][y] = 0;
                this.count--;
                return;
            }
        }
    }

    this.success = true;
}
this.unicursal = unicursal;