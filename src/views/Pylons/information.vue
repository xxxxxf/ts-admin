<template>
  <div class="shelf">
    <div class="list-header">
      <h2 class="list-header-title">挂架信息</h2>

      <div class="block"></div>

      <div class="search-list shelt-search">
        <sf-search :search-source="searchSource" @search-result="onSearchResult"></sf-search>
      </div>
    </div>
    <div style="display: flex;flex-flow: row nowarp;" class="shelt-list">
      <div class="shelt-left">
        <div class="grid-content bg-purple">挂架商品列表</div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :cell-style="tableCellStyle"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          @row-click="openDetails"
        >
          <el-table-column type="index" min-width="7%"></el-table-column>
          <!-- <el-table-column type="selection" width="45"></el-table-column> -->
          <el-table-column
            style="color: rgb(12, 130, 255);"
            class="code-color"
            prop="bar_code"
            label="条码编号"
            type="cell-click"
            min-width="30%"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="name" label="商品名称" min-width="38%" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" min-width="30%">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">上架中</span>
              <span v-if="scope.row.status == 0">已下架</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-show">
          <sf-pagination :url="pageUrl" :query="query" @get-list="getPaginationList" ref="sfPagination"></sf-pagination>
        </div>
      </div>

      <div style="flex: 1; margin-left:10px;" :span="18">
        <div class="">
            <div class="btn-group fl">
                <el-button v-show="!isEdit" type="primary" size="mini" @click="handleAdd">新增</el-button>
                <el-button
                    v-show="isEdit && !isEditFlag"
                    type="primary"
                    size="mini"
                    @click="handleSave"
                >提交</el-button>
                <el-button v-show="!isEdit" type="primary" size="mini" @click="handleEdit">编辑</el-button>
                <el-button
                    v-show="isEdit && isEditFlag"
                    type="primary"
                    size="mini"
                    @click="handleSaveEdit"
                >提交</el-button>
                <el-button v-show="isEdit" type="primary" size="mini" @click="handleCancel">取消</el-button>
                <el-button v-show="!isEdit" type="primary" size="mini" @click="importOrder()">导入</el-button>
                </div>
            <div class="clear"></div>
        </div>
        <div class="details-showmessage">
          <div class="grid-content bg-purple border-b">
            <el-row :gutter="20">
              <el-col :span="8" style="padding-left:0">
                <div>商品详情</div>
              </el-col>
              <el-col :span="16" class="show-create" style="text-align: right;" v-show="!isEdit || (isEdit && isEditFlag)">
                <div>
                  <span>创建:</span>
                  <span>{{this.order.create_user ? this.order.create_user.name : ''}}</span>
                  <span>时间:</span>
                  <span>{{this.order.created_at ? this.order.created_at.substring(0, 16) : ''}}</span>
                  <span v-if="this.order.update_user !== null">修改:</span>
                  <span v-if="this.order.update_user !== null">{{this.order.update_user ? this.order.update_user.name : ''}}</span>
                  <span v-if="this.order.update_user !== null">时间:</span>
                  <span v-if="this.order.update_user !== null">{{this.order.updated_at ? this.order.updated_at.substring(0, 16) : ''}}</span>
                  <span>状态:</span>
                  <span v-if="this.order.status == 1" class="bg-blue">上架中</span>
                  <span v-if="this.order.status == 0" class="bg-red">已下架</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="Product-Information comm-sty">
            <div class="grid-content bg-purple">商品信息</div>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 fl">
                    <i>*</i>条码编号
                  </span>
                  <el-input class="fr"
                    placeholder="系统自动生成"
                    :disabled="true"
                    :value="order.bar_code ? order.bar_code : ''"
                  ></el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item pr">
                  <span class="item-title w-100 tc-r fl">
                    <i>*</i>分类
                  </span>
                  <el-input
                    class="fr"
                    v-if="!isEdit"
                    :disabled="true"
                    :value="order.category ? order.category.name : ''"
                  ></el-input>
                  <el-select class="fr" v-if="isEdit" filterable v-model="order.category_id" placeholder="请选择">
                    <el-option
                      v-for="item in category"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 tc-r fl">
                    <i>*</i>商品编码
                  </span>
                  <el-input
                    class="fr"
                    v-if="!isEdit || isEditFlag"
                    :disabled="true"
                    :value="order.product_code ? order.product_code : ''"
                  ></el-input>
                  <!-- 新增时可下拉选择 -->
                  <el-select
                    class="fr"
                    v-if="isEdit && !isEditFlag"
                    v-model="order.product_code"
                    filterable
                    @focus="clickProduct"
                    @change="getMessage"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in productList"
                      :key="item.code"
                      :label="item.code"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 tc-r">
                    <i>*</i>商品名(中)
                  </span>
                  <el-input
                    class="fr"
                    :disabled="!isEdit"
                    v-model="order.name"
                    :value="order.name ? order.name : ''"
                    :title="order.name ? order.name : ''"
                    placeholder="商品名称"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 fl">
                    <i>*</i>商品名(英)
                  </span>
                  <el-input
                    class="fr"
                    :disabled="!isEdit"
                    v-model="order.name_en"
                    :value="order.name_en ? order.name_en : ''"
                    :title="order.name_en ? order.name_en : ''"
                    placeholder="商品名称"
                  ></el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 tc-r fl">
                    <i>*</i>布类
                  </span>
                  <!-- <span v-if="!isEdit">{{order.fabrication_id.name}}</span>
                  <el-input v-if="isEdit" :disabled="true" :value="getData.name" :title="getData.name" placeholder="布类"></el-input>-->
                  <el-input
                    class="fr"
                    :disabled="true"
                    :value="order.fabrication_id ? order.fabrication_id.name : order.fabricationsName"
                    :title="order.fabrication_id ? order.fabrication_id.name : order.fabricationsName"
                    placeholder="布类"
                  ></el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title tc-r fl w-100">
                    <i>*</i>成份
                  </span>
                  <el-input
                    class="fr"
                    :disabled="true"
                    :value="contentFirst ? contentFirst : contentsStr"
                    :title="contentFirst ? contentFirst : contentsStr"
                    placeholder="成份"
                  ></el-input>
                  <!-- <el-input
                    :disabled="true"
                    :value="contentFirst ? contentFirst : contentsStr"
                    :title="contentFirst ? contentFirst : contentsStr"
                    placeholder="成份"
                  ></el-input>-->
                  <!-- <span>{{order.fabrication_id}}</span> -->
                  <!-- 先做成不可编辑的，纱别、成份、布类都不可编辑 -->
                  <!-- <el-select v-if="isEdit" v-model="contentsvalue" multiple placeholder="请选择">
                            <el-option
                                v-for="item in contents"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                  </el-select>-->
                  <!-- <el-input v-if="isEdit" v-model="order.fabrication_id" :value="order.fabrication_id" placeholder="成份"></el-input> -->
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span
                    class="item-title w-100 tc-r fl"
                  >纱别</span>
                  <el-input
                    class="fr"
                    :disabled="true"
                    :value="yarnsStr ? yarnsStr : yarnFirst"
                    :title="yarnsStr ? yarnsStr : yarnFirst"
                    placeholder="纱别"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 fl">
                    <i>*</i>门幅
                  </span>
                  <el-input
                    class="fr"
                    v-if="!isEdit"
                    :disabled="true"
                    :value="order.width_id ? order.width_id.name : ''"
                  ></el-input>
                  <el-select
                    style="margin-left:10px;"
                    class="fr"
                    filterable
                    v-if="isEdit && !isEditFlag"
                    v-model="order.width_id"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in widths"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    filterable
                    v-if="isEdit && isEditFlag"
                    v-model="order.width_id.id"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in widths"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 tc-r fl">
                    <i>*</i>克重
                  </span>
                  <el-input
                    class="fr"
                    v-if="!isEdit"
                    :disabled="true"
                    :value="order.weight_id ? order.weight_id.name : ''"
                  ></el-input>
                  <el-select
                    class="fr"
                    filterable
                    v-if="isEdit && !isEditFlag"
                    v-model="order.weight_id"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in weights"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    class="fr"
                    filterable
                    v-if="isEdit && isEditFlag"
                    v-model="order.weight_id.id"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in weights"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 tc-r fl">
                    <i>*</i>颜色
                  </span>
                  <el-input class="fr" :title="order.color" v-if="!isEdit" :disabled="true" :value="order.color ? order.color : ''"></el-input>
                  <el-input
                    class="fr"
                    v-if="isEdit"
                    v-model="order.color"
                    :value="order.color"
                    placeholder="颜色"
                  ></el-input>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title tc-r fl w-100">来源单号</span>
                  <el-input
                    class="fr"
                    v-if="!isEdit"
                    :disabled="true"
                    :value="order.resource_code ? order.resource_code : ''"
                  ></el-input>
                  <el-input
                    class="fr"
                    v-if="isEdit"
                    v-model="order.resource_code"
                    :value="order.resource_code"
                    placeholder="来源单号"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="main-table-item">
                  <span
                    class="item-title w-100 fl"
                  >客户单号</span>
                  <el-input
                    class="fr"
                    v-if="!isEdit"
                    :disabled="true"
                    :value="order.customer_code ? order.customer_code : ''"
                  ></el-input>
                  <el-input
                    class="fr"
                    v-if="isEdit"
                    v-model="order.customer_code"
                    :value="order.customer_code"
                    placeholder="客户单号"
                  ></el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <span class="item-title w-100 tc-r fl">
                  年份季度
                </span>
                <el-cascader 
                  style="width:55%;float:right;"
                  :disabled="!isEdit"
                  v-model="yearValue"
                  :options="yearOptions"
                  @change="handleChange"></el-cascader>
                <!-- <div class="main-table-item fl yearSty">
                  <span class="item-title w-100 tc-r fl">年度季度</span>
                  <div class="fr w-200">
                      <el-input
                        class="fl"
                        v-if="!isEdit"
                        :disabled="true"
                        :value="order.year ? order.year : ''"
                    ></el-input>
                    <span class="fl" v-if="!isEdit">/</span>
                    <el-input
                        class="fl"
                        v-if="!isEdit"
                        :disabled="true"
                        :value="order.quarter ? order.quarter : ''"
                    ></el-input>
                    <div
                        class="block fl"
                        v-if="isEdit"
                        style="display: inline-block;width:43%;margin-right: 20px;"
                    >
                        <el-select class="quarter-select" v-model="order.year" placeholder="年度">
                        <el-option
                            v-for="item in yearArr"
                            :key="item.yearstr"
                            :label="item.label"
                            :value="item.yearstr"
                        ></el-option>
                        </el-select>
                    </div>
                    <div class="quarter fl" v-if="isEdit">
                        <span style="margin-left:-20px;">/</span>
                        <el-select class="quarter-select" v-model="order.quarter" placeholder="季度">
                        <el-option
                            v-for="item in quarterArr"
                            :key="item.quarter"
                            :label="item.label"
                            :value="item.quarter"
                        ></el-option>
                        </el-select>
                    </div>
                  </div>
                </div> -->
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title fl w-100 tc-r">供应商</span>
                  <el-input
                    class="fr"
                    :disabled="isEdit ? false : true"
                    v-model="order.supplier"
                    :value="order.supplier ? order.supplier : ''"
                  ></el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item pr">
                  <span class="item-title fl w-100 tc-r">
                    <i>*</i>来源
                  </span>
                  <el-input
                    class="fr"
                    v-if="!isEdit"
                    :disabled="true"
                    :value="order.source_id ? order.source_id.name : ''"
                  ></el-input>
                  <!-- 新增 -->
                  <el-select
                    class="fr"
                    v-if="isEdit && !isEditFlag"
                    v-model="order.source_id"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in source"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    class="fr"
                    v-if="isEdit && isEditFlag"
                    v-model="sourNew"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in source"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="height:auto">
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 fl">
                    <i>*</i>上架状态
                  </span>
                  <template class="fr">
                      <div class="radio-div">
                        <el-radio
                            v-model="statusNum"
                            label="1"
                            
                            @change="shelfChange(1)"
                            >上架</el-radio>
                        <el-radio v-model="statusNum" @change="shelfChange(2)" label="0">下架</el-radio>
                      </div>
                    
                  </template>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span class="item-title w-100 tc-r fl">商品标签</span>
                    <el-input class="fr" v-if="!isEdit" :disabled="true" :value="label_infoStr"></el-input>
                    <el-select
                        clear="fr label-div"
                        v-if="isEdit && !isEditFlag"
                        v-model="Tagsvalue"
                        multiple
                        placeholder="请选择"
                    >
                        <el-option
                        v-for="item in productTags"
                        :key="item.name"
                        :label="item.name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-select
                        clear="fr label-div"
                        v-if="isEdit && isEditFlag"
                        v-model="TagsvalueEditID"
                        multiple
                        placeholder="请选择"
                    >
                        <el-option
                        v-for="item in productTags"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  &nbsp;&nbsp;<span class="item-title w-100 fl tc-r">商品风格</span>
                  <el-input class="fr" v-if="!isEdit" :disabled="true" :value="style_infoStr"></el-input>
                  <el-select
                    class="fr"
                    v-if="isEdit && !isEditFlag"
                    v-model="stylesvalue"
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in CommodityStyle"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <!-- 编辑 -->
                  <el-select
                    class="fr"
                    v-if="isEdit && isEditFlag"
                    v-model="StylevalueID"
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in CommodityStyle"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="main-table-item">
                  <span
                    class="item-title tc-r fl w-100"
                  >备注</span>
                  <el-input
                    class="fr"
                    :disabled="isEdit ? false : true"
                    style="width:56%;"
                    type="textarea"
                    :title="order.remark ? order.remark : ''"
                    v-model="order.remark"
                    :value="order.remark"
                    placeholder="备注"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="sales-information comm-sty">
            <div class="grid-content bg-purple">销售信息</div>
            <div class="sales-show">
              <el-row>
                <el-col :span="2">
                  <i>*</i>销售类型
                </el-col>
                <el-col :span="2">
                  <i>*</i>单价(元)
                </el-col>
                <el-col :span="2">
                  <i>*</i>单位
                </el-col>
                <el-col :span="2">
                  <i>*</i>仓位
                </el-col>
                <el-col :span="2">
                  <i>*</i>安全库存
                </el-col>
                <el-col :span="5">出入库数量</el-col>
                <el-col :span="2">实际库存</el-col>
                <el-col :span="3">出入库明细</el-col>
                <el-col :span="2">可用库存</el-col>
                <el-col :span="2">未发货数量</el-col>
              </el-row>
              <el-row class="sales-message">
                <el-col :span="2">
                  <span
                    v-if="!isEdit"
                  >{{order.sales.length >= 1 ? order.sales[0].sales_style.name : ''}}</span>
                  <!-- 新增 -->
                  <el-select v-if="isEdit && !isEditFlag" filterable v-model="order.types_id" placeholder="请选择">
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <!-- 编辑 -->
                  <el-select
                    filterable
                    :disabled="!isEdit ? true : false"
                    v-if="isEdit && isEditFlag"
                    v-model="styleNew"
                    :title="this.details.sales_style.name"
                    :value="this.details.sales_style.name"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <span v-if="!isEdit">{{order.sales.length >= 1 ? order.sales[0].price : ''}}</span>
                  <!-- 新增 -->
                  <el-input v-if="isEdit && !isEditFlag" :value="order.price" v-model="order.price" placeholder="0.01"></el-input>
                  <!-- 编辑 -->
                  <el-input
                    :disabled="!isEdit ? true : false"
                    v-if="isEdit && isEditFlag"
                    v-model="order.sales[0].price"
                    :value="order.sales.length >= 1 ? order.sales[0].price : ''"
                    placeholder="单价"
                  ></el-input>
                </el-col>
                <el-col class="pr" :span="2">
                  <span v-if="!isEdit">{{order.sales.length >= 1 ? order.sales[0].unit.name : ''}}</span>
                  <!-- 新增 -->
                  <el-select v-if="isEdit && !isEditFlag" filterable v-model="order.unit_id" placeholder="请选择">
                    <el-option
                      v-for="item in units"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <!-- 编辑 -->
                  <el-select
                    filterable
                    v-if="isEdit && isEditFlag"
                    v-model="unitNew"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in units"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col class="pr" :span="2">
                  <span
                    v-if="!isEdit"
                  >{{order.sales.length >= 1 ? order.sales[0].freight_space.name : ''}}</span>
                  <!-- 新增 -->
                  <el-select
                    filterable
                    v-if="isEdit && !isEditFlag"
                    v-model="order.freights_id"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in freights"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <!-- 编辑 -->
                  <el-select
                      filterable
                      v-if="isEdit && isEditFlag"
                      v-model="freightNew"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in freights"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <span v-if="!isEdit">{{order.sales.length >= 1 ? order.sales[0].safe_stock : ''}}</span>
                  <el-input
                    v-if="isEdit && isEditFlag"
                    v-model="order.sales[0].safe_stock"
                    :value="order.sales.length >= 1 ? order.sales[0].safe_stock : ''"
                    placeholder="安全库存"
                  ></el-input>
                  <el-input
                    v-if="isEdit && !isEditFlag"
                    v-model="order.safe_stock"
                    :value="order.safe_stock"
                    placeholder="安全库存"
                  ></el-input>
                </el-col>
                <el-col :span="5" class="btn-num">
                  <el-button class="fl" @click="stockOut(1)" :disabled="(isEdit && !isEditFlag) ? true : false">出库</el-button>
                  <el-input class="fl" v-model="order.changeNum"></el-input>
                  <el-button type="primary" class="fl" @click="stockOut(2)">入库</el-button>
                </el-col>
                <el-col :span="2">
                  <!-- <span v-if="!isEdit || (isEdit && isEditFlag)">{{order.sales.length >= 1 ? order.sales[0].real_stock : ''}}</span> -->
                  <!-- 实际库存 -->
                  <el-input v-if="isEdit && !isEditFlag" :value="order.addchangeNum" :disabled="true"></el-input>
                  <el-input
                    v-if="!isEdit || (isEdit && isEditFlag)"
                    :value="parseInt(editRealstock, 10)"
                    :disabled="true"
                  ></el-input>
                  <!-- <el-input
                    v-if="!isEdit || (isEdit && isEditFlag)"
                    :value="order.sales.length >= 1 ? order.sales[0].real_stock : 0"
                    :disabled="true"
                  ></el-input> -->
                  
                </el-col>
                <el-col :span="3">
                  <span class="detailsBtn" type="text" v-if="!this.isEdit" @click="showDetails">查看明细</span>
                </el-col>
                <el-col :span="2">
                  <!-- <span
                    v-if="!isEdit"
                  >{{order.sales.length >= 1 ? details.use_stock : order.use_stock}}</span> -->
                  <el-input
                    v-if="isEdit && !isEditFlag"
                    :value="order.addchangeuseNum"
                    :disabled="true"
                  ></el-input>
                  <el-input
                    v-if="!isEdit || (isEdit && isEditFlag)"
                    :value="parseInt(editUsestock, 10)"
                    :disabled="true"
                  ></el-input>
                  <!-- <el-input
                    v-if="!isEdit || (isEdit && isEditFlag)"
                    :value="order.sales.length >= 1 ? order.sales[0].use_stock : 0"
                    :disabled="true"
                  ></el-input> -->
                  
                </el-col>
                <el-col :span="2">
                  <!-- <span
                    v-if="!isEdit"
                  >{{order.sales.length >= 1 ? details.undelivered_stock : '0'}}</span> -->
                  <el-input
                    v-if="isEdit && !isEditFlag"
                    :value="order.undelivered_stock"
                    :disabled="true"
                  ></el-input>
                  <el-input
                    v-if="!isEdit || (isEdit && isEditFlag)"
                    :value="parseInt(editUndeliveredstock, 10)"
                    :disabled="true"
                  ></el-input>
                  <!-- <el-input
                    v-if="!isEdit || (isEdit && isEditFlag)"
                    :value="order.sales.length >= 1 ? order.sales[0].undelivered_stock : '0'"
                    :disabled="true"
                  ></el-input> -->
                  
                </el-col>
                <div class="clear"></div>
              </el-row>
            </div>
            <p class="pl-10 stock-explain">实际库存：挂架实际库存数量；可用库存:等于实际库存-销售未发货数量</p>
          </div>

          <div class="sales-information comm-sty">
            <div class="grid-content bg-purple" style="padding:0">
              <el-row>
                <el-col :span="2">
                  <i>*</i>图文描述
                </el-col>
                <el-col :span="3">请上传1-6张照片</el-col>
              </el-row>
            </div>
            <div class="pl-10">
              <el-upload
                :action="url"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :multiple="true"
                :limit="6"
                :disabled="!isEdit"
                :headers="headers"
                :on-success="handleSuccess"
                :file-list="fileList"
                :before-upload="handleBeforeUpload"
                :on-exceed="handleExce"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </div>
          </div>

          <div class="sales-information comm-sty">
            <div class="grid-content bg-purple">支付信息</div>
            <el-row>
              <el-col :span="2">
                <i>*</i>库存计数
              </el-col>
            </el-row>
            <template>
              <el-radio style="margin-left:15px;" v-model="payRadio" label="0">买家结算提交减【可用库存】</el-radio>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="bg" v-if="showDetailsFlag" @click="closeBg"></div> -->
    <div class="showDetails" v-if="showDetailsFlag">
      <div class="shelt-title">
        <div class="stock-mes">
          <div class="fl stock-num">
            <span>实际库存:</span>
            <span>{{this.editRealstock}}</span>
            <span>总入库:</span>
            <span>{{totalInStock}}</span>
            <span>总出库:</span>
            <span>{{totalOutStock}}</span>
          </div>
          <div class="close fl" @click="closeDetails">X</div>
        </div>

        <div class="show-div">序号</div>
        <!-- 操作类型 -->
        <div class="show-div">操作类型</div>
        <!-- 数量 -->
        <div class="show-div">数量</div>
        <!-- 时间 -->
        <div class="show-div time">时间</div>
        <div class="clear"></div>
      </div>
      <ul class="list">
        <li v-for="(item, index) in detailsList">
          <div class="show-div">{{index+1}}</div>
          <!-- 操作类型 -->
          <div class="show-div">{{item.style}}</div>
          <!-- 数量 -->
          <div class="show-div">{{item.num}}</div>
          <!-- 时间 -->
          <div class="show-div time">{{item.created_at}}</div>
          <div class="clear"></div>
        </li>
      </ul>
      <div class="block">
        <el-pagination
            @prev-click="prev"
            @next-click="next"
            @current-change="handleCurrentChange"
            :page-sizes="[20]"
            :page-size="100"
            layout="total, sizes, prev, pager, next"
            :total="total">
        </el-pagination>
      </div> 
    </div>
    <el-dialog title="导入信息" :visible.sync="dialogVisibleFlag" width="30%" @close='closeFileExport'>
        <sff-file-export 
            @uploadResult="showMsg" 
            :url="exportUrl" 
            :downloadUrl="downloadUrl" 
            :UpdataUrl="UpdataUrl" 
            :informationFlag="informationFlag"
            @closeFileExport="closeFileExport" />
      </el-dialog>
      <div class="upload-erorr" v-if="showUploadFlag">
          <div class="erorr-title">
              <p class="fl">错误信息</p>
              <span class="fr" @click="closeEroor">X</span>
          </div>
          <ul style="height:300px;overflow:auto">
              <li v-for="(item, index) in erorrList">
                  {{item}}
              </li>
          </ul>
      </div>
      </div> 
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
import SffFileExport from "@/components/common/FileExport.vue";

