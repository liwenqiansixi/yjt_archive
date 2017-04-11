<template>
  <div :id="id" class="vue-model mod-spike">
    <div class="frontend">
      <section class="spike">
        <template v-if="data.isShowStyle == '0'">
          <header>
            <div class="header-left">
              {{data.spikeName}}
            </div>
            <div class="header-center">
              <div class="header-time">
                <!-- <em>{{getTime.day}} </em>:--><em>{{data.hour | timeChange}}</em>:<em>{{data.min | timeChange}}</em>:<em>{{data.sec | timeChange}}</em>
              </div>
            </div>
            <div class="header-right">
              <a :href="data.moreLink | urlCode"></a>
              更多<i class="iconfont icon-right-arrow"></i>
            </div>
          </header>
          <swiper class="spike-swiper" :options="spikeSwiper">
            <swiper-slide v-for="item in data.imgList">
              <a class="link" :href="item.link | urlCode"></a>
              <figure>
                <img :src="item.img" />
                <figcaption class="price">
                  <em v-show="isPrice">{{item.price}}</em>
                  <del v-show="isMarketPrice">{{item.marketPrice}}</del>
                </figcaption>
              </figure>
            </swiper-slide>
            <div class="swiper-scrollbar" slot="scrollbar"></div>
          </swiper>
        </template>
        <template v-else>

        </template>

      </section>
    </div>
    <div class="backend" v-show="setting" v-if="isVisual == 0">
      <div class="backend-close" @click="closeBackend($event)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="arrow"></div>
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span> 秒杀标题：</label>
          <div class="col-sm-7">
            <input type="text" class="form-control" v-model="data.spikeName">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">更多链接：</label>
          <div class="col-sm-7">
            <input type="text" class="form-control" v-model="data.moreLink">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span> 结束时间：</label>
          <div class="col-sm-7 date-picker-style">
            <date-picker v-model="data.endTime" type="datetime" placeholder="选择日期时间">
            </date-picker>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">显示标签：</label>
          <div class="col-sm-7">
            <label class="checkbox-inline" v-for="(item,index) in data.showTag">
                    <input type="checkbox" name="textIsGap" :value="item.key" v-model="data.isTagSel"  v-cloak> {{ item.text}}
                </label>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">选择样式：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="(item,index) in data.showStyle">
                    <input type="radio" name="textIsGap" :value="item.key" v-model="data.isShowStyle"  v-cloak> {{ item.text}}
                </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  import eventHub from '../eventHub'
  import Vue from 'vue'
  import {
    swiper,
    swiperSlide,
    swiperPlugins
  } from 'vue-awesome-swiper'
  import {
    DatePicker,
    TimePicker
  } from 'element-ui';
  Vue.filter('timeChange', (val) => { //注册一个过滤器   当时分秒小于10在前面加0
    if (val < 10)
      return `0${val}`
    else
      return val;
  });
  export default {
    name: 'spike',
    props: ['id', 'data', 'setting', 'isVisual'],
    components: {
      swiper,
      swiperSlide,
      DatePicker,
      TimePicker
    },
    data() {
      return {
        "spikeSwiper": {
          "scrollbar": '.swiper-scrollbar',
          "scrollbarHide": false,
          "slidesPerView": 3.6,
          "paginationClickable": true,
          "freeMode": true,
        },
      }
    },
    created() {
      this.getTimeSpike(this.data.endTime);
      this.getRTime();
    },
    computed: {
      isPrice() {
        return this.isShowTags("0");
      },
      isMarketPrice() {
        return this.isShowTags("1");
      }
    },
    mounted() {
      if (this.getIsRTime() > 0 && this.isVisual != 0) { //大于0执行倒计时
        this.int = setInterval(this.getRTime, 1000);
      }
    },
    methods: {
      getTimeSpike(endTime) {
        let vm = this;
        $.post(this.url("index&c=index&a=goods"), { type: "promotion" }, function (res) {
          vm.data.imgList = res.data;
        })
      },
      closeBackend(event) {
        eventHub.$emit("close-backend", this.id);
        event.stopPropagation();
        // this.setting = false;
      },
      isShowTags(key) {
        if (this.data.isTagSel.indexOf(key) != -1) {
          return true;
        }
        return false;
      },
      getIsRTime() { //判断是否开启倒计时
        let dateFormat = /(-)/g
        let endTime = new Date(this.data.endTime);
        if(this.isVisual != 0){
          endTime = new Date(this.data.endTime.replace(dateFormat, '/'));
        }
        let nowTime = new Date();
        let t = endTime.getTime() - nowTime.getTime();

        return t;
      },
      getRTime() { //拆分时间
        let t = this.getIsRTime();

        let d = 0;
        let h = 0;
        let m = 0;
        let s = 0;
        if (t >= 0) {
          d = Math.floor(t / 1000 / 60 / 60 / 24) * 24;
          h = Math.floor(d + (t / 1000 / 60 / 60 % 24));
          m = Math.floor(t / 1000 / 60 % 60);
          s = Math.floor(t / 1000 % 60);

        }
        this.data.day = d;
        this.data.hour = h;
        this.data.min = m;
        this.data.sec = s;
      }
    },
    watch: {
      "data.endTime": {
        handler(val, valVal) {
          this.getTimeSpike(val);
          this.getRTime();

        }
      }
    }
  }

