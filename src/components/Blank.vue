<template>
<div :id="id" class="vue-model mod-blank">
  <div class="frontend">
    <section class="blank" :style="{'height':data.valueHeight+'px'}"></section>
  </div>
  <div class="backend" v-show="setting" v-if="isVisual == 0">
    <div class="backend-close" @click="closeBackend($event)">
      <i class="iconfont icon-close"></i>
    </div>
    <div class="arrow"></div>
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-3 control-label" ><span class="text-danger">*</span> 自定义高度：</label>
        <div class="col-sm-8 ec-slider">
          <slider v-model="data.valueHeight" :min="min" :max="max"  show-input></slider>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import eventHub from '../eventHub'
import {
  Slider
} from 'element-ui'
export default {
  name: 'blank',
  props: ['id', 'data', 'setting', 'isVisual'],
  data() {
    return {
      "min":1,
      "max":100
    }
  },
  created(){
    if(typeof this.data.valueHeight == 'string'){
      this.data.valueHeight = parseInt(this.data.valueHeight);
    }
  },
  components: {
    Slider
  },
  methods: {
    closeBackend(event) {
      eventHub.$emit("close-backend", this.id);
      event.stopPropagation();
      // this.setting = false;
    },
  }
}
</script>

<style>
.ec-slider .el-slider__runway.show-input{margin-right:130px;}
.ec-slider .el-input-number--small{width:110px;}
</style>
