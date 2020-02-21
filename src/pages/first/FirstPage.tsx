import React from "react";
import { connect } from "react-redux";
import { withRouter,Route,Redirect,Switch} from 'react-router-dom';
import FooterBar1 from "components/tabbar/FooterBar";
import FooterBar2 from "components/tabbar/FooterBar_usd";
import LoadComponentAsync from "@/LoadComponentAsync"
import "./FirstPage.scss";
interface RouterProps {
  history: any
}
class FirstPage extends React.Component<RouterProps> {

  render() {
    return (
      <div className="FirstPage">
        <div className="content">
            <Switch>
              <Route path="/Home" render={() => <LoadComponentAsync key="home" componentPath={`${(window.config.spec === 'yabo-usd' || window.config.spec === 'cgtest02')?"home/HomePage_usd":"home/HomePage"}`}/>}/>  
              <Route path="/found" render={() => <LoadComponentAsync key="found" authCheck={this.props.history}  componentPath={"found/foundPage"}/>}/>
              <Route path="/Message" render={() => <LoadComponentAsync key="Message"  componentPath={"message/MessagePage"}/>}/> 
              <Route path="/live" render={() => <LoadComponentAsync key="money"  authCheck={this.props.history} componentPath={"live/livePage"}/>}/>
              <Route path="/Money" render={() => <LoadComponentAsync key="money"  authCheck={this.props.history} componentPath={"money/MoneyPage"}/>}/> 
              <Route path="/My" render={() => <LoadComponentAsync key="my" authCheck={this.props.history}  componentPath={"my/MyPage"}/>}/>  
              
              {/* 新的 我的页面 备用 */}
              {/* <Route path="/NewMy" render={() => <LoadComponentAsync key="newmy" authCheck={this.props.history}  componentPath={"newMy/NewMyPage"}/>}/>   */}
              <Redirect from="*" to="/Home"/>              
            </Switch>
        </div>    
        {
          (window.config.spec === 'yabo-usd' || window.config.spec === 'cgtest02')?<FooterBar2 />:<FooterBar1 />
        }
      </div>
    );
  }

}


const mapStateToProps = (state: any, ownProps: any) => ({
  testAction: state.testAction
});

export default withRouter(connect(mapStateToProps)(FirstPage));
