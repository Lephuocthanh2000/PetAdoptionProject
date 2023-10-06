import { Navbar } from './components/navbar'
import { PetItem } from './components/petItem'
import { TxError } from './components/txError'
import { WalletNotDetected } from './components/WalletNotDetected'
import { WalletConnect } from './components/WalletConnect'
import { TxInfo } from './components/TxInfo'

import { useEffect } from 'react'
import { useState } from 'react'

import { ethers } from 'ethers'
import contractAddress from './contracts/contract-address-hardhat.json'
import PetAdoptionArtifact from './contracts/PetAdoption.json'
export function Dapp() {
  const HARDHAT_NETWORK_ID = Number(process.env.REACT_APP_NETWORK_ID)
  const [pets, setPets] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [adoptedPets, setAdoptedPets] = useState([])
  const [ownedPets, setOwnedPets] = useState([])
  const [txError, setTxError] = useState(undefined)
  const [txInfo, setTxInfo] = useState(undefined)
  const [view, setView] = useState('home')
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
      initiliazeDapp(address)
      window.ethereum.on('accountsChanged', ([newAddress]) => {
        if (newAddress === undefined) {
          setSelectedAddress(undefined)
          setAdoptedPets([])
          setOwnedPets([])
          setContract(undefined)
          setTxError(undefined)
          setTxInfo(undefined)
          setView('home')
          return
        }

        initiliazeDapp(newAddress)
        // connection to SC
        // getting owned pets
      })
    } catch (e) {
      setTxError(e?.reason)
    }
  }
  async function initiliazeDapp(address) {
    setSelectedAddress(address)
    const contract = await initContract()
    getAdoptedPets(contract)
  }

  async function initContract() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner(0)
    const contract = new ethers.Contract(
      contractAddress.PetAdoption,
      PetAdoptionArtifact.abi,
      signer
    )

    setContract(contract)
    return contract
  }
  async function adoptPet(id) {
    try {
      const tx = await contract.adoptPet(id)
      setTxInfo(tx.hash)
      const receipt = await tx.wait()
      await new Promise((res) => setTimeout(res, 2000))
      if (receipt.status === 0) {
        throw new Error('Transaction failed!')
      }

      alert(`Pet with id: ${id} has been adopted!`)
      setAdoptedPets([...adoptedPets, id])
      setOwnedPets([...ownedPets, id])
    } catch (e) {
      console.error(e.reason)
    } finally {
      setTxInfo(undefined)
    }
  }
  async function getAdoptedPets(contract) {
    try {
      const adoptedPets = await contract.getAllAdoptedPets()
      const ownedPets = await contract.getAllAdoptedPetsByOnwer()
      if (adoptedPets.length > 0) {
        setAdoptedPets(adoptedPets.map((petIdx) => Number(petIdx)))
      } else {
        setAdoptedPets([])
      }
      if (ownedPets.length > 0) {
        setOwnedPets(ownedPets.map((petIdx) => Number(petIdx)))
      } else {
        setOwnedPets([])
      }
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
      {txInfo && <TxInfo message={txInfo} />}
      {txError && <TxError dismiss={() => setTxError(undefined)} />}
      {view}
      <Navbar setView={setView} address={selectedAddress} />

      <div className="items">
        {view === 'home'
          ? pets.map((pet) => (
              <PetItem
                key={pet.id}
                pet={pet}
                inProgress={!!txInfo}
                disabled={adoptedPets.includes(pet.id)}
                adoptPet={() => adoptPet(pet.id)}
              />
            ))
          : pets
              .filter((pet) => ownedPets.includes(pet.id))
              .map((pet) => (
                <PetItem
                  key={pet.id}
                  pet={pet}
                  disabled={true}
                  adoptPet={() => {}}
                />
              ))}
      </div>
    </div>
  )
}
