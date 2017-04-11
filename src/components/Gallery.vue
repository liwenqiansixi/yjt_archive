<template>
<div class="ec-dialog">
  <transition name="fade-gallery">
    <div class="ec-dialog-content" v-show="dialogVisible">
      <div class="ec-dialog-header">
        <div v-show="0==showSelect">
          <span class="ec-dialog-title">广告图片</span>
        </div>
        <div v-show="1==showSelect">
          <span class="ec-dialog-title ec-dialog-title-his" @click="distoryPic"><i class="iconfont icon-left-arrow"></i>选择图片</span>
          <span class="ec-dialog-title">上传图片</span>
        </div>

        <div class="ec-dialog-headerbtn" @click.stop="closeDialog()">
          <i class="iconfont icon-close"></i>
        </div>
        <div class="ec-dialog-headersearch form-group" style="display:none;">
          <input type="text" class="form-control" name="name" placeholder="查找图片" v-model="search">
        </div>
      </div>
      <!--内容区域-->
      <div class="ec-dialog-body">
        <div v-show="0==showSelect">
          <ul class="ec-dialog-body-icon">
            <li v-for="(item,index) in adImagesShow" @click.stop="selectImg(index)" class="p-r gallery-pic picture-editor">
              <div class="ec-dialog-active" v-show="item.isSelect">
                <span>
                  <i class="iconfont icon-correct"></i>
              </span>
              </div>
              <figure>
                <img :src="item.img" alt="" />
                <figcaption>{{item.desc}}</figcaption>
              </figure>
            </li>
          </ul>
        </div>
        <div v-show="1==showSelect" class="">
          <form class="form-horizontal">
            <div class="form-group form-text" v-show="false">
              <label class="col-sm-2 control-label">网络地址：</label>
              <div class="col-sm-5">
                <input type="text" class="form-control">
              </div>
              <div class="col-sm-3" style="padding-left:0;">
                <ec-button type="primary" class="form-text-btn">提取</ec-button>
              </div>
            </div>
            <div class="form-group form-upload">
              <label class="col-sm-2 control-label">本地上传：</label>
              <div class="col-sm-6">
                <upload class="from-upload" :action="uploadUrl" type="drag" :multiple="true" :default-file-list="fileList" accept="image/gif,image/jpeg,image/png">
                  <i class="el-icon-upload"></i>
                  <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </upload>
              </div>
            </div>
          </form>

        </div>
      </div>
      <!--尾部,操作按钮-->
      <div class="ec-dialog-footer" v-show="0==showSelect">
        <pagination layout="total, prev, pager, next, jumper" ref="pagination" :page-size="pageSize" :total="total" :current-page="currentPage"  @current-change="handleCurrentChange"></pagination>
        <section class="ec-button-list">
          <ec-button type="primary" @click="uploadPic()">上传</ec-button>
          <ec-button type="success" @click="daterMine()">确定选择</ec-button>
          </section>
      </div>
      <div class="ec-dialog-footer upload" v-show="1==showSelect">
        <ec-button type="primary" @click="confirmUpload()">确定</ec-button>
      </div>
    </div>
  </transition>
  <transition name="fade-gallery-mask">
    <div class="ec-dialog-mask" @click.stop="closeDialog" v-show="dialogVisible"></div>
  </transition>
</div>
</template>

