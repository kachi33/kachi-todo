import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('X-Session-ID')
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const listId = searchParams.get('list_id')

    const where: any = { sessionId }
    if (listId) {
      where.listId = parseInt(listId)
    }

    const todos = await prisma.todo.findMany({
      where,
      include: {
        todoList: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match frontend expectations
    const transformedTodos = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      detail: todo.detail,
      priority: todo.priority,
      due_date: todo.dueDate,
      due_time: todo.dueTime,
      completed: todo.completed,
      list_id: todo.listId,
      list_name: todo.todoList?.name || null,
      userId: todo.sessionId,
      created_at: todo.createdAt.toISOString(),
      updated_at: todo.updatedAt.toISOString()
    }))

    return NextResponse.json(transformedTodos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get('X-Session-ID')
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, detail, priority, due_date, due_time, list_id } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // If list_id is provided, ensure the list exists and belongs to this session
    if (list_id) {
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

    const todo = await prisma.todo.create({
      data: {
        title,
        detail: detail || null,
        priority: priority || 'medium',
        dueDate: due_date || null,
        dueTime: due_time || null,
        sessionId,
        listId: list_id || null
      },
      include: {
        todoList: list_id ? {
          select: {
            name: true
          }
        } : false
      }
    })

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
      list_name: todo.todoList?.name || null,
      userId: todo.sessionId,
      created_at: todo.createdAt.toISOString(),
      updated_at: todo.updatedAt.toISOString()
    }

    return NextResponse.json(transformedTodo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}
