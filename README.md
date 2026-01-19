# 智能待办事项应用 📝

> 一个基于 React + TypeScript + Vite 构建的现代化待办事项管理应用

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.15-38bdf8.svg)](https://tailwindcss.com/)

## ✨ 功能特性

- ✅ **完整的 CRUD 操作** - 创建、读取、更新、删除任务
- 🔍 **智能搜索** - 实时搜索任务标题和描述
- 🎯 **多维度筛选** - 按状态、优先级、分类筛选
- 📊 **数据统计** - 实时显示任务完成率和统计信息
- 💾 **本地持久化** - 使用 LocalStorage 自动保存数据
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **现代化 UI** - 简洁美观的界面设计
- ⚡ **流畅动画** - 平滑的过渡和交互效果
- 🔒 **类型安全** - 严格的 TypeScript 类型检查

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装

```bash
# 克隆项目（如果从 Git 仓库）
git clone <repository-url>

# 进入项目目录
cd todo-app

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 项目将在 http://localhost:3000 启动
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码检查

```bash
# 运行 ESLint
npm run lint
```

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [React](https://reactjs.org/) | 18.3.1 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.6.3 | 类型安全 |
| [Vite](https://vitejs.dev/) | 5.4.11 | 构建工具 |
| [Zustand](https://github.com/pmndrs/zustand) | 4.5.0 | 状态管理 |
| [TailwindCSS](https://tailwindcss.com/) | 3.4.15 | 样式框架 |
| [date-fns](https://date-fns.org/) | 3.3.1 | 日期处理 |
| [Lucide React](https://lucide.dev/) | 0.344.0 | 图标库 |
| [uuid](https://github.com/uuidjs/uuid) | 9.0.1 | ID 生成 |

## 📁 项目结构

```
todo-app/
├── .vscode/              # VSCode 配置
├── public/               # 静态资源
│   └── vite.svg
├── src/
│   ├── components/       # React 组件
│   │   └── index.ts
│   ├── hooks/            # 自定义 Hooks
│   │   └── index.ts
│   ├── store/            # Zustand 状态管理
│   │   └── useTodoStore.ts
│   ├── types/            # TypeScript 类型定义
│   │   └── todo.ts
│   ├── utils/            # 工具函数
│   │   ├── cn.ts         # 类名合并
│   │   ├── constants.ts  # 常量配置
│   │   └── date.ts       # 日期处理
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── .gitignore
├── .npmrc
├── eslint.config.js      # ESLint 配置
├── index.html            # HTML 模板
├── package.json          # 项目依赖
├── postcss.config.js     # PostCSS 配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
├── vercel.json           # Vercel 部署配置
└── vite.config.ts        # Vite 配置
```

## 📚 文档

- [快速启动指南](./QUICKSTART.md) - 详细的启动步骤
- [安装说明](./SETUP.md) - 完整的安装指南
- [部署指南](./DEPLOYMENT.md) - Vercel 部署步骤
- [依赖更新](./DEPENDENCIES_UPDATE.md) - 依赖版本说明
- [项目总结](./PROJECT_SUMMARY.md) - 项目完整概览

## 🚢 部署

### 部署到 Vercel（推荐）

#### 方式一：通过 GitHub

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测配置并部署

#### 方式二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### 方式三：使用部署脚本

```bash
# Windows PowerShell
.\deploy.ps1
```

### 部署优化

本项目已针对 Vercel 进行优化：

- ✅ 代码分割（React、Zustand、工具库分离）
- ✅ 静态资源缓存（1年）
- ✅ esbuild 压缩
- ✅ Tree Shaking
- ✅ 无弃用警告

## 🎨 设计系统

### 颜色方案

- **主色调**: Primary Blue (#3b82f6)
- **中性色**: Slate 系列
- **优先级颜色**:
  - 🔴 高优先级: Red (#dc2626)
  - 🟡 中优先级: Yellow (#eab308)
  - 🔵 低优先级: Blue (#3b82f6)

### 动画效果

- `fade-in`: 淡入效果（0.3s）
- `slide-up`: 上滑效果（0.3s）
- `slide-down`: 下滑效果（0.3s）

## 🔧 开发规范

- ✅ 严格的 TypeScript 类型检查（禁用 `any`）
- ✅ 函数式组件 + Hooks
- ✅ 每个组件单独一个文件
- ✅ 中文注释和 UI 文本
- ✅ TailwindCSS 优先的样式方案
- ✅ ESLint 9.x 扁平配置

## 📊 项目状态

- ✅ **Phase 1**: 初始化与基础设置 - 已完成
- ✅ **Phase 2**: 类型定义与状态管理 - 已完成
- ⏳ **Phase 3**: 组件开发 - 基础 UI - 待开发
- ⏳ **Phase 4**: 组件开发 - 列表与控制 - 待开发
- ⏳ **Phase 5**: 整合与优化 - 待开发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT

---

**开发愉快！** 🎉

