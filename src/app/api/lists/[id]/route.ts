import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const listId = parseInt(params.id)
    const body = await request.json()
    const { name, color } = body

    // Verify list exists and belongs to this session
    const existingList = await prisma.todoList.findFirst({
      where: {
        id: listId,
        sessionId
      }
    })

    if (!existingList) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      )
    }

    const updatedList = await prisma.todoList.update({
      where: { id: listId },
      data: {
        name: name !== undefined ? name : existingList.name,
        color: color !== undefined ? color : existingList.color
      },
      include: {
        _count: {
          select: { todos: true }
        }
      }
    })

    // Transform to match frontend expectations
    const transformedList = {
      id: updatedList.id,
      name: updatedList.name,
      color: updatedList.color,
      todo_count: updatedList._count.todos
    }

    return NextResponse.json(transformedList)
  } catch (error) {
    console.error('Error updating list:', error)
    return NextResponse.json(
      { error: 'Failed to update list' },
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

    const listId = parseInt(params.id)

    // Verify list exists and belongs to this session
    const existingList = await prisma.todoList.findFirst({
      where: {
        id: listId,
        sessionId
      }
    })

    if (!existingList) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      )
    }

    // Check if this is the last list
    const listCount = await prisma.todoList.count({
      where: { sessionId }
    })

    if (listCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last list' },
        { status: 400 }
      )
    }

    // Delete the list (todos will be cascade deleted due to schema)
    await prisma.todoList.delete({
      where: { id: listId }
    })

    return NextResponse.json({ message: 'List deleted successfully' })
  } catch (error) {
    console.error('Error deleting list:', error)
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    )
  }
}
