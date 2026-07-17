# Ant Design 按需引入优化说明

## 优化背景

项目初始构建时，antd 组件库打包体积高达 **963 kB**，包含了大量未使用的组件代码，严重影响页面加载性能。

## 优化方案

### 1. 安装依赖

```bash
# CSS-in-JS 运行时样式注入
pnpm add @ant-design/cssinjs

# Babel 按需引入插件
pnpm add babel-plugin-import -D
```

### 2. 配置 vite.config.ts

在 `@vitejs/plugin-react` 中配置 babel 插件：

```typescript
plugins: [
  react({
    babel: {
      plugins: [
        [
          'babel-plugin-import',
          {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: false,
          },
        ],
      ],
    },
  }),
]
```

### 3. 配置 main.tsx

使用 `StyleProvider` 包裹根组件，实现运行时样式按需注入：

```tsx
import { StyleProvider } from '@ant-design/cssinjs';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider>
      <Suspense fallback={<div>加载中...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </StyleProvider>
  </StrictMode>
);
```

## 优化效果

### 构建产物对比

| 项目 | 优化前 | 优化后 | 减少比例 |
|------|--------|--------|---------|
| antd-vendor chunk | 963 kB | 101 kB | ~90% |
| gzip 压缩后 | 311 kB | 34 kB | ~89% |
| 总 JS 体积 | ~850 kB | ~398 kB | ~53% |

### 实际使用的组件

| 组件 | 使用页面 |
|------|---------|
| Card | Dashboard、Login、User、Topic、Order、Layout |
| Row、Col | Dashboard |
| Statistic | Dashboard |
| Form、Input、Button | Login、Topic |
| Table | User、Topic、Order |
| Space、Popconfirm、message | User、Topic、Order |
| Modal、Select、Tag | Topic、Order |
| Layout、Menu、Avatar、Dropdown | Layout、Header、Sidebar |

## 原理说明

### 为什么需要 babel-plugin-import？

直接写 `import { Card } from 'antd'` 不能实现按需引入，原因如下：

**antd 的导出方式**：

```typescript
// antd/index.js（简化示例）
export { default as Card } from './es/card';
export { default as Button } from './es/button';
export { default as Input } from './es/input';
// ... 导出约 200+ 个组件
```

当你执行 `import { Card } from 'antd'` 时，**整个 antd 入口文件都会被执行**，即使你只用到了 `Card`。

**Tree Shaking 的局限性**：

Tree Shaking 只能移除未被使用的代码，但前提是代码没有副作用（side effects）。antd 的导出方式虽然是 ES Module，但入口文件会遍历所有组件，触发初始化逻辑，导致无法被 Tree Shaking 移除。

**babel-plugin-import 的作用**：

在编译阶段将代码转换，避免导入整个 antd 入口文件：

```typescript
// 转换前（源码）
import { Card, Row, Col } from 'antd';

// 转换后（编译时）
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
```

**对比图**：

```
┌─────────────────────────────────────────────────────────────────┐
│ 不使用 babel-plugin-import                                      │
├─────────────────────────────────────────────────────────────────┤
│ import { Card } from 'antd'                                     │
│         │                                                       │
│         ▼                                                       │
│ ┌─────────────────────────────┐                                │
│ │ antd/index.js               │ ← 导入整个入口文件              │
│ │ - 导出 Card                 │                                │
│ │ - 导出 Button               │                                │
│ │ - 导出 Input                │                                │
│ │ - ... 200+ 组件             │                                │
│ └─────────────────────────────┘                                │
│         │                                                       │
│         ▼                                                       │
│ ┌─────────────────────────────┐                                │
│ │ 打包结果: 963 kB            │ ← 包含所有组件代码              │
│ └─────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 使用 babel-plugin-import                                        │
├─────────────────────────────────────────────────────────────────┤
│ import { Card } from 'antd'                                     │
│         │                                                       │
│         ▼ (编译时转换)                                          │
│ import Card from 'antd/es/card'                                │
│         │                                                       │
│         ▼                                                       │
│ ┌─────────────────────────────┐                                │
│ │ antd/es/card/index.js       │ ← 只导入 Card 组件             │
│ └─────────────────────────────┘                                │
│         │                                                       │
│         ▼                                                       │
│ ┌─────────────────────────────┐                                │
│ │ 打包结果: ~10 kB            │ ← 只包含 Card 组件代码          │
│ └─────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

### 编译时处理（babel-plugin-import）

将源码中的导入语句进行转换：

```typescript
// 转换前
import { Card, Button } from 'antd';

// 转换后
import Card from 'antd/es/card';
import Button from 'antd/es/button';
```

### 运行时处理（@ant-design/cssinjs）

antd 6.x 采用 CSS-in-JS 方式，样式在组件渲染时按需注入到页面，避免打包全量 CSS。

### Tree Shaking

Vite/Rollup 的 Tree Shaking 机制会自动剔除未被引用的模块代码。

## 注意事项

1. **style 配置**：antd 6.x 使用 CSS-in-JS，`style` 必须设为 `false`，不能设为 `'css'`
2. **StyleProvider**：必须在入口文件中配置，否则样式无法正常渲染
3. **按需导入方式**：源码中保持 `import { Component } from 'antd'` 的方式即可，babel-plugin-import 会自动转换

## 文件变更

| 文件 | 变更内容 |
|------|---------|
| `vite.config.ts` | 添加 babel-plugin-import 配置 |
| `src/main.tsx` | 添加 StyleProvider 包裹 |
| `package.json` | 添加 @ant-design/cssinjs 和 babel-plugin-import |