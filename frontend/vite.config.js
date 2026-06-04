// vite.config.js
export default {
  server: {
    host: '0.0.0.0',  // Make it accessible from outside the container
    port: 5173,        // Make sure this matches the port you're exposing
  },
}
