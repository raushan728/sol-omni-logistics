/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sol_omni_protocol.json`.
 */
export type SolOmniProtocol = {
  "address": "tyWeb5FudPxigpWFYeCP9yKwYHBxsqB3jwJa6bjzTJn",
  "metadata": {
    "name": "solOmniProtocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "confirmDelivery",
      "discriminator": [
        11,
        109,
        227,
        53,
        179,
        190,
        88,
        155
      ],
      "accounts": [
        {
          "name": "shipment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  105,
                  112,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "shipment.tracking_id",
                "account": "shipment"
              }
            ]
          }
        },
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createShipment",
      "discriminator": [
        67,
        64,
        17,
        114,
        30,
        143,
        249,
        247
      ],
      "accounts": [
        {
          "name": "shipment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  105,
                  112,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "trackingId"
              }
            ]
          }
        },
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "driverToAssign"
        },
        {
          "name": "receiver"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "trackingId",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositGas",
      "discriminator": [
        164,
        223,
        20,
        23,
        50,
        107,
        168,
        108
      ],
      "accounts": [
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "company"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emergencySwap",
      "discriminator": [
        73,
        226,
        248,
        215,
        5,
        197,
        211,
        229
      ],
      "accounts": [
        {
          "name": "shipment",
          "writable": true
        },
        {
          "name": "company",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "newDriverProfile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  114,
                  105,
                  118,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "newDriverWallet"
              }
            ]
          }
        },
        {
          "name": "newDriverWallet"
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "company"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "initializeCompany",
      "discriminator": [
        75,
        156,
        55,
        94,
        184,
        64,
        58,
        30
      ],
      "accounts": [
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "regId",
          "type": "string"
        }
      ]
    },
    {
      "name": "raiseDispute",
      "discriminator": [
        41,
        243,
        1,
        51,
        150,
        95,
        246,
        73
      ],
      "accounts": [
        {
          "name": "shipment",
          "writable": true
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "reasonHash",
          "type": "string"
        }
      ]
    },
    {
      "name": "registerDriver",
      "discriminator": [
        111,
        15,
        228,
        191,
        92,
        150,
        88,
        27
      ],
      "accounts": [
        {
          "name": "driverProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  114,
                  105,
                  118,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "driverWallet"
              }
            ]
          }
        },
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "driverWallet"
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "company"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "licenseNo",
          "type": "string"
        }
      ]
    },
    {
      "name": "resolveDispute",
      "discriminator": [
        231,
        6,
        202,
        6,
        96,
        103,
        12,
        230
      ],
      "accounts": [
        {
          "name": "shipment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  105,
                  112,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "shipment.tracking_id",
                "account": "shipment"
              }
            ]
          }
        },
        {
          "name": "company",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "company"
          ]
        },
        {
          "name": "refundReceiver",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "winnerTakesAll",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateLocation",
      "discriminator": [
        136,
        21,
        137,
        105,
        147,
        171,
        2,
        210
      ],
      "accounts": [
        {
          "name": "shipment",
          "writable": true
        },
        {
          "name": "driverProfile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  114,
                  105,
                  118,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "driverWallet"
              }
            ]
          }
        },
        {
          "name": "driverWallet",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "lat",
          "type": "f64"
        },
        {
          "name": "lng",
          "type": "f64"
        }
      ]
    },
    {
      "name": "updateSettings",
      "discriminator": [
        81,
        166,
        51,
        213,
        158,
        84,
        157,
        108
      ],
      "accounts": [
        {
          "name": "company",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "company"
          ]
        }
      ],
      "args": [
        {
          "name": "newName",
          "type": {
            "option": "string"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "company",
      "discriminator": [
        32,
        212,
        52,
        137,
        90,
        7,
        206,
        183
      ]
    },
    {
      "name": "driver",
      "discriminator": [
        4,
        85,
        37,
        116,
        50,
        52,
        176,
        177
      ]
    },
    {
      "name": "shipment",
      "discriminator": [
        3,
        65,
        195,
        72,
        154,
        63,
        211,
        213
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "insufficientGasTank",
      "msg": "The company gas tank is empty."
    },
    {
      "code": 6002,
      "name": "driverBusy",
      "msg": "Driver is currently on another delivery."
    },
    {
      "code": 6003,
      "name": "invalidLocation",
      "msg": "Invalid location data provided."
    },
    {
      "code": 6004,
      "name": "alreadyDelivered",
      "msg": "Shipment is already delivered."
    },
    {
      "code": 6005,
      "name": "adminApprovalRequired",
      "msg": "Emergency Swap requires admin approval."
    },
    {
      "code": 6006,
      "name": "driverIsSick",
      "msg": "Driver is marked as sick and cannot take orders."
    }
  ],
  "types": [
    {
      "name": "company",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "registrationId",
            "type": "string"
          },
          {
            "name": "gasTankBalance",
            "type": "u64"
          },
          {
            "name": "totalDrivers",
            "type": "u32"
          },
          {
            "name": "totalShipments",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "driver",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "company",
            "type": "pubkey"
          },
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "licenseNo",
            "type": "string"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "isSick",
            "type": "bool"
          },
          {
            "name": "rating",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "shipment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "company",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "currentDriver",
            "type": "pubkey"
          },
          {
            "name": "receiver",
            "type": "pubkey"
          },
          {
            "name": "trackingId",
            "type": "string"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "shipmentStatus"
              }
            }
          },
          {
            "name": "locationLat",
            "type": "f64"
          },
          {
            "name": "locationLng",
            "type": "f64"
          },
          {
            "name": "lastUpdateTimestamp",
            "type": "i64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "shipmentStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "created"
          },
          {
            "name": "inTransit"
          },
          {
            "name": "handoverProcess"
          },
          {
            "name": "delivered"
          },
          {
            "name": "cancelled"
          },
          {
            "name": "disputed"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "seedCompany",
      "type": "bytes",
      "value": "[99, 111, 109, 112, 97, 110, 121]"
    },
    {
      "name": "seedDriver",
      "type": "bytes",
      "value": "[100, 114, 105, 118, 101, 114]"
    },
    {
      "name": "seedShipment",
      "type": "bytes",
      "value": "[115, 104, 105, 112, 109, 101, 110, 116]"
    }
  ]
};
