import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import Swiper from "swiper"; // 滑动插件
import { in_array, gameOpen, toPlayGame } from "tollPlugin/commonFun";
import { StatusUi } from "components/pui/Pui";
import "swiper/dist/css/swiper.min.css";
import "./HomeMain.scss";
// import { config } from "config/configData";
interface SwiperEvent {
  slides: any;
  on: any;
}
interface State {
  wapHomeGames: []
  favoriteGames: [],
  user: { Token: "" },
  recentlyGames: [],
}
class HomeMain extends BaseClass {
  public state = {
    wapHomeGames: [],
    favoriteGames: [],
    user: {},
    recentlyGames: [],
  }

  public galleryThumbs: any = ""
  public galleryTop: any = ""

  constructor(props: any) {
    super(props, ["wapHomeGames", "favoriteGames", "user", "recentlyGames", "favoritesIds", "platforms"])
  }
  componentDidMount() {
    this.init();
  }

  static getDerivedStateFromProps(props: any, state: State) {
    if (props.wapHomeGames.length !== state.wapHomeGames.length
      || props.favoriteGames.length !== state.favoriteGames.length
      || props.recentlyGames.length !== state.recentlyGames.length
      || props.user.Token
    ) {
      if (!props.user.Token) {
        //如果登录状态改变了下标默认到第一个
        window.tabIndex = 0;
      }
      return {
        wapHomeGames: props.wapHomeGames,
        favoriteGames: props.favoriteGames,
        user: props.user,
        recentlyGames: props.recentlyGames
      }
    }
    return null;
  }

  componentDidUpdate() {
    this.init();
  }

  init() {
    if (this.galleryThumbs) {
      // this.galleryThumbs.update();
      // this.galleryTop.update();
      // return;
      this.galleryThumbs.destroy(false);
      this.galleryTop.destroy(false);
    }
    let clientWidth = 5;
    if(document.body.clientHeight < 580 || document.body.clientWidth > 440){
      clientWidth=4
    }
    if (document.body.clientWidth >= 580) {
      clientWidth = 3;
    }
    this.galleryThumbs = new Swiper('.gallery-thumbs', {
      initialSlide: window.tabIndex ? window.tabIndex : 0,
      slidesPerView: clientWidth,
      freeMode: true,
      //centeredSlides:true,
      //centeredSlidesBounds:true,
      direction: 'vertical',
      //watchSlidesVisibility: true,
      watchSlidesProgress: true
    });
    this.galleryTop = new Swiper(".swiper-homemain", {
      initialSlide: window.tabIndex ? window.tabIndex : 0,
      direction: "vertical",
      thumbs: {
        swiper: this.galleryThumbs
      },
      preventClicks: false,//默认true
      preventClicksPropagation: false,
      on: {
        slideChangeTransitionStart: function (this: any) {
          window.tabIndex = this.realIndex
        },
      },
    });

    let startScroll: number, touchCurrent: number, touchStart: number

    this.galleryTop.slides.on('touchstart', function (this: any, e: any) {
      startScroll = (this as any).scrollTop;
      touchStart = e.targetTouches[0].pageY;
    }, { passive: false });

    this.galleryTop.slides.on('touchmove', function (this: any, e: any) {
      touchCurrent = e.targetTouches[0].pageY;
      let touchesDiff = touchCurrent - touchStart;
      let slide = this;
      let onlyScrolling = (slide.scrollHeight > slide.offsetHeight) && //allow only when slide is scrollable
        (
          (touchesDiff < 0 && startScroll === 0) || //start from top edge to scroll bottom
          (touchesDiff > 0 && startScroll === (slide.scrollHeight - slide.offsetHeight)) || //start from bottom edge to scroll top
          (startScroll > 0 && startScroll < (slide.scrollHeight - slide.offsetHeight)) //start from the middle
        );
      if (onlyScrolling) {
        e.stopPropagation();
      }
    }, { passive: false });

  }
  render() {
    return (
      <div className="HomeMain">
        <div className="gallery-thumbs-box" >
          <div className="swiper-home gallery-thumbs">
            <div className="swiper-wrapper">{this.leftContent()}</div>
          </div>
          <div className="hintBottom" style={window.config.spec.includes("bbt") ? {background:"#282828"} : {}} >
            <i className="icon iconfont icon-jiantou"></i>
          </div>
        </div>

        <div className="swiper-home swiper-homemain">
          <div className="swiper-wrapper">{this.rightContent()}</div>
        </div>
      </div>
    );
  }

