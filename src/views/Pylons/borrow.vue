<!--

  @Description: 挂架借阅
  @Author: Anthony
  @Date: 2019-09-18 12:53

-->
<template>
    <div class="dictionary">
        <div class="header">
            <h1 class="headerTitle">挂架借阅</h1>
        </div>
        <div class="borrow-message">
            <p class="borrow-num"> 
                <span>借阅信息</span>
                <span>已借阅信息:5</span>
            </p>
            <div class="select-message">
                <div>
                    <div class="borrower fl">
                        <span>借阅人:</span>
                        <el-select  filterable v-model="category_id" @change="selectName" placeholder="请选择">
                            <el-option
                                v-for="item in category"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <!-- <el-select v-model="borrowerName" placeholder="请选择">
                            <el-option
                                v-for="item in borrower"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select> -->
                    </div>
                    <div class="borrower fl">
                        <span>部门:</span>
                        <el-input :disabled="true" :value="department" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="borrower fl" style="margin-top:20px;">
                    <span style="margin-right:5px;">扫描条码:</span>
                    <el-input id="getCodeFocus" @focus="getCodeFocus" checked v-model="codeInput" placeholder="扫描条码" @keyup.native.enter="enterCode"></el-input>
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <div class="borrow-add">
            <ul class="borrow-title">
                <li>序号</li>
                <li class="code">条码编号</li>
                <li class="product-name">商品名称</li>
                <li class="time">操作时间</li>
                <li class="status">状态</li>
                <li>操作</li>
            </ul>
            <div class="take-code">
                <ul class="borrow-add-details" v-for="(item , index) in codeData">
                    <!-- 序号 -->
                    <li>{{index + 1}}</li>
                    <!-- 条码编号 -->
                    <li class="code">{{item.code}}</li>
                    <!-- 商品名称 -->
                    <li class="product-name">{{item.name}}</li>
                    <!-- 操作时间 -->
                    <li class="time"></li>
                    <!-- 状态 -->
                    <li class="status"></li>
                    <!-- 删除 -->
                    <li>
                        <el-button type="primary" @click="delCode(index)">删除</el-button>
                    </li>
                </ul>
                
            </div>
            <div class="btn-list">
                <el-button type="primary">赠送</el-button>
                <el-button type="primary">借出</el-button>
                <el-button type="primary">归还</el-button>
            </div>
        </div>
        <div class="show-borrow">
            <div class="tags">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="借阅中" name="first">
                        <div class="borrowing">
                            <ul class="tags-title">
                                <li>条码</li>
                                <li>数量</li>
                                <li>操作时间</li>
                                <li>状态</li>
                                <li>来源单号</li>
                                <li>成份(中)</li>
                                <li>成份(英)</li>
                                <li>纱别(英)</li>
                            </ul>
                            <ul class="tags-details">
                                <li>条码</li>
                                <li>数量</li>
                                <li>操作时间</li>
                                <li>状态</li>
                                <li>来源单号</li>
                                <li>成份(中)</li>
                                <li>成份(英)</li>
                                <li>纱别(英)</li>
                            </ul>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="历史借阅" name="second">
                        <div class="borrowing">
                            <ul class="tags-title">
                                <li>条码</li>
                                <li>数量</li>
                                <li>操作时间</li>
                                <li>状态</li>
                                <li>来源单号</li>
                                <li>成份(中)</li>
                                <li>成份(英)</li>
                                <li>纱别(英)</li>
                            </ul>
                            <ul class="tags-details">
                                <li>条码</li>
                                <li>数量</li>
                                <li>操作时间</li>
                                <li>状态</li>
                                <li>来源单号</li>
                                <li>成份(中)</li>
                                <li>成份(英)</li>
                                <li>纱别(英)</li>
                            </ul>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="全部" name="third">
                        <div class="borrowing">
                            <ul class="tags-title">
                                <li>条码</li>
                                <li>数量</li>
                                <li>操作时间</li>
                                <li>状态</li>
                                <li>来源单号</li>
                                <li>成份(中)</li>
                                <li>成份(英)</li>
                                <li>纱别(英)</li>
                            </ul>
                            <ul class="tags-details">
                                <li>条码</li>
                                <li>数量</li>
                                <li>操作时间</li>
                                <li>状态</li>
                                <li>来源单号</li>
                                <li>成份(中)</li>
                                <li>成份(英)</li>
                                <li>纱别(英)</li>
                            </ul>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {
        domain,
        client_id,
        client_secret,
        grant_type,
        scope
    } from "@/config/config";

    @Component
    export default class App extends Vue {
        // 借阅人
        private borrowerName: any = '' 
        // 条码扫码
        private codeInput: any = '' 
        // 部门
        private department: any = ""
        
        // 借阅人
        private borrower: any[] = [] 
        // 扫码数组
        private codeData: any[] = [] 
        // 分类用来测试的---
        private category: any[] = [] 
        private category_id: any = ""
        private autofocus: boolean = false
        private activeName: any = 'first'

        private async created() {
            let result: any = await window.$request({
                url: `${domain}` + "/adminapi/product/create"
            });
            this.category = result.data.data.category;
        }

        private handleClick(tab: any, event: any) {
            console.log(tab, event);
        }
        // 选择用户名之后扫码文本框自动获取焦点
        private selectName() {
            setTimeout(() => {
                let getCodeFocus: any = document.getElementById("getCodeFocus");
                getCodeFocus.focus()
            }, 500)
        }
        // 获取焦点输出
        private getCodeFocus() {
            this.codeInput = ''
            console.log(this, '获取焦点了----');
        }
        // 扫条码添加一条数据并且清空文本框的信息
        private async enterCode() {
            this.codeData.unshift({
                name: "",
                code: this.codeInput
            });
            this.codeInput = ""
        }

        // 删除一条数据
        private async delCode(index: number) {
            console.log(index, 'index');
            this.codeData.splice(index, 1)
        }
    }
