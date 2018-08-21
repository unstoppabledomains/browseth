import * as utils from '@browseth/utils'

export { Explorer as default, Explorer }

function parseBlock(value, full = false, param = utils.param) {
  return value == null
    ? null
    : {
        number: param.fromQuantity(value.number),
        hash: param.fromData(value.hash, 32),
        parentHash: param.fromData(value.parentHash, 32),
        nonce: param.fromData(value.nonce, 8),
        sha3Uncles: param.fromData(value.sha3Uncles, 32),
        logsBloom: param.fromData(value.logsBloom, 256),
        transactionsRoot: param.fromData(value.transactionsRoot, 32),
        stateRoot: param.fromData(value.stateRoot, 32),
        receiptsRoot: param.fromData(value.receiptsRoot, 32),
        miner: param.fromData(value.miner, 20),
        difficulty: param.fromQuantity(value.difficulty),
        totalDifficulty: param.fromQuantity(value.totalDifficulty),
        extraData: param.fromData(value.extraData),
        size: param.fromQuantity(value.size),
        gasLimit: param.fromQuantity(value.gasLimit),
        gasUsed: param.fromQuantity(value.gasUsed),
        timestamp: param.fromQuantity(value.timestamp),
        transactions: full
          ? value.transactions.map(v => parseTransactionObject(v, param))
          : value.transactions.map(v => param.fromData(v, 32)),
        uncles: value.uncles.map(v => param.fromData(v, 32)),
      }
}

function parseTransactionReceipt(value, param = utils.param) {
  return value == null
    ? null
    : {
        transactionHash: param.fromData(value.transactionHash, 32),
        transactionIndex: param.fromQuantity(value.transactionIndex),
        blockHash: param.fromData(value.blockHash, 32),
        blockNumber: param.fromQuantity(value.blockNumber),
        from: param.fromData(value.from, 20),
        to: param.fromData(value.to, 20),
        cumulativeGasUsed: param.fromQuantity(value.cumulativeGasUsed),
        gasUsed: param.fromQuantity(value.gasUsed),
        contractAddress: param.fromData(value.contractAddress, 20),
        logs: value.logs.map(v => parseLog(v, param)),
        logsBloom: param.fromData(value.logsBloom, 256),
        success: Number(value.status) > 0,
      }
}

function parseTransactionObject(value, param = utils.param) {
  return value == null
    ? null
    : {
        blockHash: param.fromData(value.blockHash, 32),
        blockNumber: param.fromQuantity(value.blockNumber),
        from: param.fromData(value.from, 20),
        gas: param.fromQuantity(value.gas),
        gasPrice: param.fromQuantity(value.gasPrice),
        hash: param.fromData(value.hash, 32),
        input: param.fromData(value.input),
        nonce: param.fromQuantity(value.nonce),
        to: param.fromData(value.to, 20),
        transactionIndex:
          value.transactionIndex == null
            ? null
            : param.fromQuantity(value.transactionIndex),
        value: param.fromQuantity(value.value),
        v: value.v,
        r: value.r,
        s: value.s,
      }
}

function parseLog(value, param = utils.param) {
  return value == null
    ? null
    : {
        removed: value.removed,
        logIndex:
          value.logIndex == null ? null : param.fromQuantity(value.logIndex),
        transactionIndex:
          value.transactionIndex == null
            ? null
            : param.fromQuantity(value.transactionIndex),
        transactionHash:
          value.transactionHash == null
            ? null
            : param.fromData(value.transactionHash, 32),
        blockHash:
          value.blockHash == null ? null : param.fromData(value.blockHash, 32),
        blockNumber:
          value.blockNumber == null
            ? null
            : param.fromQuantity(value.blockNumber),
        address: param.fromData(value.address, 20),
        data: param.fromData(value.data),
        topics: value.topics.map(v => param.fromData(v)),
      }
}

class Explorer {
  constructor(requestor, param = {}) {
    this.requestor = requestor
    this.param = { ...utils.param, ...param }
  }

  logs = ({ fromBlock, toBlock, address, topics = [] }) =>
    this.requestor('eth_getLogs', {
      fromBlock: this.param.toQuantity(fromBlock),
      toBlock: this.param.toQuantity(toBlock),
      address: Array.isArray(address)
        ? address.map(v => this.param.toData(v, 20))
        : this.param.toData(address, 20),
      topics: topics.map(
        topic =>
          Array.isArray(topic)
            ? topic.map(v => this.param.toData(v))
            : this.param.toData(topic),
      ),
    }).then(logs => logs.map(log => parseLog(log, this.param)))

  block = {
    count: () => this.requestor.request('eth_blockNumber'),
    at: (indexOrHash, full = false) =>
      (this.param.isData(indexOrHash, 32)
        ? this.requestor.request(
            'eth_getBlockByHash',
            this.param.toData(indexOrHash, 32),
            Boolean(full),
          )
        : this.requestor.request(
            'eth_getBlockByNumber',
            this.param.toQuantity(indexOrHash),
            Boolean(full),
          )
      ).then(block => parseBlock(block, full, this.param)),
  }

