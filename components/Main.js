import React, { useContext, useEffect } from "react";
import { GemmaContext } from "../context/GemmaContext";
import OwnedNftList from "./OwnedNftList";
import PurchasableNftList from "./PurchasableNftList";
import Header from "./Header";

const Main = () => {
  const styles = {
    container: `h-full max-w-screen-xl flex flex-col mt-[50px] pr-[50px] overflow-hidden`,
    recentTitle: `text-2xl font-bold text-center mb-[20px] text-center mt-[40px]`,
    recentTransactionsList: `flex flex-col`,
    transactionCard: `flex justify-between mb-[20px] p-[30px] bg-[#42667e] text-white rounded-xl shadow-xl font-bold gap-[20px] text-xl`
  };
  const { recentTransactions } = useContext(GemmaContext);

  return (
    <>
      <OwnedNftList />
      <PurchasableNftList />
      {recentTransactions.length > 0 && <h1 className={styles.recentTitle}>Recent Transaction</h1>}
      {recentTransactions &&
        recentTransactions.map((transaction, index) => {
          return (
            <div key={index} className={styles.recentTransactionsList}>
              <div className={styles.transactionCard}>
                <p>From: {transaction.attributes.from_address}</p>
                <p>To: {transaction.attributes.to_address} </p>
                <p>
                  Hash:{" "}
                  <a
                    target={"_blank"}
                    rel="noopener noreferrer"
                    href={`https://rinkeby.etherscan.io/tx/${transaction.attributes.hash}`}
                  >
                    {transaction.attributes.hash.slice(0, 10)}
                  </a>
                </p>
                <p>Gas: {transaction.attributes.gas}</p>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Main;
