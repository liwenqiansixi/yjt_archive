<template lang="html">
  <div :id="id" class="vue-model mod-announcement">
    <div class="frontend">
      <section class="announcement">
        <div class="announ-left">
          <img :src="data.icon" alt="" />
        </div>
        <div class="announ-center">
          <template v-if="data.isAnnouncementSel == '0'">
            <swiper class="announ-del" :options="announOption">
              <swiper-slide class="swiper-no-swiping" v-for="item in data.contList">
                <a :href="item.url | urlCode">
                  <div class="announcement-cont">{{item.text}}</div>
                </a>
              </swiper-slide>
              <!-- 以下配置均为可选（使用具名slot来确定并应用一些操作控件元素） -->
              <div class="swiper-pagination"></div>
            </swiper>
          </template>
          <template v-else>
            <div :id="scrollId">
              {{data.AnnounText}}
            </div>
          </template>
        </div>
        <div class="announ-right" v-show="data.isAnnounRight">
          <a v-url="'article'"></a>
          更多<i class="iconfont icon-right-arrow"></i>
        </div>
      </section>
    </div>
    <div class="backend" v-show="setting" v-if="isVisual == 0">
      <div class="backend-close" @click="closeBackend($event)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="arrow"></div>
      <form class="form-horizontal">
        <div class="form-group" v-show="false">
          <label class="col-sm-3 control-label">公告管理：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="(item,index) in data.isAnnouncement">
                  <input type="radio" name="isAnnouncement" :value="item.key" v-model="data.isAnnouncementSel"> {{ item.text }}
              </label>
          </div>
        </div>
        <div class="form-group" :class="{'announcement-text':data.isAnnounText}">
          <label class="col-sm-3 control-label">快报内容：</label>
          <div class="col-sm-7">
            <textarea type="text" class="form-control title-name" v-model="data.AnnounText"></textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">LOGO：</label>
          <div class="col-sm-7 announ-editor picture-editor">
            <figure class="p-l">
              <span class="img-mask">
            <i class="iconfont icon-camera1" title="修改" @click="updateAnnBtn()"></i>
            <i class="iconfont icon-clear1" title="删除" @click="removeAnnBtn()"></i>
          </span>
              <img :src="data.icon" alt="" />
            </figure>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {
    swiper,
    swiperSlide,
    swiperPlugins
  } from 'vue-awesome-swiper'
  import eventHub from '../eventHub'
  export default {
    name: 'announcement',
    props: ['id', 'data', 'setting', 'isVisual'],
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        "scrollId": "",
        "speed": 60,
        "int": {},
        "announOption": {
          "paginationClickable": true,
          "direction": 'vertical', //纵向滚动
          "loop": true,
          "autoplay": 4000,
          "speed": 400,
          "noSwiping": true,
        },
      }
    },
    created() {

      if (this.isVisual == 0) {
        this.announOption.autoplay = 0;
      }
    },
    beforeMount() {
      let vm = this;
      $.post(vm.url("index&c=index&a=notice"), function (res) {
        vm.data.contList = res.data;
      })
    },
    methods: {
      closeBackend(event) {
        eventHub.$emit("close-backend", this.id);
        event.stopPropagation();
        // this.setting = false;

      },
      updateAnnBtn() {
        eventHub.$off("update-ann-data");
        eventHub.$on("update-ann-data", this.updateAnnData);
        eventHub.$emit('show-dialog', "AnnUpdate", 1);
      },
      removeAnnBtn() {
        if (confirm("真的要删除吗？")) {
          this.data.icon = ""
        }
      },
      updateAnnData(updataData) {
        this.data.icon = updataData[0].img;
      }
    },
    watch: {
      "data.isAnnouncementSel": {
        handler(val, oldVal) {
          switch (val) {
            case '1':
              this.data.isAnnounRight = false;
              this.data.isAnnounText = false;
              break;
            default:
              clearInterval(this.int);
              this.data.isAnnounRight = true;
              this.data.isAnnounText = true;
              break;
          }
        }
      }
    },
  }

</script>

<style>
  .announ-editor .img-mask .iconfont {
    color: rgba(255, 255, 255, .8);
    font-size: 3rem !important;
    margin-right: .8rem;
  }
  
  .announ-editor .img-mask .iconfont:last-child {
    margin-right: -.4rem
  }
  
  .announ-scroll {
    white-space: nowrap;
    overflow: hidden;
  }
  
  .announcement-text {
   
    display: none;
  }
  
  .announ-center .announ-cont {
    line-height: 3.6rem;
    font-size: 1.4rem;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .announcement-cont {
    color: #444;
  }
  
  .announcement-icon {
    width: 7rem;
    height: 7rem;
    padding: 1rem;
    border: 1px solid #eee;
    position: relative;
  }
  
  .announcement-icon img {
    width: 100%;
    height: auto;
  }
  
  .announcement-icon figcaption {
    display: none;
    position: absolute;
    left: 2px;
    top: 2px;
    right: 2px;
    bottom: 2px;
    background: rgba(0, 0, 0, 0.6);
    justify-content: center;
    align-items: center;
  }
  
  .announcement-icon:hover figcaption {
    display: flex;
  }
  
  .announcement-icon figcaption .icon-image {
    font-size: 4rem;
    color: #fff;
  }
  
  .announcement {
    background: #fff;
     display: box;
    display: -webkit-box;
    display: flex;
    display: -webkit-flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    align-items: center;
    -webkit-align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    border-top: 1px solid #F6F6F9;
    border-bottom: 1px solid #F6F6F9;
    padding: .6rem 0;
    height: 4.8rem;
    line-height: 5.2rem;
   
  }
  
  .announ-left,
  .announ-right {
    padding: 0 1rem;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }
  
  .announ-left {
    float: left;
    color: #ec5151;
    line-height: initial;
    height: 100%;
  }
  
  .announ-left img {
    vertical-align: midden;
    max-height: 90%;
    width: auto;
  }
  
  .announ-right {
    float: right;
    font-size: 1.4rem;
    padding-bottom:.3rem;
    padding-top:.3rem;
    height:2.8rem;
    line-height: 2.8rem;
    box-sizing: content-box;
    border-left: 1px solid #F6F6F9;
    color: #666;
    position: relative;
  }
  
  .announ-right a {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  
  .announ-right i {
    font-size: 1.4rem;
    margin-left: .2rem;
  }
  
  .announ-center {
    overflow: hidden;
    float: left;
    width: 64%;
    -webkit-box-flex: 1;
    box-flex: 1;
    flex: 1;
    -webkit-flex: 1;
    color: #333;
    height: 3rem;
    padding: 0 .7rem;
    padding-left: 0;
  }
  
  .announ-center .swiper-container {
    width: 100%;
    height: 100%;
  }
  
  .announ-center .swiper-slide .announcement-cont {
    font-size: 1.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    line-height: 3rem;
    position: relative;
    /* Center slide text vertically */
  }
  
  .announ-center .swiper-slide a {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
</style>