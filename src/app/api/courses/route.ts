import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        modules: {
          orderBy: { order: 'asc' }
        },
        badges: true,
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, difficulty, imageUrl, modules } = await request.json()

    const course = await db.course.create({
      data: {
        title,
        description,
        category,
        difficulty,
        imageUrl,
        modules: {
          create: modules.map((module: any, index: number) => ({
            title: module.title,
            content: module.content,
            order: index + 1
          }))
        }
      },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}