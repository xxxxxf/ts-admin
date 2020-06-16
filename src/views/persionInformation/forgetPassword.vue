<!--

  @Description: 登录页
  @Author: Owen
  @Date: 2019-06-11 17:53

-->

<template>
  <div id="information">
    <el-form
      :model="informationForm"
      status-icon
      :rules="rules"
      ref="informationForm"
      class="demo-loginForm"
    >
      <h1 class="title">忘记密码</h1>
      <el-form-item prop="username">
        <i class="iconfont iconren el-input__suffix icon"></i>
        <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <i class="iconfont iconsuo el-input__suffix icon"></i>
        <el-input
          type="password"
          v-model.number="loginForm.password"
          placeholder="密码"
          show-password
          @keyup.native.enter="handleLogin('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="login-btn"
          :disabled="loginText.includes('...')"
          @click="handleLogin('loginForm')"
        >{{ loginText }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import {
  domain,
  client_id,
  client_secret,
  grant_type,
  scope
} from "@/config/config";
import loginModule from "@/api/login.api";

interface LoginFormType {
  [propName: string]: string;
}

@Component
export default class LoginApi extends Vue {
  /**
   *
   * @description: 登录文本
   *
   */

  loginText: string = "登录";

  /**
   *
   * @description: 校验密码
   *
   */

  private checkPassword = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error("请输入密码"));
    }

    callback();
  };

  /**
   *
   * @description: 校验用户名
   *
   */

  private checkUsername = (rule: any, value: any, callback: any) => {
    if (value === "") {
      return callback(new Error("请输入用户名"));
    }

    callback();
  };

  /**
   *
   * @description: 表单数据
   *
   */

  private loginForm: LoginFormType = {
    username: "",
    password: ""
  };

  /**
   *
   * @description: 校验规则
   *
   */

  private rules: any = {
    username: [{ validator: this.checkUsername, trigger: "blur" }],
    password: [{ validator: this.checkPassword, trigger: "blur" }]
  };

  /**
   *
   * @description: 点击登录按钮时判断规则是否成立
   *
   */

  private handleLogin(formName: string): void {
    window.$imageStabilization(() => {
      (this.$refs[formName] as any).validate((valid: any) => {
        if (valid) {
          this.submit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    });
  }

  /**
   *
   * @description: 提交
   *
   */

  private async submit() {
    const { username, password } = this.loginForm;
    this.loginText = "正在登录...";
    let result: any = await window.$request.post(`${domain}` + "/api/", {
      body: {
        username,
        password,
        user_type: 2,
        login_type: 1,
        from_type: 1
      },
      isToken: false,
      isLoading: false,
      isExportFail: true
    });
    if (result.code === 0) {
      this.loginText = "登录";
      return Promise.reject();
    }
    const token = await this.handleToken();
    const url = await this.handleAccount(token);
    this.$router.push(url);
  }
  /**
   *
   * @description: 生成 token 接口
   *
   */

  private async handleToken() {
    const { username, password } = this.loginForm;
    const result: any = await window.$request.post(
      `${domain}${loginModule.token}`,
      {
        body: {
          client_id: 2,
          client_secret,
          grant_type,
          scope: "*",
          username,
          password,
          user_type: 2,
          login_type: 1
        },
        isToken: false,
        isLoading: false,
        isExportFail: true
      }
    );

    if (result.code === 0) {
      this.loginText = "登录";
      return Promise.reject();
    }

    window.token = result.data && result.data.access_token;

    return window.token || "";
  }

  /**
   *
   * @description: 获取登录信息
   *
   */

  private async handleAccount(token: string) {
    const { username } = this.loginForm;
    // const accountResult: any = await window.$request({
    //   url: `${loginModule.account}`,
    //   isLoading: false,
    //   isExportFail: true
    // })

    // if (accountResult.code === 0) {
    //   this.loginText = '登录'
    //   return Promise.reject()
    // }

    // let userData: any = accountResult.data.data.user_data || {}
    // // let menuData: any = accountResult.data.data.menu_data || []
    let user: any = {
      id: 0,
      name: username
    };
    // let menu: any = []
    const HOME_URL: string = "/";

    // menuData.map((oItem: any, index: number) => {
    //   menu.push({
    //     name: oItem.name,
    //     href: oItem.url,
    //     icon: oItem.icon,
    //     list: []
    //   })

    //   oItem.list.map((tItem: any) => {
    //     menu[index].list.push({
    //       name: tItem.name,
    //       href: tItem.url,
    //       list: []
    //     })
    //   })
    // })

    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    // localStorage.setItem('menu', JSON.stringify(menu))
    localStorage.setItem("homeUrl", JSON.stringify(HOME_URL));

    // user = null
    // menu = null

    return HOME_URL;
  }
}
</script>

<style lang="scss">
#login {
  height: 100vh;

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  .el-form {
    width: 430px;
    height: 400px;

    box-sizing: border-box;
    padding: 40px;

    background-color: #fff;
    box-shadow: 0 0 30px #eee;
  }

  .title {
    height: 84px;

    line-height: 84px;
    text-align: center;
    font-weight: 400;
    font-size: 26px;
    color: #000;
  }

  .el-form-item__content {
    margin-top: 20px;
  }

  .icon {
    width: 40px;

    left: 0;
    z-index: 100;
  }

  .el-input__inner {
    text-indent: 25px;
  }

  .login-btn {
    width: 100%;
  }
}
.el-form-item--feedback .el-input__validateIcon {
  display: none !important;
}
</style>
