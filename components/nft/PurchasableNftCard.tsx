import React from "react";
import { Modal, ModalTransition, useModal } from "react-simple-hook-modal";
import { PriceTag } from "../../lib/web3Api";
import ButtonBase from "../button/ButtonBase";
import PurchaseNftModal from "../modals/PurchaseNftModal";
import NftCard from "./NftCardBase";

interface ICoolingOffModalButtonProps {
  text: string;
  priceTaggedNft: PriceTag;
  className?: string;
}

const PurchaseNftModalButton = (props: ICoolingOffModalButtonProps) => {
  const { text, className, priceTaggedNft } = props;
  const { nft } = priceTaggedNft;
  const { openModal, isModalOpen, closeModal } = useModal();
  return (
    <>
      <ButtonBase onClick={openModal} text={text} className={className} />
      <Modal id={`token-card-${nft.tokenId}`} isOpen={isModalOpen} transition={ModalTransition.SCALE}>
        <PurchaseNftModal close={closeModal} priceTagedNft={priceTaggedNft} />
      </Modal>
    </>
  );
};

interface IPurchasableNftCardProps {
  priceTagedNft: PriceTag;
}

const PurchasableNftCard = (props: IPurchasableNftCardProps) => {
  const styles = {
    btnWrapper: `flex`,
    buyBtn: `w-[50%] h-[50px] mt-[70px] bg-[#000] rounded-lg mx-auto text-whdite justify-center items-center cursor-pointer hover:scale-105 text-white`
  };
  const { priceTagedNft } = props;
  const { nft, price } = priceTagedNft;
  return (
    <NftCard nft={nft} key={nft.tokenId}>
      <div className={`ml-[150px] mt-[-90px] mb-[70px]`}>PRICE</div>
      <div className={`ml-[130px] mt-[-70px] mb-[60px] text-2xl text-right`}>
        <span>{price}ETH</span>
      </div>
      <div className={styles.btnWrapper}>
        <PurchaseNftModalButton text="Buy" className={styles.buyBtn} priceTaggedNft={priceTagedNft} />
      </div>
    </NftCard>
  );
};

export default PurchasableNftCard;
