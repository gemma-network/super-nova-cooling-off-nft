import React, { useContext } from "react";
import { GemmaContext } from "../../context/GemmaContext";

export interface IModalButton {
  onClick: () => any;
  text: string;
  disabled?: boolean;
  className?: string;
}

const ButtonBase = (props: IModalButton) => {
  const styles = {
    btn: `w-[140px] h-[50px] bg-[#000] mt-[40px] rounded-lg flex mx-auto text-white justify-center items-center cursor-pointer disabled:bg-opacity-50`
  };
  const { onClick, text, className, disabled } = props;
  const { isLoading } = useContext(GemmaContext);
  return (
    <button
      className={[className, styles.btn].join(" ")}
      disabled={disabled || isLoading}
      onClick={async () => {
        onClick();
      }}
    >
      {text}
    </button>
  );
};

export default ButtonBase;
