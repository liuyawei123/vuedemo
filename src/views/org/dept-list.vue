<template>
  <div>
    <div>
      <el-input  @keyup.enter.native="loadData"
                 placeholder="请输入您要查询的部门号"
                 v-model="id">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-table border :data="deptData">
        <el-table-column class="column" label="部门号" prop="deptno"></el-table-column>
        <el-table-column class="column" label="部门名称" prop="deptName"></el-table-column>
        <el-table-column class="column" label="部门地址" prop="loc"></el-table-column>
        <el-table-column class="column" label="上级部门" prop="leader" ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import OrgApi from '@/api/org'
  export default {
    methods: {
      async loadData () {
        let resp = await OrgApi.queryDepts(this.id)
        this.deptData = JSON.parse(JSON.stringify(resp))['data']
      }
    },
    data () {
      return {
        deptData: [],
        id: null
      }
    },
    async mounted () {
      this.loadData()
    },
    async created () {
      this.loadData()
    }
  }
</script>

<style>
  body{
    background: #DFE9FB;
  }
</style>
