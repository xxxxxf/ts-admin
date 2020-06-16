<!--

  @Description: 登录页
  @Author: Owen
  @Date: 2019-06-11 17:53

-->

<template>
  <div id="login">
    <div class="login-sty">
      <div class="login-bg fl"></div>
      <div class="form-sty fl">
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="demo-loginForm">
          <div class="logo">
          </div>
          <div class="title">
            <span class="title-span">欢迎登录</span>
            <span class="title-system">百草坡后台管理系统</span>
          </div>
          <el-form-item class="phone" prop="username">
            <i class="iconfont iconren  el-input__suffix  icon"></i>
            <el-input style="width:85%" v-model="loginForm.username" placeholder="用户名/手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <i class="iconfont iconsuo el-input__suffix  icon"></i>
            <el-input
              style="width:85%"
              type="password"
              v-model="loginForm.password"
              placeholder="密码"
              show-password
              @keyup.native.enter="handleLogin('loginForm')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <div class="forget">
              <span class="forget-span" @click="forgetPassword(1)">忘记密码</span>
            </div> -->
            <el-button
              style="font-size:16px;"
              type="primary"
              class="login-btn"
              :disabled="loginText.includes('...')"
              @click="handleLogin('loginForm')"
            >{{ loginText }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="clear"></div>
    </div>
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
      return callback(new Error("请输入用户名或手机号"));
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
      // (this.$refs[formName] as any).validate((valid: any) => {
      //   if (valid) {
      //     this.submit();
      //   } else {
      //     return false;
      //   }
      // });
      this.$router.push('/Pylons/information')
    });
  }

  /**
   *
   * @description: 提交
   *
   */
  private menu = require('../config/menu.json')

  private async submit() {
    const { username, password } = this.loginForm;
    // this.loginText = "正在登录...";
    let result: any = await window.$request.post(
      `${domain}` + "/api/login/exists",
      {
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
      }
    );
    if (result.data.status_code !== 200 ) {
      this.loginText = "登录";
      return
    } else {
      this.loginText = "正在登录...";
    }
    let showTitle: string = result.data.title
    let adminFlag: boolean = false
    let limit: any[] = result.data.auth_limit 
    let ROLE: any = {
      admin: ['基础数据', '客户管理', '挂架管理', '交易管理', '物流管理', '系统管理'],
      sales: ['挂架管理', '交易管理', '客户管理'],
      product: ['基础数据', '挂架管理', '物流管理']
    }
    let except: string[] = []
    
    let allExcept: string[] = []
    limit.forEach(item => {
      allExcept = allExcept.concat(ROLE[item])
    })
    except = [...new Set(allExcept)]
    window.localStorage.setItem('promise', JSON.stringify(except))
    window.localStorage.setItem('title', showTitle)

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
    let user: any = {
      id: 0,
      name: username
    };
    const HOME_URL: string = "/";

    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("homeUrl", JSON.stringify(HOME_URL));

    return HOME_URL;
  }
  // private async forgetPassword(data: any) {
  //   // this.$router.push('/forgetPassword')
  //   this.$router.push(
  //    { path: "/forgetPassword"}
  //   )
  //   localStorage.setItem("forgetPassword", data);
  // }
}
</script>

<style lang="scss">
#login {
  height: 100vh;
  // background-image: url('../assets/images/logo-bg-b.png');
  background-repeat:no-repeat;
  background-size:100% 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  .icon {
    width: 40px;

    left: 0;
    z-index: 100;
  }

  .el-input__inner {
    text-indent: 25px;
    height: 32px;
  }

  .login-btn {
    width: 85%;
    background-color: #000;
    border: 1px solid #000;
    margin-top: 120px;
    height: 32px;
    line-height: 32px;
  }
}
 .el-form-item--feedback .el-input__validateIcon {
    display: none!important;
}
.el-form-item{
  margin: 0;
}
.forget{
  text-align: right;
}
.forget-span {
  display: inline-block;
  margin-right: 15%;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}
// 登录背景
.login-sty{
  width: 990px;
  height: 624px;
  margin: 0 auto;
}
.login-bg {
  width: 720px;
  height: 624px;
  // background-image: url('../assets/images/login-small.jpg')
}
.fl{
  float: left;
}
.clear{
  clear: both;
}
.form-sty{
  width: 270px;
  height: 624px;
  background: #2447A1;
}
.logo{
  width: 100%;
  height: 150px;
  // background-image: url('../assets/images/logo.svg');
  background-size:180px 80px;
  background-repeat:no-repeat;
}
.el-form{
  padding-left: 32px;
}
.title-span{
  font-size: 24px;
  color: #fff;
}
.title-system{
  margin-top: 15px;
  margin-bottom: 40px;
  font-size: 16px;
  color: #fff;
}
.el-input{
  width: 100%;
}
.phone{
  margin-bottom: 16px;
}
#login .el-button{
  padding: 0;
}

</style>
