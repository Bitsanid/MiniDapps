import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        },
        badges: true,
        progress: {
          where: {
            userId: request.headers.get('x-user-id') || ''
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const { completed } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const progress = await db.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: params.id
        }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        userId,
        courseId: params.id,
        completed,
        completedAt: completed ? new Date() : null
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating course progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}