export type SolanaLock = {
  "version": "0.1.0",
  "name": "solana_lock",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "lock",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "balance",
            "type": "i32"
          },
          {
            "name": "amount",
            "type": "i16"
          }
        ]
      }
    }
  ]
};

export const IDL: SolanaLock = {
  "version": "0.1.0",
  "name": "solana_lock",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "lock",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "balance",
            "type": "i32"
          },
          {
            "name": "amount",
            "type": "i16"
          }
        ]
      }
    }
  ]
};
