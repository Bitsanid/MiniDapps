'use client'

import React, { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Loader2, Coins, TrendingUp } from 'lucide-react'
import { formatEther, parseEther } from 'viem'

// Contract ABI (simplified version)
const MARKETPLACE_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"}
    ],
    "name": "listItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "buyItem",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]

interface NFT {
  id: string
  name: string
  description: string
  imageUrl: string
  tokenId: string
  owner: string
  price?: string
  isListed?: boolean
}

interface NFTMarketplaceProps {
  nfts: NFT[]
  onListSuccess?: () => void
  onBuySuccess?: () => void
}

export function NFTMarketplace({ nfts, onListSuccess, onBuySuccess }: NFTMarketplaceProps) {
  const { address, isConnected } = useAccount()
  const [listingTokenId, setListingTokenId] = useState('')
  const [listingPrice, setListingPrice] = useState('0.01')
  const [isListing, setIsListing] = useState(false)

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleList = (tokenId: string, price: string) => {
    if (!isConnected || !address) return

    setIsListing(true)
    setListingTokenId(tokenId)
    setListingPrice(price)

    writeContract({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'listItem',
      args: [BigInt(tokenId), parseEther(price)]
    })
  }

  const handleBuy = (tokenId: string, price: string) => {
    if (!isConnected || !address) return

    writeContract({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'buyItem',
      args: [BigInt(tokenId)],
      value: parseEther(price)
    })
  }

  React.useEffect(() => {
    if (isConfirmed) {
      setIsListing(false)
      if (listingTokenId) {
        onListSuccess?.()
      } else {
        onBuySuccess?.()
      }
    }
  }, [isConfirmed, listingTokenId, onListSuccess, onBuySuccess])

  if (!isConnected) {
    return (
      <Alert>
        <Coins className="h-4 w-4" />
        <AlertDescription>
          Connect your wallet to trade NFTs
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <TrendingUp className="h-6 w-6" />
          NFT Marketplace
        </h2>
        <p className="text-muted-foreground">Buy and sell NFT badges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <Card key={nft.id} className="overflow-hidden">
            <div className="aspect-square bg-muted relative">
              <img
                src={nft.imageUrl || '/api/placeholder/200/200'}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
              {nft.isListed && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  For Sale
                </Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{nft.name}</CardTitle>
              <CardDescription>{nft.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nft.isListed && nft.price ? (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{nft.price} ETH</span>
                  <Button
                    size="sm"
                    onClick={() => handleBuy(nft.tokenId, nft.price)}
                    disabled={isPending || isConfirming}
                  >
                    {(isPending || isConfirming) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </div>
              ) : nft.owner === address ? (
                <div className="space-y-2">
                  <Label htmlFor={`price-${nft.id}`}>Set Price (ETH)</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`price-${nft.id}`}
                      type="number"
                      step="0.001"
                      min="0.001"
                      defaultValue="0.01"
                      placeholder="0.01"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById(`price-${nft.id}`) as HTMLInputElement
                        handleList(nft.tokenId, input.value)
                      }}
                      disabled={isPending || isConfirming}
                    >
                      {isListing && listingTokenId === nft.tokenId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'List'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <Badge variant="outline">Not for sale</Badge>
              )}
            </CardContent>
          </Card>
        ))}
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