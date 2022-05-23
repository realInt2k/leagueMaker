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
import Web3Token from 'web3-token';
const Web3 = require("web3");
import axios from 'axios';

const LMabi = require("./contracts/LeagueMaker.json");

function App() {
  
  var [selectedAddress, setAddress] = useState();
  var [contract, setContract] = useState();
  function ViewRewards(id){
    var [leagues, setLeagues] = useState(0);
    const [time, setTime] = useState(Date.now());
    // useEffect(() => {
    //   const interval = setInterval(() => setTime(Date.now()), 1000);
    //   return () => {
    //     clearInterval(interval);
    //   };
    // }, []);
    async function getReward(id){
      let tx = await contract.claimPrize(id);
      await tx.wait();
    }
    {contract.viewClosedLeagues().then(leagues => {setLeagues(leagues)})}
    if (leagues!=0){
    return leagues.map(league => {
      if ((league.winner).toLowerCase()==(selectedAddress).toLowerCase()){
        var leagueId = parseInt(league.leagueId._hex);
        return <button onClick={()=> getReward(leagueId)}>Reward for League {leagueId}</button>
      }
    })}else{
      return <p>No claimable rewards</p>
    }
    

  }

  function LiveLeagueButton(id) {
    var [nickname, setNickname] = useState(0);
    
    async function handleLive(id, myFunc){
      let tx = await contract.liveLeague(id);
      await tx.wait();
    }
    async function handleJoin(id, nickname){
      let tx = await contract.joinLeague(id, nickname, {value: 100000});
      await tx.wait();
      console.log(5);
    }
    
    async function handleInput(event){
      setNickname(event.target.value);
    }
    return (
      <>
      <button onClick={() => handleLive(id)}>Live-start league</button>
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={nickname} onChange={handleInput} />
        </label>
      </form>
      <button onClick={() => handleJoin(id, nickname)}>Join league</button>
      </>
    )
  }

  function CloseLeagueButton(id){
    const [time, setTime] = useState(Date.now());
    const [participants, setParticipants] = useState([{_hex: "Lol"}]);
    const [selected, setSelected] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);
    contract.viewParticipants(id).then(participants => setParticipants(participants));
    
    async function handleClose(id, nickname){
      let tx = await contract.closeLeague(id, String(nickname));
      await tx.wait();
    }
    async function handleInput(event){
      console.log(event.target.value);
      setSelected(event.target.value);
    }
    return (<>
    <select name="participants" id="participnats" onChange={handleInput} value={selected}>
    {participants.map(participant => {
      return (<option>{participant.nickName}</option>)
    })}
    </select>
    <button onClick={()=> handleClose(id, selected)}>Close league</button>
    </>)

  }
  
  async function openLeague() {
    let tx = await contract.openLeague(100000, 1653466276, 1653473476);
    
    // The operation is NOT complete yet; we must wait until it is mined
    await tx.wait();
    let newValue = await contract.viewOpenLeagues();
  }

  async function connectToMetamask() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const signer = provider.getSigner();
    // const accounts = await provider.send("eth_requestAccounts", []);

    // let abi = LMabi;
    // let contractAddress = "0x89A9164e14e6729F826F6b26588f65D054826BFD";
    // let contract = new ethers.Contract(contractAddress, abi, provider);
    // let contractWithSigner = contract.connect(signer);


    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    const token = await Web3Token.sign(msg => web3.eth.personal.sign(msg, address), '1d');
    axios.get('localhost:3030/auth/signin', {
      headers: {
        'Autheorization': token
      }
    })

    // setAddress(accounts[0]);
    // setContract(contractWithSigner);
  }

  if (!selectedAddress) {
    return (
      <button onClick={() => connectToMetamask()}>Connect to Metamask</button>
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