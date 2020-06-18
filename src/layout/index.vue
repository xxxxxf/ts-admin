<template>
  <el-container id="index">
    <el-header>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="iconren iconfont icon" style="margin-right:5px;">
            </i>{{ user && user.name || '-' }}
            <i class="el-icon-arrow-down el-icon--right">
          </i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personalInformation">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <img src="../assets/images/smart_fabric.jpg" alt="">
    </el-header>
    <el-container>
      <el-aside style="width:200px">
        <!-- <el-menu :menu="menu" @setUrl="handleLink"></el-menu> -->
        <a-menu :menu="menu" @setUrl="handleLink"></a-menu>
      </el-aside>
      <el-main>
        <transition name="router-animate" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator"
  import aMenu from "@/components/common/menu.vue"

  @Component({
    components: {
      aMenu
    }
  })

  export default class Index extends Vue {
    /**
     *
     * @description: 菜单数据源
     *
     */

    private menu: any[] = []

    /**
     *
     * @description: 当前登录的用户信息
     *
     */

     private user: any = []
     private showTitle: string = ''

    /**
     *
     * @description: 导航跳转
     * @param {menuItem} 当前选中的导航
     * @return {void}
     *
     */

    private handleLink(menuItem: any): void {
      this.$router.push('/' + menuItem.href)
    }

    /**
     *
     * @description: 处理 command 事件
     * @param {command} 类型
     * @return {}
     *
     */

    private handleCommand(command: string) {
      if (command === 'logout') {
        this.handleLogout()
      } else if (command === 'personalInformation') {
        // 个人信息修改页面
        // this.$router.push('/information');
        window.$message({
          message: '看不了',
          type: "warning"
        });
      }
    }
    

    /**
     *
     * @description: 退出登入
     * @return {void}
     *
     */

    private handleLogout(): void {
      let _this = this;
      async function  logout() {
          // let result: any = await  window.$request.post('adminapi/login/logout' ,  {
           
          // })
          // if (result.code === 0) {
          //   return Promise.reject();
          // }
          window.token = null;
          localStorage.clear();
          _this.$router.push('/login');
      }
      logout()
    }

    private created() {
      let tempMenu = require(`../config/menu.json`);
      
      // let tempMenu: any[] | string | null = localStorage.getItem('menu')
      let user: any = localStorage.getItem('user')
      let showTitle: any = localStorage.getItem('title')
      let promise: string | null = localStorage.getItem('promise')
      if (user) {
        user = JSON.parse(user)
      } else {
        user = { id: 0, name: '' }
      }
      const tempPromise: string[] = promise ? JSON.parse(promise) : []
      let aMenu: any = tempMenu.filter((item: any) => {
          return tempPromise.findIndex((v: any) => v === item.name) !== -1
        })

      this.menu = JSON.parse(JSON.stringify(aMenu))
      this.user = JSON.parse(JSON.stringify(user))
      this.showTitle = showTitle 

      tempMenu = null
      user = null
    }

    private mounted() {
      if (process.env.NODE_ENV === 'development') {
        let div = document.createElement('div')
        div.style.cssText =
          "position: fixed; bottom: 0;left: 0;width: 50px;height: 50px;background: red;z-index: 1000;color: #fff;"
        div.innerHTML = '开发'
        document.body.appendChild(div)
      } else {
        if (process.env.VUE_APP_TITLE === 'test') {
          let div = document.createElement('div')
          div.style.cssText =
            "position: fixed; bottom: 0;left: 0;width: 50px;height: 50px;background: red;z-index: 1000;color: #fff;"
          div.innerHTML = '测试'
          document.body.appendChild(div)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-header {
    width: 100%;
    height: 60px;

    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 100;

    @include m-spacing('padding', 0, 40px, 0, 0);
    display: flex;
    flex-flow: row-reverse nowrap;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .2);

    img {
      margin-left: 24px;
      width: 72px;
      height: 50px;
    }
  }

  .el-container {
    min-height: 100vh;
  }

  .el-aside {
    background-color: #fff;

    .sf-menu {
      top: 0;
    }
  }

  .el-main {
    padding-top: 80px;

    background-color: #ebeef2;
    overflow: inherit;
  }
</style>
