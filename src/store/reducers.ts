import { combineReducers } from 'redux';
import { onApiResultCallback } from "./anctions";
import { setStorage, getStorage , remove } from "tollPlugin/commonFun";
// import { number } from 'prop-types';


const apiResult = (state = null, action: any) => {//api回调
    if (action.type === "api_finish") {
        setTimeout(() => {
            onApiResultCallback(action)
        });
        return action;
    }
    return state;
};

function deepCopy(state: any) {
    let newState: any = JSON.stringify(state);//进行深拷贝
    return JSON.parse(newState);
}

interface PopWindow {
    type: string
}
//各种状态临时存储
const popWindow = (state: PopWindow = { type: "" }, action: any) => {
    if (action.response && action.response.StatusCode === "popWindow") {
        let newState: any = deepCopy(state);
        if (action.type) {
            newState = { ...action.response, type: action.type };
        } else {
            newState = { type: "" }
        }
        return newState;
    }
    return state;
};

//获取首页是否需要弹出框
const homePromotion = (state = [], action: any) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0 && action.url === "News/GetList" && (action.params.CategoryCode==="home-promotion"||action.params.CategoryCode==="app_home_promotion")) {
        state = action.response.NewsInfo;
    }
    return state;
}



///轮播图
const wapAdsList = (state = [], action: any) => {
    if (action.type !== "api_finish" || action.response.StatusCode !== 0) {
        return state;
    }
    if (action.url === "News/GetAllAds" && action.params.Type.indexOf("mobile_home_images") > -1) {

        state = action.response.List;
    }
    return state;
}



//获取公告走马灯
const notices = (state = [], action: any) => {
    if (action.type === "api_finish" && action.url === "News/GetList" && action.params.CategoryCode === "notice" && action.response.StatusCode === 0) {
        let newState =deepCopy(state)
        newState = action.response.NewsInfo;
        return newState;
    }
    return state;
};

//客服信息
const remoteSysConfs = (state = { allow_hongbao: "0", allow_hongBao: "0", allow_zhuanpan: "0", allow_zhuanPan: "0", channel_push_url: "" }, action: any) => {
    if (action.type === "api_finish" && action.url === "client/all_sys_cfg" && action.response.StatusCode === 0) {
        state = { ...state, ...action.response.Config };
    }
    return state;
}

