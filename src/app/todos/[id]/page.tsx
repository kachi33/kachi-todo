'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchTodoById } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function TodoDetail(): React.JSX.Element {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const {
    data: todo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetchTodoById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-4">Loading todo...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading todo</div>;

  if (!todo) return <div className="p-4">Todo not found</div>;

  return (
    <main className="p-4 h-[100vh] items-center justify-center flex flex-col bg-stone-200">
      <div className="flex justify-between items-center mb-3 md:w-[50%] w-[80%] ">
        <Button onClick={() => router.back()}>
          <ArrowLeft />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Todo Details</h1>
      </div>
      <div className="border p-4 rounded-md shadow-sm md:w-[50%] w-[80%] h-[30vh] bg-white flex flex-col gap-4">
        <p>
          <strong>ID:</strong> {todo.id}
        </p>
        <p>
          <strong>Title:</strong> {todo.title}
        </p>
        <p>
          <strong>Status:</strong> {todo.completed ? "Completed" : "Incomplete"}
        </p>
      </div>
    </main>
  );
}

export default TodoDetail;
