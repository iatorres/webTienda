import React from 'react'
import useStore from '../context/Store'
import { formatMoney } from '../utils'

const SaleRow = ({ sale }) => {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} className="border-b border-gray-200 dark:border-gray-700 hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        <td className="p-4 font-medium">#{sale.id}</td>
        <td className="p-4">{new Date(sale.createdAt).toLocaleString()}</td>
        <td className="p-4">{sale.items.length}</td>
        <td className="p-4 font-semibold text-right">{formatMoney(sale.total)}</td>
      </tr>
      {expanded && (
        <tr className="bg-white-50 text-white dark:bg-gray-800">
          <td colSpan="4" className="p-4">
            <div className="font-semibold mb-2">Detalles del pedido:</div>
            {sale.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{it.name || it.productName} x{it.quantity}</span>
                <span>{formatMoney(it.unitPrice * it.quantity)}</span>
              </div>
            ))}
          </td>
        </tr>
      )}
    </>
  )
}

export default function HistoryPage(){
  const sales = useStore(s=>s.sales)
  return (
    <div className="bg-panel p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Historial de Ventas</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-4">ID Venta</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Items</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s=>(
              <SaleRow key={s.id} sale={s} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}