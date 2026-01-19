/**
 * 工具函数使用示例
 * 
 * 这个文件展示了如何使用各种工具函数
 */

import {
  createTodo,
  validateTodo,
  sortTodos,
  filterTodos,
  getTodoStatistics,
  formatDate,
  isOverdue,
  PRIORITY_CONFIG,
  DEFAULT_CATEGORIES,
} from '../utils';

/**
 * 示例 1: 创建和验证待办事项
 */
export function example1_CreateAndValidate() {
  console.log('=== 示例 1: 创建和验证待办事项 ===');

  // 创建新任务
  const todo = createTodo('完成项目文档', {
    description: '编写完整的 API 文档和用户指南',
    priority: 'high',
    category: '工作',
    dueDate: Date.now() + 86400000, // 明天
  });

  console.log('创建的任务:', todo);

  // 验证任务
  const { valid, errors } = validateTodo(todo);
  if (valid) {
    console.log('✓ 任务验证通过');
  } else {
    console.error('✗ 任务验证失败:', errors);
  }

  return todo;
}

/**
 * 示例 2: 排序和筛选
 */
export function example2_SortAndFilter() {
  console.log('\n=== 示例 2: 排序和筛选 ===');

  // 创建示例数据
  const todos = [
    createTodo('紧急任务', { priority: 'high', category: '工作' }),
    createTodo('日常任务', { priority: 'low', category: '生活' }),
    createTodo('学习计划', { priority: 'medium', category: '学习' }),
    createTodo('重要会议', { priority: 'high', category: '工作' }),
  ];

  // 按优先级排序
  const sortedByPriority = sortTodos(todos, 'priority', 'desc');
  console.log('按优先级排序:', sortedByPriority.map(t => ({
    title: t.title,
    priority: t.priority,
  })));

  // 筛选高优先级任务
  const highPriorityTodos = filterTodos(todos, { priority: 'high' });
  console.log('高优先级任务:', highPriorityTodos.map(t => t.title));

  // 筛选工作类任务
  const workTodos = filterTodos(todos, { category: '工作' });
  console.log('工作类任务:', workTodos.map(t => t.title));

  return { sortedByPriority, highPriorityTodos, workTodos };
}

/**
 * 示例 3: 统计信息
 */
export function example3_Statistics() {
  console.log('\n=== 示例 3: 统计信息 ===');

  // 创建示例数据
  const todos = [
    createTodo('任务 1', { priority: 'high', category: '工作' }),
    createTodo('任务 2', { priority: 'medium', category: '生活' }),
    createTodo('任务 3', { priority: 'low', category: '学习' }),
    createTodo('任务 4', { priority: 'high', category: '工作' }),
    createTodo('任务 5', { priority: 'medium', category: '工作' }),
  ];

  // 标记部分任务为已完成
  todos[0].isCompleted = true;
  todos[2].isCompleted = true;

  // 获取统计信息
  const stats = getTodoStatistics(todos);
  console.log('统计信息:', {
    总任务数: stats.total,
    已完成: stats.completed,
    进行中: stats.active,
    完成率: `${stats.completionRate}%`,
    按优先级: stats.byPriority,
    按分类: stats.byCategory,
  });

  return stats;
}

/**
 * 示例 4: 日期处理
 */
export function example4_DateHandling() {
  console.log('\n=== 示例 4: 日期处理 ===');

  const now = Date.now();
  const tomorrow = now + 86400000;
  const yesterday = now - 86400000;

  console.log('今天:', formatDate(now));
  console.log('明天:', formatDate(tomorrow));
  console.log('昨天:', formatDate(yesterday));

  console.log('昨天是否过期:', isOverdue(yesterday));
  console.log('明天是否过期:', isOverdue(tomorrow));

  return { now, tomorrow, yesterday };
}

/**
 * 示例 5: 使用常量配置
 */
export function example5_Constants() {
  console.log('\n=== 示例 5: 使用常量配置 ===');

  // 优先级配置
  console.log('高优先级配置:', {
    标签: PRIORITY_CONFIG.high.label,
    颜色: PRIORITY_CONFIG.high.color,
    背景色: PRIORITY_CONFIG.high.bgColor,
    边框色: PRIORITY_CONFIG.high.borderColor,
  });

  // 默认分类
  console.log('默认分类:', DEFAULT_CATEGORIES);

  return { PRIORITY_CONFIG, DEFAULT_CATEGORIES };
}

/**
 * 示例 6: 完整的工作流程
 */
export function example6_CompleteWorkflow() {
  console.log('\n=== 示例 6: 完整的工作流程 ===');

  // 1. 创建多个任务
  const todos = [
    createTodo('完成项目文档', {
      description: '编写 API 文档',
      priority: 'high',
      category: '工作',
      dueDate: Date.now() + 86400000,
    }),
    createTodo('购买日用品', {
      priority: 'low',
      category: '生活',
    }),
    createTodo('学习 React', {
      description: '完成 React 教程',
      priority: 'medium',
      category: '学习',
      dueDate: Date.now() + 172800000,
    }),
  ];

  console.log(`创建了 ${todos.length} 个任务`);

  // 2. 验证所有任务
  const validationResults = todos.map(todo => validateTodo(todo));
  const allValid = validationResults.every(r => r.valid);
  console.log('所有任务验证:', allValid ? '✓ 通过' : '✗ 失败');

  // 3. 按优先级排序
  const sorted = sortTodos(todos, 'priority', 'desc');
  console.log('排序后的任务:', sorted.map(t => `${t.title} (${t.priority})`));

  // 4. 标记第一个任务为已完成
  sorted[0].isCompleted = true;
  console.log(`标记 "${sorted[0].title}" 为已完成`);

  // 5. 获取统计信息
  const stats = getTodoStatistics(sorted);
  console.log('统计信息:', {
    总数: stats.total,
    已完成: stats.completed,
    完成率: `${stats.completionRate}%`,
  });

  // 6. 筛选未完成的任务
  const activeTodos = filterTodos(sorted, { status: 'active' });
  console.log('未完成的任务:', activeTodos.map(t => t.title));

  return {
    todos: sorted,
    stats,
    activeTodos,
  };
}

/**
 * 运行所有示例
 */
export function runAllExamples() {
  console.log('========================================');
  console.log('  工具函数使用示例');
  console.log('========================================');

  example1_CreateAndValidate();
  example2_SortAndFilter();
  example3_Statistics();
  example4_DateHandling();
  example5_Constants();
  example6_CompleteWorkflow();

  console.log('\n========================================');
  console.log('  所有示例运行完成！');
  console.log('========================================');
}

// 如果直接运行此文件，执行所有示例
if (import.meta.env.DEV) {
  // 在开发环境中可以取消注释来运行示例
  // runAllExamples();
}

