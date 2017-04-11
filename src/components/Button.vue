<template>
  <div :id="id" class="vue-model mod-button">
    <div class="frontend">
      <div class="padding-all" :class="{'position-filter':data.isPositionFilter}">
        <template v-if="data.isButtonSel == '0'">
          <button type="button" class="btn btn-default" id="button" :style="{color:data.buttonStyle.color,background:data.buttonStyle.bgStyle}">Default</button>
        </template>
        <template v-else>
          <div class="button-two-box">
            <div class="li" v-for="item in data.btnList"><button class="btn btn-warning" :style="{color:data.buttonStyle.color,background:data.buttonStyle.bgStyle}" @clock="bntAddId">{{item.text}}</button></div>
          </div>
        </template>
      </div>
    </div>
    <div class="backend" v-show="setting" v-if="isVisual == 0">
      <div class="backend-close" @click="closeBackend($event)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="arrow"></div>
      <form class="form-horizontal">
        <div class="form-group">
          <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 排列风格：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="item in data.isList">
              <input type="radio" name="isList" :value="item.key" v-model="data.isButtonSel"  v-cloak> {{ item.text}}
          </label>
          </div>
        </div>
        <div class="form-group two-btnlist-box" :class="{'two-btnlist':data.isButtonList}">
          <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 选择按钮：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="item in data.isBtnList">
              <input type="radio" name="isBtnList" :value="item.key" v-model="data.isButtonListSel"  v-cloak> {{ item.text}}
          </label>
          </div>
        </div>
        <div class="form-group">
          <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 是否固定：</label>
          <div class="col-sm-7">
            <label class="radio-inline" v-for="item in data.isPosition">
              <input type="radio" name="isPosition" :value="item.key" v-model="data.isPositionSel" v-cloak> {{ item.text}}
          </label>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span> 默认样式：</label>
          <div class="col-sm-7 btn-box">
            <button type="button" class="btn btn-default" @click="btnDefault">{{data.Default}}</button>
            <button type="button" class="btn btn-primary" @click="btnPrimary">{{data.Primary}}</button>
            <button type="button" class="btn btn-success" @click="btnSuccess">{{data.Success}}</button>
            <button type="button" class="btn btn-info" @click="btnInfo">{{data.Info}}</button>
            <button type="button" class="btn btn-warning" @click="btnWarning">{{data.Warning}}</button>
            <button type="button" class="btn btn-danger" @click="btnDanger">{{data.Danger}}</button>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">背景颜色：</label>
          <div class="col-sm-7">
            <input type="color" class="form-control" v-model="data.buttonStyle.bgStyle" />
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">文字颜色：</label>
          <div class="col-sm-7">
            <input type="color" class="form-control" v-model="data.buttonStyle.color" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import eventHub from '../eventHub'
  export default {
    name: 'button',
    props: ['id', 'data', 'setting', 'isVisual'],
    data() {
      return {

      }
    },
    methods: {
      closeBackend(event) {
        eventHub.$emit("close-backend", this.id);
        event.stopPropagation();
        // this.setting = false;
      },
      btnDefault() {
        var btn = document.getElementById("button");
        btn.style.background = '#fff';
        btn.style.color = '#333';
        btn.innerHTML = 'Default';
      },
      btnPrimary() {
        var btn = document.getElementById("button");
        btn.style.background = '#428bca';
        btn.style.color = '#fff';
        btn.innerHTML = 'Primary';
      },
      btnSuccess() {
        var btn = document.getElementById("button");
        btn.style.background = '#5cb85c';
        btn.style.color = '#fff';
        btn.innerHTML = 'Success';
      },
      btnInfo() {
        var btn = document.getElementById("button");
        btn.style.background = '#5bc0de';
        btn.style.color = '#fff';
        btn.innerHTML = 'Info';
      },
      btnWarning() {
        var btn = document.getElementById("button");
        btn.style.background = '#eb9316';
        btn.style.color = '#fff';
        btn.innerHTML = 'Warning';
      },
      btnDanger() {
        var btn = document.getElementById("button");
        btn.style.background = '#d9534f';
        btn.style.color = '#fff';
        btn.innerHTML = 'Danger';
      },
      bntAddId() {

      }
    },
    watch: {
      "data.isPositionSel": {
        handler(val, oldVal) {
          switch (val) {
            case 1:
              this.data.isPositionFilter = false;
              break;
            default:
              this.data.isPositionFilter = true;
              break;
          }
        }
      },
      "data.isButtonSel": {
        handler(val, oldVal) {
          switch (val) {
            case '1':
              this.data.isButtonList = true;
              break;
            default:
              this.data.isButtonList = false;
              break;
          }
        }
      },
    },
  }

</script>

<style>
  .two-btnlist-box {
    display: none
  }
  
  .two-btnlist {
    display: block;
  }
  
  .frontend {
    position: relative;
  }
  
  .position-filter {
    position: absolute;
    width: 100%;
    bottom: 0
  }
  
  .button-two-box {
    overflow: hidden;
  }
  
  .button-two-box .li {
    width: 50%;
    float: left;
  }
  
  .button-two-box .li:first-child {
    padding-right: .6rem;
  }
  
  .btn-box button {
    margin-bottom: .6rem;
    width: auto;
    padding: .4rem .4rem
  }
  
  .padding-all {
    padding: 1.3rem;
  }
  
  .btn {
    font-size: 1.7rem;
    border: 0;
    text-align: center;
    padding: .84rem 0;
    border-radius: 4px;
    width: 100%;
  }
  
  .btn-default {
    color: #333;
    background-color: #fff;
    border: 1px solid #ccc;
  }
  
  .btn-primary {
    color: #fff;
    background-color: #428bca;
  }
  
  .btn-success {
    color: #FFF;
    background-color: #5cb85c;
  }
  
  .btn-info {
    color: #FFF;
    background-color: #5bc0de;
  }
  
  .btn-warning {
    color: #FFF;
    background-color: #eb9316;
  }
  
  .btn-danger {
    color: #FFF;
    background-color: #d9534f;
  }
  
  .btn-link {
    color: #333;
  }
</style>