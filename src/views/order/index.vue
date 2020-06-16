<!--

  @Description: 首页
  @Author: xyd
  @Date: 2019-06-11 17:53

-->

<template>
  <div id="order">
    <!-- <h1 class="h">this is a 01 page !</h1> -->
    <div style="height: 60px; line-height: 60px;">
      <!-- <h2>订单管理</h2> -->
      <div class="headerTitle">订单管理</div>
    </div>

    <div class="headerStatus">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane name>
          <span slot="label">全部订单</span>
        </el-tab-pane>
        <el-tab-pane label="待发货|未审核" name="1,1"></el-tab-pane>
        <el-tab-pane label="待发货|已审核" name="1,2"></el-tab-pane>
        <el-tab-pane label="待收货" name="2"></el-tab-pane>
        <el-tab-pane label="待评价" name="3"></el-tab-pane>
        <el-tab-pane label="已评价" name="4"></el-tab-pane>
        <el-tab-pane label="已取消" name="5"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- <h1 class="h">01 !</h1> -->
    <div class="search-list">
      <sf-search :search-source="searchSource" @search-result="onSearchResult"></sf-search>
    </div>

    <div class="button-group">
      <div class="button-g">
        <el-button v-if="query.status == 1  && query.approve == 1 || query.status == ''" type="primary" size="mini" @click="reviewAll()">批量审核
        </el-button>
        <el-button v-if="query.status == 1 && query.approve == 1 || query.status == ''" type="primary" size="mini" @click="cancelAll()">批量取消
        </el-button>
        <el-button v-if="query.status == 1 && query.approve == 1 || query.status == ''" type="primary" size="mini" @click="customerPushAll()">
          维护客户信息</el-button>
      </div>
    </div>

    <div class="list-wrap">
      <!-- 标题栏 -->
      <div class="list-title" style="width: 90%;position: sticky;top: 60px;z-index: 2;float: left;">
        <!-- 复选框 -->
        <!-- <div class="item sf-md" style="padding-left: 10px;"> -->
        <div class="item sf-md" style="padding-left: 10px; box-sizing: border-box;">
          <!-- <div :class="['checked-warp']" @click="handlerChecked()"> -->
          <div :class="['checked-warp']">
            <!-- :class="['checked-warp', 'not']" -->
            <!-- <span :class="['checked',orderLists.includes() && 'checked-active']" /> -->
            <span :class="['',orderLists.includes() && '']" />
            <!-- <span
                :class="['checked', 'checked-active', 'checked-disabled']"
            />-->
            <span class="" style="margin-right: 5px;">订单编号</span>
          </div>
        </div>
        <!-- 循环数据 -->
        <div class="list-title-other item sf-all">
          <div class="sf-md item " style="width: 23%;">条码编号</div>
          <div class="sf-md item " style="width: 37%;">商品信息</div>
          <div class="sf-md item " style="width: 15%;">数量</div>
          <div class="sf-md item " style="width: 25%;">客户评价</div>
        </div>
        <!-- 操作 -->
        <div class="sf-md item ta-c">操作</div>
        <div class="sf-md item ta-c">交易状态</div>
        <div class="sf-md item ta-c">交易时间</div>
        <!-- <div class="sf-md item ta-c">备注</div> -->
      </div>
      <div class="sf-md item  list-title-lastone" style="position: sticky;top: 60px;z-index: 2;">客户历史发货</div>

      <!-- 数据详情 -->
      <div class="list-content" v-for="(item, index) in details" :key="index">
        <!-- 客户信息栏 -->
        <!-- henfu -->
        <div class="list-client-inf" style="padding-left: 10px; box-sizing: border-box;">
          <span class>
            <div :class="['checked-warp']" @click="handlerChecked(item, index)">
              <!-- :class="['checked-warp', 'not']" -->
              <span :class="['checked',dataLists.includes(item.id) && 'checked-active']" />
              <!-- <span
                  :class="['checked', 'checked-active', 'checked-disabled']"
              />-->
              <span style="margin-right: 5px;"></span>
            </div>
          </span>
          <span class="mar-r">客户: {{item.customer ? item.customer.name : ''}}</span>
          <span class="mar-r">公司全称: {{item.customer ? item.customer.company_name : ''}}</span>
          <span class="mar-r">收件人: {{item.address ? item.address.username : ''}}</span>
          <span class="mar-r">收件人电话: {{item.address ? item.address.phone : ''}}</span>
          <span class="mar-r">收件地址: {{item.address ? item.address.full_address : ''}}</span>
          <span class="mar-r">客服: {{item.user_admin ? item.user_admin : ''}}</span>
        </div>
        <!-- 发货详情页面 -->
        <div class="list-details" style="width: 90%;">
          <div class="details-order list-border" v-for="(val, ind) in item.order" :key="ind">
            <!-- 复选框 -->
            <div class="sf-md item detail-order-check list-border"
              style="padding-left: 10px; box-sizing: border-box;margin-bottom: -1px;">
              <div :class="['checked-warp']" @click="handlerChecked(item, index, val, ind)">
                <!-- :class="['checked-warp', 'not']" -->
                <span :class="['checked',orderLists.includes(val.id) && 'checked-active']" />
                <!-- <span
                  :class="['checked', 'checked-active', 'checked-disabled']"
                />-->
                <span style="margin-right: 5px;">{{val.code ? val.code : ''}}</span>
              </div>
            </div>
            <!-- 循环条码数据 -->
            <div class="item sf-all details-all">
              <ul class="details" style="margin-bottom: -1px; height: 100%;" v-for="(v, i) in val.detail" :key="i">
                <li class="item list-border details-info" style="width: 23%;">
                  <div :class="['checked-warp']" @click="handlerChecked(item, index, val, ind, v, i)">
                    <!-- :class="['checked-warp', 'not']" -->
                    <span :class="['checked',detailLists.includes(v.id) && 'checked-active']" />
                    <!-- <span
                      :class="['checked', 'checked-active', 'checked-disabled']"
                    />-->
                    <span style="margin-right: 5px;">{{v.product_main ? v.product_main.bar_code : ''}}</span>
                  </div>
                </li>
                <li class="item list-border details-info" style="width: 35%;">
                  <div style="width:60px; height:60px;display: flex;align-items: center;">
                    <img width="50px" height="50px" :src="v.picture_url ? v.picture_url : ''" alt />
                    <!-- <img
                      :src="v.product_main && v.product_main.picture_main ? v.product_main.picture_main.picture_url : ''"
                      alt
                    /> -->
                  </div>
                  <div class>
                    <div>{{v.product_main ? v.product_main.name : ''}}</div>
                    <span>{{v.widths ? v.widths.name : ''}}</span>-
                    <span>{{v.weights ? v.weights.name : ''}}</span>
                  </div>
                </li>
                <li class="item list-border details-info" style="width: 17%;">
                  <div class>1</div>
                </li>
                <li class="item list-border details-info" style="width: 25%;">
                  <div v-if="val.send_status == 3 && query.status == '' || query.status == 3">
                    <el-input type="textarea" :rows="2" placeholder="" v-model="v.customer_evaluate"></el-input>
                  </div>
                  <div v-else>
                    <el-input type="textarea" :rows="2" disabled placeholder="" v-model="v.customer_evaluate">
                    </el-input>
                  </div>
                  <!-- <div class="el-icon-check" v-if="val.send_status == 3 && query.status == '' || query.status == 3"
                    @click="evaluationDetail(v, $event)">
                  </div> -->
                </li>
              </ul>
            </div>
            <!-- 操作 -->
            <div class="sf-md item operating">
              <div class="">
                <div class="mar-bototm" v-if="val.send_status == 1 && val.examine_status == 1" @click="customerPush(item, val)"
                  style="cursor:pointer; color: rgb(64, 158, 255);">
                  客户信息维护</div>
                <div v-if="val.send_status == 1 && val.examine_status == 1 && query.status == ''">
                  <div class="mar-bototm" @click="review(item, val)" v-if="val.examine_status != 2"
                    style="cursor:pointer; color:rgb(64, 158, 255);">审核</div>
                  <div class="mar-bototm" @click="cancelConfirm(item, val)" v-if="val.examine_status != 2"
                    style="cursor:pointer; color:rgb(64, 158, 255);">取消</div>
                </div>
                <div v-if="val.send_status == 2 && query.status == ''">
                  <div class="mar-bototm" @click="receipt(item, val)" style="cursor:pointer; color: rgb(64, 158, 255);">
                    确认收货</div>
                </div>
                <div v-if="val.send_status == 3 && query.status == ''">
                  <div class="mar-bototm" @click="evaluation(item, val)"
                    style="cursor:pointer; color: rgb(64, 158, 255);">评价</div>
                </div>

                <div v-if="query.status == 1">
                  <div class="mar-bototm" @click="review(item, val)" v-if="val.examine_status != 2"
                    style="cursor:pointer; color: rgb(64, 158, 255);">审核</div>
                  <div class="mar-bototm" @click="cancelConfirm(item, val)" v-if="val.examine_status != 2"
                    style="cursor:pointer; color: rgb(64, 158, 255);">取消</div>
                </div>
                <div v-if="query.status == 2">
                  <div class="mar-bototm" @click="receipt(item, val)" style="cursor:pointer; color: rgb(64, 158, 255);">
                    确认收货</div>
                </div>
                <div v-if="query.status == 3">
                  <div class="mar-bototm" @click="evaluation(item, val)"
                    style="cursor:pointer; color: rgb(64, 158, 255);">评价</div>
                </div>
              </div>
            </div>
            <div class="sf-md item operating zt">
              <!-- {{val.send_status ? val.send_status : ''}}|{{val.examine_status ? val.examine_status : ''}} -->
              <div style="display: flex;">
                <span v-if="val.send_status == 1" style="color: green;">待发货</span>
                <span v-if="val.send_status == 2" style="color: green;">待收货</span>
                <span v-if="val.send_status == 3" style="color: green;">待评价</span>
                <span v-if="val.send_status == 4" style="color: green;">已评价</span>
                <span v-if="val.send_status == 5" style="color: green;">已取消</span>
                <div v-if="query.status == 1 || val.send_status == 1">
                  |
                  <span v-if="val.examine_status == 1" style="color: orange;">未审核</span>
                  <span v-if="val.examine_status == 2" style="color: green;">已审核</span>
                </div>
              </div>
              <div v-if="query.status == 2 || query.status == 3 || query.status == 4">共发货: {{val.count}}件</div>
              <div v-if="query.status == '' && val.send_status != 1 && val.send_status != 5">共发货: {{val.count}}件</div>
            </div>
            <div class="sf-md item operating">{{val.created_at ? val.created_at : ''}}</div>
            <!-- <div class="sf-md item operating" style="border-right: 1px solid #ddd;">已发货{{}}次</div> -->
            <!-- 备注 -->
            <!-- <div class="sf-md item operating"></div> -->
          </div>
          <div style=" position: absolute;
                    right: -10%;
                    top: 0px;
                    width: 10%;
                    height: 100%;
                    border-bottom: 1px solid #dddddd;
                    margin-bottom: -1px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                      ">
            <div class="mar-bototm ">已发货{{item.number}}次</div>
            <div @click="goShip(item)" class="" style="cursor:pointer; color: rgb(64, 158, 255);">发货详情</div>
          </div>
          <div class="clear" style="clear: both;"></div>
        </div>

        <!-- <div class="sf-md item operating" style="border-right: 1px solid #ddd;">已发货{{}}次</div> -->
      </div>
    </div>
    <sf-pagination :url="url" :query="query" @get-list="getPaginationList" ref="sfPagination"></sf-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// // import qs from "query-string";
