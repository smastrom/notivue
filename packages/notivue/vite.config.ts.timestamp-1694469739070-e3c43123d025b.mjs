// vite.config.ts
import { defineConfig } from 'file:///Users/smastromattei/Desktop/notivue/node_modules/.pnpm/vite@4.4.9_@types+node@18.17.15_lightningcss@1.21.8/node_modules/vite/dist/node/index.js'
import { fileURLToPath } from 'url'
import vue from 'file:///Users/smastromattei/Desktop/notivue/node_modules/.pnpm/@vitejs+plugin-vue@4.3.4_vite@4.4.9_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import dts from 'file:///Users/smastromattei/Desktop/notivue/node_modules/.pnpm/vite-plugin-dts@3.5.3_@types+node@18.17.15_typescript@5.2.2_vite@4.4.9/node_modules/vite-plugin-dts/dist/index.mjs'
var __vite_injected_original_import_meta_url =
   'file:///Users/smastromattei/Desktop/notivue/packages/notivue/vite.config.ts'
var path = (url) => fileURLToPath(new URL(url, __vite_injected_original_import_meta_url))
var isFinalBundle = !process.argv.includes('--watch')
var vite_config_default = defineConfig({
   resolve: {
      alias: {
         '@/core': path('./core'),
         '@/Notivue': path('./Notivue'),
         '@/NotivueSwipe': path('./NotivueSwipe'),
         '@/NotivueKeyboard': path('./NotivueKeyboard'),
         '@/Notifications': path('./Notifications'),
         notivue: path('./index.ts'),
      },
   },
   esbuild: {
      drop: isFinalBundle ? ['console'] : [],
   },
   build: {
      emptyOutDir: isFinalBundle,
      lib: {
         entry: 'index.ts',
         name: 'Notivue',
         fileName: 'index',
         formats: ['es'],
      },
      rollupOptions: {
         external: ['vue'],
         output: {
            globals: {
               vue: 'Vue',
            },
         },
      },
   },
   plugins: [
      dts({
         rollupTypes: true,
      }),
      vue(),
   ],
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc21hc3Ryb21hdHRlaS9EZXNrdG9wL25vdGl2dWUvcGFja2FnZXMvbm90aXZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3NtYXN0cm9tYXR0ZWkvRGVza3RvcC9ub3RpdnVlL3BhY2thZ2VzL25vdGl2dWUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3NtYXN0cm9tYXR0ZWkvRGVza3RvcC9ub3RpdnVlL3BhY2thZ2VzL25vdGl2dWUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCdcblxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuY29uc3QgcGF0aCA9ICh1cmw6IHN0cmluZykgPT4gZmlsZVVSTFRvUGF0aChuZXcgVVJMKHVybCwgaW1wb3J0Lm1ldGEudXJsKSlcblxuY29uc3QgaXNGaW5hbEJ1bmRsZSA9ICFwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoJy0td2F0Y2gnKVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgICdAL2NvcmUnOiBwYXRoKCcuL2NvcmUnKSxcbiAgICAgICAgICdAL05vdGl2dWUnOiBwYXRoKCcuL05vdGl2dWUnKSxcbiAgICAgICAgICdAL05vdGl2dWVTd2lwZSc6IHBhdGgoJy4vTm90aXZ1ZVN3aXBlJyksXG4gICAgICAgICAnQC9Ob3RpdnVlS2V5Ym9hcmQnOiBwYXRoKCcuL05vdGl2dWVLZXlib2FyZCcpLFxuICAgICAgICAgJ0AvTm90aWZpY2F0aW9ucyc6IHBhdGgoJy4vTm90aWZpY2F0aW9ucycpLFxuICAgICAgICAgbm90aXZ1ZTogcGF0aCgnLi9pbmRleC50cycpLFxuICAgICAgfSxcbiAgIH0sXG4gICBlc2J1aWxkOiB7XG4gICAgICBkcm9wOiBpc0ZpbmFsQnVuZGxlID8gWydjb25zb2xlJ10gOiBbXSxcbiAgIH0sXG4gICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IGlzRmluYWxCdW5kbGUsXG4gICAgICBsaWI6IHtcbiAgICAgICAgIGVudHJ5OiAnaW5kZXgudHMnLFxuICAgICAgICAgbmFtZTogJ05vdGl2dWUnLFxuICAgICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgICB9LFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgZXh0ZXJuYWw6IFsndnVlJ10sXG4gICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICAgICAgIHZ1ZTogJ1Z1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgfSxcbiAgICAgIH0sXG4gICB9LFxuICAgcGx1Z2luczogW1xuICAgICAgZHRzKHtcbiAgICAgICAgIHJvbGx1cFR5cGVzOiB0cnVlLFxuICAgICAgfSksXG4gICAgICB2dWUoKSxcbiAgIF0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVixTQUFTLG9CQUFvQjtBQUM5VyxTQUFTLHFCQUFxQjtBQUU5QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBSmtNLElBQU0sMkNBQTJDO0FBTW5RLElBQU0sT0FBTyxDQUFDLFFBQWdCLGNBQWMsSUFBSSxJQUFJLEtBQUssd0NBQWUsQ0FBQztBQUV6RSxJQUFNLGdCQUFnQixDQUFDLFFBQVEsS0FBSyxTQUFTLFNBQVM7QUFFdEQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDekIsU0FBUztBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0osVUFBVSxLQUFLLFFBQVE7QUFBQSxNQUN2QixhQUFhLEtBQUssV0FBVztBQUFBLE1BQzdCLGtCQUFrQixLQUFLLGdCQUFnQjtBQUFBLE1BQ3ZDLHFCQUFxQixLQUFLLG1CQUFtQjtBQUFBLE1BQzdDLG1CQUFtQixLQUFLLGlCQUFpQjtBQUFBLE1BQ3pDLFNBQVMsS0FBSyxZQUFZO0FBQUEsSUFDN0I7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTixNQUFNLGdCQUFnQixDQUFDLFNBQVMsSUFBSSxDQUFDO0FBQUEsRUFDeEM7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNKLGFBQWE7QUFBQSxJQUNiLEtBQUs7QUFBQSxNQUNGLE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDakI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNaLFVBQVUsQ0FBQyxLQUFLO0FBQUEsTUFDaEIsUUFBUTtBQUFBLFFBQ0wsU0FBUztBQUFBLFVBQ04sS0FBSztBQUFBLFFBQ1I7QUFBQSxNQUNIO0FBQUEsSUFDSDtBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNOLElBQUk7QUFBQSxNQUNELGFBQWE7QUFBQSxJQUNoQixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsRUFDUDtBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