@Component({
  components: {
    SffFileExport
  }
})
export default class Information extends Vue {
  private freightNew: any = ``;
  private unitNew: any = ``;
  private styleNew: any = ``;
  private sourNew: any = ``;
  //   图片上传
  private url: any = `${domain}` + "/adminapi/upload";
//   导入
  private Excelurl: any = `${domain}` + "/adminapi/product/template";
  private dialogImageUrl: any = "";
  private headers: any = {
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  };
  private statusNum: any = "";
  private dialogVisible: boolean = false;
  private fileList: any[] = [];
  private fileListExcel: any[] = [];

  private formLabelWidth: any = "80px";
  private limitNum: any = 3;
  private uploadData: any[] = [];
  private fileUrlArr: any[] = [];
  private form: any = {};
  private isAddFlag: boolean = false;

  private order: any = {
    bar_code: "",
    category_id: "", // 分类
    source_id: "", // 来源
    name: "",
    name_en: "",
    product_code: "", // 产品编码
    fabrication_id: "", // 布类
    fabricationsName: "",
    width_id: "", // 布封,
    weight_id: "", // 克重,
    unit_id: "", // 单位
    freights_id: "", // 仓位
    types_id: "", // 销售类型
    edit_types_id: "", // 销售类型
    color: "", // 颜色,
    resource_code: "", // 来源单,
    customer_code: "", // 客户单,
    year: "", // 年,
    quarter: "", // 季度,
    supplier: "", // 供应商,
    remark: "", // 备注,
    status: "0", // 山下架  0 和 1,
    draft: "", // 是否草稿 0 ，1,
    label: "", // 标签多选 id 的数组,
    style: "", // 风格多选  id 集合,
    stockNum: "0", // 最底部的支付信息
    changeNum: 0,
    addchangeNum: 0,
    addchangeuseNum: 0,
    // editRealstock:this.order.sales[0].real_stock,
    // editUsestock:this.order.sales[0].use_stock,
    // editUndeliveredstock:this.order.sales[0].undelivered_stock,
    price: 0.01,
    sales_style: -1, // 销售类型
    sales: [],
    pictures: []
  };
  private editRealstock: number =  0;
  private editUsestock: number =  0;
  private editUndeliveredstock: number =  0;
  // private editRealstock: number =  this.order.sales[0].real_stock;
  // private editUsestock: number =  this.order.sales[0].use_stock;
  // private editUndeliveredstock: number =  this.order.sales[0].undelivered_stock;
  private payRadio: any = "0";
  private downRadio: any = "0";
  // 年度
  private yearstr: any = "";
  private yearArr: any[] = [
    { yearstr: "2016", label: "2016" },
    { yearstr: "2017", label: "2017" },
    { yearstr: "2018", label: "2018" },
    { yearstr: "2019", label: "2019" },
    { yearstr: "2020", label: "2020" },
    { yearstr: "2021", label: "2021" },
    { yearstr: "2022", label: "2022" },
    { yearstr: "2023", label: "2023" },
    { yearstr: "2024", label: "2024" },
    { yearstr: "2025", label: "2025" }
  ];
  // 季度
  private Stylevalue: any[] = [];
  private StylevalueID: any[] = [];
  private TagsvalueEditID: any[] = [];
  private quarter: any = "";
  private quarterArr: any[] = [
    { quarter: "春季", label: "春季" },
    { quarter: "夏季", label: "夏季" },
    { quarter: "秋季", label: "秋季" },
    { quarter: "冬季", label: "冬季" }
  ];
  private yearValue: any[] = []
  private yearOptions: any[] = [
    {
      value: '2017',
      label: '2017',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2018',
      label: '2018',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2019',
      label: '2019',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2020',
      label: '2020',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2021',
      label: '2021',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2022',
      label: '2022',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2023',
      label: '2023',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2024',
      label: '2024',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2025',
      label: '2025',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    },
    {
      value: '2026',
      label: '2026',
      children: [{
        value: '春季',
        label: '春季',
      },
      {
        value: '夏季',
        label: '夏季',
      },
      {
        value: '秋季',
        label: '秋季',
      },
      {
        value: '冬季',
        label: '冬季',
      }]
    }
  ]
  private handleChange() {
    console.log('111');
  }
  //   商品标签商品风格
  private Tagsvalue: any[] = [];
  private TagsvalueEdit: any[] = [];
  private stylesvalue: any[] = [];
  private stylesvalueEdit: any[] = [];

