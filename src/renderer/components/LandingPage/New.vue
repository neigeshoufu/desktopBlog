<template>
  <div>
    <div class="add-box">
      <h3 style="text-align: center;">新增条目</h3>
      <el-input v-model="blogName" placeholder="请输入名称"></el-input>
      <el-input v-model="blogAdd" placeholder="请输入地址"></el-input>
      <el-button type="primary" @click="addItem">新增条目</el-button>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
          blogName: '',
          blogAdd: ''
        }
    },
    methods: {
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
        }
    },
}
</script>


<style lang="css" scoped>
 .add-box {
     width: 15rem;
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%, -50%);
 }

 .el-input {
     margin: 1rem auto;
 }

 .el-button {
     width: inherit;
 }


</style>