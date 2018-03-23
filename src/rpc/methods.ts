import {ApiAbstract} from './types';

export type IData = string;
export type IQuantity = string | number;
export type ITag = 'earliest' | 'latest' | 'pending' | IQuantity;

export interface ISendTransaction {
  from: IData;
  gasPrice: IQuantity;
  chainId?: string;
  to?: IData;
  data?: IData;
  gas?: IQuantity;
  nonce?: IQuantity;
  value?: IQuantity;
}

export interface IEstimateTransaction {
  chainId?: string;
  from?: IData;
  data?: IData;
  gas?: IQuantity;
  gasPrice?: IQuantity;
  nonce?: IQuantity;
  to?: IData;
  value?: IQuantity;
}

export interface ICallTransaction {
  to: IData;
  chainId?: string;
  from?: IData;
  data?: IData;
  gas?: IQuantity;
  gasPrice?: IQuantity;
  nonce?: IQuantity;
  value?: IQuantity;
}

export type OData = string;
export type OQuantity = string;
export interface OBlockObject {
  number?: OQuantity;
  hash?: OData;
  parentHash: OData;
  nonce?: OData;
  sha3Uncles: OData;
  logsBloom?: OData;
  transactionsRoot: OData;
  stateRoot: OData;
  receiptsRoot: OData;
  miner: OData;
  difficulty: OQuantity;
  totalDifficulty: OQuantity;
  extraData: OData;
  size: OQuantity;
  gasLimit: OQuantity;
  gasUsed: OQuantity;
  timestamp: OQuantity;
  transactions: Array<OData | OTransactionObject>;
  uncles: OData[];
}

export interface OTransactionObject {
  hash: OData;
  nonce: OQuantity;
  blockHash: OData;
  blockNumber: OQuantity;
  transactionIndex: OQuantity;
  from: OData;
  to?: OData;
  value: OQuantity;
  gasPrice: OQuantity;
  gas: OQuantity;
  input: OData;
}

export interface OLog {
  removed: boolean;
  logIndex: OQuantity;
  transactionIndex: OQuantity;
  transactionHash: OData;
  blockHash: OData;
  blockNumber: OQuantity;
  address: OData;
  data: OData;
  topics: Array<OData | [OData, OData]>;
}

export interface OTransactionReceipt {
  transactionHash: OData;
  transactionIndex: OQuantity;
  blockHash: OData;
  blockNumber: OQuantity;
  cumulativeGasUsed: OQuantity;
  gasUsed: OQuantity;
  contractAddress: OQuantity;
  logs: ReadonlyArray<OLog>;
  logsBloom: OData;
  root: OData;
  status: OData;
}

export interface All extends ApiAbstract {
  // web3_* methods
  web3_clientVersion: {
    params: never[];
    result: string;
  };
  web3_sha3: {
    params: [IData];
    result: string;
  };

  // net_* methods
  net_version: {
    params: never[];
    result: string;
  };
  net_peerCount: {
    params: never[];
    result: OQuantity;
  };
  net_listening: {
    params: never[];
    result: boolean;
  };

  // eth_* account methods
  eth_coinbase: {
    params: never[];
    result: string;
  };
  eth_accounts: {
    params: never[];
    result: string[];
  };
  eth_getBalance: {
    params: [IData, ITag];
    result: OQuantity;
  };
  eth_getTransactionCount: {
    params: [IData, ITag];
    result: OQuantity;
  };
  eth_sign: {
    params: [IData, IData];
    result: OData;
  };

  // eth_* transaction methods
  eth_gasPrice: {
    params: never[];
    result: OQuantity;
  };
  eth_estimateGas: {
    params: [IEstimateTransaction, ITag];
    result: OQuantity;
  };
  eth_call: {
    params: [ICallTransaction, ITag];
    result: OData;
  };
  eth_sendTransaction: {
    params: [ISendTransaction];
    result: OData;
  };
  eth_sendRawTransaction: {
    params: [IData];
    result: OData;
  };
  eth_getOTransactionReceipt: {
    params: [IData];
    result: null | OTransactionReceipt;
  };
  eth_getTransactionByHash: {
    params: [IData];
    result: null | OTransactionObject;
  };
  eth_getTransactionByBlockHashAndIndex: {
    params: [IData, IQuantity];
    result: null | OTransactionObject;
  };
  eth_getTransactionByBlockNumberAndIndex: {
    params: [IQuantity, IQuantity];
    result: null | OTransactionObject;
  };

