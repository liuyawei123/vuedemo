import Login from '../views/login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import userIndex from '../views/user/index'
import org from '../views/org/dept-list'
import tree from '../views/org/dept-tree'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '登录',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/users', component: userIndex, name: '用户操作' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '部门操作',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/org', component: org, name: '部门查询' },
            { path: '/tree', component: tree, name: '部门管理' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
