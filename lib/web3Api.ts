import { contract } from "./contract";
import { MoralisContextValue } from "react-moralis/lib/context/MoralisContext/MoralisContext";
import Moralis from "moralis";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { components } from "moralis/types/generated/web3Api";

type Address = string;
type TokenId = string;
type TxHash = string;

export type Nft = { tokenId: TokenId; imageUrl: string };
export type PriceTag = { nft: Nft; price: number };
export type Trade = { txHash: TxHash; tokenId: TokenId; from: Address; to: Address; price: number };
export type ChainList = components["schemas"]["chainList"];

const sampleImageUrl: string = "https://cryptostone.io/nft/diamond/A5.gif";
const CHAIN: ChainList = "rinkeby";

const coolingOffContract = {
  contractAddress: "0x8cE5000F57B8e5A4fa84A4D26203242FBf8a36F2",
  abi: contract.abi
};

export const web3Api = new (class {
  readonly web3 = new Web3("wss://rinkeby.infura.io/ws/v3/f4e569f3d6404d04aa60ecaebb5d1a57");
  readonly myContract = new this.web3.eth.Contract(
    coolingOffContract.abi as AbiItem[],
    coolingOffContract.contractAddress
  );

  async getNftListOwnedBy(moralis: MoralisContextValue, tokenOwnerAddress: Address): Promise<Nft[]> {
    return (
      await moralis.Moralis.Web3API.account.getNFTsForContract({
        address: tokenOwnerAddress,
        chain: CHAIN,
        token_address: coolingOffContract.contractAddress
      })
    ).result!.map((respondNft) => {
      return {
        tokenId: respondNft.token_id,
        imageUrl: sampleImageUrl
      };
    });
  }

  async getPurchasableNftList(moralis: MoralisContextValue): Promise<PriceTag[]> {
    const ownNftTokenIdList = (
      await moralis.Moralis.Web3API.account.getNFTsForContract({
        chain: CHAIN,
        address: moralis.account!,
        token_address: coolingOffContract.contractAddress
      })
    ).result!.map((token) => token.token_id);
    const nftTokenIdListExcludeOwned = (
      await moralis.Moralis.Web3API.token.getAllTokenIds({
        address: coolingOffContract.contractAddress,
        chain: CHAIN
      })
    )
      .result!.map((token) => token.token_id)
      .filter((tokenId) => !ownNftTokenIdList.includes(tokenId));
    const tokenIdPriceList: { tokenId: TokenId; price: number }[] = await Promise.all(
      nftTokenIdListExcludeOwned.map(async (tokenId) => {
        return {
          tokenId: tokenId,
          price: await smartContractCaller.getAskPrice(moralis, tokenId)
        };
      })
    );
    return await Promise.all(
      tokenIdPriceList
        .filter((tokenIdAndPrice) => tokenIdAndPrice.price !== 0)
        .map(async (tokenIdPrice) => {
          return {
            nft: {
              tokenId: tokenIdPrice.tokenId,
              imageUrl: sampleImageUrl
            },
            price: tokenIdPrice.price
          };
        })
    );
  }

  async setSellingPrice(moralis: MoralisContextValue, nft: Nft, price: number): Promise<number> {
    const previousPrice = await smartContractCaller.getAskPrice(moralis, nft.tokenId);
    const newPrice = await smartContractCaller.setAskPrice(moralis, moralis.account!, nft.tokenId, price);
    console.log(`change selling price ${previousPrice} to ${newPrice}`);
    return newPrice;
  }

  async purchaseNft(moralis: MoralisContextValue, address: Address, nft: Nft, price: number): Promise<TxHash> {
    console.log("purchase !");
    return await smartContractCaller.purchase(moralis, address, nft.tokenId, price);
  }

  async coolingOffNft(moralis: MoralisContextValue, nft: Nft): Promise<boolean> {
    console.log("Cooling off");
    const latestTransferTxHash = (
      await moralis.Moralis.Web3API.token.getWalletTokenIdTransfers({
        chain: CHAIN,
        address: coolingOffContract.contractAddress,
        token_id: nft.tokenId
      })
    ).result[0].transaction_hash;
    return await smartContractCaller.coolingOff(
      moralis,
      nft.tokenId,
      await this.getTradeHash(latestTransferTxHash, "previous")
    );
  }

  async getTradeList(moralis: MoralisContextValue): Promise<Trade[]> {
    const transfers = await moralis.Moralis.Web3API.account.getNFTTransfers({
      address: moralis.account!,
      chain: "rinkeby"
    });
    return transfers.result
      .filter((transfer) => transfer.token_address === coolingOffContract.contractAddress.toLowerCase())
      .map((transfer) => {
        return {
          txHash: transfer.transaction_hash,
          tokenId: transfer.token_id,
          from: transfer.from_address!,
          to: transfer.to_address,
          price: Number(Moralis.Units.FromWei(transfer.value!))
        };
      });
  }

  //TODO add argument
  async receivePayment(moralis: MoralisContextValue, txHash: TxHash): Promise<number> {
    const tradeHash = await this.getTradeHash(txHash, "next");
    await smartContractCaller.receivePayment(moralis, tradeHash);
    return 123;
  }

  private async getTradeHash(txHash: TxHash, type: "previous" | "next") {
    const targetTxEvent = (await this.myContract.getPastEvents("allEvents", { fromBlock: 1 })).filter(
      (event) => event.transactionHash === txHash
    );
    const abiIndex = type === "previous" ? "3" : "6";
    return targetTxEvent.find((event) => event.event === "Purchase")!.returnValues[abiIndex];
  }
})();

const smartContractCaller = new (class {
  async getAskPrice(moralis: MoralisContextValue, tokenId: TokenId): Promise<number> {
    //if it was succeeded return true
    //it maybe will change return value type
    const response = await moralis.Moralis.executeFunction({
      ...coolingOffContract,
      functionName: "prices",
      params: { "": tokenId }
    });
    return Number(Moralis.Units.FromWei(response as any));
  }

  async setAskPrice(
    moralis: MoralisContextValue,
    address: Address,
    tokenId: TokenId,
    askPrice: number
  ): Promise<number> {
    const sendOptions = {
      ...coolingOffContract,
      functionName: "setPrice",
      params: {
        tokenId: Number(tokenId),
        price: Moralis.Units.ETH(askPrice)
      }
    };

    const transaction = await moralis.Moralis.executeFunction(sendOptions);
    await ((transaction as any) as { wait: () => void }).wait();
    return await this.getAskPrice(moralis, tokenId);
  }

  async purchase(moralis: MoralisContextValue, address: Address, tokenId: TokenId, askPrice: number): Promise<TxHash> {
    const transaction = await moralis.Moralis.executeFunction({
      ...coolingOffContract,
      functionName: "purchase",
      msgValue: Moralis.Units.ETH(askPrice),
      params: {
        tokenId: Number(tokenId)
      }
    });
    return transaction.hash;
  }

  async coolingOff(moralis: MoralisContextValue, tokenId: TokenId, previousHash: string): Promise<boolean> {
    await moralis.Moralis.executeFunction({
      ...coolingOffContract,
      functionName: "coolingOff",
      params: {
        tokenId: Number(tokenId),
        previousHash: previousHash
      }
    });
    return true;
  }

  async receivePayment(moralis: MoralisContextValue, tradeHash: string): Promise<boolean> {
    await moralis.Moralis.executeFunction({
      ...coolingOffContract,
      functionName: "receivePayment",
      params: {
        tradeHash: tradeHash
      }
    });

    return true;
  }
})();
