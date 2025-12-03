'use client'

import React, { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trophy, Star } from 'lucide-react'
import { parseEther } from 'viem'

// Contract ABI (simplified version)
const BADGES_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "courseCategory", "type": "string"},
      {"internalType": "uint256", "name": "courseId", "type": "uint256"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "mintBadge",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const courseCategories = ['Blockchain', 'Crypto', 'DeFi', 'Web3', 'Dex']

interface MintNFTBadgeProps {
  courseId: string
  courseTitle: string
  courseCategory: string
  onMintSuccess?: () => void
}

export function MintNFTBadge({ courseId, courseTitle, courseCategory, onMintSuccess }: MintNFTBadgeProps) {
  const { address, isConnected } = useAccount()
  const [badgeName, setBadgeName] = useState(`${courseTitle} Graduate`)
  const [badgeDescription, setBadgeDescription] = useState(`Successfully completed ${courseTitle} course`)
  const [tokenURI, setTokenURI] = useState('')
  const [isMinting, setIsMinting] = useState(false)

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = async () => {
    if (!isConnected || !address) {
      return
    }

    setIsMinting(true)
    
    try {
      writeContract({
        address: process.env.NEXT_PUBLIC_BADGES_CONTRACT_ADDRESS as `0x${string}`,
        abi: BADGES_ABI,
        functionName: 'mintBadge',
        args: [
          address,
          badgeName,
          badgeDescription,
          courseCategory,
          BigInt(courseId),
          tokenURI || `https://gateway.pinata.cloud/ipfs/QmDefault${courseId}`
        ]
      })
    } catch (error) {
      console.error('Minting error:', error)
      setIsMinting(false)
    }
  }

  React.useEffect(() => {
    if (isConfirmed) {
      setIsMinting(false)
      onMintSuccess?.()
    }
  }, [isConfirmed, onMintSuccess])

  if (!isConnected) {
    return (
      <Alert>
        <Trophy className="h-4 w-4" />
        <AlertDescription>
          Connect your wallet to mint NFT badges
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Mint NFT Badge
        </CardTitle>
        <CardDescription>
          Mint a free NFT badge for completing this course (gas fees apply)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="badgeName">Badge Name</Label>
            <Input
              id="badgeName"
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
              placeholder="Enter badge name"
            />
          </div>
          <div>
            <Label htmlFor="courseCategory">Category</Label>
            <Badge variant="secondary" className="mt-2">
              {courseCategory}
            </Badge>
          </div>
        </div>

        <div>
          <Label htmlFor="badgeDescription">Description</Label>
          <Textarea
            id="badgeDescription"
            value={badgeDescription}
            onChange={(e) => setBadgeDescription(e.target.value)}
            placeholder="Describe your achievement"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="tokenURI">Token URI (optional)</Label>
          <Input
            id="tokenURI"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            placeholder="IPFS URI for badge metadata"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>Free minting - only gas fees required</span>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}

        {hash && (
          <Alert>
            <AlertDescription>
              Transaction submitted: {hash}
              {isConfirming && ' (Confirming...)'}
              {isConfirmed && ' ✓ Confirmed!'}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleMint}
          disabled={isPending || isConfirming || isMinting}
          className="w-full"
        >
          {(isPending || isConfirming || isMinting) ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isConfirming ? 'Confirming...' : 'Minting...'}
            </>
          ) : (
            <>
              <Trophy className="h-4 w-4 mr-2" />
              Mint Badge
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}