<template>
  <div :id="id" class="vue-model mod-line">
      <div class="frontend" :class="{'com-min-height':0==isVisual}">
          <hr :style="{'border-color':data.bgColor}">
      </div>
      <div class="backend" v-show="setting" v-if="isVisual == 0">
        <div class="backend-close" @click="closeBackend($event)">
          <i class="iconfont icon-close"></i>
        </div>
          <div class="arrow"></div>
          <form class="form-horizontal">
              <div class="form-group">
                  <label class="col-sm-3 control-label"><span class="text-danger">*</span> 颜色：</label>
                  <div class="col-sm-7">
                      <input class="form-control" type="color" v-model="data.bgColor">
                  </div>
                  <a href="javascript:void(0)" class="a-fit" @click="titleResetBg()">重置</a>
              </div>
          </form>
      </div>
  </div>
</template>

<script>
import eventHub from '../eventHub'
export default {
    name:'line',
    props: ['id', 'data', 'setting','isVisual'],
    data() {
      return {

      }
    },
    methods:{
      titleResetBg(){
        this.data.bgColor = "#f6f6f9"
      },
      closeBackend(event){
        eventHub.$emit("close-backend",this.id);
        event.stopPropagation();
        // this.setting = false;
      },
    }
}
</script>

<style>
  .mod-line{display: flex; align-items:center; -webkit-justify-content: center; justify-content: center; background:#fff;}
  .mod-line hr{margin:0; padding:0;border-top: 1px solid #F6F6F9; width: 100%}
</style>
