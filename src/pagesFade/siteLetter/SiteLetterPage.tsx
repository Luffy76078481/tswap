import React from 'react';
import { List, ListView, Badge, Accordion } from 'antd-mobile';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './SiteLetterPage.scss';
import BaseClass from "@/baseClass";
import { clearHtml } from "tollPlugin/commonFun";
import NavBar from "components/navBar/NavBar"
import { StatusUi } from "components/pui/Pui";
import { getNowDate, getStorage, setStorage } from '../../tollPlugin/commonFun';


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1: any, row2: any) => row1 !== row2,
});

interface State {
  type: string
  dataSource: any,
  [key: string]: any;
}

class SiteLetter extends BaseClass {
  public state = {
    tabLoading: false,
    dataSource: dataSource.cloneWithRows({}),
    isLoading: false,
    hasMore: true,
    noData: false,
    type: this.props.match.params.type,
    fromDate: getNowDate(-30).slice(0, 10),
    toDate: getNowDate(0).slice(0, 10),
    listData: []

  };
  constructor(props: any) {
    super(props, []);
  }

  public pageIndex: number = 0


  static getDerivedStateFromProps(props: any, state: State, ) {
    let list = JSON.parse(JSON.stringify(state.listData.concat(props.notices)));
    if (props.notices.length > 0 && state.type === 'pla') {
      return {
        dataSource: state.dataSource.cloneWithRows(list),
        hasMore: false,
        isLoading: false,
        tabLoading: false,
        noData: props.notices.length > 0 ? false : true
      };
    }
    return null;
  }

  onEndReached = () => {
    if (!this.state.hasMore || this.state.isLoading) return false;
    this.setState({ isLoading: true });
    this.getList();
  };

  componentDidMount() {
    this.getList();
  }

  getList() {
    if (this.state.type === 'mes') {
      //站内信
      new window.actions.ApiQuerySitemsgsAction(
        this.state.fromDate,
        this.state.toDate,
        this.pageIndex,
        30
      ).fly((resp: any) => {
        if (resp.StatusCode === 0) {
          this.pageIndex++;
          let list = this.state.listData.concat(resp.List);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            hasMore: resp.Count > this.pageIndex * 30,
            isLoading: false,
            tabLoading: false,
            noData: list.length > 0 ? false : true
          });
          new window.actions.ApiReadAllSiteMsgAction().fly((resp: any) => {
            if (resp.StatusCode === 0) {
              new window.actions.ApiSitemsgUnreadCountAction().fly();
            }
          });
        }
      });
    } else {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.notices),
        hasMore: false,
        isLoading: false,
        tabLoading: false,
        noData: this.props.notices.length > 0 ? false : true
      });
    }
  }
  accordionReadNew(id: any) {
    let isReadNews = getStorage('isReadNews') ? getStorage('isReadNews') : '';
    let isRedList = isReadNews.split(',');
    if (!isRedList.includes(id + '')) {
      setStorage('isReadNews', isReadNews + id + ',');
      window.actions._dispatch({ type: 'changeReadNewsNum', tabsType: '1' });
    }
  }
  renderList() {
    let isReadNews = getStorage('isReadNews') ? getStorage('isReadNews') : '';
    // 手风琴
    let Identify = (
      <span className="newIcon">
        <Badge text="新" className="Badge" />
      </span>
    );
    let row = (rowData: any) => {
      let tittle = (
        <div className="AnnounceHeader">
          {this.state.type === 'mes'
            ? ''
            : isReadNews.indexOf(rowData.Id + ',') > -1
              ? ''
              : Identify}
          <span className="title">{rowData.Title}</span>
          <span className="AnnounceTime">
            {this.state.type === 'mes'
              ? rowData.SendTime && rowData.SendTime.slice(0, 10)
              : rowData.OperatTime && rowData.OperatTime.slice(0, 10)}
          </span>
        </div>
      );
      return (
        <List.Item
          className="messageAnnounce"
          onClick={this.accordionReadNew.bind(this, rowData.Id)}
        >
          <Accordion
            defaultActiveKey={this.state.type === 'mes' ? '0' : ''}
            className="my-accordion"
          >
            <Accordion.Panel header={tittle} className="pad">
              <p
                dangerouslySetInnerHTML={{
                  __html: clearHtml(
                    this.state.type === 'mes'
                      ? rowData.Message
                      : rowData.Content
                  )
                }}
              ></p>
            </Accordion.Panel>
          </Accordion>
        </List.Item>
      );
    };
    // 下拉还有数据就显示在加载，否则显示没有数据了
    const renderFooter = () => {
      let con;
      if (this.state.hasMore) {
        con = <StatusUi state={'loading'} />;
      } else if (this.state.noData) {
        con = <StatusUi state={'noData'} />;
      } else {
        con = <StatusUi state={'noMore'} />;
      }
      return con;
    };
    return (
      <ListView
        dataSource={this.state.dataSource}
        className="myListView"
        renderFooter={renderFooter}
        renderRow={row} //--------手风琴
        pageSize={30} //每次事件循环（每帧）渲染的行数
        initialListSize={30}
        scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
        onEndReached={this.onEndReached.bind(this)} //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
        onEndReachedThreshold={100} //调用onEndReached之前的临界值，单位是像素
      />
    );
  }


  render() {
    return (
      <div className="SiteLetter anmateContent">
        <NavBar
          btnGoback={true}
          btnService={true}
          title={this.state.type === 'mes' ? '站内信' : '平台公告'}
        ></NavBar>
        <div className="scroll-content">{this.renderList()}</div>
      </div>
    );
  }
}


const mapStateToProps = (state: any, ownProps: any) => ({
  notices: state.notices,
  noticesUnRead: state.noticesUnRead
});
export default withRouter(connect(mapStateToProps)(SiteLetter));