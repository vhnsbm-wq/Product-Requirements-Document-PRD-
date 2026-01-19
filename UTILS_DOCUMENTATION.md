# Todo 数据模型和工具函数文档

## 📋 数据模型

### Todo 接口

```typescript
interface Todo {
  id: string;             // UUID，唯一标识符
  title: string;          // 标题（必填）
  description?: string;   // 描述（选填）
  isCompleted: boolean;   // 完成状态
  priority: Priority;     // 优先级：'low' | 'medium' | 'high'
  category: string;       // 分类
  dueDate?: number;       // 截止日期（时间戳）
  createdAt: number;      // 创建时间（时间戳）
}
```

### 其他类型定义

```typescript
// 优先级类型
type Priority = 'low' | 'medium' | 'high';

// 筛选状态类型
type FilterStatus = 'all' | 'active' | 'completed';

// 筛选条件接口
interface FilterState {
  status: FilterStatus;
  priority: Priority | 'all';
  category: string;
  searchQuery: string;
}

// 统计数据接口
interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

// 应用设置接口
interface AppSettings {
  theme: 'light' | 'dark';
  defaultCategory: string;
  defaultPriority: 'low' | 'medium' | 'high';
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
}
```

---

## 🛠️ 工具函数

### 1. Todo 辅助函数 (`todoHelpers.ts`)

#### `createTodo(title, options?)`
创建新的待办事项

```typescript
const todo = createTodo('完成项目文档', {
  description: '编写完整的 API 文档',
  priority: 'high',
  category: '工作',
  dueDate: Date.now() + 86400000, // 明天
});
```

#### `validateTodo(todo)`
验证待办事项数据

```typescript
const { valid, errors } = validateTodo({
  title: '测试任务',
  priority: 'high',
});

if (!valid) {
  console.error('验证失败:', errors);
}
```

#### `cloneTodo(todo)`
克隆待办事项（创建副本）

```typescript
const clonedTodo = cloneTodo(originalTodo);
// 新的 ID，标题添加 "(副本)"，状态重置为未完成
```

#### `sortTodos(todos, sortBy, order?)`
排序待办事项

```typescript
// 按创建时间降序排序
const sorted = sortTodos(todos, 'createdAt', 'desc');

// 按优先级升序排序
const sorted = sortTodos(todos, 'priority', 'asc');

// 按截止日期排序
const sorted = sortTodos(todos, 'dueDate', 'desc');
```

#### `filterTodos(todos, filters)`
过滤待办事项

```typescript
const filtered = filterTodos(todos, {
  status: 'active',
  priority: 'high',
  category: '工作',
  searchQuery: '文档',
});
```

#### `getTodoStatistics(todos)`
获取详细统计信息

```typescript
const stats = getTodoStatistics(todos);
// {
//   total: 10,
//   completed: 5,
//   active: 5,
//   completionRate: 50,
//   byPriority: { low: 3, medium: 4, high: 3 },
//   byCategory: { '工作': 6, '生活': 4 },
//   overdue: 2,
//   dueToday: 1
// }
```

#### 批量操作函数

```typescript
// 批量更新
const updated = batchUpdateTodos(todos, ['id1', 'id2'], {
  priority: 'high',
  category: '紧急',
});

// 批量删除
const remaining = batchDeleteTodos(todos, ['id1', 'id2']);

// 批量完成/取消完成
const toggled = batchToggleTodos(todos, ['id1', 'id2'], true);
```

---

### 2. LocalStorage 工具 (`storage.ts`)

#### `getTodos()`
从 LocalStorage 获取所有待办事项

```typescript
const todos = getTodos();
```

#### `saveTodos(todos)`
保存所有待办事项到 LocalStorage

```typescript
const success = saveTodos(updatedTodos);
```

#### `getSettings()` / `saveSettings(settings)`
获取/保存应用设置

```typescript
const settings = getSettings();

saveSettings({
  theme: 'dark',
  defaultPriority: 'high',
});
```

#### `exportData()` / `importData(jsonString)`
导出/导入数据（用于备份）

```typescript
// 导出
const backupJson = exportData();
// 下载或保存到文件

// 导入
const success = importData(backupJson);
```

#### `createBackup()` / `restoreBackup()`
创建/恢复自动备份

```typescript
// 创建备份
createBackup();

// 恢复备份
restoreBackup();
```

#### `clearAllData()`
清空所有数据

```typescript
clearAllData(); // 谨慎使用！
```

#### `getStorageInfo()`
获取存储使用情况

```typescript
const info = getStorageInfo();
// {
//   used: 12345,      // 已使用字节数
//   total: 5242880,   // 总容量（5MB）
//   percentage: 0.24  // 使用百分比
// }
```

#### `isStorageAvailable()`
检查 LocalStorage 是否可用

```typescript
if (isStorageAvailable()) {
  // 可以使用 LocalStorage
} else {
  // 显示警告
}
```

#### 搜索和筛选函数

```typescript
// 搜索
const results = searchTodos('项目');

// 按分类获取
const workTodos = getTodosByCategory('工作');

// 按优先级获取
const highPriorityTodos = getTodosByPriority('high');

// 获取过期任务
const overdue = getOverdueTodos();

// 获取今天到期的任务
const today = getTodayTodos();
```

