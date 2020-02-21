import React from "react";
import { Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "../../common/style/animate.css"

import LoginRegistPage from "../../pagesFade/loginRegist/LoginRegist";
// import LoginPage from "../../pagesFade/login/LoginPage";
// import RegisterPage from "../../pagesFade/register/RegisterPage";
import GamesPage from "../../pagesFade/games/GamesPage";
import PrivateInfoPage from "../../pagesFade/privateInfo/PrivateInfoPage";
import HistoryPage from "../../pagesFade/history/HistoryPage";
import HistoryRecordPage from "../../pagesFade/history/HistoryRecordPage";
import PlatFromAnnouncePage from "../../pagesFade/platFromAnnounce/PlatFromAnnouncePage";
import SiteLetterPage from "../../pagesFade/siteLetter/SiteLetterPage";
import SharePage from "../../pagesFade/share/SharePage";
import FeedbackPage from "../../pagesFade/feedback/FeedbackPage"
import EditPasswordPage from "../../pagesFade/editPassword/EditPasswordPage"
import ReadMessagePage from "../../pagesFade/message/ReadMessagePage"
import cardManagePage from "../../pagesFade/cardManage/CardManagePage"
import withdrawPage from "../../pagesFade/withdraw/Withdraw"
import AddCardPage from "../../pagesFade/cardManage/AddCardPage"
// import TransferPage from "../../pagesFade/Transfer/Transfer";
import TransferNewPage from "../../pagesFade/Transfer/TransferNew";
import TransferGamePage from "../../pagesFade/Transfer/TransGame";
import ServicePage from "../../pagesFade/service/ServicePage";
import AgentRegPage from "../../pagesFade/agentReg/AgentRegPage";
import AgentShowPage from "../../pagesFade/agentShow/agentShow";

import aboutPage from "../../pagesFade/about/AboutPage";
import ActuvutyPage from "../../pagesFade/activity/activity"
import TurntablePage from "../../pagesFade/turntable/turntable";
import RedEnvelopesPage from "../../pagesFade/redEnvelopes/redEnvelopes"
import DepositDetailsPage from "../../pagesFade/depositDetails/depositDetails"
import withdrawDetailsPage from "../../pagesFade/withdrawDetails/withdrawDetails"
import RecommendPage from "../../pagesFade/recommend/recommend"
import HelpCenterPage from "../../pagesFade/helpCenter/helpCenter"
import PartnershipPage from "../../pagesFade/partnership/partnership"



const LoginRegist = creatAniFc(LoginRegistPage, false)
// const Login = creatAniFc(LoginPage, false)
// const Register = creatAniFc(RegisterPage, false)
const Games = creatAniFc(GamesPage)
const PrivateInfo = creatAniFc(PrivateInfoPage)
const History = creatAniFc(HistoryPage)
const HistoryRecord = creatAniFc(HistoryRecordPage)
const PlatFromAnnounce = creatAniFc(PlatFromAnnouncePage)
const SiteLetter = creatAniFc(SiteLetterPage)
const Share = creatAniFc(SharePage)
const Feedback = creatAniFc(FeedbackPage)
const EditPassword = creatAniFc(EditPasswordPage)
const CardManage = creatAniFc(cardManagePage)
const AddCard = creatAniFc(AddCardPage)
const ReadMessage = creatAniFc(ReadMessagePage)
const Withdraw = creatAniFc(withdrawPage)
// const Transfer = creatAniFc(TransferPage)
const TransferNew = creatAniFc(TransferNewPage)
const TransferGame = creatAniFc(TransferGamePage)
const Service = creatAniFc(ServicePage)
const AgentReg = creatAniFc(AgentRegPage)
const AgentShow = creatAniFc(AgentShowPage)
const About = creatAniFc(aboutPage)
const Turntable = creatAniFc(TurntablePage)
const Actuvuty = creatAniFc(ActuvutyPage)
const RedEnvelopes = creatAniFc(RedEnvelopesPage)
const DepositDetails = creatAniFc(DepositDetailsPage)
const WithdrawDetails = creatAniFc(withdrawDetailsPage)
const Recommend = creatAniFc(RecommendPage)
const HelpCenter = creatAniFc(HelpCenterPage)
const Partnership = creatAniFc(PartnershipPage)


interface Store {
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param store The base value of the expression.
   * @param y The exponent value of the expression.
   */
  store: any;
}
export default class FadeRouter extends React.Component<Store> {
  render() {
    return (
      <div className="FadeRouter">
        <Route path="/*/LoginRegist/:LorR" children={props => <LoginRegist data={props} />} />
        <Route path="/*/Games/:Title/:GamePlatform/:GameType" children={props => <Games data={props} />} />
        <Route path="/*/privateInfo" children={props => <PrivateInfo data={props} />} />
        <Route path="/*/history" children={props => <History data={props} />} />
        <Route path="/*/history/record/:Title" children={props => < HistoryRecord data={props} />} />
        <Route path="/*/PlatFromAnnounce" children={props => <PlatFromAnnounce data={props} />} />
        <Route path="/*/siteLetter/:type" children={(props) => <SiteLetter data={props} />} />
        <Route path="/*/sharePage" children={(props) => <Share data={props} />} />
        <Route path="/*/feedback" children={(props) => <Feedback data={props} />} />
        <Route path="/*/editPassword" children={(props) => <EditPassword data={props} />} />
        <Route path="/*/cardManage" children={(props) => <CardManage data={props} />} />
        <Route path="/*/read/:messageId" children={(props) => <ReadMessage data={props} />} />
        <Route path="/*/addCard" children={(props) => <AddCard data={props}/>}/>
        <Route path="/*/Withdraw" children={props => <Withdraw data={props} />} />
        <Route path="/*/transfer" children={props => <TransferNew data={props} />} />
        <Route path="/*/transfer/transferGame/:Game" children={props => <TransferGame data={props} />} />
        <Route path="/*/service" children={props => <Service data={props} />} />
        <Route path="/*/agentReg" children={props => <AgentReg data={props} />} />
        <Route path="/*/agentShow" children={props => <AgentShow data={props} />} />
        <Route path="/*/about" children={props => <About data={props} />} />
        <Route path="/*/activity" children={props => <Actuvuty data={props} />} />
        <Route path="/*/activity/turntable" children={props => <Turntable data={props} />} />
        <Route path="/*/activity/redEnvelopes" children={props => <RedEnvelopes data={props} />} />
        <Route path="/*/depositDetails" children={props => <DepositDetails data={props} />} />
        <Route path="/*/withdrawDetails" children={props => <WithdrawDetails data={props} />} />
        <Route path="/*/recommend" children={props => <Recommend data={props} />} />
        <Route path="/*/helpCenter" children={props => <HelpCenter data={props} />} />
        <Route path="/*/partnership" children={props => <Partnership data={props} />} />
      </div>
    );
  }
}

interface Pro {
  data: any
}

function creatAniFc(Page: any, needAuth: boolean = true) {
  return (
    class extends React.Component<Pro>{
      render() {
        return (
          <CSSTransition
            in={this.props.data.match != null}
            appear={true}
            timeout={550}
            // fadeOutLeft
            classNames={"fadeLeft"}
            mountOnEnter={true}
            unmountOnExit={true}
          >
            {
              needAuth?window.actions.Authority(true)?<Page />:<LoginRegistPage />:<Page/>
            }
          </CSSTransition>
        )
      }
    }
  )
}





