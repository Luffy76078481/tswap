import { connect } from "react-redux";
import * as React from "react";
import BaseClass from "@/baseClass";
import { withRouter } from "react-router-dom";
import NavBar from "components/navBar/NavBar"
import { StatusUi } from "components/pui/Pui";
import { in_array, gameOpen, toPlayGame } from "tollPlugin/commonFun";
import { ListView, Flex } from 'antd-mobile';
import "./GamesPage.scss"
import {config} from '../../config/projectConfig'


interface Item {
    ID: string
    Name: string
    MarkIds: string
    PlatformIds: string
    Jackpot: number
    GameType: string
    YoPlay: string
}

var filter = {//游戏查询参数
    GameMarks: "",
    GamePlatform: "",
    Jackpot: -1,
    YoPlay: "",
    TerminalType: "",
    GameType: "",
    GameName: ""
}
var listData: any[] = [];//列表内容
let pageIndex = 1;//当前页码

class GamesPage extends BaseClass {
    constructor(props: any) {
        super(props, ["wapCategores", "favoritesIds"])

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: any, row2: any) => row1 !== row2,
        });

        this.state = {
            dataSource: dataSource.cloneWithRows({}),
            hasMore: false,
            tabsId: "",//当前选中游戏分类ID
            Loading: true,
            depositModalShow: false,//是否显示充值弹出层
            transferModalShow: false,//是否显示转入弹出层
            IntoRoomShow: false,//是否显示加入房间，棋牌专用
            IntoRoomGamePlatform: "",
            IntoRoomGameTypeText: "",
            gamesData: [],
            title: "",
            haveTab: false,//是否有头部分类，目前只有老虎机有
            noData: false,//是否显示没有数据
        };
    }


    componentDidMount() {
        // 初始化参数
        filter = {//游戏查询参数
            GameMarks: "",
            GamePlatform: "",
            Jackpot: -1,
            YoPlay: "",
            TerminalType: "",
            GameType: "",
            GameName: ""
        }
        listData = [];//列表内容
        pageIndex = 1;//当前页码
        //老虎机内页获取游戏分类
        this.state.title = this.props.match.params.Title;
        this.state.haveTab = this.props.match.params.Title.includes("老虎机");
        filter.GameType = this.props.match.params.GameType;
        filter.GamePlatform = this.props.match.params.GamePlatform;
        if (this.props.wapCategores.length === 0 && this.state.haveTab) {
            new window.actions.ApiWapGameCategoriesAction().fly((resp: any) => {//根据后台配置的分类来渲染默认分类游戏
                if (resp.StatusCode === 0) {
                    this.tabsChange(resp.Data[0]);
                }
            });
        } else {//直接渲染默认游戏
            this.getList();
        }
    }


    topSwichTab(): JSX.Element[] {//渲染头部分类选项卡
        let tabs: JSX.Element[] = [];
        this.props.wapCategores.forEach((item: Item, index: number) => {
            let className = "";
            if (index === 0 && this.state.tabsId === "") {
                className = "tabsCate active";//默认选中第一个
            } else {
                className = this.state.tabsId === item.ID ? "tabsCate active" : "tabsCate"
            }

            tabs.push(
                <a key={index} className={className} onClick={this.tabsChange.bind(this, item)}>
                    {item.Name}
                </a>
            )
        })
        return tabs;
    }

    tabsChange(item: Item) {
        if (item.ID === this.state.tabsId) return;
        this.setState({
            tabsId: item.ID,
            Loading: true,
        });
        listData = [];
        pageIndex = 1;

        filter.GameMarks = item.MarkIds;
        filter.Jackpot = item.Jackpot;
        if (item.ID === "YOPLAY") {
            filter.GameMarks = "";
            filter.GamePlatform = "";
            filter.GameType = "4";
            filter.YoPlay = "1";
        } else if (item.ID === "more_all") {
            filter.YoPlay = "";
        }
        filter.TerminalType = "Mobile";
        this.getList();
    }

    getQuetyParam(queryVal: string) {
        this.getList(queryVal);
    }

    getList(GameName?: string) {//获取游戏
        if (GameName) {   //flag判断是否是搜索框
            if (GameName !== "clear") {
                filter.GameName = GameName;
            }
            listData = [];
            pageIndex = 1;
        }
        new window.actions.ApiQueryGamesAction({ ...filter, PageSize: 30, PageNo: pageIndex }).fly((resp: any) => {
            if (resp.StatusCode === 0) {
                pageIndex++;
                listData = listData.concat(resp.Page);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(listData),
                    hasMore: resp.TotalPages >= pageIndex,
                    Loading: false,
                    noData: listData.length > 0 ? false : true
                })
            }
        })
        filter.GameName = ""
    }

    render() {
        return (
            <div className="GamesPage anmateContent" style={{background:config.spec.includes('usd')?'#fff':'#efefef'}}>
                <NavBar
                    btnGoback={true}
                    title={this.state.title}
                    btnQuery={true}
                    getQuetyParam={this.getQuetyParam.bind(this)}
                ></NavBar>
                {(this.state.haveTab && this.props.wapCategores.length > 0) && <div className="tabs">{this.topSwichTab()}</div>}
                <div className="GamesPageContent">
                    {this.renderGames()}
                </div>
            </div>
        );
    }

    renderGames() {
        const _this = this;
        const row = (rowData: any) => {
            let favoriteBtn;
            if (in_array(rowData.Id, this.props.favoritesIds)) {
                favoriteBtn = (
                    <div onClick={this.removeOrAddFavorite.bind(this, rowData, true)} className="gameInfo removeFavorite">
                        <i className="icon iconfont icon-shoucang-tianchong"></i>
                        {rowData.IsNew ? <i className="icon icon-new"></i> : null}
                        {rowData.IsHot ? <i className="icon icon-hot"></i> : null}
                    </div>
                )
            } else {
                favoriteBtn = (
                    <div onClick={this.removeOrAddFavorite.bind(this, rowData, false)} className="gameInfo">
                        <i className="icon iconfont icon-shoucang"></i>
                        {rowData.IsNew ? <i className="icon icon-new"></i> : null}
                        {rowData.IsHot ? <i className="icon icon-hot"></i> : null}
                    </div>
                )
            }
            return (
                // 没有图标的游戏 不渲染出来 style={{display:rowData.IconUrl?'':'none'}}
                <Flex className="listItem" align="start" style={{display:rowData.IconUrl?'':'none'}}>
                    <Flex.Item className="itemL" onClick={rowData.GameIdentify && rowData.GameIdentify.indexOf("2$X") !== -1 ? _this.IntoRoom.bind(_this, rowData) : _this.playGame.bind(_this, rowData)}>
                        {/* <span>{rowData.GamePlatform}</span> */}
                        <img src={window.config.devImgUrl + rowData.IconUrl} alt="" />
                    </Flex.Item>
                    <Flex.Item className="itemR">
                        <h5>{rowData.Title}</h5>
                        {/* <p>这是一款赚钱的游戏</p> */}
                        {favoriteBtn}
                    </Flex.Item>
                </Flex>
            );
        };




        const renderFooter: any = () => {
            let con;
            if (this.state.Loading) {
                con = (<StatusUi state={"loading"} />)
            } else if (this.state.noData) {
                con = (<StatusUi state={"noData"} />)
            } else if (!this.state.hasMore) {
                con = (<StatusUi state={"noMore"} />)
            }
            return con;
        };

        return (
            <ListView
                dataSource={this.state.dataSource}
                className="myListView"
                renderFooter={renderFooter}
                renderRow={row}
                initialListSize={30}
                pageSize={5}//每次事件循环（每帧）渲染的行数
                scrollRenderAheadDistance={400}//当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                onEndReached={this.onEndReached.bind(this)}//当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                onEndReachedThreshold={100}//调用onEndReached之前的临界值，单位是像素
                style={{ "top": this.state.haveTab ? "1.8rem" : "1rem" }}
            />
        )
    }

    onEndReached = () => {
        if (!this.state.Loading && !this.state.hasMore) {
            return false;
        }
        this.setState({ Loading: true });
        this.getList();
    };

    IntoRoom(game: any) {
        console.log("稳一手")
    }


    playGame(game: any) {
        toPlayGame(this, game)
    }


    removeOrAddFavorite(item: any, isRemove: boolean, event: any) {
        event.preventDefault();
        event.stopPropagation();
        if (!window.actions.Authority()) return;
        if (isRemove) {//删除收藏
            console.log("此处应该有弹窗" + item.Title + '删除收藏中..');
            new window.actions.ApiDeleteFavoriteAction(item.Id).fly((resp: any) => {
                if (resp.StatusCode === 0) {
                    new window.actions.ApiGetFavoritesAction().fly();
                }
              
            });
        } else {//添加收藏
            if (!window.actions.Authority(true)) return false;
            console.log("此处应该有弹窗" + item.Title + '收藏中..');
            new window.actions.ApiAddFavoriteAction(item.Id).fly((resp: any) => {
                if (resp.StatusCode === 0) {
                    new window.actions.ApiGetFavoritesAction().fly();
                }
            });
        }

    }

    getGameUrl(game: any, TransferFlag = false) {
        let parma = {
            GamePlatform: game.GamePlatform,
            GameType: game.GameTypeText,
            GameId: game.GameIdentify,
            IsMobile: true,
            IsDemo: false,
        }
        gameOpen(parma,TransferFlag);
    }


}

const mapStateToProps = (state: any, ownProps: any) => ({
    wapCategores: state.wapCategores.slot_category,
    favoritesIds: state.favoritesIds.Fids,//最爱游戏
    platforms: state.game.platforms,
    user: state.user,
});

export default withRouter(connect(mapStateToProps)(GamesPage));
