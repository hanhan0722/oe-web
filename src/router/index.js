import Vue from 'vue'
import Router from 'vue-router'
import Store from '../vuex/store'
Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      component: resolve => require(['@/pages/Layout/Layout'], resolve),
      children: [
        {
          path: '/',
          name: 'Index',
          component: resolve => require(['@/pages/Index/Index'], resolve)
        }
      ]
    },
    {
      path: '/user',
      component: resolve => require(['@/pages/Layout/Layout'], resolve),
      children: [
        {
          path: '/user',
          name: 'UserRecommend',
          component: resolve => require(['@/pages/User/UserRecommend'], resolve)
        }, {
          path: '/user/detail/:id/:type',
          name: 'UserDetail',
          component: resolve => require(['@/pages/User/UserDetail'], resolve)
        }, {
          path: '/user/list',
          name: 'UserList',
          component: resolve => require(['@/pages/User/UserList'], resolve)
        }
      ]
    },
    {
      path: '/article',
      component: resolve => require(['@/pages/Layout/Layout'], resolve),
      children: [
        {
          path: '/article',
          name: 'ArticleList',
          component: resolve => require(['@/pages/Article/ArticleList'], resolve)
        },
        {
          path: '/article/detail/:id',
          name: 'ArticleDetail',
          component: resolve => require(['@/pages/Article/ArticleDetail'], resolve)
        }
      ]
    }, {
      path: '/info/step1',
      component: resolve => require(['@/pages/Layout/Layout'], resolve),
      children: [{
        path: '/info/step1',
        name: 'WriteInfo',
        component: resolve => require(['@/pages/Info/WriteInfo'], resolve),
        children: [
          {
            path: '/info/step1',
            name: 'Step1',
            component: resolve => require(['@/pages/Info/Step1'], resolve),
          }, {
            path: '/info/step2',
            name: 'Step2',
            component: resolve => require(['@/pages/Info/Step2'], resolve),
          }, {
            path: '/info/step3',
            name: 'Step3',
            component: resolve => require(['@/pages/Info/Step3'], resolve),
          }, {
            path: '/info/step4',
            name: 'Step4',
            component: resolve => require(['@/pages/Info/Step4'], resolve),
          }
        ]
      }]
    }, {
      path: '/pay',
      component: resolve => require(['@/pages/Layout/Layout'], resolve),
      children: [{
        path: '/pay/tips',
        name: 'Tips',
        component: resolve => require(['@/pages/Pay/Tips'], resolve)
      }]
    },
    {
      path: '/chat',
      component: resolve => require(['@/pages/Layout/Layout'], resolve),
      children: [{
        path: '/chat',
        name: 'OeChat',
        component: resolve => require(['@/pages/Chat/OeChat'], resolve)
      }]
    },
    {
      path: '/menu/about',
      component: resolve => require(['@/pages/Layout/Layout'], resolve),
      children: [{
        path: '/menu/about',
        name: 'FooterMenu',
        component: resolve => require(['@/pages/Layout/FooterMenu'], resolve),
        children: [
          {
            path: '/menu/about',
            name: 'About',
            component: resolve => require(['@/pages/Layout/About'], resolve),
          },
          {
            path: '/menu/contact',
            name: 'Contact',
            component: resolve => require(['@/pages/Layout/Contact'], resolve),
          },
          {
            path: '/menu/map',
            name: 'Map',
            component: resolve => require(['@/pages/Layout/Map'], resolve),
          },
          {
            path: '/menu/explain',
            name: 'Explain',
            component: resolve => require(['@/pages/Layout/Explain'], resolve),
          },
          {
            path: '/menu/suggest',
            name: 'Suggest',
            component: resolve => require(['@/pages/Layout/Suggest'], resolve),
          }
        ]
      }]
    }
  ]
})
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
})
export default router