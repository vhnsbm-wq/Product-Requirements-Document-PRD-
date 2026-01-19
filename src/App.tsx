import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTodoStore } from './store/useTodoStore';
import { Modal } from './components/Modal';
import { AddTodo } from './components/AddTodo';

function App() {
  const [showModal, setShowModal] = useState(false);
  const todos = useTodoStore((state) => state.todos);
  const stats = useTodoStore((state) => state.getStats());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            智能待办事项
          </h1>
          <p className="text-slate-600">
            高效管理您的日常任务
          </p>
        </header>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {stats.total}
              </div>
              <div className="text-sm text-slate-600 mt-1">总任务</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-sm text-slate-600 mt-1">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats.active}
              </div>
              <div className="text-sm text-slate-600 mt-1">进行中</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.completionRate}%
              </div>
              <div className="text-sm text-slate-600 mt-1">完成率</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[400px]">
          {todos.length === 0 ? (
            // 空状态
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                欢迎使用智能待办事项
              </h2>
              <p className="text-slate-500 mb-6">
                点击下方按钮创建您的第一个任务
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                创建任务
              </button>
            </div>
          ) : (
            // 任务列表
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  我的任务
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  添加任务
                </button>
              </div>
              
              {/* 简单的任务列表 */}
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => useTodoStore.getState().toggleTodo(todo.id)}
                        className="mt-1 w-5 h-5 rounded border-slate-300"
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            todo.isCompleted
                              ? 'line-through text-slate-400'
                              : 'text-slate-800'
                          }`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              todo.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : todo.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {todo.priority === 'high'
                              ? '高'
                              : todo.priority === 'medium'
                              ? '中'
                              : '低'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {todo.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => useTodoStore.getState().deleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>基于 React + TypeScript + Vite 构建</p>
        </footer>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <AddTodo
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            console.log('任务添加成功！');
            setShowModal(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;

