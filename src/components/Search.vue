<template>
  <div :id="id" class="vue-model mod-search">
    <div class="frontend">
      <header class="search" :class="{'search-visual':searchVisual,'search-preview':searchPreview,'search-fixed':searchFixed}">
        <div class="header-search" :style="{background:false == data.isSearchFilter ? data.headerStyle.bgStyle : ''}">
          <a v-url="'location'" style="color:#fff;">
            <div class="search-left" v-show="data.isSearchLeft">
              <span>{{lbsCityName}} <i class="iconfont icon-down-arrow"></i></span>
            </div>
          </a>
          <a v-url="'search'" class="search-center">
            <div>
              <i class="iconfont icon-search"></i> {{data.text}}
            </div>
          </a>
          <a v-url="'user&a=messagelist'" style="color:#fff;">
            <div class="search-right" v-show="data.isSearchRight">
              <em></em>
              <i class="iconfont icon-message"></i>
            </div>
          </a>
        </div>
        <div class="search-mask"></div>
      </header>
    </div>
    <div class="backend" v-show="setting" v-if="isVisual == 0">
      <div class="backend-close" @click="closeBackend($event)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="arrow"></div>
      <form class="form-horizontal">
        <div class="form-group">
          <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 标题：</label>
          <div class="col-sm-7">
            <input type="text" class="form-control title-name" v-model="data.text">
          </div>
        </div>
        <div class="form-group">
          <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 是否悬浮：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="item in data.isFixed">
                    <input type="radio" name="isFixed" :value="item.key" v-model="data.isFixedSel"  v-cloak> {{ item.text}}
                </label>
          </div>
        </div>
        <div class="form-group" :class="{'fixed-color':data.isSearchFilter}">
          <label class="col-sm-3 control-label">背景颜色：</label>
          <div class="col-sm-7">
            <input type="color" class="form-control" v-model="data.headerStyle.bgStyle" />
          </div>
        </div>
        <div class="form-group">
          <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 定位：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="item in data.isLocation">
                    <input type="radio" name="isLocation" :value="item.key" v-model="data.isLocationSel"  v-cloak> {{ item.text}}
                </label>
          </div>
        </div>
        <div class="form-group">
          <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 消息：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="item in data.isMessage">
                    <input type="radio" name="isMessage" :value="item.key" v-model="data.isMessageSel"  v-cloak> {{ item.text}}
                </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script type="text/javascript">
  import eventHub from '../eventHub'
  import $ from 'jquery'
  import Vue from 'vue'
  export default {
    name: 'search',
    props: ['id', 'data', 'setting', 'isVisual'],
    data() {
      return {
        "searchVisual": false,
        "searchPreview": false,
        "searchFixed": false,
        "lbsCityName": '上海'
      }
    },
    created() {
      if (this.isVisual == 0 && this.data.isFixedSel == '0') {
        this.searchVisual = true;
      }

      if (this.isVisual == 1 && this.data.isFixedSel == '0') {
        this.searchPreview = true;
      }
      if (this.isVisual == 2 && this.data.isFixedSel == '0') {
        this.searchFixed = true;
      }
      let cityName = this.getCookie('lbs_city_name');
      if (cityName) {
        this.lbsCityName = cityName;
      }
    },
    methods: {
      getCookie(c_name) {
        if (document.cookie.length > 0) {
          let c_start = document.cookie.indexOf(c_name + "=")
          if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            let c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
          }
        }
        return "";

      },
      setCookie(c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
          ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
      },
      closeBackend(event) {
        eventHub.$emit("close-backend", this.id);
        event.stopPropagation();
      },
    },
    watch: {
      "data.isFixedSel": {
        handler(val, oldVal) {
          switch (val) {
            case '1':
              this.data.isSearchFilter = false;
              this.searchVisual = false;
              break;
            default:
              this.data.isSearchFilter = true;
              this.searchVisual = true;
              break;
          }
        }
      },
      "data.isLocationSel": {
        handler(val, oldVal) {
          switch (val) {
            case '1':
              this.data.isSearchLeft = false;
              break;
            default:
              this.data.isSearchLeft = true;
              break;
          }
        }
      },
      "data.isMessageSel": {
        handler(val, oldVal) {
          switch (val) {
            case '1':
              this.data.isSearchRight = false;
              break;
            default:
              this.data.isSearchRight = true;

              break;
          }
        }
      }
    }
  }

</script>

<style>
  .mod-search header {
    width: 100%;
    height: 5.4rem;
    line-height: 5.4rem;
    vertical-align: middle;
    color: #fff;
    z-index: 12;
  }
  
  .header-search {
    z-index: 111;
    position: absolute;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    background: rgba(236, 81, 81, 0);
    padding: 0 1rem;
    overflow: hidden;
    height: 5.4rem;
    line-height: 3.4rem;
    width: 100%
  }
  
  .mod-search .fixed-color {
    display: none
  }
  
  .mod-search .search-left {
    float: left;
    width: 6rem;
    /*padding: 0 1rem 0 0;*/
    padding-top: .6rem;
    padding-bottom: .6rem;
  }
  
  .mod-search .search-right {
    float: right;
    padding: 0 0 0 1rem;
  }
  
  .mod-search .search-left,
  .mod-search .search-right {
    justify-content: center;
  }
  
  .mod-search .search-left i {
    font-size: 1rem
  }
  
  .mod-search .search-center {
    margin-top: .6rem;
    margin-bottom: .6rem;
    width: 64%;
    float: left;
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex:1;
    height: 3.4rem;
    line-height: 3.4rem;
    padding: 0 1rem;
    box-sizing: content-box;
    font-size: 1.4rem;
    border-radius: .4rem;
    background: #fff;
    color: #999;
  }
  
  .mod-search .search-center i.icon-search {
    margin-right: .4rem;
  }
  
  .mod-search .search-right {
    float: right;
    margin-top: .6rem;
    margin-bottom: .6rem;
    position: relative;
    -webkit-justify-content: center;
    justify-content: center;
  }
  
  .mod-search .search-right i {
    -webkit-flex: 1;
    flex: 1;
    font-size: 2.2rem;
  }
  
  .mod-search .search-right em {
    position: absolute;
    display: block;
    width: .6rem;
    height: .6rem;
    border-radius: 100%;
    background: #ff0000;
    right: .3rem;
    top: .1rem;
    border: 1px solid #fff;
  }
  
  header.search-visual,
  header.search-fixed,
  header.search-preview {
    z-index: 11;
    width: 100%;
    background: rgba(236, 81, 81, 0);
  }
  
  header.search-visual {
    position: relative;
  }
  
  header.search-preview {
    position: absolute;
  }
  
  header.search-fixed {
    position: absolute;
  }
  
  header.search-fixed .search-mask,
  header.search-visual .search-mask,
  header.search-preview .search-mask {
    position: absolute;
    background-image: linear-gradient( rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0) 98%);
    z-index: -1;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
  
  header.search-visual .search-center,
  header.search-fixed .search-center {
    background: rgba(255, 255, 255, 0.8);
    color: #666;
  }
</style>