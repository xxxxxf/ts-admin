<!--

  @Description: 借阅查询
  @Author: Anthony
  @Date: 2019-09-18 12:53

-->
<template>
    <div class="dictionary">
        <div class="header">
            <h1 class="headerTitle">借阅查询</h1>
            <div class="search-list shelt-search">
                <sf-search :search-source="searchSource" @search-result="onSearchResult"></sf-search>
            </div>
        </div>
        <div class="dictionaryMain">
            <div class="leftBox fl">

                <div class="dictionaryHead">
                    <h2>借阅列表</h2>
                </div>
                <ul class="dictionaryItemHead">
                    <li><span>条码</span></li>
                    <li><span>商品名称</span></li>
                    <li><span>借阅人</span></li>
                    <li><span>操作时间</span></li>
                </ul>
                <ul class="dictionaryItem">
                   <li><span>条码</span></li>
                    <li><span>商品名称</span></li>
                    <li><span>借阅人</span></li>
                    <li><span>操作时间</span></li>
                </ul>

                <!-- <sf-Pagination ref="pagination" url="/adminapi/dictionary" @get-list="getList"/> -->
            </div>
            <div class="rightBox fl">

                <div class="">
                    <div class="dictionaryHead">
                        <h2>借阅信息</h2>
                    </div>
                    <ul class="detailsWords">
                        <li>
                            <label>
                                借阅人
                            </label>
                            <el-input :disabled="true" width="100%">
                            </el-input>
                        </li>
                        <li>
                            <label for="status">
                                部门
                            </label>
                            <el-input :disabled="true"  width="100%" clearable></el-input>
                        </li>
                        <li>
                            <label>已借数量</label>
                            <el-input :disabled="true" width="100%" clearable>
                            </el-input>
                        </li>
                    </ul>
                </div>
                <div class="show-borrow" style="calc(100%-464px);">
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
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import DataDictionaryApi from "@/api/DataDictionary.api";

    @Component
    export default class App extends Vue {
        private searchSource: any [] = [
            {
                type: "String",
                label: "条码",
                attribute: "name",
                checked: false
            },
            {
                type: "String",
                label: "商品名称",
                attribute: "name",
                checked: false
            },
            {
                type: "String",
                label: "借阅人",
                attribute: "name",
                checked: false
            },
            {
                type: "String",
                label: "部门",
                attribute: "name",
                checked: false
            },
        ];
        private tableData: any [] = [];
        private activeName: any = 'first'

        private handleClick(tab: any, event: any) {
            console.log(tab, event);
        }
        // 搜索
        onSearchResult(url: any) {
            this.handleSearch(url);
        }
        // 点击搜索方法
        private async handleSearch(url?: any) {
            console.log("")
        }


        // 获取字典的列表
        getList(data: any) {
            this.tableData = data.response.data;
            this.$nextTick(() => {
                // 第一次进页面获取第一条详情
                // this.getDetail(this.tableData[0].id, 0);
            });
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
    .search-list{
        margin-left: 10px;
    }
    .headerTitle {
        font-size: 32px;
        font-weight: 400;
        height: 60px;
        line-height: 60px;
        padding-left: 10px;
    }
    .dictionaryHead,
    .dictionaryControl {
        padding: 14px 10px;
    }

    .dictionary h2 {
        font-size: 15px;
        font-weight: 400;
    }

    .dictionaryItemHead {
        background-color: #f6f6f6;
    }

    .dictionaryItem {
        border-bottom: 1px solid #efefef;
        height: 36px;
    }

    .dictionaryItemHead li,
    .dictionaryItem li {
        display: inline-block;
        width: 25%;
        height: 36px;
        box-sizing: border-box;
    }

    .dictionaryItemHead li span,
    .dictionaryItem li span {
        display: block;
        line-height: 20px;
        height: 20px;
        padding: 8px 10px;
        width: 92%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .dictionaryMain .leftBox {
        border: 1px solid #ddd;
        display: inline-block;
        width: 450px;
        background: #fff;
        vertical-align: top;
    }

    .leftBox .el-table__body tr.current-row > td {
        background-color: #fdf3ea;
        color: #f19944;
    }
    .detailsWords {
        border-top: 1px solid #e6e6e6;
        padding: 20px 0;
    }

    .detailsWords >>> .el-input.is-disabled .el-input__inner {
        cursor: default;
        color: #666666;
    }

    .detailsWords >>> .is-disabled .el-input__suffix {
        display: none;
    }

    .detailsWords li {
        display: inline-block;
        width: 320px;
        margin: 5px 0;
    }

    .detailsWords li label {
        display: inline-block;
        width: 57px;
        text-align: right;
        margin-right: 5px;
        color: #666;
    }

    .detailsWords li label span {
        color: red;
    }

    .detailsWords li .el-input,
    .dictionaryWords li > .el-select {
        display: inline-block;
        width: 220px;
    }

    .dictionaryMain .rightBox {
        border: 1px solid #ddd;
        display: inline-block;
        margin-left:10px;
        width: calc(100% - 464px);
        background: #fff;
        vertical-align: top;
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
    .fl {
        float: left;
    }

</style>
