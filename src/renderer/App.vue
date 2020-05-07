<template>
  <div id="app">
    <header>
     <div class="win-title">
        <h5>Desktop Blog</h5>
     </div>
     <div class="title-bar">
       <el-tooltip effect="light" content="展开列表" placement="bottom-start">
         <i class="el-icon-s-unfold" @click="popDrawer(true)"></i>
       </el-tooltip>
       <i class="el-icon-s-home" @click="goToHome"></i>
       <i class="el-icon-info" @click="info"></i>
       <el-tooltip effect="light" content="在浏览器打开" placement="bottom-start">
         <i class="el-icon-share" @click="open"></i>
       </el-tooltip>
     </div>
      <div class="control">
        <i class="el-icon-minus" @click="window_min"></i>
        <i class="el-icon-top-right" @click="window_max"></i>
        <i class="el-icon-close" @click="window_close"></i>
      </div>
    </header>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      :before-close="handleClose"
      >
      <div class="list" v-for="(item, i) in list" :key="i">
        <div class="item">
          <h4 @click="goToUserPage(i, item.address)">{{ item.name }}</h4>
          <i class="el-icon-delete" @click="deleteItem(i)"></i>
        </div>
      </div>
    </el-drawer>
    <router-view></router-view>
  </div>
</template>

<script>
//ipcRenderer与主进程实现通信
const ipcRenderer = require('electron').ipcRenderer
import {mapState} from 'vuex'
import { shell } from 'electron'

  export default {
    name: 'replay',
    data() {
      return {
        
      }
    },
    methods: {
      window_max() {
        ipcRenderer.send('window-max')
      },
      window_min() {
        ipcRenderer.send('window-min')
      },
      window_close() {
        ipcRenderer.send('window-close')
      },
      goToHome() {
        this.$router.push('/')
      },
      popDrawer(flag) {
        this.$store.commit('drawerControl', flag)
      },
      handleClose() {
        this.$store.commit('drawerControl', false)
      },
      goToUserPage(index, add) {
        this.$store.commit('changeView',add)
        this.$router.push('user')
        this.handleClose()
      },
      deleteItem(index) {
        this.$confirm('即将删除该项，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('deleteList', index)
          this.$message({type: 'success', message: '删除成功'})
        }).catch(() => {})
      },
      info() {
        ipcRenderer.send('info-box')
      },
      open() {
        this.$electron.shell.openExternal(this.webviewAdd)
      },
      
    },
    created() {
      
    },
    computed: {
      ...mapState(['list', 'drawer', 'webviewAdd'])
    },
  }
</script>

<style lang="css">
  /* CSS */
  * {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  header {
    -webkit-app-region: drag;
    display: flex;
    height: 1.8rem;
    /* border-bottom: 1px #bdc3c7 solid; */
  }

  .win-title {
    flex: 1;
    line-height: 1.8rem;
    margin-left: 15px;
  }

  .title-bar {
    flex: 7;
    line-height: 1.8rem;
  }
  .control {
    -webkit-app-region: no-drag;
    flex: 1;
    /* margin-left: 35%; */
    position: absolute;
    right: 1rem;
    line-height: 1.8rem;
  }
 
 .el-icon-minus:hover, .el-icon-top-right:hover, .el-icon-close:hover, 
 .el-icon-s-unfold:hover, .el-icon-s-home:hover, .el-icon-info:hover, .el-icon-share:hover {
   cursor: pointer;
   border: 1px #95a5a6 solid;
 }

 .el-icon-s-unfold, .el-icon-s-home, .el-icon-info, .el-icon-share {
   -webkit-app-region: no-drag;
 }

::-webkit-scrollbar {
width: 2px; /*滚动条宽度*/
/*height: 2px;  !*滚动条高度*!*/
}

::-webkit-scrollbar-thumb {
border-radius: 99px; /*滚动条的圆角*/
/*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
/*background-color: green;  !*滚动条的背景颜色*!*/
}

.item {
  width: 85%;
  height: 1.5rem;
  box-shadow: 5px 5px 5px #ecf0f1;
  margin: 1rem auto;
  border-radius: 7px;
  display: flex;
}

.item > h4 {
  line-height: 1.3rem;
  padding-left: 5px;
  flex: 7;
  cursor: pointer;
}

.item:hover {
  border: 1px #3498db solid;
}

.el-icon-delete {
  cursor: pointer;
  flex: 1;
  line-height: 1.3rem;
}
.el-icon-delete:hover {
  border: 1px #2ecc71 solid;
}

</style>
