import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { TodoApp } from "@/components/todo-app";
import { getTodos } from "@/app/actions/todos";
import "./fonts.css";
import styles from "./grunge-styles.module.css";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const todos = await getTodos();

  return (
    <div className={styles.punkContainer}>
      <div className="w-full">
        <div className={`${styles.welcomeMessage} relative`}>
          <InfoIcon size="20" strokeWidth={2} />
          WAKE UP {data.user.email?.split('@')[0].toUpperCase()}! GET YOUR TODOS DONE!
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <div className={styles.todoContainer}>
          <h1 className={styles.todoTitle}>TODO LIST</h1>
          <TodoApp initialTodos={todos} />
          {/* 添加飛濺效果 */}
          <div className={styles.splatter} style={{top: '20px', left: '30px'}}></div>
          <div className={styles.splatter} style={{top: '50px', right: '40px'}}></div>
          <div className={styles.splatter} style={{bottom: '30px', left: '50px'}}></div>
        </div>
      </div>
    </div>
  );
}