import {
  domain,
  client_id,
  client_secret,
  grant_type,
  scope
} from "@/config/config";
import create from "../../utils/progress";

@Component
export default class Order extends Vue {
  private activeName = "1,1";

  /**
   * 列表页数据
   */
  private details: any = [];

  /**
   * 横幅选中状态
   */
  private dataLists: string[] = [];

  /**
   * 订单选中状态
   */
  private orderLists: string[] = [];

  /**
   * 条码选中状态
   */
  private detailLists: string[] = [];

  /**
   * 搜索条件
   */
  private searchSource: any[] = [
    {
      type: "String",
      label: "公司全称",
      attribute: "company"
    },
    {
      type: "String",
      label: "客户",
      attribute: "phone"
    },
    {
      type: "String",
      label: "订单编号",
      attribute: "orderCode"
    },
    {
      type: "String",
      label: "条码编号",
      attribute: "barCode"
    },
    {
      type: "String",
      label: "布类",
      attribute: "fabrication"
    },
    {
      type: "Date",
      label: "交易时间",
      attribute: "date__endDate",
      isSection: true
    },
    {
      type: "String",
      label: "客服",
      attribute: "customer"
    },
  ];

  /**
   * 分页url
   */
  private url: any = `${domain}/adminapi/order`;

  /**
   * 分页数据传入的参数
   */
  private query: any = { status: 1, approve: 1 };

