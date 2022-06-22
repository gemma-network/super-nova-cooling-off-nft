import React from "react";
import { ReactNode } from "react";
import { Nft, PriceTag, Trade } from "../lib/web3Api";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IGemmaProviderProps {
  children: ReactNode;
}

export interface IGemmaTradeNftProps {
  nft: Nft;
  price: number;
}

export interface IGemmaCoolingNftProps {
  nft: Nft;
}

export interface IGemamContextValues {
  formattedAccount: string;
  isAuthenticated: boolean;
  amountDue: string;
  setAmountDue: SetState<string>;
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  etherscanLink: string;
  setEtherscanLink: SetState<string>;
  currentAccount: string;
  nickname: string;
  setNickname: SetState<string>;
  username: string;
  setUsername: SetState<string>;
  handleSetUsername: () => void;
  recentTransactions: any;
  ownedTokenList: Nft[];
  purchasableTokenList: PriceTag[];
  transactionHistory: Trade[];
  web3Actions: {
    purchaseNft: ({ nft, price }: IGemmaTradeNftProps) => Promise<boolean>;
    setSellingPrice: ({ nft, price }: IGemmaTradeNftProps) => Promise<number>;
    coolingOffNft: ({ nft }: IGemmaCoolingNftProps) => Promise<boolean>;
    recievePayment: ({ txHash }: { txHash: string }) => Promise<number>;
  };
}
