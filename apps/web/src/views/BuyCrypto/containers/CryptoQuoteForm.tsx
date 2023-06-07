import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { FormHeader } from './FormHeader'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '../index'
// eslint-disable-next-line import/no-cycle
import { FormQuote } from './FormQuote'
import { ProviderQoute } from '../hooks/usePriceQuoter'

export function CryptoQuoteForm({
  setModalView,
  buyCryptoState,
  combinedQuotes,
  fetchQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
  fetchQuotes: () => Promise<void>
}) {
  const [timer, setTimer] = useState(0)
  const [fetching, setFetching] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1)
    }, 1000)

    if (timer === 0) {
      setFetching(true)
      fetchQuotes()
        .then(() => {
          clearInterval(interval)
          setFetching(false)
        })
        .catch(() => {
          clearInterval(interval)
          setFetching(false)
        })
      setTimer(30)
    }

    return () => clearInterval(interval)
  }, [timer, fetchQuotes])

  return (
    <>
      {/* onRefresh={refresh} refreshDisabled={!tradeLoaded || syncing || !isStale} */}
      <FormHeader
        refreshDisabled={false}
        onRefresh={() => null}
        title="Select a quote"
        subTitle={`Quotes are updated every ${timer} seconds.`}
        backTo={() => setModalView(CryptoFormView.Input)}
      />
      <FormQuote buyCryptoState={buyCryptoState} combinedQuotes={combinedQuotes} fetching={fetching} />
    </>
  )
}
