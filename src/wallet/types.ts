export interface SignerWallet {
  signTransaction(): string;
  signMessage(): string;
  getAccounts(): string[];
}

export interface DWallet extends SignerWallet {
  accountRange: number[];
}

export interface Web3Wallet {
  sendTransaction(): string;
  sendMessage(): string;
  getAccounts(): string[];
}

export type Wallet = SignerWallet | Web3Wallet;
