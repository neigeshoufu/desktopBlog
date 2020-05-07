<template>
  <div id="wrapper">
    <div class="center-box">
      <h1>Desktop Blog</h1>
      <div class="btn-box">
        <el-tooltip effect="light" content="新增条目" placement="bottom-end">
         <el-button type="primary" icon="el-icon-edit" circle @click="goToAdd"></el-button>
       </el-tooltip>
       <button @click="openMini">jhkj</button>
       <el-tooltip effect="light" content="前往博客" placement="bottom-start">
        <el-button type="success" icon="el-icon-s-promotion" circle @click="popDrawer(true)"></el-button>
       </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
const ipcRenderer = require('electron').ipcRenderer
  export default {
    name: 'home-page',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      goToUser() {
       this.$router.push('/user')
      },
      popDrawer(flag) {
        this.$store.commit('drawerControl', flag)
      },
      goToAdd() {
        this.$router.push('/add')
      },
      openMini() {
        ipcRenderer.send('open-mini')
      }
    },
    computed: {
  
    },  
  }
</script>

<style lang="css" scoped>
.center-box {
  width: 15rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}

.center-box > h2 {
  text-align: center;
}

.el-button {
  width: 3.5rem;
  height: 3.5rem;
}

.btn-box {
  width: 9.5rem;
  margin: 2rem auto;
}
  
</style>
