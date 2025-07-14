"use client";

import { useState, useMemo } from "react";
import { TodoItem } from "./todo-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, CheckCircle, Circle, List } from "lucide-react";
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

  const getFilterIcon = (filterType: FilterType) => {
    switch (filterType) {
      case 'all': return <List className="h-4 w-4" />;
      case 'active': return <Circle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getFilterLabel = (filterType: FilterType) => {
    switch (filterType) {
      case 'all': return 'All';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Your Todos
            </CardTitle>
            <CardDescription>
              Manage your tasks and track your progress
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {stats.total} total
            </Badge>
            <Badge variant="outline">
              {stats.active} active
            </Badge>
            <Badge variant="default">
              {stats.completed} completed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {getFilterIcon(filter)}
                {getFilterLabel(filter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>
                <List className="mr-2 h-4 w-4" />
                All ({stats.total})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('active')}>
                <Circle className="mr-2 h-4 w-4" />
                Active ({stats.active})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('completed')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed ({stats.completed})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? (
                <p>No todos found matching &quot;{searchTerm}&quot;</p>
              ) : filter === 'active' ? (
                <p>No active todos. Great job!</p>
              ) : filter === 'completed' ? (
                <p>No completed todos yet.</p>
              ) : (
                <p>No todos yet. Create your first todo above!</p>
              )}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onImageUpdate={onImageUpdate}
                onImageRemove={onImageRemove}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}