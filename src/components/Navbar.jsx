import React from 'react'
import useStore from '../context/Store'

const NavButton = ({ children, onClick, active }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      active
        ? 'bg-primary text-white'
        : 'text-muted hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}>
    {children}
  </button>
)

const ThemeToggle = ({ theme, toggle }) => (
  <button
    onClick={toggle}
    className="p-2 rounded-full text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none">
    {theme === 'light' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )}
  </button>
)

export default function Navbar({ view, setView }){
  const theme = useStore(state => state.theme)
  const setTheme = useStore(state => state.setTheme)

  function toggle(){
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('bebidas-theme', next)
  }

  return (
    <div className="bg-panel shadow-md p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-primary">Bebidas App</h1>
      <div className="flex items-center space-x-4">
        <NavButton onClick={()=>setView('stock')} active={view === 'stock'}>Stock</NavButton>
        <NavButton onClick={()=>setView('new')} active={view === 'new'}>Nueva Venta</NavButton>
        <NavButton onClick={()=>setView('history')} active={view === 'history'}>Historial</NavButton>
      </div>
      <ThemeToggle theme={theme} toggle={toggle} />
    </div>
  )
}