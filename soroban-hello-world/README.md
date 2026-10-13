<div align="center">

# Soroban Workspace

**Rust workspace that hosts the `hello-world` smart contract and its React dApp.**

[![Soroban](https://img.shields.io/badge/Soroban-SDK%2028-1B1B1B?logo=stellar&logoColor=white)](https://developers.stellar.org/docs/build/smart-contracts/overview)
[![Rust](https://img.shields.io/badge/Rust-1.84%2B-orange?logo=rust&logoColor=white)](https://www.rust-lang.org/tools/install)
[![CI](https://github.com/alucart2005/HelloWorldWeb3/actions/workflows/ci.yml/badge.svg)](https://github.com/alucart2005/HelloWorldWeb3/actions/workflows/ci.yml)

**[English](#en)** · **[Español](#es)** · **[Português](#pt)**

[Repository README](../README.md) · [Frontend README](frontend/README.md) · [Contributor guide](AGENTS.md)

</div>

---

<a id="en"></a>

## 🇬🇧 English

### Overview

This directory is the Rust side of the HelloWorld project: a Cargo workspace that compiles a minimal Soroban contract to WASM, its host-side test suite, and the React single-page dApp that calls it on **Soroban Testnet**.

Project overview, quick start, CI and security details — in English, Español and Português — live in the [repository README](../README.md).

### Layout

```text
soroban-hello-world/
├── Cargo.toml               # workspace root; crates inherit soroban-sdk 28 from here
├── Cargo.lock               # locked dependency graph (committed)
├── AGENTS.md                # contributor instructions for agents and humans
├── README.md                # this file (EN · ES · PT)
├── contracts/
│   └── hello-world/
│       ├── Cargo.toml       # crate: lib + cdylib, publish = false
│       ├── Makefile         # build / test / fmt / clean shortcuts
│       ├── src/
│       │   ├── lib.rs       # contract implementation (#![no_std])
│       │   └── test.rs      # host-side unit tests
│       └── test_snapshots/  # recorded test invocation snapshots
└── frontend/                # React 19 + Vite dApp (see frontend/README.md)
```

### Contract

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
| Crate | `hello-world` (v0.0.0, edition 2021, `publish = false`) |
| SDK | `soroban-sdk` 28, declared once at the workspace root |
| Entrypoint | `hello(to: String) -> Vec<String>` — returns `["Hello", to]` |
| State | none: a pure function with no storage writes |
| Artifact | `target/wasm32v1-none/release/hello_world.wasm` (633 bytes) |
| Testnet ID | `CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE` |

### Release profile

`Cargo.toml` ships a size-oriented release profile, so the deployed module stays tiny:

| Setting | Value |
| --- | --- |
| `opt-level` | `"z"` (optimise for size) |
| `lto` / `codegen-units` | `true` / `1` (maximum link-time optimisation) |
| `panic` | `"abort"` (no unwinding machinery) |
| `strip` | `"symbols"` (debug symbols removed) |
| `overflow-checks` | `true` (arithmetic panics instead of wrapping) |

The `release-with-logs` profile inherits `release` and re-enables debug assertions for on-chain debugging.

### Commands

Run from this directory (the workspace root):

| Command | What it does |
| --- | --- |
| `cargo test` | run the host-side unit tests |
| `cargo clippy --all-targets -- -D warnings` | lint with warnings treated as errors |
| `cargo fmt --all` / `make fmt` | format every crate |
| `stellar contract build` | compile every `cdylib` member to WASM |
| `stellar contract build --package hello-world` | compile a single crate |
| `make test` | build, then run the tests |
| `make clean` | remove `target/` |

`stellar contract build` applies the flags and metadata the network expects — do not replace it with `cargo build --target wasm32v1-none`. The `wasm32v1-none` target requires Rust 1.84 or newer:

```bash
rustup target add wasm32v1-none
```

### Tests

Tests run on the host with the `testutils` feature — no network involved:

```rust
let words = client.hello(&String::from_str(&env, "Dev"));
assert_eq!(words, vec![&env, String::from_str(&env, "Hello"), String::from_str(&env, "Dev")]);
```

```bash
cargo test    # or: make test
```

Recorded invocation snapshots live in `contracts/hello-world/test_snapshots/`.

### Deploy and invoke (Testnet)

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

Expected output:

```json
[
    "Hello",
    "world"
]
```

`stellar contract invoke --id <id> -- -h` prints the generated CLI for a deployed contract.

**Deployed instance (Testnet)**

| Field | Value |
| --- | --- |
| Contract ID | `CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE` |
| Wasm SHA-256 | `97f127cc24d2ba1d966176192f68e0a97a6cbac592fb443884c6062b7f12bbd0` |
| RPC endpoint | `https://soroban-testnet.stellar.org` |
| Network passphrase | `Test SDF Network ; September 2015` |

### Frontend

`frontend/` holds the React 19 + Vite dApp that simulates, signs and submits the call through Freighter, xBull or Lobstr. See the [frontend README](frontend/README.md).

### Further reading

- https://developers.stellar.org/docs/build/smart-contracts/overview
- https://developers.stellar.org/docs/tools/cli/install-cli
- https://github.com/stellar/soroban-examples

---

<a id="es"></a>

## 🇪🇸 Español

### Descripción

Este directorio es el lado Rust del proyecto HelloWorld: un workspace de Cargo que compila un contrato Soroban mínimo a WASM, su suite de pruebas en host, y la dApp de página única en React que lo invoca en la **Testnet de Soroban**.

La descripción del proyecto, el inicio rápido y los detalles de CI y seguridad — en English, Español y Português — están en el [README del repositorio](../README.md).

### Estructura

```text
soroban-hello-world/
├── Cargo.toml               # raíz del workspace; las crates heredan soroban-sdk 28 de aquí
├── Cargo.lock               # grafo de dependencias bloqueado (versionado)
├── AGENTS.md                # instrucciones para colaboradores (agentes y humanos)
├── README.md                # este archivo (EN · ES · PT)
├── contracts/
│   └── hello-world/
│       ├── Cargo.toml       # crate: lib + cdylib, publish = false
│       ├── Makefile         # accesos directos: build / test / fmt / clean
│       ├── src/
│       │   ├── lib.rs       # implementación del contrato (#![no_std])
│       │   └── test.rs      # pruebas unitarias en host
│       └── test_snapshots/  # instantáneas de las invocaciones registradas
└── frontend/                # dApp React 19 + Vite (ver frontend/README.md)
```

### Contrato

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
| Crate | `hello-world` (v0.0.0, edition 2021, `publish = false`) |
| SDK | `soroban-sdk` 28, declarado una sola vez en la raíz del workspace |
| Punto de entrada | `hello(to: String) -> Vec<String>` — devuelve `["Hello", to]` |
| Estado | ninguno: una función pura sin escrituras de almacenamiento |
| Artefacto | `target/wasm32v1-none/release/hello_world.wasm` (633 bytes) |
| ID en testnet | `CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE` |

### Perfil de compilación

`Cargo.toml` incluye un perfil de release orientado al tamaño, para que el módulo desplegado sea mínimo:

| Ajuste | Valor |
| --- | --- |
| `opt-level` | `"z"` (optimizar para tamaño) |
| `lto` / `codegen-units` | `true` / `1` (máxima optimización en enlace) |
| `panic` | `"abort"` (sin maquinaria de desenrollado) |
| `strip` | `"symbols"` (símbolos de depuración eliminados) |
| `overflow-checks` | `true` (los desbordes provocan pánico en vez de envolverse) |

El perfil `release-with-logs` hereda de `release` y reactiva las aserciones de depuración para depurar en cadena.

### Comandos

Ejecutar desde este directorio (la raíz del workspace):

| Comando | Qué hace |
| --- | --- |
| `cargo test` | ejecuta las pruebas unitarias en host |
| `cargo clippy --all-targets -- -D warnings` | lint con los avisos tratados como errores |
| `cargo fmt --all` / `make fmt` | formatea todas las crates |
| `stellar contract build` | compila cada miembro `cdylib` a WASM |
| `stellar contract build --package hello-world` | compila una sola crate |
| `make test` | compila y después ejecuta las pruebas |
| `make clean` | elimina `target/` |

`stellar contract build` aplica los flags y los metadatos que espera la red — no lo sustituyas por `cargo build --target wasm32v1-none`. El target `wasm32v1-none` requiere Rust 1.84 o superior:

```bash
rustup target add wasm32v1-none
```

### Pruebas

Las pruebas se ejecutan en host con la feature `testutils` — sin red de por medio:

```rust
let words = client.hello(&String::from_str(&env, "Dev"));
assert_eq!(words, vec![&env, String::from_str(&env, "Hello"), String::from_str(&env, "Dev")]);
```

```bash
cargo test    # o: make test
```

Las instantáneas de las invocaciones registradas están en `contracts/hello-world/test_snapshots/`.

### Despliegue e invocación (Testnet)

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source-account <identidad> \
  --network testnet \
  --alias hello

stellar contract invoke \
  --id hello \
  --network testnet \
  --source-account <identidad> \
  -- hello --to world
```

Salida esperada:

```json
[
    "Hello",
    "world"
]
```

`stellar contract invoke --id <id> -- -h` imprime el CLI generado para un contrato desplegado.

**Instancia desplegada (Testnet)**

| Campo | Valor |
| --- | --- |
| ID del contrato | `CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE` |
| SHA-256 del WASM | `97f127cc24d2ba1d966176192f68e0a97a6cbac592fb443884c6062b7f12bbd0` |
| Endpoint RPC | `https://soroban-testnet.stellar.org` |
| Frase de red | `Test SDF Network ; September 2015` |

### Frontend

`frontend/` contiene la dApp React 19 + Vite que simula, firma y envía la llamada mediante Freighter, xBull o Lobstr. Consulta el [README del frontend](frontend/README.md).

### Lecturas recomendadas

- https://developers.stellar.org/docs/build/smart-contracts/overview
- https://developers.stellar.org/docs/tools/cli/install-cli
- https://github.com/stellar/soroban-examples

---

<a id="pt"></a>

## 🇧🇷 Português

### Visão geral

Este diretório é o lado Rust do projeto HelloWorld: um workspace do Cargo que compila um contrato Soroban mínimo para WASM, sua suíte de testes no host, e a dApp de página única em React que o invoca na **Testnet do Soroban**.

Visão geral do projeto, início rápido e detalhes de CI e segurança — em English, Español e Português — estão no [README do repositório](../README.md).

### Estrutura

```text
soroban-hello-world/
├── Cargo.toml               # raiz do workspace; as crates herdam soroban-sdk 28 daqui
├── Cargo.lock               # grafo de dependências travado (versionado)
├── AGENTS.md                # instruções para colaboradores (agentes e humanos)
├── README.md                # este arquivo (EN · ES · PT)
├── contracts/
│   └── hello-world/
│       ├── Cargo.toml       # crate: lib + cdylib, publish = false
│       ├── Makefile         # atalhos: build / test / fmt / clean
│       ├── src/
│       │   ├── lib.rs       # implementação do contrato (#![no_std])
│       │   └── test.rs      # testes unitários no host
│       └── test_snapshots/  # instantâneas das invocações registradas
└── frontend/                # dApp React 19 + Vite (ver frontend/README.md)
```

### Contrato

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
| Crate | `hello-world` (v0.0.0, edition 2021, `publish = false`) |
| SDK | `soroban-sdk` 28, declarado uma única vez na raiz do workspace |
| Ponto de entrada | `hello(to: String) -> Vec<String>` — retorna `["Hello", to]` |
| Estado | nenhum: uma função pura, sem escritas de armazenamento |
| Artefato | `target/wasm32v1-none/release/hello_world.wasm` (633 bytes) |
| ID na testnet | `CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE` |

### Perfil de compilação

O `Cargo.toml` traz um perfil de release orientado ao tamanho, para que o módulo implantado seja mínimo:

| Ajuste | Valor |
| --- | --- |
| `opt-level` | `"z"` (otimizar para tamanho) |
| `lto` / `codegen-units` | `true` / `1` (otimização máxima de link-time) |
| `panic` | `"abort"` (sem maquinaria de unwinding) |
| `strip` | `"symbols"` (símbolos de depuração removidos) |
| `overflow-checks` | `true` (overflows provocam pânico em vez de envolver) |

O perfil `release-with-logs` herda de `release` e reativa as asserções de depuração para depuração on-chain.

### Comandos

Executar a partir deste diretório (a raiz do workspace):

| Comando | O que faz |
| --- | --- |
| `cargo test` | executa os testes unitários no host |
| `cargo clippy --all-targets -- -D warnings` | lint com avisos tratados como erros |
| `cargo fmt --all` / `make fmt` | formata todas as crates |
| `stellar contract build` | compila cada membro `cdylib` para WASM |
| `stellar contract build --package hello-world` | compila uma única crate |
| `make test` | compila e depois executa os testes |
| `make clean` | remove `target/` |

`stellar contract build` aplica as flags e os metadados que a rede espera — não o substitua por `cargo build --target wasm32v1-none`. O target `wasm32v1-none` requer Rust 1.84 ou superior:

```bash
rustup target add wasm32v1-none
```

### Testes

Os testes rodam no host com a feature `testutils` — sem rede pelo caminho:

```rust
let words = client.hello(&String::from_str(&env, "Dev"));
assert_eq!(words, vec![&env, String::from_str(&env, "Hello"), String::from_str(&env, "Dev")]);
```

```bash
cargo test    # ou: make test
```

As instantâneas das invocações registradas ficam em `contracts/hello-world/test_snapshots/`.

### Implantação e invocação (Testnet)

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source-account <identidade> \
  --network testnet \
  --alias hello

stellar contract invoke \
  --id hello \
  --network testnet \
  --source-account <identidade> \
  -- hello --to world
```

Saída esperada:

```json
[
    "Hello",
    "world"
]
```

`stellar contract invoke --id <id> -- -h` imprime o CLI gerado para um contrato implantado.

**Instância implantada (Testnet)**

| Campo | Valor |
| --- | --- |
| ID do contrato | `CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE` |
| SHA-256 do WASM | `97f127cc24d2ba1d966176192f68e0a97a6cbac592fb443884c6062b7f12bbd0` |
| Endpoint RPC | `https://soroban-testnet.stellar.org` |
| Frase da rede | `Test SDF Network ; September 2015` |

### Frontend

`frontend/` contém a dApp React 19 + Vite que simula, assina e envia a chamada por meio de Freighter, xBull ou Lobstr. Veja o [README do frontend](frontend/README.md).

### Leituras recomendadas

- https://developers.stellar.org/docs/build/smart-contracts/overview
- https://developers.stellar.org/docs/tools/cli/install-cli
- https://github.com/stellar/soroban-examples
