import React, { ReactNode, useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { HashLoader } from "react-spinners";
import { GemmaContext } from "../../context/GemmaContext";

const ModalBase = (props: { close: () => void; children: ReactNode }) => {
  const styles = {
    container: `h-full w-full flex flex-col `,
    closeX: `w-full h-[50px] flex items-center justify-end mb-[20px]`,
    price: `w-full h-full flex justify-center items-center mt-[20px] font-bold text-3xl`,
    loaderContainer: `w-full h-[500px] flex items-center justify-center`,
    loader: `w-full h-full flex items-center justify-center`
  };

  const { close, children } = props;
  const { isLoading } = useContext(GemmaContext);
  return (
    <div className={styles.container}>
      {isLoading ? (
        <>
          <div className={styles.loaderContainer}>
            <HashLoader size={80} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.closeX}>
            <IoIosClose
              onClick={() => {
                close();
              }}
              fontSize={50}
              className="cursor-pointer"
            />
          </div>
          {children}
        </>
      )}
    </div>
  );
};

export default ModalBase;
