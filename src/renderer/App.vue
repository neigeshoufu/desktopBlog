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
       <el-dropdown placement="bottom-start" @command="checkUpdate">
        <span class="el-dropdown-link">
          菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-upload" command="checkUpdate">检查更新</el-dropdown-item>
          <el-dropdown-item icon="el-icon-s-promotion
" command="share">生成二维码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
    <el-dialog
      title="更新说明"
      :visible.sync="verionBox"
      width="45%"
      >
      <span class="version">【version 2.0.1】</span>
      <span class="version">1.优化本地存储</span>
      <span class="version">2.增加了菜单选项</span>
      <span class="version">3.增加了自动更新（有待修复）</span>
      <span class="version">4.增加了扫码移动端阅读（在菜单里）</span>
      <span class="version">5."新增条目"改为弹框形式</span>
      <span class="version">【卸载】</span>
      <span class="version">右键桌面图标选择"打开文件位置",找到"uninstall"即可</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeVersionBox">知道了</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="移动端浏览"
      :visible.sync="shareBox"
      width="25%"
      >
      <div class="imgBox">
        <img :src="imgSrc" alt="图裂了" style="width: 100%;">
      </div>
    </el-dialog>
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
       shareBox: false,
       imgSrc: ''
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
        console.log()
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
      checkUpdate(command) {
       if (command === 'checkUpdate') {
         this.$confirm('更新功能存在错误等待修复，强制更新可能出现bug，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ipcRenderer.send('upDate')
        }).catch(() => {})
       } else if (command === 'share') {
         this.share()
       }
    
      },
      changeVersionBox() {
        this.$store.commit('changeVersionBoxState', false)
      },
      share() {
        //调二维码apu
        this.imgSrc = '' + this.webviewAdd
        this.shareBox = true
      }
    },
    mounted() {
      ipcRenderer.on('message',(event,{message,data}) => {
          if (message === 'isUpdateNow') {
            this.$confirm('是否更新?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              ipcRenderer.send('updateNow')
            }).catch(() => {})
          } else if (message === 'update-not-available') {
            this.$message({
              type: 'warning',
              message: '未发现新版'
            })
           } else if (message === 'error'){
              this.$message({
               type: 'error',
               message: `出现严重错误,${JSON.stringify(data)}`
             })
         } //else {
        //    this.$message({
        //        type: 'error',
        //        message: `出现严重错误,${JSON.stringify(data)}`
        //      })
        //  }
        })
    },
    computed: {
      ...mapState(['list', 'drawer', 'webviewAdd', 'verionBox'])
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

.el-dropdown {
   -webkit-app-region: no-drag;
   cursor: pointer;
}

.version {
  display: block;
}

.imgBox {
  width: 75%;
  margin: 0 auto;
}

</style>
