import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { Toast } from 'vant';
import route from '../router'
import 'vant/lib/toast/style'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : location.origin, // url = base url + request url
  baseURL: location.origin, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // if (process.env.NODE_ENV !== 'development') {
    //   config.baseURL = process.env.VUE_APP_URL
    // }
    // do something before request is sent
    if (store.state.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    config.headers['Accept-Language'] = 'zh-Hans'
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res && res.statusCode === 401) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //     confirmButtonText: 'Re-Login',
        //     cancelButtonText: 'Cancel',
        //     type: 'warning'
        //   }).then(() => {
        //     store.dispatch('user/resetToken').then(() => {
        //       location.reload()
        //     })
        //   })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug

    if (error.response.data.code === 500) {
      // Toast({
      //   message: error.response.data.errorMessage,
      //   position: 'top',
      // })
    }
    if ([400, 500].includes(error.response.status)) {
      let errors
      if (error.response.data) {
        if (error.response.data.errorMessage) {
          errors = error.response.data.errorMessage
        }
        if (error.response.data.error_description) {
          errors = error.response.data.error_description
        }
        if ( error.response.data.error) {
          errors = error.response.data.error
        }
      }
      console.log(errors)
      // Toast({
      //   message: errors,
      //   position: 'top',
      // })
    }
    if (error.response.status === 401) {
      // Toast({
      //   message: '请重新登录！',
      //   position: 'top',
      // })
      // store.dispatch('loginout').then(() => {
      //   route.push({ path: '/login' })
      // })
      route.push({ path: '/' })
    }
    return Promise.reject(error)
  }
)

export default service
