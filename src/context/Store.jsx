import React from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { openDB } from 'idb'

/*
  Store holds products and sales. Products and sales are persisted in IndexedDB.
  Additionally Zustand persists cart in localStorage for quick access.
*/

const DB_NAME = 'bebidas-db'
const DB_VERSION = 1

async function getDB(){
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db){
      if(!db.objectStoreNames.contains('products')){
        const ps = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true })
        ps.createIndex('name', 'name', { unique: true })
      }
      if(!db.objectStoreNames.contains('sales')){
        db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

// wrapper helpers
export async function dbGetAll(storeName){
  const db = await getDB()
  return db.getAll(storeName)
}
export async function dbAdd(storeName, item){
  const db = await getDB()
  return db.add(storeName, item)
}
export async function dbPut(storeName, item){
  const db = await getDB()
  return db.put(storeName, item)
}
export async function dbDelete(storeName, key){
  const db = await getDB()
  return db.delete(storeName, key)
}

const useStoreBase = create(set => ({
  products: [],
  sales: [],
  cart: [],
  toast: null,
  theme: 'light',
  setTheme: (t) => { set({theme: t}); document.documentElement.setAttribute('data-theme', t==='dark'?'dark':'') },
  setToast: (msg) => set({ toast: msg }),
  clearToast: () => set({ toast: null }),
  loadAll: async () => {
    const prods = await dbGetAll('products')
    const sales = await dbGetAll('sales')
    set({ products: prods || [], sales: sales || [] })
  },
  addProduct: async (p) => {
    // try to insert; if name exists, throw
    const id = await dbAdd('products', p)
    const prods = await dbGetAll('products')
    set({ products: prods })
    return id
  },
  updateProduct: async (p) => {
    await dbPut('products', p)
    const prods = await dbGetAll('products')
    set({ products: prods })
  },
  deleteProduct: async (id) => {
    await dbDelete('products', id)
    const prods = await dbGetAll('products')
    set({ products: prods })
  },
  addToCart: (product) => set(state => {
    const cart = [...state.cart]
    const idx = cart.findIndex(c => c.id === product.id)
    if(idx>=0) cart[idx].quantity++
    else cart.push({ id: product.id, name: product.name, unitPrice: product.price, quantity: 1 })
    return { cart }
  }),
  removeFromCart: (id) => set(state => ({ cart: state.cart.filter(i=>i.id!==id) })),
  clearCart: () => set({ cart: [] }),
  createSale: async ({ items, iva, paymentMethod }) => {
    const subtotal = items.reduce((s,i)=> s + i.unitPrice*i.quantity, 0)
    const ivaAmount = subtotal * iva
    const total = subtotal + ivaAmount
    const sale = { items, iva: ivaAmount, total, paymentMethod, createdAt: new Date().toISOString() }
    const id = await dbAdd('sales', sale)
    // reduce stock
    const prods = await dbGetAll('products')
    for(const it of items){
      const p = prods.find(pp=>pp.id===it.id)
      if(p){
        p.stock = Math.max(0, (p.stock||0) - it.quantity)
        await dbPut('products', p)
      }
    }
    const updatedProds = await dbGetAll('products')
    const updatedSales = await dbGetAll('sales')
    set({ products: updatedProds, sales: updatedSales, cart: [] })
    return { id, ...sale }
  }
}))

export function StoreProvider({ children }){
  React.useEffect(() => {
    useStoreBase.getState().loadAll()
    // set theme initially
    const t = localStorage.getItem('bebidas-theme') || 'light'
    useStoreBase.getState().setTheme(t)
  }, [])
  return children
}

export default useStoreBase
