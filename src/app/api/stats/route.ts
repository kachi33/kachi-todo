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

    // Get all todos for this session
    const allTodos = await prisma.todo.findMany({
      where: { sessionId },
      select: {
        completed: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const totalTodos = allTodos.length
    const completedTodos = allTodos.filter(t => t.completed).length
    const pendingTodos = totalTodos - completedTodos
    const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

    // Get today's date boundaries (start and end of day in UTC)
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    // Todos created today
    const todosCreatedToday = allTodos.filter(
      t => t.createdAt >= todayStart && t.createdAt < todayEnd
    ).length

    // Todos completed today (based on updatedAt when completed status changed)
    const todosCompletedToday = allTodos.filter(
      t => t.completed && t.updatedAt >= todayStart && t.updatedAt < todayEnd
    ).length

    // Calculate active streak (consecutive days with completions)
    let activeStreak = 0
    let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    while (true) {
      const dayStart = new Date(currentDate)
      const dayEnd = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)

      const hasCompletions = allTodos.some(
        t => t.completed && t.updatedAt >= dayStart && t.updatedAt < dayEnd
      )

      if (hasCompletions) {
        activeStreak++
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
      } else {
        break
      }

      // Limit streak calculation to prevent infinite loops
      if (activeStreak > 365) break
    }

    // Calculate productivity score (0-100)
    // Components:
    // - Completion rate: 40% weight
    // - Todos completed today: 10 pts each (max 50)
    // - Active streak: 5 pts per day (max 30)
    // - Total todos: 2 pts each (max 20)
    const completionScore = (completionRate / 100) * 40
    const todayScore = Math.min(todosCompletedToday * 10, 50)
    const streakScore = Math.min(activeStreak * 5, 30)
    const totalScore = Math.min(totalTodos * 2, 20)

    const totalProductivityScore = Math.round(
      completionScore + todayScore + streakScore + totalScore
    )

    const stats = {
      total_todos: totalTodos,
      completed_todos: completedTodos,
      pending_todos: pendingTodos,
      completion_rate: Math.round(completionRate * 100) / 100,
      todos_created_today: todosCreatedToday,
      todos_completed_today: todosCompletedToday,
      active_streak: activeStreak,
      total_productivity_score: Math.min(totalProductivityScore, 100)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error calculating stats:', error)
    return NextResponse.json(
      { error: 'Failed to calculate stats' },
      { status: 500 }
    )
  }
}