/*
游戏中心接口，包含首页导航各种游戏内页导航、以及游戏。
*/
const gameLayout = (state = {
    sideBarNav: [],//首页侧边栏导航
    wapHomeGames: [],//首页游戏TAB
}, action: any) => {
    if (action.type === "api_finish" && action.url === "Client/GetGameLayout" && action.response.StatusCode === 0) {
        let newState: any = deepCopy(state);
        switch (action.params.Tag) {
            case "wapSideBar": {//wap相关   首页测导航栏
                newState.sideBarNav = action.response.Data;
                return newState;
            }
            case "wapHome": {//首页游戏TAB
                newState.wapHomeGames = action.response.Data;
                return newState;
            }
        }
    }
    return state;
};
//游戏分类
const wapCategores = (state = { slot_category: [] }, action: any) => {
    if (action.type === "api_finish" && action.url === "client/wap_game_categories" && action.response.StatusCode === 0) {
        state = deepCopy(state);
        state.slot_category = action.response.Data;
        return state;
    }
    return state;
}
interface User {
    [key: string]: any
}
const user = (
    state:User={
        amount:0,
        bankAccounts:[],// 银行卡
        userBalance:0.00,
    }, 
    action: any) => {
    let changed = false;
    //自动登录从本地储存取出的用户信息
    if (action.type === "setUser") {
        state = {
            ...state, ...action.response
        };
    }
    //清除本地和内存的user信息
    if (action.type === "clearUser" || action.type === "Account_Logout") {
        let newState: any = deepCopy({amount:0,bankAccounts:[]});
        remove("user")
        return newState;
    }

    if (action.type === "api_finish" && action.response.StatusCode === 0) {
        //登录API返回的用户信息
        if (action.url === "Account/Login") {
            state = {
                ...state, ...action.response
            };
            changed = true;
        }
        if (action.url === "Account/Logout") {
            let newState: any = deepCopy({amount:0,bankAccounts:[]});
            sessionStorage.clear()
            remove("user")
            return newState;
        }
        if (action.response.Token) {
            state = { ...state, Token: action.response.Token };
            changed = true;
        }
        if (action.url === "Game/GetAllBalance") {
            let obj = action.response.Data;
            let amount = state.amount;
            for (var i in obj) {
                amount += obj[i]
            }
            state = deepCopy(state)
            state = { ...state, userBalance: amount.toFixed(2) };
            changed = true;
        }
        if (action.url === "User/GetBankCards") {
            state = Object.assign(state, {bankAccounts: action.response.List});
            changed = true;
        }
        //用户信息
        if (action.url === "Account/GetLoginUser" && action.type === "api_finish" && action.response.StatusCode === 0) {
            let resp = action.response;
           
            state = {
                ...state,
                qq: resp.UserInfo.QQ,
                username: resp.UserInfo.UserName,
                recommendCode: resp.UserInfo.RecommendCode,
                userLevel: resp.UserInfo.UserLevel,
                realName: resp.UserInfo.TrueName,
                email: resp.UserInfo.Email,
                phone: resp.UserInfo.Phone,
                amount: resp.UserInfo.Cash,
                userLevelName: resp.UserInfo.UserLevelName,
                LastLoginTime: resp.UserInfo.LastLoginTime,
                verfyPhone: resp.UserInfo.PhoneValidateStatus,
                verfyEmail: resp.UserInfo.EmailValidateStatus,
                birthday: resp.UserInfo.Birthday,
                SingleMinWithdraw: resp.UserInfo.SingleMinWithdraw,
                weChat: resp.UserInfo.Wechat,
                province: resp.UserInfo.Province,
                city: resp.UserInfo.City,
                integral: resp.UserInfo.Integral,
                address: resp.UserInfo.Address,
                AutoTransfer: resp.UserInfo.AutoTransfer,
                SourceWithdrawalPassword: resp.UserInfo.SourceWithdrawalPassword,
                IsSourceUser: resp.UserInfo.IsSourceUser,
                ImagePath: resp.UserInfo.ImagePath,
                SceneImage: resp.UserInfo.SceneImage,
                HasWithdrawalPassword: resp.UserInfo.HasWithdrawalPassword,
            };
            changed = true;
        }
    }
    if (changed) {
        state = { ...state, ...action.response };
        let newState: any = deepCopy(state);
        setStorage("user", newState);
        return newState;
    }
    return state;
};




//最爱游戏
interface favoriteObj {
    Id: string;
}
const favoritesIds = (state = { Fids: [], favoriteGames: [] }, action: any) => {
    if (action.type === "api_finish" && action.url === "Game/GetFavorites") {
        let Fid: any = [];
        action.response.List.forEach((list: favoriteObj) => {
            Fid.push(list.Id)
        });
        state.Fids = Fid;

        state.favoriteGames = action.response.List;
    }
    return state;
}
//最近游戏
const recentlyGames = (state = { casinos: [] }, action: any) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0 && action.url === "Game/GetRecentlyGames") {
        return state = { ...state, ...{ casinos: action.response.List } };
    }
    return state;
}

