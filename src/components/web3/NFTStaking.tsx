'use client'

import React, { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, Lock, Unlock, Trophy } from 'lucide-react'
import { formatEther, parseEther } from 'viem'

// Contract ABI (simplified version)
const STAKING_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "claimPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "getPendingPoints",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "isStaked",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getUserStakedTokens",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
]

interface StakedNFT {
  id: string
  name: string
  description: string
  imageUrl: string
  tokenId: string
  stakedAt?: number
  lastClaimedAt?: number
  pendingPoints?: number
}

interface NFTStakingProps {
  ownedNfts: StakedNFT[]
  onStakeSuccess?: () => void
  onUnstakeSuccess?: () => void
  onClaimSuccess?: () => void
}

export function NFTStaking({ ownedNfts, onStakeSuccess, onUnstakeSuccess, onClaimSuccess }: NFTStakingProps) {
  const { address, isConnected } = useAccount()
  const [stakingTokenId, setStakingTokenId] = useState('')
  const [isStaking, setIsStaking] = useState(false)

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Get user's staked tokens
  const { data: stakedTokens } = useReadContract({
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'getUserStakedTokens',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address
    }
  })

  // Get pending points for each token
  const { data: pendingPoints } = useReadContract({
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'getPendingPoints',
    args: [BigInt(stakingTokenId || '0')],
    query: {
      enabled: !!stakingTokenId
    }
  })

  const handleStake = (tokenId: string) => {
    if (!isConnected || !address) return

    setIsStaking(true)
    setStakingTokenId(tokenId)

    writeContract({
      address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [BigInt(tokenId)]
    })
  }

  const handleUnstake = (tokenId: string) => {
    if (!isConnected || !address) return

    writeContract({
      address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [BigInt(tokenId)]
    })
  }

  const handleClaimPoints = (tokenId: string) => {
    if (!isConnected || !address) return

    writeContract({
      address: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'claimPoints',
      args: [BigInt(tokenId)]
    })
  }

  React.useEffect(() => {
    if (isConfirmed) {
      setIsStaking(false)
      if (stakingTokenId) {
        onStakeSuccess?.()
      } else {
        onUnstakeSuccess?.()
      }
    }
  }, [isConfirmed, stakingTokenId, onStakeSuccess, onUnstakeSuccess])

  if (!isConnected) {
    return (
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Connect your wallet to stake NFTs and earn points
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6" />
          NFT Staking
        </h2>
        <p className="text-muted-foreground">Stake your NFT badges to earn 3 points daily</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available NFTs to Stake */}
        <Card>
          <CardHeader>
            <CardTitle>Available NFTs</CardTitle>
            <CardDescription>Stake these NFTs to earn points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ownedNfts.filter(nft => !stakedTokens?.includes(BigInt(nft.tokenId))).map((nft) => (
              <div key={nft.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <img
                  src={nft.imageUrl || '/api/placeholder/50/50'}
                  alt={nft.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{nft.name}</p>
                  <p className="text-sm text-muted-foreground">{nft.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleStake(nft.tokenId)}
                  disabled={isPending || isConfirming}
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Stake
                </Button>
              </div>
            ))}
            {ownedNfts.filter(nft => !stakedTokens?.includes(BigInt(nft.tokenId))).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No available NFTs to stake
              </p>
            )}
          </CardContent>
        </Card>

        {/* Staked NFTs */}
        <Card>
          <CardHeader>
            <CardTitle>Staked NFTs</CardTitle>
            <CardDescription>Earning 3 points per day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ownedNfts.filter(nft => stakedTokens?.includes(BigInt(nft.tokenId))).map((nft) => (
              <div key={nft.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <img
                  src={nft.imageUrl || '/api/placeholder/50/50'}
                  alt={nft.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{nft.name}</p>
                  <p className="text-sm text-muted-foreground">{nft.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">Staked</Badge>
                    <span className="text-xs text-muted-foreground">
                      {pendingPoints ? `${pendingPoints} pending points` : 'Loading...'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleClaimPoints(nft.tokenId)}
                    disabled={isPending || isConfirming || !pendingPoints}
                  >
                    Claim
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUnstake(nft.tokenId)}
                    disabled={isPending || isConfirming}
                  >
                    <Unlock className="h-4 w-4 mr-1" />
                    Unstake
                  </Button>
                </div>
              </div>
            ))}
            {ownedNfts.filter(nft => stakedTokens?.includes(BigInt(nft.tokenId))).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No staked NFTs
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Badge variant="outline" className="text-lg px-4 py-2">
          🏆 Earn 3 points daily per staked NFT
        </Badge>
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
            Transaction: {hash}
            {isConfirming && ' (Confirming...)'}
            {isConfirmed && ' ✓ Confirmed!'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}