<template>
  <div :id="id" class="vue-model mod-coupon">
  <div class="frontend">
      button 按钮
  </div>
  <div class="backend" v-show="setting" v-if="isVisual == 0">
    <div class="backend-close" @click="closeBackend($event)">
      <i class="iconfont icon-close"></i>
    </div>
    <div class="arrow"></div>
    <form class="form-horizontal">
        <div class="form-group">
            <label class="col-sm-3 control-label"><span class="text-danger">*</span> 优惠券：</label>
            <div class="col-sm-7">
                <input type="text" class="form-control title-name">
            </div>
        </div>
    </form>
  </div>
</div>
</template>

<script>
import eventHub from '../eventHub'
export default {
    name: 'coupon',
    props: ['id', 'data', 'setting','isVisual'],
    data() {
        return {

        }
    },
    methods:{
      closeBackend(event){
        eventHub.$emit("close-backend",this.id);
        event.stopPropagation();
        // this.setting = false;
      },
    }
}
</script>

<style>

</style>