<script>
import eventHub from '../eventHub'
import galleryData from '../config/gallery.js'
import {
  Pagination,
  Button,
  Upload
} from 'element-ui'
export default {
  data() {
    return {
      "adImages": [],
      "adImagesShow": [],
      "total": 0,
      "pageSize": 15,
      "currentPage": 1,
      "search": "",
      "dialogVisible": false,
      "componentType": "",
      "selectNum": 0,
      "showSelect": 0,
      "fileList": [],
      "uploadUrl":window.ROOT_URL+"index.php?m=admin&c=editor&a=upload"
    }
  },
  components: {
    Pagination,
    "EcButton": Button,
    Upload
  },
  created() {
    eventHub.$on("show-dialog", this.showDialog)
  },
  beforeMount() {
    this.loadImg(1);
  },
  methods: {
    removePicture(index){//删除图片
      let vm = this;
      $.post(vm.url("admin&c=editor&a=removepicture"),{pic_id:index},function(res){
          if(res.error == 0){
            eventHub.$emit("message-show", `删除成功`, "success"); //error warning
          }
      },'json')
    },
    loadImg(page){
      let vm = this;
      $.post(vm.url("admin&c=editor&a=picture"),{page:page},function(res){
        let resData = res.data;
        vm.adImagesShow = resData;
        vm.currentPage = page;
        if(res.total){
          vm.total = parseInt(res.total); //共条目，后期对接php赋值
        }else{
          vm.total = 0;
        }
      },'json')
    },
    confirmUpload(){
      this.distoryPic();
      this.fileList = [];
      this.loadImg(1);
    },
    handleCurrentChange(val) {//分页
      this.loadImg(val);
    },
    currentChange(val){//指定页面
      this.loadImg(val);

    },
    distoryPic() {
      this.showSelect = 0;
    },
    uploadPic() {
      this.showSelect = 1;
    },
    showDialog(componentType, length) {
      this.dialogVisible = true;
      this.componentType = "";
      this.componentType = componentType;
      this.selectNum = length;
      $('body').addClass("hidden-x")
    },
    closeDialog() {
      this.dialogVisible = false;
      this.adImagesShow.map((v, i) => {
        v.isSelect = false;
      })
      $('body').removeClass("hidden-x")
    },
    daterMine() {
      let selectAll = [];
      if(this.adImagesShow){
        this.adImagesShow.map((v, i) => {
          if (v.isSelect == true) {
            selectAll.push(v);
          }
        });
      }
      if (selectAll.length > 0) {
        if (this.componentType == "picture") {
          eventHub.$emit("add-pic-data", selectAll);
        }
        if(this.componentType == "pictureUpdate") {
          eventHub.$emit("update-pic-data", selectAll);
        }
        if(this.componentType == "navUpdate") {
          eventHub.$emit("update-nav-data", selectAll);
        }
        if(this.componentType == "AnnUpdate") {
          eventHub.$emit("update-ann-data", selectAll);
        }
        if (this.componentType == "nav") {
          eventHub.$emit("add-nav-data", selectAll);
        }
        this.adImagesShow.map((v, i) => {
          v.isSelect = false;
        })
      }
      this.closeDialog();

    },
    selectImg(index) {//选择图片
      let isSelectNum = 0;
      let thisIndex = index + (this.currentPage - 1) * this.pageSize;
      // console.log(thisIndex)
      if (this.selectNum <= 1) {
        if (this.selectNum <= 0) {
          eventHub.$emit("message-show", `您最多可添加 ${this.selectNum} 个`, "error"); //error warning
          return false;
        }
        this.adImagesShow.map((v, i) => {
          i == index ? v.isSelect = true : v.isSelect = false;
        });
      } else {
        this.adImagesShow[thisIndex].isSelect = !this.adImagesShow[thisIndex].isSelect;
        for (let i = 0; i < this.adImagesShow.length; i++) {
          if (this.adImagesShow[i].isSelect == true) {
            isSelectNum++;
          }
        }

        if (isSelectNum > this.selectNum) {
          this.adImagesShow[thisIndex].isSelect = !this.adImagesShow[thisIndex].isSelect;
          eventHub.$emit("message-show", `最多可添加您最多可添加 ${this.selectNum} 个`, "error"); //error warning
        }
      }

    }
  },
  watch: {
    "search": {
      handler(val, oldVal) {
        // this.adImagesShow = galleryData.adImages.filter(function(item) {//模糊查询，待定
        //   return item.desc.toLowerCase().indexOf(val.toLowerCase()) !== -1
        // })
      }
    }
  }
}
</script>

<style>
.gallery-pic .add-link-close{z-index: 11; right:-.9rem; top:-.9rem; border:0; position:absolute; justify-content: center;}
.ec-dialog .ec-dialog-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 112;
}

