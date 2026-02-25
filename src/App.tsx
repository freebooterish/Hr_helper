import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import NameInput from './components/NameInput';
import PrizeDraw from './components/PrizeDraw';
import AutoGrouping from './components/AutoGrouping';
import { Gift, Grid3X3, Briefcase } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'draw' | 'group'>('draw');

  return (
    <AppProvider>
      <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-900">
        {/* Sidebar for Name Input */}
        <NameInput />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-20 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">HR 助手</h1>
                <p className="text-xs text-gray-500 font-medium">高效管理名单，轻松抽奖分组</p>
              </div>
            </div>

            <nav className="flex space-x-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setActiveTab('draw')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'draw'
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <Gift className="w-4 h-4" />
                奖品抽签
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'group'
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                自动分组
              </button>
            </nav>
          </header>

          {/* Active Feature View */}
          <main className="flex-1 overflow-hidden relative bg-gray-50/50">
            {activeTab === 'draw' ? <PrizeDraw /> : <AutoGrouping />}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
