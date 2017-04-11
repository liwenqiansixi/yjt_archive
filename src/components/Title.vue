<template>
<div :id="id" class="vue-model mod-title">
  <div class="frontend">
    <div class="ect-comp-title">
      <div class="ect-comp-title-con" :class="data.isShowStyle" :style="{display:data.traditionStyle.isShow,background:data.traditionStyle.bgStyle}">
        <h3>{{ "" == data.title ? "点击编辑 - [标题]" : data.title}} <span v-show="data.traditionStyle.linkTitle"> - <a :href="data.traditionStyle.link | urlCode">{{ data.traditionStyle.linkTitle }}</a></span></h3>
        <div class="ect-title-fit-style"><span v-show="data.traditionStyle.fitTitle">{{ data.traditionStyle.fitTitle }}</span></div>
      </div>
      <div class="ect-comp-title-con" :style="{display:data.wxStyle.isShow}">
        <h3 >{{ "" == data.title ? "点击编辑 - [标题]" : data.title}}</h3>
        <div class="ect-title-fit-style"><span v-show="this.data.wxStyle.dataTime">{{ wxDateTime }}</span><span v-show="data.wxStyle.author">{{ data.wxStyle.author }}</span>
          <span v-show="data.wxStyle.linkTitle"><a :href="data.wxStyle.link | urlCode">{{ data.wxStyle.linkTitle }}</a></span>
        </div>
      </div>
    </div>
  </div>
  <div class="backend" v-show="setting" v-if="isVisual == 0">
    <div class="backend-close" @click="closeBackend($event)">
      <i class="iconfont icon-close"></i>
    </div>
    <div class="arrow"></div>
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-3 control-label"><span class="text-danger">*</span> 标题名：</label>
        <div class="col-sm-7">
          <input type="text" class="form-control title-name" v-model="data.title">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">标题模版：</label>
        <div class="col-sm-7">
          <label class="radio-inline">
     							<input type="radio" name="title-style" :value="data.traditionStyle.key" v-model="data.isStyleSel"> {{ data.traditionStyle.text }}
    					</label>
          <label class="radio-inline">
     							<input type="radio" name="title-style" :value="data.wxStyle.key" v-model="data.isStyleSel"> {{ data.wxStyle.text }}
    					</label>
        </div>
      </div>
      <div :style="{display:data.traditionStyle.isShow}">
        <div class="form-group">
          <label class="col-sm-3 control-label">副标题：</label>
          <div class="col-sm-7 p-r date-picker-style">
            <input type="text" class="form-control fit-title " v-model="data.traditionStyle.fitTitle" v-show="'1'==data.traditionStyle.isTextSel">
            <date-picker v-model="data.traditionStyle.fitTitle" type="datetime" placeholder="选择日期时间" format="yyyy-mm-dd HH:mm:ss" v-show="'0'==data.traditionStyle.isTextSel">
            </date-picker>

          </div> <a href="javascript:void(0)" class="a-fit" @click="tabTextDate()">{{data.traditionStyle.fitAText[data.traditionStyle.isTextSel]}}</a>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">显示：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="(item,index) in data.showStyle">
								                    <input type="radio" name="show-style" :value="item.value" v-model="data.isShowStyle"  v-cloak> {{ item.text }}
						              </label>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">背景颜色：</label>
          <div class="col-sm-7">
            <input type="color" class="form-control" v-model="data.traditionStyle.bgStyle" />
          </div>
          <a href="javascript:void(0)" class="a-fit" @click="titleResetBg()">重置</a>
        </div>
        <div class="form-group" :style="{display:data.traditionStyle.isAddBtnShow}">
          <div class="add-button" @click="btnModTitleText">
            <span><i class="iconfont icon-plus"></i></span>
            <p>添加一个文本导航</p>
          </div>
        </div>
        <div class="form-group add-link-sec p-r" :style="{display:data.traditionStyle.isAddLinkShow}">
          <span class="add-link-close p-a" @click="btnCloseLink"><i class="iconfont icon-close1"></i></span>
          <div class="add-link">
            <div class="form-group">
              <label class="col-sm-3 control-label">名称：</label>
              <div class="col-sm-7">
                <input type="text" class="form-control" v-model="data.traditionStyle.linkTitle" />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">链接：</label>
              <div class="col-sm-7">
                <input type="text" class="form-control" v-model="data.traditionStyle.link" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :style="{display:data.wxStyle.isShow}">
        <div class="form-group">
          <label class="col-sm-3 control-label">日期：</label>
          <div class="col-sm-7 p-r date-picker-style">
            <date-picker v-model="data.wxStyle.dataTime" type="datetime" placeholder="选择日期时间">
            </date-picker>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">作者：</label>
          <div class="col-sm-7">
            <input type="text" class="form-control fit-title" v-model="data.wxStyle.author">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">链接标题：</label>
          <div class="col-sm-7">
            <input type="text" class="form-control fit-title" v-model="data.wxStyle.linkTitle">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">链接：</label>
          <div class="col-sm-7">
            <input type="text" class="form-control fit-title" v-model="data.wxStyle.link">
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script type="text/javascript">
import eventHub from '../eventHub'
import Vue from 'vue';
import {
  DatePicker,
  TimePicker
} from 'element-ui';

