
import { Mainnet, WagmiWeb3ConfigProvider,MetaMask,Sepolia,WalletConnect,Polygon } from '@ant-design/web3-wagmi';
import { http,useReadContract,useWriteContract,createConfig } from "wagmi";
import { Address,NFTCard,Connector,ConnectButton,useAccount,useProvider } from '@ant-design/web3';
import {parseEther} from 'viem';
import { mainnet,sepolia,polygon} from 'viem/chains';
import { injected,walletConnect } from "wagmi/connectors";
import { Button, message } from "antd";


const config = createConfig({
  chains: [mainnet, sepolia,polygon],
  transports: {
     [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http()
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: "9b90560c5e4ef574b635e22f4ce81706",
      showQrModal: true,
    }),
  ],
});

 const contractInfo = [
  {
    id:1,
    name: "Ethereum",
    contractAddress: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
  }, {
    id:5,
    name: "Sepolia",
    contractAddress: "0x83b50abf491b150bc91b4a4436a9af0c1c8c24a5"
  }, {
    id:137,
    name: "Polygon",
    contractAddress: "0x83b50abf491b150bc91b4a4436a9af0c1c8c24a5"
  }
 ]

const CallTest = () => {
    const {writeContract} = useWriteContract();
    const { account } = useAccount();
    const { chain} = useProvider();
    const { data, isLoading } = useReadContract({
    address: contractInfo.find((item) => item.id === chain?.id)?.contractAddress as `0x${string}`,
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
                       address: contractInfo.find((item) => item.id === chain?.id)?.contractAddress as `0x${string}`,
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
            chains={[Sepolia, Polygon]} 
            transports={{[Mainnet.id]: http('https://api.zan.top/node/v1/eth/sepolia/fe682edfa4e44534b33b93a0483ecd53')}}
            wallets={[MetaMask(),WalletConnect()]}
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
