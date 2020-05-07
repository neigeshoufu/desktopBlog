<template>
  <div id="wrapper">
     <webview :src="webviewAdd"></webview>
  </div>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    data () {
      return {
        
      }
    },
    computed: {
      ...mapState(['webviewAdd'])
    },
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
