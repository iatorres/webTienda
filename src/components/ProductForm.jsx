import React from 'react'

const FormInput = (props) => (
  <input 
    {...props} 
    className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
  />
)

export default function ProductForm({ onAdd }){
  const [name,setName]=React.useState('')
  const [price,setPrice]=React.useState('')
  const [stock,setStock]=React.useState('')

  async function submit(e){
    e.preventDefault()
    if (!name || !price || !stock) return
    try{
      await onAdd({ name, price: Number(price), stock: Number(stock) })
      setName(''); setPrice(''); setStock('')
    }catch(err){
      alert(err?.message || 'Error')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormInput placeholder="Nombre del producto" value={name} onChange={e=>setName(e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <FormInput type="number" step="0.01" placeholder="Precio" value={price} onChange={e=>setPrice(e.target.value)} required />
        <FormInput type="number" placeholder="Stock inicial" value={stock} onChange={e=>setStock(e.target.value)} required />
      </div>
      <button className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors" type="submit">Guardar Producto</button>
    </form>
  )
}