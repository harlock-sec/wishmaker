import { useState } from 'react'
import { BrowserProvider, Contract } from 'ethers'

const CONTRACT = '0xDaC80f0b8C396eAe2024Bc112BF1D82b7a1226CE'
const ABI = [
  'function hasIdentity(address) view returns (bool)',
  'function createIdentity()',
  'function identityOf(address) view returns (uint256)',
]
const CHAIN_ID = '0x279f' // Monad Testnet 10143

type Ethereum = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }

declare global { interface Window { ethereum?: Ethereum } }

export default function WalletConnect() {
  const [address, setAddress] = useState('')
  const [hasIdentity, setHasIdentity] = useState<boolean | null>(null)
  const [tokenId, setTokenId] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  async function connect() {
    if (!window.ethereum) { setStatus('Install MetaMask and reload this page.'); return }
    setBusy(true)
    try {
      const eth = window.ethereum
      const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[]
      if (!accounts?.[0]) throw new Error('No account selected')
      const chain = await eth.request({ method: 'eth_chainId' })
      if (chain !== CHAIN_ID) {
        try {
          await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_ID }] })
        } catch (e: unknown) {
          if ((e as { code?: number }).code !== 4902) throw e
          await eth.request({ method: 'wallet_addEthereumChain', params: [{
            chainId: CHAIN_ID,
            chainName: 'Monad Testnet',
            nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
            rpcUrls: ['https://testnet-rpc.monad.xyz'],
            blockExplorerUrls: ['https://testnet.monadexplorer.com'],
          }] })
          await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_ID }] })
        }
      }
      const provider = new BrowserProvider(eth)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()
      const contract = new Contract(CONTRACT, ABI, signer)
      const exists = await contract.hasIdentity(account) as boolean
      setAddress(account)
      setHasIdentity(exists)
      setTokenId(exists ? String(await contract.identityOf(account)) : '')
      setStatus(exists ? 'Wishmaker identity found.' : 'No identity yet. Mint yours below.')
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : String(e))
    } finally { setBusy(false) }
  }

  async function mint() {
    if (!window.ethereum || !address) return
    setBusy(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT, ABI, signer)
      setStatus('Confirm mint in MetaMask…')
      const tx = await contract.createIdentity()
      setStatus('Transaction submitted. Waiting for confirmation…')
      await tx.wait()
      const id = await contract.identityOf(address)
      setTokenId(String(id))
      setHasIdentity(true)
      setStatus('Wishmaker identity minted successfully!')
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : String(e))
    } finally { setBusy(false) }
  }

  return <div style={{ position: 'relative', zIndex: 10 }}>
    <button className="wallet" type="button" disabled={busy} onClick={connect}>
      {busy ? '[ working… ]' : address ? `[ ${address.slice(0, 6)}…${address.slice(-4)} ]` : '[ connect wallet ]'}
    </button>
    {address && hasIdentity === false && <button className="wallet" style={{ marginLeft: 8 }} disabled={busy} onClick={mint}>[ mint identity ]</button>}
    {address && hasIdentity === true && <span style={{ marginLeft: 8, color: '#ff83e8', fontSize: 19 }}>ID #{tokenId}</span>}
    {status && <div role="status" style={{ position: 'absolute', right: 0, top: '100%', width: 310, maxWidth: '90vw', padding: 10, background: '#170c25', border: '1px solid #f045d8', color: '#ffb9eb', fontSize: 17, overflowWrap: 'anywhere' }}>{status}</div>}
  </div>
}
