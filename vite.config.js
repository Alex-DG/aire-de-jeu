// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        demo1: resolve(__dirname, 'demos/demo1.html'),
        demo2: resolve(__dirname, 'demos/demo2.html'),
        demo3: resolve(__dirname, 'demos/demo3.html'),
        demo4: resolve(__dirname, 'demos/demo4.html'),
        demo5: resolve(__dirname, 'demos/demo5.html'),
      },
    },
  },
  assetsInclude: ['**/*.glb'],
})
