import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import {LeagueCards} from './components/leagueCard';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Web3Token from 'web3-token';
// const Web3 = require("web3");

import axios from 'axios';
import { Counter } from './features/counter/Counter';
import Metamask from './API/writeData/metamask';
import LeagueList from './API/Page/leagueList';
import {
  updateList,
  getList
} from './features/leagueList/leagueList';

import {
  connectContract,
  getContract
} from './features/contractRedux/contractRedux';

import { useAppSelector, useAppDispatch } from './app/hooks';

const metamask = new Metamask();

const LMabi = require("./contracts/LeagueMaker.json");

const App = () => {
  let [selectedAddress, setAddress] = useState<any>();
  let [contract, setContract] = useState<any>();

  const ViewRewards = (id:any) => {
    let [leagues, setLeagues] = useState<any>(0);
    const [time, setTime] = useState(Date.now());

    const getReward = async (id: any) => {
      let tx: any;
      if(contract)
        tx = await contract.claimPrize(id);
      await tx.wait();
    }

    {contract.viewClosedLeagues().then( (leagues:any) => {setLeagues(leagues); return 1;})}
    if (leagues!=0){
      return leagues.map((league:any) => {
        if ((league.winner).toLowerCase()==(selectedAddress).toLowerCase()){
          var leagueId = parseInt(league.leagueId._hex);
          return <button onClick={()=> getReward(leagueId)}>Reward for League {leagueId}</button>
        }
    })}else{
      return <p>No claimable rewards</p>
    }
  }

  // const LiveLeagueButton = (id: any) => {
  //   var [nickname, setNickname] = useState(0);
    
  //   async function handleLive(id: any, myFunc: any){
  //     let tx = await contract.liveLeague(id);
  //     await tx.wait();
  //   }
  //   async function handleJoin(id: any, nickname: any){
  //     let tx = await contract.joinLeague(id, nickname, {value: 100000});
  //     await tx.wait();
  //     console.log(5);
  //   }
    
  //   const handleInput = async (event:any) => {
  //     setNickname(event.target.value);
  //   }
  //   return (
  //     <>
  //     <button onClick={() => handleLive(id, null)}>Live-start league</button>
  //     <form onSubmit={this.handleSubmit}>
  //       <label>
  //         Name:
  //         <input type="text" value={nickname} onChange={handleInput} />
  //       </label>
  //     </form>
  //     <button onClick={() => handleJoin(id, nickname)}>Join league</button>
  //     </>
  //   )
  // }

  const CloseLeagueButton = (id: any) => {
    const [time, setTime] = useState<Number>(Date.now());
    const [participants, setParticipants] = useState<any>([{_hex: "Lol"}]);
    const [selected, setSelected] = useState<any>(0);
    useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);
    contract.viewParticipants(id).then((participants:any) => setParticipants(participants));
    
    const handleClose = async (id:any, nickname:any) => {
      let tx = await contract.closeLeague(id, String(nickname));
      await tx.wait();
    }
    const handleInput = async (event:any) => {
      console.log(event.target.value);
      setSelected(event.target.value);
    }
    return (<>
      <select name="participants" id="participnats" onChange={handleInput} value={selected}>
      {participants.map((participant:any) => {
        return (<option>{participant.nickName}</option>)
      })}
      </select>
      <button onClick={()=> handleClose(id, selected)}>Close league</button>
    </>)

  }
  
  const openLeague = async () => {
    let tx = await contract.openLeague(100000, 1653466276, 1653473476);
    
    // The operation is NOT complete yet; we must wait until it is mined
    await tx.wait();
    let newValue = await contract.viewOpenLeagues();
  }

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = provider.getSigner();
    const accounts:any = await provider.send("eth_requestAccounts", []);

    let abi = LMabi;
    let contractAddress = "0x89A9164e14e6729F826F6b26588f65D054826BFD";
    let contract = new ethers.Contract(contractAddress, abi, provider);
    let contractWithSigner = contract.connect(signer);


    //const web3 = new Web3(window.ethereum);
    //await window.ethereum.enable();
  }
  let dispatch = useAppDispatch();
  // console.log("before updating list");
  // let list = useAppSelector(getList);
  let metamaskContract = useAppSelector(getContract);
          
  if (!selectedAddress) {
    return (
      <>
        <button onClick={() => metamask.connectToMetamask()}>Connect to Metamask</button>
        {/* <button onClick={() => {
          dispatch(updateList("okok"));
          console.log(list);
          }}> ok oko k</button> */}
        <button onClick = {()=>{
          dispatch(connectContract("okok"));
        }}>
          fetchContract
        </button>
        <button onClick = { async ()=>{
          console.log(metamaskContract);  
          let things = await metamaskContract.viewOpenLeagues();
          console.log(things);
        }}>
          view open leagues
        </button>
        <Counter />
        {/* <div>
        this is the sample of the object for LeagueList Page:
        </div>
        <div>
        {JSON.stringify(list)}
        </div> */}
      </>
    )
  } else {
    return (
      <div>
        <p>Welcome!</p>
        {/* <button onClick={() => openLeague()}>Create League</button>
        <p>Open leagues that you can join: </p>
        <LeagueCards myFunc = {contract.viewOpenLeagues}
        button = {LiveLeagueButton}></LeagueCards>
        
        <p>Leagues being played right now: </p>
        <LeagueCards myFunc = {contract.viewLiveLeagues}
        button = {CloseLeagueButton}></LeagueCards>

        <p>Your claimable rewards: </p>
        <ViewRewards></ViewRewards> */}
      </div>
    );
  }
}

export default App;