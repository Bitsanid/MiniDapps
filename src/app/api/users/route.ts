import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    const username = searchParams.get('username')

    let whereClause = {}
    if (walletAddress) {
      whereClause = { walletAddress }
    } else if (username) {
      whereClause = { username }
    }

    const users = await db.user.findMany({
      where: whereClause,
      include: {
        ownedNfts: {
          include: {
            nftBadge: true
          }
        },
        courseProgress: {
          include: {
            course: true
          }
        },
        posts: {
          include: {
            comments: true,
            reactions: true
          },
          orderBy: { createdAt: 'desc' }
        },
        stakedNfts: {
          include: {
            ownedNft: {
              include: {
                nftBadge: true
              }
            }
          }
        },
        pointHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, username, bio, profileImage, socialHandles } = await request.json()

    const user = await db.user.upsert({
      where: { walletAddress },
      update: {
        username,
        bio,
        profileImage,
        twitterHandle: socialHandles?.twitter,
        githubHandle: socialHandles?.github,
        discordHandle: socialHandles?.discord,
        telegramHandle: socialHandles?.telegram,
        farcasterHandle: socialHandles?.farcaster
      },
      create: {
        walletAddress,
        username,
        bio,
        profileImage,
        twitterHandle: socialHandles?.twitter,
        githubHandle: socialHandles?.github,
        discordHandle: socialHandles?.discord,
        telegramHandle: socialHandles?.telegram,
        farcasterHandle: socialHandles?.farcaster
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 })
  }
}