  leftContent() {
    let leftContent = [];
    if (this.props.wapHomeGames.length > 0) {//如果有数据直接渲染
      for (let i = 0; i < this.props.wapHomeGames.length; i++) {//循环游戏或平台
        leftContent.push(
          <div key={i} className="swiper-slide">
            <div className="swiper-tabBox">
              <i className={`swiper-images icon iconfont ${this.props.wapHomeGames[i].ClassName}`} />
              <p className="tabfont">
                {this.props.wapHomeGames[i].Title}
              </p>
            </div>
          </div>
        )
      }

      if (this.props.user.Token) {//登陆后渲染最近和最爱

        leftContent.push(
          <div key="favoi2" className="swiper-slide">
            <div className="swiper-tabBox">
              <i className="swiper-images icon iconfont icon-shoucang1" />
              <p className="tabfont">
                最爱
              </p>
            </div>
          </div>
        )

        if (this.props.recentlyGames.length > 0) {//在数组头部添加最近游戏
          leftContent.unshift(
            <div key="now1" className="swiper-slide">
              <div className="swiper-tabBox">
                <i className="swiper-images icon iconfont icon-zuijin1" />
                <p className="tabfont">
                  最近
                </p>
              </div>
            </div>
          )
        } else {
          leftContent.push(
            <div key="now1" className="swiper-slide">
              <div className="swiper-tabBox">
                <i className="swiper-images icon iconfont icon-zuijin1" />
                <p className="tabfont">
                  最近
                </p>
              </div>
            </div>
          )
        }
      }
    } else {//否则渲染骨架屏
      for (let i = 0; i < 10; i++) {
        leftContent.push(
          <div key={`id${i}`} className="swiper-slide ">
          </div>
        );
      }
    }
    return leftContent;
  }

  rightContent() {
    let rightContentBox = [];
    if (this.props.wapHomeGames.length > 0) {//如果有数据直接渲染
      for (let i = 0; i < this.props.wapHomeGames.length; i++) {
        rightContentBox.push(
          <div key={`idA${i}`} className="swiper-slide right-slide">
            {
              //根据游戏分类进行处理（进入二级或直接进游戏或者最爱最近游戏）
              this.switchGameType(this.props.wapHomeGames[i], false, true)
            }
          </div>
        );
      }
      if (this.props.user.Token) {//用户已登录、渲染最爱和最近游戏
        if (this.props.favoriteGames.length > 0) {//在尾部添加最爱游戏
          //最爱游戏
          rightContentBox.push(
            <div key="favo" className="swiper-slide right-slide">
              {
                this.switchGameType(this.props.favoriteGames, true)
              }
            </div>
          )
        } else {
          rightContentBox.push(
            <div key="nofav" className="swiper-slide right-slide">
              <StatusUi state={"homeNoData"} />
            </div>
          )
        };

        if (this.props.recentlyGames.length > 0) {//在数组头部添加最近游戏
          rightContentBox.unshift(
            <div key="recen" className="swiper-slide right-slide">
              {
                this.switchGameType(this.props.recentlyGames, true)
              }
            </div>

          )
        } else {//否则在最后添加最近游戏
          rightContentBox.push(
            <div key="norecen" className="swiper-slide right-slide">
              <StatusUi state={"homeNoData"} />
            </div>
          )
        };
      }
    } else {//否则渲染骨架屏
      for (let i = 0; i < 10; i++) {//游戏分类骨架
        rightContentBox.push(
          <div key={`idS${i}`} className="swiper-slide right-slide">
            <div key={`idA${i}`} className="right-slide-box">
            </div>
          </div>
        );
      }
    }

    return rightContentBox;
  }

  switchGameType(data: any, flag: boolean, dataGame = false) {//具体平台、游戏处理、需要处理的后台数据游戏
    if (flag && data.length > 0) {//此时进来的为最爱或最近
      return this.rightContentGames(data, false, dataGame);
    } else if (data.Games && data.Games.length > 0) {//返回的是游戏，可以直接进入
      return this.rightContentGames(data.Games, false, dataGame);
    } else if (data.Data && data.Data.length > 0) {//返回的是平台，还需要进入下一级内页
      return this.rightContentGames(data.Data, true, dataGame);
    } else {
      return <StatusUi state={"homeNoData"} />
    }
  }



