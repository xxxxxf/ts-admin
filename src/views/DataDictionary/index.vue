<!--

  @Description: 数据字典
  @Author: Jetchou
  @Date: 2019-08-22 12:53

-->
<template>
    <div class="dictionary">
        <div class="header">
            <h1 class="headerTitle">数据字典</h1>
            <div class="searchBar">
                <sf-search :search-source="searchSource"/>
            </div>
        </div>
        <div>
            <div class="dictionaryControl">
                <el-button size="mini" type="primary" v-if="!isEdit && !isArrange" @click="createNew">新建</el-button>
                <el-button size="mini" type="primary" v-if="!isEdit && !isArrange" @click="doEdit">编辑
                </el-button>
                <el-button size="mini" type="primary" v-if="!isEdit && detailsData.length>1 && !isArrange"
                           @click="doArrange"
                           >排序
                </el-button>
                <el-button size="mini" type="primary" v-if="isEdit || isArrange" @click="saveEdit">提交</el-button>
                <el-button size="mini" v-if="isEdit || isArrange" @click="cancelEdit">取消</el-button>
            </div>
        </div>
        <div class="dictionaryMain">
            <div class="leftBox">

                <div class="dictionaryHead">
                    <h2>数据字典列表</h2>
                </div>
                <ul class="dictionaryItemHead">
                    <li style="width:10%"><span>#</span></li>
                    <li><span>字典名称</span></li>
                    <li><span>有效状态</span></li>
                    <li><span>备注</span></li>
                </ul>
                <ul class="dictionaryItem" v-for="(item,key) in tableData">
                    <li style="width:10%"><span>{{key + 1 + (page - 1) * per_page}}</span></li>
                    <li><span :title="item.name" style="color:#0c82ff; cursor: pointer"
                              @click="clickDetail(item.id,key)">{{item.name}}</span></li>
                    <li><span><font
                            :color="item.status == 1?'#00CC33':'red'">{{item.status == 1?'启用':'禁用'}}</font></span></li>
                    <li><span :title="item.remarks">{{item.remarks}}</span></li>
                </ul>

                <sf-Pagination ref="pagination" url="/adminapi/dictionary" @get-list="getList"/>
            </div>
            <div class="rightBox" style="calc(100%-380px);">

                <div class="dictionaryHead">
                    <h2>数据字典名称</h2>
                    <div>创建：{{creator}} 时间：{{created_at}} &nbsp; <span v-if="updator">修改人：{{updator}}&nbsp;</span><span v-if="updated_at">时间：{{updated_at}}&nbsp;</span>
                        状态：<font
                                :color="realStatus=='启用'?'#00CC33':'red'">{{realStatus}}</font>
                    </div>
                </div>
                <ul class="detailsWords">
                    <li>
                        <label for="name">
                            <font v-if="isEdit" color="red">*</font>字典名称
                        </label>
                        <el-input :title="name" :disabled="!isEdit" v-model="name" width="100%" clearable>
                        </el-input>
                    </li>
                    <li>
                        <label for="status">
                            <font v-if="isEdit" color="red">*</font>有效状态
                        </label>
                        <el-select :disabled="!isEdit" v-model="status" placeholder="请选择">
                            <el-option v-for="(item,key) in statusOptions" :label="item.label" :value="item.value" :key="key">
                            </el-option>
                        </el-select>
                    </li>
                    <li>
                        <label for="remarks">备注</label>
                        <el-input :title="remarks" :disabled="!isEdit" v-model="remarks" width="100%" clearable>
                        </el-input>
                    </li>
                </ul>
                <div class="dictionaryHead">
                    <h2>数据字典选项</h2>
                </div>

                <ul class="detailsList detailsListHead">
                    <li style="width: 4%"><span>序号</span></li>
                    <li><span>
              <font v-if='isEdit' color="red">*</font>字典选项（中文）
            </span></li>
                    <li><span>
              <font v-if='isEdit' color="red">*</font>字典选项（英文）
            </span></li>
                    <li><span>默认选项</span></li>
                    <li><span>状态</span></li>
                    <li><span>备注</span></li>
                    <li style="width:21%;"><span>操作</span></li>
                </ul>
                <ul class="detailsList" v-for="(item,key) in detailsData">
                    <li style="width: 4%"><span>{{key+1}}</span></li>
                    <li>
                        <el-input v-if="isEdit" placeholder="请输入内容" v-model="detailsData[key].name" width="100%"
                                  clearable>
                        </el-input>
                        <span v-if="!isEdit">{{item.name}}</span>
                    </li>
                    <li>
                        <el-input v-if="isEdit" placeholder="请输入内容" v-model="detailsData[key].name_en" width="100%"
                                  clearable>
                        </el-input>
                        <span v-if="!isEdit">{{item.name_en}}</span>
                    </li>
                    <li>

                        <span v-if="isEdit" class="el-radio__input" :class="item.options == 1?'is-checked':''"
                              @click="choseOptions(key)"><span class="el-radio__inner"></span></span>
                        <span v-if="!isEdit">{{item.options == 1?'是':'否'}}</span>
                    </li>
                    <li>
                        <span>{{item.status == 1?'已启用':'已禁用'}}</span>
                    </li>
                    <li>
                        <el-input v-if="isEdit" placeholder="请输入内容" v-model="detailsData[key].remarks" width="100%"
                                  clearable>
                        </el-input>
                        <span v-if="!isEdit">{{item.remarks}}</span>
                    </li>
                    <li style="width:21%;">
                        <span v-if="!isArrange">启用状态
                        <span class="el-switch" :class="item.status == 1?'is-checked':''"
                              @click="choseStatus(key)"><span class="el-switch__core"></span></span></span>
                        &nbsp;&nbsp;
                        <el-button type="primary" size="mini" v-if="key!=0 && isArrange" @click="moveUpDetail(key)">上移
                        </el-button>

                        <el-button type="primary" size="mini" v-if="key+1!=detailsData.length && isArrange"
                                   @click="moveDownDetail(key)">下移
                        </el-button>

                        <!--el-button v-if="!item.id" type="danger" size="mini" icon="el-icon-delete"
                                   @click="delDetail(item.id,key)"></el-button-->
                    </li>
                </ul>
                <div v-if='isEdit' class="bottomButton">
                    <el-button size="mini" @click="addDetail" icon="el-icon-plus"></el-button>
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
                label: "字典名称",
                attribute: "name",
                checked: false
            }
        ];
        private tableData: any [] = [];
        private statusOptions: any [] = [
            {
                value: "启用",
                label: "启用"
            },
            {
                value: "禁用",
                label: "禁用"
            }
        ];
        private page: number = 0;

        private per_page: number = 0;

        private realStatus: any = "";

        private isEdit: any = false;

        private isArrange: any = false;

        private selectId: any = "";

        private selectKey: any = "";

        private status: any = "";

        private name: any = "";

        private remarks: any = "";

        private detailsData: any[] = [];

        private iscreateNew: any = false;

        private created_at: any = "";

        private updated_at: any = "";

        private creator: any = "";

        private updator: any = "";

        private forbiddenWord: any = "";


        // 获取字典的列表
        getList(data: any) {
            let that = this;
            let page: any = that.$route.query.page;
            let per_page: any = that.$route.query.per_page;
            if (page) {
                that.page = page
            }
            if (per_page) {
                that.per_page = per_page
            }
            that.tableData = data.response.data;
            that.$nextTick(() => {
                // 第一次进页面获取第一条详情
                that.getDetail(that.tableData[0].id, 0);
            });
        }

        // 点击列表
        clickDetail(id: number, key: number) {
            let that = this;
            let action: any = '';
            if (that.isEdit || that.isArrange) {
                window.$confirm("检测到未保存的内容，确定要继续吗？", "确认信息", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "留在此页",
                    cancelButtonText: "继续浏览",
                    type: "warning"
                })
                    .then(() => {
                        // that.stayPage();
                    })
                    .catch(() => {
                        that.getDetail(id, key);
                    });
            } else {
                that.getDetail(id, key);
            }
        }

        // 获取字典的详情
        getDetail(id: number, key: number) {
            let that = this;
            that.isEdit = false;
            that.isArrange = false;
            that.selectId = id;
            that.selectKey = key;

            async function get() {
                let response = await window.$request.get(
                    `${DataDictionaryApi.dictionary}` + id
                );
                if (response.data.data[0] !== undefined) {
                    // console.log(response.data.data[0]);
                    if (response.data.data[0].status * 1 === 1) {
                        that.status = "启用";
                        that.realStatus = "启用";
                    } else {
                        that.status = "禁用";
                        that.realStatus = "禁用";
                    }
                    that.name = response.data.data[0].name;
                    that.remarks = response.data.data[0].remarks;
                    that.detailsData = response.data.data[0].details;
                    that.created_at = response.data.data[0].created_at;
                    that.updated_at = response.data.data[0].updated_at;
                    response.data.data[0].creator ? that.creator = response.data.data[0].creator.name : that.creator = "";
                    response.data.data[0].updator ? that.updator = response.data.data[0].updator.name : that.updator = "";
                }
                let dictionaryItem = document.querySelectorAll(".dictionaryItem") as NodeListOf<HTMLElement>;
                for (let i = 0; i < dictionaryItem.length; i++) {
                    dictionaryItem[i].style.backgroundColor = "";
                }
                dictionaryItem[key].style.backgroundColor = "#dae5f5";
            }

            get();
        }

        // 点击修改
        doEdit() {
            this.isEdit = true;
            this.addDetail(); // 默认增加一条新的
        }

        // 点击排序
        doArrange() {
            this.isArrange ? this.isArrange = false : this.isArrange = true;
        }

        // 取消修改
        cancelEdit() {
            let that = this;
            that.isEdit = false;
            that.iscreateNew = false;
            that.isArrange = false;
            that.getDetail(that.selectId, that.selectKey);
        }

        // 新建字典
        createNew() {
            let that = this;
            that.isEdit = true;
            that.status = "启用";
            that.name = "";
            that.remarks = "";
            that.detailsData = [];
            that.iscreateNew = true; // 新建状态
            this.addDetail(); // 默认增加一条新的
        }

        // 字典选项选择默认选项
        choseOptions(key: number) {
            let that = this;
            for (let i = 0; i < that.detailsData.length; i++) {
                if (i !== key) {
                    that.detailsData[i].options = 0;
                }
            }
            that.detailsData[key].options * 1 === 1 ? that.detailsData[key].options = 0 : that.detailsData[key].options = 1;
        }

        // 字典选项启用状态
        choseStatus(key: number) {
            let that = this;
            if (that.detailsData[key].status !== 1) {
                that.detailsData[key].status = 1;
            } else {
                that.detailsData[key].status = 2;
            }
            // 如果不在编辑状态直接禁用
            if (!that.isEdit) {
                that.detailsData[key].status * 1 === 1 ? that.forbiddenWord = '启用成功' : that.forbiddenWord = '禁用成功';
                that.putEdit();
            }
        }

        // 保存
        saveEdit() {
            let errorMessage = "";
            let that = this;
            that.detailsData.forEach((item, key) => {
                if (item.id && (!item.name || !item.name_en)) {
                    errorMessage = "请完善字典选项信息";
                }
                if (!item.id && !item.name && item.name_en || !item.id && !item.name_en && item.name) {
                    errorMessage = "请完善字典选项信息";
                }
            });
            if (!that.name) {
                errorMessage = "请填写字典名称";
            }
            if (errorMessage) {
                window.$message({
                    message: errorMessage,
                    type: "error"
                });
                return false;
            }
            // 删除自动添加的空白项
            that.detailsData.forEach((item, key) => {
                if (!item.id && !item.name && !item.name_en) {
                    that.detailsData.splice(key, that.detailsData.length - key);
                }
            });
            if (!that.iscreateNew) {
                that.putEdit();
            } else {
                // 新增
                let postData: any = {
                    name: that.name,
                    status: that.status === "启用" ? 1 : 2,
                    remarks: that.remarks,
                    details: that.detailsData,
                };

                // console.log(postData, "postData");

                async function post() {
                    let response = await window.$request.post(
                        `${DataDictionaryApi.dictionary}`, {body: postData}
                    );
                    // console.log(response.data);
                    if (response.data.status_code !== 200) {
                        window.$message({
                            message: response.data.message,
                            type: "error"
                        });
                    } else {
                        that.isEdit = false;
                        that.iscreateNew = false;
                        window.$message({
                            message: response.data.message,
                            type: "success"
                        });
                        location.reload();
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    }
                }

                post();
            }
        }

        putEdit() {
            // 修改的保存
            let that = this;
            let postData: any = {
                id: that.selectId, // 修改时候取得ID
                name: that.name,
                status: that.status === "启用" ? 1 : 2,
                remarks: that.remarks,
                details: that.detailsData
            };

            // console.log(postData, "postData");

            async function post() {
                let response = await window.$request.put(
                    `${DataDictionaryApi.dictionary}` + that.selectId, {body: postData}
                );
                // console.log(response.data);
                if (response.data.status_code !== 200) {
                    window.$message({
                        message: response.data.message,
                        type: "error"
                    });
                } else {
                    that.isEdit = false;
                    that.isArrange = false;
                    if (that.forbiddenWord && response.data.message === "提交成功") {
                        window.$message({
                            message: that.forbiddenWord,
                            type: "success"
                        });
                        that.forbiddenWord = "";
                    } else {
                        window.$message({
                            message: response.data.message,
                            type: "success"
                        });
                    }
                    that.tableData[that.selectKey] = response.data.data[0];
                    if (response.data.data[0].status * 1 === 1) {
                        that.status = "启用";
                        that.realStatus = "启用";
                    } else {
                        that.status = "禁用";
                        that.realStatus = "禁用";
                    }
                    that.name = response.data.data[0].name;
                    that.remarks = response.data.data[0].remarks;
                    that.detailsData = response.data.data[0].details;
                    that.created_at = response.data.data[0].created_at;
                    that.updated_at = response.data.data[0].updated_at;
                    response.data.data[0].creator ? that.creator = response.data.data[0].creator.name : that.creator = "";
                    response.data.data[0].updator ? that.updator = response.data.data[0].updator.name : that.updator = "";
                    // location.reload();
                    // setTimeout(function(){ location.reload(); },1000);
                }
            }

            post();
        }

        // 增加字典选项
        addDetail() {
            let that = this;
            // console.log(this.detailsData,"this.detailsData");
            let length = that.detailsData.length;
            let seq = 0;
            if (length) {
                seq = that.detailsData[length - 1].seq + 1;
            }
            // if(lastItem.name||lastItem.name_en){
            that.$set(that.detailsData, length, {});
            that.$set(that.detailsData[length], "id", "");
            that.$set(that.detailsData[length], "name", "");
            that.$set(that.detailsData[length], "name_en", "");
            that.$set(that.detailsData[length], "options", "0");
            that.$set(that.detailsData[length], "remarks", "");
            that.$set(that.detailsData[length], "seq", seq);
            that.$set(that.detailsData[length], "status", 1);
            // }
            // console.log(that.detailsData, "that.detailsData");
        }

        // 删除字典选项
        delDetail(id: number, key: number) {
            let that = this;
            that.detailsData.splice(key, 1);
            if (id) {
                async function del() {
                    let response = await window.$request.delete(
                        `${DataDictionaryApi.dictionaryDetail}` + id
                    );
                    // console.log(response.data);
                    if (response.data.status_code !== 200) {
                        window.$message({
                            message: response.data.message,
                            type: "error"
                        });
                    } else {
                        window.$message({
                            message: response.data.message,
                            type: "success"
                        });
                    }
                }

                del();
            }
            // console.log(that.detailsData, "that.detailsData");
        }

        // 上移字典选项
        moveUpDetail(key: number) {
            let that = this;
            that.detailsData.splice(key - 1, 0, that.detailsData[key]);
            that.detailsData.splice(key + 1, 1);
            for (let i = 0; i < that.detailsData.length; i++) {
                that.$set(that.detailsData[i], "seq", i);
            }
            // console.log(that.detailsData, "that.detailsData");
        }

        // 下移字典选项
        moveDownDetail(key: number) {
            let that = this;
            that.detailsData.splice(key + 2, 0, that.detailsData[key]);
            that.detailsData.splice(key, 1);
            for (let i = 0; i < that.detailsData.length; i++) {
                that.$set(that.detailsData[i], "seq", i);
            }
            // console.log(that.detailsData, "that.detailsData");
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

    .searchBar {
        padding: 10px;
    }

    .searchBar >>> .sf-search {
        display: block;
    }

    .searchBar >>> .sf-search .search-list {
        width: 250px;
        display: inline-block;
        vertical-align: middle;
    }

    .searchBar >>> .sf-search .search-list .search-item {
        width: 250px;
    }

    .searchBar >>> .sf-search .search-btn-group {
        width: 120px;
        display: inline-block;
        padding-top: 0;
        vertical-align: middle;
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
        width: 30%;
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
        width: 380px;
        background: #fff;
        vertical-align: top;
    }

    .leftBox .el-table__body tr.current-row > td {
        background-color: #fdf3ea;
        color: #f19944;
    }

    .dictionaryMain .rightBox {
        border: 1px solid #ddd;
        display: inline-block;
        margin-left:10px;
        width: calc(100% - 400px);
        background: #fff;
        vertical-align: top;
    }

    .dictionaryControl {
         display: inline-block;
         margin-left:380px;
         vertical-align: top;
     }

    .dictionaryHead,
    .dictionaryControl {
        padding: 14px 10px;
    }

    .dictionaryHead h2 {
        display: inline-block;
    }

    .dictionaryHead div {
        float: right;
    }

    .dictionaryControl >>> .el-button--primary.is-plain:active, .dictionaryControl >>> .el-button--primary.is-plain:hover, .dictionaryControl >>> .el-button--primary.is-plain:focus {
        color: #409EFF;
        background: #ecf5ff;
        border-color: #b3d8ff;
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
        width: 90px;
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

    .detailsListHead {
        border-top: 1px solid #efefef;
        background-color: #f9f9f9;
    }

    .detailsList {
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        border-bottom: 1px solid #efefef;
    }

    .detailsList:hover {
        background-color: #f9f9f9;
    }

    .detailsList li {
        width: 13%;
        border-right: 1px solid #efefef;
        padding: 6px 10px;
    }

    .bottomButton {
        padding: 10px;
    }

    .el-switch__core {
        margin: 0;
        display: inline-block;
        position: relative;
        width: 40px;
        height: 20px;
        border: 1px solid #dcdfe6;
        outline: none;
        border-radius: 10px;
        box-sizing: border-box;
        background: #dcdfe6;
        cursor: pointer;
        transition: border-color 0.3s, background-color 0.3s;
        vertical-align: middle;
    }

    .el-switch .el-switch__core {
        width: 40px;
        border-color: rgb(255, 73, 73);
        background-color: rgb(255, 73, 73);
    }

    .is-checked .el-switch__core {
        width: 40px;
        border-color: rgb(19, 206, 102);
        background-color: rgb(19, 206, 102);
    }

    .el-switch.is-checked .el-switch__core:after {
        left: 100%;
        margin-left: -17px;
    }

    .el-switch__core:after {
        content: "";
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 100%;
        transition: all 0.3s;
        width: 16px;
        height: 16px;
        background-color: #fff;
    }

    .dictionary >>> .el-input__inner {
        height: 28px;
        line-height: 28px;
    }

    .dictionary >>> .el-input__icon {
        height: 34px;
    }

    .dictionary >>> .is-reverse {
        margin-top: -5px;
    }

</style>
