
import { Mainnet, WagmiWeb3ConfigProvider,MetaMask,Sepolia } from '@ant-design/web3-wagmi';
import { http,useReadContract,useWriteContract,createConfig } from "wagmi";
import { Address,NFTCard,Connector,ConnectButton,useAccount } from '@ant-design/web3';
import {parseEther} from 'viem';
import { mainnet,sepolia } from 'viem/chains';
import { injected } from "wagmi/connectors";
import { Button, message } from "antd";


const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
     [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
});

const CallTest = () => {
    const {writeContract} = useWriteContract();
    const { account } = useAccount();
    const { data, isLoading } = useReadContract({
        address: '0x83b50abf491b150bc91b4a4436a9af0c1c8c24a5',
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
            <Button
                onClick={() => {
                    writeContract({
                        address: '0x83b50abf491b150bc91b4a4436a9af0c1c8c24a5',
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
                </Button>

        </div>
    );
}
export default function Web3() {
    return(
        <WagmiWeb3ConfigProvider
            config={config}
            chains={[Sepolia]} 
            transports={{[Mainnet.id]: http('https://api.zan.top/node/v1/eth/sepolia/fe682edfa4e44534b33b93a0483ecd53')}}
            wallets={[MetaMask()]}
            eip6963={{
            autoAddInjectedWallets: true,
            }}
            >
            <Address format address="0x83b50abf491b150bc91b4a4436a9af0c1c8c24a5" />
            <NFTCard
                address="0x83b50abf491b150bc91b4a4436a9af0c1c8c24a5"
                tokenId={641}
                />
                <Connector>
                    <ConnectButton />
                </Connector>
                <CallTest />
            </WagmiWeb3ConfigProvider>  

    )
}
