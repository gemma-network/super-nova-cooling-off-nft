import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { GemmaProvider } from "../context/GemmaContext";
import { ModalProvider } from "react-simple-hook-modal";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  const styles = {
    container: `h-full w-[2000px] flex bg-[#fff]`,
    pageContainer: `h-full max-w-screen-xl flex flex-col mt-[50px] pr-[50px] overflow-hidden`
  };

  return (
    <MoralisProvider serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER} appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}>
      <GemmaProvider>
        <ModalProvider>
          <div className={styles.container}>
            <Sidebar />
            <div className={styles.pageContainer}>
              <Header />
              <Component {...pageProps} />
            </div>
          </div>
        </ModalProvider>
      </GemmaProvider>
    </MoralisProvider>
  );
}

export default MyApp;
