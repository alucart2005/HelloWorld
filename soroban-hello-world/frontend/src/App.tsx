import { useState } from 'react'
import AnimatedBackground from './components/AnimatedBackground'

const CONTRACT_ID =
  import.meta.env.VITE_CONTRACT_ID || 'CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE'
const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'
const NETWORK_PASSPHRASE =
  import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015'
const FEE = '100'

type StellarSdkModule = typeof import('@stellar/stellar-sdk')

let sdkModule: Promise<StellarSdkModule> | null = null
const loadSdk = (): Promise<StellarSdkModule> => {
  sdkModule ??= import('@stellar/stellar-sdk')
  return sdkModule
}

type WalletKit = (typeof import('@creit.tech/stellar-wallets-kit'))['StellarWalletsKit']

let walletKit: Promise<WalletKit> | null = null
const loadWalletKit = (): Promise<WalletKit> => {
  walletKit ??= (async () => {
    const [kit, freighter, xbull, lobstr] = await Promise.all([
      import('@creit.tech/stellar-wallets-kit'),
      import('@creit.tech/stellar-wallets-kit/modules/freighter'),
      import('@creit.tech/stellar-wallets-kit/modules/xbull'),
      import('@creit.tech/stellar-wallets-kit/modules/lobstr'),
    ])
    kit.StellarWalletsKit.init({
      network: kit.Networks.TESTNET,
      modules: [new freighter.FreighterModule(), new xbull.xBullModule(), new lobstr.LobstrModule()],
    })
    return kit.StellarWalletsKit
  })()
  return walletKit
}

