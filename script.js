class FibonacciGame {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('fibonacci-2048-best') || '0');
        this.gameWon = false;
        this.gameOver = false;
        
        // 斐波那契数列
        this.fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];
        
        // 初始化皮肤
        this.initTheme();
        
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
        document.getElementById('theme-btn').addEventListener('click', () => this.toggleTheme());
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
            
            // 获取当前网格中的最大数字
            let maxValue = 0;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] > maxValue) {
                        maxValue = this.grid[i][j];
                    }
                }
            }
            
            // 根据最大数字动态调整生成数字的概率分布
            let probabilities = [];
            
            if (maxValue < 55) {
                // 最大值小于55：只生成1
                probabilities = [{value: 1, prob: 1.0}];
            } else if (maxValue >= 55 && maxValue < 89) {
                // 最大值为55：80%生成1，20%生成2
                probabilities = [
                    {value: 1, prob: 0.8},
                    {value: 2, prob: 0.2}
                ];
            } else if (maxValue >= 89 && maxValue < 144) {
                // 最大值为89：40%生成1，40%生成2，20%生成3
                probabilities = [
                    {value: 1, prob: 0.4},
                    {value: 2, prob: 0.4},
                    {value: 3, prob: 0.2}
                ];
            } else if (maxValue >= 144 && maxValue < 233) {
                // 最大值为144：1、2、3、5各25%
                probabilities = [
                    {value: 1, prob: 0.25},
                    {value: 2, prob: 0.25},
                    {value: 3, prob: 0.25},
                    {value: 5, prob: 0.25}
                ];
            } else if (maxValue >= 233 && maxValue < 377) {
                // 最大值为233：1的概率40%，2、3、5、8各15%
                probabilities = [
                    {value: 1, prob: 0.4},
                    {value: 2, prob: 0.15},
                    {value: 3, prob: 0.15},
                    {value: 5, prob: 0.15},
                    {value: 8, prob: 0.15}
                ];
            } else if (maxValue >= 377 && maxValue < 610) {
                // 最大值为377：1的概率40%，2、3、5、8、13、21各10%
                probabilities = [
                    {value: 1, prob: 0.4},
                    {value: 2, prob: 0.1},
                    {value: 3, prob: 0.1},
                    {value: 5, prob: 0.1},
                    {value: 8, prob: 0.1},
                    {value: 13, prob: 0.1},
                    {value: 21, prob: 0.1}
                ];
            } else {
                // 最大值为610或更大：1的概率30%，2、3、5、8、13、21、34各10%
                probabilities = [
                    {value: 1, prob: 0.3},
                    {value: 2, prob: 0.1},
                    {value: 3, prob: 0.1},
                    {value: 5, prob: 0.1},
                    {value: 8, prob: 0.1},
                    {value: 13, prob: 0.1},
                    {value: 21, prob: 0.1},
                    {value: 34, prob: 0.1}
                ];
            }
            
            // 根据概率分布选择数字
            let random = Math.random();
            let cumulative = 0;
            let value = 1;
            
            for (let i = 0; i < probabilities.length; i++) {
                cumulative += probabilities[i].prob;
                if (random <= cumulative) {
                    value = probabilities[i].value;
                    break;
                }
            }
            this.grid[randomCell.x][randomCell.y] = value;
        }
    }
    
    updateTiles() {
        // 获取方块容器并清空所有现有方块
        const container = document.getElementById('tile-container');
        container.innerHTML = '';
        
        /**
         * 动态计算方块尺寸和间距的核心函数
         * 这个函数解决了以下问题：
         * 1. 不同屏幕尺寸需要不同的方块大小
         * 2. 横屏和竖屏需要不同的处理策略
         * 3. 浏览器缩放会影响JavaScript获取的屏幕尺寸
         */
        const getTileConfig = () => {
            // === 缩放检测部分 ===
            // devicePixelRatio: 设备像素比，用于高分辨率屏幕
            const devicePixelRatio = window.devicePixelRatio || 1;
            
            // zoomLevel: 浏览器缩放比例
            // 原理：outerWidth是浏览器窗口的实际宽度，innerWidth是视口宽度
            // 当用户缩放时，innerWidth会变化，但outerWidth相对稳定
            // 比如：100%缩放时 outerWidth/innerWidth ≈ 1
            //      150%缩放时 outerWidth/innerWidth ≈ 1.5
            const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100) / 100;
            
            // === 实际屏幕尺寸计算 ===
            // actualScreenWidth: 考虑缩放后的真实屏幕宽度
            // 这样可以确保无论用户如何缩放，都能正确判断屏幕尺寸类型
            const actualScreenWidth = window.innerWidth * zoomLevel;
            const screenHeight = window.innerHeight;
            
            // === 屏幕方向检测 ===
            // isPortrait: 判断是否为竖屏模式
            // 竖屏时可用水平空间更少，需要使用更小的方块
            const isPortrait = screenHeight > window.innerWidth;
            
            // === 尺寸选择逻辑 ===
            // 这里的断点值需要与CSS媒体查询保持一致
            // CSS中设置了对应的gap值：
            // - 400px以下或竖屏500px以下：gap: 6px
            // - 600px以下或竖屏700px以下：gap: 8px  
            // - 其他情况：gap: 10px
            
            if (actualScreenWidth <= 400 || (isPortrait && actualScreenWidth <= 500)) {
                // 小屏幕：60px方块 + 6px间距
                // 适用于小手机或竖屏模式
                return { size: 60, gap: 6 };
            } else if (actualScreenWidth <= 600 || (isPortrait && actualScreenWidth <= 700)) {
                // 中等屏幕：70px方块 + 8px间距
                // 适用于大手机或小平板
                return { size: 70, gap: 8 };
            } else {
                // 大屏幕：100px方块 + 10px间距
                // 适用于桌面或大平板
                return { size: 100, gap: 10 };
            }
        };
        
        // 获取当前应该使用的方块尺寸和间距
        const { size, gap } = getTileConfig();
        
        // === 方块渲染循环 ===
        // 遍历4x4网格，为每个非零位置创建方块
        for (let i = 0; i < 4; i++) {        // i: 行索引 (0-3)
            for (let j = 0; j < 4; j++) {    // j: 列索引 (0-3)
                if (this.grid[i][j] !== 0) {
                    // 创建方块DOM元素
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]} tile-new`;
                    tile.textContent = this.grid[i][j];
                    
                    // === 位置计算公式 ===
                    // 这是整个对齐逻辑的核心！
                    // 
                    // 水平位置 = 列索引 × (方块尺寸 + 间距)
                    // 垂直位置 = 行索引 × (方块尺寸 + 间距)
                    // 
                    // 例如：第2行第3列的方块 (i=1, j=2)
                    // 如果size=70, gap=8，则：
                    // left = 2 × (70 + 8) = 156px
                    // top = 1 × (70 + 8) = 78px
                    // 
                    // 这个公式必须与CSS网格的渲染逻辑完全一致！
                    // CSS使用grid-gap来控制间距，我们的计算必须匹配
                    
                    tile.style.left = `${j * (size + gap)}px`;   // 水平位置
                    tile.style.top = `${i * (size + gap)}px`;    // 垂直位置
                    
                    // 将方块添加到容器中
                    container.appendChild(tile);
                }
            }
        }
        
        // === 调试信息 ===
        // 如果对齐仍有问题，可以取消注释下面的代码来调试
         console.log('Screen info:', {
             innerWidth: window.innerWidth,
             outerWidth: window.outerWidth,
             zoomLevel: (window.outerWidth / window.innerWidth),
             actualWidth: window.innerWidth * (window.outerWidth / window.innerWidth),
             selectedSize: size,
             selectedGap: gap
         });
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
    
    // 初始化皮肤
    initTheme() {
        const savedTheme = localStorage.getItem('fibonacci-2048-theme') || 'original';
        this.currentTheme = savedTheme;
        this.applyTheme(savedTheme);
    }
    
    // 切换皮肤
    toggleTheme() {
        const newTheme = this.currentTheme === 'original' ? 'candy' : 'original';
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
        localStorage.setItem('fibonacci-2048-theme', newTheme);
    }
    
    // 应用皮肤
    applyTheme(theme) {
        const body = document.body;
        const themeBtn = document.getElementById('theme-btn');
        const themeText = themeBtn.querySelector('.theme-text');
        
        if (theme === 'candy') {
            body.classList.add('candy-theme');
            themeText.textContent = '原始';
        } else {
            body.classList.remove('candy-theme');
            themeText.textContent = '糖果色';
        }
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new FibonacciGame();
});