import React from 'react';
import { connect } from 'react-redux';
import './AboutPage.scss';
import { withRouter } from 'react-router-dom';
import BaseClass from '@/baseClass';
import { config } from "../../config/projectConfig";
import NavBar from 'components/navBar/NavBar';
import Logod from './image/about_logo.png';


class AboutUse extends BaseClass {
  constructor(props: any) {
    super(props, []);
  }

  componentDidMount() {
    new window.actions.ApiGetConfigImgAction(3).fly(); // 网站图标
    new window.actions.LoadBackConfigsAction().fly();// 易记域名
  }
  render() {
    let { imagesConfig } = this.props;
    let { SiteMainUrl } = this.props.backConfigs;
    return (
      <div className="AboutPage anmateContent">
        <NavBar
          btnGoback={true}
          btnService={true}
          title={"关于我们"}
        >
        </NavBar>
        <div className="scroll-content">
          <div className="main_logo_org">
            <img src={config.devImgUrl + imagesConfig.Avatar} className='user_avatar' alt='' />
            <div className='promo_code'>易记域名: {SiteMainUrl}</div>
          </div>
          <div className="main_content">
            <img className="loading" src={Logod} alt="" />
            <p>
              {window.config.appName}是拥有欧洲英国GC监督委员会（Gambling
              Commission）和马耳他博彩管理局（MGA）颁发的合法执照，同时，取得英属维尔京群岛（BVI）的认证，注册于菲律宾，是受国际博彩协会认可的合法博彩公司。进行注册并娱乐前，请确保您年满18周岁。
            </p>
            <span>版本号：3.0.0</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  imagesConfig: state.imagesConfig,
  backConfigs: state.backConfigs,
});
export default withRouter(connect(mapStateToProps)(AboutUse));