  // eth_* block methods
  eth_blockNumber: {
    params: never[];
    result: OQuantity;
  };
  eth_getStorageAt: {
    params: [IData, IQuantity, ITag];
    result: OData;
  };
  eth_getBlockTransactionCountByHash: {
    params: [IData];
    result: OQuantity;
  };
  eth_getBlockTransactionCountByNumber: {
    params: [IQuantity];
    result: OQuantity;
  };
  eth_getUncleCountByBlockHash: {
    params: [IData];
    result: OQuantity;
  };
  eth_getUncleCountByBlockNumber: {
    params: [IQuantity];
    result: OQuantity;
  };
  eth_getCode: {
    params: [IData, ITag];
    result: OData;
  };
  eth_getBlockByHash: {
    params: [IData];
    result: null | OBlockObject;
  };
  eth_getBlockByNumber: {
    params: [IQuantity];
    result: null | OBlockObject;
  };
  eth_getUncleByBlockHashAndIndex: {
    params: [IData, IQuantity];
    result: null | OBlockObject;
  };
  eth_getUncleByBlockNumberAndIndex: {
    params: [IQuantity, IQuantity];
    result: null | OBlockObject;
  };
  eth_protocolVersion: {
    params: any[];
    result: any;
  };
  eth_syncing: {
    params: any[];
    result: any;
  };
  eth_mining: {
    params: any[];
    result: any;
  };
  eth_hashrate: {
    params: any[];
    result: any;
  };
  eth_getTransactionReceipt: {
    params: any[];
    result: any;
  };
  eth_getCompilers: {
    params: any[];
    result: any;
  };
  eth_compileLLL: {
    params: any[];
    result: any;
  };
  eth_compileSolidity: {
    params: any[];
    result: any;
  };
  eth_compileSerpent: {
    params: any[];
    result: any;
  };
  eth_newFilter: {
    params: any[];
    result: any;
  };
  eth_newBlockFilter: {
    params: any[];
    result: any;
  };
  eth_newPendingTransactionFilter: {
    params: any[];
    result: any;
  };
  eth_uninstallFilter: {
    params: any[];
    result: any;
  };
  eth_getFilterChanges: {
    params: any[];
    result: any;
  };
  eth_getFilterLogs: {
    params: any[];
    result: any;
  };
  eth_getLogs: {
    params: [
      {
        fromBlock: ITag;
        toBlock: ITag;
        address: IData | IData[];
        topics: Array<IData | [IData, IData]>;
      }
    ];
    result: Array<OData | OLog>;
  };
  eth_getWork: {
    params: any[];
    result: any;
  };
  eth_submitWork: {
    params: any[];
    result: any;
  };
  eth_submitHashrate: {
    params: any[];
    result: any;
  };
  db_putString: {
    params: any[];
    result: any;
  };
  db_getString: {
    params: any[];
    result: any;
  };
  db_putHex: {
    params: any[];
    result: any;
  };
  db_getHex: {
    params: any[];
    result: any;
  };
  shh_post: {
    params: any[];
    result: any;
  };
  shh_version: {
    params: any[];
    result: any;
  };
  shh_newIdentity: {
    params: any[];
    result: any;
  };
  shh_hasIdentity: {
    params: any[];
    result: any;
  };
  shh_newGroup: {
    params: any[];
    result: any;
  };
  shh_addToGroup: {
    params: any[];
    result: any;
  };
  shh_newFilter: {
    params: any[];
    result: any;
  };
  shh_uninstallFilter: {
    params: any[];
    result: any;
  };
  shh_getFilterChanges: {
    params: any[];
    result: any;
  };
  shh_getMessages: {
    params: any[];
    result: any;
  };
}

export type ApiMap<Keys extends keyof All> = {[K in Keys]: All[K]};

export type Base = ApiMap<
  | 'web3_clientVersion'
  | 'web3_sha3'
  | 'net_version'
  | 'net_peerCount'
  | 'net_listening'
  | 'eth_protocolVersion'
  | 'eth_syncing'
  | 'eth_coinbase'
  | 'eth_mining'
  | 'eth_hashrate'
  | 'eth_gasPrice'
  | 'eth_accounts'
  | 'eth_blockNumber'
  | 'eth_getBalance'
  | 'eth_getStorageAt'
  | 'eth_getTransactionCount'
  | 'eth_getBlockTransactionCountByHash'
  | 'eth_getBlockTransactionCountByNumber'
  | 'eth_getUncleCountByBlockHash'
  | 'eth_getUncleCountByBlockNumber'
  | 'eth_getCode'
  | 'eth_sign'
  | 'eth_sendTransaction'
  | 'eth_sendRawTransaction'
  | 'eth_call'
  | 'eth_estimateGas'
  | 'eth_getBlockByHash'
  | 'eth_getBlockByNumber'
  | 'eth_getTransactionByHash'
  | 'eth_getTransactionByBlockHashAndIndex'
  | 'eth_getTransactionByBlockNumberAndIndex'
  | 'eth_getTransactionReceipt'
  | 'eth_getUncleByBlockHashAndIndex'
  | 'eth_getUncleByBlockNumberAndIndex'
  | 'eth_getCompilers'
  | 'eth_compileLLL'
  | 'eth_compileSolidity'
  | 'eth_compileSerpent'
  | 'eth_newFilter'
  | 'eth_newBlockFilter'
  | 'eth_newPendingTransactionFilter'
  | 'eth_uninstallFilter'
  | 'eth_getFilterChanges'
  | 'eth_getFilterLogs'
  | 'eth_getLogs'
  | 'eth_getWork'
  | 'eth_submitWork'
  | 'eth_submitHashrate'
  | 'db_putString'
  | 'db_getString'
  | 'db_putHex'
  | 'db_getHex'
  | 'shh_post'
  | 'shh_version'
  | 'shh_newIdentity'
  | 'shh_hasIdentity'
  | 'shh_newGroup'
  | 'shh_addToGroup'
  | 'shh_newFilter'
  | 'shh_uninstallFilter'
  | 'shh_getFilterChanges'
  | 'shh_getMessages'
