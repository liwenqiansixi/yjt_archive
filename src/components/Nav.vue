<template>
  <div :id="id" class="vue-model mod-nav">
    <div class="frontend">
      <nav class="index-nav" :class="data.showGapClass">
        <ul>
          <li v-for="item in data.imgList" :style="{width:data.widthSize}">
            <a :href="item.link | urlCode"></a>
            <img :src="item.img" />
            <span v-show="data.isShowText">{{item.desc}}</span>
          </li>
        </ul>
      </nav>
    </div>
    <div class="backend" v-show="setting" v-if="isVisual == 0">
      <div class="backend-close" @click="closeBackend($event)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="arrow"></div>
      <form class="form-horizontal scroll-style">
        <div class="form-group">
          <label class="col-sm-3 control-label">一行几列：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="(item,index) in data.showStyle">
                  <input type="radio" name="picIsShow" :value="item.key" v-model="data.isStyleSel"> {{ item.text}}
              </label>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">显示描述：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="(item,index) in data.showText">
                    <input type="radio" name="textIsShow" :value="item.key" v-model="data.isTextSel"> {{ item.text}}
                </label>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">显示边距：</label>
          <div class="col-sm-7">
            <label class="checkbox-inline" v-for="(item,index) in data.showGap">
                    <input type="checkbox" name="textIsGap" :value="item.key" v-model="data.isGapSel" > {{ item.text}}
                </label>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">显示边框：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="(item,index) in data.showBorder">
                    <input type="radio" name="textIsBorder" :value="item.key" v-model="data.isBorderSel" > {{ item.text}}
                </label>
          </div>
        </div>
        <div class="form-group">
          <div class="add-link-sec picture-editor p-r" v-for="(item,index) in data.imgList">
            <span class="add-link-close p-a" @click="removePicture(index)"><i class="iconfont icon-close1"></i></span>
            <div class="add-link">
              <figure @click="updateNavBtn(index)">
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
  export default {
    name: 'nav',
    props: ['id', 'data', 'setting', 'isVisual'],
    data() {
      return {
        "maxLength": 10,
        "updateIndex": -1
      }
    },
    created() {
    },
    computed: {

      limit() {
        if (this.data.imgList.length >= this.maxLength) {
          return false;
        } else {
          return true;
        }
      }
    },
    methods: {
      updateNavBtn(index) {
        this.updateIndex = -1;
        this.updateIndex = index;
        eventHub.$off("update-nav-data");
        eventHub.$on("update-nav-data", this.updateNavData);
        eventHub.$emit('show-dialog', "navUpdate", 1);
      },
      updateNavData(updataData) {
        if (this.updateIndex < 0) {
          eventHub.$emit("message-show", "请重新修改图片", "warning");
          return false;
        }
        this.data.imgList[this.updateIndex].img = updataData[0].img;
      },
      closeBackend(event) {
        eventHub.$emit("close-backend", this.id);
        event.stopPropagation();
        // this.setting = false;
      },
      addNavData(addData) {
        var vm = this;
        addData.map((v, i) => {
          vm.data.imgList.push({ "desc": v.desc, "img": v.img, "link": "1" });
        });
      },
      removePicture(index) {
        this.data.imgList.splice(index, 1);
      },
      addPicBtn() {
        eventHub.$off("add-nav-data")
        eventHub.$on("add-nav-data", this.addNavData)
        let length = this.maxLength - this.data.imgList.length;
        eventHub.$emit('show-dialog', "nav", length);
      },
    },
    watch: {
      "data.isStyleSel": {
        handler(val, oldVal) {
          switch (val) {
            case '0':
              this.data.widthSize = "50%"
              break;
            case '1':
              this.data.widthSize = "33.33333%"
              break;
            case '2':
              this.data.widthSize = "25%"
              break;
            case '3':
              this.data.widthSize = "20%"
              break;
            default:
              this.data.widthSize = "20%"
              break;
          }
        }
      },
      "data.isTextSel": {
        handler(val, oldVal) {
          switch (val) {
            case '0':
              this.data.isShowText = true;
              break;
            case '1':
              this.data.isShowText = false;
              break;
            default:
              this.data.isShowText = true;
              break;
          }
        }
      },
      "data.isGapSel": {
        handler(val, oldVal) {
          this.data.showGapClass['nav-gap-out'] = false;
          this.data.showGapClass['nav-gap-in'] = false;
          for (let i = 0; i < val.length; i++) {

            if (val[i] == 0) {
              this.data.showGapClass['nav-gap-out'] = true;
            }
            if (val[i] == 1) {
              this.data.showGapClass['nav-gap-in'] = true;
            }
          }
        }
      },
      "data.isBorderSel": {
        handler(val, oldVal) {
          switch (val) {
            case '0':
              this.data.showGapClass['nav-border'] = true;
              break;
            case '1':
              this.data.showGapClass['nav-border'] = false;
              break;
            default:
              this.data.showGapClass['nav-border'] = true;
              break;
          }
        }
      }
    }
  }

</script>

<style>
  .mod-nav nav {
    background: #fff;
    min-height: 6rem;
  }
  
  .mod-nav nav.nav-gap-out {
    padding: .8rem .6rem;
  }
  
  .mod-nav nav.nav-gap-in ul li {
    padding: .8rem .4rem;
  }
  
  .mod-nav nav.nav-border ul li {
    border-right: 1px solid #f0f3f6;
    border-bottom: 1px solid #f0f3f6;
  }
  
  .mod-nav nav ul {
    width: 100%;
    overflow: hidden;
  }
  
  .mod-nav nav ul li {
    width: 20%;
    float: left;
    text-align: center;
    position: relative
  }
  
  .mod-nav nav ul li a {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  
  .mod-nav nav ul li span {
    font-size: 1.2rem;
    color: #333;
    margin-top: .4rem;
    display: block;
  }
  
  .mod-nav nav ul li img {
    width: 80%;
    height: auto;
  }
</style>