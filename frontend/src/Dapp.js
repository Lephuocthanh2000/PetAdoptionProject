import { Navbar } from './components/navbar'
import { PetItem } from './components/petItem'
import { TxError } from './components/txError'
import { WalletNotDetected } from './components/WalletNotDetected'
import { WalletConnect } from './components/WalletConnect'
import { useEffect } from 'react'
import { useState } from 'react'
export function Dapp() {
  const HARDHAT_NETWORK_ID = Number(process.env.REACT_APP_NETWORK_ID)
  const [pets, setPets] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(undefined)
  useEffect(() => {
    async function fetchPets() {
      const res = await fetch('/pets.json')
      const data = await res.json()
      setPets(data)
    }

    fetchPets()
  }, [])
  async function connectWallet() {
    try {
      const [address] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      await checkNetwork()
      setSelectedAddress(address)
      window.ethereum.on('accountsChanged', ([newAddress]) => {
        if (newAddress === undefined) {
          setSelectedAddress(undefined)
          return
        }

        setSelectedAddress(newAddress)
        // connection to SC
        // getting owned pets
      })
    } catch (e) {
      console.error(e.message)
    }
  }
  // eslint-disable-next-line
  async function disConnectWallet() {
    try {
      const [address] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setSelectedAddress(address)
    } catch (e) {
      console.error(e.message)
    }
  }
  async function addNewChain(_chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${_chainId.toString(16)}`,
            chainName: 'Hardhat Network',
            nativeCurrency: {
              name: 'Custom ETH',
              symbol: 'cETH',
              decimals: 18,
            },
            rpcUrls: ['http://127.0.0.1:8545'],
          },
        ],
      })
    } catch (error) {
      console.error(error.message)
    }
  }
  async function switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (e) {
      // This error code indicates that the chain has not been added to MetaMask.

      console.log(typeof e.code)
      if (e.code === Number(4902)) {
        await addNewChain(chainId)
      }
    }
  }

  async function checkNetwork() {
    debugger
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID.toString()) {
      return switchNetwork(HARDHAT_NETWORK_ID)
    }

    return null
  }
  if (!window.ethereum) {
    return <WalletNotDetected />
  }
  if (!selectedAddress) {
    return <WalletConnect connect={connectWallet} />
  }
  return (
    <div className="container">
      <TxError />
      <br />
      <div className="navbar-container">
        <Navbar address={selectedAddress} />
      </div>
      {/* {JSON.stringify(pets)} */}
      <div className="items">
        {pets.map((pet) => (
          <PetItem key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}
