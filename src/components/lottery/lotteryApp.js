import React, { Component } from "react";
import lottery from "../../contract/lottery";
import web3 from "../../Wallet/web3";

export default class LotteryApp extends Component {
  state = {
    manager: "",
    currentplayer: "",
    players: [],
    walletbalance: "",
    contractbalance: "",
    value: "",
    message: "",
    winner: "",
    setwinner: false,
  };
  componentDidMount() {
    this.getcontractData();
  }

  getcontractData = async () => {
    const currentconnectedplayer = await web3.eth.requestAccounts();
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    //console.log(lottery.options.address);
    const walletbalanceInWei = await web3.eth.getBalance(
      lottery.options.address
    );
    const contractbalance = await lottery.methods.getBalance().call();

    const walletbalance = web3.utils.fromWei(walletbalanceInWei, "ether");
    this.setState({
      currentplayer: currentconnectedplayer[0],
      manager,
      players,
      walletbalance,
      contractbalance,
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (this.state.value <= 0.01) {
        this.setState({ message: "value cant be less than 0.01 ether" });
      } else {
        const accounts = await web3.eth.requestAccounts();
        //console.log(accounts[0]);
        console.log(
          "from: " + accounts[0] + "value: " + this.state.value,
          "value to Wei",
          web3.utils.toWei(this.state.value, "ether")
        );
        this.setState({ message: "Waiting for transaction to confirm" });
        await lottery.methods.enter().send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, "ether"),
        });
        this.getcontractData();
        this.setState({
          message: "Congratulations, your have entered in GoLutto Lottery",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  onClick = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      this.setState({ message: "Wait for transection to process" });
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      this.setState({ message: "Congratulations we have a winner." });
      const winneraddress = await lottery.methods.winner().call();
      console.log(winneraddress);
      this.setState({ winner: winneraddress });
      this.setState({ setwinner: true });

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <>
        <p> This contract is managed by {this.state.manager} </p>
        <p> Wallet balance: {this.state.walletbalance} </p>
        <p> Contract balance: {this.state.contractbalance} </p>
        <p> Total Players: {this.state.players.length} </p>
        {this.state.players.map((player) => {
          return (
            <div>
              <ol>
                <li>{player}</li>
              </ol>
            </div>
          );
        })}
        <hr></hr>

        <form onSubmit={this.onSubmit}>
          <h4>Enter in lottery</h4>
          <div>
            <label>
              Amount of <strong>Ether</strong> to enter
            </label>
            &nbsp;
            <input
              type={"number"}
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button className="btn btn-success">Enter</button>
        </form>

        <h2>{this.state.message}</h2>

        {this.state.players.length <= 0 ? (
          <></>
        ) : (
          <>
            {this.state.currentplayer !== this.state.manager ? (
              <>
                {this.state.setwinner === true ? (
                  <h2>Winner is : {this.state.winner}</h2>
                ) : (
                  <>Result will be announced soon!</>
                )}
              </>
            ) : (
              <>
                <hr></hr>
                <h3>Pick a winner!</h3>
                <button className="btn btn-danger" onClick={this.onClick}>
                  Get winner
                </button>
                {this.state.setwinner === true ? (
                  <h2>Winner is : {this.state.winner}</h2>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  }
}
