import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';
import Carousel from 'components/carousel/Carousel_usd'
import HomeMain from 'components/homeMain/HomeMain_usd'
import NoticeBar from 'components/homeMain/NoticeBar_usd'
import BaseClass from '@/baseClass';
import { Icon } from "antd-mobile";
import "./HomePage_usd.scss";
import { config } from '../../config/projectConfig';
import { getSession, setSession } from "tollPlugin/commonFun";
import NavBar from "components/navBar/NavBar"



interface State {
    user: []
}
class HomePage extends BaseClass {
    public state = {
        login: false,
        user: [],
        refreshing: false,
        showTop: !config.isApp,
        // topIcon:'', //顶部的图标
    };
    constructor(props: any) {
        super(props, [])
    }

    static getDerivedStateFromProps(props: any, state: State) {
        if (props.user && props.user.Token) {
            return {
                login: true
            }
        } else if (!props.user.Token) {
            return {
                login: false
            }
        }
        return null;
    }

    componentDidMount() {
        if (getSession('showTop')) {
            this.setState({
                showTop: false
            })
        }
    }

    loginTo(e: any) {
        if (!this.props.user || !this.props.user.Token) {
            e.preventDefault()
            window.actions.popWindowAction({
                type: 'LoginWindow',
                text: "您当前未登录,是否登录！",
            });
        }
    }

    loginGo(e: any) {
        if (!this.props.user || !this.props.user.Token) {
            e.preventDefault()
            window.actions.popWindowAction({
                type: 'LoginWindow',
                text: "您当前未登录,是否登录！",
            });
        } else {
            this.props.history.push('/Home/Withdraw');
        }
    }

    // 跳转APP下载页
    downLoad() {
        window.open(this.props.remoteSysConfs.channel_push_url, "_blank");
    }
    // 关闭homeTop部分
    closeTop() {
        setSession("showTop", "true");
        this.setState({
            showTop: false,
        })
    }

    render() {
        return (
            <div className="HomePage">
                {
                    this.state.showTop ?
                        <div className='homeTop'>
                            <div className='topBox'>
                                <div className='topLeft'>
                                    <span className='topClose' onClick={this.closeTop.bind(this)}><i className='icon iconfont icon-iconclose' /></span>
                                </div>
                                <div className='topCenter'>
                                    <img src={config.devImgUrl + this.props.AppLogo} className='appImg' alt='' />
                                    <div className='topCenterBox'>
                                        <h2>{config.appName}</h2>
                                        <h6>真人娱乐，体育投注，电子游艺等尽在一手掌握</h6>
                                    </div>
                                </div>
                                <div className='topRight'>
                                    <button onClick={this.downLoad.bind(this)}>立即下载</button>
                                </div>
                            </div>
                        </div> : ''
                }
                <NavBar appIcon={true} message={true}></NavBar>
                <Carousel />
                <NoticeBar />
                <div className={'handle'}>
                    <div className={'left'}>
                        <div className={'title'}>
                            {
                                !this.state.login ?
                                    <div className={'welcomeTxt'}>欢迎您，游客</div>
                                    :
                                    <div className={'welcomeTxt'}><span className='userName'>{this.props.user.username}</span><span className="viplive">LV{this.props.user.userLevel}</span></div>
                            }
                        </div>
                        <div className="leftbar" onClick={this.goWhere.bind(this)}>
                            {
                                this.state.login ? <div className={'balance'}>余额</div>:''
                            }
                           
                            <div className={'login'}>
                                {
                                    !this.state.login ?
                                        <span className={'publicTxtStyle2'}>请登录</span>
                                        :
                                        this.showRe()
                                }
                            </div>
                        </div>
                    </div>
                    <div className={'right'}>
                        <Link to="/Money" onClick={this.loginTo.bind(this)} className={'topUp'}>
                            <i className={'icon iconfont icon-yinhangqia iconfont-spec'} />
                            <p>存款</p>
                        </Link>
                        <Link to="/Home/Withdraw" onClick={this.loginGo.bind(this)} className={'cashWithdraw'}>
                            <i className={'icon iconfont icon-qukuan iconfont-spec'} />
                            <p>取款</p>
                        </Link>
                        <Link to={"/Home/Transfer"} className={'promo'}>
                            <i className={'icon iconfont icon-zhuanyi iconfont-spec'} />
                            <p>转账</p>
                        </Link>
                        <Link to={"/Message"} className={'promo'}>
                            <i className={'icon iconfont icon-bajiefuli iconfont-spec'} />
                            <p>优惠</p>
                        </Link>
                    </div>
                </div>
                <HomeMain />
            </div>
        );
    }

    goWhere() {
        if (this.state.login) {
            this.setState({ refreshing: true });
            new window.actions.ApiGamePlatformAllBalanceAction().fly(() => {
                this.setState({ refreshing: false });
            });
        } else {
            this.props.history.push('/Home/LoginRegist/Login');
        }
    }

    showRe() {
        if (this.state.refreshing || !!!this.props.user.userBalance) {
            return (
                <Icon type='loading' />
            )
        } else {
            return (
                <span className={'publicTxtStyle2'}>{this.props.user.userBalance}</span>
                // <span className={'publicTxtStyle2'}>{this.props.user.amount}</span>


            )
        }

    }

}


const mapStateToProps = (state: any, ownProps: any) => ({
    // testAction: state.testAction,
    AppLogo: state.imagesConfig.AppLogo,
    user: state.user,
    remoteSysConfs: state.remoteSysConfs,
    backConfigs: state.backConfigs,
});

export default withRouter(connect(mapStateToProps)(HomePage));