//游戏相关数据
const game = (state = {
    platforms: [],
    gameMoney:0
}, action: any) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0) {
        let ret = deepCopy(state);
        if (action.url === "client/game_platforms") {//获取游戏平台
            let resp = action.response;
            ret.platforms = resp.Data;
            let sps = [];
            for (var i = 0; i < ret.platforms.length; i++) {
                let p = ret.platforms[i];
                if(!p.Enabled || p.ID==="YOPLAY"){
                    ret.platforms.splice(i,1)
                }
                if (p.ShowSlot) {
                    sps.push(p);
                }
                if (p.MarkInfos) {
                    let mms = p.MarkInfos.split("##");
                    sps.push({
                        id: mms[0].trim(),
                        markId: mms[0].trim(),
                        name2: mms[1].trim(),
                        order: parseInt(mms[2] || 0),
                        showSlot: 1
                    });
                }
            }
            sps.sort((a1, a2) => {
                return a2.order - a1.order;
            })
            ret.slot_platforms = sps;
            return ret
        }
        if (action.url === "Game/GetBalance") {//获取平台的余额
            let resp = action.response;
            let gameMoney: number = 0;
            for (var t = 0; t < ret.platforms.length; t++) {
                let platform = ret.platforms[t];
                if (platform.ID === action.params.GamePlatform) {
                    platform.Balance = resp.Balance;
                }
            }
            for (let ts = 0; ts < ret.platforms.length; ts++) {
                let platform = ret.platforms[ts];
                if(platform.Balance){
                    gameMoney += +platform.Balance;
                }
            }
            ret.gameMoney = gameMoney.toFixed(2);//游戏总余额
            return ret;
        }
        if (action.url === "Game/GetAllBalance") {//获取所有平台的余额
            let resp = action.response.Data;
            let gameMoney:number=0;
            Object.keys(resp).forEach((key)=>{
                gameMoney = +gameMoney+resp[key]
            })
            ret.gameMoney = gameMoney.toFixed(2);//游戏总余额

            for (let i = 0; i < state.platforms.length; i++) {
                let platform = ret.platforms[i];
                platform.Balance = resp[platform.ID] ? resp[platform.ID] : 0;
            }
            return ret;
        }
    }
    return state;
}
// ______________________________________________________ alone

interface ActionInterface{
    method:string,
    params:{
        mobile?:boolean,
        UserName?:string,
        LuckyNo?:string,
        pageNo?:number,
        pageSize?:number
    },
    response:any,
    type:string,
    url:string
}

// 支付方式
interface PayList{
    PayList:any[],
    QuickPrice:string
}
const getAllPay = (state:PayList = { PayList:[],QuickPrice:"" }, action:ActionInterface) => {
    if (action.type === "api_finish" && action.url === "Deposit/GetAllPay") {
        state = deepCopy({
            PayList:action.response.PayList,
            QuickPrice:action.response.QuickPrice
        });
    }
    return state;
}

//系统配置项
const backConfigs = (state = {isDecimal:"0"}, action:ActionInterface) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0) {
        if (action.url === "Config/GetItems") {
            state = action.response;
        }
    }
    return state;
}
// 红包
const Activity = (state={
    List:[],//所有中奖列表
    WinnerList:[],//用户单独中奖信息
    Description:"<div></div>",
    RuleDes:"<div></div>",
    TurnTableDescription:"<div></div>",
    TurnTableRuleDes:"<div></div>"
},action:ActionInterface)=>{
    if (action.type === "api_finish" && action.response.StatusCode === 0){
        let ret = deepCopy(state);
        // LuckyMoney1红包 LuckyMoney转盘
        if(action.url==="Lucky/GetWinners" && action.params.LuckyNo ==="LuckyMoney1"){ 
            ret.List = action.response.List;      
            return ret
        }
        if(action.url==="Lucky/Get" && action.params.LuckyNo ==="LuckyMoney1"){
            ret.Description = action.response.LuckyInfo.Description;
            ret.RuleDes = action.response.LuckyInfo.RuleDes;
            return ret
        }
        if(action.url==="Lucky/GetDrawResult"){
            ret.WinnerList = action.response.List; 
            return ret
        }
        if(action.url==="Lucky/Get" && action.params.LuckyNo ==="LuckyMoney"){
            ret.TurnTableDescription = action.response.LuckyInfo.Description;
            ret.TurnTableRuleDes = action.response.LuckyInfo.RuleDes;
            return ret
        }
    }
    return state
}