</script>
<style scoped>
    .dictionary {
        font-size: 14px;
    }

    .header {
        background-color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .headerTitle {
        font-size: 32px;
        font-weight: 400;
        height: 60px;
        line-height: 60px;
        padding-left: 10px;
    }

    .dictionary h2 {
        font-size: 15px;
        font-weight: 400;
    }
    .borrow-message{
        padding: 20px 15px;
        background: #fff;
    }
    .fl {
        float: left;
    }
    .clear {
        clear: both;
    }
    .borrower {
        width: 20%;
    }
    .borrower .el-select {
        width: 75%
    }
    .borrow-num {
        height: 30px;
        line-height: 30px;
        margin-bottom: 20px;
    }
    .borrow-num span:last-child {
        display: inline-block;
        margin-left: 20px;
    }
    .borrower span {
        display: inline-block;
        margin-right: 20px;
    }
    .borrower .el-input{
        width: 75%;
    }
    .borrow-title{
        padding: 0 15px;
        height: 30px;
        line-height: 30px;
        background: #F2F6FC;
    }
    .take-code{
        max-height: 205px;
        overflow: auto;
    }
    .borrow-add-details {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        background: #fff;
        border-bottom: 1px solid #ddd;
    }
    .borrow-add ul{
        display: flex;
        flex-direction: row;
    }
    .borrow-add ul li {
        flex: 1;
    }
    .borrow-add .product-name ,
    .borrow-add .code ,
    .borrow-add .time
     {
        flex-grow:3;
    }
    .borrow-add-details .el-button{
        height: 25px;
        line-height: 25px;
        padding: 0 10px;
    }
    .btn-list {
        height: 40px;
        line-height: 40px;
        background: #fff;
        padding: 20px 0 20px 15px;
    }
    .show-borrow{
        margin-top: 40px;
        background: #fff;
    }
    .borrowing{
        margin-bottom: 50px;
    }
    .borrowing ul{
        display: flex;
        flex-direction: row;
    }
    .borrowing ul li {
        flex: 1;
    }
    .tags-title{
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        background: #F2F6FC;
    }
    .tags-details {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        border-bottom: 1px solid #ddd;
    }

</style>
