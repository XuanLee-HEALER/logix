# Logix

手绘风格的交互式学习笔记，用涂鸦的方式理解抽象概念。

**在线访问**: [learn.vision-rs.com](https://learn.vision-rs.com)

## 主题

### 布尔运算图解

用韦恩图（集合）和手绘电路图（开关）两个视角理解布尔代数：

- **13 个分类**：常量运算、补运算、单位元、幂等律、交换/结合、分配律、吸收律、德摩根、共识定理、XOR/XNOR、对偶原理、化简技巧、化简实战
- **韦恩图**：SVG clipPath 实现精确的集合交/并/补运算可视化
- **电路图**：[roughjs](https://roughjs.com/) 绘制的手绘风格开关电路，直观展示布尔运算的物理意义
- **推导步骤**：逐步展示化简过程，标注每步使用的定律

## 技术栈

- **Runtime**: Bun
- **Framework**: React 19 + React Router v7 (SPA)
- **Styling**: Tailwind CSS v4
- **Build**: Vite 7
- **手绘风格**: roughjs + 自定义 wobbly CSS + Kalam/Patrick Hand 字体
- **部署**: Docker (nginx) + frp 内网穿透

## 开发

```bash
just install   # 安装依赖
just dev       # 启动开发服务器
just check     # 类型检查 + lint + 格式检查
just deploy    # 一键部署到生产环境
```

## License

MIT
