import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';

class Deploy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: '',
      fileAbi: '',
      fileBin: '',
      abi: '',
      bin: '',
      txHash: '',
      tx: '',
      contractAddr: '',
    };
    this.beth = new Browseth('https://mainnet.infura.io/mew');
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Deploying a Contract</h2>
            Your Private Key{' '}
            <input
              type="text"
              value={this.state.from}
              onChange={this.updateFrom}
              placeholder="YOUR_PRIVATE_KEY"
            />
            <br />
            <br />
            Upload an abi file{' '}
            <input
              type="file"
              ref={node => {
                this.fileinput = node;
              }}
              onChange={this.handleAbiUpload}
            />
            <br />
            Upload a bin file{' '}
            <input
              type="file"
              ref={node => {
                this.fileinput2 = node;
              }}
              onChange={this.handleBinUpload}
            />
            <h3>Or paste here</h3>
            <input
              type="text"
              value={this.state.abi}
              onChange={this.updateAbi}
              placeholder="YOUR_ABI"
            />
            <br />
            <input
              type="text"
              value={this.state.bin}
              onChange={this.updateBin}
              placeholder="YOUR_BIN"
            />
            <br />
            <button onClick={this.deploy}>Deploy!</button>
            <br />
            Transaction Hash: {this.state.txHash ? this.state.txHash : ''}
            <br />
            Transaction: {this.state.transaction ? this.state.tx : ''}
            <br />
            Contract Address:{' '}
            {this.state.contractAddr ? this.state.contractAddr : ''}
            <br />
            {this.state.err === '' ? '' : this.state.err}
          </div>
        </div>
        <div className="right">
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                `
  // Create an "Offline" wallet, necessary for "send"ing the contract
  beth.wallet = new Browseth.Wallets.Offline(
    beth.rpc,
    Browseth.Signers.PrivateKey.fromHex(YOUR_PRIVATE_KEY),
  );

  // Instantiate a Transaction Listener to know when your contract is available
  // Then have it start polling immediately
  const transactionListener = new Browseth.Apis.TransactionListener(beth.wallet);
  transactionListener.startPolling();

  // Add our contract to our browseth instance
  // Abi and bytecode are necessary for deploying
  beth.addContract('ContractName', YOUR_ABI, {bytecode: YOUR_BIN});

  // Deploy the contract and add the resulting transaction hash to our listener
  const transactionHash = await beth.contract.ContractName.deploy().send();
  const transaction = await transactionListener.resolveTransaction(transactionHash);

  // Update our contracts address so we make function calls on it
  beth.contract.ContractName.options.address = transaction.contractAddress;
                `,
                Prism.languages.javascript,
                'javascript',
              ),
            }}
          />
        </div>
      </div>
    );
  }

  updateAbi = e => {
    this.setState({
      abi: e.target.value,
    });
  };

  updateBin = e => {
    this.setState({
      bin: e.target.value,
    });
  };

  updateFrom = e => {
    this.setState({
      from: e.target.value,
    });
  };

  deploy = async () => {
    try {
      this.beth.wallet = new Browseth.Wallets.Offline(
        this.beth.rpc,
        new Browseth.Signers.PrivateKey.fromHex(this.state.from),
      );

      const transactionListener = new Browseth.Apis.TransactionListener(
        this.beth.wallet,
      );
      transactionListener.startPolling();

      this.beth.addContract(
        'sample',
        this.state.fileAbi !== '' ? this.state.fileAbi : this.state.abi,
        {
          bytecode:
            this.state.fileBin !== '' ? this.state.fileBin : this.state.bin,
        },
      );

      const transactionHash = await this.beth.contract.sample.deploy().send();
      console.log(transactionHash);
      this.setState({txHash: transactionHash});
      const transaction = await transactionListener.resolveTransaction(
        transactionHash,
      );
      console.log(transaction);
      this.beth.contract.sample.options.address = transaction.contractAddress;
      this.setState({
        txHash: transactionHash,
        tx: transaction,
        contractAddr: transaction.contractAddress,
      });
    } catch (err) {
      console.error(err);
      this.setState({err: 'Error trying to deploy!'});
    }
  };

  handleAbiUpload = () => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      console.log(fileReader.result);
      this.setState({fileAbi: fileReader.result});
    };
    fileReader.readAsText(this.fileinput.files[0]);
  };

  handleBinUpload = () => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      console.log(fileReader.result);
      this.setState({fileBin: fileReader.result});
    };
    fileReader.readAsText(this.fileinput2.files[0]);
  };
}

export default Deploy;