---

### 3. 日期处理工具 (`date.ts`)

#### `formatDate(timestamp)`
格式化日期为中文显示

```typescript
formatDate(Date.now()); // "2026年01月19日"
```

#### `formatDateShort(timestamp)`
格式化日期为简短格式

```typescript
formatDateShort(Date.now()); // "01/19"
```

#### `isOverdue(timestamp)`
检查日期是否已过期

```typescript
if (isOverdue(todo.dueDate)) {
  // 显示过期警告
}
```

#### `isDueToday(timestamp)`
检查日期是否是今天

```typescript
if (isDueToday(todo.dueDate)) {
  // 显示今天到期提示
}
```

#### `getDateStatus(timestamp)`
获取日期状态文本

```typescript
getDateStatus(todo.dueDate);
// "今天到期" 或 "已过期" 或 "2026年01月20日"
```

---

### 4. 类名合并工具 (`cn.ts`)

#### `cn(...inputs)`
合并 Tailwind CSS 类名

```typescript
cn('px-4 py-2', 'bg-blue-500', { 'text-white': true });
// "px-4 py-2 bg-blue-500 text-white"

cn('px-4', 'px-6'); // "px-6" (后者覆盖前者)
```

---

### 5. 常量配置 (`constants.ts`)

#### `PRIORITY_CONFIG`
优先级配置

```typescript
PRIORITY_CONFIG.high.label;      // "高"
PRIORITY_CONFIG.high.color;      // "text-red-600"
PRIORITY_CONFIG.high.bgColor;    // "bg-red-50"
PRIORITY_CONFIG.high.borderColor; // "border-red-500"
```

#### `DEFAULT_CATEGORIES`
默认分类列表

```typescript
DEFAULT_CATEGORIES; // ['工作', '生活', '学习', '其他']
```

#### `FILTER_STATUS_OPTIONS`
筛选状态选项

```typescript
FILTER_STATUS_OPTIONS;
// [
//   { value: 'all', label: '全部' },
//   { value: 'active', label: '进行中' },
//   { value: 'completed', label: '已完成' }
// ]
```

#### `PRIORITY_FILTER_OPTIONS`
优先级筛选选项

```typescript
PRIORITY_FILTER_OPTIONS;
// [
//   { value: 'all', label: '全部优先级' },
//   { value: 'high', label: '高优先级' },
//   { value: 'medium', label: '中优先级' },
//   { value: 'low', label: '低优先级' }
// ]
```

---

## 🎯 使用示例

### 完整的 CRUD 操作示例

```typescript
import {
  createTodo,
  validateTodo,
  getTodos,
  saveTodos,
  sortTodos,
  filterTodos,
  getTodoStatistics,
} from '@/utils';

// 1. 创建新任务
const newTodo = createTodo('完成项目文档', {
  description: '编写完整的 API 文档',
  priority: 'high',
  category: '工作',
  dueDate: Date.now() + 86400000,
});

// 2. 验证任务
const { valid, errors } = validateTodo(newTodo);
if (!valid) {
  console.error('验证失败:', errors);
  return;
}

// 3. 保存任务
const todos = getTodos();
todos.push(newTodo);
saveTodos(todos);

// 4. 排序和筛选
const sortedTodos = sortTodos(todos, 'priority', 'desc');
const activeTodos = filterTodos(sortedTodos, { status: 'active' });

// 5. 获取统计信息
const stats = getTodoStatistics(todos);
console.log(`完成率: ${stats.completionRate}%`);
```

### 备份和恢复示例

```typescript
import {
  exportData,
  importData,
  createBackup,
  restoreBackup,
} from '@/utils';

// 导出数据
const backupJson = exportData();
// 保存到文件或发送到服务器

// 导入数据
const fileContent = '...'; // 从文件读取
importData(fileContent);

// 自动备份
createBackup(); // 定期调用

// 恢复备份
restoreBackup(); // 出错时恢复
```

---

## 📝 注意事项

1. **LocalStorage 限制**
   - 容量限制：通常为 5MB
   - 使用 `getStorageInfo()` 监控使用情况
   - 定期清理不需要的数据

2. **数据验证**
   - 始终使用 `validateTodo()` 验证用户输入
   - 处理验证错误并显示友好提示

3. **备份策略**
   - 定期调用 `createBackup()` 创建备份
   - 在重要操作前创建备份
   - 提供导出功能让用户手动备份

4. **性能优化**
   - 大量数据时使用分页
   - 避免频繁的 LocalStorage 读写
   - 使用 Zustand Store 作为内存缓存

5. **错误处理**
   - 所有函数都包含错误处理
   - 检查 `isStorageAvailable()` 确保 LocalStorage 可用
   - 提供降级方案（如内存存储）

---

## 🔗 相关文件

- `src/types/todo.ts` - 类型定义
- `src/utils/todoHelpers.ts` - Todo 辅助函数
- `src/utils/storage.ts` - LocalStorage 工具
- `src/utils/date.ts` - 日期处理
- `src/utils/cn.ts` - 类名合并
- `src/utils/constants.ts` - 常量配置
- `src/utils/index.ts` - 统一导出

---

**文档更新时间**: 2026-01-19

