<template>
<div :id="id" class="vue-model mod-tabdown" >
    <div class="frontend">
        <div class="tabdown" :class="{'tabdown-fixed':isTabDwon}">
            <ul>
                <li class="home active">
                    <a v-url="'index'"></a>
                    <i></i>
                    <span>首页</span>
                </li>
                <li class="categroy">
                    <a v-url="'category'"></a>
                    <i></i> <span>分类</span>
                </li>
                <li class="search">
                    <a v-url="'search'"></a>
                    <i></i> <span>搜索</span>
                </li>
                <li class="cart">
                    <a v-url="'cart'"></a>
                    <i></i> <span>购物车</span>
                </li>
                <li class="me">
                    <a v-url="'user'"></a>
                    <i></i> <span>我</span>
                </li>
            </ul>
        </div>
    </div>
    <div class="backend" v-show="false" v-if="isVisual == 0">
      <div class="backend-close" @click="closeBackend($event)">
        <i class="iconfont icon-close"></i>
      </div>
        <div class="arrow"></div>
        <form class="form-horizontal">
            <div class="form-group">
                <label class="col-sm-3 control-label"><span class="text-danger">*</span> 导航：</label>
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
    name: 'image',
    props: ['id', 'data', 'setting','isVisual'],
    data() {
        return {
          "isTabDwon":false
        }
    },
    methods:{
      closeBackend(event){
        eventHub.$emit("close-backend",this.id);
        event.stopPropagation();
        // this.setting = false;
      },
    },
    mounted(){
      if(this.isVisual == 2){
        this.isTabDwon = true;
      }
      $("body").addClass("mbtn");
    }
}
</script>

<style>
.tabdown {
    background: rgba(254, 253, 252, 1);
    padding: .4rem 0;
    border-top: 1px solid #F6F6F9;
}

.tabdown ul {
    text-align: center;
    width:100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: left;
    -webkit-box-align: center;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.tabdown ul li {
    width:20%;
    float:left;
    flex: 1;
    -webkit-flex: 1;
    position:relative;
}

.tabdown ul li a{
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
}

.tabdown ul li i {
    display: block;
    background: url(http://test.dscmall.cn/mobile/statics/img/ec-icon.png) no-repeat;
        width: 2.7rem;
    height: 2.7rem;
    display: block;
    margin: 0 auto;
    background-size: 32.1rem;
}

.tabdown ul li span {
    font-size: 1.1rem;
}

.tabdown ul li.home i {
    background-position-x: .2rem;
}

.tabdown ul li.categroy i {
    background-position-x: -2.7rem;
}

.tabdown ul li.search i {
        background-position-x: -14.1rem
}

.tabdown ul li.cart i {
    background-position-x: -5.7rem;
}

.tabdown ul li.me i {
    background-position-x: -8.3rem;
}

.tabdown ul li.active i {
    background-position-y: -2.8rem;
}
.tabdown.tabdown-fixed{position:fixed; bottom:0; width:100%; z-index: 111}
body.mbtn{padding-bottom:5rem;}
</style>
