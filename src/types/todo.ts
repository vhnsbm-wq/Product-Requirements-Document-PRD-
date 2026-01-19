/**
 * 优先级类型定义
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * 待办事项接口
 */
export interface Todo {
  id: string;             // UUID
  title: string;          // 标题（必填）
  description?: string;   // 描述（选填）
  isCompleted: boolean;   // 完成状态
  priority: Priority;     // 优先级
  category: string;       // 分类
  dueDate?: number;       // 截止日期（时间戳）
  createdAt: number;      // 创建时间（时间戳）
}

/**
 * 筛选状态类型
 */
export type FilterStatus = 'all' | 'active' | 'completed';

/**
 * 筛选条件接口
 */
export interface FilterState {
  status: FilterStatus;
  priority: Priority | 'all';
  category: string;
  searchQuery: string;
}

/**
 * 统计数据接口
 */
export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

