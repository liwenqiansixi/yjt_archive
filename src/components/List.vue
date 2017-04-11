<template>
<div :id="id" class="vue-model mod-list">
  <div class="frontend">
    <section class="list-box" v-for="item in data.contListBox">
      <a :href="item.contUrl | urlCode"></a>
      <div class="list-left">
        {{"" == item.contName ? "编辑 - [标题]" :item.contName }}
      </div>
      <div class="list-right">
        <i class="iconfont icon-right-arrow"></i>
      </div>
    </section>
  </div>
  <div class="backend" id="list-backend" v-show="setting" v-if="isVisual == 0">
    <div class="backend-close" @click="closeBackend($event)">
      <i class="iconfont icon-close"></i>
    </div>
    <div class="arrow"></div>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 文字列表</label>
      </div>
      <div class="form-group ">
        <div class="p-r add-link-sec list-editor" v-for="(item,index) in data.contListBox">
          <span class="add-link-close p-a" @click="removeList(index)"><i class="iconfont icon-close1"></i></span>
          <div class="add-link">
            <section class="add-link-r">
              <div class="form-group"><label class="col-sm-3 control-label">标题：</label>
                <div class="col-sm-7 add-link-r-n"><input type="text" class="form-control" v-model="item.contName"></div>
              </div>
              <div class="form-group"><label class="col-sm-3 control-label ">链接：</label>
                <div class="col-sm-7 add-link-r-n"><input type="text" class="form-control" v-model="item.contUrl"></div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div class="form-group picture-add-group" v-show="limit">
        <div class="add-button" @click="btnListText">
          <span><i class="iconfont icon-plus"></i></span>
          <p>添加列表</p>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import eventHub from '../eventHub'
export default {
  name: 'list',
  props: ['id', 'data', 'setting', 'isVisual'],
  data() {
    return {
      maxLength: 10,
      scrollTop: 0
    }
  },
  methods: {
    closeBackend(event) {
      eventHub.$emit("close-backend", this.id);
      event.stopPropagation();
      // this.setting = false;
    },
    btnListText() {
      this.data.contListBox.push({
        contUrl: '',
        contName: ''
      });
      let h = $(this.$el).find("#list-backend").scrollHeight;
      if (h > 0) {
        this.scrollTop = h;
      }
      console.log(h);
    },
    removeList(index) {
      this.data.contListBox.splice(index, 1);
    }
  },
  computed: {
    limit() {
      if (this.data.contListBox.length >= this.maxLength) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    scrollTop: {
      handler(val, oldVal) {
        $(this.$el).find("#list-backend").scrollTop(700);
        console.log($(this.$el).find("#list-backend").scrollTop());
      }
    }
  }
}
</script>

<style>
.m-top10 {
  border-top: 5px solid #f6f6f9;
}

.list-box {
  background: #fff;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  border-bottom: 1px solid #F6F6F9;
  border-top: 1px solid #F6F6F9;
  height: 4rem;
  position: relative;
}

.list-box .list-left {
  padding: 0 1rem;
  flex: 6;
  -webkit-flex: 6;
  color: #333;
  font-size: 1.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-box .list-right {
  position: relative;
  font-size: 1.4rem;
  box-sizing: content-box;
  color: #666;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  align-items: center;
}

.list-box .list-right i {
  font-size: 1.4rem;
}

.list-box a {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.list-editor .add-link-close {
  top: -.8rem
}
</style>
