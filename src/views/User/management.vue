<template>
  <div class="shelf">
    <div class="list-header">
      <h2 class="list-header-title">用户管理</h2>
      <!-- <div class="search-list shelt-search">
        <sf-search :search-source="searchSource" @search-result="onSearchResult"></sf-search>
      </div> -->
      <!-- <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAdd(-1)">新增用户</el-button>
      </div> -->
    </div>
     <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="name"
        label="用户名"
        width="120">
      </el-table-column>
      <el-table-column
        property="phone"
        label="手机号"
        width="120">
      </el-table-column>
      <el-table-column
        property="title"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        property="classs.name"
        label="部门"
        width="120">
      </el-table-column>
      <el-table-column
        property="roles"
        label="角色"
        width="120">
      </el-table-column>
      <el-table-column
        property="user_login.last_login_at"
        label="最后登录"
        width="250">
      </el-table-column>
      <el-table-column
        property="user_login.login_times"
        label="访问次数"
        width="100">
      </el-table-column>
      <el-table-column
        property="created_at"
        label="加入时间"
        width="250">
      </el-table-column>
      <el-table-column
        property="address"
        label="账号状态"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" class="bg-blue">已启用</span>
          <span v-if="scope.row.status == 2" class="bg-red">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        property="address"
        label="操作"
        width="420">
        <template slot-scope="scope">
          <span @click="related(scope.$index)" class="blue">关联客户</span>
          <span @click="editShelt(scope.$index)" class="blue ml-15">编辑</span>
          <span v-show="scope.row.status == 1" @click="changeStatus(scope.$index,1)" class="bg-red ml-15">禁用</span>
          <span v-show="scope.row.status == 2" @click="changeStatus(scope.$index,2)" class="bg-blue ml-15">启用</span>
        </template>
      </el-table-column>
    </el-table>
    <a-pagination ref="page" url="admin/ulist" @getData="getData"></a-pagination>
    <div class="Description">
      角色说明： </br>
      超管拥有所有菜单、操作及数据权限;</br>
      客服拥有挂架管理、交易管理、客户管理的操作及数据权限,已关联客户的客服只能看到关联客户的订单;</br>
      产品拥有基础数据、挂架管理及物流管理的操作及数据权限。
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

@Component
export default class User extends Vue {
  private title: any[] = ["#", "分类(中文)", "ID", "操作"];
  private tableData: any[] = [];
  private isEdit: boolean = false;
  private isSort: boolean = false;
  private searchStr: any = "";
  
  private async searchName(data?: any) {
    (this.$refs.page as any).page = 1;
    (this.$refs.page as any).getData(data ? {search: data} : '')
  }

  private getData(data: any) {
    this.tableData = data
  }
}
</script>
<style lang="scss" scoped>
  .shelf {
    background: #fff;
  }
  .shelt-title {
    background: #f6f6f6;
    height: 30px;
    line-height: 30px;
  }
  .shelt-title p {
    float: left;
    width: 9.5%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #606266;
  }
  .shelt-title p:first-child {
    width: 4%;
  }
  .shelt-title p:last-child {
    width: 10.5%;
  }
  .search-list {
    margin-left: 10px;
  }
  .clear {
    clear: both;
  }
  .list {
    background: #fff;
  }
  .list li {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    color: #606266;
  }
  .show-list .show-div {
    display: block;
    float: left;
    width: 10.5%;
    text-align: center;
  }
  .show-list .time-div {
    width: 12%;
  }
  .show-list .small-div {
    width: 6.5%;
  }
  .show-list div:first-child {
    width: 4%;
  }
  .show-list .action {
    width: 18.5%;
  }
  .show-list .show-div .el-input {
    width: 90%;
  }
  .el-input {
    width: 60%;
  }
  .block {
    margin: 10px 0;
    padding-left: 15px;
  }
  .block .el-input {
    width: 15%;
    margin: 0 20px;
  }
  .bg-blue {
    color: rgb(0, 204, 51);
  }
  .bg-red {
    color: red;
  }
  .btn-group {
    padding-left: 10px;
    background: #f6f6f6;
    height: 50px;
    line-height: 50px;
  }
  .list-header-title {
    font-size: 32px;
    font-weight: 400;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
  }
  .active {
    cursor: move;
  }
  .bg {
    position: fixed;
    background: #fff;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: 0.2;
    background: #808080;
  }
    
  .Description{
    margin-top: 60px;
    font-size: 12px;
    font-weight: 100;
    padding: 20px 0 0 20px ;
    background: #ebeef2;
  }
</style>
<style>
  .block .el-input .el-input__inner {
    height: 30px;
  }
  .related .el-input {
    width: 87%;
  }
  .el-transfer-panel__item .el-checkbox__input {
    left: 18px;
  }
  .el-transfer-panel__body {
    height: 290px;
  }
  .el-transfer-panel{
    width: 300px;
  }
  .el-transfer__buttons .el-button{
    display: block;
    width: 90px;
    margin-left: 0;
  }
  .el-popper {
    z-index: 99999 !important;
  }
  .blue {
    color: #409eff;
  }
  .el-transfer-panel__list .is-filterable {
    height: 230px;
  }
</style>