  handleClick(tab: any, event: any) {
    if (isNaN(tab.name)) {
      let name = tab.name.split(",");
      this.query = { status: name[0], approve: name[1]};
      console.log('no number');
    } else {
      console.log('number');
      this.query = { status: tab.name };
    }

    (this.$refs.sfPagination as any).getList();

    this.dataLists = [];
    this.orderLists = [];
    this.detailLists = [];
  }

  /**
   * 分页组件数据
   */
  getPaginationList(data: any) {
    // console.log(data, "dat");
    this.details = data.response.data;
    // console.log(this.details, "deta");
  }

  /**
   * 搜索
   */
  onSearchResult(url: any) {
    // this.handleSearch(url);
    console.log(url);
  }

  /**
   * @desc  勾选权限
   */
  handlerChecked(
    item: any,
    index: number,
    val: any,
    ind: number,
    v: any,
    i: number
  ) {
    const body = this.details[index];
    // console.log(body, "thsi is body");
    let source = [];

    /**
     * 横幅点击全选
     */
    if (index !== undefined && ind === undefined && i === undefined) {
      // 横幅的循环
      const dataIndex = this.dataLists.indexOf(item.id);
      if (dataIndex !== -1) {
        this.dataLists.splice(dataIndex, 1);
      } else {
        this.dataLists.push(item.id);
      }

      let order = body.order;

      if (this.dataLists.includes(item.id)) {
        console.log("全选");
        // 订单及条码循环push
        order.forEach((val: any, ind: any) => {
          if (!this.orderLists.includes(val.id)) {
            this.orderLists.push(val.id);
          }
          val.detail.forEach((v: any, i: any) => {
            if (!this.detailLists.includes(v.id)) {
              this.detailLists.push(v.id);
            }
          });
        });
      } else {
        console.log("取消");
        // 订单及条码取消
        order.forEach((val: any, ind: any) => {
          let id = this.orderLists.indexOf(val.id);
          if (this.orderLists.includes(val.id)) {
            this.orderLists.splice(id, 1);
          }

          val.detail.forEach((v: any, i: any) => {
            let id = this.detailLists.indexOf(v.id);
            if (this.detailLists.includes(v.id)) {
              this.detailLists.splice(id, 1);
            }
          });
        });
      }

      console.log(this.dataLists, "dataLists");
      console.log(this.orderLists, "orderLists");
      console.log(this.detailLists, "detailLists");
    }

    /**
     * 订单点击全选
     */
    if (ind !== undefined && i === undefined) {
      // 订单的循环
      const orderIndex = this.orderLists.indexOf(val.id);
      if (orderIndex !== -1) {
        this.orderLists.splice(orderIndex, 1);
      } else {
        if (!this.orderLists.includes(val.id)) {
          this.orderLists.push(val.id);
        }
      }

      let detail = body.order[ind];
      console.log(detail, "detail");

      // 条码的循环push到数组里
      if (this.orderLists.includes(val.id)) {
        console.log("全选");
        detail.detail.forEach((v: any, i: any) => {
          if (!this.detailLists.includes(v.id)) {
            this.detailLists.push(v.id);
          }
        });
      } else {
        console.log("取消");
        detail.detail.forEach((v: any, i: any) => {
          let id = this.detailLists.indexOf(v.id);
          if (this.detailLists.includes(v.id)) {
            this.detailLists.splice(id, 1);
          }
        });
      }

      console.log(this.orderLists, "orderLists");
      console.log(this.detailLists, "detailLists");
    }

    /**
     * 条码点击全选
     */
    if (i !== undefined) {
      let detail = body.order[ind].detail[i];
      const detailIndex = this.detailLists.indexOf(v.id);
      console.log(detailIndex, "detailIndex");
      if (detailIndex !== -1) {
        this.detailLists.splice(detailIndex, 1);
      } else {
        this.detailLists.push(v.id);
      }

      console.log(this.orderLists, "orderLists");
      console.log(this.detailLists, "detailLists");
    }

    // if (i !== undefined) {
    //   // console.log(v.id, ind);
    //   const detailIndex = this.detailLists.indexOf(v.id);
    //   // console.log(detailIndex);
    //   if (detailIndex !== -1) {
    //     this.detailLists.splice(detailIndex, 1);
    //   } else {
    //     this.detailLists.push(v.id);
    //   }
    // }
  }

