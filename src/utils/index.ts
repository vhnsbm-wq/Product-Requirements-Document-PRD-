/**
 * 工具函数模块
 * 
 * 导出所有工具函数，方便统一导入
 */

// 类名合并工具
export { cn } from './cn';

// 日期处理工具
export {
  formatDate,
  formatDateShort,
  isOverdue,
  isDueToday,
  getDateStatus,
} from './date';

// 常量配置
export {
  PRIORITY_CONFIG,
  DEFAULT_CATEGORIES,
  FILTER_STATUS_OPTIONS,
  PRIORITY_FILTER_OPTIONS,
} from './constants';

// Todo 辅助函数
export {
  createTodo,
  validateTodo,
  cloneTodo,
  isSameTodo,
  sortTodos,
  filterTodos,
  getTodoStatistics,
  batchUpdateTodos,
  batchDeleteTodos,
  batchToggleTodos,
} from './todoHelpers';

// LocalStorage 工具
export {
  getTodos,
  saveTodos,
  getSettings,
  saveSettings,
  resetSettings,
  exportData,
  importData,
  createBackup,
  restoreBackup,
  clearAllData,
  getStorageInfo,
  isStorageAvailable,
  searchTodos,
  getTodosByCategory,
  getTodosByPriority,
  getOverdueTodos,
  getTodayTodos,
} from './storage';

export type { AppSettings } from './storage';

