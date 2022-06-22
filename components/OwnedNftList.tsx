import React, { useContext } from "react";
import { GemmaContext } from "../context/GemmaContext";
import OwnedNftCard from "./nft/OwnedNftCard";
import CardSliderBase from "./slider/CardSliderBase";

const OwnedNftList = () => {
  const styles = {
    container: `h-[500px] w-[1200px] flex p-[20px] flex-col mb-[24px]`,
    title: `text-3xl font-bolder mb-[20px] mt-[30px] ml-[40px]`,
    cards: `h-full w-full flex gap-[100px] justify-start mb-[30px] ml-[30px]`
  };
  const { ownedTokenList } = useContext(GemmaContext);
  return (
    <div className={styles.container}>
      <div className={styles.title}>Your Tokens</div>
      <div className={styles.cards}>
        <CardSliderBase>
          {ownedTokenList.map((nft) => {
            return <OwnedNftCard nft={nft} key={nft.tokenId} />;
          })}
        </CardSliderBase>
      </div>
    </div>
  );
};

export default OwnedNftList;
