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

    const lists = await prisma.todoList.findMany({
      where: { sessionId },
      include: {
        _count: {
          select: { todos: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Transform to match frontend expectations
    const transformedLists = lists.map(list => ({
      id: list.id,
      name: list.name,
      color: list.color,
      todo_count: list._count.todos
    }))

    return NextResponse.json(transformedLists)
  } catch (error) {
    console.error('Error fetching lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
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
    const { name, color } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const list = await prisma.todoList.create({
      data: {
        name,
        color: color || 'blue',
        sessionId
      },
      include: {
        _count: {
          select: { todos: true }
        }
      }
    })

    // Transform to match frontend expectations
    const transformedList = {
      id: list.id,
      name: list.name,
      color: list.color,
      todo_count: list._count.todos
    }

    return NextResponse.json(transformedList, { status: 201 })
  } catch (error) {
    console.error('Error creating list:', error)
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    )
  }
}
