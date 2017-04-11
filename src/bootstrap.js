
window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

window.$ = window.jQuery = require('jquery');
require('bootstrap-sass');

/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */

window.Vue = require('vue');
require('vue-resource');

/**
 * Configuration
 */

Vue.config.silent = false;
Vue.config.devtools = true;

/**
 * We'll register a HTTP interceptor to attach the "CSRF" header to each of
 * the outgoing requests issued by this application. The CSRF middleware
 * included with Laravel will automatically verify the header's value.
 */

Vue.http.interceptors.push((request, next) => {
  request.headers.set('X-CSRF-TOKEN', Laravel.csrfToken);

  next();
});

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from "laravel-echo"

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });


if (window.ROOT_URL == undefined || typeof(window.ROOT_URL) == "undefined") {
  window.ROOT_URL = 'http://beta.yqg.1toall.com.cn/mobile/';
}

/**
 * Directives
 */
// 注册一个全局自定义指令 v-url
Vue.directive('url', {
  bind: function (el, binding) {
    el.href = window.ROOT_URL + 'index.php?m=' + binding.value;
  }
})

Vue.filter("urlCode", function (value) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  if (value != undefined) {
    return value.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => { return arrEntities[t]; });
  }
});

Vue.filter("rootUrl", function (value) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  return window.ROOT_URL+value;
});

/**
 * 生成服务端入URL
 */
Vue.prototype.url = function (module) {
  return window.ROOT_URL + 'index.php?m=' + module;
}
