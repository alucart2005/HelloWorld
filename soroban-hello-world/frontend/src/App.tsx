import { useState } from 'react'
import {
  StellarWalletsKit,
  Networks,
} from '@creit.tech/stellar-wallets-kit'
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import { Contract, rpc, nativeToScVal, scValToNative, xdr, TransactionBuilder } from '@stellar/stellar-sdk'

const CONTRACT_ID =
  import.meta.env.VITE_CONTRACT_ID || 'CBDKHW25QO3IMWWXVLBHHPMRLMFS7W7HCSYOY4A4Z2HMKAIKPZJMSCQE'
const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'
const NETWORK_PASSPHRASE =
  import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015'
const FEE = '100'

StellarWalletsKit.init({
  network: Networks.TESTNET,
  modules: [new FreighterModule(), new xBullModule(), new LobstrModule()],
})

export default function App() {
  const [publicKey, setPublicKey] = useState<string>('')
  const [to, setTo] = useState<string>('opencode')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')

  const connectWallet = async () => {
    try {
      await StellarWalletsKit.authModal({
      }).then(async ({ address }) => {
        setPublicKey(address)
      }).catch((e) => {
        console.error(e)
      })
    } catch (err) {
      console.error(err)
    }
  }

  const disconnectWallet = async () => {
    try {
      await StellarWalletsKit.disconnect()
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
      const server = new rpc.Server(RPC_URL)
      const contract = new Contract(CONTRACT_ID)
      const account = await server.getAccount(publicKey)

      const tx = new TransactionBuilder(account, {
        fee: FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'hello',
            nativeToScVal(to, { type: 'string' })
          )
        )
        .setTimeout(30)
        .build()

      const sim = await server.simulateTransaction(tx)
      if (rpc.Api.isSimulationSuccess(sim)) {
        const prepared = rpc.assembleTransaction(tx, sim).build()
        const { signedTxXdr } = await StellarWalletsKit.signTransaction(prepared.toXDR(), {
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
              const meta = xdr.TransactionMeta.fromXDR(getRes.resultMetaXdr as unknown as string, 'base64') as any
              const sorobanMeta = meta?.sorobanMeta?.() || meta?.value?.sorobanMeta?.() || meta?.value?.v3?.()?.sorobanMeta?.()
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Soroban Hello World</h1>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm">
              {publicKey ? (
                <span className="text-green-600">
                  Connected: {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
                </span>
              ) : (
                <span className="text-gray-500">Not connected</span>
              )}
            </div>
            <div className="flex gap-2">
              {!publicKey ? (
                <button onClick={connectWallet} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Connect Wallet
                </button>
              ) : (
                <button onClick={disconnectWallet} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
                  Disconnect
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">to</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="opencode"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={simulateHello}
              disabled={!publicKey || loading}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Simulate
            </button>
            <button
              onClick={callHello}
              disabled={!publicKey || loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Calling...' : 'Call hello(to)'}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-auto">
              {result}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2">
            Contract: {CONTRACT_ID}
          </div>
        </div>
      </div>
    </div>
  )
}
