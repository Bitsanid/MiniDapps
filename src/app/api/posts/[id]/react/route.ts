import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, emoji } = await request.json()

    if (!userId || !emoji) {
      return NextResponse.json({ error: 'userId and emoji are required' }, { status: 400 })
    }

    // Check if reaction already exists
    const existingReaction = await db.reaction.findUnique({
      where: {
        postId_userId_emoji: {
          postId: params.id,
          userId,
          emoji
        }
      }
    })

    if (existingReaction) {
      // Remove reaction if it exists
      await db.reaction.delete({
        where: {
          id: existingReaction.id
        }
      })
      return NextResponse.json({ action: 'removed' })
    } else {
      // Add new reaction
      const reaction = await db.reaction.create({
        data: {
          postId: params.id,
          userId,
          emoji
        }
      })
      return NextResponse.json({ action: 'added', reaction })
    }
  } catch (error) {
    console.error('Error toggling reaction:', error)
    return NextResponse.json({ error: 'Failed to toggle reaction' }, { status: 500 })
  }
}