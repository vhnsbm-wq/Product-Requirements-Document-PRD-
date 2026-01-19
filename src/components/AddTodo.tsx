import { useState } from 'react';
import { X } from 'lucide-react';
import { useTodoStore } from '../store/useTodoStore';
import { validateTodo } from '../utils';
import { DEFAULT_CATEGORIES, PRIORITY_CONFIG } from '../utils/constants';
import type { Priority } from '../types/todo';

/**
 * AddTodo 组件属性
 */
interface AddTodoProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

/**
 * 表单数据接口
 */
interface FormData {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
}

/**
 * 表单错误接口
 */
interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
}

/**
 * AddTodo 组件
 * 用于添加新的待办事项
 */
export function AddTodo({ onClose, onSuccess }: AddTodoProps) {
  const addTodo = useTodoStore((state) => state.addTodo);
  const categories = useTodoStore((state) => state.getCategories());

  // 表单状态
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
  });

  // 错误状态
  const [errors, setErrors] = useState<FormErrors>({});

  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证标题
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    } else if (formData.title.length > 100) {
      newErrors.title = '标题长度不能超过 100 个字符';
    }

    // 验证描述
    if (formData.description.length > 500) {
      newErrors.description = '描述长度不能超过 500 个字符';
    }

    // 验证分类
    if (formData.category.length > 50) {
      newErrors.category = '分类名称长度不能超过 50 个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理输入变化
   */
  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // 清除该字段的错误
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 准备数据
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        isCompleted: false,
        priority: formData.priority,
        category: formData.category.trim() || '默认',
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      };

      // 使用工具函数验证
      const { valid, errors: validationErrors } = validateTodo(todoData);

      if (!valid) {
        setErrors({
          title: validationErrors[0],
        });
        return;
      }

      // 添加任务
      addTodo(todoData);

      // 重置表单
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        dueDate: '',
      });

      // 调用成功回调
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('添加任务失败:', error);
      setErrors({
        title: '添加任务失败，请重试',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 处理取消
   */
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: '',
    });
    setErrors({});
    onClose?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">添加新任务</h2>
        {onClose && (
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <X size={24} className="text-slate-600" />
          </button>
        )}
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 标题输入 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="输入任务标题..."
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-primary-500'
            }`}
            maxLength={100}
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            {formData.title.length}/100 字符
          </p>
        </div>

        {/* 描述输入 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            描述 <span className="text-slate-400">(选填)</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="添加任务描述..."
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.description
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-primary-500'
            }`}
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            {formData.description.length}/500 字符
          </p>
        </div>

        {/* 优先级和分类 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 优先级选择 */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
              优先级
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}优先级
                </option>
              ))}
            </select>
            {/* 优先级预览 */}
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  PRIORITY_CONFIG[formData.priority].bgColor
                } border-2 ${PRIORITY_CONFIG[formData.priority].borderColor}`}
              />
              <span className={`text-sm ${PRIORITY_CONFIG[formData.priority].color}`}>
                {PRIORITY_CONFIG[formData.priority].label}优先级
              </span>
            </div>
          </div>

          {/* 分类选择 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              分类 <span className="text-slate-400">(选填)</span>
            </label>
            <input
              id="category"
              type="text"
              list="categories"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="输入或选择分类..."
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.category
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-primary-500'
              }`}
              maxLength={50}
            />
            <datalist id="categories">
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>

        {/* 截止日期 */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
            截止日期 <span className="text-slate-400">(选填)</span>
          </label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        {/* 按钮组 */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting ? '添加中...' : '添加任务'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

