import React, { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { IGemamContextValues, IGemmaProviderProps, IGemmaTradeNftProps, IGemmaCoolingNftProps } from "./IGemmaContext";
import { Nft, PriceTag, Trade, web3Api } from "../lib/web3Api";

export const GemmaContext = createContext<IGemamContextValues>({} as IGemamContextValues);

export const GemmaProvider = ({ children }: IGemmaProviderProps) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formattedAccount, setFormattedAccount] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [etherscanLink, setEtherscanLink] = useState("");
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]); //Transaction
  const [ownedTokenList, setOwnedTokenList] = useState<Nft[]>([]);
  const [purchasableTokenList, setPurchasableTokenList] = useState<PriceTag[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<Trade[]>([]);

  const moralis = useMoralis();
  const {
    isInitialized,
    authenticate,
    isAuthenticated,
    isAuthenticating,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account
  } = moralis;

  let requestingCount = 0;
  let isLoadingOwnedTokenList = false;
  let isLoadingPurchasableTokenList = false;

  const { data: userData, error: userDataError, isLoading: userDataIsLoading } = useMoralisQuery("_User");

  useEffect(() => {
    const f = async () => {
      await connectWallet();
    };
    f();
  }, [userData, userDataIsLoading]);

  useEffect(() => {
    const f = async () => {
      // if (!isAuthenticated || !isWeb3Enabled) await connectWallet(); //force connect after logout
      if (isAuthenticated && isWeb3Enabled) {
        await listenToUpdates();
        await updateTokenLists();
      } else {
        setOwnedTokenList([]);
        setPurchasableTokenList([]);
      }
    };
    f();
  }, [isAuthenticated && isWeb3Enabled]);

  useEffect(() => {
    const f = async () => {
      if (isAuthenticated && isWeb3Enabled) {
        const currentUsername = await user?.get("nickname");
        setUsername(currentUsername);
        const account = await user?.get("ethAddress");
        setCurrentAccount(account);
        const formatAccount = account?.slice(0, 5) + "..." + account?.slice(-5);
        setFormattedAccount(formatAccount);
      } else {
        setCurrentAccount("");
        setFormattedAccount("");
      }
    };
    f();
  }, [currentAccount, user, username, isAuthenticated, isWeb3Enabled]);

  useEffect(() => {
    // purchasableTokenList must be updated after ownedTokenList
    const f = async () => {
      if (isAuthenticated && isWeb3Enabled) {
        await updatePurchasableTokenList();
      } else {
        setPurchasableTokenList([]);
      }
    };
    f();
  }, [ownedTokenList]);

  const connectWallet = async () => {
    if (!isWeb3Enabled && !isWeb3EnableLoading) await enableWeb3();
    if (!isAuthenticated && !isAuthenticating && isWeb3Enabled) await authenticate();
  };

  const web3Action = async (actionFunc: () => Promise<any>, onSuccess?: () => any, onFailed?: () => any) => {
    if (!isAuthenticated || !isWeb3Enabled) await connectWallet();
    let result = null;
    if (isAuthenticated && isWeb3Enabled && isInitialized) {
      setIsLoading(true);
      requestingCount = requestingCount + 1;
      try {
        result = await actionFunc();
        onSuccess ? onSuccess() : null;
      } catch (error) {
        onFailed ? onFailed() : console.error(error);
      }
      requestingCount = requestingCount - 1;
      if (requestingCount <= 0) setIsLoading(false);
    }
    return result;
  };

  const updateOwnedTokenList = async () => {
    const action = async () => {
      try {
        if (account && !isLoadingOwnedTokenList) {
          isLoadingOwnedTokenList = true;
          setOwnedTokenList(await web3Api.getNftListOwnedBy(moralis, account));
        }
      } catch (error) {
        // catch rate-limit
        console.error(error);
      }
    };
    web3Action(action);
    isLoadingOwnedTokenList = false;
  };

  const updatePurchasableTokenList = async () => {
    const action = async () => {
      try {
        if (!isLoadingPurchasableTokenList) {
          isLoadingPurchasableTokenList = true;
          const allPurchasableTokenList = await web3Api.getPurchasableNftList(moralis);
          const execludeOwnedPurchasableTokenList = allPurchasableTokenList.filter(
            (purchasableToken) =>
              !ownedTokenList.some((ownedToken) => ownedToken.tokenId === purchasableToken.nft.tokenId)
          );
          setPurchasableTokenList(execludeOwnedPurchasableTokenList);
        }
      } catch (error) {
        // catch rate-limit
        console.error(error);
      }
    };
    web3Action(action);
    isLoadingOwnedTokenList = false;
  };

  const updateTradeList = async () => {
    const action = async () => setTransactionHistory(await web3Api.getTradeList(moralis));
    return web3Action(action);
  };

  const updateTokenLists = async () => {
    await updateOwnedTokenList();
    await updateTradeList();
  };

  const purchaseNft = async ({ nft, price }: IGemmaTradeNftProps) => {
    const action = async () => {
      return (await web3Api.purchaseNft(moralis, currentAccount, nft, price)) !== undefined;
    };
    return await web3Action(action);
  };

  const setSellingPrice = async ({ nft, price }: IGemmaTradeNftProps) => {
    const action = async () => await web3Api.setSellingPrice(moralis, nft, price);
    return await web3Action(action);
  };

  const coolingOffNft = async ({ nft }: IGemmaCoolingNftProps) => {
    const action = async () => await web3Api.coolingOffNft(moralis, nft);
    return await web3Action(action);
  };

  const recievePayment = async ({ txHash }: { txHash: string }) => {
    const action = async () => await web3Api.receivePayment(moralis, txHash);
    return await web3Action(action);
  };

  const handleSetUsername = () => {
    if (user) {
      if (nickname) {
        user.set("nickname", nickname);
        user.save();
        setNickname("");
      } else {
        console.warn("Can't set empty nickname");
      }
    } else {
      console.warn("No user");
    }
  };

  const listenToUpdates = async () => {
    let query = new Moralis.Query("EthTransactions");
    let subscription = await query.subscribe();
    subscription.on("update", async (object) => {
      console.log("New Transactions");
      console.log(object);
      setRecentTransactions([object]);
      await updateTokenLists();
    });
  };

  return (
    <GemmaContext.Provider
      value={{
        formattedAccount,
        isAuthenticated,
        amountDue,
        setAmountDue,
        isLoading,
        setIsLoading,
        setEtherscanLink,
        etherscanLink,
        currentAccount,
        nickname,
        setNickname,
        username,
        setUsername,
        handleSetUsername,
        recentTransactions,
        ownedTokenList,
        purchasableTokenList,
        transactionHistory,
        web3Actions: {
          purchaseNft,
          setSellingPrice,
          coolingOffNft,
          recievePayment
        }
      }}
    >
      {children}
    </GemmaContext.Provider>
  );
};