  private contentsvalue: any[] = [];
  private fabricationvalue: any[] = [];
  private productData: any[] = [];
  // 商品标签
  private productTags: any[] = [];
  //   来源
  private source: any[] = [];
  // 商品风格
  private CommodityStyle: any[] = [];
  // 单位
  private units: any[] = [];
  // 仓位
  private freights: any[] = [];
  // 分类
  private category: any[] = [];
  // 分类
  private fabrications: any[] = [];
  // 销售类型
  private types: any[] = [];
  // 布类、纱别、成份
  private getData: any = {};
  //   纱别id
  private yarnsID: any[] = [];
  private contentID: any[] = [];
  private contentIDstr: any = {};
  private contentData: any[] = [];
  // 门幅
  private widths: any[] = [];
  // 克重
  private weights: any[] = [];
  // 成分
  private contents: any = {};
  // 纱别
  private yarns: any = {};
  //   成份名字数组
  private contentsName: any[] = [];
  private contentsStr: any = "";
  private contentsscale: any[] = [];
  //   纱别名字数组
  private yarnsName: any[] = [];
  private yarnsStr: any = "";
  private isEdit: boolean = false;
  private isEditFlag: boolean = false;
  private tableData: any[] = [];

  private multipleSelection: any = {};

  //   勾选复选框获取该条数据信息
  private async handleSelectionChange(val: any) {
    console.log(val, "val88888888");
  }
  // 点击列表行切换数据
  private async getList() {
    const result = await window.$request({
      url: `${domain}` + "/adminapi/product/" + `${this.getId}`
    });
    window.localStorage.setItem("detail_key", this.getId);
    this.order = result.data.data.product_info;
    this.details = this.order.sales[0]
    this.editRealstock = this.order.sales[0].real_stock;
    this.editUsestock = this.order.sales[0].use_stock;
    this.editUndeliveredstock = this.order.sales[0].undelivered_stock;
    if (this.source && this.source.length >= 1) {
      let sourflag = false;
      this.source.forEach((item: any) => {
        if (item.id === this.order.source_id.id) {
          sourflag = true;
        }
      });
      if (sourflag) {
        this.sourNew = this.order.source_id.id
      } else {
        this.sourNew = '';
      }
    }
    if (this.details) {
      let flag = false;
      if (this.freights && this.freights.length >= 1) {
        this.freights.forEach((item: any) => {
        if (item.id === this.order.sales[0].freight_space.id) {
            flag = true;
          }
        });
        if (flag) {
          this.freightNew = this.order.sales[0].freight_space.id
        } else {
          this.freightNew = '';
        }
      }

      if (this.units && this.units.length >= 1) {
        let unitflag = false;
        this.units.forEach((item: any) => {
          if (item.id === this.order.sales[0].unit.id) {
            unitflag = true;
          }
        });
        if (unitflag) {
          this.unitNew = this.order.sales[0].unit.id
        } else {
          this.unitNew = '';
        }
      }
 
      if (this.types && this.types.length >= 1) {
        let typesflag = false;
        this.types.forEach((item: any) => {
          if (item.id === this.order.sales[0].sale_type.id) {
            typesflag = true;
          }
        });
        if (typesflag) {
          this.styleNew = this.order.sales[0].sale_type.id
        } else {
          this.styleNew = '';
        }
      }
    }
    // 获取页面数据时处理成份和纱别
    this.yarnFirst = "";
    this.order.yarn.forEach((v: any, k: number) => {
    if (v.yarns.name) {
        this.yarnFirst += v.yarns.name + "\n";
    }
    });
    this.contentsStr = "";
    this.contentFirst = "";
    this.order.yarn_contents.forEach((v: any, k: number) => {
    this.contentFirst += v.scale + "%" + v.content.name;
    });
    // 获取页面数据时处理商品标签商品风格
    this.label_infoStr = "";
    this.order.label_info.forEach((v: any, k: number) => {
    this.label_infoStr += v.name + ",";
    });
    this.style_infoStr = "";
    this.order.style_info.forEach((v: any, k: number) => {
    this.style_infoStr += v.name + ",";
    });
    //   数据源
    this.productData = result.data.data;
    // 来源
    this.source = result.data.data.product_base.source;
    //   商品标签
    this.productTags = result.data.data.product_base.tags;
    //   商品风格
    this.CommodityStyle = result.data.data.product_base.styles;
    this.Stylevalue = [];
    this.StylevalueID = [];
    let style_info: any[] = [];
    style_info = result.data.data.product_info.style_info;
    if (style_info && style_info.length >= 1) {
      style_info.forEach((item: any, index: number) => {
        if (this.CommodityStyle && this.CommodityStyle.length >= 1) {
              this.CommodityStyle.forEach((val: any) => {
                if (val.id === item.id) {
                  // 判断如果禁用的选项，编辑的时候不显示
                  this.StylevalueID.push(item.id);
                  this.Stylevalue.push(item.name);
                }
              });
            }
        // this.StylevalueID.push(item.id);
        // this.Stylevalue.push(item.name);
      });
    }
    let label_info: any[] = [];
    this.TagsvalueEditID = [];
    this.TagsvalueEdit = [];
    label_info = result.data.data.product_info.label_info;
    if (label_info && label_info.length >= 1) {
      label_info.forEach((item: any, index: number) => {
        if (this.productTags.length >= 1) {
          this.productTags.forEach((val: any) => {
            if (val.id === item.id) {
              // 判断如果禁用的选项，编辑的时候不显示
              this.TagsvalueEdit.push(item.name);
              this.TagsvalueEditID.push(item.id);
            }
          })
        }
      });
    }
    //   单位
    this.units = result.data.data.product_base.units;
    //   仓位
    this.freights = result.data.data.product_base.freights;
    //   分类
    this.category = result.data.data.product_base.category;
    // 销售类型
    this.types = result.data.data.product_base.types;
    // 布类
    this.fabrications = result.data.data.product_base.fabrications;
    // 门幅
    this.widths = result.data.data.product_base.widths;
    // 克重
    this.weights = result.data.data.product_base.weights;
    // 成分
    this.contents = result.data.data.product_base.contents;
    // 纱别
    this.yarns = result.data.data.product_base.yarns;
    this.fileList = [];
    this.fileListExcel = [];
    // this.fileList = result.data.data.product_info.pictures
    result.data.data.product_info.pictures.forEach((v: any, k: number) => {
    this.fileList.push({
        name: v.picture_url,
        url: `${domain}/upload/` + v.picture_url
    });
    });
    let status = result.data.data.product_info.status;
    this.statusNum = status.toString();
  }
  //   点击行时走接口
  private getId: any = -1;
  private detail_id: any = 0;
  private async openDetails(row: any, column: any, event: any) {
    if (this.isEdit) {
    window.$confirm("检测到未保存的内容，确定要继续吗？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "留在此页",
        cancelButtonText: "继续浏览",
        type: "warning"
    })
        .then(() => {
            // that.stayPage();
        })
        .catch(async () => {
            this.isEdit = false;
            this.isEditFlag = false;
            this.getId = row.id;
            // let id = row.id;
            this.getList();
            
            // location.reload();
        });
    } else {
        this.getId = row.id;
        // let id = row.id;
        // const result = await window.$request({
        // url: `${domain}` + "/adminapi/product/" + `${id}`
        // });
        // this.order = result.data.data.product_info;
        // // 获取页面数据时处理成份和纱别
        // this.yarnFirst = "";
        // this.order.yarn.forEach((v: any, k: number) => {
        // if (v.yarns.name) {
        //     this.yarnFirst += v.yarns.name + "\n";
        // }
        // });
        // this.contentsStr = "";
        // this.contentFirst = "";
        // this.order.yarn_contents.forEach((v: any, k: number) => {
        // this.contentFirst += v.scale + "%" + v.content.name;
        // });
        // // 获取页面数据时处理商品标签商品风格
        // this.label_infoStr = "";
        // this.order.label_info.forEach((v: any, k: number) => {
        // this.label_infoStr += v.name + ",";
        // });
        // this.style_infoStr = "";
        // this.order.style_info.forEach((v: any, k: number) => {
        // this.style_infoStr += v.name + ",";
        // });
        // //   数据源
        // this.productData = result.data.data;
        // // 来源
        // this.source = result.data.data.product_base.source;
        // //   商品标签
        // this.productTags = result.data.data.product_base.tags;
        // //   商品风格
        // this.CommodityStyle = result.data.data.product_base.styles;
        // this.Stylevalue = [];
        // this.StylevalueID = [];
        // let style_info: any[] = [];
        // style_info = result.data.data.product_info.style_info;
        // style_info.forEach((item: any, index: number) => {
        // this.Stylevalue.push(item.name);
        // this.StylevalueID.push(item.id);
        // });
        // let label_info: any[] = [];
        // this.TagsvalueEditID = [];
        // this.TagsvalueEdit = [];
        // label_info = result.data.data.product_info.label_info;
        // label_info.forEach((item: any, index: number) => {
        // this.TagsvalueEdit.push(item.name);
        // this.TagsvalueEditID.push(item.id);
        // });
        // //   单位
        // this.units = result.data.data.product_base.units;
        // //   仓位
        // this.freights = result.data.data.product_base.freights;
        // //   分类
        // this.category = result.data.data.product_base.category;
        // // 销售类型
        // this.types = result.data.data.product_base.types;
        // // 布类
        // this.fabrications = result.data.data.product_base.fabrications;
        // // 门幅
        // this.widths = result.data.data.product_base.widths;
        // // 克重
        // this.weights = result.data.data.product_base.weights;
        // // 成分
        // this.contents = result.data.data.product_base.contents;
        // // 纱别
        // this.yarns = result.data.data.product_base.yarns;
        // this.fileList = [];
        // this.fileListExcel = [];
        // // this.fileList = result.data.data.product_info.pictures
        // result.data.data.product_info.pictures.forEach((v: any, k: number) => {
        // this.fileList.push({
        //     name: v.picture_url,
        //     url: `${domain}/upload/` + v.picture_url
        // });
        // });
        // let status = result.data.data.product_info.status;
        // this.statusNum = status.toString();
        this.getList();
    }
    
    
  }
  // 行变色
  tableRowClassName({ row }: any) {
    // 从菜单点击染详情进入到详情页默认选中第一条数据
    if (row.id === this.getId) {
      return "current-row";
    }
    let id: any = window.localStorage.getItem("detail_key");
    if (row.id === parseInt(id, 10) && this.getId === -1) {
      return "current-row";
    }
  }
  private yarnFirst: any = "";
  private contentFirst: any = "";
  //   商品标签商品风格
  private label_infoStr: any = "";
  private style_infoStr: any = "";
  private details: any = {}
  private async created() {
    const accessToken = localStorage.getItem("accessToken");
    this.headers.Authorization = "Bearer " + accessToken;
    //   页面加载时默认获取第一条数据的信息
    let key = window.localStorage.getItem("detail_key")
    setTimeout( async () => {
        if (window.localStorage.getItem("detail_key")) {
        let getID = window.localStorage.getItem("detail_key");
        const result = await window.$request({
          url: `${domain}` + "/adminapi/product/" + `${getID}`
        });
        this.order = result.data.data.product_info;
        this.yearValue = [this.order.year, this.order.quarter]
        this.editRealstock = this.order.sales[0].real_stock;
        this.editUsestock = this.order.sales[0].use_stock;
        this.editUndeliveredstock = this.order.sales[0].undelivered_stock;
      // 获取页面数据时处理成份和纱别
        this.yarnFirst = "";
        this.order.yarn.forEach((v: any, k: number) => {
          if (v.yarns.name) {
            this.yarnFirst += v.yarns.name + "\n";
          }
        });
        this.contentsStr = "";
        this.contentFirst = "";
        this.order.yarn_contents.forEach((v: any, k: number) => {
          this.contentFirst += v.scale + "%" + v.content.name;
        });
        // 获取页面数据时处理商品标签商品风格
        this.label_infoStr = "";
        this.order.label_info.forEach((v: any, k: number) => {
          this.label_infoStr += v.name + ",";
        });
        this.style_infoStr = "";
        this.order.style_info.forEach((v: any, k: number) => {
          this.style_infoStr += v.name + ",";
        });
        //   数据源
        this.productData = result.data.data;
        // 来源
        this.source = result.data.data.product_base.source;
        //   商品标签
        this.productTags = result.data.data.product_base.tags;
        //   商品风格
        this.CommodityStyle = result.data.data.product_base.styles;
        this.Stylevalue = [];
        this.StylevalueID = [];
        let style_info: any[] = [];
        style_info = result.data.data.product_info.style_info;
        if (style_info && style_info.length >= 1) {
          style_info.forEach((item: any, index: number) => {
            if (this.CommodityStyle && this.CommodityStyle.length >= 1) {
              this.CommodityStyle.forEach((val: any) => {
                if (val.id === item.id) {
                  // 判断如果禁用的选项，编辑的时候不显示
                  this.StylevalueID.push(item.id);
                  this.Stylevalue.push(item.name);
                }
              });
            }
            // this.StylevalueID.push(item.id);
            // this.Stylevalue.push(item.name);
          });
        }
        
        let label_info: any[] = [];
        this.TagsvalueEditID = [];
        this.TagsvalueEdit = [];
        label_info = result.data.data.product_info.label_info;
        if (label_info && label_info.length >= 1) {
          label_info.forEach((item: any, index: number) => {
            if (this.productTags.length >= 1) {
              this.productTags.forEach((val: any) => {
                if (val.id === item.id) {
                  // 判断如果禁用的选项，编辑的时候不显示
                  this.TagsvalueEdit.push(item.name);
                  this.TagsvalueEditID.push(item.id);
                }
              })  
            }
            
          });
        }
        
        //   单位
        this.units = result.data.data.product_base.units;
        //   仓位
        this.freights = result.data.data.product_base.freights;
        //   分类
        this.category = result.data.data.product_base.category;
        // 销售类型
        this.types = result.data.data.product_base.types;
        // 布类
        this.fabrications = result.data.data.product_base.fabrications;
        // 门幅
        this.widths = result.data.data.product_base.widths;
        // 克重
        this.weights = result.data.data.product_base.weights;
        // 成分
        this.contents = result.data.data.product_base.contents;
        // 纱别
        this.yarns = result.data.data.product_base.yarns;
        this.fileList = [];
        this.fileListExcel = [];
        result.data.data.product_info.pictures.forEach((v: any, k: number) => {
          this.fileList.push({
            name: v.picture_url,
            url: `${domain}/upload/` + v.picture_url
          });
        });
        let status = result.data.data.product_info.status;
        this.statusNum = status.toString();
        setTimeout(() => {
          // 后执行才有数据，判断如果仓位、单位等禁用之后，编辑时不显示已经禁用的选项
          this.details = this.order.sales[0]
          if (this.source && this.source.length >= 1) {
            let sourflag = false;
            this.source.forEach((item: any) => {
              if (item.id === this.order.source_id.id) {
                sourflag = true;
              }
            });
            if (sourflag) {
              this.sourNew = this.order.source_id.id
            } else {
              this.sourNew = '';
            }
          }
          if (this.details) {
            let flag = false;
            if (this.freights && this.freights.length >= 1) {
              this.freights.forEach((item: any) => {
              if (item.id === this.order.sales[0].freight_space.id) {
                  flag = true;
                }
              });
              if (flag) {
                this.freightNew = this.order.sales[0].freight_space.id
              } else {
                this.freightNew = '';
              }
            }

            if (this.units && this.units.length >= 1) {
              let unitflag = false;
              this.units.forEach((item: any) => {
                if (item.id === this.order.sales[0].unit.id) {
                  unitflag = true;
                }
              });
              if (unitflag) {
                this.unitNew = this.order.sales[0].unit.id
              } else {
                this.unitNew = '';
              }
            }
      
            if (this.types && this.types.length >= 1) {
              let typesflag = false;
              this.types.forEach((item: any) => {
                if (item.id === this.order.sales[0].sale_type.id) {
                  typesflag = true;
                }
              });
              if (typesflag) {
                this.styleNew = this.order.sales[0].sale_type.id
              } else {
                this.styleNew = '';
              }
            }
          }
      }, 1000)
    }
    }, 1000);
    
  }
  // 分页 url
  private pageUrl: string = `${domain}/adminapi/product`;
  private query: any = {};
  /**
   * 分页组件请求
   */
  private Index: any = -1;
  async getPaginationList(data: any) {
    this.tableData = data.response.data;
    // 页面刷新时存列表第一条数据的id
    if (this.tableData.length >= 1) {
      let lastId = this.tableData[0].id;
      window.localStorage.setItem("detail_key", lastId);
      // 搜索默认显示第一条数据详细信息
      let result: any = await window.$request({
          url: `${domain}` + "/adminapi/product/" + `${lastId}`
      });
      this.order = result.data.data.product_info;
      setTimeout(async () => {
        this.details = this.order.sales[0]
        this.editRealstock = this.order.sales[0].real_stock;
        this.editUsestock = this.order.sales[0].use_stock;
        this.editUndeliveredstock = this.order.sales[0].undelivered_stock;
        if (this.source && this.source.length >= 1) {
          let sourflag = false;
          this.source.forEach((item: any) => {
            if (item.id === this.order.source_id.id) {
              sourflag = true;
            }
          });
          if (sourflag) {
            this.sourNew = this.order.source_id.id
          } else {
            this.sourNew = '';
          }
        }
        if (this.details) {
          let flag = false;
          if (this.freights && this.freights.length >= 1) {
            this.freights.forEach((item: any) => {
            if (item.id === this.order.sales[0].freight_space.id) {
                flag = true;
              }
            });
            if (flag) {
              this.freightNew = this.order.sales[0].freight_space.id
            } else {
              this.freightNew = '';
            }
          }

          if (this.units && this.units.length >= 1) {
            let unitflag = false;
            this.units.forEach((item: any) => {
              if (item.id === this.order.sales[0].unit.id) {
                unitflag = true;
              }
            });
            if (unitflag) {
              this.unitNew = this.order.sales[0].unit.id
            } else {
              this.unitNew = '';
            }
          }
    
          if (this.types && this.types.length >= 1) {
            let typesflag = false;
            this.types.forEach((item: any) => {
              if (item.id === this.order.sales[0].sale_type.id) {
                typesflag = true;
              }
            });
            if (typesflag) {
              this.styleNew = this.order.sales[0].sale_type.id
            } else {
              this.styleNew = '';
            }
          }
        }
        // 获取页面数据时处理成份和纱别
        this.yarnFirst = "";
        this.order.yarn.forEach((v: any, k: number) => {
        if (v.yarns.name) {
            this.yarnFirst += v.yarns.name + "\n";
        }
        });
        this.contentsStr = "";
        this.contentFirst = "";
        this.order.yarn_contents.forEach((v: any, k: number) => {
        this.contentFirst += v.scale + "%" + v.content.name;
        });
        // 获取页面数据时处理商品标签商品风格
        this.label_infoStr = "";
        this.order.label_info.forEach((v: any, k: number) => {
        this.label_infoStr += v.name + ",";
        });
        this.style_infoStr = "";
        this.order.style_info.forEach((v: any, k: number) => {
        this.style_infoStr += v.name + ",";
        });
        //   数据源
        this.productData = result.data.data;
        // 来源
        this.source = result.data.data.product_base.source;
        //   商品标签
        this.productTags = result.data.data.product_base.tags;
        //   商品风格
        this.CommodityStyle = result.data.data.product_base.styles;
        this.Stylevalue = [];
        this.StylevalueID = [];
        let style_info: any[] = [];
        style_info = result.data.data.product_info.style_info;
        if (style_info && style_info.length >= 1) {
          style_info.forEach((item: any, index: number) => {
            if (this.CommodityStyle && this.CommodityStyle.length >= 1) {
                  this.CommodityStyle.forEach((val: any) => {
                    if (val.id === item.id) {
                      // 判断如果禁用的选项，编辑的时候不显示
                      this.StylevalueID.push(item.id);
                      this.Stylevalue.push(item.name);
                    }
                  });
                }
            // this.StylevalueID.push(item.id);
            // this.Stylevalue.push(item.name);
          });
        }
        let label_info: any[] = [];
        this.TagsvalueEditID = [];
        this.TagsvalueEdit = [];
        label_info = result.data.data.product_info.label_info;
        if (label_info && label_info.length >= 1) {
          label_info.forEach((item: any, index: number) => {
            if (this.productTags.length >= 1) {
              this.productTags.forEach((val: any) => {
                if (val.id === item.id) {
                  // 判断如果禁用的选项，编辑的时候不显示
                  this.TagsvalueEdit.push(item.name);
                  this.TagsvalueEditID.push(item.id);
                }
              })
            }
          });
        }
        //   单位
        this.units = result.data.data.product_base.units;
        //   仓位
        this.freights = result.data.data.product_base.freights;
        //   分类
        this.category = result.data.data.product_base.category;
        // 销售类型
        this.types = result.data.data.product_base.types;
        // 布类
        this.fabrications = result.data.data.product_base.fabrications;
        // 门幅
        this.widths = result.data.data.product_base.widths;
        // 克重
        this.weights = result.data.data.product_base.weights;
        // 成分
        this.contents = result.data.data.product_base.contents;
        // 纱别
        this.yarns = result.data.data.product_base.yarns;
        this.fileList = [];
        this.fileListExcel = [];
        // this.fileList = result.data.data.product_info.pictures
        result.data.data.product_info.pictures.forEach((v: any, k: number) => {
        this.fileList.push({
            name: v.picture_url,
            url: `${domain}/upload/` + v.picture_url
        });
        });
        let status = result.data.data.product_info.status;
        this.statusNum = status.toString();
      }, 1000)
      
    }
  }

  // 搜索条件配置
  private searchSource: any[] = [
    {
      type: "String",
      label: "条码编号",
      attribute: "bar_code"
    },
    {
      type: "Object",
      label: "分类",
      attribute: "category_id",
      url: `${domain}` + "/adminapi/product/baselist/category"
    },
    {
      type: "Object",
      label: "布类",
      attribute: "fabrication_id",
      url: `${domain}` + "/adminapi/product/baselist/fabrications"
    },
    // {
    //   type: "Object",
    //   label: "商品编码",
    //   attribute: "product_code",
    //   url: `${domain}` + "/adminapi/product/baselist/product"
    // },
    {
      type: "String",
      label: "商品名称",
      attribute: "name"
    },
    {
        type: "Select",
        label: "状态",
        value: [{ label: "上架中", value: 1 }, { label: "已下架", value: 0 }],
        attribute: "status"
    },
    {
      type: "Object",
      label: "克重",
      attribute: "weight_id",
      url: `${domain}` + "/adminapi/product/baselist/fabric_weights"
    },
    // {
    //   type: "Object",
    //   label: "状态",
    //   attribute: "status"
    // }
  ];
  // 搜索
  onSearchResult(url: any) {
    this.handleSearch(url);
  }
  // 点击搜索方法
  private async handleSearch(url?: any) {
    // console.log(url, "qqqqqqqqqqqq");
  }
  private async setlabel(data: any) {
    let goodsArr: any = [];
    if (data && data.length) {
      data.forEach((item: any, index: number) => {
        goodsArr.push(item.name);
      });
    }
    return goodsArr;
  }
  // 分类
  // private category: any = ''
  private selectCategory(order: any) {
    // console.log(order, "order--------");
  }

  //   输入商品失去焦点后获取布类、纱别、成份
  private async getMessage() {
    let result: any = await window.$request.post(
      `${domain}` + "/adminapi/product/match",
      {
        body: {
          code: this.order.product_code
        }
      }
    );
    this.contentData = [];
    this.yarnsID = [];
    this.getData = result.data.data;
    this.order.name = this.getData.name;
    this.order.name_en = this.getData.name_en;
    this.order.fabricationsName = "";
    this.fabrications.forEach((v: any, k: any) => {
      if (v.id === this.getData.fabrication_id) {
        this.order.fabricationsName = v.name;
      }
    });
    this.contentsscale = [];
    this.getData.contents.forEach((val: any, index: number) => {
      this.contentsscale.push(val.scale);
      this.contentID.push(val.yarn_type_id);
      this.contents.forEach((v: any, k: number) => {
        if (val.yarn_type_id === v.id) {
          this.contentsName.push(v.name);
        }
      });
    });
    this.contentsStr = "";
    this.contentsscale.forEach((v: any, k: number) => {
      this.contentsName.forEach((val: any, index: number) => {
        if (k === index) {
          this.contentsStr += v + "%" + val;
        }
      });
      this.contentID.forEach((val: any, index: number) => {
        if (k === index) {
          this.contentData.push({ content_id: val, scale: v });
        }
      });
    });
    this.yarnsStr = "";
    this.getData.yarns.forEach((val: any, index: number) => {
      this.yarnsID.push(val.yarn_type_id);
      this.yarns.forEach((v: any, k: number) => {
        if (val.yarn_type_id === v.id) {
          this.yarnsStr += v.name + "\n";
        }
      });
    });
  }

  private handleBeforeUpload(file: any) {
    if (!(file.type === "image/png" || file.type === "image/jpeg")) {
      window.$message({
        showClose: true,
        message: "请上传格式为png, jpg的图片",
        type: "warning"
      });
    }

    let flag = true;

    let size = file.size / 1024 / 1024;
    // if (size >= 1.5) {
    if (size >= 0.5 ) {
        flag = false;
    }  
    if (!flag) {
         window.$message({
            message: "图片大小必须小于512kb",
            type: "error"
      });
    }  
  }
  private getid: any = "";
  private getPictrue: any[] = [];
  // 文件上传成功时的钩子
  private async handleSuccessExel(response: any, file: any, fileListExcel: any) { 
    //   console.log(fileListExcel, '4444444444');
   }
  private async handlePreview(response: any, file: any, fileListExcel: any) { 
    //   console.log(fileListExcel, '4444444444');
   }
  private async handleRemoveExcel(response: any, file: any, fileListExcel: any) { 
    //   console.log(fileListExcel, '4444444444');
   }
  private async beforeRemove(response: any, file: any, fileListExcel: any) { 
    //   console.log(fileListExcel, '4444444444');
   }
  private async handleExceed(response: any, file: any, fileListExcel: any) { 
    //   console.log(fileListExcel, '4444444444');
   }
  private async handleSuccess(response: any, file: any, fileList: any) {
    this.getPictrue = this.fileList;
    if (response.status_code === 200) {
      this.order.pictures.push(response.data);
    } else {
      // 超出最大限制不显示图片
      fileList.pop()
    }
    if (this.order.pictures.length >= 1) {
      this.order.pictures[0].main_pic = 1;
    }
  }
  private delImgID: any[] = [];
  private delImgIndex: number = 0;
  private delImgIndexstr: any[] = [];
  private async handleExce(file: any, fileList: any) {
      window.$message({
        message: "最多可以添加6张图片!",
        type: "success"
      });
  }
  // 文件列表移除文件时的钩子
  private async handleRemove(file: any, fileList: any) {
    this.delImgIndexstr = [];
    // 编辑删除图片，把删除的图片的id传给后端
    fileList.forEach((v: any, k: number) => {
      //   console.log(v,'v------')
    });
    this.order.pictures.forEach((val: any, index: number) => {
      if (file.name === val.picture_url) {
        this.delImgIndex = index;
        this.getid += val.id + "+";
      }
    });

    this.delImgIndexstr = this.getid.split("+");
    this.order.pictures.splice(this.delImgIndex, 1);
  }
  // 点击文件列表中已上传的文件时的钩子
  private async handlePictureCardPreview(file: any) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }

  //   新增
  private selectID: any = -1;
  private unitsselectID: any = -1;

  private async handleAdd() {
    let result: any = await window.$request({
      url: `${domain}` + "/adminapi/product/create"
    });
    //   数据源
    this.productData = result.data.data;
    // 来源
    this.source = result.data.data.source;
    //   商品标签
    this.productTags = result.data.data.tags;
    //   商品风格
    this.CommodityStyle = result.data.data.styles;
    //   单位
    this.units = result.data.data.units;
    this.units.forEach((v: any, k: number) => {
      if (v.options === 1) {
        this.unitsselectID = v.id;
      }
    });
    //   仓位
    this.freights = result.data.data.freights;
    //   分类
    this.category = result.data.data.category;
    // 销售类型
    this.types = result.data.data.types;
    this.types.forEach((v: any, k: number) => {
      if (v.options === 1) {
        this.selectID = v.id;
      }
    });
    // 布类
    this.fabrications = result.data.data.fabrications;
    // 门幅
    this.widths = result.data.data.widths;
    // 克重
    this.weights = result.data.data.weights;
    // 成分
    this.contents = result.data.data.contents;
    // 纱别
    this.yarns = result.data.data.yarns;
    this.statusNum = status.toString();
    this.isEdit = true;
    this.contentFirst = "";
    this.contentsStr = "";
    this.yarnsStr = "";
    this.yarnFirst = "";
    this.fileList = [];
    this.statusNum = "0";
    this.sourNew = '';
    this.details = {};
    this.styleNew = '';
    this.unitNew = '';
    this.freightNew = '';
    this.TagsvalueEditID = [];
    this.StylevalueID = [];
    this.yearValue = [];
    this.order = {
      status: "0",
      stockNum: "0",
      price: 0.01,
      sales_style: -1,
      changeNum: 0,
      addchangeNum: 0,
      addchangeuseNum: 0,
      undelivered_stock: 0,
      category_id: "", // 分类
      source_id: "", // 来源
      name: "",
      name_en: "",
      product_code: "", // 产品编码
      fabrication_id: "", // 布类
      fabricationsName: "",
      width_id: "", // 布封,
      weight_id: "", // 克重,
      unit_id: this.unitsselectID !== -1 ? this.unitsselectID : "", // 单位
      //   unit_id: 1, // 单位
      freights_id: "", // 仓位
      types_id: this.selectID !== -1 ? this.selectID : "", // 销售类型
      edit_types_id: this.selectID !== -1 ? this.selectID : "", // 销售类型
      color: "", // 颜色,
      resource_code: "", // 来源单,
      customer_code: "", // 客户单,
      year: "", // 年,
      quarter: "", // 季度,
      supplier: "", // 供应商,
      remark: "", // 备注,
      draft: "", // 是否草稿 0 ，1,
      label: "", // 标签多选 id 的数组,
      style: "", // 风格多选  id 集合,
      use_stock: 0,
      sales: [],
      pictures: []
    };
  }
  //  编辑
  private async handleEdit() {
    this.isEdit = true;
    this.isEditFlag = true;
  }

  // 新增保存
  private async handleSave() {
    if (this.order.source_id === 0 || this.order.source_id === '') {
        window.$message({
        message: "请填写来源！",
        type: "error"
      });
        return
    }
    let result: any = await window.$request.post(
      `${domain}` + "/adminapi/product",
      {
        body: {
          source_id: this.order.source_id ? this.order.source_id : 0, // 来源
          category_id: this.order.category_id ? this.order.category_id : "", // 分类
          width_id: this.order.width_id ? this.order.width_id : "", // 布封,
          weight_id: this.order.weight_id ? this.order.weight_id : "", // 克重
          unit: this.order.unit_id ? this.order.unit_id : "", // 单位
          freight_space: this.order.freights_id ? this.order.freights_id : "", // 仓位
          name: this.order.name ? this.order.name : "",
          name_en: this.order.name_en ? this.order.name_en : "",
          product_code: this.order.product_code ? this.order.product_code : "", // 产品编码
          color: this.order.color ? this.order.color : "", // 颜色,
          resource_code: this.order.resource_code
            ? this.order.resource_code
            : "", // 来源单,
          customer_code: this.order.customer_code
            ? this.order.customer_code
            : "", // 客户单,
          year: this.yearValue[0], // 年,substring(0,10)
          quarter: this.yearValue[1], // 季度,
          // year: this.order.year ? this.order.year : "", // 年,substring(0,10)
          // quarter: this.order.quarter ? this.order.quarter : "", // 季度,
          supplier: this.order.supplier ? this.order.supplier : "", // 供应商,
          remark: this.order.remark ? this.order.remark : "", // 备注,
          status: this.statusNum ? this.statusNum : 0, // 山下架  0 和 1,
          label: this.Tagsvalue ? this.Tagsvalue : "", // 标签多选 id 的数组,
          style: this.stylesvalue ? this.stylesvalue : "", // 风格多选  id 集合,
          fabrication_id: this.getData.fabrication_id
            ? this.getData.fabrication_id
            : "", // 布类
          content: this.contentData ? this.contentData : "", // 成份
          yarns: this.yarnsID ? this.yarnsID : "", // 纱别
          sales_style: this.order.types_id ? this.order.types_id : 0, // 销售类型
          safe_stock: this.order.safe_stock ? this.order.safe_stock : 0, // 安全库存
          real_stock: this.order.addchangeNum ? this.order.addchangeNum : 0, // 实际库存
          use_stock: this.order.addchangeuseNum
            ? this.order.addchangeuseNum
            : 0, // 可用库存
          price: this.order.price,
          pictures: this.order.pictures ? this.order.pictures : "", // 上传图片
          is_verify: 1
        },
        isExportFail: true // 保存时异常处理，要传此参数
      }
    );
    if (result.data.status_code === 302) {
      window
        .$confirm(result.data.message, "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          let result: any = await window.$request.post(
            `${domain}` + "/adminapi/product",
            {
              body: {
                source_id: this.order.source_id ? this.order.source_id : 0, // 来源
                category_id: this.order.category_id
                  ? this.order.category_id
                  : "", // 分类
                width_id: this.order.width_id ? this.order.width_id : "", // 布封,
                weight_id: this.order.weight_id ? this.order.weight_id : "", // 克重
                unit: this.order.unit_id ? this.order.unit_id : "", // 单位
                freight_space: this.order.freights_id
                  ? this.order.freights_id
                  : "", // 仓位
                name: this.order.name ? this.order.name : "",
                name_en: this.order.name_en ? this.order.name_en : "",
                product_code: this.order.product_code
                  ? this.order.product_code
                  : "", // 产品编码
                color: this.order.color ? this.order.color : "", // 颜色,
                resource_code: this.order.resource_code
                  ? this.order.resource_code
                  : "", // 来源单,
                customer_code: this.order.customer_code
                  ? this.order.customer_code
                  : "", // 客户单,
                year: this.yearValue[0], // 年,substring(0,10)
                quarter: this.yearValue[1], // 季度,
                // year: this.order.year ? this.order.year : "", // 年,substring(0,10)
                // quarter: this.order.quarter ? this.order.quarter : "", // 季度,
                supplier: this.order.supplier ? this.order.supplier : "", // 供应商,
                remark: this.order.remark ? this.order.remark : "", // 备注,
                status: this.statusNum ? this.statusNum : 0, // 山下架  0 和 1,
                label: this.Tagsvalue ? this.Tagsvalue : "", // 标签多选 id 的数组,
                style: this.stylesvalue ? this.stylesvalue : "", // 风格多选  id 集合,
                fabrication_id: this.getData.fabrication_id
                  ? this.getData.fabrication_id
                  : "", // 布类
                content: this.contentData ? this.contentData : "", // 成份
                yarns: this.yarnsID ? this.yarnsID : "", // 纱别
                sales_style: this.order.types_id ? this.order.types_id : 0, // 销售类型
                safe_stock: this.order.safe_stock ? this.order.safe_stock : 0, // 安全库存
                real_stock: this.order.addchangeNum
                  ? this.order.addchangeNum
                  : 0, // 实际库存
                use_stock: this.order.addchangeuseNum
                  ? this.order.addchangeuseNum
                  : 0, // 实际库存
                price: this.order.price,
                pictures: this.order.pictures ? this.order.pictures : "", // 上传图片
                is_verify: 0
              }
            }
          );
          if (result.data.status_code !== 200) {
              console.log("不是200----重复数据不能通过");
          } else {
              this.isEdit = false;
              let resultProduct: any = await window.$request({
                    url: `${domain}` + "/adminapi/product"
                });

              this.tableData = resultProduct.data.data.data;
              let idsave = this.tableData[0].id;
              let resultsave: any = await window.$request({
                url: `${domain}` + "/adminapi/product/" + `${idsave}`
            });
              this.order = resultsave.data.data.product_info;
              window.localStorage.setItem("detail_key", idsave);
              location.reload();
          }
        });
    } else if (result.data.status_code !== 200) {
      console.log("不是200----");
    } else {
      // 新增成功获取列表数据
      let result: any = await window.$request({
        url: `${domain}` + "/adminapi/product"
      });
      this.tableData = result.data.data.data;
      let id = this.tableData[0].id;
      const resultnew = await window.$request({
        url: `${domain}` + "/adminapi/product/" + `${id}`
      });
      this.order = resultnew.data.data.product_info;
      window.localStorage.setItem("detail_key", id);
      setTimeout(async () => {
        location.reload();
      }, 1000)
      
    }
  }
  // 编辑保存
  private async handleSaveEdit() {
    if (this.order.pictures.length > 0) {
        this.order.pictures[0].main_pic = 1
    }
    let picturesEdit: any[] = [];
    this.fileList.forEach((val: any, index: number) => {
      picturesEdit.push({
        name: val.name,
        url: val.url
      });
    });
    let id = this.order.id;
    let result: any = await window.$request.put(
      `${domain}` + "/adminapi/product/" + `${id}`,

      {
        body: {
          source_id: this.sourNew, // 来源
          category_id: this.order.category_id ? this.order.category_id : "", // 分类
          width_id: this.order.width_id ? this.order.width_id.id : "", // 布封,
          weight_id: this.order.weight_id ? this.order.weight_id.id : "", // 克重
          unit: this.unitNew, // 单位: this.order.freights_id
          freight_space: this.freightNew, // 仓位
          name: this.order.name ? this.order.name : "",
          name_en: this.order.name_en ? this.order.name_en : "",
          product_code: this.order.product_code ? this.order.product_code : "", // 产品编码
          color: this.order.color ? this.order.color : "", // 颜色,
          resource_code: this.order.resource_code
            ? this.order.resource_code
            : "", // 来源单,
          customer_code: this.order.customer_code
            ? this.order.customer_code
            : "", // 客户单,
          year: this.yearValue[0], // 年,substring(0,10)
          quarter: this.yearValue[1], // 季度,
          // year: this.order.year ? this.order.year : "", // 年,substring(0,10)
          // quarter: this.order.quarter ? this.order.quarter : "", // 季度,
          supplier: this.order.supplier ? this.order.supplier : "", // 供应商,
          remark: this.order.remark ? this.order.remark : "", // 备注,
          status: this.statusNum ? this.statusNum : 0, // 山下架  0 和 1,
          label: this.TagsvalueEditID ? this.TagsvalueEditID : "", // 标签多选 id 的数组,
          style: this.StylevalueID ? this.StylevalueID : "", // 风格多选  id 集合,
          safe_stock: this.order.sales[0].safe_stock, // 安全库存
          real_stock: this.details.real_stock, // 实际库存
          pictures: this.order.pictures, // 上传图片
          sales_style: this.styleNew, // 销售类型
          price: this.order.sales[0].price,
          del_img: this.delImgIndexstr // 删除图片的id集合
        }
      }
    );

    this.isEdit = false;
    this.isEditFlag = false;
    // console.log(this.order, 'this.order-----');
    // this.getId = this.order.id
    // let resultProduct: any = await window.$request({
    //   url: `${domain}` + "/adminapi/product"
    // });

    // this.tableData = resultProduct.data.data.data;
    (this.$refs.sfPagination as any).getList(); // 搜索
    setTimeout(async () => {
      let idsave = this.order.id;
      window.localStorage.setItem("detail_key", idsave);
      // const resultsave = await window.$request({
      //   url: `${domain}` + "/adminapi/product/" + `${this.getId}`
      // });
      // this.order = resultsave.data.data.product_info;
      if (this.getId === -1) {
        const resultsave = await window.$request({
          url: `${domain}` + "/adminapi/product/" + `${idsave}`
        });
        this.order = resultsave.data.data.product_info;
      } else {
        const resultsave = await window.$request({
          url: `${domain}` + "/adminapi/product/" + `${this.getId}`
        });
        this.order = resultsave.data.data.product_info;
      }
      // 获取页面数据时处理商品标签商品风格
      this.label_infoStr = "";
      this.order.label_info.forEach((v: any, k: number) => {
        this.label_infoStr += v.name + ",";
      });
      this.style_infoStr = "";
      this.order.style_info.forEach((v: any, k: number) => {
        this.style_infoStr += v.name + ",";
      });
      setTimeout(async () => {

        let idsave = this.order.id;
        window.localStorage.setItem("detail_key", idsave);
        if (this.getId === -1) {
          const resultsave = await window.$request({
            url: `${domain}` + "/adminapi/product/" + `${idsave}`
          });
          this.order = resultsave.data.data.product_info;
          this.fileList = [];
          // this.fileList = result.data.data.product_info.pictures
          resultsave.data.data.product_info.pictures.forEach((v: any, k: number) => {
          this.fileList.push({
                name: v.picture_url,
                url: `${domain}/upload/` + v.picture_url
            });
          let status = resultsave.data.data.product_info.status;
          this.statusNum = status.toString();
          });
        } else {
          const resultsave = await window.$request({
            url: `${domain}` + "/adminapi/product/" + `${this.getId}`
          });
          this.order = resultsave.data.data.product_info;
          this.fileList = [];
          // this.fileList = result.data.data.product_info.pictures
          resultsave.data.data.product_info.pictures.forEach((v: any, k: number) => {
          this.fileList.push({
                name: v.picture_url,
                url: `${domain}/upload/` + v.picture_url
            });
          let status = resultsave.data.data.product_info.status;
          this.statusNum = status.toString();
          });
        }
        
      }, 1000)
    }, 1000)
  }
  // 取消
  private async handleCancel() {
    // 取消判断如果是新增取消，则走默认第一条数据，如果是编辑取消，则走当前数据
    // let addCancelID: any = window.localStorage.getItem("detail_key");
    // let idsave = this.order.id;
    // this.isEdit = false;
    // this.isEditFlag = false;
    // if (idsave) {
    //   const resultsave = await window.$request({
    //     url: `${domain}` + "/adminapi/product/" + `${idsave}`
    //   });
    //   this.order = resultsave.data.data.product_info;
    // } else {
    //   const resultsave = await window.$request({
    //     url: `${domain}` + "/adminapi/product/" + `${addCancelID}`
    //   });
    //   this.order = resultsave.data.data.product_info;
    // }
    
    
    location.reload();
  }
  //   点击出入库
  private async stockOut(type: number) {
    if (type === 1) {
        if (this.order.changeNum > this.editUsestock) {
            window.$message({
                message: "出库数量大于可用库存时不可出库!",
                type: "success"
            });
            return;
        }
    }
    if (this.isEdit && !this.isEditFlag) {
      this.order.addchangeNum = this.order.changeNum;
      this.order.addchangeuseNum = this.order.changeNum;
      this.order.changeNum = ''
    } else {
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/inventory",
        {
          body: {
            product_sales_id:
              this.order.sales.length >= 1 ? this.order.sales[0].id : 0, // 产品分录id
            product_main_id:
              this.order.sales.length >= 1
                ? this.order.sales[0].product_main_id
                : 0, // 产品主id
            desc: this.order.create_user ? this.order.create_user.name : '', // 登陆的人名
            num: parseInt(this.order.changeNum, 10), // 减库存数
            style: type // required|integer|in:1,2,3' 1：出库 2：入库3：订单出货
          }
        }
      );
      // 点击出库
      if (type === 1) {
        this.editRealstock = this.editRealstock - parseInt(this.order.changeNum, 10)
        this.editUsestock = this.editRealstock - this.editUndeliveredstock
        this.order.changeNum = ''
      } else {
        this.editRealstock = this.editRealstock + parseInt(this.order.changeNum, 10)
        this.editUsestock = this.editRealstock - this.editUndeliveredstock
        this.order.changeNum = ''
      }
      // 点击入库
      // this.editRealstock = 
      // this.order.sales[0].use_stock =
      //   this.order.sales[0].real_stock - this.order.sales[0].undelivered_stock;
      // let id = this.order.id;
      // const resultPage = await window.$request({
      //   url: `${domain}` + "/adminapi/product/" + `${id}`
      // });
      // this.order = resultPage.data.data.product_info;
    }
  }
  //   上架限制校验库存是否大于0，为0的不允许上架
  private async shelfChange(data: any) {
    // if (data === 1 && ((this.order.sales.length >= 1 && this.order.sales[0].use_stock <= 0) || this.order.addchangeuseNum <= 0)) {
    if (data === 1 && this.editUsestock <= 0) {
      window.$message({
        message: "可用库存小于等于0时不可上架",
        type: "warning"
      });
      // this.$emit("showFileExport");
      return (this.statusNum = "0");
    } else if (data && !this.isEditFlag) {
      let id = this.order.id;
      let result: any = await window.$request.put(
        `${domain}` + "/adminapi/product/" + `${id}`,

        {
          body: {
            source_id: this.order.source_id ? this.order.source_id.id : "", // 来源
            category_id: this.order.category_id ? this.order.category_id : "", // 分类
            width_id: this.order.width_id ? this.order.width_id.id : "", // 布封,
            weight_id: this.order.weight_id ? this.order.weight_id.id : "", // 克重
            unit: this.details.unit.id, // 单位: this.order.freights_id
            freight_space: this.details.freight_space.id, // 仓位
            name: this.order.name ? this.order.name : "",
            name_en: this.order.name_en ? this.order.name_en : "",
            product_code: this.order.product_code ? this.order.product_code : "", // 产品编码
            color: this.order.color ? this.order.color : "", // 颜色,
            resource_code: this.order.resource_code
              ? this.order.resource_code
              : "", // 来源单,
            customer_code: this.order.customer_code
              ? this.order.customer_code
              : "", // 客户单,
            year: this.yearValue[0], // 年,substring(0,10)
            quarter: this.yearValue[1], // 季度,
            // year: this.order.year ? this.order.year : "", // 年,substring(0,10)
            // quarter: this.order.quarter ? this.order.quarter : "", // 季度,
            supplier: this.order.supplier ? this.order.supplier : "", // 供应商,
            remark: this.order.remark ? this.order.remark : "", // 备注,
            status: this.statusNum ? this.statusNum : 0, // 山下架  0 和 1,
            //   label: this.Tagsvalue ? this.Tagsvalue : this.order.label, // 标签多选 id 的数组,
            label: this.TagsvalueEditID ? this.TagsvalueEditID : "", // 标签多选 id 的数组,
            style: this.StylevalueID ? this.StylevalueID : "", // 风格多选  id 集合,
            safe_stock: this.details.safe_stock, // 安全库存
            real_stock: this.details.real_stock, // 实际库存
            //   pictures: pictureArr, // 上传图片
            pictures: this.order.pictures, // 上传图片
            sales_style: this.order.sales.length >= 1 ? this.details.sale_type.id : -1, // 销售类型
            price: this.order.price ? this.order.price : 0.01,
            del_img: this.delImgIndexstr // 删除图片的id集合
          },
          isExportFail: true
        }
        
    );
      if (result.data.status_code !== 200) {
          // 上下架不成功，状态不改变
          this.statusNum = this.order.status.toString();
      } else {
          this.isEdit = false;
          // let idsave = this.order.id;
          // const resultsave = await window.$request({
          //   url: `${domain}` + "/adminapi/product/" + `${idsave}`
          // });
          // this.order = resultsave.data.data.product_info;
          // let resultProduct: any = await window.$request({
          //   url: `${domain}` + "/adminapi/product"
          // });

          // this.tableData = resultProduct.data.data.data;
          // (this.$refs.sfPagination as any).getList();
          (this.$refs.sfPagination as any).getList();
          setTimeout(async () => {
            let idsave = this.order.id;
            if (this.getId === -1) {
              const resultsave = await window.$request({
                url: `${domain}` + "/adminapi/product/" + `${idsave}`
              });
              this.order = resultsave.data.data.product_info;
            } else {
              const resultsave = await window.$request({
                url: `${domain}` + "/adminapi/product/" + `${this.getId}`
              });
              this.order = resultsave.data.data.product_info;
              setTimeout(async () => {
                this.fileList = []
                resultsave.data.data.product_info.pictures.forEach((v: any, k: number) => {
                this.fileList.push({
                    name: v.picture_url,
                    url: `${domain}/upload/` + v.picture_url
                });
                });
                let status = resultsave.data.data.product_info.status;
                this.statusNum = status.toString();
              }, 1000)
              
            }
            // 获取页面数据时处理商品标签商品风格
            this.label_infoStr = "";
            this.order.label_info.forEach((v: any, k: number) => {
              this.label_infoStr += v.name + ",";
            });
            this.style_infoStr = "";
            this.order.style_info.forEach((v: any, k: number) => {
              this.style_infoStr += v.name + ",";
            });
            
            }, 500)
        }

      
    }
  }
  //   修改列表状态颜色
  private tableCellStyle({ row, column, rowIndex, columnIndex }: any) {
    if (column.label === "状态") {
      if (parseInt(row.status, 10) === 1) {
        return "color: rgb(0, 204, 51)";
      } else {
        return "color: rgb(255, 0, 0)";
      }
      return "font-size: 14px;color:#606266;";
    }
  }


  // 点击商品获取数据

  private productList: any[] = [];
  private async clickProduct() {
    const result = await window.$request({
      url: `${domain}` + "/adminapi/cloth"
    });
    this.productList = result.data.data;
  }
  private total: number = 0
  private detailsList: any[] = [];
  private showDetailsFlag: boolean = false;
  private totalInStock: number = 0;
  private totalOutStock: number = 0;
  private async showDetails() {
    this.showDetailsFlag = true;
    let id: number = this.order.sales.length >= 1 ? this.details.id : 0;
    const result = await window.$request({
      url: `${domain}` + "/adminapi/inventory?id=" + `${id}`
    });
    const resultTotal = await window.$request({
      url: `${domain}` + "/adminapi/inventory/summary/" + `${id}`
    });
    this.detailsList = result.data.data.data;
    this.Detailsurl = `${domain}` + "/adminapi/inventory?id=" + `${id}`;
    this.totalInStock = resultTotal.data.data.totalInStock;
    this.totalOutStock = resultTotal.data.data.totalOutStock;
    this.total = result.data.data.total
  }
  //   查看明细数据、分页

  private Detailsurl: any = ``;
  //   private Detailsurl: any = `${domain}` + "/adminapi/inventory"
  getPaginationDetails(data: any) {
    this.detailsList = data.response.data;
  }
  private closeDetails() {
    this.showDetailsFlag = false;
  }

  private async prev(data: any) {
      let id: number = this.order.sales.length >= 1 ? this.details.id : 0;
      const result = await window.$request({
        url: `${domain}` + "/adminapi/inventory?id=" + `${id}` + '&page=' + `${data}`
      });
      this.detailsList = result.data.data.data;
  }
  private async next(data: any) {
      let id: number = this.order.sales.length >= 1 ? this.details.id : 0;
      const result = await window.$request({
        url: `${domain}` + "/adminapi/inventory?id=" + `${id}` + '&page=' + `${data}`
      });
      this.detailsList = result.data.data.data;
  }
  private async handleCurrentChange(data: any) {
      let id: number = this.order.sales.length >= 1 ? this.details.id : 0;
      const result = await window.$request({
        url: `${domain}` + "/adminapi/inventory?id=" + `${id}` + '&page=' + `${data}`
      });
      this.detailsList = result.data.data.data;
  }

  /**
   * 导入方法
   */
  private exportUrl: string = `${domain}/adminapi/product_template`;
  private downloadUrl: string = `${domain}` + "/adminapi/product_template";
  private UpdataUrl: string = `${domain}` + "/adminapi/product/import";
  private informationFlag: boolean = true
  private dialogVisibleFlag: boolean = false
  private async importOrder() {
     this.dialogVisibleFlag = true;
  }
  private async closeFileExport() {
    this.dialogVisibleFlag = false;
    // 点击提交2s后获取最新数据
    setTimeout(async () => {
        let result: any = await window.$request({
        url: `${domain}` + "/adminapi/product"
        });
        this.tableData = result.data.data.data;
        let id = this.tableData[0].id;
        const resultnew = await window.$request({
        url: `${domain}` + "/adminapi/product/" + `${id}`
        });
        this.order = resultnew.data.data.product_info;
        window.localStorage.setItem("detail_key", id);
      }, 2000)
  }
