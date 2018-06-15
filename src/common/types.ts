export interface ToStringable {
  toString(): string;
}

export type MaybePromise<T> = T | Promise<T>;
export type Fallback<T> = T | (() => MaybePromise<T>);

export function evalFallback<T>(
  v: T | undefined,
  fallback: Fallback<T>,
): Promise<T> {
  return v
    ? Promise.resolve(v)
    : Promise.resolve().then(
        () =>
          typeof fallback === 'function'
            ? fallback()
            : Promise.resolve(fallback),
      );
}

export type Data = string | ArrayBuffer | ArrayBufferView | ToStringable;
export type Quantity = number | string | ToStringable;
export type Block = Quantity;
export type Tag = Quantity; // | 'pending' | 'latest' | 'earliest';
export type ChainId = Quantity;
export type Unit =
  | 'wei'
  | 'kwei'
  | 'ada'
  | 'femtoether'
  | 'mwei'
  | 'babbage'
  | 'picoether'
  | 'gwei'
  | 'shannon'
  | 'nanoether'
  | 'nano'
  | 'szabo'
  | 'microether'
  | 'micro'
  | 'finney'
  | 'milliether'
  | 'milli'
  | 'ether'
  | 'kether'
  | 'grand'
  | 'einstein'
  | 'mether'
  | 'gether'
  | 'tether';

export interface Transaction {
  to?: Data;
  value?: Quantity;
  data?: Data;
  UNSAFE_gas?: Quantity;
  UNSAFE_gasPrice?: Quantity;
  UNSAFE_nonce?: Quantity;
  UNSAFE_chainId?: ChainId;
}

export interface RawRequest {
  url: string;
  body: string;
  headers: Array<[string, string | string[]]>;
  timeout: number;
  [key: string]: any;
}

export namespace Eth {
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
    logs: Log[]; // Array - Array of log objects, which this transaction generated.
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

  export interface BlockObject<Full extends boolean = true> {
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
    transactions: Full extends true ? TransactionObject[] : string[]; // Array - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
    uncles: string[]; // Array - Array of uncle hashes.
  }

  export interface SyncStatus {
    startingBlock: number; // QUANTITY - The block at which the import started (will only be reset, after the sync reached his head)
    currentBlock: number; // QUANTITY - The current block, same as eth_blockNumber
    highestBlock: number; // QUANTITY - The estimated highest block
  }
}
