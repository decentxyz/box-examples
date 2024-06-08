export const optimismSepolia = {
  id: 11155420,
  name: 'Optimism Sepolia',
  network: 'optimism-sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sepolia.optimism.io'],
    },
    public: {
      http: ['https://sepolia.optimism.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://optimism-sepolia.blockscout.com',
      apiUrl: 'https://optimism-sepolia.blockscout.com/api',
    },
  },
  testnet: true,
};

export const arbitrumSepolia = {
  id: 421_614,
  name: 'Arbitrum Sepolia',
  network: 'arbitrum-sepolia',
  nativeCurrency: {
    name: 'Arbitrum Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://sepolia.arbiscan.io',
      apiUrl: 'https://sepolia.arbiscan.io/api',
    },
  },
  testnet: true,
};

export const rarible = {
  id: 1380012617,
  name: 'Rarible',
  network: 'rarible',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.rpc.rarichain.org/http'],
    },
    public: {
      http: ['https://mainnet.rpc.rarichain.org/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://mainnet.explorer.rarichain.org/',
      apiUrl: 'https://mainnet.explorer.rarichain.org/api',
    },
  },
  testnet: false,
};

export const raribleTestnet = {
  id: 1918988905,
  name: 'Rarible Testnet',
  network: 'rarible-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.rarichain.org/http'],
    },
    public: {
      http: ['https://testnet.rpc.rarichain.org/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://explorer.rarichain.org/',
      apiUrl: 'https://explorer.rarichain.org/api',
    },
  },
  testnet: true,
};

export const degen = {
  id: 666666666,
  name: 'degen',
  network: 'degen',
  nativeCurrency: { name: 'Degen', symbol: 'DEGEN', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.degen.tips/http'],
    },
    public: {
      http: ['https://rpc.degen.tips/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Degen Chain Explorer',
      url: 'https://explorer.degen.tips',
      apiUrl: 'https://explorer.degen.tips/api/v2',
    },
  },
  testnet: false,
};

export const xai = {
  id: 660279,
  name: 'xai',
  network: 'xai',
  nativeCurrency: { name: 'Xai', symbol: 'Xai', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://xai-chain.net/rpc/http'],
    },
    public: {
      http: ['https://xai-chain.net/rpc/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Degen Chain Explorer',
      url: 'https://explorer.xai-chain.net',
      apiUrl: 'https://explorer.xai-chain.net/api/v2',
    },
  },
  testnet: false,
};

export const cheese = {
  id: 383353,
  name: 'cheese',
  network: 'cheese',
  nativeCurrency: { name: 'Cheese', symbol: 'CHEESE', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://cheesechain.calderachain.xyz/http'],
    },
    public: {
      http: ['https://cheesechain.calderachain.xyz/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Cheese Chain Explorer',
      url: 'https://cheesechain.calderaexplorer.xyz',
      apiUrl: 'https://cheesechain.calderaexplorer.xyz',
    },
  },
  testnet: false,
};
