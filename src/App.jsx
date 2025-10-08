import React from 'react'
import Navbar from './components/Navbar'
import StockPage from './components/StockPage'
import NewSalePage from './components/NewSalePage'
import HistoryPage from './components/HistoryPage'
import Toast from './components/Toast'
import { StoreProvider } from './context/Store'

export default function App(){
  const [view, setView] = React.useState('stock')
  return (
    <StoreProvider>
      <div className="min-h-screen">
        <Navbar view={view} setView={setView} />
        <div className="p-6">
          {view === 'stock' && <StockPage />}
          {view === 'new' && <NewSalePage />}
          {view === 'history' && <HistoryPage />}
        </div>
        <Toast />
      </div>
    </StoreProvider>
  )
}
