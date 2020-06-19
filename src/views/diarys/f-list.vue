<template>
  <div class="shelf">
    <div class="list-header">
      <h2 class="list-header-title">反馈管理</h2>

      <div class="block">
        <span>分类</span>
        <el-input v-model="searchStr" placeholder="请输入内容" @keyup.enter.native="searchName(searchStr)"></el-input>
        <el-button type="primary" size="mini" @click="searchName(searchStr)">搜索</el-button>
      </div>
    </div>
    <div class="shelt-title">
      <p v-for="(oItem,oIndex) in title" :key="oIndex">{{oItem}}</p>
      <div class="clear"></div>
    </div>
    <ul class="list" :id="isSort ? 'list' : ''">
      <li v-for="(item,index) in tableData" :key="index" :class="isSort ? 'active' : ''">
        <div class="show-list">
          <div class="show-div">{{index+1}}</div>
          <div class="show-div">
            <span v-show="!item.isEdit">{{ item.name }}</span>
            <el-input v-model="item.name" class v-show="item.isEdit" size="mini" />
          </div>
          <div class="show-div">
            <span v-show="!item.isEdit">{{ item.id }}</span>
            <el-input v-model="item.name" class v-show="item.isEdit" size="mini" />
          </div>
          <div class="action show-div">
            <b v-show="!item.isEdit">编辑</b>
            <b v-show="!item.isEdit">删除</b>
          </div>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </li>
      <div class="clear"></div>
    </ul>
    <a-pagination ref="page" url="admin/shici" @getData="getData"></a-pagination>
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
import Sortable from "sortablejs";

@Component
export default class App extends Vue {
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
}
.shelt-title p {
  float: left;
  width: 24%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}
.shelt-title p:first-child {
  width: 4%;
}
.clear {
  clear: both;
}
.list {
  background: #fff;
}
.list li {
  padding: 7px 0;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #606266;
}
.show-list .show-div {
  display: block;
  float: left;
  width: 24%;
  text-align: center;
}
.show-list div:first-child {
  width: 4%;
}
.show-list b {
  font-weight: normal;
  text-decoration: none;
  outline: none;
}
.action b {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
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
  padding-left: 15px;
  background: #f4f7fa;
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
</style>
<style>
.block .el-input .el-input__inner {
  height: 30px;
}
</style>