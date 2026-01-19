import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTodoStore } from '../store/useTodoStore';
import type { Priority } from '../types/todo';

/**
 * AddTodoQuick 组件属性
 */
interface AddTodoQuickProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * AddTodoQuick 组件
 * 快速添加待办事项（单行输入）
 */
export function AddTodoQuick({ onSuccess, className = '' }: AddTodoQuickProps) {
  const addTodo = useTodoStore((state) => state.addTodo);
  
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  /**
   * 处理提交
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    if (!title.trim()) {
      setError('请输入任务标题');
      return;
    }

    if (title.length > 100) {
      setError('标题长度不能超过 100 个字符');
      return;
    }

    // 添加任务
    addTodo({
      title: title.trim(),
      isCompleted: false,
      priority,
      category: '默认',
    });

    // 重置
    setTitle('');
    setPriority('medium');
    setError('');
    
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        {/* 标题输入 */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="快速添加任务..."
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          maxLength={100}
        />

        {/* 优先级选择 */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">添加</span>
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}

