
import { Mainnet, WagmiWeb3ConfigProvider,MetaMask } from '@ant-design/web3-wagmi';
import { http,useReadContract,useWriteContract } from "wagmi";
import { Address,NFTCard,Connector,ConnectButton,useAccount } from '@ant-design/web3';
import {parseEther} from 'viem';
import { Button } from 'antd';

const CallTest = () => {
    const {writeContract} = useWriteContract();
    const { account } = useAccount();
    const { data, isLoading } = useReadContract({
        address: '0xEcd0D12E21805803f70de03B72B1C162dB0898d9',
        abi: [
            {
                "inputs": [{name:'account', type: 'address'}],
                "name": "balanceOf",
                "outputs": [
                    {
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ],
        functionName: 'balanceOf',
        args: [account?.address as `0x${string}`],
    });

    return (
        <div>
            <p>Data: {isLoading ? 'Loading...' : data?.toString()}</p>
            <button
                onClick={() => {
                    writeContract({
                        address: '0xEcd0D12E21805803f70de03B72B1C162dB0898d9',
                        abi: [
                            {
                                "inputs": [{name:'quantity', type: 'uint256',internalType: 'uint256'}],
                                "name": "mint",
                                "outputs": [],
                                "stateMutability": "payable",
                                "type": "function"
                            }
                        ],
                        functionName: 'mint',
                        args: [BigInt(1)],
                        value: parseEther('0.01'),
                    },
                    {
                        onSuccess: (data) => {
                            console.log('Mint successful:', data);
                        },
                        onError: (error) => {
                            console.error('mint failed:', error);
                    }
                });
                }}
                >
                    mint
                </button>

        </div>
    );
}
export default function Web3() {
    return(
        <WagmiWeb3ConfigProvider
            chains={[Mainnet]} 
            transports={{[Mainnet.id]: http('https://api.zan.top/node/v1/eth/sepolia/fe682edfa4e44534b33b93a0483ecd53')}}
            wallets={[MetaMask()]}
            >
            <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
            <NFTCard
                address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
                tokenId={641}
                />
                <Connector>
                    <ConnectButton />
                </Connector>
                <CallTest />
            </WagmiWeb3ConfigProvider>  

    )
}
