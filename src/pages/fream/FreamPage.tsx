import React from "react";
import FirstPage from "../first/FirstPage";
import { BrowserRouter as Router} from "react-router-dom";
import { Provider } from "react-redux";
import FadeRouter from "./FadeRouter"
import PopWindow from "components/popWindow/PopWindow"
import NoticeWindow from "components/noticeWindow/NoticeWindow"
import "./prestrain.scss"

interface Store {
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param store The base value of the expression.
   * @param y The exponent value of the expression.
   */
  store: any;
}

export default class FreamPage extends React.Component<Store> {

  render() {
    return (
      <Provider store={this.props.store}>
        <Router basename="/m">
          <div className="FreamPage" style={{"height":"100%"}}>
            <FirstPage store={this.props.store} />
            <FadeRouter store={this.props.store} />
            <PopWindow store={this.props.store} />
            <NoticeWindow store={this.props.store} />
          </div>
        </Router>
      </Provider>
    );
  }
}
