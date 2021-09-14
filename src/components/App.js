import React, { useEffect, useState } from 'react'
import Nav from "./Nav";
import Web3 from 'web3';
import ReactLoading from 'react-loading';
import Lottery from "../abis/Lottery.json";
import "./App.css";


const App = () => {

  const [account, setAccount] = useState();
  const [lotteryContract, setLotteryContract] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [manager, setManager] = useState();
  const [cBalance, setCbalance] = useState();


  useEffect(() => {
    loadWeb3();
    loadBlockChainData();
  }, [])


  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockChainData = async () => {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    if (accounts == "0xd37D1F7316FE434c89Dc52a9Cb37bE6b998756a7") {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }

    const networkId = await web3.eth.net.getId();
    const networkData = Lottery.networks[networkId];

    if (networkData) {
      const lotteryContract = web3.eth.Contract(Lottery.abi, networkData.address);
      setLotteryContract(lotteryContract);

      const owner = await lotteryContract.methods.manager().call();
      setManager(owner)


      setLoading(true);

      const participantCount = await lotteryContract.methods.participantLenght().call();
      const participantLength = participantCount.toNumber();


      for (var i = 0; i < participantLength; i++) {
        const participant = await lotteryContract.methods.participants(i).call()
        setParticipants((participants) => [...participants, participant])
      }

      const balance = await lotteryContract.methods.getBalance().call();
      const bal = window.web3.utils.fromWei(balance.toString(), 'Ether');
      setCbalance(bal);


      setLoading(false);
    } else {
      window.alert('Note Contract not deployed to detected network!');
    }
  }

  const buyLottery = async (tipAmount) => {
    const text = document.getElementById('input').value;
    if (text == '2') {
      lotteryContract.methods.buyLottery().send({ from: account, value: tipAmount })
    } else if (!text) {
      window.alert("Enter Valid Amount!")
    } else {
      window.alert("Enter Valid Amount!")
    }
  }

  const selectWinner = async () => {
      await lotteryContract.methods.selectWinner().send({ from: manager });
  }




  return (
    <div>
      <Nav account={account} />
      <div className="container-lg banner my-2">
        <h4 className="display-6 header mt-3">Welcome to D-Loto! 🤑</h4>
        <small className="headInfo">A Decentralize Lottery application</small>

      </div>
      <div className="container-lg mt-3 mb-5 w-50 border p-5">
        <small>
          <ul class="list-group">
            <li class="list-group-item list-group-item-warning mb-1"><i class="fa fa-info-circle" aria-hidden="true"></i> Buy a Lottery ticket and get a chance to win upto tripple amount 💰 </li>
            <li class="list-group-item list-group-item-warning mb-1"><i class="fa fa-info-circle" aria-hidden="true"></i> Price of ticket : 2 ETH</li>
          </ul>
        </small>
        <input type="text" className="form-control mt-2" placeholder="Enter ammount" id="input" />
        <button
          onClick={(e) => {
            e.preventDefault()
            let tipAmount = window.web3.utils.toWei('2', 'Ether')
            console.log(tipAmount)
            buyLottery(tipAmount)
          }}
          className="btn btn-primary mt-3 mb-4 text-center"
        >Buy Lottery</button>



        <div className="participants">
          {
            loading ? <ReactLoading style={{
              marginLeft: "45%",
              marginBottom: "10%",
              height: "5%",
              width: "5%"
            }} type='spinningBubbles' color='black' /> :
              (
                <ul class="list-group">
                  <li class="list-group-item active bg-secondary border-secondary" aria-current="true">Participants List</li>
                  {
                    participants.map((part, id = 0) => {
                      id++;
                      return (
                        <li class="list-group-item mb-1">{id}. &nbsp; {part}</li>
                      )
                    })
                  }

                </ul>
              )
          }
        </div>

        <div className='list mt-3'>
          <small className={isOwner ? `lists` : `isOwner`}>Total Participants : {participants.length}</small>
          <small className={isOwner ? `lists` : `isOwner`}>Contract Balance : {cBalance} ETH</small>
        </div>
        <div className="ownerSection" >
          <div onClick={selectWinner} className={isOwner ? `btn btn-success mt-3` : `isOwner btn btn-success mt-3`}>Select Winner</div>
        </div>
        <div className="text-secondary text-right mt-3">
          <small>Organised by : {manager}</small>
        </div>

      </div>
    </div>
  )
}

export default App
