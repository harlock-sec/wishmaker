import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrowserProvider, Contract } from 'ethers'
import './Extras.css'
const ADDRESS = '0xDaC80f0b8C396eAe2024Bc112BF1D82b7a1226CE'
const ABI = ['function hasIdentity(address) view returns (bool)', 'function identityOf(address) view returns (uint256)', 'function getProfile(address) view returns (uint256, int16[10], uint256)']
const NAMES = ['IMOK','UROK','Solar','Lunar','Mars','Mercury','Jupiter','Venus','Saturn','Selflessness']
export default function Identity(){
 const [address,setAddress]=useState(''); const [id,setId]=useState(''); const [scores,setScores]=useState<number[]|null>(null); const [status,setStatus]=useState('')
 async function load(){try{
  if(!window.ethereum) throw Error('MetaMask not detected')
  await window.ethereum.request({method:'eth_requestAccounts'})
  const provider=new BrowserProvider(window.ethereum); const network=await provider.getNetwork()
  if(network.chainId!==10143n) throw Error('Switch MetaMask to Monad Testnet first (chain 10143)')
  const signer=await provider.getSigner();const a=await signer.getAddress();setAddress(a)
  const contract=new Contract(ADDRESS,ABI,provider)
  if(!await contract.hasIdentity(a)){setStatus('No identity minted for this wallet. Mint one on the homepage.');setId('');setScores(null);return}
  setId(String(await contract.identityOf(a)))
  try{const result=await contract.getProfile(a);setScores(Array.from(result[1],(v:bigint)=>Number(v)));setStatus('On-chain identity loaded.')}
  catch{setScores(null);setStatus('Identity found. Score data could not be decoded; check the deployed contract ABI.')}
 }catch(e){setStatus(e instanceof Error?e.message:String(e))}}
 return <div className="wm-extra"><header><Link to="/">← WISHMAKER_</Link><span>[ IDENTITY // MONAD ]</span></header><main><h1>On-chain identity</h1><p>View your soulbound Wishmaker ID and the ten personality scores stored on Monad Testnet.</p><button onClick={load}>[ connect & load identity ]</button>{status&&<p role="status">{status}</p>}{address&&<p className="wm-break">Wallet: {address}</p>}{id&&<><h2>Wishmaker ID #{id}</h2><p><a href={`https://testnet.monadexplorer.com/address/${ADDRESS}`} target="_blank" rel="noreferrer">View contract on explorer ↗</a></p></>}{scores&&<div className="wm-scoregrid">{NAMES.map((n,i)=><div key={n}><span>{n}</span><strong>{scores[i]}</strong></div>)}</div>}<p><Link to="/questionnaire">[ take questionnaire ]</Link></p></main></div>
}
