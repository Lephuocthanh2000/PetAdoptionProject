import { Navbar } from './components/navbar'
import { PetItem } from './components/petItem'
import { TxError } from './components/txError'
import { WalletNotDetected } from './components/WalletNotDetected'
import { WalletConnect } from './components/WalletConnect'
import { useEffect } from 'react'
import { useState } from 'react'
export function Dapp() {
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
      setSelectedAddress(address)
    } catch (e) {
      console.error(e.message)
    }
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
