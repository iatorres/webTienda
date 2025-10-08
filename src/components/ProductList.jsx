import React from 'react'
import { formatMoney } from '../utils'

const ActionButton = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`p-2 rounded-md transition-colors duration-200 ${className}`}>
    {children}
  </button>
)

export default function ProductList({ products=[], onUpdate, onDelete }){
  const [q,setQ]=React.useState('')
  const filtered = products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <input 
        className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Buscar producto..." 
        value={q} 
        onChange={e=>setQ(e.target.value)} 
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">
                  <input 
                    defaultValue={p.price} 
                    type="number" 
                    step="0.01" 
                    onBlur={e=>onUpdate({ ...p, price: Number(e.target.value) })} 
                    className="w-24 p-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 text-right space-x-2">
                  <ActionButton onClick={async ()=>{ await onUpdate({ ...p, stock: p.stock+1 }) }} className="hover:bg-green-200 dark:hover:bg-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </ActionButton>
                  <ActionButton onClick={async ()=>{ await onUpdate({ ...p, stock: Math.max(0,p.stock-1) }) }} className="hover:bg-orange-200 dark:hover:bg-orange-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                  </ActionButton>
                  <ActionButton onClick={async ()=>{ if(confirm('¿Está seguro que desea eliminar este producto?')) await onDelete(p.id) }} className="hover:bg-red-200 dark:hover:bg-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}