import { ethers } from "ethers";
import * as Web3Token from 'web3-token';
/*
const getReward = async (id: any) => {
      let tx: any;
      if(contract)
        tx = await contract.claimPrize(id);
      await tx.wait();
    }

*/
class Metamask {
    LMabi: any;
    contract: any = null;
    account: any = null;
    constructor(path:any = ""){
        if(path)
        {
            this.LMabi = require(path); 
        } else 
        {
            this.LMabi= require("../contracts/LeagueMaker.json");
        }
    }
    contractIsReady = () => {
        return this.contract ? 1 : 0;
    }
    connectWithAdmin = async() => {
        const provider = new ethers.providers.JsonRpcProvider(process.env.bnbRPC);
        const privateKey = process.env.BNBTESTNET_PRIVATE_KEY;
        const contractAddress = process.env.THANKS_ADDRESS_BNB;
        const signer = new ethers.Wallet(privateKey, provider);
        this.contract = new ethers.Contract(contractAddress, this.LMabi, signer);
    }   
    /*
        this function will connect to your account using metamask on browser.
    */
    connectToMetamask = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
        const signer = provider.getSigner();
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        try {
            let abi = this.LMabi;
            this.account = await signer.getAddress();
            console.log("You've signed in with account:", await signer.getAddress());
            let contractAddress = "0x89A9164e14e6729F826F6b26588f65D054826BFD";
            this.contract = new ethers.Contract(contractAddress, abi, provider);
            let contractWithSigner = this.contract.connect(signer);
            const token = await Web3Token.sign((msg:any) => signer.signMessage(msg), '1d');
            return 1;
        } catch {
            console.error("failed to connect to metamask");
            return 0;
        }
    }
}

export default Metamask