import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Todo, FilterState, TodoStats, Priority } from '../types/todo';

/**
 * Todo Store 状态接口
 */
interface TodoStore {
  // 状态
  todos: Todo[];
  filter: FilterState;

  // Todo CRUD 操作
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;

  // 筛选操作
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;

  // Selectors
  getFilteredTodos: () => Todo[];
  getStats: () => TodoStats;
  getCategories: () => string[];
}

/**
 * 默认筛选状态
 */
const defaultFilter: FilterState = {
  status: 'all',
  priority: 'all',
  category: 'all',
  searchQuery: '',
};

/**
 * Todo Store
 * 使用 Zustand 进行状态管理，并通过 persist 中间件实现 LocalStorage 持久化
 */
export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      todos: [],
      filter: defaultFilter,

      // 添加待办事项
      addTodo: (todo) => {
        const newTodo: Todo = {
          ...todo,
          id: uuidv4(),
          createdAt: Date.now(),
        };
        set((state) => ({
          todos: [newTodo, ...state.todos],
        }));
      },

      // 更新待办事项
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        }));
      },

      // 删除待办事项
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      // 切换完成状态
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
          ),
        }));
      },

      // 设置筛选条件
      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        }));
      },

      // 重置筛选条件
      resetFilter: () => {
        set({ filter: defaultFilter });
      },

      // 获取筛选后的待办事项列表
      getFilteredTodos: () => {
        const { todos, filter } = get();
        
        return todos.filter((todo) => {
          // 状态筛选
          if (filter.status === 'active' && todo.isCompleted) return false;
          if (filter.status === 'completed' && !todo.isCompleted) return false;

          // 优先级筛选
          if (filter.priority !== 'all' && todo.priority !== filter.priority) {
            return false;
          }

          // 分类筛选
          if (filter.category !== 'all' && todo.category !== filter.category) {
            return false;
          }

          // 搜索查询
          if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            const matchTitle = todo.title.toLowerCase().includes(query);
            const matchDesc = todo.description?.toLowerCase().includes(query);
            return matchTitle || matchDesc;
          }

          return true;
        });
      },

      // 获取统计数据
      getStats: () => {
        const { todos } = get();
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          total,
          completed,
          active,
          completionRate,
        };
      },

      // 获取所有分类
      getCategories: () => {
        const { todos } = get();
        const categories = new Set(todos.map((todo) => todo.category));
        return Array.from(categories).sort();
      },
    }),
    {
      name: 'todo-storage', // LocalStorage 键名
      version: 1,
    }
  )
);

