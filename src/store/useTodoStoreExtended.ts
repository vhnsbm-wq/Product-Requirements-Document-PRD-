import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Todo, FilterState, TodoStats, Priority } from '../types/todo';

/**
 * 历史记录项
 */
interface HistoryItem {
  todos: Todo[];
  timestamp: number;
}

/**
 * 扩展的 Todo Store 状态接口
 */
interface TodoStoreExtended {
  // 基础状态
  todos: Todo[];
  filter: FilterState;
  
  // 历史记录（用于撤销/重做）
  history: HistoryItem[];
  historyIndex: number;
  
  // 选中的任务 ID（用于批量操作）
  selectedIds: string[];

  // ===== CRUD 操作 =====
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;

  // ===== 批量操作 =====
  batchDelete: (ids: string[]) => void;
  batchToggle: (ids: string[], completed: boolean) => void;
  batchUpdate: (ids: string[], updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  deleteCompleted: () => void;
  
  // ===== 选择操作 =====
  selectTodo: (id: string) => void;
  unselectTodo: (id: string) => void;
  selectAll: () => void;
  unselectAll: () => void;
  toggleSelect: (id: string) => void;

  // ===== 筛选操作 =====
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;

  // ===== 历史操作（撤销/重做）=====
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // ===== Selectors =====
  getFilteredTodos: () => Todo[];
  getStats: () => TodoStats;
  getCategories: () => string[];
  getTodoById: (id: string) => Todo | undefined;
  getSelectedTodos: () => Todo[];
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
 * 最大历史记录数
 */
const MAX_HISTORY = 50;

/**
 * 扩展的 Todo Store
 * 包含批量操作、撤销/重做等高级功能
 */
export const useTodoStoreExtended = create<TodoStoreExtended>()(
  persist(
    (set, get) => ({
      // ===== 初始状态 =====
      todos: [],
      filter: defaultFilter,
      history: [],
      historyIndex: -1,
      selectedIds: [],

      // ===== 辅助函数：保存历史记录 =====
      _saveHistory: () => {
        const { todos, history, historyIndex } = get();
        
        // 删除当前索引之后的历史记录
        const newHistory = history.slice(0, historyIndex + 1);
        
        // 添加新的历史记录
        newHistory.push({
          todos: JSON.parse(JSON.stringify(todos)),
          timestamp: Date.now(),
        });
        
        // 限制历史记录数量
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      // ===== CRUD 操作 =====
      addTodo: (todo) => {
        const newTodo: Todo = {
          ...todo,
          id: uuidv4(),
          createdAt: Date.now(),
        };
        
        set((state) => ({
          todos: [newTodo, ...state.todos],
        }));
        
        get()._saveHistory();
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        }));
        
        get()._saveHistory();
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
          selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
        }));
        
        get()._saveHistory();
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
          ),
        }));
        
        get()._saveHistory();
      },

      // ===== 批量操作 =====
      batchDelete: (ids) => {
        set((state) => ({
          todos: state.todos.filter((todo) => !ids.includes(todo.id)),
          selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        }));
        
        get()._saveHistory();
      },

      batchToggle: (ids, completed) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            ids.includes(todo.id) ? { ...todo, isCompleted: completed } : todo
          ),
        }));
        
        get()._saveHistory();
      },

      batchUpdate: (ids, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            ids.includes(todo.id) ? { ...todo, ...updates } : todo
          ),
        }));
        
        get()._saveHistory();
      },

      deleteCompleted: () => {
        const completedIds = get().todos
          .filter((todo) => todo.isCompleted)
          .map((todo) => todo.id);
        
        get().batchDelete(completedIds);
      },

      // ===== 选择操作 =====
      selectTodo: (id) => {
        set((state) => ({
          selectedIds: [...state.selectedIds, id],
        }));
      },

      unselectTodo: (id) => {
        set((state) => ({
          selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
        }));
      },

      selectAll: () => {
        const allIds = get().getFilteredTodos().map((todo) => todo.id);
        set({ selectedIds: allIds });
      },

      unselectAll: () => {
        set({ selectedIds: [] });
      },

      toggleSelect: (id) => {
        const { selectedIds } = get();
        if (selectedIds.includes(id)) {
          get().unselectTodo(id);
        } else {
          get().selectTodo(id);
        }
      },

      // ===== 筛选操作 =====
      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        }));
      },

      resetFilter: () => {
        set({ filter: defaultFilter });
      },

      // ===== 历史操作 =====
      undo: () => {
        const { history, historyIndex } = get();
        
        if (historyIndex > 0) {
          const previousState = history[historyIndex - 1];
          set({
            todos: JSON.parse(JSON.stringify(previousState.todos)),
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({
            todos: JSON.parse(JSON.stringify(nextState.todos)),
            historyIndex: historyIndex + 1,
          });
        }
      },

      canUndo: () => {
        return get().historyIndex > 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      // ===== Selectors =====
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

      getCategories: () => {
        const { todos } = get();
        const categories = new Set(todos.map((todo) => todo.category));
        return Array.from(categories).sort();
      },

      getTodoById: (id) => {
        return get().todos.find((todo) => todo.id === id);
      },

      getSelectedTodos: () => {
        const { todos, selectedIds } = get();
        return todos.filter((todo) => selectedIds.includes(todo.id));
      },
    }),
    {
      name: 'todo-storage-extended',
      version: 1,
      // 不持久化历史记录和选中状态
      partialize: (state) => ({
        todos: state.todos,
        filter: state.filter,
      }),
    }
  )
);