.ec-dialog .ec-dialog-content {
  width: 850px;
  min-height: 630px;
  position: fixed;
  top: 12%;
  background: #fff;
  z-index: 113;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 6px;
}

.ec-dialog-header {
  padding: 18px 20px;
  border-bottom: 1px solid #F6F6F9;
  display: flex;
  justify-content: space-between;
}

.ec-dialog-header .ec-dialog-title {
  font-size: 14px;
  color: #1f2d3d;
  margin-right: .6rem;
}

.ec-dialog-header .ec-dialog-title-his {
  color: #20a0ff
}

.ec-dialog-header .ec-dialog-title-his:hover {
  cursor: pointer
}

.ec-dialog-header .ec-dialog-title-his .icon-left-arrow {
  margin-right: .4rem;
}

.ec-dialog-header .ec-dialog-headersearch {
  float: right;
  margin-right: 20px;
  margin-top: -3px;
  display: flex;
  align-items: center;
}

.ec-dialog-header .ec-dialog-headerbtn {
  float: right;
  color: #c0ccda;
  border-left: 1px solid #e3e8ec;
  padding-left: 12px;
}

.ec-dialog-header .ec-dialog-headerbtn:hover {
  color: #20a0ff;
  cursor: pointer;
}

.ec-dialog-body {
  padding: 18px 20px;
box-sizing: border-box;
min-height: 510px;
}

.ec-dialog-body .el-dragger~.el-upload__files{
  overflow-x: scroll;
  max-height: 200px;
}



.ec-dialog-body .ec-dialog-body-icon li {
  float: left;
  width: 150px;
  height: 150px;
  background: #f1f1f1;
  margin: 6px;
  text-align: center;
  position: relative;
  overflow: initial;
}

.ec-dialog-body .ec-dialog-body-icon li .ec-dialog-active {
  position: absolute;
  border: 2px solid #20a0ff;
  background: rgba(32, 160, 255, 0.1);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ec-dialog-body .ec-dialog-body-icon li:hover{
    cursor: pointer;
    border:2px solid #20a0ff;
}

.ec-dialog-body .ec-dialog-body-icon li:hover span{
  display:flex;
}
.ec-dialog-body .ec-dialog-body-icon li .ec-dialog-active span {
  background: #20a0ff;
  display: flex;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
}

.ec-dialog-body .ec-dialog-body-icon li .ec-dialog-active i.icon-correct {
  font-size: 2.4rem;
  color: #fff;
}

.ec-dialog-body .ec-dialog-body-icon figure {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ec-dialog-body .ec-dialog-body-icon figcaption {
  position: absolute;
  font-size: 12px;
  width: 100%;
  height: 26px;
  line-height: 26px;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  z-index: 11;
  left:0;
}

.ec-dialog-body .ec-dialog-body-icon li img {
  max-width: 100%;
  max-height: 100%;
}

.ec-dialog-footer {
  border-top:1px solid #F6F6F9;
  padding:16px 0;
  padding-right: 26px;
  padding-left: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.ec-dialog-footer.upload {
  justify-content: center;
}


/*过渡动画效果*/

.fade-gallery-enter-active,
.fade-gallery-leave-active {
  transition: all .6s ease;
}

.fade-gallery-enter,
.fade-gallery-leave-active {
  opacity: 0;
  margin-top: -20px;
}

.fade-gallery-mask-enter-active,
.fade-gallery-mask-leave-active {
  transition: all .6s ease;
}

.fade-gallery-mask-enter,
.fade-gallery-mask-leave-active {
  opacity: 0;
}

.ec-dialog-footer .ec-button-list button {
  margin-right: 1rem;
}

.ec-dialog-footer .ec-button-list button:first-child {
  margin-right: 0;
}


.ec-dialog .form-text{padding:2rem 0; padding-bottom:4.2rem; border-bottom:1px solid #F6F6F9}
.ec-dialog .form-text-btn.el-button{padding:7px 9px;}
.ec-dialog .form-text-btn span{font-size:13px;}
.ec-dialog .form-upload{margin-top:5rem;}
.from-upload input[type=file]{display:none;}

</style>
