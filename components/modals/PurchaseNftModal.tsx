import React, { useContext, useState } from "react";
import ModalBase from "./ModalBase";
import { PriceTag } from "../../lib/web3Api";
import { GemmaContext } from "../../context/GemmaContext";
import Image from "next/image";
import ButtonBase from "../button/ButtonBase";

interface IPurchaseNftModalProps {
  close: () => void;
  priceTagedNft: PriceTag;
}

const PurchaseNftModal = (props: IPurchaseNftModalProps) => {
  const styles = {
    title: `text-3xl font-bold flex flex-1 items-center mt-[0px] justify-center mb-[40px]`,
    content: `flex w-full mb-[20px] text-xl justify-center`,
    input: `w-[50%] h-[50px] bg-[#f7f6f2] rounded-lg p-[10px] flex mx-auto border-slate-600`,
    inputBox: `w-full h-full flex items-center justify-center bg-[#f7f6f2] focus:outline-none`,
    price: `w-full h-full flex justify-center items-center mt-[20px] font-bold text-3xl`,
    purchaseBtn: `w-[20%] h-[50px] bg-[#000] mt-[20px] rounded-lg p-[10px] flex mx-auto text-white justify-center items-center cursor-pointer`,
    imageSize: `h-[200px] mx-auto mb-[20px]`,
    objectCover: `mx-auto`,
    success: `w-full h-full flex items-center justify-center text-xl mt-[20px] font-bolder`
  };
  const { close, priceTagedNft } = props;
  const { nft, price } = priceTagedNft;
  const { purchaseNft } = useContext(GemmaContext).web3Actions;

  const closeFunction = () => {
    close();
  };

  const onClick = async () => {
    await purchaseNft({ nft, price });
    closeFunction();
  };

  return (
    <ModalBase close={closeFunction}>
      <div className={styles.title}>Confirmation</div>
      <div className={styles.content}>tokenId:{nft.tokenId}</div>
      <div className={styles.objectCover}>
        <Image height={200} width={125} className={styles.imageSize} src={nft.imageUrl} alt={nft.tokenId} />
      </div>
      <div className={styles.content}>price:{price}</div>
      <ButtonBase onClick={onClick} text="BUY NOW" />
    </ModalBase>
  );
};

export default PurchaseNftModal;
