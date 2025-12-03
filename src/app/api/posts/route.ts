import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause = {}
    if (userId) {
      whereClause = { userId }
    }

    const posts = await db.post.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
            walletAddress: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                profileImage: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        reactions: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Group reactions by emoji
    const postsWithGroupedReactions = posts.map(post => ({
      ...post,
      reactions: post.reactions.reduce((acc: any, reaction) => {
        if (!acc[reaction.emoji]) {
          acc[reaction.emoji] = {
            emoji: reaction.emoji,
            count: 0,
            users: []
          }
        }
        acc[reaction.emoji].count++
        acc[reaction.emoji].users.push(reaction.user.username)
        return acc
      }, {})
    }))

    return NextResponse.json(postsWithGroupedReactions)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, userId } = await request.json()

    if (!content || !userId) {
      return NextResponse.json({ error: 'Content and userId are required' }, { status: 400 })
    }

    const post = await db.post.create({
      data: {
        content,
        userId
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
            walletAddress: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}