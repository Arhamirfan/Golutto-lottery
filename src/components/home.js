import React from "react";
import LotteryApp from "./lottery/lotteryApp";
const Home = () => {
  // const web3version = () => {
  //   alert(web3.version);
  // };

  // const web3account = () => {
  //   // web3.eth.getAccounts().then(console.log);
  //   web3.eth.requestAccounts().then(console.log);
  // };
  return (
    <>
      <div className="container">
        <h2>Golutto Lottery</h2>

        {/* <button className="btn btn-primary" onClick={() => web3version()}>
          Get version
        </button>

        <button className="btn btn-primary" onClick={() => web3account()}>
          Get account
        </button> */}
        <div className="col-12">
          <LotteryApp />
        </div>
      </div>
    </>
  );
};

export default Home;
