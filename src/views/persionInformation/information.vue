
<!--
 * @Description: 个人信息
 * @Author: xiao fei
 * @Date: 2019-07-05 11:23:48
 * @LastEditTime: 2019-07-24 19:44:43
 * @LastEditors: Againss
 -->

<template>
  <div class="app-container content-table">
    <div class="heard-table">
      <el-row :gutter="20">
        <el-col :span="8">
          <h2 class="heard-table-title">个人信息</h2>
        </el-col>
        <el-col :span="16">
          <div class="heard-table-btn-group heard-table-title " >
            <el-button type="primary" v-if="!lock" size="small" @click.native="savaEvt">提交</el-button>
            <el-button type="primary" v-else size="small" @click.native="editEvt">修改</el-button>
            <el-button type="info" v-if="!lock" size="small" @click.native="cancelEvt">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="main-table" :class="{'main-table-disabled':lock}">
      <el-row>
        <el-col :span="24">
          <div class="main-table-item">
            <span class="item-title">
              <i v-if="!lock" :class="{'red':!lock,'no-required':lock}">*</i>用户名
            </span>
            <el-input v-model="userInfo.name" class="item-input" :disabled="lock"></el-input>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="main-table-item user-info">
            <span class="item-title">
              <i v-if="!lock" :class="{'red':!lock,'no-required':lock}">*</i>手机号
            </span>
            <el-input v-model="userInfo.phone" class="item-input item-input-disabled" disabled></el-input>
            <span @click="updateMobile" class="modify">修改</span>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="main-table-item user-info">
            <span class="item-title">
              <i v-if="!lock" :class="{'red':!lock,'no-required':lock}">*</i>密&nbsp;&nbsp;&nbsp;码
            </span>
            <el-input value="******" type="password" class="item-input item-input-disabled" disabled></el-input>
            <span @click="updatePassword" class="modify">修改</span>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="main-table-item">
            <span class="item-title">
              <i v-if="!lock" :class="{'red':!lock,'no-required':lock}">*</i>姓&nbsp;&nbsp;&nbsp;名
            </span>
            <el-input v-model="userInfo.title" class="item-input" :disabled="lock"></el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <h5 class="hint">温馨提示：已绑定手机号无法使用时，请联系管理员修改手机号或密码。</h5>
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

@Component
export default class User extends Vue {
  private lock: boolean = true
  private userInfo: any = {
    username: '',
    mobile: '',
    name: ''
  } 
  private created() {
    this.getData();
  }
  private async getData() {
    const result = await window.$request({
      url: `${domain}` + "/adminapi/user/admin-user-info"
    });
    this.userInfo = result.data.data
    // 将手机号码存起来，修改手机号时取缓存的手机号
    window.localStorage.setItem('phone', this.userInfo.phone)
  }
  // 修改
  private editEvt() {
    this.lock = false
  }
  // 保存
  private async savaEvt() {
    let result: any = await window.$request.put(
      `${domain}` + "/adminapi/user/modify-self-info",
      {
        body: {
          name: this.userInfo.name, // 用户名
          title: this.userInfo.title, // 姓名
        },
        isExportFail: true
      }
    );
    if (result.data.status_code !== 200) {
      this.lock = false
    } else {
      window.$message({
          message: result.data.message,
          type: "success"
        });
      this.getData();
      this.lock = true
    }
  }
  // 取消
  private cancelEvt() {
    this.lock = true
    this.getData();
  }
  // 修改手机
  private updateMobile() {
    this.$router.push(`/changeMobile`)
  }
  // 修改密码
  private updatePassword() {
    this.$router.push(`/changePassword`)
  }
  
}
</script>

 <style lang="scss" >
.app-container {
  padding: 0 0 20px 15px;
  .heard-table-title{
    height: 47px;
    line-height: 47px;
    font-size: 16px;
    color: #25262e;
    font-weight: 400;
  }
  .pop-up >>> .el-input__inner {
    width: 400px;
    color: #5c5c6e;
  }
  .hint {
    margin: 30px;
    font-size: 12px;
    font-weight: 100;
    padding: 0;
  }
  .line {
    width: 60%;
    border-top: 1px solid #dcdfe6;
  }
  .main-table{
    padding: 20px;
    background: #fff;
  }
  .cur-p {
    cursor: pointer;
  }
  .sff-code {
    margin-left: 10px;
  }
  .main-table-item {
    margin-bottom: 24px;
    .item-title {
      text-align: left;
      width: 50px;
      font-size: 14px;
      color: #5c5c6e;
    }
  }
  .main-table .main-table-item .item-input {
    width: 270px!important;
  }
  .item-input{
    height: 32px;
    border-radius: 2px;
    color: #5c5c6e;
    padding-left: 15px;
    padding-right: 15px;
  }
  .red{
    color: red;
  }
  .modify{
    cursor: pointer;
    color: #1890ff;
    font-size: 14px;
  }
}
.el-button--small{
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
}
</style>

