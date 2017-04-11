<template>
<div :id="id" class="vue-model mod-nav">
    <div class="frontend">
        <nav>
            <ul v-for="list in group">
                <li v-for="item in list">
                    <a :href="item.url | urlCode">
                        <img :src="item.icon" :alt="item.name" />
                        <p>{{ item.name }}</p>
                    </a>
                </li>
            </ul>
        </nav>
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

<script type="text/javascript">
export default {
    name: 'nav',
    props: ['id', 'data', 'setting'],
    data() {
        return {
            group: []
        }
    },
    created() {
        let group = [];
        let items = [];
        let navList = this.data;
        for (var i = 0; i < navList.length; i++) {
            items.push(navList[i]);
            if ((i + 1) % 5 == 0) {
                group.push(items);
                items = [];
            }
        }
        this.group = group;
    }
}
</script>

<style>
.frontend nav {
    padding: .8rem
}

.frontend nav ul {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
}

.frontend nav ul li {
    padding: .5rem;
    box-sizing: border-box;
    text-align: center;
}

.frontend nav ul li img {
    width: 80%;
    height: auto
}

.frontend nav ul li p {
    height: 1.8rem;
    line-height: 1.8rem;
}

.frontend nav ul li a {
    color: #222222;
    font-size: 1.2rem
}
</style>
