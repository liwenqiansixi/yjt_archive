<template>
<div class="ect-container">
  <div class="header">
    <div class="sidebar-nav">
      <ul class="menu">
        <li v-for="(item,index) in sidebarNav" @mouseover.stop="clickTab(index,$event)" @mouseout.stop="clickTabOut(index)">
          <span class="ts-2" :class="{active:item.isActive}" v-show="item.isShow">{{ item.title }}</span>
          <div class="sub-menu" :class="{active:item.isActive}" v-show="item.isShow">
            <ul v-if="item.ectGridList">
              <draggable :list="item.ectGridList" :options="{group:{ name:'people',  pull:'clone', put:false }}">
                <li v-for="itemGridList in item.ectGridList" v-show="itemGridList.isShow">
                  <div class="ect-draggable">
                    <div class="ect-grid" :class="itemGridList.class"></div>
                  </div>
                </li>
              </draggable>
            </ul>
            <ul v-else>
              <draggable :options="{group:{ name:'people', pull:'clone', put:false }}" @start="onDarStart($event)">
                <li class="other" v-for="itemConList in item.ectConList" :data-module="itemConList.module" v-show="itemConList.isShow">
                  <div class="ect-draggable">
                    <i class="iconfont" :class="itemConList.icon"></i>
                    <span class="sub-menu-span">{{ itemConList.text }}</span>
                  </div>
                </li>
              </draggable>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="right-nav">
      <ul>
        <li @click="previewMod()">
          <i class="iconfont" :class="rightNav[0].icon"></i>
          <span>{{ rightNav[0].text }}</span>
        </li>
        <li @click="clearModules()">
          <i class="iconfont" :class="rightNav[1].icon"></i>
          <span>{{ rightNav[1].text }}</span>
        </li>
        <li @click="saveMod()">
          <i class="iconfont" :class="rightNav[2].icon"></i>
          <span>{{ rightNav[2].text }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div class="ect-con">
    <div class="phone-view">
      <div class="phone-view-title">
        <h4>商城首页</h4>
      </div>
      <div class="phone-view-con" :class="{'module-bg': '' == modules ? true : false}">
        <div id="visual-sortable">
          <draggable class="visual-draggable" :list="modules" :options="{group:'people',handle: '.handle'}" @add="onVisAdd($event)" @move="onVisMove($event)" @start="onVisStart($event)" @end="onVisEnd($event)" @setData="onVisSetData()">
            <div class="div-component" v-for="(item, index) in modules" :class="{active: item.setting}" @click="isShowBackend(item.id,index)">
              <div class="handle"></div>
              <span class="remove-module" @click="removeMod(index,$event)">删除</span>
              <div class="actions"></div>
              <keep-alive>
                <component :is="'ec-'+item.module" :id="item.id" :setting="item.setting" :data="item.data" :dialogTableVisible="dialogVisible" :is-visual="0"></component>
              </keep-alive>
            </div>
            <ec-tabdown></ec-tabdown>
          </draggable>
        </div>
      </div>
    </div>
  </div>
  <ec-gallery></ec-gallery>
  <div class="clostVisual" @click.stop="clostVisual">
  </div>
</div>
</template>

<script>
// 模块组件
import EcAnnouncement from '../../components/Announcement.vue'
import EcBlank from '../../components/Blank.vue'
import EcButton from '../../components/Button.vue'
import EcCoupon from '../../components/Coupon.vue'
import EcEditor from '../../components/Editor.vue'
import EcGroup from '../../components/Group.vue'
import EcImage from '../../components/Image.vue'
import EcLine from '../../components/Line.vue'
import EcLink from '../../components/Link.vue'
import EcList from '../../components/List.vue'
import EcNav from '../../components/Nav.vue'
import EcPicture from '../../components/Picture.vue'
import EcProduct from '../../components/Product.vue'
import EcSale from '../../components/Sale.vue'
import EcSearch from '../../components/Search.vue'
import EcSpike from '../../components/Spike.vue'
import EcTitle from '../../components/Title.vue'
import EcTabdown from '../../components/Tabdown.vue'
import EcGallery from '../../components/Gallery.vue'
import {
  Dialog,
  Message,
  Button
} from 'element-ui';


// 第三方组件
import eventHub from '../../eventHub'
import axios from 'axios'
import store from '../../assets/js/store.min.js'
import draggable from 'vuedraggable'

// 模块配置
import tabbarData from '../../config/tabbar.js'
import toolsData from '../../config/tools.js'
import moduleData from '../../config/module.js'

export default {
  name: "visual",
  components: {
    draggable,
    EcAnnouncement,
    EcBlank,
    EcButton,
    EcEditor,
    EcGroup,
    EcImage,
    EcLine,
    EcLink,
    EcList,
    EcNav,
    EcPicture,
    EcProduct,
    EcSale,
    EcSearch,
    EcSpike,
    EcTitle,
    EcTabdown,
    "EcDialog": Dialog,
    "EcButton": Button,
    Message,
    EcGallery
  },
  data() {
    return {
      "sidebarNav": [],
      "rightNav": [],
      "modules": [],
      "dialogVisible": false,
      "selectNum": 1,
      "preview": false,
      "previewModules": []
    }
  },
  created() {
    eventHub.$on("message-show", this.messageShow);
    eventHub.$on("close-backend", this.closeBackend)
    let vm = this;
    let resData = [];
    $.post(vm.url('index'), function(res) {
      if (res.error == 0) {
          vm.modules = res.data; // 模块组件
      } else {

      }
    }, function(res) {
      console.log(res);
    }, 'json')

  },
  beforeMount() {
    // 初始化页面数据
    this.sidebarNav = tabbarData; // tab导航
    this.rightNav = toolsData; // 保存按钮
    // this.modules = resData;
  },
  mounted() {

  },
  methods: {
    clostVisual() {
      this.modules.map((v, i) => {
        v.setting = false;
      });
    },
    clearModules() {
      let vm = this;
      if (confirm('确定恢复默认数据？')) {
        $.post(vm.url("admin&c=editor&a=clean"), function(res) {
          if(res.error == 0){
            $.post(vm.url('index'), function(res) {
              if (res.error == 0) {
                  vm.modules = res.data; // 模块组件
              }
            }, 'json')
          }
        })
      }
    },
    closeBackend(closeId) { //关闭编辑
      this.modules.map((v, i) => {
        if (v.id == closeId) {
          v.setting = false;
          return false;
        }
      });
    },
    previewMod() {
      let vm = this;
      if(this.modules.length > 0){
        var winOpen = window.open("","preview");
        $.post(vm.url("admin&c=editor&a=preview"), {
          data: vm.modules,
        }, function(res) {
          if (res.error == 0) {
            winOpen.location.href=vm.url("index&preview=1");
          }else{
            return false;
          }
        }, 'json')
      }else{
        this.messageShow("暂无数据","error")
      }
    },
    messageShow(msg, type) {
      Message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    onDarStart(evt) {
    },
    onVisMove(evt) {},
    onVisAdd(evt) { //排序列表添加
      let id = evt.newIndex;
      $(evt.item).remove();
      let moduleName = $(evt.item).data("module");
      let module = this.cloneModule(moduleName);
      this.modules.splice(id, 0, module);
    },
    onVisStart(evt) {
      let evtItem = $(evt.item);
      evtItem.css({
        "visibility": "hidden"
      });
    },
    onVisEnd(evt) {
      $(evt.item).css("visibility", "visible");
    },
    cloneModule(moduleName) { //克隆模块
      let id = moduleName + '-' + this.formatDate("ymdhis", new Date());
      delete require.cache[require.resolve(`../../config/${moduleName}`)];
      let config = require(`../../config/${moduleName}`);
      if(moduleName == "spike"){
       $.post(this.url("index&c=index&a=goods"),{type:"promotion"},function(res){
          config.endTime = res.endtime;
          console.log(res.endtime)
      })
      }
      return {
        "id": id,
        "module": moduleName,
        "setting": false,
        "data": config
      }
    },
    formatDate(formatStr, fdate) { //格式化时间
      var fTime, fStr = 'ymdhis';
      if (!formatStr)
        formatStr = "y-m-d h:i:s";
      if (fdate)
        fTime = new Date(fdate);
      else
        fTime = new Date();
      var formatArr = [
        fTime.getFullYear().toString(),
        (fTime.getMonth() + 1).toString(),
        fTime.getDate().toString(),
        fTime.getHours().toString(),
        fTime.getMinutes().toString(),
        fTime.getSeconds().toString()
      ]
      for (var i = 0; i < formatArr.length; i++) {
        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
      }
      return formatStr;
    },
    getModIndex(id) { //获取当前组件索引
      let modulesIndex = 0;
      for (let i = 0; i < this.modules.length; i++) {
        if (this.modules[i].id == id) {
          modulesIndex = i;
          break;
        }
      }
      return modulesIndex;
    },
    isShowBackend(id, index) { //显示隐藏组件边框及操作
      let modules = this.modules;
      let modIndex = this.getModIndex(id);
      modules.map((v, i) => {
        i == index ? v.setting = true : v.setting = false;
      })
    },
    clickTabOut(index) {
      this.sidebarNav[index].isActive = false;
    },
    clickTab(index, event) { //点击导航切换
      this.sidebarNav.map(function(v, i) {
        i == index ? v.isActive = true : v.isActive = false;
      });
    },
    saveMod() { //本地存储
      store.set('ectDivModules', this.modules)
      let vm = this;
      // axios.interceptors.request.use()

      $.post(vm.url("admin&c=editor&a=save"), {
        data: vm.modules,
      }, function(res) {
        if (res.error == 0) {
          vm.messageShow("保存成功", "success")
        } else {
          vm.messageShow("保存失败", "error")
        }
      }, 'json')

    },
    removeMod(index, event) { //删除组件
      let modules = this.modules;
      modules.splice(index, 1);
    }
  }
}
</script>
<style lang="scss">@import '../../assets/sass/visual.scss';
@import '../../assets/sass/var.scss';
.phone-view-title {
    background: url("../../assets/img/phone_title.jpg") no-repeat;
}
.visual-draggable {
    min-height: 20px;
}
body.hidden-x {
    overflow: hidden;
}
.div-component {
    position: relative;
    background: #F6F6F9;
}
.visual-draggable .div-component {
    min-height: 25px;
}

.div-component .handle {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    z-index: 17;
}
.div-component.active .actions,
.div-component.active .remove-module,
.div-component:hover .actions,
.div-component:hover .remove-module {
    display: block;
    cursor: pointer;
}

.div-component .actions {
    border: 2px dashed #27b9d7;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    z-index: 14;
    display: none;

}

.div-component .remove-module {
    background: #27b9d7;
    color: #fff;
    font-size: 1.3rem;
    padding: 0.3rem 0.6rem;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 18;
    display: none;
}
#visual-sortable {
    min-height: 10rem;
}
#visual-sortable .ect-draggable {
    padding: 1rem 1.5rem;
    box-sizing: content-box;
    background: #faf9f0;
}