  /**
   * 客户信息维护
   */
  private async customerPushAll() {
    console.log(this.details, ".details");
    if (this.dataLists.length < 1) {
      window.$message({
        message: "请选择客户！",
        type: "warning"
      });
      return;
    }

    let flag = false;

    this.details.forEach((ite: any) => {
      ite.order.forEach((i: any) => {
        this.orderLists.forEach((val: any, ind: number) => {
          if (val === i.id) {
            console.log(i);
            if (!(i.send_status === 1 && i.examine_status === 1)) {
              flag = true;
            }
          }
        });
      });
    });

    if (flag) {
      window.$message({
        message: "请确认订单为未审核！",
        type: "warning"
      });
      return;
    }

    let arr: any[] = [];
    if (this.dataLists.length > 1) {
      this.dataLists.forEach((item: any) => {
        this.details.forEach((val: any) => {
          if (val.id === item) {
            arr.push(val.customer_id);
            // arr.push(val)
          }
        });
      });
      arr = Array.from(new Set(arr));
      console.log(arr, "arrs");
    }

    if (arr.length > 1) {
      window.$message({
        message: "请选择同一客户！",
        type: "warning"
      });
      return;
    }

    let order_id = this.orderLists.join(",");
    this.details.forEach((item: any, index: number) => {
      let id = { view: 1, id: "", order_id: "" };
      if (item.id === this.dataLists[0]) {
        id.id = item.customer.name;
        id.order_id = order_id;
        // this.$router.push("/customer/customerManagement/" + `${JSON.stringify(id)}`);
        this.$router.push({
          path: "/customer/customerManagement/",
          query: { id: JSON.stringify(id) }
        });
      }
    });
  }

