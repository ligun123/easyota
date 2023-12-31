import router from './router';
import store from './store';
import {Message} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {getToken} from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({showSpinner: false}); // NProgress Configuration

const routesWithoutToken = ['/login', '/404']; //dont need token
const routesWithToken = ['/', '/dashboard'];

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'});
      NProgress.done();
    } else {
      let userInfo = store.state.user;
      if (userInfo.email) {
        next();
      } else {
        try {
          // get user info
          await store.dispatch('user/getUser');
          next();
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/logout');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (routesWithToken.indexOf(to.path) !== -1 || to.path.startsWith('/app/')) {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    } else {
      next();
    }
    /* has no token*/

    // if (routesWithoutToken.indexOf(to.path) !== -1) {
    //   // in the free login routesWithoutToken, go directly
    //   next();
    // } else {
    //   // other pages that do not have permission to access are redirected to the login page.
    // next(`/login?redirect=${to.path}`);
    // NProgress.done();
    // }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
