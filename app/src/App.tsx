// import './App.css';
import { useState } from 'react';
import { Connection, PublicKey,  } from '@solana/web3.js';
import {
  Program, Provider, web3,BN
} from '@project-serum/anchor';
import {IDL} from "./types/solana_lock-1"
import idl from "./idl.json"
import { PhantomWalletAdapter, } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

//import('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]


const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}

const programID = new PublicKey(idl.metadata.address);

//const endpoint = "http://127.0.0.1:8899"

const endpoint = "https://api.devnet.solana.com"

const receiver = new web3.PublicKey("87kawNViwaLXf4TUvDPt6X6KBsrARowBVQeRJ6u12Hcu")

function App() {
  const [balance,setBalance] = useState<number|null>(null);
  const wallet = useWallet();
  const [amount,setAmount] = useState(0)
  const [natRes,setNatRes] = useState<null|any>(null)
  
  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = endpoint;
    const connection = new Connection(network, "processed");
    // @ts-ignore 
    const provider = new Provider(connection, wallet, opts);
    return provider;
  }

  // async function initialize() {    
  //   const provider = await getProvider()
  //   /* create the program interface combining the idl, program ID, and provider */
  //   const program = new Program(IDL, programID, provider);
  //   try {
  //     /* interact with the program via rpc */
  //     const res = await program.rpc.initialize({
  //       signers: [baseAccount]
  //     });
  //     console.log(res);
  //   } catch (err) {
  //     console.log("Transaction error: ", err);
  //   }
  // }

  async function getAccountBalance(){
    const provider = await getProvider()
    const connection = new Connection(endpoint, "processed");
    const solBalance = await connection.getBalance(provider.wallet.publicKey)
    setBalance(solBalance)
  }

  async function TransferNatTokens(){
    const provider = await getProvider()
    
    const program = new Program(IDL, programID, provider);
    const senderPubKey = provider.wallet.publicKey
    try {
      /* interact with the program via rpc */
      const res = await program.rpc.transferNatTokens(new BN(amount),{
        accounts:{
          "from":senderPubKey,
          "to":receiver,
        }
      });
      console.log(res);
      setNatRes(res)
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <div style={{display:"flex",flexDirection:"column",margin:"0 auto 0 auto",width:"95%"}}>
          <div>
            {balance?(<p>Your solana balance is {balance}</p>):(<button onClick={getAccountBalance}>Get Balance</button>)}
          </div>
          <div>
            <p>Transfer Nat Tokens</p>
            <form onSubmit={(e) => {
              e.preventDefault()
              TransferNatTokens()
            }}>
              <label htmlFor="">Amount</label>
              <input type="number" value={amount} onChange={(e)=>{setAmount(parseInt(e.target.value))}}/>
              <button type='submit'>Send</button>
            </form>
            {natRes && <p>Nat Token Response = {natRes}</p>}
          </div>
        </div>
      </div>
    );
  }
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;