>;

export type MetaMaskProviderEngine = ApiMap<
  | 'web3_clientVersion'
  | 'net_version'
  | 'net_listening'
  | 'net_peerCount'
  | 'eth_protocolVersion'
  | 'eth_hashrate'
  | 'eth_mining'
  | 'eth_syncing'
  | 'eth_newBlockFilter'
  | 'eth_newPendingTransactionFilter'
  | 'eth_newFilter'
  | 'eth_uninstallFilter'
  | 'eth_getFilterLogs'
  | 'eth_getFilterChanges'
  | 'eth_coinbase'
  | 'eth_accounts'
  | 'eth_sendTransaction'
  | 'eth_sign'
  // 'eth_signTypedData'| // NOTE(bp): This is a weird metamask provider option
  | 'eth_call'
  | 'eth_estimateGas'
>;

export type MyEtherApi = ApiMap<
  | 'web3_clientVersion'
  | 'web3_sha3'
  | 'net_version'
  | 'net_peerCount'
  | 'eth_protocolVersion'
  | 'eth_syncing'
  | 'eth_gasPrice'
  | 'eth_blockNumber'
  | 'eth_getBalance'
  | 'eth_getStorageAt'
  | 'eth_getTransactionCount'
  | 'eth_getBlockTransactionCountByHash'
  | 'eth_getBlockTransactionCountByNumber'
  | 'eth_getUncleCountByBlockHash'
  | 'eth_getUncleCountByBlockNumber'
  | 'eth_getCode'
  | 'eth_sendRawTransaction'
  | 'eth_call'
  | 'eth_estimateGas'
  | 'eth_getBlockByHash'
  | 'eth_getBlockByNumber'
  | 'eth_getTransactionByHash'
  | 'eth_getTransactionByBlockHashAndIndex'
  | 'eth_getTransactionByBlockNumberAndIndex'
  | 'eth_getTransactionReceipt'
  | 'eth_getUncleByBlockHashAndIndex'
  | 'eth_getUncleByBlockNumberAndIndex'
  | 'eth_getCompilers'
  | 'eth_compileSolidity'
  | 'eth_newFilter'
  | 'eth_newBlockFilter'
  | 'eth_newPendingTransactionFilter'
  | 'eth_uninstallFilter'
  | 'eth_getFilterChanges'
  | 'eth_getFilterLogs'
  | 'eth_getLogs'
  // | 'trace_call'
  // | 'trace_rawTransaction'
  // | 'trace_replayTransaction'
  // | 'trace_filter'
  // | 'trace_get'
  // | 'trace_transaction'
  // | 'trace_block'
>;

export type Infura = ApiMap<
  | 'web3_clientVersion'
  | 'web3_sha3'
  | 'net_version'
  | 'net_listening'
  | 'net_peerCount'
  | 'eth_protocolVersion'
  | 'eth_syncing'
  | 'eth_mining'
  | 'eth_hashrate'
  | 'eth_gasPrice'
  | 'eth_accounts'
  | 'eth_blockNumber'
  | 'eth_getBalance'
  | 'eth_getStorageAt'
  | 'eth_getTransactionCount'
  | 'eth_getBlockTransactionCountByHash'
  | 'eth_getBlockTransactionCountByNumber'
  | 'eth_getUncleCountByBlockHash'
  | 'eth_getUncleCountByBlockNumber'
  | 'eth_getCode'
  | 'eth_sendRawTransaction'
  | 'eth_call'
  | 'eth_estimateGas'
  | 'eth_getBlockByHash'
  | 'eth_getBlockByNumber'
  | 'eth_getTransactionByHash'
  | 'eth_getTransactionByBlockHashAndIndex'
  | 'eth_getTransactionByBlockNumberAndIndex'
  | 'eth_getTransactionReceipt'
  | 'eth_getUncleByBlockHashAndIndex'
  | 'eth_getUncleByBlockNumberAndIndex'
  | 'eth_getCompilers'
  | 'eth_compileSolidity'
  | 'eth_compileLLL'
  | 'eth_compileSerpent'
  | 'eth_getLogs'
  | 'eth_getWork'
  | 'eth_submitWork'
  | 'eth_submitHashrate'
  | 'shh_version'
  | 'shh_post'
  | 'shh_newIdentity'
  | 'shh_hasIdentity'
  | 'shh_newGroup'
  | 'shh_addToGroup'
  | 'shh_newFilter'
  | 'shh_uninstallFilter'
  | 'shh_getFilterChanges'
  | 'shh_getMessages'
>;
