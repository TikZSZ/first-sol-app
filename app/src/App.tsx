// import './App.css';
import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  Program, Provider, web3,AccountClient
} from '@project-serum/anchor';
import {IDL} from "./types/solana_lock-1"
import idl from "./idl.json"
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
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
const endpoint = "http://127.0.0.1:8899"

function App() {
  const [value, setValue] = useState<number|null>(null);
  const [balance,setBalance] = useState<number|null>(null);
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = endpoint;
    const connection = new Connection(network, "processed");
    // @ts-ignore 
    const provider = new Provider(connection, wallet, opts);
    return provider;
  }

  async function createCounter() {    
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(IDL, programID, provider);
    try {
      /* interact with the program via rpc */
      await program.rpc.initialize({
        signers: [baseAccount]
      });

      const account = await program.account.lock.fetch(baseAccount.publicKey)
      console.log('account: ', account);
      setValue(account.balance);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function getAccountBalance(){
    const provider = await getProvider()
    const connection = new Connection(endpoint, "processed");
    const solBalance = await connection.getBalance(provider.wallet.publicKey)
    setBalance(solBalance)
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
        {balance && <p>Your solana balance is {balance}</p>}
        <br />
        <div>
          {balance?(<p>Your solana balance is {balance}</p>):(<button onClick={getAccountBalance}>Get Balance</button>)}
          {
            !value && (<button onClick={createCounter}>Initialize</button>)
          }
          {
            value && <span>{value}</span>
          }
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