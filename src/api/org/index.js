import axios from 'axios'
export default {
  queryDepts: async (deptno) => {
    let resp = await axios.get(`/api/depts/${deptno}`)
    return resp.data
  },
  create: async (dept) => {
    let resp = await axios.post(`/api/depts/`, dept)
    return resp
  },
  remove: async (deptno) => {
    let resp = await axios.delete(`/api/depts/${deptno}`)
    return resp.data
  },
  modify: async (dept) => {
    let resp = await axios.put(`/api/depts/`, dept)
    return resp
  }
}
