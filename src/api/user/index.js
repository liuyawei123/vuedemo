/**
 * Created by binwang on 2018/11/7.
 */
import axios from 'axios'

export default {

  /**/
  data () {
    return {
      visible: false,
      tableData: [],
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
        userName: ''
      }
    }
  },
  /* 查找所有 */
  paging: async () => {
    let resp = await axios.get(`/api/users/all`)
    return resp.data
  },
  /* 查找某个部门 */
  queryEmps: async (deptno) => {
    let resp = await axios.get(`/api/users/${deptno}`)
    return resp.data
  },
  /* 创建 */
  create: async (emp) => {
    let resp = await axios.post('/api/users', emp)
    return resp.data
  },
  /* 删除 */
  remove: async (ename) => {
    let resp = await axios.delete(`/api/users/${ename}`)
    return resp.data
  },
  /* 登陆 */
  login: async (emp) => {
    let resp = await axios.post(`/api/users/actions/login/`, emp)
    return resp
  },
  /* 修改 */
  updateEmp: async (emp) => {
    let resp = await axios.put('/api/users/', emp)
    return resp.data
  }
}
