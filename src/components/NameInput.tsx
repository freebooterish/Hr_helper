import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Upload, Plus, Trash2, Users, Wand2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

export default function NameInput() {
  const { names, addNames, removeName, clearNames, removeDuplicates } = useAppContext();
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddText = () => {
    const newNames = inputText.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
    addNames(newNames);
    setInputText('');
  };

  const handleAddMockData = () => {
    const mockData = ['赵云', '关羽', '张飞', '马超', '黄忠', '魏延', '姜维', '诸葛亮', '庞统', '法正', '赵云', '关羽'];
    addNames(mockData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedNames: string[] = [];
        results.data.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach(cell => {
              if (typeof cell === 'string' && cell.trim() !== '') {
                parsedNames.push(cell.trim());
              }
            });
          } else if (typeof row === 'object' && row !== null) {
            Object.values(row).forEach(val => {
              if (typeof val === 'string' && val.trim() !== '') {
                parsedNames.push(val.trim());
              }
            });
          }
        });
        addNames(parsedNames);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const duplicateIndices = new Set<number>();
  const seen = new Set<string>();
  names.forEach((name, index) => {
    if (seen.has(name)) {
      duplicateIndices.add(index);
    } else {
      seen.add(name);
    }
  });
  const hasDuplicates = duplicateIndices.size > 0;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-80 shrink-0">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            名单管理
          </h2>
          <button
            onClick={handleAddMockData}
            className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
            title="添加测试数据"
          >
            <Wand2 className="w-3 h-3" />
            模拟名单
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          当前总人数: <span className="font-bold text-indigo-600">{names.length}</span>
        </p>
      </div>

      <div className="p-4 flex flex-col gap-4 border-b border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            手动输入 (每行或逗号分隔)
          </label>
          <textarea
            className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
            placeholder="张三&#10;李四&#10;王五"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleAddText}
            disabled={!inputText.trim()}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-2 px-4 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            添加名单
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-xs text-gray-500">或</span>
          </div>
        </div>

        <div>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            上传 CSV 文件
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">已添加名单</h3>
          <div className="flex items-center gap-2">
            {hasDuplicates && (
              <button
                onClick={removeDuplicates}
                className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md transition-colors"
              >
                <AlertCircle className="w-3 h-3" />
                去重
              </button>
            )}
            {names.length > 0 && (
              <button
                onClick={clearNames}
                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 px-1"
              >
                <Trash2 className="w-3 h-3" />
                清空
              </button>
            )}
          </div>
        </div>
        
        {names.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            暂无名单，请添加或上传
          </div>
        ) : (
          <ul className="space-y-2">
            {names.map((name, index) => {
              const isDuplicate = duplicateIndices.has(index);
              return (
                <li
                  key={`${name}-${index}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm group ${isDuplicate ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`truncate ${isDuplicate ? 'text-amber-700 font-medium' : 'text-gray-700'}`}>{name}</span>
                    {isDuplicate && (
                      <span className="bg-amber-100 text-amber-600 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">重复</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeName(index)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
