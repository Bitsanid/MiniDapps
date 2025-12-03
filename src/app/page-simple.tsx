'use client'

import { useState } from 'react'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [message, setMessage] = useState('')

  const handleConnect = () => {
    setWalletConnected(true)
  }

  const handleDisconnect = () => {
    setWalletConnected(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">Web3IDN</h1>
            <button
              onClick={walletConnected ? handleDisconnect : handleConnect}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {walletConnected ? 'Disconnect' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Web3IDN</h2>
          <p className="text-muted-foreground mb-6">
            Learn Blockchain, Mint NFT Badges, Trade & Stake on Base Network
          </p>
          
          {walletConnected ? (
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-lg">Wallet Connected!</p>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-muted-foreground">Your message: {message}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">📚 Learn</h3>
                  <p className="text-sm">Complete blockchain courses</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🏆 Earn</h3>
                  <p className="text-sm">Mint NFT badges</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">💎 Trade</h3>
                  <p className="text-sm">Buy & sell NFTs</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>Please connect your wallet to get started</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                <div className="p-6 border rounded-lg">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="font-semibold mb-2">Learn Blockchain</h3>
                  <p className="text-sm text-muted-foreground">Master DeFi, Web3, and Crypto with expert-led courses</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="font-semibold mb-2">Earn NFT Badges</h3>
                  <p className="text-sm text-muted-foreground">Complete courses to mint exclusive NFT badges</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="font-semibold mb-2">Trade & Stake</h3>
                  <p className="text-sm text-muted-foreground">Buy, sell, and stake NFTs to earn rewards</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}