// ———————————————————————————————————————————————————————————————————————————————— rain
interface AllState{
    [key:string]: any; // Add index signature
}
function computePage(action:any, page:any) {
    let state:AllState = {};

    function mathTotalPage(total:number, size:number) {
        if (Number.isInteger(total / size) && (total / size > 0)) {//如果是正整数
            return total / size;
        } else {
            return (total/size) + 1;
        }
    }
  
    state.rows = page.List;
    state.total = page.Count;
    state.totalPage = mathTotalPage(state.total, action.params.PageSize);
    state.pageNo = action.params.PageIndex;
    state.pageSize = action.params.PageSize;
    state.startRowIndex = state.pageNo * state.pageSize + 1;
    state.endRowIndex = state.startRowIndex + state.rows.length - 1;
    if (state.total <= 0) {
        state.startRowIndex = 0;
    }
    return state;
}
// 页码，总页数，数量，开始，结束，总数
function initPage() {
    return {pageNo: 1, totalPage: 1, pageSize: 10, startRowIndex: 0, endRowIndex: 0, total: 0, rows: []};
}

//投注/充值/提款/转账/优惠 记录
const records = (state:AllState = { betRecords: initPage(), transferRecords: initPage(), depositRecords: initPage(), withdrawRecords: initPage() ,myMsgsRecords: initPage(),myPromoRecords:initPage() }, action:any) => {
    if (action.type !== "api_finish" || action.response.StatusCode !== 0) {
        return state;
    }
    if (action.url === "Bet/GetBetList") {
        state = deepCopy(state);
        state.betRecords = computePage(action, action.response);
    } else if (action.url === "Transfer/GetList") {//转账记录
        state.transferRecords = computePage(action, action.response);
    } else if (action.url === "Deposit/GetList") {
        state.depositRecords = computePage(action, action.response);
    } else if (action.url === "Withdrawal/GetList") {
        state.withdrawRecords = computePage(action, action.response);
    } else if (action.url === "User/GetSiteMsgs") {
        state.myMsgsRecords = computePage(action, action.response);
    }else if (action.url === "User/GetUserBonusRecord"){
        state.myPromoRecords = computePage(action, action.response);
    }
    return state;
}

const noticesUnRead = (state = 0, action:any) => {
    if (action.type === "changeReadNewsNum" && action.tabsType === '1') {
        if (state) {
            state--;
        }
        return state;
    }
    if (action.type === "api_finish" && action.response.StatusCode === 0 && action.url === "News/GetList" && (action.params.CategoryCode !== "home-promotion" && action.params.CategoryCode !== "app_home_promotion")) {
        let isReadNews = getStorage('isReadNews') ? getStorage('isReadNews') : ""
        state = 0;
        action.response.NewsInfo.forEach((item: any, index: any) => {
            if (isReadNews.indexOf(item.Id + ',') < 0) {
                state++;
            }
        })
    }
    return state;
}
//优惠
let promotionsIndex = -1;//优惠列表初始化查询的页数
const promotions = (state = {
    promotions: initPage(),
    promoData:[],
    promoTypes: [],
    promoUnRead: 0,
}, action:any) => {
    if (action.type === "changeReadNewsNum" && action.tabsType === 0) {
        if (state.promoUnRead) {
            state.promoUnRead--;
        }
        return state;
    }
    if (action.type !== "api_finish" || action.response.StatusCode !== 0) {
        return state;
    }
    if (action.url === "Promo/GetList" && state.promoData.length === 0) {//只存首页首次的数据
        let isReadNews = getStorage('isReadNews') ? getStorage('isReadNews') : ""
        let PageIndex = action.params.PageIndex;
        let ps:any = computePage(action, action.response);
        if (PageIndex > promotionsIndex) {
            ps.rows.forEach((item:any, index:any) => {
                if (isReadNews.indexOf(item.Id + ',') < 0) {
                    state.promoUnRead++;
                }
            })
        }
        promotionsIndex = PageIndex;
        state = deepCopy(state);
        state.promotions = ps;
        state.promoData = action.response.List;
    } else if (action.url === "Promo/GetTypes") {
        state = deepCopy(state);
        state.promoTypes = action.response.List;
    }

    return state;
};

