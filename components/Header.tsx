import React from "react";
import { CgMenuGridO } from "react-icons/cg";
import logo from "../assets/images/gemma_logo.webp";
import Image from "next/image";
import { FaCoins } from "react-icons/fa";
import "react-simple-hook-modal/dist/styles.css";
import Link from "next/link";
import { NativeBalance } from "web3uikit";
import { IoMdSearch } from "react-icons/io";

const Header = () => {
  const styles = {
    container: `h-[60px] w-full flex items-center gap-5 px-16`,
    logo: `flex w-[180px] items-center ml-[20px] cursor-pointer flex-1 invert`,
    search: `p-[25px] mr-[30px] w-[400px] h-[40px] bg-white rounded-full shadow-lg flex flex items-center border border-black`,
    searchInput: `bg-transparent focus:outline-none border-none flex-1 items-center flex`,
    menu: `flex items-center gap-6`,
    menuItem: `flex items-center text-md font-bold cursor-pointer`,
    nativeBalance: `flex`,
    coins: `mx-[10px]`
  };
  return (
    <div className={styles.container}>
      <Link href="/">
        <div className={styles.logo}>
          <Image src={logo} alt="gemma" height={50} width={180} className="object-cover" />
        </div>
      </Link>
      <div className={styles.search}>
        <input type="text" placeholder="Search Your Assets..." className={styles.searchInput} />
        <IoMdSearch fontSize={20} />
      </div>
      <div className={styles.menu}>
        <div className={styles.nativeBalance}>
          <FaCoins className={styles.coins} />
          <NativeBalance />
          ETH
        </div>
      </div>
    </div>
  );
};

export default Header;
