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
  if (window.ethereum === undefined) {
    return <WalletNotDetected />
  }
  if (selectedAddress === undefined) {
    return <WalletConnect />
  }
  return (
    <div className="container">
      <TxError />
      <br />
      <div className="navbar-container">
        <Navbar />
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