private showUploadFlag: boolean = false
private erorrList: any[] = []
private showMsg(data: any) {
    this.erorrList = data.showData
    if (this.erorrList.length >= 1) {
        this.showUploadFlag = data.uploadResult
    }
}
private closeEroor() {
    this.showUploadFlag = false
}
private closeBg() {
    this.showDetailsFlag = false
}

}
</script>
<style lang="scss" scoped>
.shelf {
  background: #f4f7fa;
}
.list-header {
  background: #fff;
}
.shelt-left {
  margin-top: 68px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background:#FFF;
}
@media screen and (max-width: 1440px){
  .shelt-left{
    width: 30%;
    
  }
}
@media screen and (max-width: 1920px){
  .shelt-left{
    width: 23%;
    
  }
}
.clear {
  clear: both;
}
.el-row {
  margin-bottom: 20px;
  height: 30px;
  line-height: 30px;
  &:last-child {
    margin-bottom: 0;
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
  margin-bottom: 20px;
  background: #fff;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.border-b {
  border-bottom: 1px solid #ddd;
}
.information-ul {
  display: flex;
  flex-direction: row-reverse;
}
.details-showmessage {
  padding: 0 10px 20px 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.comm-sty {
  border: 1px solid #ddd;
  padding-bottom: 20px;
  font-size: 14px;
  color: #606266;
  background: #fff;
  margin-top: 20px;
}
i {
  color: red;
}
.el-input {
  width: 55%;
}
//   图片上传样式
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
//   图片上传样式结束
.sales-information .el-input {
  width: 75%;
}
.sales-information .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.el-row {
  padding-left: 10px;
  padding-right: 10px;
}
.pl-10 {
  padding-left: 10px;
}
.stock-explain{
    font-size: 12px;
    color: #606266;
}
.quarter {
  width: 40%;
}
.pr {
  position: relative;
}
.select-div {
  position: absolute;
  z-index: 9999;
  background: #ddd;
}
.select-div ul {
  width: 100px;
  max-height: 150px;
  overflow: auto;
}
.Product-Information .select-div ul {
  width: 150px;
  max-height: 200px;
  overflow: auto;
}
.select-div li {
  cursor: pointer;
}
.select-div li:hover {
  color: blue;
}
.bg-fixed {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: transparent;
  z-index: 9998;
}
.sales-message .el-col {
  height: 40px;
}
.select-btn {
  display: inline-block;
  width: 60%;
  height: 25px;
  border: 1px solid #ddd;
}
.el-select {
  float: right;
  width: 55%;
}
.sales-message .el-select {
  width: 90%;
}

.quarter-select {
  padding: 0;
  width: 100%;
}
.fl {
  float: left;
}
.list-header-title {
  font-size: 32px;
  font-weight: 400;
  height: 60px;
  line-height: 60px;
  padding-left: 10px;
}
.shelt-search {
  padding-left: 15px;
  margin: 10px 0;
}
.btn-group {
  margin: 20px 0 20px 10px;
}
.btn-num .el-button {
  width: 35px;
  height: 28px;
  line-height: 28px;
  padding: 0;
}
.btn-num .el-input {
  width: 35%;
}
.el-col-16 span {
  display: inline-block;
  margin-right: 10px;
}
@media screen and (max-width: 1920px){
  .yearSty .el-input {
    width: 47.5%;
  }
}
@media screen and (max-width: 1440px){
  .yearSty .el-input {
    width: 46.5%;
  }
  .el-input{
    width: 54%;
  }
  .w-100{
    width: 40%;
  }
  .radio-div{
    width: 60%;
  }
}
.bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
}
.showDetails {
    position: fixed;
    width: 600px;
    height: 400px;
    max-height: 500px;
    overflow: auto;
    background: #fff;
    top: 35%;
    left: 40%;
    font-size: 14px;
    z-index: 999;
    color: #606266;
    border: 1px solid #ddd;
}
.show-div {
  width: 15%;
  float: left;
  text-align: center;
  height: 30px;
  line-height: 30px;
}
.show-div:last-child {
  width: 40%;
}
.shelt-title .time {
  width: 40%;
}
.list{
    height: 290px;
    overflow: auto;
}
.list .time {
  width: 40%;
}
.list li:first-child {
  border-top: 1px solid #ddd;
}
.list li {
  border-bottom: 1px solid #ddd;
}
.stock-mes {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.stock-num {
  width: 90%;
}
.stock-num span {
  display: inline-block;
  margin-right: 15px;
}
.close {
  width: 10%;
  text-align: center;
  cursor: pointer;
}
.show-create {
  font-size: 12px;
  color: #606266;
}
.bg-blue {
  color: rgb(0, 204, 51);
}
.bg-red {
  color: red;
}
.detailsBtn {
  cursor: pointer;
}
.w-100{
    display: inline-block;
    width: 40%;
}
.fr{
    float: right;
}
.radio-div{
    width: 60%;
    float: right;
}
.el-radio{
  margin-right: 7px;
}
.tc-r{
    text-align: right;
}
.w-200{
    width: 56%;
}
.label-div{
    margin-left: 10px;
}
.label-div .el-input{
    width: 100%;
}
.upload-erorr{
    position: fixed;
    width: 400px;
    height: 350px;
    max-height: 500px;
    overflow: auto;
    background: #fff;
    top: 35%;
    left: 40%;
    font-size: 14px;
    z-index: 999;
    color: #606266;
    padding: 0 15px 0 30px;
    border: 1px solid #ddd;
}
.erorr-title{
    height: 30px;
    line-height: 30px;
    font-size: 16px;
}
.erorr-title p{
    width: 90%;
}
.erorr-title span{
    display: inline-block;
    width: 10%;
    text-align: center;
    cursor: pointer;
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