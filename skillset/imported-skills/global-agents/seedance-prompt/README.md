# Seedance Prompt Guide

> An AI skill for crafting high-quality prompts for ByteDance's **Seedance 2.0** video generation model.

为字节跳动即梦平台 **Seedance 2.0** 视频生成模型撰写高质量提示词的 AI Skill。基于官方使用手册提炼，涵盖文生视频、图生视频、多模态参考、一镜到底、产品广告、视频编辑等全场景。

---

## 安装 | Installation

### 方法一：npx 一键安装（推荐）

```bash
npx skills add https://github.com/rich5000/seedance-prompt-guide.git
```

### 方法二：Git Clone

```bash
git clone https://github.com/rich5000/seedance-prompt-guide.git ~/.claude/skills/seedance-prompt-guide
```

### 方法三：手动安装

1. 下载本项目 ZIP 或 clone 到本地
2. 将文件夹复制到 Claude Code 的 skills 目录：
   - **macOS/Linux**: `~/.claude/skills/`
   - **Windows**: `%USERPROFILE%\.claude\skills\`

3. 确保目录结构如下：
   ```
   ~/.claude/skills/seedance-prompt-guide/
   ├── SKILL.md      # Skill 定义文件
   └── README.md     # 说明文档
   ```

### 验证安装

重启 Claude Code 后，在对话中输入：

```
/seedance-prompt
```

如果安装成功，Skill 将被激活。

---

## 使用 | Usage

### 直接调用

```
/seedance-prompt 帮我写一个产品广告的视频提示词，产品是一个黑色皮质手提包
```

### 在对话中使用

```
我想用 Seedance 2.0 生成一个15秒的人物叙事短片，主角是一个疲惫的上班族走在回家路上，帮我写提示词
```

### 搭配素材描述

```
/seedance-prompt 我有3张图片：图1是男主角正面照，图2是一个老旧走廊，图3是家门口。帮我写一个一镜到底的提示词
```

---

## 功能概览 | What's Inside

| 模块 | 内容 |
|------|------|
| **平台参数速查** | 输入限制、时长、音频支持 |
| **两种入口模式** | 首尾帧模式 vs 全能参考模式 |
| **核心提示词公式** | 素材角色 → 动作剧情 → 镜头语言 → 氛围音效 |
| **七大场景模板** | 产品广告、人物叙事、动作复刻、创意特效、一镜到底、视频延长、视频编辑 |
| **优化 Checklist** | 生成前的质量检查清单 |
| **常见陷阱与最佳实践** | 避坑指南与实战技巧 |

### 核心公式 | Core Formula

```
素材角色指定 + 动作/剧情描述 + 镜头语言 + 氛围/音效指令
```

### 示例 | Example

```
参考@图1的男人形象，他在@图2的走廊中，
男人下班后疲惫的走在走廊，脚步变缓，最后停在家门口，
脸部特写镜头，镜头前推，
背景音效为走路声，整体氛围孤独疲惫
```

详见 [`SKILL.md`](./SKILL.md) 获取完整指南。

---

## 贡献 | Contributing

发现了更好的提示词技巧？有新的场景模板？欢迎提 PR 和 Issue！

Found a better prompting pattern or a new scenario template? PRs and issues are welcome!

## License

[MIT](./LICENSE)