export default {
  name: 'title',
  props: ['id', 'data', 'setting','isVisual'],
  components: {
    DatePicker,
    TimePicker
  },

  data() {
    return {}
  },
  computed: {
    wxDateTime() {
      if (!!this.data.wxStyle.dataTime) {
        return this.formatDate("yyyy-MM-dd hh:mm:ss", this.data.wxStyle.dataTime);
      }
    }
  },
  methods: {
    closeBackend(event){
      eventHub.$emit("close-backend",this.id);
      event.stopPropagation();
      // this.setting = false;
    },
    tabTextDate() {
      let isTextSel = this.data.traditionStyle.isTextSel;
      0 == isTextSel ? this.data.traditionStyle.isTextSel = '1' : this.data.traditionStyle.isTextSel = '0';
    },
    titleResetBg() { //动态绑定背景颜色
      this.data.traditionStyle.bgStyle = "#ffffff";
    },
    btnModTitleText() { //显示隐藏添加文本链接
      this.data.traditionStyle.isAddBtnShow = "none";
      this.data.traditionStyle.isAddLinkShow = "block";
    },
    btnCloseLink() { //显示隐藏添加文本链接并清空对应数据
      this.data.traditionStyle.isAddBtnShow = "block";
      this.data.traditionStyle.isAddLinkShow = "none";
      this.data.traditionStyle.linkTitle = "";
      this.data.traditionStyle.link = "";
    },
    formatDate(formatStr, fdate) {
      Date.prototype.Format = function(fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        // console.log(o);
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
      if (!!formatStr && !!fdate) {
        return new Date(fdate).Format(formatStr);
      }
    }
  },
  watch: {
    "data.isStyleSel": { //传统，微信样式切换
      handler(val, oldVal) {
        switch (val) {
          case "1":
            this.data.traditionStyle.isShow = "none"
            this.data.wxStyle.isShow = "block";
            break;
          default:
            this.data.traditionStyle.isShow = "block"
            this.data.wxStyle.isShow = "none";
            break
        }
      }
    },
    "data.wxStyle.linkTitle": { //动态绑定微信样式的链接
      handler(val, oldVal) {
        if (val != "") {
          this.data.wxStyle.isLinkTitle = "inline-block";
        } else {
          this.data.wxStyle.isLinkTitle = "none";
        }
      }
    },
    "data.traditionStyle.fitTitle": { //动态绑定传统样式副标
      handler(val, oldval) {
        if (val instanceof Date) {
          this.data.traditionStyle.fitTitle = this.formatDate("yyyy-MM-dd hh:mm:ss", val);
        }
      }
    },
  }
}
</script>
<style>
.ect-comp-title{font-size:1.7rem; background:#fff;}
.ect-comp-title .ect-comp-title-con{padding:1.1rem 1rem;}
.ect-comp-title h3{font-size:1.7rem; color:#333; word-wrap:break-word; line-height:1.8rem;	}
.ect-comp-title h3 span{margin-left:.6rem; font-size:1.4rem;}
.ect-title-fit-style{font-size:1.5rem; color:#999; margin-top:.3rem;}
.ect-title-fit-style span{margin-right:0.8rem; line-height:1.8rem;}
.tradition-date-input{top:0; bottom:0; z-index: -1;}
</style>
