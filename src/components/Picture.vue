<template>
<div :id="id" class="vue-model mod-picture">
  <div class="frontend">
    <template v-if="data.isStyleSel == 0">
    <swiper class="picture picture-del" :options="pictureOption">
      <swiper-slide v-for="item in data.imgList">
        <a :href="item.link | urlCode"></a>
        <figure>
          <img class="swiper-lazy" :data-src="item.img | rootUrl" :src="item.img" alt="" />
          <figcaption v-show="!!item.desc">{{item.desc}}</figcaption>
        </figure>
        <div class="swiper-lazy-preloader" v-show="pictureOption.lazyLoading"></div>
      </swiper-slide>
      <!-- 以下配置均为可选（使用具名slot来确定并应用一些操作控件元素） -->
      <div class="swiper-pagination picturePagination" slot="pagination"></div>
    </swiper>
</template>
    <template v-else>
<div class="picture-tile" :class="{small:data.isSmall}">
  <ul>
    <li v-for="(item,index) in data.imgList">
      <a :href="item.link | urlCode"></a>
      <figure>
        <img :data-src="item.img" :src="item.img" alt="" />
        <figcaption v-show="!!item.desc">{{item.desc}}</figcaption>
      </figure>
    </li>
  </ul>
</div>
</template>
  </div>
  <div class="backend" v-show="setting" v-if="isVisual == 0">
    <div class="backend-close" @click="closeBackend($event)">
      <i class="iconfont icon-close"></i>
    </div>
    <div class="arrow"></div>
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-3 control-label">显示方式：</label>
        <div class="col-sm-7">
          <label class="radio-inline" v-for="(item,index) in data.showStyle">
                          <input type="radio" name="picIsShow" :value="item.key" v-model="data.isStyleSel"  v-cloak> {{ item.text}}
                    </label>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">显示大小：</label>
        <div class="col-sm-7">

          <label class="radio-inline" v-for="(item,index) in picSize">
                        <input type="radio" name="picSize" :value="item.key" v-model="data.isSizeSel"  v-cloak> {{ item.text}}
                  </label>
        </div>
      </div>
      <div class="form-group">
        <div class="add-link-sec picture-editor p-r" v-for="(item,index) in data.imgList">
          <span class="add-link-close p-a" @click="removePicture(index)"><i class="iconfont icon-close1"></i></span>
          <div class="add-link">
            <figure @click="updatePicBtn(index)">
              <span class="img-mask">
                <i class="iconfont icon-camera1"></i>
              </span>
              <img :data-src="item.img" :src="item.img" alt="" />
            </figure>
            <section class="add-link-r">
              <div class="form-group"><label class="col-sm-4 control-label">标题：</label>
                <div class="col-sm-8 add-link-r-n"><input type="text" class="form-control" v-model="item.desc"></div>
              </div>
              <div class="form-group"><label class="col-sm-4 control-label ">链接：</label>
                <div class="col-sm-8 add-link-r-n"><input type="text" class="form-control" v-model="item.link"></div>
              </div>
            </section>

          </div>
        </div>
      </div>
      <div class="form-group picture-add-group" v-show="limit">
        <div class="add-button" @click="addPicBtn">
          <span><i class="iconfont icon-plus"></i></span>
          <p>添加一个广告</p>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import eventHub from '../eventHub'
import moduleData from '../config/module.js'
import {
  swiper,
  swiperSlide,
  swiperPlugins
} from 'vue-awesome-swiper'


