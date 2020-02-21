
// import {getStorage} from "commonFun";
import {getStorage,setStorage,param} from "tollPlugin/commonFun";
// import 'isomorphic-fetch';//解决IE不支持fetch
import {Toast} from 'antd-mobile';
// const modalAlert = Modal.alert;
let flag =false;
 
interface ApiRequestObj{
    method:string,
    headers:JSON | any,
    body?:string
}
const apiRequest = (action:any, callback:any) => {
    action.params = action.params || {};
    let user = getStorage("user") || {};
    let authorization="";
    let method  = action.method.toLocaleUpperCase();
    let url = action.url;
    let timeOutId:any;
    if (user && user.Token) {
        authorization = user.UserName+' '+user.Token;
    }
    let obj:ApiRequestObj= {
        method:method,
        headers :{
            "Authorization":authorization,
            "Content-Type":"application/json",
        },
    };
    if(method === "GET"){
        url = url+'?'+param(action.params);
    }else if(method==="POST"){
        obj.body = JSON.stringify(action.params);
    }
    Promise.race([
        fetch(window.config.apiPath + url, obj),
        new Promise((resolve,reject)=>{
            timeOutId= setTimeout(()=> {
                if(url.indexOf('User/GetUnreadSiteMsgs')<0){
                    reject(
                        new Error('请求超时!')
                    )
                }
            },120000)
        }
    )])
        .then((res)=>{
            if (timeOutId) {
                 clearTimeout(timeOutId);
                timeOutId = null;
            }
            return res;
        })
        .then((res:any) => {
            if (res.status >= 200 && res.status < 300) {
                return res;
            }

            const error:any = new Error(res.statusText);
            error.status = res.status;
            if(res.url.indexOf('User/GetUnreadSiteMsgs')>=0){//如果是请求未读信息是错误 忽略
                error.url='User/GetUnreadSiteMsgs';
            }
            throw error;
        })
        .then(res => {
            return res.json();
        })
        .then(resJson => {
            if (resJson.StatusCode === 0) {
                if (resJson.token) {
                    user.token = resJson.token;
                    setStorage("user", user);
                }
            }
            callback(resJson);
        })
        .catch(err=>{
            console.error(url,"中间件捕获异常：",err)
            if(err.message === "请求超时!"){
                // Toast.hide();
                if(!flag){
                    flag=true;
                    // modalAlert('请求超时!','请您稍后再试！',[
                    //     {text:"确认",onPress:()=>{
                    //         flag =false;
                    //     }}
                    // ])
                }
                return;
            }
            if(err.status>300 ){
                callback({status:err.status,url:err.url});
                return;
            }
            callback({StatusCode:-888,Message:err});
        })
}
export default (store:any) => (next:any) => (action:any) => {
    if (action.type !== "api_start") {
        return next(action);
    }
    next(action);
    if (action.loadMsg) {
        Toast.loading(action.loadMsg.message, 300);
    }
    apiRequest(action, (resp:any)=>{
        // Toast.hide();
        if(resp.StatusCode === -1 && resp.Message ==="未登录"){
            if(window.location.pathname==="/Home/Login") return;
            if(!flag){
                flag=true;
                window.actions.clearUser();
                window.actions.popWindowAction({type:"LoginWindow",text:"未登录前往登录"});
                flag =false;
                return;
            }
        }

        if (resp.StatusCode === 0 && action.successMsg) {
            Toast.success(action.successMsg.message, 1);
        } else if (resp.StatusCode !== 0 && resp.StatusCode !== 10110 && action.errorMsg) {
            Toast.fail(action.errorMsg.message, 1);
        }

        // else if(resp.status >300 && resp.url !=="User/GetUnreadSiteMsgs" ){
        //     // Toast.hide();
        //     if(!flag){
        //         flag=true;
        //         // modalAlert('接口请求错误！','请您稍后再试！',[
        //         //     {text:"确认",onPress:()=>{
        //         //             flag =false;
        //         //         }
        //         //     }
        //         // ]);
        //     }
        //     return;
        // }
        // else if (resp.StatusCode === -888){
        //     // Toast.hide();
        //     if(!flag){
        //         flag=true;
        //         // modalAlert('网络异常,请稍候再试!','请检查您的网路是否已连接！错误代码'+resp.Message,[
        //         //     {text:"确认",onPress:()=>{
        //         //             flag =false;
        //         //         }
        //         //     }
        //         // ]);
        //     }
        //     return;
        // }
        action.response = resp;
        action.type = "api_finish";
        next(action);
    })
}