//銀行配置信息
const bankInfos = (state = [], action:any) => {
    if (action.type === "api_finish" && action.url === "Config/GetBanks" && action.response.StatusCode === 0) {
        state = action.response.List;
    }
    return state;
}

// WAP端代理注册 配置项获取
const AgentRegisterSetting = (
    state = {
        Birthday: {IsVisible: false},
        Email: {IsVisible: false},
        Phone: {IsVisible: false},
        QQ: {IsVisible: false},
        TrueName: {IsVisible: false},
    }, action:any) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0) {
        if (action.url === "Agent/GetRegistSetting") {
            state = action.response.Setting;
        }
    }
    return state;
}
//注冊相關配置
const registerSetting = (state = {}, action:any) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0) {
        if (action.url === "Account/GetRegistSetting") {
            state = action.response;
        }
    }
    return state;
}

//最新注册相关配置
const getRegisterSetting = (state = {}, action:any) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0) {
        if (action.url === "Config/GetRegistrySetting") {
            state = action.response;
        }
    }
    return state;
}

//图片配置
const imagesConfig = (state = {
    Icon:"",
    PCLogo:"",
    Avatar:"",
    WAPLogo:"",
    AppLogo:""
}, action:any) => {
    if (action.type === "api_finish" && action.response.StatusCode === 0) {
        if (action.url === "Config/GetList") {
            let resp = action.response;
            state =  {
                ...state,
                Icon:resp.Config.Icon,
                PCLogo:resp.Config.PCLogo,
                Avatar:resp.Config.Avatar,
                WAPLogo:resp.Config.WAPLogo,
                AppLogo:resp.Config.AppLogo,
            };
        }
    }
    return state;
}

//查询站内信
/*
* 因为wap端站内信是下拉无限加的
* 在读取站内信信息时就需要通过ID获取对应的站内信信息
* 所以需要保存所有的站内信到allSitemsgs
* 所以添加一个变量sitemsgIndex 通过该参数的变化向allSitemsgs中插入数据
* */
let sitemsgIndex = 0;
const sitemsg = (state: any = { unread: 0, sitemsgs: initPage(), allSitemsgs: [] }, action: any) => {
    if (action.type !== "api_finish" || action.response.StatusCode !== 0) {
        return state;
    }

    let newState: any = deepCopy(state);
    if (action.url === "User/GetUnreadSiteMsgs") {
        newState.unread = action.response.Count;
        return newState;
    } else if (action.url === "User/GetSiteMsgs") {
        let params = action.params;
        if (params.PageIndex > sitemsgIndex) {
            let old = state.allSitemsgs;
            let newArr = old.concat(action.response.List);
            newState.allSitemsgs = newArr
        }
        else if (params.PageIndex === sitemsgIndex) {
            newState.allSitemsgs = action.response.List;
        }
        else {
            newState.allSitemsgs = action.response.List;
        }
        newState.sitemsgs = computePage(action, action.response);
        sitemsgIndex = params.PageIndex;
        return newState;
    }
    return state;
};

export default combineReducers({
    apiResult,
    popWindow,
    wapAdsList,
    notices,
    gameLayout,
    user,
    favoritesIds,
    recentlyGames,
    game,
    remoteSysConfs,
    homePromotion,
    // alone
    getAllPay,
    backConfigs,
    Activity,//红包
    // rain
    records,
    wapCategores,
    promotions,
    bankInfos,
    AgentRegisterSetting,
    registerSetting,
    getRegisterSetting,
    imagesConfig,
    sitemsg,
    noticesUnRead
});

