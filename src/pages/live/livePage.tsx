import React from 'react';
import { connect } from "react-redux";
import "./livePage.scss";
// import NavBar from "components/navBar/NavBar"
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";


class livePage extends BaseClass {
  public ele: any;
  public state = {
    noBto: false
  }

  constructor(props: any) {
    super(props, []);
    this.ele = document.getElementsByTagName("BODY")[0]
    this.ele.onhashchange = this.hashChange.bind(this);

    window.addEventListener('message', this.listMessage.bind(this));
  }

  listMessage(event: any) {
    if (event.data === "bottom||hide") {
      let el: any = document.getElementsByClassName("FooterBar_usd")[0];
      el.style.display = "none";
      this.setState({
        noBto: true
      })
    } else {
      let el: any = document.getElementsByClassName("FooterBar_usd")[0];
      el.style.display = "flex";
      this.setState({
        noBto: false
      })
    }
  }

  hashChange() {
    let getVal = window.location.hash.substr(1).split("||");
    if (getVal.length === 3 && !this.props.user.Token) {
      sessionStorage.setItem("user", JSON.stringify({
        UserName: getVal[0],
        Token: getVal[1],
        ExtToken: getVal[2]
      }));
      new window.actions.LoginAfterInit();
    } else {
      console.error("参数错误")
    }
  }

  componentWillUnmount() {
    this.ele.onhashchange = null;
    let el: any = document.getElementsByClassName("FooterBar_usd")[0];
    el.style.display = "flex";
  }

  render() {
    return (
      <div className="livePage anmateContent">
        {/* <NavBar btnGoback={true} btnService={true} title={'比分直播'}></NavBar> */}
        <div className='pageContent' style={{ height: this.state.noBto ? "100%" : "calc(100% - 1rem)" }}>
          <iframe title='liveShow' src={`https://tyt365.com/match/#${window.location}||${this.props.user.ExtToken}`} ></iframe>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => (
  {
    user: state.user,
  }
);
export default withRouter(connect(mapStateToProps)(livePage));