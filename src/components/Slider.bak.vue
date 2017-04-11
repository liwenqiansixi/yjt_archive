<template>
<div :id="id" class="vue-model mod-slider">
    <div class="frontend" :style="{ height: swipeHeight + 'px'}">
        <swipe class="swipe">
            <swipe-item v-for="(item, index) in data">
                <a :href="item.url | urlCode">
                    <img :src="item.img" class="itemimg" />
                </a>
            </swipe-item>
        </swipe>
    </div>
    <div class="backend" v-show="setting">
        <div class="arrow"></div>
        <form class="form-horizontal">
            <div class="form-group">
                <label for="inputTitle" class="col-sm-3 control-label"><span class="text-danger">*</span> 模块管理：</label>
                <div class="col-sm-7">
                    <input type="text" class="form-control title-name" id="inputTitle" v-model="data.title">
                </div>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';
import {
    Swipe,
    SwipeItem
} from 'mint-ui';

export default {
    name: 'slider',
    props: ['id', 'data', 'setting'],
    data() {
        return {
            swipeHeight: 0
        }
    },
    mounted() {
        let that = this;
        $(function() {
            that.swipeHeight = $('.swipe').find('img').height();
        });
    },
    components: {
        Swipe,
        SwipeItem
    }
}
</script>

<style>
.swipe img {
    width: 100%;
    height: auto;
}
</style>