  transaction = {
    at: (indexOrHash, index) =>
      index == null
        ? this.transaction.atHash(indexOrHash)
        : this.transaction.atBlockAndIndex(indexOrHash, index),
    atHash: hash =>
      this.requestor
        .request('eth_getTransactionByHash', this.param.toData(hash, 32))
        .then(result => parseTransactionObject(result, this.param)),
    atBlockAndIndex: (indexOrHash, index) =>
      (this.param.isData(indexOrHash, 32)
        ? this.requestor.request(
            'eth_getTransactionByBlockHashAndIndex',
            this.param.toData(indexOrHash, 32),
            this.param.toQuantity(index),
          )
        : this.requestor.request(
            'eth_getTransactionByBlockNumberAndIndex',
            this.param.toQuantity(indexOrHash),
            this.param.toQuantity(index),
          )
      ).then(result => parseTransactionObject(result, this.param)),
    receipt: hash =>
      this.requestor
        .request('eth_getTransactionReceipt', this.param.toData(hash, 32))
        .then(result => parseTransactionReceipt(result, this.param)),
    countByBlock: indexOrHash =>
      (this.param.isData(indexOrHash, 32)
        ? this.requestor.request(
            'eth_getBlockTransactionCountByHash',
            this.param.toData(indexOrHash, 32),
          )
        : this.requestor.request(
            'eth_getBlockTransactionCountByNumber',
            this.param.toQuantity(indexOrHash),
          )
      ).then(this.param.fromQuantity),
  }

  uncle = {
    at: (indexOrHash, index) =>
      (this.param.isData(indexOrHash, 32)
        ? this.requestor.request(
            'eth_getUncleByBlockHashAndIndex',
            this.param.toData(indexOrHash, 32),
            this.param.toQuantity(index),
          )
        : this.requestor.request(
            'eth_getUncleByBlockNumberAndIndex',
            this.param.toQuantity(indexOrHash),
            this.param.toQuantity(index),
          )
      ).then(block => parseBlock(block, full, this.param)),
    count: indexOrHash =>
      (this.param.isData(indexOrHash, 32)
        ? this.requestor.request(
            'eth_getUncleCountByBlockHash',
            this.param.toData(indexOrHash, 32),
          )
        : this.requestor.request(
            'eth_getUncleCountByBlockNumber',
            this.param.toQuantity(indexOrHash),
          )
      ).then(this.param.fromQuantity),
  }

  node = {
    syncStatus: () =>
      this.requestor.request('eth_syncing').then(
        result =>
          result && {
            starting: this.param.fromQuantity(result.startingBlock),
            current: this.param.fromQuantity(result.currentBlock),
            highest: this.param.fromQuantity(result.highestBlock),
          },
      ),
    mining: () => this.requestor.request('eth_mining'),
    listening: () => this.requestor.request('net_listening'),
    peerCount: () =>
      this.requestor.request('net_peerCount').then(this.param.fromQuantity),
    hashRate: () =>
      this.requestor.request('eth_hashrate').then(this.param.fromQuantity),
    netVersion: () => this.requestor.request('net_version').then(Number),
    clientVersion: () => this.requestor.request('web3_clientVersion'),
    protocolVersion: () =>
      this.requestor.request('eth_protocolVersion').then(Number),
    sshVersion: () => this.requestor.request('shh_version').then(Number),
  }

  account = address => {
    const serializedAddress = this.param.toData(address, 20)

    return {
      isEmpty: (tag = 'latest') =>
        Promise.all([
          this.requestor.request(
            'eth_getTransactionCount',
            serializedAddress,
            this.param.toTag(tag),
          ),
          this.requestor.request(
            'eth_getBalance',
            serializedAddress,
            this.param.toTag(tag),
          ),
          this.requestor.request(
            'eth_getCode',
            serializedAddress,
            this.param.toTag(tag),
          ),
        ]).then(
          ([txCount, balance, code]) =>
            txCount === '0x0' && balance === '0x0' && code === '0x',
        ),
      nonce: (tag = 'latest') =>
        this.requestor
          .request(
            'eth_getTransactionCount',
            serializedAddress,
            this.param.toTag(tag),
          )
          .then(result => this.param.fromQuantity(result)),
      balance: (tag = 'latest') =>
        this.requestor
          .request('eth_getBalance', serializedAddress, this.param.toTag(tag))
          .then(result => this.param.fromQuantity(result)),
      code: (tag = 'latest') =>
        this.requestor
          .request('eth_getCode', serializedAddress, this.param.toTag(tag))
          .then(result => this.param.fromData(result)),
      storage: (pos, tag = 'latest') =>
        this.requestor
          .request(
            'eth_getStorageAt',
            serializedAddress,
            this.param.toQuantity(pos),
            this.param.toTag(tag),
          )
          .then(result => this.param.fromData(result)),
    }
  }
}
