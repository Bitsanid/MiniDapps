'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Trophy, 
  Users, 
  MessageSquare, 
  Send,
  GraduationCap,
  Coins,
  TrendingUp,
  Lock,
  Wallet,
  LogOut
} from 'lucide-react'

// Mock data for demonstration
const mockCourses = [
  {
    id: '1',
    title: 'Blockchain Fundamentals',
    description: 'Learn the basics of blockchain technology',
    category: 'Blockchain',
    difficulty: 'beginner',
    modules: [
      { title: 'What is Blockchain?', content: 'Blockchain is a distributed ledger technology that maintains a secure and decentralized record of transactions.' },
      { title: 'How Blocks Work', content: 'Blocks contain transaction data and are linked together in a chain using cryptographic hashes.' },
      { title: 'Consensus Mechanisms', content: 'Proof of Work, Proof of Stake, and other consensus algorithms ensure network agreement.' }
    ],
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Introduction to DeFi',
    description: 'Decentralized Finance explained',
    category: 'DeFi',
    difficulty: 'intermediate',
    modules: [
      { title: 'What is DeFi?', content: 'DeFi refers to financial applications built on blockchain technology that aim to disrupt traditional finance.' },
      { title: 'Lending and Borrowing', content: 'Decentralized lending protocols allow users to lend and borrow without intermediaries.' },
      { title: 'Yield Farming', content: 'Earning rewards by providing liquidity to decentralized exchanges and protocols.' }
    ],
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Web3 Development',
    description: 'Build decentralized applications',
    category: 'Web3',
    difficulty: 'advanced',
    modules: [
      { title: 'Smart Contracts', content: 'Self-executing contracts with the terms of the agreement directly written into code.' },
      { title: 'Ethereum and Solidity', content: 'Programming smart contracts using the Solidity language for Ethereum Virtual Machine.' },
      { title: 'DIP Standards', content: 'ERC-20, ERC-721, ERC-1155 and other Ethereum Improvement Proposals.' }
    ],
    imageUrl: '/api/placeholder/300/200'
  }
]

const mockPosts = [
  {
    id: '1',
    content: 'Just completed the Blockchain Fundamentals course! 🎓 The NFT badge looks amazing!',
    userName: 'CryptoLearner',
    userAvatar: '/api/placeholder/40/40',
    createdAt: '2 hours ago',
    reactions: { '🎉': 12, '🚀': 8, '❤️': 5 },
    comments: [
      { id: '1', content: 'Congratulations! 🎉', userName: 'Web3Dev', createdAt: '1 hour ago' }
    ]
  },
  {
    id: '2',
    content: 'Staking my NFT badges and earning daily points. This platform is awesome! 💎',
    userName: 'NFTCollector',
    userAvatar: '/api/placeholder/40/40',
    createdAt: '4 hours ago',
    reactions: { '💎': 15, '🔥': 10 },
    comments: []
  }
]