  /**
   * 客户信息维护
   */
  private async customerPush(item: any, val: any) {
    // console.log(item, "item");
    // console.log(val, "val");
    let id = { view: 1, id: "", order_id: "" };
    id.id = item.customer.name;
    id.order_id = val.id;
    // return
    this.$router.push({
      path: "/customer/customerManagement/",
      query: { id: JSON.stringify(id) }
    });
    // this.$router.push("/customer/customerManagement/" + `${JSON.stringify(id)}`);
  }

  /**
   * 审核方法
   */
  private async review(item: any, val: any) {
    if (
      item.customer &&
      item.customer.name &&
      item.customer.company_name &&
      item.address &&
      item.address.username &&
      item.address.full_address &&
      item.address.phone
    ) {
      let order_ids: any[] = [];
      let order_detail_ids: any[] = [];

      if (!this.detailLists.length) {
        window.$message({
          message: "请选择条码！",
          type: "warning"
        });
        return;
      }

      order_ids.push(val.id);
      order_detail_ids = this.detailLists;

      const result = await window.$request({
        url: `${domain}` + "/adminapi/order-approve/approve",
        method: "patch",
        isExportFail: true,
        body: {
          order_ids,
          order_detail_ids
        },
      });

      // (this.$refs.sfPagination as any).getList();

      if (result.status === 200) {
        if (result.data.status_code === 200) {
          window.$message({
            message: result.data.message,
            type: "success"
          });
        } else {
          window.$message({
            message: result.data.message,
            type: "warning"
          });
        }
      } else {
        window.$message.error(result.message);
      }
    } else {
      window.$message({
        message: "请维护客户信息！",
        type: "warning"
      });
      (this.$refs.sfPagination as any).getList();
      return;
    }
    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 批量审核
   */
  private async reviewAll() {
    if (!this.orderLists.length) {
      window.$message({
        message: "请选择订单！",
        type: "warning"
      });
      return;
    }
    if (!this.detailLists.length) {
      window.$message({
        message: "请选择条码！",
        type: "warning"
      });
      return;
    }

    let flag = false;
    this.details.forEach((item: any, index: number) => {
      item.order.forEach((i: any) => {
        this.orderLists.forEach((val: any, ind: number) => {
          if (val === i.id) {
            if (!(i.send_status === 1 && i.examine_status === 1)) {
              flag = true;
            }
          }
        });
      });
    });
    if (flag) {
      window.$message({
        message: "请确认订单为未审核！",
        type: "warning"
      });
      return;
    }

    let shenheflag = false;

    this.orderLists.forEach((val: any, ind: number) => {
      this.details.forEach((item: any, index: number) => {
        item.order.forEach((ele: any) => {
          if (ele.id === val) {
            console.log(ele.id, val);
            if (
              !(item.customer &&
              item.customer.name &&
              item.customer.company_name &&
              item.address &&
              item.address.username &&
              item.address.full_address &&
              item.address.phone)
            ) {
              shenheflag = true;
            }
          }
        });
      });
    });

    if (shenheflag) {
      window.$message({
        message: "请维护客户信息！",
        type: "warning"
      });
      (this.$refs.sfPagination as any).getList();
      return;
    }
    // return;

    const result = await window.$request({
      url: `${domain}` + "/adminapi/order-approve/approve",
      method: "patch",
      body: {
        order_ids: this.orderLists,
        order_detail_ids: this.detailLists
      }
    });

    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    } else {
      console.log('error  this is  error demo 001');
      window.$message({
        message: result.data.message,
        type: "error"
      });
      console.log('error  this is  error demo 002');
    }

    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 取消订单弹窗
   */
  private async cancelConfirm(item: any, val: any) {
    window
      .$confirm("确定取消所选择订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.cancel(item, val);
      })
      .catch(() => {
        console.log("object");
      });
  }

