<!--
 *
 * @Description: 客户信息 
 * @Author:张鹏
 * @Date: 2019-08-27 16:47
 *
-->
<template>
  <div class="customerManagement">
    <div class="list-header">
      <h2 class="list-header-title">客户信息</h2>
      <div class="searchClass">
        <sf-search :search-source="searchSource" />
      </div>
    </div>
    <div class="shelt-list">
      <div class="shelt-left">
        <div class="grid-content">客户列表</div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" highlight-current-row
          @row-click="rowClick">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column type="index" min-width="45%" />
          <el-table-column label="公司全称" min-width="80%" prop="company_name" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="客户" min-width="80%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-show="scope.row.status == 1" style="color:#00CC33;">启用</span>
              <span v-show="scope.row.status == 2" style="color:red;">禁用</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationClass">
          <sf-Pagination ref="pagination" :query="queryData" :url="pageUrl" @get-list="HDList" />
        </div>
      </div>
      <div class="shelt-right">
        <div class="btn-group">
          <el-button v-if="!isEdit" type="primary" size="mini" @click="handleAdd(true)">新增</el-button>
          <el-button v-if="isEdit" type="primary" size="mini" @click="handleSave">提交</el-button>
          <el-button v-if="isEdit" type="primary" size="mini" @click="handleCancel">取消</el-button>
          <el-button v-if="!isEdit" type="primary" size="mini" @click="handleAdd(false)">编辑</el-button>
        </div>
        <div class="rightBottom">
          <div class="grid-content border-b">
            客户基本信息
            <div class="fr">
              加入时间: {{created_at}}&nbsp;&nbsp; 最后时间: {{last_login_at}} &nbsp;&nbsp;访问次数：{{login_times}}
              &nbsp;&nbsp;状态：<span class="textStatus_g" v-show="order.status == 1">启用</span>
              <span class="textStatus_h" v-show="order.status == 2">禁用</span>
            </div>
          </div>

          <div class="comm-sty">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="main-table-item">
                  <span class="item-title">
                    <i>*</i>&nbsp;市场类型
                  </span>
                  <el-radio-group v-model="order.MarketType" size="small" class="radioGroup">
                    <el-radio-button :disabled="!isEdit" :value="'国内'" label="国内"></el-radio-button>
                    <el-radio-button :disabled="!isEdit" :value="'海外'" label="海外"></el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="main-table-item">
                  <span class="item-title"><i>*</i>&nbsp;公司全称</span>
                  <el-input :disabled="!isEdit" size="small" v-model.trim="order.FullNameOfcompany"
                    :value="order.FullNameOfcompany" placeholder="公司全称"></el-input>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="main-table-item">
                  <span class="item-title">
                    <i>*</i>&nbsp;客户
                  </span>
                  <el-input :disabled="!(isEdit && pdADDEdtor)" size="small" v-model.trim="order.custer"
                    :value="order.custer" placeholder="客户">
                  </el-input>

                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="main-table-item">
                  <span class="item-title">&nbsp;&nbsp;&nbsp;姓名</span>
                  <el-input :disabled="!isEdit" size="small" v-model.trim="order.name" :value="order.name"
                    placeholder="姓名">
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="main-table-item">
                  <span class="item-title">
                    <i>*</i>&nbsp;状态
                  </span>
                  <template>
                    <el-radio :disabled="!isEdit" v-model="order.status" label="1">启用</el-radio>
                    <el-radio :disabled="!isEdit" v-model="order.status" label="2">禁用</el-radio>
                  </template>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="main-table-item">
                  <span class="item-title">
                    客户名片
                  </span>
                  <span v-show="order.business_card">
                    <img :src="order.business_card" class="card-imgae" @click="showCardImage = true" />
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="grid-content purple border-b">
            收货地址
            <el-button class="zjButton" v-if="isEdit" icon="el-icon-plus" size="mini" @click="handleAddAddressList()">
            </el-button>
          </div>
          <el-table ref="multipleTable2" :data="receivingGoodsArray" tooltip-effect="dark" style="width: 100%">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column type="index" width="50" />
            <el-table-column :show-overflow-tooltip="true" label="收件人">
              <template slot="header">
                <i :class="{'is-sff-required':!isEdit,'no-required':isEdit}">*&nbsp;</i>收件人
              </template>
              <template slot-scope="scope">
                <span v-show="!isEdit">{{ scope.row.username?scope.row.username:'' }}</span>
                <input v-show="isEdit" v-enterBlank type="text" v-model="scope.row.username" class="input-text-details"
                  onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="收件人手机">
              <template slot="header">
                <i :class="{'is-sff-required':!isEdit,'no-required':isEdit}">*&nbsp;</i>收件人手机
              </template>
              <template slot-scope="scope">
                <span v-show="!isEdit">{{ scope.row.phone?scope.row.phone:'' }}</span>
                <input v-show="isEdit" v-enterBlank type="text" v-model="scope.row.phone" class="input-text-details"
                  onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="所在地区">
              <template slot="header">
                <i :class="{'is-sff-required':!isEdit,'no-required':isEdit}">*&nbsp;</i>所在地区
              </template>
              <template slot-scope="scope">
                <span v-show="!isEdit">{{ scope.row.DaddressSpan?scope.row.DaddressSpan:'' }}</span>
                <el-cascader v-show="isEdit" v-model="scope.row.Daddress" size="mini" :options="optionsCounty"
                  :props="props"></el-cascader>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="详细地址">
              <template slot="header">
                <i :class="{'is-sff-required':!isEdit,'no-required':isEdit}">*&nbsp;</i>详细地址
              </template>
              <template slot-scope="scope">
                <span v-show="!isEdit">{{ scope.row.detail?scope.row.detail:'' }}</span>
                <input v-show="isEdit" v-enterBlank type="text" v-model="scope.row.detail" class="input-text-details"
                  onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="默认地址">
              <template slot="header">
                <i :class="{'is-sff-required':!isEdit,'no-required':isEdit}">*&nbsp;</i>默认地址
              </template>
              <template slot-scope="scope">
                <span v-show="!isEdit">{{ scope.row.is_default == 0?'':'是' }}</span>
                <el-radio v-if="isEdit" v-model="scope.row.is_default" label="1"
                  @change="handleRadioChange(scope.$index)">默认</el-radio>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="paginationClass">
            <el-pagination :current-page.sync="page2" :page-sizes="[20, 50, 100, 400]" :page-size.sync="pageSize2"
              @size-change="HDAddress" @current-change="HDAddress" layout="total, sizes, prev, pager, next"
              :total="total2">
            </el-pagination>
          </div> -->
        </div>
      </div>
    </div>
  
    <el-dialog
      title="客户名片"
      width="550px"
      :visible.sync="showCardImage">
      <img :src="order.business_card" alt="客户名片" class="big-card-image">
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import customerManagementApi from "@/api/customerManagement.api";
import {
  domain,
  client_id,
  client_secret,
  grant_type,
  scope
} from "@/config/config";
@Component
export default class App extends Vue {
  private pageUrl: string = `${domain}/adminapi/user`;
  private queryData: any = {};
  private order: any = {
    MarketType: "国内", // 市场类型
    FullNameOfcompany: "", // 公司全称
    custer: "", // 客户
    name: "", // 姓名
    status: "1" // 状态  0 和 1,
  };
  private searchSource: any[] = [
    {
      type: "String",
      label: "公司全称",
      attribute: "company_name"
    },
    {
      type: "String",
      label: "客户",
      attribute: "phone"
    },
    {
      type: "Select",
      label: "市场类型",
      value: [{ label: "国内", value: 1 }, { label: "海外", value: 2 }],
      attribute: "from_type"
    }
  ];
  private isEdit: boolean = false;
  private tableData: any[] = [];
  private receivingGoodsArray: any[] = [];
  private created_at: any = "";
  private last_login_at: any = "";
  private login_times: any = "";
  private rowId: any = 0;
  private queryId: any = "";
  private contrlSetCurrentRow: boolean = true; // 选中控制
  // 获取选中行的数据
  private async rowClick(row: any, e: any, c: any) {
    if (this.isEdit) {
      window
        .$confirm("检测到未保存的内容，确定要继续吗？", "确认信息", {
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "留在当前",
          cancelButtonText: "继续",
          type: "warning"
        })
        .then(() => {
          // 不处理
        })
        .catch(() => {
          this.isEdit = false;
          this.rowId = row.id;
          this.$nextTick(() => {
            this.HDAddress();
          });
        });
    } else {
      this.rowId = row.id;
      this.$nextTick(() => {
        this.HDAddress();
      });
    }
  }
  private optionsCounty: any[] = [];
  private props: any = {
    value: "name",
    label: "name",
    children: "sub"
  };
  private showCardImage: boolean = false;
  // 请求国家数据
  private async countries() {
    const result: any = await window.$request({
      url: `${customerManagementApi.getRelationAreas}`
    });
    this.optionsCounty = result.data.data || [
      {
        id: 1,
        name: "中国",
        name_en: "China",
        abbr: "CN",
        sub: []
      }
    ];
  }
  // 请求客户列表
  private async HDList(result: any) {
    this.tableData = result.response.data || [];
    if (this.tableData.length > 0) {
      let el: any = this.$refs.multipleTable;
      if (this.contrlSetCurrentRow) {
        this.rowId = this.tableData[0].id;
        // 初始化页数选项
        el.setCurrentRow(this.tableData[0]);
      } else {
        this.contrlSetCurrentRow = true;
        this.tableData.forEach(item => {
          if (item.id === this.rowId) {
            el.setCurrentRow(item);
          }
        });
      }

      this.$nextTick(() => {
        // 第一次进页面获取第一条详情
        this.HDAddress();
      });
    }
  }
  // 请求右侧数据
  private async HDAddress() {
    const result: any = await window.$request({
      url: `${customerManagementApi.userId}` + this.rowId
    });
    this.order.MarketType =
      result.data.data.from_type === "1" ? "国内" : "海外"; // 市场类型
    this.order.FullNameOfcompany = result.data.data.company_name; // 公司全称
    this.order.custer = result.data.data.name; // 客户
    this.order.name = result.data.data.title; // 姓名
    this.order.status = result.data.data.status || "1"; // 状态  0 和 1,
    this.order.business_card = result.data.data.business_card; // 名片
    this.receivingGoodsArray = result.data.data.addressList || [];
    this.created_at = result.data.data.created_at;
    this.last_login_at = result.data.data.last_visit_at;
    this.login_times = result.data.data.visit_times;
    this.receivingGoodsArray.forEach(item => {
      item.is_default = item.is_default.toString();
      let arrCuntry = [];
      arrCuntry.push("中国");
      arrCuntry.push(item.province);
      arrCuntry.push(item.city);
      if (item.country) {
        arrCuntry.push(item.country);
      }
      item.Daddress = arrCuntry; // 选择框回显
      item.DaddressSpan = item.province + item.city + item.country; // 数据回显
    });
    if (this.queryId) {
      // 其他页面跳转过来时候
      // { view: 1, id: "", order_id: '' }; view标识你自己的页面 1 订单页面
      if (JSON.parse(this.queryId).view === 1) {
        this.handleAdd(false); // 让右侧变成编辑
      }
    }
  }
  @Watch("$route")
  onChildChanged(val: string, oldVal: string) {
    this.isEdit = false;
    this.queryId = "";
    this.queryData = {};
  }
  created() {
    this.queryId = this.$route.query.id;
    if (this.queryId) {
      // 其他页面跳转过来时候
      // { view: 1, id: "", order_id: '' }; view标识你自己的页面 1 订单页面
      if (JSON.parse(this.queryId).view === 1) {
        this.queryData.phone = JSON.parse(this.queryId).id;
      }
    }
    this.countries();
  }
  // 默认地址单选控制
  private handleRadioChange(row: any) {
    for (let i in this.receivingGoodsArray) {
      if (i !== row.toString()) {
        this.receivingGoodsArray[i].is_default = "0";
      }
    }
  }
  private pdADDEdtor: boolean = false; // 判断是新增 还是编辑 true 新增
  //   新增 编辑
  private handleAdd(value: any) {
    this.isEdit = true;
    this.pdADDEdtor = value;
    if (value) {
      // 新增
      this.order = {
        status: "1",
        FullNameOfcompany: "", // 公司全称
        custer: "", // 客户
        name: "", // 姓名
        MarketType: ""
      };
      let arrreceivingGoodsArray: any[] = [];
      arrreceivingGoodsArray.push({
        id: "",
        userid: 0,
        username: "",
        phone: "",
        is_default: "0",
        detail: "",
        full_address: "",
        Daddress: [], // 选择框回显
        DaddressSpan: "" // 数据回显
      });
      this.receivingGoodsArray = arrreceivingGoodsArray;
    } else {
      // 编辑
      let useridA = "";
      this.receivingGoodsArray.forEach(item => {
        item.isEdit = true;
        useridA = item.userid;
      });
      this.receivingGoodsArray.push({
        id: "",
        userid: useridA,
        username: "",
        phone: "",
        is_default: "0",
        detail: "",
        full_address: "",
        Daddress: [], // 选择框回显
        DaddressSpan: "" // 数据回显
      });
    }
  }
  // 新增 一条收货地址
  private handleAddAddressList() {
    if (this.pdADDEdtor) {
      // 新增
      this.receivingGoodsArray.push({
        id: "",
        userid: 0,
        username: "",
        phone: "",
        is_default: "0",
        detail: "",
        full_address: "",
        Daddress: [], // 选择框回显
        DaddressSpan: "" // 数据回显
      });
    } else {
      // 编辑
      let useridA = "";
      this.receivingGoodsArray.forEach(item => {
        useridA = item.userid;
      });
      this.receivingGoodsArray.push({
        id: "",
        userid: useridA,
        username: "",
        phone: "",
        is_default: "0",
        detail: "",
        full_address: "",
        Daddress: [], // 选择框回显
        DaddressSpan: "" // 数据回显
      });
    }
  }
  private showErrMassage(errorMessage: any) {
    window.$message({
      message: errorMessage,
      type: "error"
    });
  }
  // 提交
  private async handleSave() {
    let result: any = {};
    let addressListArr: any[] = [];

    if (this.order.MarketType === "") {
      this.showErrMassage("市场类型不能为空");
      return;
    }
    if (this.order.FullNameOfcompany === "") {
      this.showErrMassage("公司全称不能为空");
      return;
    }
    if (this.order.custer === "") {
      this.showErrMassage("客户不能为空");
      return;
    }
    let errorMessage: any = "";
    let succeeMessage: boolean = false;
    // 地址数据 新增 编辑 时候新增的数据为空 不新增 清楚
    let arrReceivingGoodsArray: any[] = [];
    if (this.pdADDEdtor) {
      // 新增
      this.receivingGoodsArray.forEach(item => {
        if (item.id === "") {
          if (
            item.username === "" &&
            item.phone === "" &&
            item.Daddress.length < 3 &&
            item.detail === "" &&
            item.is_default === "0"
          ) {
            // 不处理
          } else {
            arrReceivingGoodsArray.push(item);
          }
        } else {
          arrReceivingGoodsArray.push(item);
        }
        if (item.is_default === "1") {
          succeeMessage = true;
        }
      });
      if (arrReceivingGoodsArray.length === 0) {
        this.showErrMassage("收货地址未填");
        return;
      }
    } else {
      // 编辑
      this.receivingGoodsArray.forEach(item => {
        if (item.id === "") {
          if (
            item.username === "" &&
            item.phone === "" &&
            item.Daddress.length < 3 &&
            item.detail === "" &&
            item.is_default === "0"
          ) {
            // 不处理
          } else {
            arrReceivingGoodsArray.push(item);
          }
        } else {
          arrReceivingGoodsArray.push(item);
        }
        if (item.is_default === "1") {
          succeeMessage = true;
        }
      });
    }
    if (arrReceivingGoodsArray.length === 0) {
      this.showErrMassage("请添加收货地址");
      return;
    }
    this.receivingGoodsArray = arrReceivingGoodsArray;
    if (!succeeMessage) {
      this.showErrMassage("请选择默认地址");
      return;
    }
    this.receivingGoodsArray.forEach(item => {
      let obj: any = {};
      obj.userid = item.userid;
      obj.id = item.id;
      obj.username = item.username;
      obj.phone = item.phone;
      obj.is_default = item.is_default * 1;
      obj.detail = item.detail;
      if (item.username === "") {
        errorMessage = "收件人不能为空";
        return;
      }
      if (item.phone === "") {
        errorMessage = "收件人手机不能为空";
        return;
      }
      if (item.Daddress.length < 3) {
        errorMessage = "所在地区不能为空";
        return;
      }
      // 国家字段以后加
      obj.province = item.Daddress[1];
      obj.city = item.Daddress[2];
      obj.country = item.Daddress[3];
      obj.full_address = item.Daddress.join() + item.detail;
      if (item.detail === "") {
        errorMessage = "详细地址不能为空";
        return;
      }
      addressListArr.push(obj);
    });
    if (errorMessage) {
      this.showErrMassage(errorMessage);
      return;
    }
    if (this.pdADDEdtor) {
      // 新增
      result = await window.$request.post(`${customerManagementApi.user}`, {
        body: {
          name: this.order.custer,
          title: this.order.name,
          company_name: this.order.FullNameOfcompany,
          status: this.order.status,
          from_type: this.order.MarketType === "国内" ? 1 : 2,
          addressList: addressListArr,
          orderId: this.queryId
            ? JSON.parse(this.queryId).view === 1
              ? JSON.parse(this.queryId).order_id
              : ""
            : ""
        }
      });
    } else {
      // 编辑
      result = await window.$request.put(
        `${customerManagementApi.userId}${this.rowId}`,
        {
          body: {
            name: this.order.custer,
            title: this.order.name,
            company_name: this.order.FullNameOfcompany,
            status: this.order.status,
            from_type: this.order.MarketType === "国内" ? 1 : 2,
            addressList: addressListArr,
            orderId: this.queryId
              ? JSON.parse(this.queryId).view === 1
                ? JSON.parse(this.queryId).order_id
                : ""
              : ""
          }
        }
      );
    }
    if (result.data.status_code === 200) {
      this.isEdit = false;
      window.$message({
        message: result.data.message,
        type: "success"
      });
      if (this.queryId) {
        if (JSON.parse(this.queryId).view === 1) {
          setTimeout(() => {
            // this.$router.push("/order");
            this.$router.push({
              path: "/order",
              query: { phone: JSON.parse(this.queryId).id }
            });
          }, 2000);
        } else {
          if (!this.pdADDEdtor) {
            this.contrlSetCurrentRow = false; // 编辑 保持选中
          }
        }
      } else {
        if (!this.pdADDEdtor) {
          this.contrlSetCurrentRow = false; // 编辑 保持选中
        }
        let pagination: any = this.$refs.pagination;
        pagination.getList();
      }
    } else {
      window.$message({
        message: result.data.message,
        type: "error"
      });
    }
  }
  // 取消
  private handleCancel() {
    if (this.queryId) {
      // 其他页面跳转过来时候
      // { view: 1, id: "", order_id: '' }; view标识你自己的页面 1 订单页面
      if (JSON.parse(this.queryId).view === 1) {
        // this.$router.push("/order");
        this.$router.push({
          path: "/order",
          query: { phone: JSON.parse(this.queryId).id }
        });
      } else {
        this.isEdit = false;
        this.HDAddress();
      }
    } else {
      this.isEdit = false;
      this.HDAddress();
    }
  }
}
</script>
<style lang="scss" scoped>
.list-header {
  background: #fff;
}
.list-header-title {
  font-size: 32px;
  font-weight: 400;
  height: 60px;
  line-height: 60px;
  padding-left: 10px;
}
.paginationClass {
  width: 100%;
  text-align: right;
  height: 32px;
  line-height: 32px;
}
.searchClass {
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
.shelt-left {
  margin-top: 38px;
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px 10px 0 10px;
  margin-right: 10px;
  width: 23%;
  display: inline-block;
  vertical-align: top;
}
.shelt-right {
  width: calc(77% - 32px);
  display: inline-block;
  vertical-align: top;
}
.rightBottom {
  margin-top: 10px;
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  // height: 643px;
}
.clear {
  clear: both;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.fr {
  float: right;
  font-size: 14px;
  padding-right: 10px;
  .textStatus_g {
    color: #00cc33;
  }
  .textStatus_h {
    color: rgb(204, 0, 119);
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.border-b {
  border-bottom: 1px solid #ddd;
}
.purple {
  margin: 10px 0;
}
.comm-sty {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 20px;
  padding-bottom: 20px;
  font-size: 14px;
  color: #606266;
  background: #fff;
}

i {
  color: red;
}
.el-input {
  width: 70%;
}
.el-row {
  padding-left: 10px;
}
.radioGroup {
  margin: 10px 0;
}
.shelt-list {
  // width: 100%;
  // display: flex;
  // flex-direction: row;
}
.shelt-list >>> .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.shelt-list >>> .el-form-item__content {
  margin-left: 0 !important;
}
.shelt-list >>> .el-input__icon {
  height: 34px;
}
.main-table-item .item-title {
  width: 100px;
}
.is-sff-required {
  color: red;
  width: 8px;
  display: inline-block;
  text-align: center;
}

.no-required {
  display: none;
}
.input-text-details {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 25px;
  line-height: 25px;
  text-align: left;
  padding: 0 3px;
  width: 98%;
}
.zjButton {
  margin-left: 10px;
}
</style>
<style>
.customerManagement
  .radioGroup
  .el-radio-button__orig-radio:disabled:checked
  + .el-radio-button__inner {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  box-shadow: -1px 0 0 0 #409eff;
}
.customerManagement .radioGroup .el-radio-button__inner {
  width: 100px;
}
.customerManagement .el-input.is-disabled .el-input__inner {
  color: #777;
}
.card-imgae {
  width: 100px;
  max-height: 100%;
  
  cursor: pointer;
  border-radius: 10px;
}
.big-card-image {
  width: 500px;
  max-height: 100%;
}
</style>