const mockNFTs = [
  {
    id: '1',
    name: 'Blockchain Graduate',
    description: 'Completed Blockchain Fundamentals',
    imageUrl: '/api/placeholder/200/200',
    tokenId: '1',
    owner: '0x123...',
    price: '0.05',
    isListed: true
  },
  {
    id: '2',
    name: 'DeFi Expert',
    description: 'Master of Decentralized Finance',
    imageUrl: '/api/placeholder/200/200',
    tokenId: '2',
    owner: '0x456...',
    isListed: false
  }
]

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('learn')
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [posts, setPosts] = useState(mockPosts)
  const [newPost, setNewPost] = useState('')
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    twitterHandle: '',
    githubHandle: '',
    discordHandle: '',
    telegramHandle: '',
    farcasterHandle: ''
  })

  const handleConnect = () => {
    setWalletConnected(true)
  }

  const handleDisconnect = () => {
    setWalletConnected(false)
  }

  const handlePostSubmit = () => {
    if (!newPost.trim() || !walletConnected) return

    const post = {
      id: Date.now().toString(),
      content: newPost,
      userName: userProfile.username || 'Anonymous',
      userAvatar: '/api/placeholder/40/40',
      createdAt: 'Just now',
      reactions: {},
      comments: []
    }

    setPosts([post, ...posts])
    setNewPost('')
  }

  const handleReaction = (postId: string, emoji: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const reactions = { ...post.reactions }
        reactions[emoji] = (reactions[emoji] || 0) + 1
        return { ...post, reactions }
      }
      return post
    }))
  }

  const totalPoints = 156

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold text-green-600">Web3IDN</h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Learn • Earn • Trade
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {walletConnected && (
                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">
                    <Coins className="h-3 w-3 mr-1" />
                    {totalPoints} pts
                  </Badge>
                </div>
              )}
              <Button
                onClick={walletConnected ? handleDisconnect : handleConnect}
                variant={walletConnected ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                {walletConnected ? (
                  <>
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trade</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Learn & Earn NFT Badges</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Master blockchain, DeFi, Web3, and more. Complete courses to mint exclusive NFT badges.
              </p>
            </div>

            {selectedCourse ? (
              <div className="space-y-6">
                <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                  ← Back to Courses
                </Button>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCourse.title}</CardTitle>
                    <CardDescription>{selectedCourse.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{selectedCourse.category}</Badge>
                      <Badge variant="outline">{selectedCourse.difficulty}</Badge>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Course Modules</h3>
                      {selectedCourse.modules.map((module: any, index: number) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Module {index + 1}: {module.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{module.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="border-green-600">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Mint NFT Badge
                        </CardTitle>
                        <CardDescription>
                          Free minting - only gas fees required
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" disabled={!walletConnected}>
                          <Trophy className="h-4 w-4 mr-2" />
                          {walletConnected ? 'Mint Badge' : 'Connect Wallet to Mint'}
                        </Button>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative">
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-green-600" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{course.category}</Badge>
                          <Badge variant="outline">{course.difficulty}</Badge>
                        </div>
                        <Button onClick={() => setSelectedCourse(course)}>
                          Start Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">NFT Staking</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stake your NFT badges to earn 3 points daily. Build your collection and increase your earnings.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Staked NFTs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockNFTs.filter(nft => nft.owner === '0x123...').map((nft) => (
                      <div key={nft.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded"></div>
                        <div className="flex-1">
                          <p className="font-medium">{nft.name}</p>
                          <p className="text-sm text-muted-foreground">{nft.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">Staked</Badge>
                            <span className="text-xs text-muted-foreground">3 pts/day</span>
                          </div>
                        </div>
                        <Button size="sm">Claim</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available NFTs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockNFTs.filter(nft => nft.owner === '0x123...').map((nft) => (
                      <div key={nft.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded"></div>
                        <div className="flex-1">
                          <p className="font-medium">{nft.name}</p>
                          <p className="text-sm text-muted-foreground">{nft.description}</p>
                        </div>
                        <Button size="sm">
                          <Lock className="h-4 w-4 mr-1" />
                          Stake
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">NFT Marketplace</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Buy and sell NFT badges from the community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <Trophy className="h-16 w-16 text-green-600" />
                    </div>
                    {nft.isListed && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        For Sale
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{nft.name}</CardTitle>
                    <CardDescription>{nft.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {nft.isListed && nft.price ? (
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{nft.price} ETH</span>
                        <Button disabled={!walletConnected}>
                          {walletConnected ? 'Buy Now' : 'Connect to Buy'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Not for sale</span>
                        <Button variant="outline" disabled={!walletConnected}>
                          {walletConnected ? 'List for Sale' : 'Connect to List'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Post */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Create Post
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Share your learning journey..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={handlePostSubmit}
                      disabled={!newPost.trim() || !walletConnected}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {walletConnected ? 'Post' : 'Connect Wallet to Post'}
                    </Button>
                  </CardContent>
                </Card>

                {/* User Profile */}
                {walletConnected && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Enter username"
                          value={userProfile.username}
                          onChange={(e) => setUserProfile({...userProfile, username: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself"
                          value={userProfile.bio}
                          onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            placeholder="@username"
                            value={userProfile.twitterHandle}
                            onChange={(e) => setUserProfile({...userProfile, twitterHandle: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            placeholder="username"
                            value={userProfile.githubHandle}
                            onChange={(e) => setUserProfile({...userProfile, githubHandle: e.target.value})}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Posts Feed */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold">Community Feed</h2>
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={post.userAvatar} />
                          <AvatarFallback>{post.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{post.userName}</span>
                            <span className="text-sm text-muted-foreground">{post.createdAt}</span>
                          </div>
                          <p className="mb-4">{post.content}</p>
                          
                          {/* Reactions */}
                          <div className="flex items-center gap-2 mb-4">
                            {Object.entries(post.reactions).map(([emoji, count]) => (
                              <Button
                                key={emoji}
                                variant="outline"
                                size="sm"
                                onClick={() => handleReaction(post.id, emoji)}
                                className="h-8 px-2"
                              >
                                {emoji} {count}
                              </Button>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(post.id, '🎉')}
                              className="h-8 px-2"
                            >
                              🎉
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(post.id, '🚀')}
                              className="h-8 px-2"
                            >
                              🚀
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(post.id, '❤️')}
                              className="h-8 px-2"
                            >
                              ❤️
                            </Button>
                          </div>

                          {/* Comments */}
                          {post.comments.length > 0 && (
                            <div className="border-t pt-4 space-y-2">
                              {post.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-2 text-sm">
                                  <span className="font-medium">{comment.userName}:</span>
                                  <span>{comment.content}</span>
                                  <span className="text-muted-foreground">{comment.createdAt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}