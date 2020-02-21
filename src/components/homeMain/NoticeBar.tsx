import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import "./NoticeBar.scss";
interface State {
  notices: []
}
class NoticeBar extends BaseClass {
  public state = {
    notices: []
  }
  render() {
    // 走马灯数据 去内容里面所有标签的 ————————————rain
    let marqueeCotent = () => {
      let marqueeCotent = "";
      if (this.props.notices.length > 0) {
        for (let i = 0; i < this.props.notices.length; i++) {
          marqueeCotent += this.props.notices[i].Content.replace(/(&nbsp;|&ldquo;|&rdquo|;|\s){1}|<[^>]+>/g,"") + "  ";
        }
      }
      return marqueeCotent
    }
    return (
      <div className="NoticeBar" onClick={this.goPla.bind(this)}>
        <span className="icon iconfont icon-md-guangbo" />
        <div id="wrapper" className="wrapper">
          <div className="inner">
            <p className="txt">
              {/* {this.props.notices &&
                this.props.notices.map((item: any) => {
                  return item.Content;
                })} */}
                {marqueeCotent()}
            </p>
          </div>
        </div>
      </div>
    );
  }


  goPla(e:any){
      if (!this.props.user || !this.props.user.Token) {
        e.preventDefault()
      window.actions.popWindowAction({
        type: 'LoginWindow',
        text:"您当前未登录,是否登录！",
      });
    }else{
      this.props.history.push('/Home/siteLetter/pla')
    }  
  }

  componentDidMount() {
    this.initNotice();
  }



  static getDerivedStateFromProps(props: any, state: State) {
    if (props.notices.length !== state.notices.length
    ) {
      return {
        notices: props.notices,
      }
    }
    return null;
  }


  public wrapper: any;
  inner: any;
  p: any;
  p_w: any;
  wrapper_w: any;
  timmer: any;

  initNotice() {
    this.wrapper = document.getElementById("wrapper");
    this.inner = this.wrapper.getElementsByTagName("div")[0];
    this.p = document.getElementsByClassName("txt")[0];
    this.p_w = this.p.offsetWidth;
    this.wrapper_w = this.wrapper.offsetWidth;
    if (this.wrapper_w > this.p_w) {
      return false;
    }
    this.inner.innerHTML += this.inner.innerHTML;
    let as = document.getElementsByClassName("inner");
    let as2 = as[0] as HTMLElement;
    as2.style.width = this.p_w * 2 + "px";
    this.timmer = setInterval(() => {
      if (this.p_w + this.wrapper_w > this.wrapper.scrollLeft) {
        // console.log(this.p_w + this.wrapper_w,this.wrapper.scrollLeft)
        this.wrapper.scrollLeft++;
      } else {
        this.wrapper.scrollLeft = 0;
      }
    }, 30);
  }

  componentWillUnmount() {
    clearInterval(this.timmer);
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  notices: state.notices,
  user: state.user,
});

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(NoticeBar)
);