  /**
   * 批量取消订单弹窗
   */
  private async cancelAllConfirm(item: any, val: any) {
    if (!this.orderLists.length) {
      window.$message({
        message: "请选择订单！",
        type: "warning"
      });
      return;
    }

    window
      .$confirm("确定取消所选择订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.cancelAll();
      })
      .catch(() => {
        console.log("object");
      });
  }

  /**
   * 取消方法
   */
  private async cancel(item: any, val: any) {
    let order_id: any[] = [];

    order_id.push(val.id);

    const result = await window.$request({
      url: `${domain}` + "/adminapi/order-cancel/cancel",
      method: "delete",
      query: {
        ids: order_id
      }
    });

    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    } else {
      window.$message.error(result.message);
    }

    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 批量取消
   */
  private async cancelAll() {
    if (!this.orderLists.length) {
      window.$message({
        message: "请选择订单！",
        type: "warning"
      });
      return;
    }

    let flag = false;

    this.details.forEach((ite: any) => {
      ite.order.forEach((i: any) => {
        this.orderLists.forEach((val: any, ind: number) => {
          if (val === i.id) {
            console.log(i);
            if (!(i.send_status === 1 && i.examine_status === 1)) {
              flag = true;
            }
          }
        });
      });
    });

    if (flag) {
      window.$message({
        message: "请确认订单为未审核！",
        type: "warning"
      });
      return;
    }

    let ids = this.orderLists.join(",");

    const result = await window.$request({
      url: `${domain}` + "/adminapi/order-cancel/cancel?ids=" + `${ids}`,
      method: "delete"
    });

    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    } else {
      window.$message.error(result.message);
    }

    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 收货方法
   */
  private async receipt(item: any, val: any) {
    // let ids = this.orderLists.join(",");
    let ids = val.id;
    const result = await window.$request({
      url: `${domain}` + "/adminapi/order-receive/receive?ids=" + `${ids}`,
      method: "get"
    });

    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    } else {
      window.$message.error(result.message);
    }

    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 转已评价方法
   */
  private async evaluation(item: any, val: any) {
    let arr: any[] = [];

    val.detail.forEach((ele: any) => {
      let obj = {
        detail_id: ele.id,
        customer_evaluate: ele.customer_evaluate
      };
      arr.push(obj);
    });

    let flag = false;

    arr.forEach((ite: any) => {
      if (ite.customer_evaluate === null || ite.customer_evaluate === undefined || ite.customer_evaluate === '') {
        flag = true
      } else {
        let i = ite.customer_evaluate.trim()
        if (i === '') {
          flag = true;
        }
      }
    });

    if (flag) {
      window.$message({
        message: '商品评价内容不能为空！',
        type: "warning"
      });
      return;
    }

    const result = await window.$request({
      url: `${domain}` + `/adminapi/order-detail/to_comment/${val.id}`,
      method: "put",
      body: arr
    });
    // const result = await window.$request({
    //   url: `${domain}` + `/adminapi/order-comment/${val.id}`,
    //   method: "post",
    //   // body: {
    // });

    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    } else {
      window.$message.error(result.message);
    }
    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 评价方法
   */
  private async evaluationDetail(v: any, e: any) {
    const result = await window.$request({
      url: `${domain}` + `/adminapi/order-detail/${v.id}`,
      method: "put",
      body: {
        customer_evaluate: v.customer_evaluate ? v.customer_evaluate : ""
        // id: v.id
      }
    });

    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    } else {
      window.$message.error(result.message);
    }

    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 发货详情方法
   */
  goShip(item: any) {
    this.$router.push(
      "/logistics?customer_id=" + `${item.customer_id}` + `&status=2`
    );
  }
}
</script>

