import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, Shuffle, Copy, Check, Grid3X3, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AutoGrouping() {
  const { names } = useAppContext();
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateGroups = () => {
    if (names.length === 0) {
      return;
    }
    if (groupSize < 1) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate a slight delay for effect
    setTimeout(() => {
      // Shuffle array
      const shuffled = [...names].sort(() => 0.5 - Math.random());
      
      const newGroups: string[][] = [];
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push(shuffled.slice(i, i + groupSize));
      }
      
      setGroups(newGroups);
      setIsGenerating(false);
      setCopied(false);
    }, 600);
  };

  const copyToClipboard = () => {
    if (groups.length === 0) return;

    const text = groups.map((group, index) => {
      return `第 ${index + 1} 组:\n${group.join(', ')}`;
    }).join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    const maxLen = Math.max(...groups.map(g => g.length));
    const headers = ['组别', ...Array.from({length: maxLen}, (_, i) => `成员${i+1}`)];
    csvContent += headers.join(',') + '\n';

    groups.forEach((group, index) => {
      const row = [`第 ${index + 1} 组`, ...group];
      const escapedRow = row.map(cell => `"${cell.replace(/"/g, '""')}"`);
      csvContent += escapedRow.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "分组结果.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-indigo-600" />
              自动分组
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              将名单随机打乱并分配到指定人数的小组中
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                每组人数:
              </label>
              <input
                type="number"
                min="1"
                max={Math.max(1, names.length)}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center font-semibold"
              />
            </div>
            
            <button
              onClick={generateGroups}
              disabled={isGenerating || names.length === 0}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              <Shuffle className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? '分组中...' : '生成分组'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
        {groups.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-500">点击上方按钮开始分组</p>
            <p className="text-sm">当前名单共 {names.length} 人</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                分组结果 <span className="text-gray-500 font-normal text-sm ml-2">(共 {groups.length} 组)</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-md transition-colors font-medium"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制结果'}
                </button>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-md transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  下载 CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {groups.map((group, index) => (
                  <motion.div
                    key={`group-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05, type: 'spring' }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 flex justify-between items-center">
                      <h3 className="font-bold text-white tracking-wide">
                        第 {index + 1} 组
                      </h3>
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                        {group.length} 人
                      </span>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {group.map((member, mIndex) => (
                        <li key={`${member}-${mIndex}`} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">
                            {mIndex + 1}
                          </div>
                          <span className="text-gray-700 font-medium truncate">{member}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
