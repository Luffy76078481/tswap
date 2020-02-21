import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import { gameOpen, toPlayGame } from "tollPlugin/commonFun";
import { StatusUi } from "components/pui/Pui";
import "swiper/dist/css/swiper.min.css";
import "./HomeMain_usd.scss";

interface State {
  [key: string]: any
}
class HomeMain extends BaseClass {
  public eventList: any = "";
  public flgCount: any = [];
  public flgCountScrollHeight: any = [];
  public scrollHeight: number = 0;
  public lockScroll: boolean = false;
  public state: State = {
    wapHomeGames: [],
    user: {},
    nowActive: "tcb0",

  }
  constructor(props: any) {
    super(props, [])
  }

  // document.getElementsByClassName("cent-ul-box")[0].scrollHeight
  componentDidMount() {
    if (this.state.wapHomeGames.length > 0) {
      this.init();
    }
  }

  componentDidUpdate() {
    if (!this.eventList && this.state.wapHomeGames.length > 0) {
      this.init();
    }
  }


  init() {
    let el: any = this.refs.ulbox;
    this.scrollHeight = el.scrollHeight;
    this.mathHeight();
    let _this = this;
    this.eventList = el.onscroll = function () {
      if (_this.lockScroll) {
        _this.lockScroll = false;
        return;
      }
      var scrollTop = el.scrollTop;
      let flgx = _this.flgCountScrollHeight

      if (scrollTop > flgx[0] && scrollTop < flgx[1]) {
        _this.setState({
          nowActive: "tcb0"
        })
      } else if (scrollTop > flgx[1] && scrollTop < flgx[2]) {
        _this.setState({
          nowActive: "tcb1"
        })
      } else if (scrollTop > flgx[2] && scrollTop < flgx[3]) {
        _this.setState({
          nowActive: "tcb2"
        })
      } else if (scrollTop > flgx[3] && scrollTop < flgx[4]) {
        _this.setState({
          nowActive: "tcb3"
        })
      } else if (scrollTop > flgx[4] && scrollTop < flgx[5]) {
        _this.setState({
          nowActive: "tcb4"
        })
      } else if (scrollTop > flgx[5] && scrollTop < flgx[6]) {
        _this.setState({
          nowActive: "tcb5"
        })
      } else if (scrollTop > flgx[6]) {
        _this.setState({
          nowActive: "tcb6"
        })
      }
    }
  }



  static getDerivedStateFromProps(props: any, state: any) {
    if (props.wapHomeGames.length !== state.wapHomeGames.length) {
      return {
        wapHomeGames: props.wapHomeGames
      }
    }
    return null;
  }


  mathHeight() {
    if (this.scrollHeight === 0) return;
    // let allLi = 0;
    // for (let index = 0; index < this.flgCount.length; index++) {
    //   const a = this.flgCount[index];
    //   allLi = a + allLi;
    // }
    // //每个li的高度计算
    // let oneLi = this.scrollHeight / allLi;
    // console.log(oneLi);
    let fuck = document.documentElement.style.fontSize || "0px"
    let oneLi = parseInt(fuck.replace("xp", "")) * 2.4;//2.4rem 根据图片宽度定的
    //将对应分段的顶部scroll值放入数组
    let flgCountScrollHeight = [0];
    for (let index = 0; index < this.flgCount.length - 1; index++) {
      let beforeLi = 0;//当前分类位置前面共有多少个li
      for (let x = -1; x < index; x++) {
        beforeLi = this.flgCount[x + 1] + beforeLi;

      }
      flgCountScrollHeight.push(oneLi * beforeLi)
    }
    this.flgCountScrollHeight = flgCountScrollHeight;
  }



  getGameUrl(game: any, TransferFlag = false) {
    let parma = {
      GamePlatform: game.GamePlatform,
      GameType: game.GameTypeText,
      GameId: game.GameIdentify,
      IsMobile: true,
      IsDemo: false,
    }
    gameOpen(parma, TransferFlag);
  }

  changeTopAct(i: number, e: any) {
    this.lockScroll = true;
    let el: any = this.refs.ulbox;
    el.scrollTop = this.flgCountScrollHeight[i];
    this.setState({
      nowActive: "tcb" + i
    })
  }

  topContent() {
    let topContent = [];
    for (let i = 0; i < this.state.wapHomeGames.length; i++) {//循环游戏或平台
      topContent.push(
        <li key={"u" + i} className={`${this.state.nowActive === "tcb" + i && "topActive"}`}>
          <div className="topCbody" onClick={this.changeTopAct.bind(this, i)}>
            <span>{this.state.wapHomeGames[i].Title}</span>
          </div>
        </li>
      )
    }
    return topContent;
  }
  centContent() {
    let centContentBox = [];
    this.flgCount = [];
    for (let i = 0; i < this.state.wapHomeGames.length; i++) {
      //根据游戏分类进行处理（进入二级或直接进游戏或者最爱最近游戏）
      let gamesList: any = this.switchGameType(this.state.wapHomeGames[i], false, true);
      this.flgCount.push(gamesList.length);
      centContentBox.push(
        gamesList
      );
    }
    return centContentBox;
  }
  switchGameType(data: any, flag: boolean, dataGame = false) {//具体平台、游戏处理、需要处理的后台数据游戏
    if (flag && data.length > 0) {//此时进来的为最爱或最近
      return null
    } else if (data.Games && data.Games.length > 0) {//返回的是游戏，可以直接进入
      return this.centContentGames(data.Games, false, dataGame);
    } else if (data.Data && data.Data.length > 0) {//返回的是平台，还需要进入下一级内页
      return this.centContentGames(data.Data, true, dataGame);
    } else {
      return <StatusUi state={"homeNoData"} />
    }
  }
  centContentGames(dataGames: any, notGame: boolean = false, dataGame: boolean) {
    let gameList: JSX.Element[] = [];
    var styleType = false;
    if (dataGame && dataGames.length < 7) {//根据返回游戏的数量决定显示样式
      styleType = dataGames.length;
    }
    dataGames.forEach((item: any, index: number) => {
      let imgUrl = item.IconUrl ? item.IconUrl : item.ImageUrl2;
      //标记需要进入下一级路由的
      item.category = notGame;

      if (!!!this.props.user.Token && item.GamePlatform === "N188") {
      } else {
        if (styleType) {
          gameList.push(
            <li key={index} onClick={this.canPlay.bind(this, item)}>
              <img className="image" src={window.config.devImgUrl + imgUrl} alt="" />
            </li>
          )
        } else {
          gameList.push(
            <li key={index} onClick={this.canPlay.bind(this, item)}>
              <img className="image" src={window.config.devImgUrl + imgUrl} alt="" />
              <label>{item.Title ? item.Title : item.Name}</label>
            </li>
          );
        }
      }
    })

    return gameList;
  }
  canPlay(game: any, event: any) {//检测是进入下一级路由或者直接进游戏
    event.preventDefault();
    event.stopPropagation();
    if (game.category) {//标记需要进入下一级路由的
      if (game.GameId) {
        toPlayGame(this, game)
      } else {
        if (!window.actions.Authority()) return;
        this.props.history.push(`/Home/Games/${game.Title}/${game.Games[0].GamePlatform}/${game.Games[0].GameType}`)
      }
      return false;
    } else {
      toPlayGame(this, game)
    }
  }
  render() {
    return (
      <div className="HomeMain">
        <div className="top-ul-box">{this.topContent()}</div>
        <ul className="cent-ul-box" ref="ulbox">
          {this.centContent()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  wapHomeGames: state.gameLayout.wapHomeGames,//首页游戏
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(HomeMain));
