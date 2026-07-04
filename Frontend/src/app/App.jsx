import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { routes } from './App.routes'
import { useAuth } from './features/auth/hooks/useAuth'

const App = () => {

  const { handleGetMe } = useAuth()

  React.useEffect(() => {
    handleGetMe()
  }, [handleGetMe])

  return (
    <>
      <RouterProvider router={routes}/>
    </>
  )
}

export default App