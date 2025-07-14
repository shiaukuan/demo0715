"use client";

import { useState, useMemo } from "react";
import { TodoItem } from "./todo-item";
import { Search } from "lucide-react";
import { Todo } from "@/lib/database.types";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, title: string, description?: string) => void;
  onDelete: (id: string) => void;
  onImageUpdate?: (id: string, imageFile: File) => void;
  onImageRemove?: (id: string) => void;
}

type FilterType = 'all' | 'active' | 'completed';

export function TodoList({ todos, onToggle, onUpdate, onDelete, onImageUpdate, onImageRemove }: TodoListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    // Sort by created_at (newest first)
    return filtered.sort((a, b) => 
      new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
    );
  }, [todos, searchTerm, filter]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);


  return (
    <div className="space-y-6">
      {/* Stats Display */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="bg-black text-white px-4 py-2 border-2 border-white transform rotate-1 font-bold uppercase tracking-wide" style={{fontFamily: "'Barrio', cursive", boxShadow: '3px 3px 0px #C41E3A'}}>
          TOTAL: {stats.total}
        </div>
        <div className="bg-red-600 text-white px-4 py-2 border-2 border-white transform -rotate-1 font-bold uppercase tracking-wide" style={{fontFamily: "'Barrio', cursive", boxShadow: '3px 3px 0px #000'}}>
          ACTIVE: {stats.active}
        </div>
        <div className="bg-green-600 text-white px-4 py-2 border-2 border-white transform rotate-1 font-bold uppercase tracking-wide" style={{fontFamily: "'Barrio', cursive", boxShadow: '3px 3px 0px #000'}}>
          DONE: {stats.completed}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
          <input
            type="text"
            placeholder="SEARCH YOUR TODOS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-3 border-black bg-white text-black font-bold uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            style={{
              fontFamily: "'Rye', cursive",
              borderRadius: 0,
              boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)',
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-3 border-3 border-black font-bold uppercase tracking-wide transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
            style={{
              fontFamily: "'Barrio', cursive",
              borderRadius: 0,
              boxShadow: '2px 2px 0px #C41E3A',
            }}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-3 border-3 border-black font-bold uppercase tracking-wide transition-all duration-200 ${
              filter === 'active' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
            style={{
              fontFamily: "'Barrio', cursive",
              borderRadius: 0,
              boxShadow: '2px 2px 0px #C41E3A',
            }}
          >
            ACTIVE
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-3 border-3 border-black font-bold uppercase tracking-wide transition-all duration-200 ${
              filter === 'completed' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
            style={{
              fontFamily: "'Barrio', cursive",
              borderRadius: 0,
              boxShadow: '2px 2px 0px #C41E3A',
            }}
          >
            DONE
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-black text-white px-8 py-6 border-4 border-white transform rotate-1 inline-block font-bold uppercase tracking-wide text-xl" style={{fontFamily: "'Nosifer', cursive", boxShadow: '5px 5px 0px #C41E3A'}}>
              {searchTerm ? (
                `NO TODOS FOUND FOR "${searchTerm.toUpperCase()}"`
              ) : filter === 'active' ? (
                'NO ACTIVE TODOS. GREAT JOB!'
              ) : filter === 'completed' ? (
                'NO COMPLETED TODOS YET.'
              ) : (
                'NO TODOS YET. CREATE YOUR FIRST ONE!'
              )}
            </div>
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`transform transition-all duration-300 ${
                index % 2 === 0 ? 'rotate-0.5' : '-rotate-0.5'
              }`}
            >
              <TodoItem
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onImageUpdate={onImageUpdate}
                onImageRemove={onImageRemove}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}