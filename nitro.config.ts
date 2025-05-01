//https://nitro.unjs.io/config

export default defineNitroConfig({
  compatibilityDate: '2025-04-28',
  srcDir: 'src',
  esbuild: {
    options: {
      target: 'esnext',
    },
  },
})
