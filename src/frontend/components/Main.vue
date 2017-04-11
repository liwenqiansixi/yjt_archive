<template>
<div class="ect-container">
  <div class="div-component" v-for="(item, index) in modules">
    <component :is="'ec-'+item.module" :id="item.id" :setting="false" :data="item.data" :is-visual="2"></component>
  </div>
  <div class="div-component">
    <ec-tabdown :id="'tabdown12313'" :is-visual="2"></ec-tabdown>
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
import axios from 'axios'

// 模块配置
import moduleData from '../../config/module.js'

export default {
  name: "main",
  components: {
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
    EcTabdown
  },
  data() {
    return {
      "modules": []
    }
  },
  created() {},
  beforeMount() {
    // 初始化页面数据
    let vm = this;
    // this.modules = moduleData;
    if(this.GetQueryString("preview") == 1){
      $.post(vm.url("index"),{preview:1},function(res) {
        if (res.error == 0) {
            vm.modules = res.data; // 模块组件
        }
      },'json')
    }else{
      $.post(vm.url("index"), function(res) {
        if (res.error == 0) {
          vm.modules = res.data; // 模块组件
        }
      }, 'json')
    }


  },
  methods: {
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }

  },
  mounted() {
    // console.log(this.$children.find(children => children.options.group == 'people').draggable);

  }
}
</script>
<style lang="scss">@import '../../assets/sass/visual.scss';
@import '../../assets/sass/var.scss';
body.hidden-x {
    overflow: hidden;
}
.div-component {
    position: relative;
    background: #F6F6F9;
}

.div-component .handle {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    z-index: 3;
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
    z-index: 2;
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
    z-index: 8;
    display: none;
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
    z-index: 18;
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
}</style>