export default function App() {
  const [publicKey, setPublicKey] = useState<string>('')
  const [to, setTo] = useState<string>('opencode')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')

  const connectWallet = async () => {
    try {
      const kit = await loadWalletKit()
      const { address } = await kit.authModal({})
      setPublicKey(address)
    } catch (e) {
      console.error(e)
    }
  }

  const disconnectWallet = async () => {
    try {
      const kit = await loadWalletKit()
      await kit.disconnect()
    } catch (e) {
      console.error(e)
    }
    setPublicKey('')
    setResult('')
  }

  const callHello = async () => {
    if (!publicKey) return
    setLoading(true)
    setResult('')

    try {
      const { Contract, rpc, nativeToScVal, scValToNative, xdr, TransactionBuilder } = await loadSdk()
      const kit = await loadWalletKit()
      const server = new rpc.Server(RPC_URL)
      const contract = new Contract(CONTRACT_ID)
      const account = await server.getAccount(publicKey)

      const tx = new TransactionBuilder(account, {
        fee: FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('hello', nativeToScVal(to, { type: 'string' })))
        .setTimeout(30)
        .build()

      const sim = await server.simulateTransaction(tx)
      if (rpc.Api.isSimulationSuccess(sim)) {
        const prepared = rpc.assembleTransaction(tx, sim).build()
        const { signedTxXdr } = await kit.signTransaction(prepared.toXDR(), {
          networkPassphrase: NETWORK_PASSPHRASE,
        })

        const txResult = await server.sendTransaction(
          TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE)
        )

        if (txResult.status === 'PENDING') {
          let getRes = await server.getTransaction(txResult.hash)
          while (getRes.status === 'NOT_FOUND') {
            await new Promise((r) => setTimeout(r, 1000))
            getRes = await server.getTransaction(txResult.hash)
          }
          if (getRes.status === 'SUCCESS') {
            if ('resultMetaXdr' in getRes && getRes.resultMetaXdr) {
              const meta = xdr.TransactionMeta.fromXDR(
                getRes.resultMetaXdr as unknown as string,
                'base64'
              ) as any
              const sorobanMeta =
                meta?.sorobanMeta?.() || meta?.value?.sorobanMeta?.() || meta?.value?.v3?.()?.sorobanMeta?.()
              if (sorobanMeta) {
                const scval = sorobanMeta.returnValue?.() || sorobanMeta.returnValue
                if (scval) {
                  const native = scValToNative(scval)
                  setResult(JSON.stringify(native))
                  return
                }
              }
            }
            setResult('Success')
            return
          }
          setResult(`Failed: ${getRes.status}`)
          return
        }
        setResult(`Status: ${txResult.status}`)
        return
      } else {
        setResult('Simulation failed')
      }
    } catch (e: any) {
      setResult(e?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const simulateHello = async () => {
    if (!publicKey) return
    setLoading(true)
    setResult('')

    try {
      const { Contract, rpc, nativeToScVal, scValToNative, TransactionBuilder } = await loadSdk()
      const server = new rpc.Server(RPC_URL)
      const contract = new Contract(CONTRACT_ID)
      const account = await server.getAccount(publicKey)

      const tx = new TransactionBuilder(account, {
        fee: FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('hello', nativeToScVal(to, { type: 'string' })))
        .setTimeout(30)
        .build()

      const sim = await server.simulateTransaction(tx)
      if (rpc.Api.isSimulationSuccess(sim)) {
        const scval = (sim as any).result?.retval
        if (scval) {
          const native = scValToNative(scval)
          setResult(`(SIM) ${JSON.stringify(native)}`)
          return
        }
        setResult('(SIM) OK')
        return
      }
      setResult('Simulation failed')
    } catch (e: any) {
      setResult(e?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const trackPointer = (e: React.PointerEvent) => {
    const el = document.getElementById('spotlight')
    if (!el) return
    el.style.setProperty('--mx', `${e.clientX}px`)
    el.style.setProperty('--my', `${e.clientY}px`)
  }

  return (
    <div className="relative min-h-screen text-slate-200" onPointerMove={trackPointer}>
      <AnimatedBackground />
      <div id="spotlight" className="spotlight" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12">
        <header className="fade-up mb-8 text-center" style={{ animationDelay: '60ms' }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-slate-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Stellar Testnet · Soroban
          </div>

          <h1 className="gradient-text text-4xl font-extrabold tracking-tight sm:text-5xl">
            Soroban Hello World
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
            Invoca un contrato inteligente <span className="text-orange-400">Rust</span> en cadena
            desde tu navegador con Web3.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {['Rust', 'Soroban', 'React 19', 'Stellar SDK'].map((t) => (
              <span key={t} className="chip rounded-full px-3 py-1 text-xs text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </header>

        <div
          className="glass-card fade-up rounded-3xl p-6 sm:p-8"
          style={{ animationDelay: '180ms' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              {publicKey ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  <span className="font-mono text-emerald-300">
                    {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  <span className="text-slate-400">Wallet not connected</span>
                </>
              )}
            </div>

            {!publicKey ? (
              <button
                onClick={connectWallet}
                className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold text-white"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={disconnectWallet}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:bg-white/10"
              >
                Disconnect
              </button>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <label htmlFor="to-input" className="text-sm font-medium text-slate-300">
              to
            </label>
            <input
              id="to-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/30"
              placeholder="opencode"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={simulateHello}
              disabled={!publicKey || loading}
              className="flex-1 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Simulate
            </button>
            <button
              onClick={callHello}
              disabled={!publicKey || loading}
              className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading && <span className="spinner" />}
              {loading ? 'Calling...' : 'Call hello(to)'}
            </button>
          </div>

          {result && (
            <div className="fade-up mt-5 overflow-auto rounded-xl border border-emerald-400/15 bg-black/45 p-4 font-mono text-sm text-emerald-300">
              {result}
            </div>
          )}

          <div className="mt-5 truncate border-t border-white/5 pt-4 font-mono text-[11px] text-slate-500">
            Contract: {CONTRACT_ID}
          </div>
        </div>

        <footer
          className="fade-up mt-8 text-center text-xs text-slate-500"
          style={{ animationDelay: '300ms' }}
        >
          Built with Rust · Soroban · Stellar Protocol
        </footer>
      </div>
    </div>
  )
}
