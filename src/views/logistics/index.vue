<!--

  @Description: 首页
  @Author: xyd
  @Date: 2019-06-11 17:53

-->

<template>
  <div id="logistics">
    <!-- <h1 class="h">this is a 01 page !</h1> -->
    <div style="height: 60px; line-height: 60px;">
      <!-- <h2>发货管理</h2> -->
      <div class="headerTitle">发货管理</div>
    </div>

    <div class="headerStatus">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane name="1">
          <span slot="label">待发货的订单</span>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label">已发货的订单</span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <h1 class="h">01 !</h1> -->
    <div class="search-list">
      <sf-search :search-source="searchSource" @search-result="onSearchResult"></sf-search>
    </div>
    <div class="button-group">
      <div class="button-g">
        <el-button
          v-if="query.status == 1"
          type="primary"
          size="mini"
          @click="openConfirm('1')"
        >批量发货</el-button>
        <el-button v-if="query.status == 1" type="primary" size="mini" @click="importOrder()">运单导入</el-button>
        <el-button type="primary" size="mini" @click="exportOrder()">运单导出</el-button>
        <a id="downloadId" target="_self"></a>
      </div>
    </div>

    <div class="list-wrap">
      <!-- 标题栏 -->
      <div class="list-title" style="width: 90%;position: sticky;top: 60px;z-index: 2;float: left;">
        <!-- 复选框 -->
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
          <div class="sf-md item " style="width: 35%;">商品信息</div>
          <div class="sf-md item " style="width: 17%;">数量</div>
          <div class="sf-md item " style="width: 25%;">仓位</div>
        </div>
        <!-- 操作 -->
        <div class="sf-md item ta-c">物流信息</div>
        <div class="sf-md item ta-c">操作</div>
        <div class="sf-md item ta-c">交易状态</div>
        <div class="sf-md item ta-c">发货时间</div>
        <!-- <div class="sf-md item ta-c">备注</div> -->
      </div>
      <div class="sf-md item ta-c list-title-lastone" style="position: sticky;top: 60px;z-index: 2;">客户历史发货</div>

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
          <!-- <div class="list-details" style="padding-right: 10%; border-bottom: 1px solid #dddddd;"> -->
          <div class="details-order list-border" v-for="(val, ind) in item.order" :key="ind">
            <!-- 复选框 -->
            <div
              class="sf-md item detail-order-check list-border"
              style="padding-left: 10px; box-sizing: border-box;margin-bottom: -1px;"
            >
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
              <ul
                class="details"
                style="margin-bottom: -1px;"
                v-for="(v, i) in val.detail"
                :key="i"
              >
                <li class="item list-border details-info" style="width: 23%;">
                  <div
                    :class="['checked-warp']"
                    @click="handlerChecked(item, index, val, ind, v, i)"
                  >
                    <!-- :class="['checked-warp', 'not']" -->
                    <!-- <span :class="['checked',detailLists.includes(v.id) && 'checked-active']" />  -->
                    <!-- <span
                      :class="['checked', 'checked-active', 'checked-disabled']"
                    />-->
                    <span
                      style="margin-right: 5px;"
                    >{{v.product_main ? v.product_main.bar_code : ''}}</span>
                  </div>
                </li>
                <li class="item list-border details-info" style="width: 37%;">
                  <div style="width:60px; height:60px;display: flex;align-items: center;">
                    <!-- <img
                      :src="v.product_main && v.product_main.picture_main ? v.product_main.picture_main.picture_url : ''"
                      alt
                    /> -->
                    <img
                    width="50px"
                    height="50px"
                      :src="v.picture_url ? v.picture_url : ''"
                      alt
                    />
                  </div>
                  <div class>
                    <div>{{v.product_main ? v.product_main.name : ''}}</div>
                    <span>{{v.widths ? v.widths.name : ''}}</span>-
                    <span>{{v.weights ? v.weights.name : ''}}</span>
                  </div>
                </li>
                <li class="item list-border details-info" style="width: 15%;">
                  <div class>1</div>
                </li>
                <li class="item list-border details-info" style="width: 25%;">
                  <div
                    class
                  >{{v.product_sale && v.product_sale.freight_space ? v.product_sale.freight_space.name : ''}}</div>
                </li>
                <!-- <li class="item list-border details-info" style="width: 20%;">
                  <div class="">
                    物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息
                  </div>
                </li>-->
              </ul>
            </div>

            <!-- 操作 -->
            <div class="sf-md item operating" style="display: flex;flex-direction: column;">
              <div class="mar-bototm">顺丰快递</div>
              <div>
                <!-- <el-input v-model="val.logistics ? val.logistics.express_number : ''" placeholder="请输入内容"></el-input> -->
                <el-input
                  :disabled="query.status == '2'"
                  v-model="val.logistics.express_number"
                  size="mini"
                  placeholder="请输入内容"
                  @change="shuru(val)"
                ></el-input>
              </div>
            </div>
            <div class="sf-md item operating">
              <div class="ta-c">
                <!-- <div v-if="val.send_status == 1 && val.examine_status == 1 && query.status == ''"> -->
                <div v-if="query.status == 1">
                  <div
                    @click="openConfirm('2', val)"
                    style="cursor:pointer; color:rgb(64, 158, 255);"
                    class="mar-bototm"
                  >确认发货</div>
                  <div @click="cancel(item, val)" class="mar-bototm" style="cursor:pointer; color:orange;">退回审核</div>
                </div>
                <div class="mar-bototm" v-if="query.status == 2">
                  <!-- <div>确认收货</div> -->
                </div>
                <!-- <div v-if="val.send_status == 2 && query.status == ''">
                  <div @click="receipt(item, val)" style="cursor:pointer; color:red;">确认收货</div>
                </div>
                <div v-if="val.send_status == 3 && query.status == ''">
                  <div @click="evaluation(item, val)" style="cursor:pointer; color:red;">评价</div>
                </div>

                <div v-if="query.status == 1">
                  <div @click="review(item, val)" style="cursor:pointer; color:green;">审核</div>
                  <div @click="cancel(item, val)" style="cursor:pointer; color:red;">取消</div>
                </div>
                <div v-if="query.status == 2">
                  <div @click="receipt(item, val)" style="cursor:pointer; color:red;">确认收货</div>
                </div>
                <div v-if="query.status == 3">
                  <div @click="evaluation(item, val)" style="cursor:pointer; color:red;">评价</div>
                </div>-->
              </div>
            </div>
            <div class="sf-md item operating zt mar-bototm">
              <!-- {{val.send_status ? val.send_status : ''}}|{{val.examine_status ? val.examine_status : ''}} -->
              <div style="display: flex;">
                <div v-if="val.send_status == 1" style="color: green;">待发货</div>
                <div v-if="val.send_status == 2" style="color: green;">待收货</div>
                <div v-if="val.send_status == 3" style="color: green;">待评价</div>
                <div v-if="val.send_status == 4" style="color: green;">已评价</div>
                <div v-if="val.send_status == 5" style="color: green;">已取消</div>
                  <div v-if="query.status == 1 || val.send_status == 1">
                    |
                    <span v-if="val.examine_status == 1" style="color: orange;">未审核</span>
                    <span v-if="val.examine_status == 2" style="color: green;">已审核</span>
                  </div>
              </div>
              <div v-if="query.status == 2">共发货: {{val.count}}件</div>
            </div>
            <div class="sf-md item operating">{{val.transaction_at ? val.transaction_at : ''}}</div>
            <!-- <div class="sf-md item operating"></div> -->
          </div>
          <!-- <div style="position: absolute;right: -10%;top: 50%;width: 6%;transform: translate(0%,-50%);"> -->
          <div
            style=" position: absolute;
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
                      "
          >
            <div class="mar-bototm ta-c">已发货{{item.number}}次</div>
            <div @click="goShip(item)" class="ta-c" style="cursor:pointer; color: rgb(64, 158, 255);">发货详情</div>
          </div>
          <div class="clear" style="clear: both;"></div>
        </div>
      </div>
    </div>
    <sf-pagination :url="url" :query="query" @get-list="getPaginationList" ref="sfPagination"></sf-pagination>

    <el-dialog title="运单导入" :visible.sync="dialogVisible" width="30%" @close='closeFileExport'>
      <!-- <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
      <!-- <sff-file-export
        :url="url"
        @closeFileExport="closedialogVisible"
        @successFileExport="successFileExport"
      />-->
      <sff-file-export :url="url" :downloadUrl="downloadUrl" :UpdataUrl="UpdataUrl" @closeFileExport="closeFileExport" />
    </el-dialog>
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
// @ts-ignore
import SffFileExport from "@/components/common/FileExport.vue";

