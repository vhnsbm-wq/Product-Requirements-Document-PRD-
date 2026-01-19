import { format, isBefore, isToday } from 'date-fns';

/**
 * 格式化日期为中文显示
 */
export function formatDate(timestamp: number): string {
  return format(timestamp, 'yyyy年MM月dd日');
}

/**
 * 格式化日期为简短格式
 */
export function formatDateShort(timestamp: number): string {
  return format(timestamp, 'MM/dd');
}

/**
 * 检查日期是否已过期
 */
export function isOverdue(timestamp: number): boolean {
  const now = new Date();
  const dueDate = new Date(timestamp);
  return isBefore(dueDate, now) && !isToday(dueDate);
}

/**
 * 检查日期是否是今天
 */
export function isDueToday(timestamp: number): boolean {
  return isToday(timestamp);
}

/**
 * 获取日期状态文本
 */
export function getDateStatus(timestamp: number): string {
  if (isDueToday(timestamp)) {
    return '今天到期';
  }
  if (isOverdue(timestamp)) {
    return '已过期';
  }
  return formatDate(timestamp);
}

