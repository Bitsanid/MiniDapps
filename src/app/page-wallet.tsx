'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/web3/WalletConnectSimple'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">Web3IDN</h1>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Web3IDN</h2>
          <p className="text-muted-foreground mb-6">
            Learn Blockchain, Mint NFT Badges, Trade & Stake on Base Network
          </p>
          
          {isConnected ? (
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-lg">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-muted-foreground">Your message: {message}</p>
            </div>
          ) : (
            <p>Please connect your wallet to get started</p>
          )}
        </div>
      </main>
    </div>
  )
}