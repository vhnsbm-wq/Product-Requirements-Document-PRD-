import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTodoStore } from './store/useTodoStore';

function App() {
  const [showModal, setShowModal] = useState(false);
  const stats = useTodoStore((state) => state.getStats());

  return (
    <div className="min-h-screen py-8 px-4">
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

        {/* Stats Card - 临时展示 */}
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
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>基于 React + TypeScript + Vite 构建</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

