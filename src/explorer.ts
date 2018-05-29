import * as Rpcs from './rpc';

// interface ToStringable {toString(): string;}
// type Quantity = string | number | ToStringable;
// type Data = string | Buffer | ArrayBuffer | ArrayBufferVeiw | ToStringable;
// type Block = Quantity | Data;
// type Tag = Block | 'latest' | 'earliest' | 'pending';
// type Unit = 'wei' | 'gwei' | 'ether' ... rest of unit names;

export interface Log {
  removed: boolean; // TAG - true when the log was removed, due to a chain reorganization. false if its a valid log.
  logIndex: number; // QUANTITY - integer of the log index position in the block. null when its pending log.
  transactionIndex: number; // QUANTITY - integer of the transactions index position log was created from. null when its pending log.
  transactionHash: string; // DATA, 32 Bytes - hash of the transactions this log was created from. null when its pending log.
  blockHash: string; // DATA, 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log.
  blockNumber: number; // QUANTITY - the block number where this log was in. null when its pending. null when its pending log.
  address: string; // DATA, 20 Bytes - address from which this log originated.
  data: string; // DATA - contains one or more 32 Bytes non-indexed arguments of the log.
  topics: string[]; // Array of DATA - Array of 0 to 4 32 Bytes DATA of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier.)
}

export interface TransactionReceipt {
  transactionHash: string; // 32 Bytes - hash of the transaction.
  transactionIndex: number; // QUANTITY - integer of the transactions index position in the block.
  blockHash: string; // 32 Bytes - hash of the block where this transaction was in.
  blockNumber: number; // QUANTITY - block number where this transaction was in.
  cumulativeGasUsed: number; // QUANTITY - The total amount of gas used when this transaction was executed in the block.
  gasUsed: number; // QUANTITY - The amount of gas used by this specific transaction alone.
  contractAddress: string; // DATA, 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise null.
  logs: Log[]; // Array - Array of log objects, which this transaction generated. // CHANGE THIS LATER
  logsBloom: string; // DATA, 256 Bytes - Bloom filter for light clients to quickly retrieve related logs
}

export interface TransactionObject {
  hash: string; // DATA, 32 Bytes - hash of the transaction.
  nonce: number; // QUANTITY - the number of transactions made by the sender prior to this one.
  blockHash: string; // DATA, 32 Bytes - hash of the block where this transaction was in. null when its pending.
  blockNumber: number; // QUANTITY - block number where this transaction was in. null when its pending.
  transactionIndex: number; // QUANTITY - integer of the transactions index position in the block. null when its pending.
  from: string; // DATA, 20 Bytes - address of the sender.
  to: string; // DATA, 20 Bytes - address of the receiver. null when its a contract creation transaction.
  value: number; // QUANTITY - value transferred in Wei.
  gasPrice: number; // QUANTITY - gas price provided by the sender in Wei.
  gas: number; // QUANTITY - gas provided by the sender.
  input: string; // DATA - the data send along with the transaction.
}

export interface BlockObject {
  number: number; // QUANTITY - the block number. null when its pending block.
  hash: string; // DATA, 32 Bytes - hash of the block. null when its pending block.
  parentHash: string; // DATA, 32 Bytes - hash of the parent block.
  nonce: string; // DATA, 8 Bytes - hash of the generated proof-of-work. null when its pending block.
  sha3Uncles: string; // DATA, 32 Bytes - SHA3 of the uncles data in the block.
  logsBloom: string; // DATA, 256 Bytes - the bloom filter for the logs of the block. null when its pending block.
  transactionsRoot: string; // DATA, 32 Bytes - the root of the transaction trie of the block.
  stateRoot: string; // DATA, 32 Bytes - the root of the final state trie of the block.
  receiptsRoot: string; // DATA, 32 Bytes - the root of the receipts trie of the block.
  miner: string; // DATA, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
  difficulty: number; // QUANTITY - integer of the difficulty for this block.
  totalDifficulty: number; // QUANTITY - integer of the total difficulty of the chain until this block.
  extraData: string; // DATA - the "extra data" field of this block.
  size: number; // QUANTITY - integer the size of this block in bytes.
  gasLimit: number; // QUANTITY - the maximum gas allowed in this block.
  gasUsed: number; // QUANTITY - the total used gas by all transactions in this block.
  timestamp: number; // QUANTITY - the unix timestamp for when the block was collated.
  transactions: TransactionObject[] | string[]; // Array - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  uncles: string[]; // Array - Array of uncle hashes.
}

