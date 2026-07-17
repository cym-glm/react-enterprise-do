# 项目运行与登录指南

## 一、环境要求

- Node.js 版本：20.19+ 或 22.12+（当前环境为 20.12.2，可正常运行但有警告）
- 包管理工具：pnpm

## 二、运行项目

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm run dev
```

启动成功后，访问地址：http://localhost:5173/

### 3. 构建生产版本

```bash
pnpm run build
```

### 4. 预览生产版本

```bash
pnpm run preview
```

## 三、登录项目

### 登录方式

本项目使用用户名+密码方式登录，**任意用户名和密码均可登录**（演示模式）。

### 登录步骤

1. 打开项目首页：http://localhost:5173/
2. 如果未登录，会自动跳转到登录页面：http://localhost:5173/login
3. 在登录页面输入任意用户名和密码
4. 点击「登录」按钮

### 登录成功后

- 系统会自动跳转到仪表盘页面（Dashboard）
- 页面顶部会显示当前登录用户的头像和用户名
- 可以通过左侧菜单导航到不同的功能模块：
  - 仪表盘：查看数据统计和系统状态
  - 用户管理：管理用户列表
  - 订单管理：管理订单信息

### 退出登录

点击页面右上角的用户头像，在下拉菜单中选择「退出登录」。
 
## 四、项目结构说明

```
src/
├── api/          # API 接口封装（对接 CNodeJS API）
├── assets/       # 静态资源
├── components/   # 公共组件
├── hooks/        # 自定义 Hooks
├── layouts/      # 布局组件（Header、Sidebar、Content）
├── pages/        # 页面组件（Login、Dashboard、User、Order）
├── router/       # 路由配置
├── store/        # Zustand 状态管理（用户信息、Token、登录状态）
├── types/        # TypeScript 类型定义
└── utils/        # 工具函数（Axios 封装）
```

## 五、注意事项

1. **登录验证**：本项目处于演示模式，任意用户名和密码均可登录
2. **数据来源**：用户列表和话题数据来自 CNodeJS API，仅供演示
3. **开发环境**：开发服务器默认运行在 http://localhost:5173/
