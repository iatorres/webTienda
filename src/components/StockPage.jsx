import React from 'react'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import useStore from '../context/Store'

export default function StockPage(){
  const [showForm, setShowForm] = React.useState(false)
  const products = useStore(s=>s.products)
  const setToast = useStore(s=>s.setToast)
  const addProduct = useStore(s=>s.addProduct)
  const updateProduct = useStore(s=>s.updateProduct)
  const deleteProduct = useStore(s=>s.deleteProduct)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock de Productos</h1>
        <button onClick={() => setShowForm(p => !p)} className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-panel p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
          <ProductForm 
            onAdd={async (p)=>{ 
              await addProduct(p); 
              setToast('Producto creado');
              setShowForm(false);
            }} 
          />
        </div>
      )}

      <div className="bg-panel p-6 rounded-lg shadow-md">
        <ProductList 
          products={products} 
          onUpdate={updateProduct} 
          onDelete={async (id)=>{ 
            await deleteProduct(id); 
            setToast('Producto eliminado') 
          }} 
        />
      </div>
    </div>
  )
}