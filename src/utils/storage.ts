import type { Todo } from '../types/todo';

/**
 * LocalStorage 键名常量
 */
const STORAGE_KEYS = {
  TODOS: 'todo-storage',
  SETTINGS: 'todo-settings',
  BACKUP: 'todo-backup',
} as const;

/**
 * 应用设置接口
 */
export interface AppSettings {
  theme: 'light' | 'dark';
  defaultCategory: string;
  defaultPriority: 'low' | 'medium' | 'high';
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
}

/**
 * 默认设置
 */
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  defaultCategory: '工作',
  defaultPriority: 'medium',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

/**
 * 从 LocalStorage 获取数据
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`读取 LocalStorage 失败 (${key}):`, error);
    return defaultValue;
  }
}

/**
 * 保存数据到 LocalStorage
 */
function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`保存到 LocalStorage 失败 (${key}):`, error);
    return false;
  }
}

/**
 * 从 LocalStorage 删除数据
 */
function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`删除 LocalStorage 数据失败 (${key}):`, error);
    return false;
  }
}

/**
 * 获取所有待办事项
 */
export function getTodos(): Todo[] {
  const data = getFromStorage<{ state: { todos: Todo[] } }>(
    STORAGE_KEYS.TODOS,
    { state: { todos: [] } }
  );
  return data.state.todos || [];
}

/**
 * 保存所有待办事项
 */
export function saveTodos(todos: Todo[]): boolean {
  const data = getFromStorage<{ state: { todos: Todo[] } }>(
    STORAGE_KEYS.TODOS,
    { state: { todos: [] } }
  );
  data.state.todos = todos;
  return saveToStorage(STORAGE_KEYS.TODOS, data);
}

/**
 * 获取应用设置
 */
export function getSettings(): AppSettings {
  return getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

/**
 * 保存应用设置
 */
export function saveSettings(settings: Partial<AppSettings>): boolean {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...settings };
  return saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);
}

/**
 * 重置应用设置
 */
export function resetSettings(): boolean {
  return saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

/**
 * 导出所有数据（用于备份）
 */
export function exportData(): string {
  const todos = getTodos();
  const settings = getSettings();
  const backup = {
    version: 1,
    timestamp: Date.now(),
    todos,
    settings,
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * 导入数据（从备份恢复）
 */
export function importData(jsonString: string): boolean {
  try {
    const backup = JSON.parse(jsonString);
    
    // 验证数据格式
    if (!backup.version || !backup.todos) {
      throw new Error('无效的备份数据格式');
    }

    // 恢复待办事项
    if (Array.isArray(backup.todos)) {
      saveTodos(backup.todos);
    }

    // 恢复设置
    if (backup.settings) {
      saveSettings(backup.settings);
    }

    return true;
  } catch (error) {
    console.error('导入数据失败:', error);
    return false;
  }
}

/**
 * 创建备份
 */
export function createBackup(): boolean {
  const backupData = exportData();
  return saveToStorage(STORAGE_KEYS.BACKUP, backupData);
}

/**
 * 恢复备份
 */
export function restoreBackup(): boolean {
  try {
    const backupData = localStorage.getItem(STORAGE_KEYS.BACKUP);
    if (!backupData) {
      console.warn('没有找到备份数据');
      return false;
    }
    return importData(backupData);
  } catch (error) {
    console.error('恢复备份失败:', error);
    return false;
  }
}

/**
 * 清空所有数据
 */
export function clearAllData(): boolean {
  try {
    removeFromStorage(STORAGE_KEYS.TODOS);
    removeFromStorage(STORAGE_KEYS.SETTINGS);
    removeFromStorage(STORAGE_KEYS.BACKUP);
    return true;
  } catch (error) {
    console.error('清空数据失败:', error);
    return false;
  }
}

/**
 * 获取存储使用情况
 */
export function getStorageInfo(): {
  used: number;
  total: number;
  percentage: number;
} {
  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // LocalStorage 通常限制为 5MB (5 * 1024 * 1024 字节)
    const total = 5 * 1024 * 1024;
    const percentage = Math.round((used / total) * 100);

    return {
      used,
      total,
      percentage,
    };
  } catch (error) {
    console.error('获取存储信息失败:', error);
    return { used: 0, total: 0, percentage: 0 };
  }
}

/**
 * 检查 LocalStorage 是否可用
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('LocalStorage 不可用:', error);
    return false;
  }
}

/**
 * 按条件搜索待办事项
 */
export function searchTodos(query: string): Todo[] {
  const todos = getTodos();
  const lowerQuery = query.toLowerCase();
  
  return todos.filter((todo) => {
    const matchTitle = todo.title.toLowerCase().includes(lowerQuery);
    const matchDesc = todo.description?.toLowerCase().includes(lowerQuery);
    const matchCategory = todo.category.toLowerCase().includes(lowerQuery);
    return matchTitle || matchDesc || matchCategory;
  });
}

/**
 * 按分类获取待办事项
 */
export function getTodosByCategory(category: string): Todo[] {
  const todos = getTodos();
  return todos.filter((todo) => todo.category === category);
}

/**
 * 按优先级获取待办事项
 */
export function getTodosByPriority(priority: 'low' | 'medium' | 'high'): Todo[] {
  const todos = getTodos();
  return todos.filter((todo) => todo.priority === priority);
}

/**
 * 获取过期的待办事项
 */
export function getOverdueTodos(): Todo[] {
  const todos = getTodos();
  const now = Date.now();
  
  return todos.filter((todo) => {
    if (!todo.dueDate || todo.isCompleted) return false;
    return todo.dueDate < now;
  });
}

/**
 * 获取今天到期的待办事项
 */
export function getTodayTodos(): Todo[] {
  const todos = getTodos();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;
  
  return todos.filter((todo) => {
    if (!todo.dueDate || todo.isCompleted) return false;
    return todo.dueDate >= todayStart && todo.dueDate < todayEnd;
  });
}

