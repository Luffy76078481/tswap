
interface configObj{
    "webSiteTag":string,
    "gameTag":string,
    "apiPath":string,
    "version":string,
    "spec":string,
    "appName":string,
    "title":string,
    "isApp":boolean,
    "isWap":boolean,
    "devImgUrl":string,   
    "api":string,
    "model":string,
}

export declare global {
    interface Window {
        actions:any,
        config:configObj,
        fontSize:number,
        jsq:any,//APP弹窗注入脚本计时器
        signalR:any,//长连接实例
        Promise:any,//解决IE兼容
        tabIndex:number,//首页UI组件保存当前激活下标
        plus:any,//app原生对象
        Responses:Response
    }
    interface ReducerState{
        apiResult:{
            method:string,
            params:{
                [Name:string]:any
            },
            response:{
                [Name:string]:any
            },
            type:string,
            url:string
        },
        backConfigs:{
            [Name:string]:any
        },
        bankInfos:object[],
        favoritesIds: {
            Fids: any, 
            favoriteGames: any
        },
        game:{
            [Name:string]:any,
            platforms:object[],
            slot_platforms:object[]
        },
        user:{
            [Name:string]:any,
        },
        wapCategores:{
            slot_category:any[]
        },
        wapAdsList:object[],
        remoteSysConfs:{
            [names:string]:string
        },
        records:{
            betRecords:Records, 
            depositRecords:Records,
            myMsgsRecords:Records,
            myPromoRecords:Records,
            transferRecords:Records,
            withdrawRecords:Records
        },
        recentlyGames:{
            casino:Casino
        },
        promotions:{
            promoTypes:any[],
            promoUnRead:number,
            promotions:{
                [names:string]:string
            }
        },
        popWindow:{
            type:string,
            [names:string]:string
        },
        notices:any[],
        homePromotion:any[],
        getAllPay:{
            PayList: any[],
            QuickPrice:string,
            [names:string]:string
        },
        gameLayout:{
            sideBarNav:any[],
            wapHomeGames:any[],
            [names:string]:string
        },
        Activity:{
            List:any[],
            LuckyInfo:any,
            [names:string]:string
        }
    }
}

type Records = {
    pageNo: number, 
    totalPage: number, 
    pageSize: number, 
    startRowIndex: number, 
    endRowIndex: number,
}

type Casino = {
    EnTitle: string,
    GameIdentify: string,
    GameMarkId: string,
    GameNameId: string,
    GamePlatform: string,
    GameType: number,
    GameTypeText: string,
    H5GameIdentify: string,
    IconUrl:string,
    Id: string,
    ImageUrl: string,
    IsHot: number,
    IsNew: number,
    IsTry: number,
    Is_YoPlay: string|boolean,
    JackpotsInfo: number,
    JackpotsParams: string,
    PaymentLineNumber: number,
    RecommendNo: number,
    Remark: string,
    ShowJackpots: number,
    SortNo:number,
    Status: number,
    SupportH5: number,
    SupportMobile: boolean,
    SupportPC: boolean,
    Tag: string,
    Title: string,
    Url: string,
}