export default {
  name: 'picture',
  props: ['id', 'data', 'setting','isVisual'],
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      "picSize": [],
      "maxLength": 10,
      "updateIndex":-1,
      "pictureOption": {
        "pagination": ".swiper-pagination",
        "lazyLoading": false,
        "autoplay": 4800,
        "autoplayDisableOnInteraction": false,
        "lazyLoadingInPrevNextAmount": 1,
        "loop":true
      },
    }
  },
  created() {
    if(this.isVisual == 0){
      this.pictureOption.autoplay = 0;
    }
  },
  methods: {
    closeBackend(event){
      eventHub.$emit("close-backend",this.id);
      event.stopPropagation();
      // this.setting = false;
    },
    addPicData(addData) {
      var vm = this;
      addData.map((v, i) => {
        vm.data.imgList.push({
          "desc": v.desc,
          "img": v.img,
          "link": "#"
        });
      });
    },
    updatePicBtn(index){
      this.updateIndex = -1;
      this.updateIndex = index;
      eventHub.$off("update-pic-data");
      eventHub.$on("update-pic-data", this.updatePicData);
      eventHub.$emit('show-dialog', "pictureUpdate", 1);
    },
    updatePicData(updataData){
      if(this.updateIndex<0){
        eventHub.$emit("message-show","请重新修改图片","warning");
        return false;
      }
      this.data.imgList[this.updateIndex].img = updataData[0].img;
    },
    addPicBtn() {
      let length = this.maxLength - this.data.imgList.length;
      eventHub.$off("add-pic-data");
      eventHub.$on("add-pic-data", this.addPicData);
      eventHub.$emit('show-dialog', "picture", length);
    },
    getPicSize(val) { //根据显示方式获取显示大小的属性值
      let picSizeKey = this.data.showStyle[val].picSizeKey;
      this.picSize = [];
      for (let i = 0; i < picSizeKey.length; i++) {
        this.picSize.push(this.data.picSize[i]);
      }
    },
    removePicture(index) {
      this.data.imgList.splice(index, 1);
    }
  },
  computed: {
    comImgList() {
      let comImgList = [];
      for (let i = 0; i < 3; i++) {
        comImgList.push(this.data.imgList[i]);
      }
      return comImgList;
    },
    limit(){
      if(this.data.imgList.length >= this.maxLength){
        return false;
      }else{
        return true;
      }
    }
  },
  watch: {
    "data.isStyleSel": {
      handler(val, oldVal) {
        this.getPicSize(val);
      }
    },
    "data.isSizeSel": {
      handler(val, oldVal) {
        switch (val) {
          case "1":
            this.data.isSmall = true;
            break;
          default:
            this.data.isSmall = false;
            break;
        }
      }
    }
  }
}
</script>

<style>
.picture .swiper-slide {
  min-height: 8rem;
}

.picture .swiper-slide img {
  width: 100%;
  height: auto;
}

.picture .picturePagination .swiper-pagination-bullet-active {
  background: #ec5151;
}

.picture .picturePagination .swiper-lazy-preloader {
  background: #ff0000
}

.picture a,
.picture-tile a {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.picture figcaption,
.picture-tile figcaption {
  font-size: 1.4rem;
  padding: 0 .8rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2.6rem;
  line-height: 2.6rem;
  display: block;
  box-sizing: content-box;
}


/*分开显示默认*/

.picture-tile ul {
  overflow: hidden;
  padding: .3rem;
}

.picture-tile ul li {
  padding-bottom: .3rem;
  position: relative;
}

a {
  transition: transform 1s
}

.picture-tile ul li:last-child {
  padding-bottom: 0;
}

.picture-tile ul li figure {
  position: relative;
}

.picture-tile ul li img {
  width: 100%;
}


/*分开显示small*/

.picture-tile.small ul li {
  width: 50%;
  float: left;
}

.picture-tile.small ul li:nth-child(2n-1) {
  padding-right: .15rem;
}

.picture-tile.small ul li:nth-child(2n) {
  padding-left: .15rem;
}

.picture-editor {
  overflow: hidden;
  margin-bottom: .8rem;
}

.picture-editor .add-link {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1.4rem;
  padding-right: 1.4rem;
}

.picture-editor .add-link-r {
  flex: 1;
  -webkit-flex: 1;
}

.add-link-r-n {
  padding-left: 0;
}

.picture-editor figure {
  display: flex;

  align-items: center;
  justify-content: center;
  -webkit-align-items: center;
  -webkit-justify-content: center;

  border: 1px solid #f1f1f1;
  border-radius: .2rem;
  overflow: hidden;
  width: 8rem;
  height: 8rem;
  position:relative;
}
.picture-editor figure .img-mask{
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  top:0;
  background:rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;

  -webkit-justify-content: center;
  -webkit-align-items: center;
  display: none;
}

.picture-editor figure .img-mask .icon-camera1{
  color:rgba(255, 255, 255, .8);
  font-size:4.1rem;

}

.picture-editor figure:hover{
  cursor: pointer;

}

.picture-editor figure:hover .img-mask{
  display: inherit;
}

.picture-editor figure img {
  max-width: 100%;
  max-height: 100%;
}

.picture-add-group .add-button {
  margin-top: 0;
}

.picture-del {}
</style>
