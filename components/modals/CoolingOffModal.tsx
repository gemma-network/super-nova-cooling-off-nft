import React, { useContext, useState } from "react";
import { Nft } from "../../lib/web3Api";
import ModalBase from "./ModalBase";
import Image from "next/image";
import { GemmaContext } from "../../context/GemmaContext";
import ButtonBase from "../button/ButtonBase";

interface ICoolingOffModalProps {
  close: () => void;
  nft: Nft;
}

const CoolingOffModal = (props: ICoolingOffModalProps) => {
  const styles = {
    title: `text-3xl font-bold flex flex-1 items-center justify-center mb-[40px]`,
    content: `flex w-full mb-[30px] text-xl justify-center`,
    input: `w-[50%] h-[80px] bg-[#f7f6f2] rounded-lg flex mx-auto border-slate-600 align-center leading-10 h-10`,
    inputBox: `w-[60%] h-full flex items-center justify-center bg-[#ffffff] border-zinc-600 border rounded text-center mx-auto`,
    price: `w-full h-full flex justify-center items-center mt-[20px] font-bold text-3xl`,
    setAskBtn: `w-[20%] h-[50px] bg-[#000] mt-[40px] rounded-lg flex mx-auto text-white justify-center items-center cursor-pointer disabled:bg-opacity-50`,
    imageSize: `h-[200px] mx-auto mb-[20px]`,
    objectCover: `mx-auto`,
    etherscan: `w-full h-full flex items-center justify-center text-green-500 text-2xl mt-[20px] font-bold cursor-pointer`,
    success: `w-full h-full flex items-center justify-center text-xl mt-[20px] font-bolder`
  };
  const { close, nft } = props;
  const { coolingOffNft } = useContext(GemmaContext).web3Actions;
  const onClick = async () => {
    await coolingOffNft({ nft });
    close();
  };
  return (
    <ModalBase close={close}>
      <div className={styles.title}>Anti Scam</div>
      <div className={styles.content}>{nft.tokenId}</div>
      <div className={styles.objectCover}>
        <Image height={200} width={125} className={styles.imageSize} src={nft.imageUrl} alt={nft.tokenId} />
      </div>
      <ButtonBase onClick={onClick} text="Cooling Off" />
    </ModalBase>
  );
};

export default CoolingOffModal;