export default class BlockchainExplorer {
  public transaction = {
    receipt: (hash: string): Promise<TransactionObject | null> => {
      return this.rpc.send('eth_getTransactionReceipt', hash);
    },

    byBlockAndIndex: (
      block: string | number,
      index: string | number,
    ): Promise<TransactionObject | null> => {
      const blockNum = checkIfString(block);
      const idx = checkIfString(index);
      return /^0x([0-9a-f]{64})/i.test(blockNum)
        ? this.rpc.send('eth_getTransactionByBlockHashAndIndex', blockNum, idx)
        : this.rpc.send(
            'eth_getTransactionByBlockNumberAndIndex',
            blockNum,
            idx,
          );
    },

    byHash: (hash: string): Promise<TransactionObject | null> => {
      return this.rpc.send('eth_getTransactionByHash', hash);
    },

    countByBlock: (block: number | string): Promise<number> | null => {
      const blockNum = checkIfString(block);
      return /^0x([0-9a-f]{64})/i.test(blockNum)
        ? this.rpc.send('eth_getBlockTransactionCountByHash', blockNum)
        : this.rpc.send('eth_getBlockTransactionCountByNumber', blockNum);
    },
  };

  constructor(public rpc: Rpcs.Rpc) {}

  public block(
    block: string | number,
    hasFullTransactions: boolean,
  ): Promise<BlockObject | null> {
    const blockNum = checkIfString(block);
    return /^0x([0-9a-f]{64})/i.test(blockNum)
      ? this.rpc.send('eth_getBlockByHash', blockNum, hasFullTransactions)
      : this.rpc.send('eth_getBlockByNumber', blockNum, hasFullTransactions);
  }

  public blockCount(): Promise<number> {
    return this.rpc.send('eth_blockNumber');
  }

  public uncle(block: string | number, index: number): Promise<BlockObject> {
    const blockNum = checkIfString(block);
    return /^0x([0-9a-f]{64})/i.test(blockNum)
      ? this.rpc.send('eth_getUncleByBlockHashAndIndex')
      : this.rpc.send('eth_getUncleByBlockNumberAndIndex');
  }

  public uncleCount(block: string | number): Promise<number> {
    const blockNum = checkIfString(block);
    return /^0x([0-9a-f]{64})/i.test(blockNum)
      ? this.rpc.send('eth_getUncleCountByBlockHash')
      : this.rpc.send('eth_getUncleCountByBlockNumber');
  }

  public balanceOf(address: string): Promise<string> {
    const addr = /^0x/.test(address) ? address : '0x' + address;
    return this.rpc.send('eth_getBalance', addr);
  }

  public hashRate(): Promise<string> {
    return this.rpc.send('eth_hashrate');
  }

  public chainId(): Promise<number> {
    // "1": Ethereum Mainnet
    // "2": Morden Testnet (deprecated)
    // "3": Ropsten Testnet
    // "4": Rinkeby Testnet
    // "42": Kovan Testnet
    return this.rpc.send('net_version');
  }

  public client(): Promise<string> {
    return this.rpc.send('web3_clientVersion');
  }

  // BONUS

  // eth_getCode
  public codeAt(address: string, block: string | number): Promise<string> {
    const addr = /^0x/.test(address) ? address : '0x' + address;
    const blockNum = checkIfString(block);
    try {
      return this.rpc.send('eth_getCode', addr, blockNum);
    } catch (err) {
      console.error(err);
    }
  }

  // eth_getStorageAt
  // public storageAt(address: Data, block: Block):Promise<??>;
}

function checkIfString(block: string | number) {
  return typeof block === 'number' ? '0x' + block.toString(16) : block;
}
0x608060405234801561001057600080fd5b50610187806100206000396000f300;
'0x60806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318159cfb14610051578063771602f714610097575b600080fd5b6100956004803603810190808035906020019082018035906020019190919293919293908035906020019082018035906020019190919293919293905050506100e2565b005b3480156100a357600080fd5b506100cc600480360381019080803590602001909291908035906020019092919050505061014e565b6040518082815260200191505060405180910390f35b818160405180838380828437820191505092505050604051809103902084846040518083838082843782019150509250505060405180910390207f74cb234c0dd0ccac09c19041a69978ccb865f1f44a2877a009549898f6395b1060405160405180910390a350505050565b60008183019050929150505600a165627a7a72305820dfbb700f57eda16a1cbc1cccde42304941c07f90e852c59105afc812c988a61e0029';
'0x60806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318159cfb14610051578063771602f714610097575b600080fd5b6100956004803603810190808035906020019082018035906020019190919293919293908035906020019082018035906020019190919293919293905050506100e2565b005b3480156100a357600080fd5b506100cc600480360381019080803590602001909291908035906020019092919050505061014e565b6040518082815260200191505060405180910390f35b818160405180838380828437820191505092505050604051809103902084846040518083838082843782019150509250505060405180910390207f74cb234c0dd0ccac09c19041a69978ccb865f1f44a2877a009549898f6395b1060405160405180910390a350505050565b60008183019050929150505600a165627a7a72305820dfbb700f57eda16a1cbc1cccde42304941c07f90e852c59105afc812c988a61e0029';
