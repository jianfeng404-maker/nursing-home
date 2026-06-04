# 养老机构管理系统 - UI 设计规范 (UI Design Guidelines)

## 1. 设计理念 (Design Philosophy)
- **温暖与关怀**：摒弃传统医疗系统冷冰冰的纯蓝/纯灰色调，使用蕴含生命力的翠绿（Emerald）和温馨的蓝灰（Slate），传递适老化的温度。
- **清晰与克制**：高信息密度的表格和表单通过大留白、微弱的边框隔离，保证业务人员长时间操作不眼疲劳。
- **明确与高效**：核心操作路径短，行动号召（CTA）按钮视觉突出；状态标签采用低饱和背景+高饱和文字（如 `bg-emerald-50 text-emerald-600`），保证一眼可辨。

---

## 2. 色彩系统 (Color System)

### 品牌主色 (Primary)
- **Emerald (翠绿)**：传递健康、安全、生机。
  - 主色: `emerald-600` (#059669) - 用于主要按钮、核心状态（如：健康、启用中）。
  - 悬停: `emerald-700` (#047857) - 用于按钮悬停。
  - 柔和背景: `emerald-50` (#ecfdf5) - 用于选中态背景、成功状态标签背景。

### 辅助色 (Secondary)
- **Indigo (靛蓝)**：传递专业、科技感。
  - 辅助色: `indigo-500` (#6366f1) / `indigo-600` (#4f46e5) - 用于次要图标（如左侧导航栏图标、关键数据高亮）、链接。
  - 柔和背景: `indigo-50` (#eef2ff) - 用于图标背景或次要标签背景。

### 状态反馈色 (Functional)
- **Rose (玫瑰红)**：用于紧急情况、危险操作、系统告警。
  - 文字/图标: `rose-600` (#e11d48) - 退床、删除、系统异常（异常预警铃铛）。
  - 背景: `rose-50` (#fff1f2) - 危险操作 hover 背景、高危标签底色。
- **Amber (琥珀黄)**：用于警告、待办事项（如待评估）。
  - 色值: `amber-500` (#f59e0b) - 待办状态、中度风险提示。
- **Blue (科技蓝)**：用于常规信息、医疗相关标签。
  - 色值: `blue-600` (#2563eb) - 医护属性标签（如“自带独卫”、“医疗中心”等）。

### 中性色 (Neutral) - Slate 系列
全站采用带有微妙蓝色倾向的 Slate（蓝灰）替代纯灰，整体更显高级。
- 强调标题: `slate-900` (#0f172a) / `slate-800` (#1e293b)
- 正文常规: `slate-700` (#334155) / `slate-600` (#475569)
- 辅助说明: `slate-500` (#64748b) / `slate-400` (#94a3b8)
- 边框与分割线: `slate-200` (#e2e8f0) / `slate-100` (#f1f5f9)
- 页面底色: `slate-50` (#f8fafc) 或 `slate-100` (#f1f5f9)

---

## 3. 字体排印 (Typography)

系统字体采用默认的 Sans-serif (系统无衬线字体，通常是 Inter 或系统的 San Francisco / Segoe UI)。

- **主要页面标题 (Page Title)**: `text-2xl` (24px) / `font-bold` / `text-slate-900`
- **卡片/模块标题 (Card Title)**: `text-lg` (18px) 或 `text-base` (16px) / `font-bold` / `text-slate-800`
- **常规正文 (Body)**: `text-sm` (14px) / `font-normal` 或 `font-medium` / `text-slate-600` 或 `slate-700`（系统由于是B端产品，大量使用 14px 作为表格和表单的基准字号）
- **辅助/次要信息 (Caption)**: `text-xs` (12px) / `text-slate-500` 或 `slate-400`（用于图例、时间戳、次要说明）

---

## 4. 空间与布局 (Spacing & Layout)

### 统一圆角 (Border Radius)
- **输入框 / 按钮 / 小标签**: `rounded-lg` (8px) 或 `rounded-md` (6px)。
- **常规卡片 (Cards) / 弹窗 (Modals)**: `rounded-xl` (12px) 或 `rounded-2xl` (16px) - 较大的圆角减少B端系统的疲惫感。
- **状态徽章 (Badges)**: `rounded` 或 `rounded-full`。

### 阴影规范 (Shadows)
- **底层架构（无阴影）**: `shadow-none` - 用于内部基础面板。
- **常规卡片 (Card Layer)**: `shadow-sm`伴随 `border-slate-200/slate-100` - 极浅的阴影，主打扁平和轻拟物。
- **弹窗悬浮层 (Overlay/Modal)**: `shadow-xl` 或 `shadow-2xl` - 突出 z-index 层级。

---

## 5. 组件规范 (Components)

### 卡片 (Card)
- **结构**: 采用 `bg-white border border-slate-200 shadow-sm rounded-xl`。
- **内边距**: 标准内边距为 `p-6`，紧凑型（如侧边栏列表）为 `p-3` 或 `p-4`。

### 按钮 (Button)
- **主按钮 (Primary)**: `bg-emerald-600 text-white hover:bg-emerald-700`
- **次级按钮/幽灵按钮 (Ghost)**: `hover:bg-slate-100 text-slate-700`
- **危险操作图标按钮**: `text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1 rounded`

### 表格 (Table)
- **表头**: `bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider`
- **行 Hover**: `hover:bg-slate-50/50 transition-colors` 以辅助用户视线对齐。
- **分割线**: `divide-y divide-slate-100`。

### 标签/徽标 (Badges)
- 结构统一为：由**浅色背景 + 高对比同色系文本**组成。
- 示例：`<span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-medium">启用中</span>`

---

## 6. 交互与动画 (Interaction & Motion)

- **页面加载 (Page Transition)**: 全局页面和Tab切换引入微弱渐显动画 `animate-in fade-in duration-500`，显得系统轻盈。
- **Hover 状态**: 所有交互元素（如列表行、按钮）的 hover 需要加 `transition-colors`（颜色过渡），避免瞬间闪烁。
- **图标动效**: 侧边树状导航（如楼宇/楼层展开）使用 `transition-transform duration-200`（如箭头旋转 `rotate-90`）。
- **点击反馈**: 借助 hover 背景色的改变提供充足的响应感。

---

## 7. 图标资产 (Iconography)

全站统一使用 **Lucide React** 图标库。
- **图标大小**:
  - `w-5 h-5` / `w-6 h-6` (20-24px)：用于左侧主导航。
  - `w-4 h-4` (16px)：用于按钮内嵌、二级操作。
  - `w-3.5 h-3.5` (14px)：用于更紧凑的标签图标或表格内嵌行为。
- **图标粗细**: 默认 2px，保持线条清晰、现代。
