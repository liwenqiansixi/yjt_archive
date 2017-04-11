<template>
<div :id="id" class="vue-model mod-product">
  <!-- <img src="../assets/img/pic1.jpg"> -->
  <div class="frontend">
    <template v-if="isVisual != 0">
      <div class="product-list" :class="isComClass">
        <ul>
          <li v-for="item in data.imgList">
            <a :href="item.link | urlCode"></a>
            <div class="product-cart" v-show="isProCart">
              <i class="iconfont icon-cart"></i>
            </div>
            <figure>
              <img :src="item.img" />
              <figcaption>
                <h4>{{item.desc}}</h4>
                <p class="remark">
                  <em v-show="isStock">库存：{{item.stock}}</em>
                  <em v-show="isSale">销量：{{item.sale}}</em>
                  <p class="price">
                    <em>{{item.price}}</em>
                  </p>
              </figcaption>
            </figure>
          </li>
        </ul>
      </div>
</template>
    <template v-else>
<div class="product-list" :class="isComClass">
  <ul>
    <li v-for="item in visualImgList">
      <a :href="item.link | urlCode"></a>
      <div class="product-cart" v-show="isProCart">
        <i class="iconfont icon-cart"></i>
      </div>
      <figure>
        <img src="../assets/img/pic1.jpg" />
        <figcaption>
          <h4>{{item.desc}}</h4>
          <p class="remark">
            <em v-show="isStock">库存：{{item.stock}}</em>
            <em v-show="isSale">销量：{{item.sale}}</em>
            <p class="price">
              <em>{{item.price}}</em>
            </p>
        </figcaption>
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
        <label class="col-sm-3 control-label">样式：</label>
        <div class="col-sm-7">
          <label class="radio-inline" v-for="(item,index) in data.showStyle">
                    <input type="radio" :value="item.key" v-model="data.isStyleSel"> {{ item.text}}
                </label>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">显示标签：</label>
        <div class="col-sm-7">
          <label class="checkbox-inline" v-for="(item,index) in data.showTag">
                    <input type="checkbox" name="textIsGap" :value="item.key" v-model="data.isTagSel"> {{ item.text}}
                </label>
        </div>
      </div>
      <div class="">
        <label class="col-sm-3 control-label">显示模块：</label>
        <div class="col-sm-7">
          <label class="radio-inline" v-for="(item,index) in data.showMod">
                    <input type="radio" name="textIsMod" :value="item.key" v-model="data.isShowMod"> {{ item.text}}
                </label>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import eventHub from '../eventHub'
export default {
  name: 'product',
  props: ['id', 'data', 'setting', 'isVisual'],
  data() {
    return {
      "visualProductClass": {
        "small": false,
        "big": false,
        "normal":true
      },
      "visualImgList": [{
        "desc": "第一张图片",
        "sale": "0",
        "stock": "0",
        "price": "¥238.00",
        "marketPrice": "¥413.00"
      }, {
        "desc": "第二张图片",
        "sale": "0",
        "stock": "0",
        "price": "¥38.00",
        "marketPrice": "¥43.00"
      }, ],
    }
  },
  created() {
    this.getPostData(this.data.isShowMod);
  },
  methods: {
    getPostData(type){
      let vm = this;
      $.post(vm.url("index&c=index&a=goods"),{type:type},function(res) {
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
    }
  },
  computed: {
    isComClass() {
      let isStyleSelIndex = this.data.isStyleSel;
      switch (isStyleSelIndex) {
        case "0":
          this.visualProductClass.small = false;
          this.visualProductClass.big = true;
          this.data.showProductClass.small = false;
          this.data.showProductClass.big = true;
          this.visualProductClass.normal = false;
          this.data.showProductClass.normal = false;
          break;
        case "2":
          this.visualProductClass.small = true;
          this.visualProductClass.big = false;
          this.data.showProductClass.big = false;
          this.data.showProductClass.small = true;
          this.visualProductClass.normal = false;
          this.data.showProductClass.normal = false;
          break;
        default:
          this.visualProductClass.small = false;
          this.visualProductClass.big = false;
          this.data.showProductClass.big = false;
          this.data.showProductClass.small = false;

          this.visualProductClass.normal = true;
          this.data.showProductClass.normal = true;

          break;
      }
      return this.data.showProductClass;
    },
    isStock() {
      return this.isShowTags('0');
    },
    isSale() {
      return this.isShowTags('1');
    },
    isProCart() {
      return this.isShowTags('2');
    }
  },
  watch:{
    "data.isShowMod":{
      handler(val,oldVal){
        this.data.isShowMod = val;
      }
    }
  }
}
</script>

<style>
.product-list {
  padding: .05rem;
}

.product-list ul {
  overflow: hidden;
}

.product-list ul li {
  width: 50%;
  padding: .1rem;
  padding-bottom: 0;
  float: left;
  position: relative;
}

.product-list ul li a {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2
}

.product-list ul li .product-cart {
  position: absolute;
  right: .7rem;
  bottom: .7rem;
  width: 2.2rem;
  height: 2.2rem;
  line-height: 2.2rem;
  background: #ec5151;
  text-align: center;
  border-radius: 100%;
  color: #fff;
  z-index: 3
}

.product-list ul li .product-cart i {
  font-size: 1.5rem;
}

.product-list figure {
  background: #fff;
  padding: .8rem;
}

.product-list figure img {
  width: 100%;
  height: auto;
}

.product-list figure h4 {
  font-size: 1.5rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-all;
  overflow: hidden;

}

.product-list figcaption {
  margin-top: 1rem;
}

.product-list figure p {
  margin-top: .4rem;
}

.product-list figure .price em {
  color: #ec5151;
  font-size: 1.8rem;
  display: block;
}

.product-list figure .remark em {
  font-size: 1.3rem;
  color: #888;
}

.product-list.small li {
  width: 100%;
}

.product-list.small li figure {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: left;
  -webkit-box-align: center;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}

.product-list.small li figure img {
  width: 9rem;
  height: auto;
}

.product-list.small li figure figcaption {
  flex: 1;
  -webkit-flex: 1;
  margin-left: .8rem;
}
.product-list.normal figure h4{
  /*height:4rem;*/
}
.product-list.big ul li {
  width: 100%;
}

.product-list.big li figure img {
  width: 100%;
}
</style>
