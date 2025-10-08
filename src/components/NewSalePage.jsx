import React from 'react'
import useStore from '../context/Store'
import { formatMoney } from '../utils'
import jsPDF from 'jspdf'

const ProductCard = ({ product, onAddToCart }) => (
  <div className="bg-panel p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
    <div className="flex-grow">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-muted">Stock: {product.stock}</p>
      <p className="text-2xl font-bold text-primary my-2">{formatMoney(product.price)}</p>
    </div>
    <button 
      onClick={() => onAddToCart(product)}
      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50"
      disabled={product.stock === 0}>
      Agregar
    </button>
  </div>
)

const CartItem = ({ item, onRemoveFromCart }) => (
  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-3">
    <div>
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm text-muted">{item.quantity} x {formatMoney(item.unitPrice)}</p>
    </div>
    <div className="flex items-center">
      <p className="font-semibold mr-4">{formatMoney(item.quantity * item.unitPrice)}</p>
      <button onClick={() => onRemoveFromCart(item.id)} className="text-danger hover:text-opacity-80 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
)

export default function NewSalePage(){
  const products = useStore(s=>s.products)
  const cart = useStore(s=>s.cart)
  const addToCart = useStore(s=>s.addToCart)
  const removeFromCart = useStore(s=>s.removeFromCart)
  const createSale = useStore(s=>s.createSale)
  const setToast = useStore(s=>s.setToast)
  const [q, setQ] = React.useState('')

  const ivaRate = 0.21
  const subtotal = cart.reduce((s,i)=> s + i.unitPrice*i.quantity, 0)
  const iva = subtotal * ivaRate
  const total = subtotal + iva

  async function doSale(){
    if(!cart.length) return
    try{
      const sale = await createSale({ items: cart, iva: ivaRate, paymentMethod: 'Efectivo' })
      setToast('Venta registrada')
      generateTicket({ id: sale.id, items: sale.items, iva: sale.iva, total: sale.total, createdAt: sale.createdAt })
    }catch(err){
      setToast('Error al registrar venta')
    }
  }

  function generateTicket(sale){
    const doc = new jsPDF()
    doc.setFontSize(12)
    doc.text('Tienda de Bebidas',10,10)
    doc.text(`Compra #${sale.id}`,10,20)
    doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString()}`,10,28)
    let y=38
    sale.items.forEach(it=>{
      doc.text(`${it.name || it.productName} x${it.quantity} @ ${formatMoney(it.unitPrice)} = ${formatMoney(it.unitPrice*it.quantity)}`,10,y)
      y+=8
    })
    doc.text(`IVA: ${formatMoney(sale.iva)}`,10,y+6)
    doc.text(`Total: ${formatMoney(sale.total)}`,10,y+14)
    doc.save(`ticket-${sale.id}.pdf`)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Productos</h2>
        </div>
        <input 
          className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Buscar producto..." value={q} onChange={e=>setQ(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(p=>(
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      </div>

      <div className="lg:col-span-1 bg-panel p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Carrito</h2>
        {cart.length === 0 ? (
          <p className="text-muted">El carrito está vacío.</p>
        ) : (
          <div>
            {cart.map(i=>(
              <CartItem key={i.id} item={i} onRemoveFromCart={removeFromCart} />
            ))}
          </div>
        )}
        
        {cart.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-muted">Subtotal:</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted">IVA (21%):</span>
              <span>{formatMoney(iva)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mb-4">
              <span>Total:</span>
              <span>{formatMoney(total)}</span>
            </div>
            <button 
              className="w-full bg-accent text-white py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50"
              onClick={doSale} 
              disabled={!cart.length}>
              Cobrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}