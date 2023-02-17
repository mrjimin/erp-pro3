import { defineStore } from 'pinia';
import { Session } from '@/utils/storage';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 * @methods updateUserInfo 更新用户信息
 */
export const useUserInfo = defineStore('userInfo', {
    state: () => ({
        // userInfo: Session.get("userData") as UserInfoState & UserApi_InfoData["admin_info"],  // 用户信息
        userInfo: {},  // 用户信息
        state: Session.get('adm') == 'adm' ? true : false,
        menuList: [],      // 权限菜单
        company_group_id: '' as '' | number,   // 当前的公司分组id
    }),
    actions: {
        async setUserInfos() {
            // 获取用户信息、同时获取到对应的菜单（减少首次进入等待时间）

            this.updateUserInfo();

        },
        updateUserInfo() {
            // admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
            const adminRoles: Array<string> = ['admin'];
            // admin 按钮权限标识
            const adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
            // // test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
            // let testRoles: Array<string> = ['common'];
            // // test 按钮权限标识
            // let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];

            // 用户信息
            const userInfo = {
                "id": 1,//管理员ID
                "account": 123,//登录账号
                "phone": 1233,//联系方式
                "realname": "string",//姓名
                "last_login_time": "number",//最后登录时间
                "last_ip": "string",//最后登录IP
                "role_id": 1,//角色ID
                "status": 1 ,//账号状态 1正常 2禁用
                "company_id": 1,//所属公司ID
                "created_at": "number",//创建时间
                "menu_id": 'all', //有权限的菜单ID，超管为all
                role_name: "string",     //管理员角色名称 
                role_code: "string",   // 角色标识
                supplier_id: 1,     // 供应商id
                supplier_name: "string ",  // 供应商名称
                type: 1 ,   // 用户类型  1：公司用户，2：供应商用户
                photo: '',
                time: new Date().getTime(),
                roles: adminRoles,
                authBtnList: adminAuthBtnList,
            };

            this.userInfo = userInfo;   // 重新设置userData
            // Session.set("userData", userInfo)
        }
    },
});
