import type { Priority } from '../types/todo';

/**
 * 优先级配置
 */
export const PRIORITY_CONFIG: Record<
  Priority,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  low: {
    label: '低',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
  medium: {
    label: '中',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
  },
  high: {
    label: '高',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
  },
};

/**
 * 默认分类列表
 */
export const DEFAULT_CATEGORIES = ['工作', '生活', '学习', '其他'];

/**
 * 筛选状态选项
 */
export const FILTER_STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
] as const;

/**
 * 优先级筛选选项
 */
export const PRIORITY_FILTER_OPTIONS = [
  { value: 'all', label: '全部优先级' },
  { value: 'high', label: '高优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'low', label: '低优先级' },
] as const;