  rightContentGames(dataGames: any, notGame: boolean = false, dataGame: boolean) {//渲染游戏//根据游戏分类进行处理（进入二级或直接进游戏或者最爱最近游戏）
    let gameList: JSX.Element[] = [];
    var styleType = false;
    if (dataGame && dataGames.length < 7) {//根据返回游戏的数量决定显示样式
      styleType = dataGames.length;
    }
    dataGames.forEach((item: any, index: number) => {
      let favoriteBtn;
      let itemId = "";
      if (item.FilterGame) {
        itemId = item.GameId;
      } else {
        itemId = item.Id;
      }


      if (in_array(itemId, this.props.favoritesIds)) {//如果是被收藏的游戏
        favoriteBtn = (
          <div onClick={this.removeOrAddFavorite.bind(this, item, true)} className="gameInfo removeFavorite">
            <i className="icon iconfont icon-shoucang-tianchong" />
            {item.IsNew ? <i className="icon icon-new"></i> : null}
            {item.IsHot ? <i className="icon icon-hot"></i> : null}
          </div>
        )
      } else {//否则是没有收藏的游戏
        if (item.Id) {//如果有ID才是可以收藏的游戏
          favoriteBtn = (
            <div onClick={this.removeOrAddFavorite.bind(this, item, false)} className="gameInfo removeFavorite">
              <i className="icon iconfont icon-shoucang" />
              {item.IsNew ? <i className="icon icon-new"></i> : null}
              {item.IsHot ? <i className="icon icon-hot"></i> : null}
            </div>
          )
        } else {//否则没有ID就是游戏平台，不可收藏平台
          favoriteBtn = (
            <div className="gameInfo removeFavorite">
              <i className="icon" />
              {item.IsNew ? <i className="icon icon-new"></i> : null}
              {item.IsHot ? <i className="icon icon-hot"></i> : null}
            </div>
          )
        }
      }
      let imgUrl = item.IconUrl ? item.IconUrl : item.ImageUrl2;
      //标记需要进入下一级路由的
      item.category = notGame;

      if (!!!this.props.user.Token && item.GamePlatform === "N188") {
      } else {
        if (styleType) {
          gameList.push(
            <div className={`right-slide-box-${styleType}`} key={index} onClick={this.canPlay.bind(this, item)}>
              {favoriteBtn}
              <img className="image" src={window.config.devImgUrl + imgUrl} alt="" />
              {/* <label className="startGame">开始游戏</label> */} 
              {/* 需求提的是所有游戏都不要开始游戏按钮,，我先注释掉，别以后又要了，懒得改  ————————Rain */}
            </div>
          )
        } else {
          gameList.push(
            <div className="right-slide-box" key={index} onClick={this.canPlay.bind(this, item)}>
              {favoriteBtn}
              <img className="image" src={window.config.devImgUrl + imgUrl} alt="" />
              <label>{item.Title ? item.Title : item.Name}</label>
            </div>
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



  removeOrAddFavorite(item: any, isRemove: boolean, event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (!window.actions.Authority()) return;
    if (isRemove) {//删除收藏
      new window.actions.ApiDeleteFavoriteAction(item.Id).fly((resp: any) => {
        if (resp.StatusCode === 0) {
          new window.actions.ApiGetFavoritesAction().fly();
        }
      });
    } else {//添加收藏
      if (!window.actions.Authority(true)) return false;
      new window.actions.ApiAddFavoriteAction(item.Id).fly((resp: any) => {
        if (resp.StatusCode === 0) {
          new window.actions.ApiGetFavoritesAction().fly();
        }
      });
    }

  }
}



const mapStateToProps = (state: any, ownProps: any) => ({
  wapHomeGames: state.gameLayout.wapHomeGames,//首页游戏
  recentlyGames: state.recentlyGames.casinos,//最近游戏
  favoriteGames: state.favoritesIds.favoriteGames,//最爱游戏
  user: state.user,
  favoritesIds: state.favoritesIds.Fids,//最爱游戏
  platforms: state.game.platforms,
});

export default withRouter(connect(mapStateToProps)(HomeMain));
