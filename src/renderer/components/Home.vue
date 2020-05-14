<template>
  <div id="wrapper">
    <div class="center-box">
      <h1>Desktop Blog</h1>
      <div class="btn-box">
        <el-tooltip effect="light" content="新增条目" placement="bottom-end">
         <el-button type="primary" icon="el-icon-edit" circle @click="dialogVisible = true"></el-button>
       </el-tooltip>
       <el-tooltip effect="light" content="前往博客" placement="bottom-start">
        <el-button type="success" icon="el-icon-s-promotion" circle @click="popDrawer(true)"></el-button>
       </el-tooltip>
      </div>
    </div>
    <el-dialog
      title="新增条目"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <el-input v-model="blogName" placeholder="请输入名称"></el-input>
      <el-input v-model="blogAdd" placeholder="请输入地址"></el-input>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="addItem" class="newItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import New from '@/components/LandingPage/New'

const ipcRenderer = require('electron').ipcRenderer
  export default {
    name: 'home-page',
    data() {
      return {
        dialogVisible: false,
        blogName: '',
        blogAdd: ''
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      goToUser() {
       this.$router.push('/user').catch(err => {err})
      },
      popDrawer(flag) {
        this.$store.commit('drawerControl', flag)
      },
      // goToAdd() {
      //   //this.$router.push('/add')
      //   ipcRenderer.send('open-mini')
      // },
      openMini() {
       console.log(this.list)
      },
      handleClose() {
        this.dialogVisible = false
      },
      addItem() {
          if (this.blogName === '' || this.blogAdd === '') {
              return this.$message({
                  message: '当前内容为空',
                  type: 'warning'
              })
          }
          const item = {"name": this.blogName, "address": this.blogAdd}
          this.$store.commit('updateList', item)
          this.blogName = this.blogAdd = ''
          this.$message({
            message: '新增成功',
            type: 'success'
          })

          console.log(this.list)
        }
    },
    computed: {
      ...mapState(['list'])
    },  
    mounted() {

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

 .el-input {
     margin: 1rem auto;
 }

 .newItem {
    width: inherit;
    height: 40px;
 }
  
</style>
