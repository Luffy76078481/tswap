import Swiper from "swiper"; // 滑动插件
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import baseClass from "@/baseClass";
import { appOpen } from "tollPlugin/commonFun";
import "swiper/dist/css/swiper.min.css";
import "./Carousel_usd.scss";

interface State {
  wapAdsList: []
}
class Carousel extends baseClass {
  public state: State = {
    wapAdsList: []
  }
  constructor(props: any) {
    super(props, ["wapAdsList"]);
  }

  componentDidUpdate(): void {
    this.init();
  }

  init() {
    new Swiper("#homeSwiper", {
      loop: true,
      slidesPerView: "auto",
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
      },
      pagination: {
        el: ".swiper-pagination",
        // clickable: true,
        // dynamicBullets: true
      }
    });
  }

 
  static getDerivedStateFromProps(props: any, state: State) {
    if (props.wapAdsList.length !== state.wapAdsList.length) {
      return {
        wapAdsList: props.wapAdsList
      }
    }
    return null;
  }

  render() {
    return (
      <div className="Carousel">
        <div className="swiper-container" id={"homeSwiper"}>
          <div className="swiper-wrapper">{this.renderBanner()}</div>
        </div>
        <div className="swiper-pagination" />
      </div>
    );
  }

  openBanner(link: string) {
    if (!link) return;
    if (window.config.isApp) {
      appOpen(link);
    } else {
      window.open(link, "_blank");
    }
  }

  //Banner渲染
  renderBanner() {
    let banner: any[] = [];
    this.props.wapAdsList.forEach((img: any, index: number) =>
      banner.push(
        <div key={img.Id} className={"swiper-slide "}>
          <a
            onClick={this.openBanner.bind(this, img.Link)}
            style={{
              display: "inline-block",
              width: "100%"
            }}
          >
            <img
              key={index}
              src={window.config.devImgUrl + img.ImgUrl}
              alt=""
              style={{ width: "100%", verticalAlign: "top" }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event("resize"));
                this.setState({ imgHeight: "auto" });
              }}
            />
          </a>
        </div>
      )
    );
    return banner;
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  wapAdsList: state.wapAdsList
});

export default withRouter(connect(mapStateToProps)(Carousel));
