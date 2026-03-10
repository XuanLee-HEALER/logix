# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Logix 是一个纯前端 SPA 项目，按学习主题分类展示不同的学习内容。

- **Runtime**: Bun
- **Framework**: React 19 + React Router v7
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Build**: Vite 7
- **Language**: TypeScript ESNext (strict mode)
- **Task Runner**: just (justfile)
- **Icons**: lucide-react (strokeWidth={2.5})

## Commands

使用 `just` 作为 task runner，`just` 列出所有可用 recipes。

```bash
just install         # 安装依赖
just dev             # 开发服务器
just build           # 类型检查 + 构建
just typecheck       # 仅类型检查
just lint            # ESLint 全部文件
just lint-file <path>  # ESLint 单个文件
just format          # Prettier 格式化
just format-check    # 检查格式（不写入）
just check           # 运行所有检查（typecheck + lint + format-check）
just clean           # 清理构建产物
just new-topic <id>  # 创建新主题脚手架
```

## TypeScript & Lint 规范

- strict mode + `noUnusedLocals` + `noUnusedParameters` 均已开启
- ESLint: `@typescript-eslint/no-explicit-any: error`, `no-unused-vars: error`（`_` 前缀参数除外）
- Prettier: double quotes, trailing commas, 2-space indent, 80 char width
- 路径别名 `@/*` → `src/*`（tsconfig paths + vite alias）
- 优先使用 `interface` 而非 `type`（除非需要 union/intersection）
- React 组件使用函数式组件 + hooks，禁止 class 组件

## 文件组织

```
src/
├── components/    # 通用 UI 组件（Button, Card, Input, Layout）
├── pages/         # 页面级组件（按路由对应）
├── topics/        # 学习主题模块，每个主题一个目录
├── hooks/         # 自定义 hooks
├── utils/         # 工具函数
├── types/         # 共享类型定义
├── styles/        # 全局样式与 Tailwind 主题
├── router.tsx     # 集中路由配置
├── App.tsx        # 根组件
└── main.tsx       # 入口
```

## 命名约定

- 组件文件：PascalCase（`TopicCard.tsx`），named export（页面组件用 default export）
- 工具/hooks 文件：camelCase（`useTopicData.ts`）
- 类型文件：camelCase（`topic.ts`）

## Design System: Hand-Drawn 风格

项目使用手绘风格设计系统，核心要素定义在 `src/styles/index.css` 的 `@theme` 块中：

### 色彩

- `paper` (#fdfbf7), `pencil` (#2d2d2d), `erased` (#e5e0d8)
- `marker-red` (#ff4d4d), `pen-blue` (#2d5da1), `postit` (#fff9c4)

### 字体

- 标题: Kalam (font-heading), 正文: Patrick Hand (font-body)

### 关键 CSS 类

- `.wobbly` / `.wobbly-md` / `.wobbly-sm` / `.wobbly-alt` — 不规则圆角，**禁止对主要元素使用标准 `rounded-*`**
- `.animate-gentle-bounce` — 装饰性弹跳动画

### 阴影 (无模糊，纯偏移)

- `shadow-sketch` (4px), `shadow-sketch-lg` (8px), `shadow-sketch-sm` (2px), `shadow-sketch-subtle`

### 设计原则

- 边框 `border-2` 起步，强调元素用 `border-[3px]`
- 元素微旋转 (`rotate-1`, `-rotate-2`) 打破网格
- hover 时 "jiggle" 效果 + shadow 变化模拟按压
- Card 支持 `decoration="tape"|"tack"` 装饰
- 虚线边框用于分隔线和次要元素

## 开发规范

- 路由配置集中在 `src/router.tsx`
- 状态管理使用 React 内置 hooks，不引入额外状态库
- 新增学习主题：在 `src/topics/<topicId>/` 下创建目录，包含该主题的页面、组件和数据
