/*
 * @Author: xyd
 * @Description: Excel导入
 */
<template>
  <div class="boot-wrap">
    <div class="boot">
      <form class name="fileForm" @submit.prevent="submitForm($event)">
        <div class="boot-box clear">
          <div class="boot-left">
            <i class="boot-ico el-icon-upload">
              <!-- <svg-icon icon-class="excel" /> -->
            </i>
            <a href="javascript:;" class="file file-a pointer">
              选择文件
              <input
                v-if="informationFlag"
                type="file"
                class="pointer"
                name="file"
                value
                @change="selectFile($event)"
              />
              <input
                v-if="!informationFlag"
                type="file"
                class="pointer"
                name="finecode"
                value
                @change="selectFile($event)"
              />
            </a>
          </div>
          <div class="boot-right">
            <i class="el-icon-download boot-ico" />
            <a v-if="informationFlag" class="file" :href="urldownload">下载模板</a>
            <!-- <a v-if="informationFlag" class="file" href="http://www.exhibapi.co/template/producttemplate.xlsx">下载模板</a> -->
            <div v-if="!informationFlag" class="pointer file pointer" @click="exportOrder()">下载模板</div>
            <a id="downloadId" target="_self"></a>
            <!-- {{getUpdownUrl}} -->
          </div>
        </div>

        <div class="submit clear">
          <span
            class="submit-main ell"
            :title="name ? name : '未选择任何文件。'"
          >{{ name ? name : '未选择任何文件。' }}</span>

          <input type="submit" name value="提交" class="submit-btn pointer" @click="submits" />
        </div>
      </form>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import {
  domain,
  client_id,
  client_secret,
  grant_type,
  scope
} from "@/config/config";
@Component
export default class SffFileExport extends Vue {
  @Prop({ default: "default value" }) readonly downloadUrl!: string;
  @Prop({ default: "default value" }) readonly UpdataUrl!: string;
  // @Prop({ default: "default value" }) readonly informationFlag!: boolean;
  @Prop([String, Boolean]) readonly informationFlag: string | boolean | undefined
  @Prop({ default: "default value" }) readonly url!: string;
  @Prop({ default: "xlsx" }) readonly accept!: string;

  private name = "";
  private hostUrl = domain;
  private urldownload: string = `${domain}` + "/template/producttemplate.xlsx"
  getUpdownUrl() {
    const url = this.hostUrl.replace(/api\//, "");
    return `${url}tpl/finecode.xlsx`;
  }

  /**
   * 下载模板
   */
  private async exportOrder() {
    const result = await window.$request({
      url:
        this.downloadUrl,
      method: "get"
    });

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

    if (this.informationFlag) {
      if (result.status === 200) {
        window.$message({
          message: result.data.message,
          type: "success"
        });
      } else {
        window.$message.error(result.message);
      }
    }
  }

  /**
   * 文件导入
   * @param {obj} event 事件源对象
   */
  async submitForm(event: any) {
    if (!this.name) {
      window.$message({
        message: "请选择文件！",
        type: "warning"
      });
      // this.$emit("showFileExport");
      return;
    }

    let formData = new FormData(event.target);

    const result = await window.$request({
      url: this.UpdataUrl,
      // url: `${domain}` + `/adminapi/order-logistics/import`,
      method: "post",
      body: formData,
      isExportFail: true
     },
    );
    if (result.data && result.data.status_code === 301) {
       const obj: any = {
        uploadResult: true,
        showData: result.data.data
      }
       this.$emit("uploadResult", obj)
     }
    if (result.status === 200) {
      window.$message({
        message: result.data.message,
        type: "success"
      });
    }  else {
      window.$message.error(result.message);
    }

    // fetchPost(`${this.url}`, {
    //   data: formData
    // })
    //   .then(res => {
    //     if (res.data.data.length) {
    //       this.$message({
    //         message: `成功导入${res.data.data.length}条数据！`,
    //         type: 'success'
    //       })
    //       this.$emit('successFileExport', res.data)
    //     }
    //   })
    //   .catch(err => {
    //     this.$message({
    //       message: `${err.data.message}`,
    //       type: 'warning'
    //     })
    //   })
  }
  // 文件选择
  selectFile(event: any) {
    let isAllow = false;
    this.name = event.target.files[0].name;
    if (this.accept) {
      const accaptArr = this.accept.split("/");
      accaptArr.forEach(item => {
        if (event.target.files[0].name.indexOf("." + item) !== -1) {
          isAllow = true;
        }
      });
    } else {
      isAllow = this.isExcel(event.target.files[0].name);
    }
    if (!isAllow) {
      window.$message.warning(`请上传${this.accept}格式的文件！`);
      this.name = "";
      return;
    }
  }
  // 关闭文件导入窗口
  submits() {
    this.$emit("closeFileExport");
    // setTimeout(() => {
    //   console.log('11111111111111111118888');
    //     this.name = ''
    //   }, 0);
  }
  /**
   * @desc 验证是否是Excel文件
   * @param (String) fileName 文件名
   */
  isExcel(fileName: any) {
    return /\.(xlsx)$/.test(fileName);
  }
}
</script>

<style scoped>
.boot {
  width: 408px;
  height: 224px;
  margin: 0 auto;
  padding: 14px 10px;
  box-sizing: border-box;
  border: 2px dashed #bbb;
}

.boot-box {
  margin-top: 20px;
  clear: both;
  overflow: hidden;
}
.boot-left,
.boot-right {
  width: 182px;
  height: 104px;
  border: 1px dashed #64696a;
  float: left;
  text-align: center;
}
.boot-right {
  float: right;
}
.boot-ico {
  height: 40px;
  line-height: 40px;
  font-size: 40px;
  margin: 14px auto;
  display: block;
  text-align: center;
}

.file {
  width: 166px;
  height: 26px;
  line-height: 26px;
  display: inline-block;
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  font-size: 12px;
  border-radius: 3px;
}
.file:hover {
  color: #fff;
}
.file-a {
  position: relative;
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  font-size: 12px;
  border-radius: 3px;
}
.file-a > input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 166px;
  height: 27px;
}
.submit {
  height: 36px;
  line-height: 36px;
  margin-top: 10px;
  border: 1px dashed #64696a;
}
.submit-main {
  width: 250px;
  text-indent: 10px;
  display: inline-block;
}
.submit-btn {
  width: 81px;
  height: 24px;
  line-height: 7px;
  float: right;
  margin: 6px 8px 0 0;
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  font-size: 12px;
  border-radius: 3px;
}
</style>

