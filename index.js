import { useState, useCallback } from "react"
import { useDispatch as useReduxDispatch } from "react-redux"

export const useDispatch = (
  [reduxKey, ...resolveArgs],
  resolveFunction,
  {
    onMutate = undefined,
    onSuccess = undefined,
    onError = undefined,
    onSettled = undefined,
  } = {}
) => {
  const [status, setStatus] = useState("idle")
  const [data, setData] = useState()
  const [error, setError] = useState()

  const dispatch = useReduxDispatch()

  const executeFunction = useCallback(async () => {
    setData()
    setError()
    setStatus("loading")
    if (onMutate) onMutate(...resolveArgs)

    try {
      const responseData = await resolveFunction(...resolveArgs)
      setStatus("success")
      setData(responseData)
      dispatch({ type: reduxKey, payload: responseData })
      if (onSuccess) onSuccess(dispatch)
    } catch (err) {
      setStatus("error")
      setError(err)
      if (onError) onError(err)
    } finally {
      if (onSettled) onSettled(dispatch, data)
    }

    // eslint-disable-next-line
  }, [resolveArgs, reduxKey])

  return [
    executeFunction,
    {
      status,
      data,
      error,
    },
  ]
}
