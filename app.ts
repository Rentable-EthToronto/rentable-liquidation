import {Contract, ContractInterface, ethers} from "ethers";
import rentableJson from "./resources/rentable.json";
import dotenv from 'dotenv';
dotenv.config();

class RentableContract{
    private contract: Contract
    constructor(provider: ethers.providers.Provider, contractAddress: string, contractAbi: ContractInterface) {
        this.contract = new ethers.Contract(contractAddress, contractAbi, provider);
    }

    liquidateNFT = async() =>{
        await this.contract.liquidateNFTLoop();
    }
}

function main(){

    const provider = new ethers.providers.JsonRpcProvider(process.env.ANKR_RPC)
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const timeOutMs = Number(process.env.TIMEOUT)

    if(!contractAddress) {
        throw new Error("Cannot retrieve contract address from env");
    }

    const rentableContract: RentableContract = new RentableContract(provider, contractAddress, rentableJson.abi)

    executeEvery(rentableContract.liquidateNFT, timeOutMs? timeOutMs: 5000).then(r => console.log("Success"))

}

async function wait(ms: number) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms)
    })
}

async function executeEvery(func: Function, ms: number){
    while(true) {
        await func()
        await wait(ms)
    }
}

main()