.pirce-dialog {
    max-width: 880px;
    min-width: 880px;
    min-height: 500px;
    max-height: 600px;
    overflow-x: scroll;
}
.pirce-dialog .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #F6F6F9;
}
.pirce-dialog .price-dialog-icon {
    overflow: hidden;
}
.pirce-dialog .price-dialog-icon li {
    width: 86px;
    height: 86px;
    float: left;
    margin: 9px;
    background: #f1f1f1;
    padding: 10px;
    position: relative;
}
.pirce-dialog .price-dialog-icon li img {
    max-width: 90%;
}
.pirce-dialog .price-dialog-icon li figure {
    text-align: center;
}
.pirce-dialog .price-dialog-icon li figcaption {
    font-size: 13px;
    color: #fff;
    position: absolute;
    background: rgba(0,0,0,.4);
    left: 0;
    bottom: 0;
    right: 0;
    padding: 4px 0;
}

.preview {
    position: fixed;
    z-index: 1002;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
.preview .preview-close {
    font-size: 18px;
    position: absolute;
    right: 38px;
    top: 38px;
    z-index: 16;
}
.preview .preview-close i {
    font-size: 26px;
    color: #c0ccda;
}
.preview .preview-close {
    cursor: pointer;
}
.preview .preview-close:hover i {
    color: #20a0ff;
}
.preview .div-component {
    max-width: 320px;
}
.preview-con {
    width: 320px;
    max-width: 320px;
    height: 640px;
    overflow-x: scroll;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 16px #aaa;
    z-index: 19;
}
.preview-mask {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    background: rgba(255,255,255,1);
}

.module-bg {
    background: url("../../assets/img/qsy.jpg") no-repeat center 80px #fff;
}

.clostVisual {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
}
</style>
