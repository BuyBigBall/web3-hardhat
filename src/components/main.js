import React, { useState, useEffect } from 'react';
import ConnectBar from './connect-bar';
import { useWeb3React } from '@web3-react/core';
import { injected } from './connectors';
import Swal from 'sweetalert2';
import ERC20ABI from '../abi/ERC20.abi.json';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import { ethers } from 'ethers';
import SpaceWormsAbi from '../contracts/SpaceWorms.json';
//import {fs} from "fs";
import addresses from '../contracts/contract-address.json';
// import Signature from './signature.js';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

function MainPage() {

  const { active, account, library, activate } = useWeb3React();
  const [conn, setConn] = useState(false);
  const [gameCost, setGameCost] = useState('');
  
  const [enteredName, setNftName] = useState('');
  
  const [discountOption, setDiscountOption] = useState('');
  const [discountTokenAmount, setDiscountTokenAmount] = useState('');
  const [discountEthAmount, setDiscountEthAmount] = useState('');
  const [buyOption, setBuyOption] = useState('');
  const [buyEthAmount, setBuyEthAmount] = useState('');
  const [prizeNftContract, setPrizeNftContract] = useState('');
  const [prizeToAddress, setPrizeToAddress] = useState('');
  const [prizeTokenId, setPrizeTokenId] = useState('');
  const [whitelistAddress, setWhitelistAddress] = useState('');
  const [whitelist, setWhitelist] = useState(
        [ 
          '0x2923A74185d7EC363cBEBD947577725CB5E051E5', 
          '0x878A16C1B3Fb986fBEb3301639d6F8a60215Dda9'
        ]);
  const [gameCostETH, setGameCostETH] = useState('');
  const [gameCostPriceETH, setGameCostPriceETH] = useState(0);
  const [gameMode, setGameMode] = useState('ETH');

  const contractAddress = "0x49e8226F8905fB32614A16614EFFc91FdA6C32Ad";
  const decimalStr = "000000000";
  const privateKey = "7e9dbf1afa0630831a9de780df74f23b1a610b368cc07e49bfb92b81d86687fb";
  //const privateKey = "7e8f361940b0f60bf5faf2e7b487839e92acd8a93d0bcf0a1766b94ca285208b";
  //

  const handleMetamaskClick = () => {
    (async () => {
      try {
        await activate(injected);
        console.log("MetaMask button vlicked without error!");
      } catch(ex) {
        console.log(ex);
      }
      
    })();
  }

  useEffect(() => {
    if(active)
      setConn(true);
    else
      setConn(false);
  }, [active]);

  const handleGameCost = () => {
    if(!checkConnection()) return;
    
    if(library) {
      const contract = new Contract(contractAddress, ERC20ABI, library).connect(library.getSigner(account));
      contract.setGameCost(BigNumber.from(gameCost + decimalStr)).then(res => console.log(res)).catch(err => console.log(err));
    }
  }
  const checkConnection =() =>{
    if(!conn) {
      Swal.fire({
        title:  'Metamask',
        text:   'Please connect your metamask to the website',
        icon:   'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }
    return true;
  }
 const mintSubmissionHandler = (e) => {
    e.preventDefault();
    console.log("Mint Button clicked!");
    if(!checkConnection()) return;
    // if(enteredName==undefined || enteredName=="") 
    // {
    //   alert('Please input nft name.');
    //   return;
    // }
    //const fs = require("fs");
      if(!library) {
        alert("library not ready!");
      }
      else
      {
        alert("library is ready!");
      }
      return;
      const metadata = {
        title: "Asset Metadata",
        type: "object",
        properties: {
          name: {
            type: "string",
            description: enteredName
          },
          
        }
      };

      const metadataAdded = ipfs.add(JSON.stringify(metadata));
      if(!metadataAdded) {
        console.error('Something went wrong when updloading the json');
        return;
      }

     // const [sender] = ethers.getSigners();
      //const tokenContract = await ethers.getContractAt("SpaceWorms", addresses.MintToken);
      //contract.setGameCost(BigNumber.from(gameCost + decimalStr)).then(res => console.log(res)).catch(err => console.log(err));
      const tokenContract = new Contract(addresses.MintToken, SpaceWormsAbi.abi, library).connect(library.getSigner(account));
      tokenContract.mint(account)
            .send({ from:account,
                    value: ethers.utils.parseEther( "0.1" )
                    //BigNumber.from("0.1")
                  })
            .then(res => console.log("Mint success",res))
            .catch(err => console.log(err));
  }

 const handleDiscount = () => {
    if(!checkConnection()) return;

    if(library) {
      const contract = new Contract(contractAddress, ERC20ABI, library).connect(library.getSigner(account));
      contract.setBuyOption(
                parseInt(discountOption), 
                BigNumber.from(discountTokenAmount + decimalStr), 
                parseEther(discountEthAmount)
          )
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  }

  const handleBuy = () => {
    if(!checkConnection()) return;

    if(library) {
      const contract = new Contract(contractAddress, ERC20ABI, library).connect(library.getSigner(account));
      contract.buy(parseInt(buyOption), { value: parseEther(buyEthAmount) }).then(res => {
        console.log(res);
      }).then(err => console.log(err));
    }
  }

  const handleJoinGame = () => {
    if(!checkConnection()) return;

    if(gameMode !== 'CLAW') {
      Swal.fire({
        title: 'Warning',
        text: 'Your game mode is not CLAW mode',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if(library) {
      const contract = new Contract(contractAddress, ERC20ABI, library).connect(library.getSigner(account));
      contract.joinGame().then(res => {
        res.wait().then(res => {
          console.log(res);
          Swal.fire({
            title: 'Join Game',
            text: 'Successfully joined game Tx hash: ' + res.transactionHash,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }).catch(err => {
          console.log(err);
          Swal.fire({
            title: 'Join Game',
            text: 'Joining Game failed',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        })
      }).catch(err => console.log(err));
    }
  }

  const handleTransferNFT = async() => {
    const infuraProvider = new ethers.providers.InfuraProvider(
            'rinkeby', 
            'ce7ffc0c85d5464db9baee5c5490e596'
            );
    const wallet = new ethers.Wallet(privateKey, infuraProvider);
    const signer = wallet.connect(infuraProvider);
    const abi = [
      "function safeTransferFrom(address from, address to, uint256 tokenId)"
    ];
    const contract = new ethers.Contract(prizeNftContract, abi, signer);
    const tx = await contract.safeTransferFrom(signer.address, prizeToAddress, prizeTokenId);
    const txResult = await tx.wait();
    console.log(txResult);
    const txHash = txResult.transactionHash;
    Swal.fire({
      title: 'NFT transferred successfully',
      text: 'Transaction hash: ' + txHash,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  const handleAddToWhitelist = () => {
    let array = [...whitelist];
    array.push(whitelistAddress);
    setWhitelist(array);
  }

  const handleGameCostETH = () => {
    setGameCostPriceETH(parseFloat(gameCostETH));
  }

  const handleJoinGameETH = () => {
    if(!checkConnection()) return;

    if(gameMode !== 'ETH') {
      Swal.fire({
        title: 'Warning',
        text: 'Your game mode is not ETH mode',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if(library) {
      const idx = whitelist.findIndex(element => element === account);
      if(idx < 0) {
        Swal.fire({
          title: 'Warning',
          text: 'Your address is not in the whitelist',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      if(gameCostPriceETH <= 0) {
        Swal.fire({
          title: 'Warning',
          text: 'Please set your game price for ETH',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      library.provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: contractAddress,
            value: parseEther(gameCostPriceETH.toString()).toHexString()
          }
        ],
      }).then(res => {
        library.waitForTransaction(res).then(tx => {
          Swal.fire({
            title: 'Joined game successfully',
            text: 'Hash: ' + tx.blockHash,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }
  }

  return (
    <div className="App">
      <ConnectBar isConnected={conn}/>

       {/* < S i g n ature isConnected=conn } / > */}
      
      <div className="btn_container">
        <div className='metamask_btn' onClick={handleMetamaskClick}>
          <img src="./metamask_logo.png" className='metamask_img' alt="metamask logo"/>
          <span className='btn_text'>Metamask</span>
        </div>
      </div>

      <form onSubmit={mintSubmissionHandler}>
        <div className="row justify-content-center">
          <div className="col-md-2 input_container">
            <label>NFT MINT FORM:</label>
            <input
              type='text'
              className={`form-control is-invalid mb-1`}
              placeholder='Name...'
              onChange={e => setNftName(e.target.value)}
              value={enteredName}
            />
             <button type='submit' className='btn btn-lg btn-info text-white btn-block' 
                >MINT</button>
          </div>

        </div>
       
      </form>
      <hr />


      <div>
        <div className="input_container">
          <label>GAME COST:</label>
          <input type='text' name='game_cost' placeholder='value (integer)' value={gameCost} onChange={e => setGameCost(e.target.value)}/>
          <button onClick={handleGameCost}>SET</button>
        </div>
        <div className="input_container">
          <label>DISCOUNT OPTION:</label>
          <input type='text' name='discount_option' placeholder='option (integer)' value={discountOption} onChange={e => setDiscountOption(e.target.value)}/>
          <label>TOKEN AMOUNT:</label>
          <input type='text' name='token_amount' placeholder='tokenAmount (integer)' value={discountTokenAmount} onChange={e => setDiscountTokenAmount(e.target.value)}/>
          <label>ETH AMOUNT:</label>
          <input type='text' name='eth_amount' placeholder='ethAmount' value={discountEthAmount} onChange={e => setDiscountEthAmount(e.target.value)}/>
          <button onClick={handleDiscount}>SET</button>
        </div>
        <div className="input_container">
          <label>BUY OPTION:</label>
          <input type='text' name='buy_option' placeholder='option (uint8)' value={buyOption} onChange={e => setBuyOption(e.target.value)}/>
          <label>Ether AMOUNT:</label>
          <input type='text' name='token_amount' placeholder='payableAmount (ether)' value={buyEthAmount} onChange={e => setBuyEthAmount(e.target.value)}/>
          <button onClick={handleBuy}>BUY</button>
        </div>
        <div className="input_container">
          <label>JOIN GAME: </label>
          <button onClick={handleJoinGame}>JOIN GAME</button>
        </div>
        <div className="input_container">
          <label>NFT: </label>
          <input type='text' name='nft_contract' placeholder='nftContract (address)' value={prizeNftContract} onChange={e => setPrizeNftContract(e.target.value)}/>
          <label>TO: </label>
          <input type='text' name='to_address' placeholder='to (address)' value={prizeToAddress} onChange={e => setPrizeToAddress(e.target.value)}/>
          <label>TOKEN-ID: </label>
          <input type='text' name='tokenId' placeholder='tokenId (uint256)' value={prizeTokenId} onChange={e => setPrizeTokenId(e.target.value)}/>
          <button onClick={handleTransferNFT}>TRANSFER PRIZE</button>
        </div>
        <div className='input_container'>
          <label>GAME PRICE FOR ETH: </label>
          <input type='text' name='eth_price' placeholder='value (eth)' value={gameCostETH} onChange={e => setGameCostETH(e.target.value)}/>
          <button onClick={handleGameCostETH}>SET</button>
          <label>CURRENT ETH PRICE: </label>
          <span>{gameCostPriceETH}</span>
        </div>
        <div className='input_container'>
          <label>JOIN GAME WITH ETH: </label>
          <button onClick={handleJoinGameETH}>JOIN GAME</button>
        </div>
        <div className='input_container'>
          <label>GAME MODE: </label>
          <select value={gameMode} onChange={e => setGameMode(e.target.value)}>
            <option value='ETH'>ETH</option>
            <option value='CLAW'>CLAW</option>
          </select>
        </div>
        <div className='input_container'>
          <label>Add to Whitelist: </label>
          <input type='text' name='add_whitelist' placeholder='Add to whitelist' value={whitelistAddress} onChange={e => setWhitelistAddress(e.target.value)}/>
          <button onClick={handleAddToWhitelist}>ADD</button>
        </div>
        <div>WALLET ADDRESS WHITELIST:</div>
        {
          whitelist.map((addr, index) => {
            return (
              <div key={index}>{addr}</div>
            );
          })
        }
      </div>
    </div>
  );
}

export default MainPage;
