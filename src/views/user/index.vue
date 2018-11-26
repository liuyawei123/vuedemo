<template>
  <div class="showview">
    <div style="text-align: right;margin-bottom: 10px;">
      <el-button type="primary" @click="openDialog">添加员工</el-button>
    </div>
    <span>
      <el-table border :data="tableData">
      <el-table-column label="姓名" prop="empName"></el-table-column>
      <el-table-column label="工作" prop="job"></el-table-column>
      <el-table-column label="部门号" prop="empno"></el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
      <el-button type="primary" icon="el-icon-delete" @click="remove(scope.row.empName)" >删除</el-button>

      </template>
      </el-table-column>

      <el-table-column label="操作">
      <template slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" @click="openDialog2(scope.row.id)">编辑</el-button>
      </template>
      </el-table-column>
      </el-table>
      </span>

    <UserForm_Add :visible.sync="visible" @success="loadData"></UserForm_Add>
    <UserForm_Modify :visible.sync="visible_modify" @success="loadData" v-bind:itemid="itemId"></UserForm_Modify>

  </div>
</template>

<script>

  import UserForm_Add from '../../components/user/form-add.vue'
  import UserForm_Modify from '../../components/user/form-modify.vue'

  import UserApi from '../../api/user/index.js'

  export default {
    components: {UserForm_Add, UserForm_Modify},
    props: {
      deptno: {
        Type: String
      }
    },
    data () {
      return {
        itemId: 0,
        visible: false,
        visible_modify: false,
        tableData: [],
        total: 0,
        query: {
          pageIndex: 1,
          pageSize: 10,
          userName: ''
        }
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {

      async loadData () {
        let resp = await UserApi.paging()
        this.tableData = JSON.parse(JSON.stringify(resp))['data']
        this.total = resp.total
      },
      pageChange (page) {
        this.query.pageIndex = page
        this.loadData()
      },
      remove (empName) {
        alert(empName)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let resp = await UserApi.remove(empName)
          let msg = JSON.parse(JSON.stringify(resp))['state']
          if (msg === 1) {
            this.$message({
              message: resp.data.message,
              type: 'success'
            })
            this.loadData()
          } else {
            this.$message({
              message: resp.data.message,
              type: 'fail'
            })
            this.loadData()
          }
        }).catch(() => {

        })
      },
      openDialog () {
        this.visible = true
      },
      openDialog2 (id) {
        this.itemId = id
        this.visible_modify = true
      }
    }
  }
</script>

<style>
</style>
