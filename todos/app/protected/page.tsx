import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { TodoApp } from "@/components/todo-app";
import { getTodos } from "@/app/actions/todos";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const todos = await getTodos();

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Welcome back, {data.user.email}! Manage your todos below.
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <TodoApp initialTodos={todos} />
      </div>
    </div>
  );
}
