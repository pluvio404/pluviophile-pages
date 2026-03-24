# Pluviophile - AI数字人助手前端展示

> 这是Pluviophile AI助手的前端展示页面，基于初音未来主题设计。

## 🌐 在线访问

**https://pluvio404.github.io/pluviophile-pages/**

## 🎨 界面特色

- **主题**：初音未来 - 青葱色（#39C5BB）
- **风格**：赛博朋克 + 暗色系
- **响应式设计**：支持桌面和移动设备

## 📱 功能展示

### 1. 技能管理
- 查看已学习的技能
- 执行技能
- 技能统计

### 2. 对话式学习
- 4轮对话学习新技能
- Round 1：需求澄清
- Round 2：I/O定义
- Round 3：实现生成
- Round 4：验证测试

### 3. 记忆系统
- 查看历史记忆
- 搜索记忆
- 语义关联

### 4. 执行历史
- 技能执行记录
- 成功率统计
- 性能分析

## 🔧 连接后端

### 本地运行后端

如果你想在本地运行完整的Pluviophile项目：

```bash
# 克隆完整项目
git clone https://github.com/pluvio404/pluviophile.git
cd pluviophile/AI_helper/pluviophile

# 启动后端
./run.sh

# 访问
open http://localhost:8000
```

### 使用ngrok连接

如果你想让在线前端连接到本地后端：

```bash
# 1. 启动后端+ngrok
./start-with-ngrok.sh

# 2. 复制ngrok URL（如：https://abc123.ngrok.io）

# 3. 更新config.js
# 编辑production.baseURL为你的ngrok URL

# 4. 提交更新
git add config.js
git commit -m "Update backend URL"
git push
```

## 🛠️ 技术栈

- **前端**：原生HTML/CSS/JavaScript
- **后端**：FastAPI + Python（完整项目）
- **数据库**：SQLite + ChromaDB
- **LLM**：支持OpenAI、Ollama、智谱AI等

## 📚 完整项目

查看完整的项目代码、文档和后端实现：

**https://github.com/pluvio404/pluviophile**

包含：
- 完整的后端代码
- 技能系统实现
- 学习控制器
- 记忆系统
- 详细文档

## 🎯 项目亮点

1. **对话式学习** - 通过4轮对话自主学习新技能
2. **技能系统** - 支持Native（Python）和Semantic（LLM）技能
3. **记忆系统** - 显性知识+隐性知识的双层记忆
4. **自主进化** - 根据执行反馈自动优化技能

## 📖 文档

完整项目包含15+份文档：
- 快速开始指南
- 运行指南
- LLM替换指南
- GitHub Pages部署指南
- FAQ
- 等等...

## 🤝 贡献

欢迎提交Issues和Pull Requests！

## 📄 许可

MIT License

---

**Made with ❤️ by pluvio404**

*基于初音未来主题的AI数字人助手*