</script>

<style>
  .spike header {
    background: #fff;
    width: 100%;
    overflow: hidden;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    border-top: 1px solid #F6F6F9;
    border-bottom: 1px solid #F6F6F9;
    padding: .6rem 0;
  }
  
  .spike .header-left,
  .spike .header-right {
    padding: 0 1rem;
    justify-content: center;
    -webkit-justify-content: center;
  }
  
  .spike .header-left {
    float: left;
    padding-top: .6rem;
    padding-bottom: .6rem;
    color: #ec5151;
    float: left;
    line-height: 2.8rem;
  }
  
  .spike .header-right {
    float: right;
    padding-top: .6rem;
    padding-bottom: .6rem;
    position: relative;
    float: right;
    height: 2.8rem;
    line-height: 2.8rem;
    font-size: 1.4rem;
    box-sizing: content-box;
    color: #666;
  }
  
  .spike .header-right a {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  
  .spike .header-right i {
    font-size: 1.4rem;
    margin-left: .2rem;
  }
  
  .spike .header-center {
    width: 50%;
    padding-top: .6rem;
    padding-bottom: .6rem;
    height:2.8rem;
    line-height: 2.8rem;
    float: left;
    flex: 1;
    -webkit-flex: 1;
    color: #333;
    height: 3rem;
    height: initial;
    padding: 0 .7rem;
    padding-left: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  
  .spike .header-time {
    margin-left: -.3rem;
    color: #666;
    font-weight: bold;
  }
  
  .spike .header-time em {
    padding: .1rem .4rem;
    font-size: 1.2rem;
    margin: 0 .3rem;
    border-radius: .2rem;
    height: 2rem;
    width: 2rem;
    color: #fff;
    background: #555;
  }
  
  .spike .spike-swiper {
    padding-bottom: 1rem;
    padding-top: .8rem;
    width: 100%;
    background: #fff;
  }
  
  .spike .spike-swiper .swiper-slide {
    padding: .4rem 0;
    text-align: center;
    font-size: 18px;
    background: #fff;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: flex-start;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  
  .spike-swiper .swiper-slide a.link {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0
  }
  
  .spike-swiper .swiper-slide .price {
    margin: .4rem 0;
  }
  
  .spike-swiper .swiper-slide .price em,
  .spike-swiper .swiper-slide .price del {
    display: block;
  }
  
  .spike-swiper .swiper-slide .price em {
    color: #ec5151;
    font-size: 1.4rem;
  }
  
  .spike-swiper .swiper-slide .price del {
    font-size: 1.1rem;
  }
  
  .spike-swiper .swiper-slide img {
    width: 80%;
    height: auto;
  }
  
  .spike-swiper.swiper-container-horizontal>.swiper-scrollbar {
    bottom: 1rem;
    height: .17rem;
    width: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .spike .spike-swiper .swiper-scrollbar-drag {
    background: rgba(0, 0, 0, .4);
  }
</style>