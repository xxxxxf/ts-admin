
<template>
  <div class="change-pw content-table">
    <el-row>
      <el-col :span="11">
        <span class="title">修改密码</span>
      </el-col>
    </el-row>
    <el-row class="main main-table">
      <el-col class="auto" :span="24">
        <div class="step">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="身份认证" class="step-title"></el-step>
            <el-step title="设置密码" class="step-title"></el-step>
            <el-step title="完成" class="step-title"></el-step>
          </el-steps>
        </div>
      </el-col>
      <el-col class="auto" v-show="isHidden === 1" :span="24">
        <div class="change-password-box">
          <div class="phone-bind">
            <div class="item-title">
              <span>
                <i class="is-sff-required">*</i>
                已绑定手机号
              </span>
            </div>
            <div>
              <el-input :value="mobile" disabled v-model="mobile" />
            </div>
          </div>
          <div>
            <div class="item-title">
              <span>
                <i class="is-sff-required">*</i>
                手机验证码
              </span>
            </div>
            <div class="main-table-item">
              <el-col :span="16">
                <el-input v-model="ver_code" @keyup.native.enter="submitStepOne"/>
              </el-col>
              <el-col :span="8" align="center" :class="{'get-code-btn':!show}" class="send-code">
                <span v-show="show" @click="getCode">获取验证码</span>
                <span v-show="!show">{{ count }} s</span>
              </el-col>
            </div>
          </div>
          <div class="submit">
            <el-button class="btn" size="mini" @click="submitStepOne">提交验证</el-button>
          </div>
        </div>
      </el-col>
      <el-col v-if="isHidden === 2" :span="24">
        <div class="change-mobile-box">
          <el-form
            ref="ruleForm"
            class="passwd"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="100px"
          >
            <i class="is-sff-required fl" style="margin:6px 5px 0 0">*</i>
            <el-form-item style="width:96%;margin-bottom: 20px;" class="fl" label="设置新密码" prop="pass">
              <el-input v-model="ruleForm.pass" type="password" show-password autocomplete="off" />
            </el-form-item>
            <i class="is-sff-required fl" style="margin:6px 5px 0 0">*</i>
            <el-form-item style="width:96%;margin-bottom: 20px;" class="fl" label="确认密码" prop="checkPass">
              <el-input
                v-model="ruleForm.checkPass"
                type="password"
                show-password
                autocomplete="off"
                @keyup.native.enter ="submit('ruleForm')"
              />
            </el-form-item>
            <div class="submit">
              <el-button class="btn" size="mini" @click="submit('ruleForm')">提交验证</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col v-if="isHidden === 3" :span="24">
        <div class="change-mobile-box">
          <div class="main-table-item success">
            <i class="el-icon-success" />
          </div>
          <div class="main-table-item success">
            <span>恭喜您，密码修改成功！</span>
          </div>
          <div class="submit">
            <el-button class="btn" size="mini" @click="submitStepthree">重新登陆</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  domain,
  client_id,
  client_secret,
  grant_type,
  scope
} from "@/config/config";
@Component
export default class Index extends Vue {
  private validatePass = (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback(new Error("请输入新密码"));
    } else if (!(/^.{6,18}$/.test(value))) {
      callback(new Error("请输入6-18位,支持纯数字,纯字母或组合"));
    } else {
      callback();
    }
  };
  private validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== this.ruleForm.pass) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  };
  private step: number = 1;
  private active: number = 0;
  private show: boolean = true;
  private isShow: boolean = false;
  private timer: any = null;
  private ver_code: string = "";
  private isHidden: number = 1;
  private mobile: any = "";
  private newMobile: any = "";
  private newCode: any = "";
  private time: number = 120;
  private count: number = 120;
  private ruleForm: any = {
    pass: "",
    checkPass: ""
  };
  private rules: any = {
    pass: [{ validator: this.validatePass, trigger: "blur" }],
    checkPass: [{ validator: this.validatePass2, trigger: "blur" }]
  };
  private async created() {
    let phone = window.localStorage.getItem("phone");
    console.log(typeof phone, "phone---");
    this.mobile = phone;
  }
  // 获取验证码
  private async getCode() {
    window.$imageStabilization( async () => {
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/user/modify-self-phone",
        {
          body: {
            phone: this.mobile,
            number: 1
          }
        }
      );
      this.show = false;
      this.timer = setInterval(() => {
        this.count--;
        if (this.count === 0) {
          this.show = true;
          this.count = 120;
        }
      }, 1000);
    })
  }
  // 发送验证码
  private async sendCode() {
    window.$imageStabilization( async () => {
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/user/modify-self-phone",
        {
          body: {
            phone: this.newMobile,
            number: 2
          }
        }
      );
      this.isShow = false;
      this.timer = setInterval(() => {
        this.time--;
        if (this.time === 0) {
          this.isShow = true;
          this.time = 120;
        }
      }, 1000);
    })
    
  }
  // 提交验证
  private async submitStepOne() {
    window.$imageStabilization( async () => {
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/user/check-self-phone",
        {
          body: {
            phone: this.mobile,
            number: 1,
            code: this.ver_code
          }
        }
      );
      this.isHidden = 2;
      this.active = 1;
      this.isShow = true;
    })
    
  }
  // 第二次提交(新手机号)
  private async submit() {
    window.$imageStabilization( async () => {
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/user/modify-self-pass",
        {
          body: {
            pass: this.ruleForm.pass,
            repeat_pass: this.ruleForm.checkPass,
            phone: this.mobile
          }
        }
      );
      this.isHidden = 3;
      this.active = 2;
      this.isShow = false;
    })
  }
  // 重新登录
  private async submitStepthree() {
    this.handleLogout()
  }
  private handleLogout(): void {
      let _this = this;
      async function  logout() {
          let result: any = await  window.$request.post('adminapi/login/logout' ,  {
           
          })
          // if (result.code === 0) {
          //   return Promise.reject();
          // }
          window.token = null;
          localStorage.clear();
          _this.$router.push('/login');
      }
    
     
      logout()
    }
}
</script>

