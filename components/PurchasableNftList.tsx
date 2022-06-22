import React, { useContext, useState } from "react";
import PurchasableNftCard from "./nft/PurchasableNftCard";
import { GemmaContext } from "../context/GemmaContext";
import CardSliderBase from "./slider/CardSliderBase";

const PurchasableNftList = () => {
  const styles = {
    container: `h-[500px] w-[1200px] flex p-[20px] flex-col mb-[20px]`,
    title: `text-3xl font-bolder mb-[20px] mt-[30px] ml-[40px]`,
    cards: `h-full w-full flex gap-[100px] justify-start mb-[30px] ml-[30px]`
  };
  const { purchasableTokenList } = useContext(GemmaContext);
  return (
    <div className={styles.container}>
      <div className={styles.title}>Purchasable Token</div>
      <div className={styles.cards}>
        <CardSliderBase>
          {purchasableTokenList.map((priceTag) => {
            return <PurchasableNftCard priceTagedNft={priceTag} key={priceTag.nft.tokenId} />;
          })}
        </CardSliderBase>
      </div>
    </div>
  );
};

export default PurchasableNftList;
