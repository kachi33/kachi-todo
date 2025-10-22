-- CreateTable
CREATE TABLE "todo_lists" (
    "id" SERIAL NOT NULL,
    "session_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "color" VARCHAR(20) NOT NULL DEFAULT 'blue',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todo_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todos" (
    "id" SERIAL NOT NULL,
    "session_id" VARCHAR(36) NOT NULL,
    "list_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "detail" TEXT,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "due_date" VARCHAR(10),
    "due_time" VARCHAR(5),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "todo_lists_session_id_idx" ON "todo_lists"("session_id");

-- CreateIndex
CREATE INDEX "todos_session_id_idx" ON "todos"("session_id");

-- CreateIndex
CREATE INDEX "todos_list_id_idx" ON "todos"("list_id");

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "todo_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
