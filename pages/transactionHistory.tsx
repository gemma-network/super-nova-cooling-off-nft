import React, { useContext } from "react";
import { getEllipsisTxt } from "web3uikit";
import Header from "../components/Header";
import { IColumnDefinition, ITableBaseProps, ITableDataDefinition } from "../components/table/ITableBase";
import TableBase from "../components/table/TablaBase";
import { GemmaContext } from "../context/GemmaContext";

const TransactionHistory = () => {
  const styles = {
    recieveBtn: `w-[100px] h-[50px] bg-[#000] rounded-lg flex mx-auto text-white justify-center items-center cursor-pointer disabled:bg-opacity-50`
  };
  const networkId = 4;
  const etherscanLink = require("@metamask/etherscan-link");
  const { transactionHistory } = useContext(GemmaContext);
  const { recievePayment } = useContext(GemmaContext).web3Actions;
  const columns: IColumnDefinition[] = [
    {
      name: "recieve",
      key: "recieve",
      className: `text-sm w-[100px] text-gray-900 font-light py-4 whitespace-nowrap text-center`,
      component: (data, column) => (
        <button
          className={styles.recieveBtn}
          onClick={async () => recievePayment({ txHash: data["txHash"] as string })}
        >
          {column}
        </button>
      )
    },
    {
      name: "tokenId",
      key: "tokenId",
      className: `text-sm w-[170px] text-gray-900 font-light py-4 whitespace-nowrap text-center`
    },
    {
      name: "price",
      key: "price",
      className: `text-sm w-[170px] text-gray-900 font-light py-4 whitespace-nowrap text-center`
    },
    // {
    //   name: "to",
    //   key: "to",
    //   className: `text-sm w-[170px] text-gray-900 font-light py-4 whitespace-nowrap text-center`
    // },
    // {
    //   name: "from",
    //   key: "from",
    //   className: `text-sm w-[170px] text-gray-900 font-light py-4 whitespace-nowrap text-center`
    // },
    {
      name: "txHash",
      key: "txHash",
      className: `text-sm w-[170px] text-gray-900 font-light py-4 whitespace-nowrap text-center`,
      component: (data, column) => {
        const txLink = etherscanLink.createExplorerLink(data[column], networkId);
        return (
          <a target="_blank" href={txLink} rel="noreferrer">
            {getEllipsisTxt(data[column].toString())}
          </a>
        );
      }
    }
  ];

  const data: ITableDataDefinition[] = transactionHistory;

  const tableBaseProps: ITableBaseProps = {
    columns: columns,
    data: data,
    key_column: "txHash"
  };
  return (
    <>
      <TableBase {...tableBaseProps} />
    </>
  );

  // return <TableBase {...tableBaseProps} />;
};

export default TransactionHistory;
