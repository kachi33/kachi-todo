import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.headers.get('X-Session-ID')
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 401 }
      )
    }

    const todoId = parseInt(params.id)
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        sessionId
      },
      include: {
        todoList: {
          select: {
            name: true
          }
        }
      }
    })

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    // Transform to match frontend expectations
    const transformedTodo = {
      id: todo.id,
      title: todo.title,
      detail: todo.detail,
      priority: todo.priority,
      due_date: todo.dueDate,
      due_time: todo.dueTime,
      completed: todo.completed,
      list_id: todo.listId,
      list_name: todo.todoList.name,
      userId: todo.sessionId,
      created_at: todo.createdAt.toISOString(),
      updated_at: todo.updatedAt.toISOString()
    }

    return NextResponse.json(transformedTodo)
  } catch (error) {
    console.error('Error fetching todo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.headers.get('X-Session-ID')
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 401 }
      )
    }

    const todoId = parseInt(params.id)
    const body = await request.json()
    const { title, detail, priority, due_date, due_time, completed, list_id } = body

    // Verify todo exists and belongs to this session
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        sessionId
      }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    // If list_id is being changed, verify it exists and belongs to this session
    if (list_id && list_id !== existingTodo.listId) {
      const list = await prisma.todoList.findFirst({
        where: {
          id: list_id,
          sessionId
        }
      })

      if (!list) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        )
      }
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title: title !== undefined ? title : existingTodo.title,
        detail: detail !== undefined ? detail : existingTodo.detail,
        priority: priority !== undefined ? priority : existingTodo.priority,
        dueDate: due_date !== undefined ? due_date : existingTodo.dueDate,
        dueTime: due_time !== undefined ? due_time : existingTodo.dueTime,
        completed: completed !== undefined ? completed : existingTodo.completed,
        listId: list_id !== undefined ? list_id : existingTodo.listId
      },
      include: {
        todoList: {
          select: {
            name: true
          }
        }
      }
    })

    // Transform to match frontend expectations
    const transformedTodo = {
      id: updatedTodo.id,
      title: updatedTodo.title,
      detail: updatedTodo.detail,
      priority: updatedTodo.priority,
      due_date: updatedTodo.dueDate,
      due_time: updatedTodo.dueTime,
      completed: updatedTodo.completed,
      list_id: updatedTodo.listId,
      list_name: updatedTodo.todoList.name,
      userId: updatedTodo.sessionId,
      created_at: updatedTodo.createdAt.toISOString(),
      updated_at: updatedTodo.updatedAt.toISOString()
    }

    return NextResponse.json(transformedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.headers.get('X-Session-ID')
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 401 }
      )
    }

    const todoId = parseInt(params.id)

    // Verify todo exists and belongs to this session
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        sessionId
      }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id: todoId }
    })

    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}
