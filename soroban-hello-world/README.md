# Soroban workspace

Rust workspace that hosts the `hello-world` smart contract and its React frontend.

The project overview, quick start, deployment details and documentation in **English, Español and Português** live in the [repository README](../README.md).

## Layout

```text
soroban-hello-world/
├── Cargo.toml               # workspace root; crates inherit soroban-sdk from here
├── AGENTS.md                # contributor instructions for agents and humans
├── contracts/
│   └── hello-world/
│       ├── src/lib.rs       # contract implementation (#![no_std])
│       └── src/test.rs      # host-side unit tests
└── frontend/                # React 19 + Vite dApp (see frontend/README.md)
```

## Contract

```rust
#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }
}
```

| | |
| --- | --- |
| Crate | `hello-world` |
| SDK | `soroban-sdk` 28 |
| Artifact | `target/wasm32v1-none/release/hello_world.wasm` (633 bytes) |
| Testnet ID | `CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE` |

## Commands

Run these from this directory:

```bash
cargo test                                  # host-side unit tests
cargo clippy --all-targets -- -D warnings   # lint with warnings as errors
stellar contract build                       # compile every cdylib member to WASM
```

`stellar contract build` applies the flags and metadata the network expects — do not replace it with `cargo build --target wasm32v1-none`. The `wasm32v1-none` target requires Rust 1.84 or newer:

```bash
rustup target add wasm32v1-none
```

## Deploy and invoke (testnet)

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source-account <identity> \
  --network testnet \
  --alias hello

stellar contract invoke \
  --id hello \
  --network testnet \
  --source-account <identity> \
  -- hello --to world
```

`stellar contract invoke --id <id> -- -h` prints the generated CLI for a deployed contract.

## Further reading

- https://developers.stellar.org/docs/build/smart-contracts/overview
- https://github.com/stellar/soroban-examples
