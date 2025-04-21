//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'src',
  esbuild: {
    options: {
      target: 'esnext',
    },
  },
})
