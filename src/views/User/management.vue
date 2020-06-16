<template>
  <div class="shelf">
    <div class="list-header">
      <h2 class="list-header-title">用户管理</h2>
      <div class="search-list shelt-search">
        <sf-search :search-source="searchSource" @search-result="onSearchResult"></sf-search>
      </div>

      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAdd(-1)">新增用户</el-button>
      </div>
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
    <sf-pagination :url="url" @get-list="getPaginationList"></sf-pagination>
    <div class="bg" v-if="isAddFlag"></div>
    <div class="add-user" v-if="isAddFlag">
      <div class="add-title">
        <div class="title-div">新增用户</div>
        <span class="fl" @click="closeAdd"><i style="height:25px;margin:10px 10px 0 0" class="iconfont el-input__suffix icondanjiantouxia icon"></i></span>
        <div class="clear"></div>
      </div>
      <div class="user-message">
        <ul class="add-left fl">
          <li class="fl">
            <span>
              <span class="red">*</span>手机号
            </span>
          </li>
          <li class="fl">
            <span>用户名</span>
          </li>
          <li class="fl">
            <span>
              <span class="red">*</span>姓名
            </span>
          </li>
          <li class="fl">
            <span class="red">*</span><span>部门</span>
          </li>
          <li class="fl">
            <span class="red">*</span><span>角色</span>
          </li>
        </ul>
        <ul class="add-right fl">
          <li>
            <el-input v-model="phone" placeholder="请输入手机号"></el-input>
          </li>
          <li>
            <el-input v-model="roleName" placeholder="请输入用户名"></el-input>
          </li>
          <li>
            <el-input v-model="roleTitle" placeholder="请输入姓名"></el-input>
          </li>
          <!-- 部门 -->
          <li>
            <el-select v-model="editdepartmentId" placeholder="请选择">
              <el-option
                v-for="item in departmentNameArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <!-- 角色 -->
          <li>
            <el-select v-model="roleID" multiple placeholder="请选择">
              <el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </li>
        </ul>
        <div class="clear"></div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="saveAdd">提交并发送短信</el-button>
        <el-button type="info" style="margin-left:30px;" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="bg" v-if="isEditFlag"></div>
    <div class="add-user" v-if="isEditFlag">
      <div class="add-title">
        <div class="title-div">编辑用户</div>
        <span class="fl" @click="closeAdd"><i style="height:25px;margin:10px 10px 0 0" class="iconfont el-input__suffix icondanjiantouxia icon"></i></span>
        <div class="clear"></div>
      </div>
      <div class="user-message">
        <ul class="add-left fl">
          <li class="fl">
            <span>
              <span class="red">*</span>手机号
            </span>
          </li>
          <li class="fl">
            <span>用户名</span>
          </li>
          <li class="fl">
            <span>
              <span class="red">*</span>姓名
            </span>
          </li>
          <li class="fl">
            <span class="red">*</span><span>部门</span>
          </li>
          <li class="fl">
            <span class="red">*</span><span>角色</span>
          </li>
        </ul>
        <ul class="add-right fl">
          <li>
            <el-input
              v-model="getEdit.phone"
              placeholder="请输入手机号"
              :value="getEdit.phone ? getEdit.phone : ''"
            ></el-input>
          </li>
          <li>
            <el-input
              v-model="getEdit.name"
              placeholder="请输入用户名"
              :value="getEdit.name ? getEdit.name : ''"
            ></el-input>
          </li>
          <li>
            <el-input
              v-model="getEdit.title"
              placeholder="请输入姓名"
              :value="getEdit.title ? getEdit.title : ''"
            ></el-input>
          </li>
          <!-- 部门 -->
          <li>
            <el-select v-model="editdepartmentId" placeholder="请选择">
              <el-option
                v-for="item in departmentNameArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <!-- 角色 -->
          <li>
            <el-select v-model="getEdit.role_ids" multiple placeholder="请选择">
              <el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </li>
        </ul>
        <div class="clear"></div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="editSave">提交并发送短信</el-button>
        <el-button type="info" style="margin-left:30px;" @click="Editreset">重置</el-button>
      </div>
    </div>
    <div class="bg" v-if="relatedFlag"></div>
    <div class="related" v-if="relatedFlag">
      <div class="related-title">
        <div>客户关联信息</div>
        <span class="fl" @click="cancelRelated"><i style="height:25px;margin:0 10px 0 0" class="iconfont el-input__suffix icondanjiantouxia icon"></i></span>
      </div>
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="value"
          filterable
          :right-default-checked=this.valueArr
          :titles="['选择客户', '已选客户']"
          :button-texts="['移出', '移入']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="data"
        >
          <el-button class="transfer-footer" slot="right-footer" type="primary" @click="saveRelated()">保存</el-button>
        </el-transfer>
      </div>
    </div>
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
  private tableData: any[] = [];
  private url: string = `${domain}/adminapi/user/admin-index`;
  private searchStr: any = "";
  private phone: any = "";
  private roleName: any = "";
  private roleTitle: any = "";
  private departmentName: any = "";
  private department: any[] = [];
  private role: any[] = [
    { id: 1, name: "超管" },
    { id: 2, name: "客服" },
    { id: 3, name: "产品" },
    // { id: 4, name: "普通用户" }
  ];
  private roleID: any[] = [];
  // 关联客户弹窗
  private relatedFlag: boolean = false;
  private created() {
    // this.getData();
  }
  // 搜索条件配置
  private searchSource: any[] = [
    {
      type: "String",
      label: "手机号",
      attribute: "phone"
    },
    {
      type: "String",
      label: "用户名",
      attribute: "name"
    },
    {
      type: "String",
      label: "姓名",
      attribute: "title"
    }
  ];
  // 搜索
  onSearchResult(url: any) {
    this.handleSearch(url);
  }
  // 点击搜索方法
  private async handleSearch(url?: any) {
    console.log("");
  }
  private isAddFlag: boolean = false;
  private isEditFlag: boolean = false;
  private editroleID: string[] = [];
  private departmentId: string[] = [];
  private departmentNameArr: any[] = [];
  private editdepartmentId: string = "";

  private getEdit: any = "";
  //   新建
  private async handleAdd(index: number) {
    this.isAddFlag = true;
    const result = await window.$request({
      url: `${domain}` + "/adminapi/user/show-class"
    });
    this.departmentId = result.data.data;
    this.departmentNameArr = [];
    this.departmentId.forEach((v: any, k: number) => {
      this.departmentNameArr.push({
        name: v.name,
        id: v.id
      });
    });
  }
  // 编辑
  private async editShelt(index: number) {
    const result = await window.$request({
      url: `${domain}` + "/adminapi/user/show-class"
    });
    this.departmentId = result.data.data;
    this.departmentNameArr = [];
    this.departmentId.forEach((v: any, k: number) => {
      this.departmentNameArr.push({
        name: v.name,
        id: v.id
      });
    });
    this.editdepartmentId = this.tableData[index].class_id;
    this.isEditFlag = true;
    this.getEdit = this.tableData[index];
  }
  // 编辑重置
  private Editreset() {
    this.getEdit.class_id = "";
    this.getEdit.name = "";
    this.getEdit.phone = "";
    this.getEdit.title = "";
    this.getEdit.role_ids = [];
    this.editdepartmentId = "";
  }
  // 编辑提交
  private async editSave() {
    // 通过正则表达式判断手机号码格式是否正确,根据电信，联通、移动手机号码规则可以到以下正则
    // 手机号码第一位是[1]开头，第二位[3,4,5,7,8]中的一位，第三位到第十一位则是[0-9]中的数字；
    // ^1表示开头为1
    // [3|4|5|7|8] 表示3、4、5、7、8中的一位数值
    // [0-9]{9} 匹配包含0-9的数字
    window.$imageStabilization( async () => {
      let reg = /^1[3|4|5|7|8][0-9]{9}/;
      if (reg.test(this.getEdit.phone)) {
        console.log("手机号码正确");
      } else {
        window.$message({
          showClose: true,
          message: "手机号码不正确!",
          type: "warning"
        });
        return;
      }
      // 判断姓名 空|空格|换行
      if (this.getEdit.title.match(/^\s*$/)) {
        window.$message({
          showClose: true,
          message: "请输入姓名!",
          type: "warning"
        });
        return;
      }
      // 部门和角色做必填限制
      if (this.getEdit.class_id === "") {
        window.$message({
          showClose: true,
          message: "请选择部门!",
          type: "warning"
        });
        return;
      }
      if (this.getEdit.role_ids.length <= 0) {
        window.$message({
          showClose: true,
          message: "请选择角色!",
          type: "warning"
        });
        return;
      }
      let result: any = await window.$request.put(
        `${domain}` + "/adminapi/user/update-admin-user",
        {
          body: {
            name: this.getEdit.name, // 用户名
            phone: parseInt(this.getEdit.phone, 10), // 手机号
            class_id: this.editdepartmentId, // 部门
            title: this.getEdit.title, // 姓名
            roles: this.getEdit.role_ids, // 角色
            id: this.getEdit.id
          },
          isExportFail: true
        }
      );
      if (result.data.status_code !== 200) {
        window.$message({
          message: result.data.message,
          type: "error"
        });
      } else {
        window.$message({
          message: result.data.message,
          type: "success"
        });
        this.isAddFlag = false;
        this.isEditFlag = false;
        this.getData();
        this.reset();
      }
    })
    
  }
  // 分页组件重新获取数据
  private async getPaginationList(data: any) {
    this.tableData = data.response.data;
  }
  private async getData() {
    const result = await window.$request({
      url: `${domain}` + "/adminapi/user/admin-index?page=1&per_page=20"
    });
    this.tableData = result.data.data.data;
  }
  // 新增提交
  private async saveAdd() {
    // 通过正则表达式判断手机号码格式是否正确,根据电信，联通、移动手机号码规则可以到以下正则
    // 手机号码第一位是[1]开头，第二位[3,4,5,7,8]中的一位，第三位到第十一位则是[0-9]中的数字；
    // ^1表示开头为1
    // [3|4|5|7|8] 表示3、4、5、7、8中的一位数值
    // [0-9]{9} 匹配包含0-9的数字
    window.$imageStabilization( async () => {
      let reg = /^1[3|4|5|7|8][0-9]{9}/;
      if (reg.test(this.phone)) {
        console.log("手机号码正确");
      } else {
        window.$message({
          showClose: true,
          message: "手机号码不正确!",
          type: "warning"
        });
        return;
      }
      // 判断姓名 空|空格|换行
      if (this.roleTitle.match(/^\s*$/)) {
        window.$message({
          showClose: true,
          message: "请输入姓名!",
          type: "warning"
        });
        return;
      }
      // 部门和角色做必填限制
      if (this.editdepartmentId === "") {
        window.$message({
          showClose: true,
          message: "请选择部门!",
          type: "warning"
        });
        return;
      }
      if (this.roleID.length <= 0) {
        window.$message({
          showClose: true,
          message: "请选择角色!",
          type: "warning"
        });
        return;
      }
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/user/add-admin-user",
        {
          body: {
            name: this.roleName, // 用户名
            phone: parseInt(this.phone, 10), // 手机号
            class_id: this.editdepartmentId, // 部门
            title: this.roleTitle, // 姓名
            roles: this.roleID // 角色
          },
          isExportFail: true
        }
      );
      if (result.data.status_code !== 200) {
        window.$message({
          message: result.data.message,
          type: "error"
        });
      } else {
        window.$message({
          message: result.data.message,
          type: "success"
        });
        this.isAddFlag = false;
        this.getData();
        this.reset();
      }
    })
    
  }
  // 重置
  private async reset() {
    this.phone = "";
    this.roleName = "";
    this.roleTitle = "";
    this.editdepartmentId = "";
    this.roleID = [];
  }
  private closeAdd() {
    this.isAddFlag = false;
    this.isEditFlag = false;
    this.getData();
    this.reset();
  }

  private label: string = "";

  private data: any[] = [];
  private selectData: string[] = [];
  private value: any[] = [];
  private valueArr: any[] = [];
  private relatedAll: any[] = [];

  private relateId: string = '' // 点击管理时获取点击的id，在获取关联客户信息或者保存时都用到
  // 关联客户
  private async related(index: number) {
    this.valueArr = []
    this.value = []
    this.relateId = this.tableData[index].id;
    const result = await window.$request({
      url: `${domain}` + "/adminapi/customer/" + `${this.relateId}`
    });
    this.relatedAll = result.data.data.data
    let generateData = () => {
      const data: any[] = [];
      result.data.data.data.forEach((v: any, k: number) => {
        if (v.status === 2) {
          this.valueArr.push(k)  // 将status=2的所有数据的下标存入数组
        }
        data.push({
          key: k,
          label: `${v.name}` + '(' + `${v.title}` +  ')' + "-" + `${v.from_type}`,
          disabled: v.status === 1
        });
      });
      this.value = this.valueArr  // 赋值，value为右侧已关联的客户显示
      return data;
    }

    this.relatedFlag = true;
    this.data = generateData();
  }
  // 保存关联选择
  private customer: string[] = []
  private async saveRelated() {
    window.$imageStabilization( async () => {
      this.customer = []
      this.relatedAll.forEach((v: any, k: number) => {
        this.value.forEach((item) => {
          if (k === item) {
            this.customer.push(v.id)
          }
        })
      })
      let result: any = await window.$request.put(
        `${domain}` + "/adminapi/customer/" + `${this.relateId}`,
        {
          body: {
            customer: this.customer,
          }
        }
      );
      window.$message({
        message: "关联客户成功",
        type: "success"
      });
    })
    this.relatedFlag = false;
  }
  // 关联窗口取消
  private cancelRelated() {
    this.relatedFlag = false;
    this.valueArr = []
    this.value = []
  }
  // 启用禁用
  private async changeStatus(index: any, type: any) {
    const confirm = window.$confirm;
    if ( type === 1) {
      confirm("确定禁用该条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
      let changestatus: any = 0;
      // if (type === 1) {
      changestatus = 2;
      // } else if (type === 2) {
      //   changestatus = 1;
      // }
      let result: any = await window.$request.put(
        `${domain}` + "/adminapi/user/modify-admin-status",
        {
          body: {
            id: this.tableData[index].id,
            status: changestatus
          }
        }
      );
      window.$message({
        message: "禁用成功",
        type: "success"
      });
      this.getData();
    });
    } else {
      confirm("确定启用该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
      let changestatus: any = 0;
      // if (type === 1) {
      //   changestatus = 2;
      // } else if (type === 2) {
      changestatus = 1;
      // }
      let result: any = await window.$request.put(
        `${domain}` + "/adminapi/user/modify-admin-status",
        {
          body: {
            id: this.tableData[index].id,
            status: changestatus
          }
        }
      );
      window.$message({
        message: "启用成功",
        type: "success"
      });
      this.getData();
    });
    }
    
  }
  private handleCurrentChange(val: any) {
    console.log('test');
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
.add-user {
  position: fixed;
  top: 20%;
  right: 20%;
  bottom: 20%;
  left: 33%;
  z-index: 9999;
  width: 600px;
  height: 420px;
  background: #fff;
  border:1px solid #ddd;
}
.add-title {
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
}
.add-title .title-div {
  font-size: 18px;
  line-height: 1;
  color: #303133;
  float: left;
  padding: 15px 15px 10px;
  width: 84%;
}
.add-title span {
  display: inline-block;
  width: 10%;
  text-align: center;
  height: 25px;
  line-height: 25px;
  margin-top: 10px;
  cursor: pointer;
}
.add-left {
  width: 20%;
  margin-left: 15px;
}
.add-left li {
  width: 100%;
  height: 38px;
  line-height: 38px;
  margin-top: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
.add-right {
  width: 70%;
}
.add-right li {
  width: 100%;
  margin-top: 10px;
}
.fl {
  float: left;
}
.clear {
  clear: both;
}
.add-right .el-input {
  width: 95%;
}
.btn {
  margin: 25px 0 0 160px;
}
.red {
  color: red;
}
.el-select {
  width: 95%;
}
.related {
  position: fixed;
  top: 20%;
  right: 20%;
  bottom: 20%;
  left: 27%;
  z-index: 9999;
  width: 800px;
  height: 500px;
  background: #fff;
  border: 1px solid #ddd;
}
.related-title {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}
.related-title div{
  width: 88%;
  float: left;
  font-size: 16px;
  padding-left: 2%;
}
.related-title span{
  display: block;
  width: 5%;
  height: 100%;
  float: right;
  text-align: center;
  cursor: pointer;
}
.transfer-footer {
    margin-left: 20px;
    padding: 8px 10px;
  }
  .user-message{
    width: 400px;
    margin: auto;
  }
  .select-li{
    background: #808080;
  }
  .ml-15{
    display: inline-block;
    margin-left: 15px;
  }
  .cell span{
    cursor: pointer;
  }
  .Description{
    margin-top: 35px;
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