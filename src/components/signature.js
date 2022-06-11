import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
// import { injected } from './connectors';
// import Swal from 'sweetalert2';
// import ERC20ABI from '../abi/ERC20.abi.json';
// import { Contract } from '@ethersproject/contracts';
// import { BigNumber } from '@ethersproject/bignumber';
// import { parseEther } from '@ethersproject/units';
// import { ethers } from 'ethers';
// import SpaceWormsAbi from '../contracts/SpaceWorms.json';
// //import {fs} from "fs";
// import addresses from '../contracts/contract-address.json';

const Signature  = props => {

    async function signMessage() {
        // if(typeof web3 !== 'undefined'){
        //     web3 = new Web3(web3.currentProvider); //this is where it errors
        // }else {
        //     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); 
        // }


        //Web3 = require('web3');
        const { active, account, library, activate } = useWeb3React();
        if (!window.ethereum) return alert("Please Install Metamask");
    
        // connect and get metamask account
        //const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await library.provider.request({ method: "eth_requestAccounts" });
    
        // message to sign
        const message = "hello";
        console.log({ message });
    
        // hash message
        const hashedMessage = Web3.utils.sha3(message);
        console.log({ hashedMessage });
    
        // sign hashed message
        //const signature = await ethereum.request({
        const signature = await library.provider({
          method: "personal_sign",
          params: [hashedMessage, accounts[0]],
        });
        console.log({ signature });
    
        // split signature
        const r = signature.slice(0, 66);
        const s = "0x" + signature.slice(66, 130);
        const v = parseInt(signature.slice(130, 132), 16);
        console.log({ r, s, v });
    
        alert(signature);
      }

    if(props.isConnected)
    {
        //console.log("");
    }
    return (
        <div className='signature-container'>
            <button onClick="signMessage()">Sign Message</button>
        </div>
    );
}

export default Signature;
