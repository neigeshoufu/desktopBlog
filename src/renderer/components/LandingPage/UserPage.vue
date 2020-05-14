<template>
  <div id="wrapper" 
    v-loading="loading"
    element-loading-text="页面加载中...">
     <webview :src="webviewAdd"></webview>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

  export default {
    data () {
      return {
        loading: false
      }
    },
    methods: {
      loadstart() {
        nprogress.start()
        this.loading = true
      },
      loadstop() {
        nprogress.done()
        this.loading = false
      }
    },
    computed: {
      ...mapState(['webviewAdd'])
    },
    mounted() {
      const webview = document.querySelector('webview')
      webview.addEventListener('did-start-loading', this.loadstart)
      webview.addEventListener('did-stop-loading', this.loadstop)
    }
  }
</script>
<style lang="css" scoped>

webview {
  display:flex; width:100%; height:100vh;
}

/* #wrapper {
   height: 100vh; 
} */
</style>