<style lang="scss">
#order {
  .mar-bototm {
    margin-bottom: 6px;
  }
  .headerTitle {
    font-size: 32px;
    font-weight: 400;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
  }
  .headerStatus {
    .el-tabs__header {
      padding-left: 10px;
      margin: 0 0 10px;
    }
  }
  .button-group {
    padding: 0 10px 0 10px;
    height: 50px;
    background: #ebeef2;
    position: relative;
    .button-g {
      // margin: 10px 0 0 0;
      position: absolute;
      top: 10px;
    }
  }
  // padding: 0 10px 0 10px ;
  background-color: #fff;
  min-height: 740px;
  .search-list {
    // margin-left: auto;
    width: 1085px;
    padding: 0 5px 0 9px;
    // margin-bottom: 15px;
    margin: 0 0 10px 0;
  }


  font-size: 14px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: rgba(50, 50, 62, 1);


  .ta-c {
    text-align: center;
  }
  .zt {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .h {
    @include m-border("top");
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .mar-r {
    margin-right: 15px;
  }
  .sf-md {
    width: 15%;
  }
  .sf-all {
    width: 40%;
  }
  .item {
    display: inline-block;
  }
  .list-border {
    // border: 1px solid #dddddd;
    // border-right: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    // margin-bottom:-1px
    box-sizing: border-box;
  }
  .h-30 {
    height: 30px;
    line-height: 30px;
  }
  .list-title-lastone {
    font-size: 14px;
    // font-size: 12px;
    font-family: SourceHanSansCN;
    font-weight: 700;
    background-color: #f3f7fc;
    color: rgba(121, 121, 141, 1);
    position: absolute;
    top: 0;
    right: 0;
    width: 10%;
    height: 32px;
    margin-bottom: 2px;
    line-height: 32px;
  }

  .checked-warp {
    // min-width: 80px;
    height: 30px;
    line-height: 30px;

    display: inline-block;

    cursor: pointer;
  }
  .not {
    cursor: no-drop;
  }
  .checked {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    margin-right: 5px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
      background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    vertical-align: middle;
  }
  .checked-active {
    background-color: #409eff;
    border-color: #409eff;
  }
  .checked-active:after {
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    transition: transform 0.15s ease-in 0.05s;
    transform-origin: center;
    transform: rotate(45deg) scaleY(1);
  }
  .checked-disabled {
    background-color: #edf2fc;
    border-color: #dcdfe6;
  }
  .checked-disabled:after {
    border-color: #c0c4cc;
  }
  .list-wrap {
    // padding: 010px;
    position: relative;
    .list-title {
      height: 32px;
      margin-bottom: 2px;
      font-size: 14px;
      // font-size: 12px;
      font-family: SourceHanSansCN;
      font-weight: 700;
      background-color: #f3f7fc;
      color: rgba(121, 121, 141, 1);
      position: relative;
      .list-title-one {
        position: absolute;
        width: 9%;
      }
      // .list-title-other {
      //   height: 30px;
      //   margin-left: 9%;
      //   > div {
      //     height: 30px;
      //     line-height: 30px;
      //   }
      // }
    }
    .list-content {
      margin-bottom: 8px;
      .list-client-inf {
        // margin-bottom: 2px;
        background-color: rgba(236, 246, 255, 1);
      }
      .list-details {
        position: relative;
        .details-order {
          height: 100%;
          display: flex;
          align-items: stretch;

          .details-all {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .detail-order-check {
            display: flex;
            align-items: center;
          }
          .details {
            display: flex;
            align-items: stretch;
            .details-info {
              display: flex;
              align-items: center;
            }
          }
          // width: 9%;
          // position: absolute;
          .operating {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
<style>
.shelt-list .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.shelt-list .el-form-item__content {
  margin-left: 0 !important;
}
.shelt-list .el-input__icon {
  height: 34px;
}
.quarter-select .el-input__inner {
  padding: 0 0 0 10px;
}
.btn-num .el-input {
  padding: 0;
}
.excelUpload .el-button--small{
    padding: 7px 15px;
}
.el-input.is-disabled .el-input__inner{
  color: #777;
}
.el-textarea.is-disabled .el-textarea__inner{
  color: #777;
}
</style>