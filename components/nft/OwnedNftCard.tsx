import React from "react";
import { Modal, ModalTransition, useModal } from "react-simple-hook-modal";
import { Nft } from "../../lib/web3Api";
import ButtonBase from "../button/ButtonBase";
import CoolingOffModal from "../modals/CoolingOffModal";
import SetAskPriceModal from "../modals/SetAskPriceModal";
import NftCard from "./NftCardBase";

interface IOwnedNftCardModalButtonProps {
  text: string;
  nft: Nft;
  className?: string;
}

interface IOwndNftCard {
  nft: Nft;
}

const CoolingOffModalButton = (props: IOwnedNftCardModalButtonProps) => {
  const { text, className, nft } = props;
  const { openModal, isModalOpen, closeModal } = useModal();
  return (
    <>
      <ButtonBase onClick={openModal} text={text} className={className} />
      <Modal id={`token-card-${nft.tokenId}`} isOpen={isModalOpen} transition={ModalTransition.SCALE}>
        <CoolingOffModal close={closeModal} nft={nft} />
      </Modal>
    </>
  );
};

const SetAskModalButton = (props: IOwnedNftCardModalButtonProps) => {
  const { text, className, nft } = props;
  const { openModal, isModalOpen, closeModal } = useModal();
  return (
    <>
      <ButtonBase onClick={openModal} text={text} className={className} />
      <Modal id={`token-card-${nft.tokenId}`} isOpen={isModalOpen} transition={ModalTransition.SCALE}>
        <SetAskPriceModal close={closeModal} nft={nft} />
      </Modal>
    </>
  );
};

const OwnedNftCard = (props: IOwndNftCard) => {
  const styles = {
    btnWrapper: `flex h-[300px]`,
    setAskBtn: `w-[90px] h-[50px] mt-[100px] bg-[#000] rounded-lg mx-auto text-whdite justify-center items-center cursor-pointer hover:scale-105 text-white`,
    coolingOffBtn: `w-[90px] h-[50px] mt-[100px] bg-[#000] rounded-lg mx-auto text-whdite justify-center items-center cursor-pointer hover:scale-105 text-white`
  };
  const { nft } = props;
  return (
    <NftCard nft={nft}>
      <div className={styles.btnWrapper}>
        <SetAskModalButton className={styles.setAskBtn} text="Sell" nft={nft} />
        <CoolingOffModalButton className={styles.coolingOffBtn} text="Cancel" nft={nft} />
      </div>
    </NftCard>
  );
};

export default OwnedNftCard;
