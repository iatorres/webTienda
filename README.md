# Bebidas App — 100% Local (IndexedDB)

Proyecto React + Vite + Tailwind que funciona 100% en la computadora sin servidor.

## Características

- Almacena productos y ventas en IndexedDB.
- Carrito de compras, cálculo de IVA y ticket en PDF.
- Historial de ventas persistente.
- Búsqueda rápida y edición de precios/stock.
- Tema claro/oscuro.

## Requisitos

- Node.js >=16
- npm

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## Notas

- La app usa la librería `idb` para trabajar con IndexedDB.
- Si querés empaquetarla como app de escritorio considera usar Electron o Tauri.
