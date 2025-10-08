import React from 'react'
import useStore from '../context/Store'

export default function Toast(){
  const toast = useStore(s=>s.toast)
  const clear = useStore(s=>s.clearToast)
  React.useEffect(()=>{ if(toast) { const t = setTimeout(()=>clear(),2000); return ()=>clearTimeout(t) } },[toast])
  if(!toast) return null
  return (
    <div className="fixed bottom-6 right-6 bg-black text-white p-3 rounded shadow">{toast}</div>
  )
}
