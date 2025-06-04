# 斐波那契2048游戏

这是一个基于HTML/CSS/JavaScript的斐波那契版本2048游戏。与传统2048不同，这个游戏使用斐波那契数列作为合并规则。

## 游戏规则

- 使用方向键（↑↓←→）移动方块
- 相邻的斐波那契数字可以合并成下一个更大的斐波那契数字
- 合并规则：1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13...
- 目标是创造出尽可能大的斐波那契数字
- 当网格填满且无法合并时游戏结束

## 斐波那契数列

游戏中使用的斐波那契数列：
1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765...

## 文件结构

```
new2048/
├── index.html      # 主HTML文件
├── style.css       # 样式文件
├── script.js       # 游戏逻辑
└── README.md       # 说明文档
```

## 本地运行

1. 确保所有文件在同一目录下
2. 使用任意HTTP服务器运行，例如：

   ```bash

   # 使用Python
   python -m http.server 8000
   
   # 使用Node.js
   npx serve .
   
   # 使用PHP
   php -S localhost:8000
   ``
3. 在浏览器中访问 `http://localhost:8000`

## 部署到网页

### 方法1：静态网站托管

1. **GitHub Pages**：
   - 将代码上传到GitHub仓库
   - 在仓库设置中启用GitHub Pages
   - 访问 `https://yourusername.github.io/repository-name`

2. **Netlify**：
   - 将文件夹拖拽到 [Netlify Drop](https://app.netlify.com/drop)
   - 或连接GitHub仓库自动部署

3. **Vercel**：
   - 使用Vercel CLI或网页界面部署
   - 支持GitHub集成

### 方法2：传统Web服务器

1. 将所有文件上传到你的Web服务器的public_html或www目录
2. 确保文件权限正确（通常644）
3. 通过你的域名访问

### 方法3：CDN部署

可以将文件上传到任何支持静态文件的CDN服务，如：
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage

## 特性

- 🎮 完整的游戏逻辑实现
- 🎨 美观的渐变背景和动画效果
- 📱 响应式设计，支持移动设备
- 💾 本地存储最高分记录
- 🔄 重新开始功能
- 🎯 游戏结束检测

## 技术栈

- HTML5
- CSS3（Grid布局、动画、渐变）
- 原生JavaScript（ES6+）
- LocalStorage API

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 许可证

本项目采用MIT许可证，可自由使用和修改。