@Component({
  components: {
    SffFileExport
  }
})
export default class Logistics extends Vue {
  private activeName: string = "1";

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
   * 条码选中状态
   */
  private express: any[] = [];

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
      type: "Date",
      label: "发货日期",
      attribute: "time__endTime",
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
  private url: any = `${domain}/adminapi/delivery-management`;

  /**
   * 下载模板接口地址
   */
  private downloadUrl: string = `${domain}` + "/adminapi/order-logistics/export?order_ids=";
  // 提交文件
  private UpdataUrl: string = `${domain}` + `/adminapi/order-logistics/import`;

  /**
   * 分页数据传入的参数
   */
  private query: any = { status: 1 };

  created() {
    let { path, query } = this.$route;

    this.activeName = "1";

    if (query.customer_id !== undefined) {
      this.url = `${domain}/adminapi/order-send/customer`;
      this.query = query;
      this.activeName = "2";
      // http://exhibition.com/adminapi/order-send/customer?customer_id=5
    }
  }

  handleClick(tab: any, event: any) {
    this.query = { status: tab.name };
    this.url = `${domain}/adminapi/delivery-management`;

    (this.$refs.sfPagination as any).getList();

    this.dataLists = [];
    this.orderLists = [];
    this.detailLists = [];
  }

  /**
   * 分页组件数据
   */
  getPaginationList(data: any) {
    console.log(data, "dat");
    this.details = data.response.data;
    console.log(this.details, "deta");
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

      // item.order.forEach((item: any, index: any) => {
      //   const orderIndex = this.orderLists.indexOf("item.id"); //val.id
      //   if (orderIndex !== -1) {
      //     this.orderLists.splice(orderIndex, 1);
      //   } else {
      //     this.orderLists.push(item.id);
      //   }
      // });
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

      const dataId = this.dataLists.indexOf(item.id);
      if (dataId !== -1) {
        // 选择横幅
        item.order.forEach((iten: any, indx: number) => {
          let obj = {
            order_id: "",
            order_code: "",
            express_company_id: "",
            express_number: ""
          };

          obj.order_id = iten.id;
          obj.order_code = iten.code;
          obj.express_company_id = "1";
          obj.express_number = iten.logistics.express_number;

          this.express.push(obj);
        });
        console.log(this.express);
      } else {
        item.order.forEach((iten: any, indx: number) => {
          this.express.forEach((item: any, index: any) => {
            if (item.order_id === iten.id) {
              this.express.splice(index, 1);
            }
          });
        });
      }

      console.log(this.express, "express");
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

      const orderId = this.orderLists.indexOf(val.id);
      if (orderId !== -1) {
        let obj = {
          order_id: "",
          order_code: "",
          express_company_id: "",
          express_number: ""
        };

        obj.order_id = detail.id;
        obj.order_code = detail.code;
        obj.express_company_id = "1";
        obj.express_number = detail.logistics.express_number;

        this.express.push(obj);
      } else {
        this.express.forEach((item: any, index: any) => {
          if (item.order_id === val.id) {
            this.express.splice(index, 1);
          }
        });
      }

      console.log(this.express, "express");
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

  shuru(val: any) {
    this.express.forEach((item: any, index: number) => {
      if (item.order_id === val.id) {
        item.express_number = val.logistics.express_number;
      }
    });
    console.log(this.express, "express");
  }

  /**
   * 确认发货弹窗
   */
  private async openConfirm(value: string, val?: any) {
    if (!this.orderLists.length && value === "1") {
      window.$message({
        message: "请选择订单！",
        type: "warning"
      });
      return;
    }

    let flag = false;
    this.express.forEach((item: any) => {
      if (
        item.express_number === "" ||
        item.express_number === null ||
        item.express_number === undefined
      ) {
        flag = true;
      }
    });
    if (flag) {
      window.$message({
        message: "请输入快递单号！",
        type: "warning"
      });
      return;
    }

    window
      .$confirm("请确认发货信息是否输入正确？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        if (value === "1") {
          this.confirmShipAll();
        } else {
          this.confirmShip(val);
        }
      })
      .catch(() => {
        console.log("object");
      });
  }

  /**
   * 确认批量发货方法
   */
  private async confirmShipAll() {
    if (!this.orderLists.length) {
      window.$message({
        message: "请选择订单！",
        type: "warning"
      });
      return;
    }

    // let ids = this.orderLists.join(",")
    const result = await window.$request({
      // url: `${domain}` + "/adminapi/order-send/sendGood?ids=" + `${ids}`,
      url: `${domain}` + "/adminapi/order-send/sendGood",
      method: "patch",
      body: this.express
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
   * 确认发货方法
   */
  private async confirmShip(val: any) {
    let flag = false;
    if (
      val.logistics.express_number === "" ||
      val.logistics.express_number === null ||
      val.logistics.express_number === undefined
    ) {
      flag = true;
    }
    if (flag) {
      window.$message({
        message: "请输入快递单号！",
        type: "warning"
      });
      return;
    }

    let expressNew: any[] = [];
    let obj = {
      express_company_id: '1',
      express_number: val.logistics.express_number,
      order_code: val.code,
      order_id: val.id,
    }
    expressNew.push(obj)
    // this.express.forEach((item: any) => {
    //   if (item.order_id === val.id) {
    //     expressNew.push(item);
    //   }
    // });

    // console.log(expressNew, "new express");

    // let ids = this.orderLists.join(",")
    const result = await window.$request({
      // url: `${domain}` + "/adminapi/order-send/sendGood?ids=" + `${ids}`,
      url: `${domain}` + "/adminapi/order-send/sendGood",
      method: "patch",
      body: expressNew
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
   * 退回审核方法
   */
  private async cancel(item: any, val: any) {
    // if (!this.orderLists.length) {
    //   window.$message({
    //     message: "请选择订单！",
    //     type: "warning"
    //   });
    //   return;
    // }
    // let ids = this.orderLists.join(",");
    const result = await window.$request({
      url: `${domain}` + "/adminapi/order-receive/return_audit?ids=" + `${val.id}`,
      // http://exhibition.com/adminapi/order-receive/return_audit?ids=1,2,3
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

  dialogVisible = false;
  /**
   * 导入方法 
   */
  private async importOrder() {
    this.dialogVisible = true;
  }
  closeFileExport() {
    this.dialogVisible = false;
    (this.$refs.sfPagination as any).getList();
  }

  /**
   * 导出方法
   */
  private async exportOrder(item: any, val: any) {
    if (!this.orderLists.length) {
      window.$message({
        message: "请选择订单！",
        type: "warning"
      });
      return;
    }

    let ids = this.orderLists.join(",");

    const result = await window.$request({
      url:
        `${domain}` + "/adminapi/order-logistics/export?order_ids=" + `${ids}`,
      method: "get"
    });

    console.log(result.data.data, "result");

    let a = document.getElementById("downloadId");
    let a_href = document.createAttribute("href");
    let url = window.location.href.substring(4, 5);
    if (url === "s") {
      a_href.nodeValue = "https://" + result.data.data;
    } else {
      a_href.nodeValue = "http://" + result.data.data;
    }
    (a as any).setAttributeNode(a_href);
    let e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    (a as any).dispatchEvent(e);

    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    } else {
      window.$message.error(result.message);
    }
  }

  /**
   * 发货详情方法
   */
  goShip(item: any) {
    // let { path, query } = this.$route;
    // console.log(this.query, 'query');
    this.url =
      `${domain}/adminapi/order-send/customer?customer_id=` +
      `${item.customer_id}`;
    // this.query = query;
    this.activeName = '2';

    (this.$refs.sfPagination as any).getList();
  }
}
</script>

<style lang="scss">
#logistics {
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
  // padding: 0 10px 0 10px;
  background-color: #fff;
  min-height: 740px;
  .search-list {
    // margin-left: auto;
    width: 1085px;
    padding: 0 5px 0 9px;
    // margin-bottom: 15px;
    margin: 0 0 10px 0;
  }
  // font-size: 12px;
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
    width: 12%;
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
    line-height: 30px;
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
