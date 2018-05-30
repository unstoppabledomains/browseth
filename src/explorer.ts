import {BN} from 'bn.js';
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

export interface SyncStatus {
  startingBlock: number; // QUANTITY - The block at which the import started (will only be reset, after the sync reached his head)
  currentBlock: number; // QUANTITY - The current block, same as eth_blockNumber
  highestBlock: number; // QUANTITY - The estimated highest block
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

    countByBlock: (block: number | string): Promise<number | null> => {
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

  public uncle(
    block: string | number,
    index: string | number,
  ): Promise<BlockObject> {
    const blockNum = checkIfString(block);
    const idx = checkIfString(index);
    return /^0x([0-9a-f]{64})/i.test(blockNum)
      ? this.rpc.send('eth_getUncleByBlockHashAndIndex', blockNum, idx)
      : this.rpc.send('eth_getUncleByBlockNumberAndIndex', blockNum, idx);
  }

  public uncleCount(block: string | number): Promise<number | null> {
    const blockNum = checkIfString(block);
    return /^0x([0-9a-f]{64})/i.test(blockNum)
      ? this.rpc.send('eth_getUncleCountByBlockHash', blockNum)
      : this.rpc.send('eth_getUncleCountByBlockNumber', blockNum);
  }

  public balanceOf(
    address: string,
    block: string | number,
  ): Promise<string | null> {
    const blockNum = checkIfString(block);
    const addr = /^0x/.test(address) ? address : '0x' + address;
    return this.rpc.send('eth_getBalance', addr, blockNum);
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

  public codeAt(address: string, block: string | number): Promise<string> {
    const addr = /^0x/.test(address) ? address : '0x' + address;
    const blockNum = checkIfString(block);
    return this.rpc.send('eth_getCode', addr, blockNum);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  public protocolVersion(): Promise<string> {
    return this.rpc.send('eth_protocolVersion');
  }

  public sshVersion(): Promise<string> {
    return this.rpc.send('shh_version');
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  public clientIsListening(): Promise<boolean> {
    return this.rpc.send('net_listening');
  }

  public peersConnected(): Promise<number> {
    return this.rpc.send('net_peerCount');
  }

  public isSyncing(): Promise<SyncStatus | boolean> {
    return this.rpc.send('eth_syncing');
  }

  public isMining(): Promise<boolean> {
    return this.rpc.send('eth_mining');
  }

  // Returns the hash of the current block, the seedHash, and the boundary condition to be met ("target").
  public getWork(): Promise<[string, string, string]> {
    return this.rpc.send('eth_getWork');
  }

  //////////////////////////////////////////////////////////////////////////

  public coinbase(): Promise<string> {
    return this.rpc.send('eth_coinbase');
  }

  public accounts(): Promise<string[]> {
    return this.rpc.send('eth_accounts');
  }

  public gasPrice(): Promise<number> {
    return this.rpc.send('eth_gasPrice');
  }

  public transactionCount(
    address: string,
    block: string | number,
  ): Promise<number> {
    const addr = checkIfString(address);
    const blockNum = checkIfString(block);
    return this.rpc.send('eth_getTransactionCount', addr, blockNum);
  }

  public blockTransactionCount(block: string | number): Promise<number> {
    const blockNum = checkIfString(block);
    return /^0x([0-9a-f]{64})/i.test(blockNum)
      ? this.rpc.send('eth_getBlockTransactionCountByHash', blockNum)
      : this.rpc.send('eth_getBlockTransactionCountByNumber', blockNum);
  }

  public storageAt(
    address: string,
    index: string | number,
    block: string | number,
  ): Promise<string> {
    const idx = checkIfString(index);
    const blockNum = checkIfString(block);
    return this.rpc.send('eth_getStorageAt', address, idx, blockNum);
  }
}

function checkIfString(val: string | number) {
  if (typeof val === 'string') {
    if (/[g-z]/i.test(val)) {
      // if 'latest' 'earliest' 'pending'
      return val;
    }
    return /^0x/i.test(val) ? val : '0x' + new BN(val).toString(16);
  }
  return '0x' + val.toString(16);
}
