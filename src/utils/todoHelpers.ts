import type { Todo, Priority } from '../types/todo';
import { v4 as uuidv4 } from 'uuid';

/**
 * 创建新的待办事项
 */
export function createTodo(
  title: string,
  options?: {
    description?: string;
    priority?: Priority;
    category?: string;
    dueDate?: number;
  }
): Todo {
  return {
    id: uuidv4(),
    title,
    description: options?.description,
    isCompleted: false,
    priority: options?.priority || 'medium',
    category: options?.category || '默认',
    dueDate: options?.dueDate,
    createdAt: Date.now(),
  };
}

/**
 * 验证待办事项数据
 */
export function validateTodo(todo: Partial<Todo>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 验证标题
  if (!todo.title || todo.title.trim().length === 0) {
    errors.push('标题不能为空');
  }

  if (todo.title && todo.title.length > 100) {
    errors.push('标题长度不能超过 100 个字符');
  }

  // 验证描述
  if (todo.description && todo.description.length > 500) {
    errors.push('描述长度不能超过 500 个字符');
  }

  // 验证优先级
  if (todo.priority && !['low', 'medium', 'high'].includes(todo.priority)) {
    errors.push('无效的优先级');
  }

  // 验证分类
  if (todo.category && todo.category.length > 50) {
    errors.push('分类名称长度不能超过 50 个字符');
  }

  // 验证截止日期
  if (todo.dueDate && todo.dueDate < 0) {
    errors.push('无效的截止日期');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 克隆待办事项
 */
export function cloneTodo(todo: Todo): Todo {
  return {
    ...todo,
    id: uuidv4(),
    title: `${todo.title} (副本)`,
    isCompleted: false,
    createdAt: Date.now(),
  };
}

/**
 * 比较两个待办事项是否相同
 */
export function isSameTodo(todo1: Todo, todo2: Todo): boolean {
  return (
    todo1.title === todo2.title &&
    todo1.description === todo2.description &&
    todo1.priority === todo2.priority &&
    todo1.category === todo2.category &&
    todo1.dueDate === todo2.dueDate
  );
}

/**
 * 排序待办事项
 */
export function sortTodos(
  todos: Todo[],
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title',
  order: 'asc' | 'desc' = 'desc'
): Todo[] {
  const sorted = [...todos].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'createdAt':
        comparison = a.createdAt - b.createdAt;
        break;
      case 'dueDate':
        // 没有截止日期的排在后面
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate - b.dueDate;
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title, 'zh-CN');
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * 过滤待办事项
 */
export function filterTodos(
  todos: Todo[],
  filters: {
    status?: 'all' | 'active' | 'completed';
    priority?: Priority | 'all';
    category?: string;
    searchQuery?: string;
  }
): Todo[] {
  return todos.filter((todo) => {
    // 状态筛选
    if (filters.status === 'active' && todo.isCompleted) return false;
    if (filters.status === 'completed' && !todo.isCompleted) return false;

    // 优先级筛选
    if (filters.priority && filters.priority !== 'all' && todo.priority !== filters.priority) {
      return false;
    }

    // 分类筛选
    if (filters.category && filters.category !== 'all' && todo.category !== filters.category) {
      return false;
    }

    // 搜索查询
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(query);
      const matchDesc = todo.description?.toLowerCase().includes(query);
      return matchTitle || matchDesc;
    }

    return true;
  });
}

/**
 * 获取待办事项统计信息
 */
export function getTodoStatistics(todos: Todo[]): {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  byPriority: Record<Priority, number>;
  byCategory: Record<string, number>;
  overdue: number;
  dueToday: number;
} {
  const total = todos.length;
  const completed = todos.filter((t) => t.isCompleted).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 按优先级统计
  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
  };
  todos.forEach((todo) => {
    byPriority[todo.priority]++;
  });

  // 按分类统计
  const byCategory: Record<string, number> = {};
  todos.forEach((todo) => {
    byCategory[todo.category] = (byCategory[todo.category] || 0) + 1;
  });

  // 过期和今天到期的统计
  const now = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  let overdue = 0;
  let dueToday = 0;

  todos.forEach((todo) => {
    if (!todo.dueDate || todo.isCompleted) return;
    
    if (todo.dueDate < now) {
      overdue++;
    } else if (todo.dueDate >= todayStart && todo.dueDate < todayEnd) {
      dueToday++;
    }
  });

  return {
    total,
    completed,
    active,
    completionRate,
    byPriority,
    byCategory,
    overdue,
    dueToday,
  };
}

/**
 * 批量操作待办事项
 */
export function batchUpdateTodos(
  todos: Todo[],
  ids: string[],
  updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Todo[] {
  return todos.map((todo) => {
    if (ids.includes(todo.id)) {
      return { ...todo, ...updates };
    }
    return todo;
  });
}

/**
 * 批量删除待办事项
 */
export function batchDeleteTodos(todos: Todo[], ids: string[]): Todo[] {
  return todos.filter((todo) => !ids.includes(todo.id));
}

/**
 * 批量完成/取消完成待办事项
 */
export function batchToggleTodos(todos: Todo[], ids: string[], completed: boolean): Todo[] {
  return todos.map((todo) => {
    if (ids.includes(todo.id)) {
      return { ...todo, isCompleted: completed };
    }
    return todo;
  });
}

