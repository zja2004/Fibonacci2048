class FibonacciGame {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('fibonacci-2048-best') || '0');
        this.gameWon = false;
        this.gameOver = false;
        
        // 斐波那契数列
        this.fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];
        
        this.initGrid();
        this.bindEvents();
        this.updateDisplay();
        this.addRandomTile();
        this.addRandomTile();
        this.updateTiles();
    }
    
    initGrid() {
        this.grid = [];
        for (let i = 0; i < 4; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 4; j++) {
                this.grid[i][j] = 0;
            }
        }
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 触摸事件
        this.setupTouchEvents();
        
        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            this.updateTiles();
        });
        
        // 按钮事件
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('try-again-btn').addEventListener('click', () => this.restart());
    }
    
    setupTouchEvents() {
        const gameContainer = document.querySelector('.game-container');
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: false });
        
        gameContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        gameContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.changedTouches.length === 0) return;
            
            const touch = e.changedTouches[0];
            endX = touch.clientX;
            endY = touch.clientY;
            
            this.handleSwipe(startX, startY, endX, endY);
        }, { passive: false });
    }
    
    handleSwipe(startX, startY, endX, endY) {
        if (this.gameOver) return;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 30; // 最小滑动距离
        
        // 判断是否为有效滑动
        if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
            return;
        }
        
        let moved = false;
        
        // 判断滑动方向
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 水平滑动
            if (deltaX > 0) {
                // 向右滑动
                moved = this.moveRight();
            } else {
                // 向左滑动
                moved = this.moveLeft();
            }
        } else {
            // 垂直滑动
            if (deltaY > 0) {
                // 向下滑动
                moved = this.moveDown();
            } else {
                // 向上滑动
                moved = this.moveUp();
            }
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateTiles();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                this.gameOver = true;
                this.showGameOverMessage();
            }
        }
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        let moved = false;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                e.preventDefault();
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                e.preventDefault();
                moved = this.moveRight();
                break;
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateTiles();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                this.gameOver = true;
                this.showGameOverMessage();
            }
        }
    }
    
    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(val => val !== 0);
            let merged = this.mergeRow(row);
            while (merged.length < 4) {
                merged.push(0);
            }
            
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] !== merged[j]) {
                    moved = true;
                }
                this.grid[i][j] = merged[j];
            }
        }
        return moved;
    }
    
    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(val => val !== 0);
            let merged = this.mergeRow(row.reverse()).reverse();
            while (merged.length < 4) {
                merged.unshift(0);
            }
            
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] !== merged[j]) {
                    moved = true;
                }
                this.grid[i][j] = merged[j];
            }
        }
        return moved;
    }
    
    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            
            let merged = this.mergeRow(column);
            while (merged.length < 4) {
                merged.push(0);
            }
            
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== merged[i]) {
                    moved = true;
                }
                this.grid[i][j] = merged[i];
            }
        }
        return moved;
    }
    
    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            
            let merged = this.mergeRow(column.reverse()).reverse();
            while (merged.length < 4) {
                merged.unshift(0);
            }
            
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== merged[i]) {
                    moved = true;
                }
                this.grid[i][j] = merged[i];
            }
        }
        return moved;
    }
    
    mergeRow(row) {
        let merged = [];
        let i = 0;
        
        while (i < row.length) {
            if (i < row.length - 1 && this.canMerge(row[i], row[i + 1])) {
                // 可以合并
                let newValue = this.getMergedValue(row[i], row[i + 1]);
                merged.push(newValue);
                this.score += newValue;
                i += 2; // 跳过两个已合并的数字
            } else {
                merged.push(row[i]);
                i++;
            }
        }
        
        return merged;
    }
    
    canMerge(a, b) {
        if (a === 0 || b === 0) return false;
        
        // 特殊情况：1 + 1 = 2
        if (a === 1 && b === 1) return true;
        
        // 检查是否为相邻的斐波那契数
        let indexA = this.fibonacci.indexOf(a);
        let indexB = this.fibonacci.indexOf(b);
        
        if (indexA === -1 || indexB === -1) return false;
        
        // 相邻的斐波那契数可以合并
        return Math.abs(indexA - indexB) === 1;
    }
    
    getMergedValue(a, b) {
        // 特殊情况：1 + 1 = 2
        if (a === 1 && b === 1) return 2;
        
        let indexA = this.fibonacci.indexOf(a);
        let indexB = this.fibonacci.indexOf(b);
        
        // 返回较大的下一个斐波那契数
        let maxIndex = Math.max(indexA, indexB);
        return this.fibonacci[maxIndex + 1] || this.fibonacci[maxIndex];
    }
    
    addRandomTile() {
        let emptyCells = [];
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% 概率生成1，10% 概率生成2
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 1 : 2;
        }
    }
    
    updateTiles() {
        const container = document.getElementById('tile-container');
        container.innerHTML = '';
        
        // 根据屏幕宽度动态计算方块间距
        const getTileSize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 400) {
                return { size: 60, gap: 10 }; // 小屏幕
            } else if (screenWidth <= 600) {
                return { size: 70, gap: 10 }; // 中等屏幕
            } else {
                return { size: 100, gap: 10 }; // 大屏幕
            }
        };
        
        const { size, gap } = getTileSize();
        // 间距应该等于方块尺寸加上间隙，与CSS网格保持一致
        const spacing = size + gap;
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]} tile-new`;
                    tile.textContent = this.grid[i][j];
                    // 计算位置时需要考虑网格间距
                    tile.style.left = `${j * (size + gap)}px`;
                    tile.style.top = `${i * (size + gap)}px`;
                    container.appendChild(tile);
                }
            }
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('fibonacci-2048-best', this.bestScore.toString());
        }
        
        document.getElementById('best-score').textContent = this.bestScore;
    }
    
    isGameOver() {
        // 检查是否有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // 检查是否可以合并
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let current = this.grid[i][j];
                
                // 检查右边
                if (j < 3 && this.canMerge(current, this.grid[i][j + 1])) {
                    return false;
                }
                
                // 检查下面
                if (i < 3 && this.canMerge(current, this.grid[i + 1][j])) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    showGameOverMessage() {
        const messageElement = document.getElementById('game-message');
        const titleElement = document.getElementById('message-title');
        const textElement = document.getElementById('message-text');
        
        titleElement.textContent = '游戏结束！';
        textElement.textContent = `最终分数：${this.score}`;
        messageElement.style.display = 'flex';
    }
    
    restart() {
        this.score = 0;
        this.gameWon = false;
        this.gameOver = false;
        
        document.getElementById('game-message').style.display = 'none';
        
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.updateTiles();
        this.updateDisplay();
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new FibonacciGame();
});