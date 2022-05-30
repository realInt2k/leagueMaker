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
const LMabi= require("../contracts/LeagueMaker.json");

export const connectToMetamask = async () => {


        try {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
            const signer = provider.getSigner();
            await provider.send("eth_requestAccounts", []);
            const accounts = await provider.send("eth_requestAccounts", []);

            let abi = LMabi;
            const account = await signer.getAddress();
            console.log("You've signed in with account:", await signer.getAddress());
            let contractAddress: string = process.env.REACT_APP_THANKS_ADDRESS_BNB as string;
            const contract = new ethers.Contract(contractAddress, abi, provider);
            let contractWithSigner = contract.connect(signer);
            return {
                contract: contractWithSigner,
                userAccount: accounts[0]
            }
        } catch {
            console.error("failed to connect to metamask");
            return null;
        }
}