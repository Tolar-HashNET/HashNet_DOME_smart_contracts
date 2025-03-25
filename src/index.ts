import { Web3 } from "web3";
import {
    account,
    INVALID_NONCE,
    RpcTxRequest,
    RpcTxResponse,
    TolarPlugin,
    ZERO_HEX_ADDRESS
} from "@tolar/web3-plugin-tolar";
import path from "node:path";
import { parse } from "ts-command-line-args";
import * as fs from "node:fs";
import {retryDecorator} from "ts-retry-promise";

interface AppArgs {
    contractDir: string;
    providerUrl: URL;
    networkId: number;
    privateKey: string;
}

function loadFile(dirPath: string, fileName: string): string {
    const fullPath = path.join(dirPath, fileName);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File ${fullPath} does not exist`);
    }

    return fs.readFileSync(fullPath, 'utf8');
}

async function main() {
    try {
        const args = parse<AppArgs>({
            contractDir: {
                type: String,
                description: "Path to directory containing contract abi and binary",
                defaultValue: path.join(__dirname, '..', 'contract_bin')},
            providerUrl: {
                type: (rawUrl: string) => new URL(rawUrl),
                description: "Client api URL",
                defaultValue: new URL("https://jsongw.testnet.tolar.io/jsonrpc")},
            networkId: {type: Number, description: "Id of network used"},
            privateKey: {type: String, description: "Deployer private key"},
        });

        let bytecode = loadFile(args.contractDir, '_contract_EventManagerDOMEv1_sol_EventManagerDOMEv1.bin');
        bytecode = `0x${bytecode}`;

        const web3 = new Web3(args.providerUrl.toString());
        web3.registerPlugin(new TolarPlugin());
        web3.tolar.wallet!.add(args.privateKey);

        const senderAddress = account.privateKeyToAddress(args.privateKey);
        let nonce = await web3.tolar.getNonce(senderAddress);
        if (nonce === INVALID_NONCE) {
            nonce = 0n;
        }

        const contractTxRequest: RpcTxRequest = {
            senderAddress: senderAddress,
            receiverAddress: ZERO_HEX_ADDRESS,
            amount: 0n,
            networkId: args.networkId,
            nonce: nonce,
            data: bytecode,
            gas: 53_000n,
            gasPrice: 1n,
        };
        const gasEstimate = await web3.tolar.getGasEstimate(contractTxRequest);
        const txDeployHash = await web3.tolar.sendTransaction({
            from: contractTxRequest.senderAddress,
            to: ZERO_HEX_ADDRESS,
            value: contractTxRequest.amount,
            networkId: contractTxRequest.networkId,
            nonce: nonce,
            data: bytecode,
            gas: gasEstimate,
            gasPrice: contractTxRequest.gasPrice,
        });

        const retryGetTx = retryDecorator(
            (txHash: string) => web3.tolar.getTransaction(txHash),
            { timeout: 30_000, delay: 2000 },
        );

        const txDeployResponse: RpcTxResponse = await retryGetTx(txDeployHash);
        if (txDeployResponse.excepted) {
            console.error(
                `Failed to deploy contract with error code: ${txDeployResponse.exception}`,
            );
            return;
        }

        console.log(`Deployed contract address: ${txDeployResponse.newAddress}`);
    } catch (ex) {
        let message: string = "Unknown error";
        if (typeof ex === "string") {
            message = ex;
        } else if (ex instanceof Error) {
            message = ex.message;
        }

        console.error(`Failed to deploy contract with: ${message}`);
    }
}

void main();
