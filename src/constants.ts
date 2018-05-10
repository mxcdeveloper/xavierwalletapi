import { IAssetObject, IXavierBasicConfig, IXavierConfig } from '../interfaces';


export const XAVIER = 'XAVIER';
export const XAVIER_PROPS: IAssetObject = {
    id: XAVIER,
    name: 'Xavier',
    precision: 8,
    description: ''
};

export const MAINNET_BYTE: number = 'W'.charCodeAt(0);
export const TESTNET_BYTE: number = 'T'.charCodeAt(0);

export const INITIAL_NONCE = 0;

export const ADDRESS_VERSION = 1;
export const ALIAS_VERSION = 2;

export const ISSUE_TX = 3;
export const TRANSFER_TX = 4;
export const REISSUE_TX = 5;
export const BURN_TX = 6;
export const EXCHANGE_TX = 7;
export const LEASE_TX = 8;
export const CANCEL_LEASING_TX = 9;
export const CREATE_ALIAS_TX = 10;
export const MASS_TRANSFER_TX = 11;

export const MASS_TRANSFER_TX_VERSION = 1;

export const ISSUE_TX_NAME = 'issue';
export const TRANSFER_TX_NAME = 'transfer';
export const REISSUE_TX_NAME = 'reissue';
export const BURN_TX_NAME = 'burn';
export const EXCHANGE_TX_NAME = 'exchange';
export const LEASE_TX_NAME = 'lease';
export const CANCEL_LEASING_TX_NAME = 'cancelLeasing';
export const CREATE_ALIAS_TX_NAME = 'createAlias';
export const MASS_TRANSFER_TX_NAME = 'massTransfer';

export const PRIVATE_KEY_LENGTH = 32;
export const PUBLIC_KEY_LENGTH = 32;

export const MINIMUM_FEE = 100000;
export const MINIMUM_ISSUE_FEE = 100000000;
export const MINIMUM_MATCHER_FEE = 300000;

export const TRANSFER_ATTACHMENT_BYTE_LIMIT = 140;

export const DEFAULT_MIN_SEED_LENGTH = 25;

export const DEFAULT_ORDER_EXPIRATION_DAYS = 20;

export const DEFAULT_BASIC_CONFIG: IXavierBasicConfig = {
    minimumSeedLength: DEFAULT_MIN_SEED_LENGTH,
    requestOffset: 0,
    requestLimit: 100,
    logLevel: 'warning',
    timeDiff: 0
};

export const DEFAULT_MAINNET_CONFIG: IXavierConfig = {
    ...DEFAULT_BASIC_CONFIG,
    networkByte: MAINNET_BYTE,
    nodeAddress: 'https://nodes.xavierplatform.com',
    matcherAddress: 'https://matcher.xavierplatform.com'
};

export const DEFAULT_TESTNET_CONFIG: IXavierConfig = {
    ...DEFAULT_BASIC_CONFIG,
    networkByte: TESTNET_BYTE,
    nodeAddress: 'https://testnet1.xaviernodes.com',
    matcherAddress: 'https://testnet1.xaviernodes.com/matcher'
};

export const XAVIER_V1_ISSUE_TX = {
    assetId: XAVIER,
    decimals: 8,
    description: '',
    fee: 0,
    height: 0,
    id: XAVIER,
    name: 'Xavier',
    quantity: 100000000 * Math.pow(10, 8),
    reissuable: false,
    sender: XAVIER,
    senderPublicKey: '',
    signature: '',
    timestamp: 1460419200000,
    type: ISSUE_TX
};
