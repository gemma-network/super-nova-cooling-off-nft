import React, { ReactNode } from "react";
import { Nft } from "../../lib/web3Api";
import Image from "next/image";

interface INftcardProps {
  nft: Nft;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const NftCard = (props: INftcardProps) => {
  const styles = {
    cardWrapper: `flex flex-col h-[400px] w-[280px] mx-[10px]`,
    card: `h-[130px] w-[280px] p-[20px] rounded-3xl bg-gradient-to-l from-[#0d141c] to-[#42667e] relative transition-all duration-300  border-2 border-[#fb9701]`,
    cardCross: `h-[180px] w-[125px] rounded-3xl absolute bottom-[20px] left-[20px] transition-all duration-300 flex overflow-hidden`,
    objectCover: `mx-auto`,
    cardTitle: `h-[120px] mx-auto text-2xl`
  };
  const { nft, children, onClick } = props;
  const { imageUrl, tokenId } = nft;
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardTitle}>Token Id : [{tokenId}]</div>
      <div className={styles.card} key={tokenId} onClick={onClick}>
        <div className={styles.cardCross}>
          <div className={styles.objectCover}>
            <Image height={180} width={125} src={imageUrl} alt={tokenId} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default NftCard;