<style lang="scss" scoped>
.change-pw {
  .title {
    line-height: 50px;
    font-size: 16px;
    color: #181721;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:550;
  }
  .step-title >>> .el-step__title {
    font-size: 12px;
  }
  .main {
    background-color: #fff;
    // margin: 0 15px;
  }
  .change-password-box,
  .change-mobile-box {
    width: 306px;
    margin: 0 auto;
    font-size: 12px;
    display: flex;
    flex-direction: column;
  }

   .submit {
    width: 100%;
    margin: 20px auto;
    .btn {
      background: rgba(10,80,167,1);
      color: #fff;
      width: 100%;
      border-radius: 5px;
      height: 32px;
    }
  }
  .main-table-item {
    margin-bottom: 24px;
    .item-title {
      text-align: left;
      width: 100px;
    }
  }
  .send-code {
    border-left: 0;
    margin-left: -1px;
    z-index: 2;
    text-align: center;
    color: #fff;
    background-color: rgba(10,80,167,1);
    cursor: pointer;
    border-radius: 5px;
    user-select: none;
  }
  .el-input__inner:focus {
    outline: none;
    border-color: #dfe4ed;
  }
  .get-code-btn {
    border-color: #dfe4ed;
    background-color: #f5f7fa;
    color: #5c5c6e;
    margin-left: 0px;
  }
  .check {
    color: #11b95c;
    margin: 14px auto;
    font-size: 4em;
  }
  .text {
    display: block;
    width: 100%;
    text-align: center;
  }
  .step {
    width: 600px;
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;
    .el-step__title {
      font-size: 14px;
    }
  }
  .passwd {
    .el-input--medium .el-input__inner {
      box-sizing: border-box;
      width: 230px;
    }
    .el-form-item--medium .el-form-item__content {
      width: 230px;
    }
  }
  .el-input--medium .el-input__icon {
    line-height: 32px;
  }
  .el-form-item--medium .el-form-item__label {
    line-height: 32px;
    color: #5c5c6e;
    font-weight: 400;
    font-size: 12px;
  }
}
.main-table-item {
  display: flex;
}
.content-table .main-table {
  line-height: 30px;
  color: #5c5c6e;
}
.change-password-box .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.content-table .main-table .main-table-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 10px;
}
.change-mobile .success {
  text-align: center;
}
.el-icon-success {
  color: #67c23a;
  font-size: 24px;
  margin: 0 auto;
}
.success {
  text-align: center !important;
  span {
    font-size: 14px;
    line-height: 32px;
    margin: 0 auto;
  }
}
.content-table{
  width: 900px;
  height: 640px;
  margin: 0 auto;
  background: #fff;
}
.phone-bind{
  display: flex;
  margin-bottom: 10px;
  flex-direction: column;
}
.auto{
  margin: 0 auto;
}
.el-row{
  background: #ebeef2;
}
.is-sff-required{
  color: red;
}
.fl{
  float: left;
}

</style>
<style lang="scss">
  .change-password-box .el-input__inner, .change-mobile-box .el-input__inner{
    height: 32px;
  }
  .el-form-item__label{
    text-align: left;
  }
</style>

