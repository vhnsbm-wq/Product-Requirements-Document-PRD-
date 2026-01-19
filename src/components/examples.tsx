import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal, AddTodo, AddTodoQuick } from '../components';

/**
 * 示例 1: 使用 Modal + AddTodo（完整表单）
 */
export function Example1_ModalAddTodo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        添加任务
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AddTodo
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            console.log('任务添加成功！');
          }}
        />
      </Modal>
    </div>
  );
}

/**
 * 示例 2: 使用 AddTodo（不带 Modal）
 */
export function Example2_InlineAddTodo() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <AddTodo
        onSuccess={() => {
          console.log('任务添加成功！');
        }}
      />
    </div>
  );
}

/**
 * 示例 3: 使用 AddTodoQuick（快速添加）
 */
export function Example3_QuickAddTodo() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">快速添加任务</h2>
      <AddTodoQuick
        onSuccess={() => {
          console.log('任务快速添加成功！');
        }}
      />
    </div>
  );
}

/**
 * 示例 4: 完整的应用布局
 */
export function Example4_CompleteLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            智能待办事项
          </h1>
          <p className="text-slate-600">高效管理您的日常任务</p>
        </header>

        {/* 快速添加区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            快速添加
          </h2>
          <AddTodoQuick />
        </div>

        {/* 或者使用完整表单按钮 */}
        <div className="text-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            添加详细任务
          </button>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddTodo
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              console.log('任务添加成功！');
            }}
          />
        </Modal>

        {/* 这里可以添加 TodoList 等其他组件 */}
      </div>
    </div>
  );
}

/**
 * 示例 5: 自定义样式的 AddTodoQuick
 */
export function Example5_CustomStyledQuick() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-4">
        今天要做什么？
      </h2>
      <AddTodoQuick
        className="[&_input]:bg-white/90 [&_select]:bg-white/90 [&_button]:bg-white [&_button]:text-blue-600 [&_button:hover]:bg-blue-50"
        onSuccess={() => {
          console.log('任务添加成功！');
        }}
      />
    </div>
  );
}

