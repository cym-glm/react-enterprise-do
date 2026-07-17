# 构建产物文件映射说明

## 文件命名规则

Vite 构建时会自动进行代码分割（Code Splitting），生成的文件命名规则如下：
- `[name]-[hash].[ext]`：`name` 是模块名称，`hash` 是内容哈希值，用于缓存控制

## 文件映射表

| 打包文件 | 大小 | 来源文件 | 说明 |
|---------|------|---------|------|
| `dist/index.html` | 0.47 kB | `index.html` | 应用入口 HTML 文件 |
| `dist/assets/index-DPJEyXBX.css` | 0.27 kB | `src/index.css` + `src/App.css` | 全局样式文件（重置样式 + 应用基础样式） |
| `dist/assets/Login-BAeXZl7l.css` | 0.53 kB | `src/pages/login.less` | 登录页面专属样式 |
| `dist/assets/Login-C5iwNQ4e.js` | 2.43 kB | `src/pages/Login.tsx` | 登录页面组件逻辑 |
| `dist/assets/User-B6mJmCNy.js` | 2.22 kB | `src/pages/User.tsx` | 用户管理页面组件 |
| `dist/assets/Order-Ck5WcEvb.js` | 2.27 kB | `src/pages/Order.tsx` | 订单管理页面组件 |
| `dist/assets/Topic-CFROHF-G.js` | 30.54 kB | `src/pages/Topic.tsx` | 话题管理页面组件（含列表、分页、表单） |
| `dist/assets/Dashboard-CAANJW63.js` | - | `src/pages/Dashboard.tsx` | 仪表盘页面组件（含 ECharts 图表） |
| `dist/assets/axios-BnQX5jCP.js` | 46.38 kB | `src/utils/axios.ts` + Axios 库 | Axios 封装及核心库 |
| `dist/assets/topic-DUF69Lng.js` | 0.13 kB | `src/api/topic.ts` | 话题 API 接口定义（被 Dashboard 和 Topic 页面共享） |
| - | - | `src/api/login.ts` | 未使用，未被打包 |
| - | - | `src/api/user.ts` | 被内联进 `User-B6mJmCNy.js`（仅被 User 页面使用） |
| `dist/assets/row-B2LXDMmN.js` | 4.32 kB | Ant Design `Row` 组件 | 栅格布局组件 |
| `dist/assets/EditOutlined-VrikBVEn.js` | 272.05 kB | Ant Design 图标库 | 编辑图标及相关图标依赖 |
| `dist/assets/index-B5JXvwLw.js` | 9.58 kB | `src/router/index.tsx` + React Router | 路由配置及 React Router 核心 |
| `dist/assets/index-CjP8FZpd.js` | 57.70 kB | `src/store/index.ts` + Zustand | 状态管理及 Zustand 核心 |
| `dist/assets/index-Cslenzvh.js` | 19.98 kB | `src/layouts/Layout.tsx` + Header + Sidebar | 布局组件 |
| `dist/assets/index-DfO3sHRj.js` | 21.95 kB | React 核心库 | React、ReactDOM 等 |
| `dist/assets/index-3dOctPV4.js` | 64.76 kB | ECharts 图表库 | 图表组件及核心依赖 |
| `dist/assets/index-DVDv5av8.js` | 606.86 kB | Ant Design 核心组件库 | Button、Table、Form、Card 等组件 |

## 代码分割策略

### 页面级分割
每个页面组件（Login、User、Order、Topic、Dashboard）独立打包为一个 JS 文件，实现按需加载。

### 第三方库分割
- **Ant Design**：图标库和组件库分别打包
- **ECharts**：图表库独立打包
- **Axios**：HTTP 客户端独立打包
- **React Router / Zustand**：路由和状态管理独立打包

### 样式分割
- 全局样式：合并到 `index.css`
- 组件样式：使用 CSS Modules 或 Less 独立打包

### 模块分割规则（关键）

Vite 的代码分割遵循以下核心规则：

| 条件 | 处理方式 | 示例 |
|------|---------|------|
| 模块被**多个分割点**共享 | **独立打包**为公共 chunk | `src/api/topic.ts` 被 Dashboard 和 Topic 两个页面使用 → 生成 `topic-DUF69Lng.js` |
| 模块只被**一个分割点**使用 | **内联**到该分割点的 chunk | `src/api/user.ts` 仅被 User 页面使用 → 内联到 `User-B6mJmCNy.js` |
| 模块**未被任何代码引用** | **不打包** | `src/api/login.ts` 无引用 → 不生成打包文件 |
| 模块体积**小于某个阈值**（默认 4096 bytes） | **内联**到引用者 | 小模块优先内联减少 HTTP 请求 |

### 具体分析

1. **`src/api/topic.ts` → `topic-DUF69Lng.js`（单独文件）**
   - **原因**：被 `Dashboard.tsx` 和 `Topic.tsx` 两个页面同时引用
   - Vite 检测到跨分割点的共享依赖，将其提取为独立 chunk，避免重复打包
   - 当用户从 Dashboard 导航到 Topic 页面时，`topic.js` 已被缓存，无需重新加载

2. **`src/api/user.ts` → 内联到 `User-B6mJmCNy.js`**
   - **原因**：仅被 `User.tsx` 一个页面引用
   - Vite 认为无需单独打包，直接内联到引用者，减少 HTTP 请求数量

3. **`src/api/login.ts` → 未打包**
   - **原因**：项目中没有任何文件引用它（登录已改为演示模式，无需调用 CNodeJS API）
   - Vite 的 Tree Shaking 机制会自动剔除未使用的代码

## 缓存策略

文件名中的哈希值（如 `-DPJEyXBX`）会在文件内容变化时更新，配合 HTTP 缓存策略：
- 文件名不变的文件可设置长期缓存（如 `Cache-Control: max-age=31536000`）
- 文件名变化的文件重新请求即可

## 资源加载顺序

1. 浏览器加载 `index.html`
2. 解析并加载入口 JS（包含路由配置）
3. 根据路由按需加载对应页面组件
4. 页面组件加载依赖的第三方库和样式