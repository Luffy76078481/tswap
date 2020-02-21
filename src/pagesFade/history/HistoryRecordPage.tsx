import React from "react";
import { Icon, SegmentedControl, DatePickerView, Modal, Flex, Toast, ListView } from 'antd-mobile';
import { connect } from "react-redux";
import './HistoryRecordPage.scss';
import { FastTimeSelect } from "components/pui/Pui";
import BaseClass from "@/baseClass";
import { withRouter } from "react-router-dom";
import NavBar from "components/navBar/NavBar";
import { getNowDate, formatTime } from "../../tollPlugin/commonFun";
import { StatusUi } from "components/pui/Pui";

let pageIndex = 0;
let listData: any = [];

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => row1 !== row2,
});

class HistoryRecordPage extends BaseClass {
  public state = {
    dataSource: dataSource.cloneWithRows({}),
    hasMore: true,
    isLoading: false,
    tabLoading: false,
    refreshing: false,
    noData: false,
    timeZone: 8,
    title: '',
    queryType: '存款记录',
    QSelectTabsType: 0,
    // timeZoneIndex: [0],//[1] 美东时间，[0] 北京时间
    timeZoneIndex: this.props.match.params.Title === 'touzhu' ? [1] : [0], //[1] 美东时间，[0] 北京时间
    showTimeChoose: false,
    beginValue: new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000),
    endValue: new Date(),
    fromDate: getNowDate(0).slice(0, 10),
    toDate: getNowDate(0).slice(0, 10),
    minDate: new Date(new Date().getTime() - 730 * 24 * 60 * 60 * 1000),
    maxDate: new Date(new Date().getTime())
  };
  constructor(props: any) {
    super(props, [], true);
  }

  componentDidMount() {
    let title = this.props.match.params.Title;
    let queryType = '';
    switch (title) {
      case 'chongzhi':
        queryType = '存款记录';
        this.setState({ queryType, title: queryType });
        break;
      case 'zhuanzhang':
        queryType = '转账记录';
        this.setState({ queryType, title: queryType });
        break;
      case 'tikuan':
        queryType = '提款记录';
        this.setState({ queryType, title: queryType });
        break;
      case 'touzhu':
        queryType = '投注记录';
        this.setState({ queryType, title: queryType, timeZoneIndex: [1] });
        break;

      default:
        queryType = '优惠记录';
        this.setState({ queryType, title: queryType });
        break;
    }
    pageIndex = 0;
    listData = [];
    this.getData(queryType);
  }

  getData(queryType?: string) {
    this.setState({ isLoading: true });
    new window.actions.ApiQueryHistoryAction(
      {
        FromDateTime: this.state.fromDate,
        ToDateTime: this.state.toDate,
        GamePlatform: '',
        PageIndex: pageIndex,
        TimeZone: this.state.timeZone,
        PageSize: 20
      },
      queryType ? queryType : this.state.queryType
    ).fly((resp: any) => {
      Toast.hide();
      if (resp.StatusCode === 0) {
        this.succesCallback(resp);
      } else {
        if (this.state.queryType === '优惠记录') {
          this.setState({ isLoading: false }, () => {
            this.onEndReached();
          });
        } else {
          this.setState({ isLoading: false });
        }
      }
    });
  }
  succesCallback(resp: any) {
    pageIndex++;
    listData = listData.concat(resp.List);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(listData),
      hasMore: resp.Count > pageIndex * 30,
      isLoading: false,
      tabLoading: false,
      noData: listData.length > 0 ? false : true
    });
  }

  onEndReached = () => {
    if (!this.state.hasMore || this.state.isLoading) return false;
    this.getData();
  };

  //选时间的
  QSelectTabChange(e: any) {
    listData = [];
    pageIndex = 0;

    if (e.nativeEvent.selectedSegmentIndex === 0) {
      this.setState({
        beginValue: new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000),
        endValue: new Date(),
        fromDate: getNowDate(0).slice(0, 10),
        toDate: getNowDate(0).slice(0, 10)
      });
    } else if (e.nativeEvent.selectedSegmentIndex === 1) {
      this.setState({
        beginValue: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
        endValue: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
        fromDate: getNowDate(-1).slice(0, 10),
        toDate: getNowDate(-1).slice(0, 10)
      });
    } else if (e.nativeEvent.selectedSegmentIndex === 2) {
      this.setState({
        beginValue: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
        endValue: new Date(),
        fromDate: getNowDate(-6).slice(0, 10),
        toDate: getNowDate(0).slice(0, 10)
      });
    } else if (e.nativeEvent.selectedSegmentIndex === 3) {
      this.setState({
        beginValue: new Date(new Date().getTime() - 13 * 24 * 60 * 60 * 1000),
        endValue: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        fromDate: getNowDate(-13).slice(0, 10),
        toDate: getNowDate(-7).slice(0, 10)
      });
    }
    this.setState(
      {
        tabLoading: true,
        QSelectTabsType: e.nativeEvent.selectedSegmentIndex - 0
      },
      () => {
        this.getData();
      }
    );
  }

  showTimeChoose() {
    this.setState({
      showTimeChoose: true
    });
  }

  hideTimeChoose() {
    this.setState({
      showTimeChoose: false
    });
  }

  onBeginChange(value: any) {
    this.setState({
      beginValue: value
    });
  }

  onEndChange(value: any) {
    this.setState({
      endValue: value
    });
  }

  chooseTime() {
    let beginTime: any = this.state.beginValue;
    let endTime: any = this.state.endValue;
    if (beginTime > endTime) {
      Modal.alert('结束时间不能小于开始时间', '');
      return;
    }
    if (endTime - beginTime > 30 * 24 * 60 * 60 * 1000) {
      Modal.alert('查询时间请小于1个月！', '');
      return;
    }
    this.setState(
      {
        fromDate: formatTime(beginTime).slice(0, 10),
        toDate: formatTime(endTime).slice(0, 10),
        showTimeChoose: false,
        tabLoading: true
      },
      () => {
        pageIndex = 0;
        listData = [];
        this.getData();
      }
    );
  }

  renderList() {
    const _this = this;
    let queryType = _this.state.queryType;
    if (this.state.tabLoading) {
      return <StatusUi state={'loading'} />;
    }

    const row: any = (item: any) => {
      if (queryType === '存款记录') {
        let className = 'badg';
        //0：未支付，1：处理中，2：审核中，3：拒绝，4：成功，5：取消
        if (item.Status === 1 || item.Status === 3 || item.Status === 5) {
          className = 'badg red';
        } else if (item.Status === 4) {
          className = 'badg blue';
        }
        return (
          <Flex className="listItem">
            <div className="itemL">
              {item.CreateTime.split('T')[0]}
              <br />
              {item.CreateTime.split('T')[1].slice(0, 8)}
            </div>
            <div className="itemC">
              <span>
                {item.TypeText}
                {item.Amount}
              </span>
              <span className="bot">{item.OrderNo}</span>
            </div>
            <div className="itemR">
              <span className={className}>{item.StatusText}</span>
            </div>
          </Flex>
        );
      } else if (queryType === '转账记录') {
        let className = 'badg';
        //0：失败，1：成功
        if (item.Status === 1) {
          className = 'badg blue';
        }
        return (
          <Flex className="listItem">
            <div className="itemL">
              {item.CreateTime.split('T')[0]}
              <br />
              {item.CreateTime.split('T')[1].slice(0, 8)}
            </div>
            <div className="itemC">
              <span>
                平台{item.GameType} {item.TypeText} ￥{item.Amount}
              </span>
            </div>
            <div className="itemR">
              <span className={className}>{item.StatusText}</span>
            </div>
          </Flex>
        );
      } else if (queryType === '提款记录') {
        let className = 'badg';
        //0：未支付，1：处理中，2：审核中，3：拒绝，4：成功，5：取消
        if (item.Status === 1 || item.Status === 3 || item.Status === 5) {
          className = 'badg red';
        } else if (item.Status === 4) {
          className = 'badg blue';
        }
        return (
          <Flex className="listItem">
            <div className="itemL">
              {item.CreateTime.split('T')[0]}
              <br />
              {item.CreateTime.split('T')[1].slice(0, 8)}
            </div>
            <div className="itemC">
              <span>提款金额:￥{item.Amount}</span>
              <span className="bot">{item.OrderNo}</span>
            </div>
            <div className="itemR">
              <span className={className}>{item.StatusText}</span>
            </div>
          </Flex>
        );
      } else if (queryType === '投注记录') {
        if (item.GamePlatform === '总计') {
          return (
            <Flex
              className="listItem"
              style={{
                background: '#ddd',
                position: 'fixed',
                bottom: '0',
                width: '100%'
              }}
            >
              <div className="itemL">
                {item.GamePlatform}投注:{item.Num}次<br />
              </div>
              <div className="itemC" style={{ width: '75%' }}>
                <span>
                  总投注￥{item.Bet}元,总有效投注￥{item.RealBet}元
                </span>
              </div>
            </Flex>
          );
        }
        let className = 'badg';
        let name = '';
        //1输 2赢 3和 4无效,其他的默认为空
        if (item.ResultType === 1) {
          className = 'badg red';
          name = '输';
        } else if (item.ResultType === 2) {
          className = 'badg blue';
          name = '赢';
        } else if (item.ResultType === 3) {
          className = 'badg green';
          name = '和';
        } else if (item.ResultType === 4) {
          className = 'badg gray';
          name = '无效';
        } else {
          className = '';
          name = '';
        }

        return (
          <Flex className="listItem">
            <div className="itemL">
              {item.CreateTimeDateText}
              <br />
              {item.CreateTimeTimeText}
            </div>
            <div className="itemC">
              <span>
                {item.GamePlatform} 投注￥{item.Bet},有效￥{item.RealBet}
              </span>
              <span>{item.OrderNumber}</span>
            </div>
            <div className="itemR">
              <span className={className}>{name}</span>
            </div>
          </Flex>
        );
      } else if (queryType === '优惠记录') {
        return (
          <Flex className="listItem">
            <div className="itemL">
              {item.OperatTime
                ? item.OperatTime.split('T')[0]
                : item.CreateTime.split('T')[0]}
              <br />
              {item.OperatTime
                ? item.OperatTime.split('T')[1].slice(0, 8)
                : item.CreateTime.split('T')[1].slice(0, 8)}
            </div>
            <div className="itemC">
              <span>活动-{item.BonusName}</span>
            </div>
            <div className="itemR">
              <span>优惠金额:￥{item.Amount}</span>
            </div>
          </Flex>
        );
      }
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
        dataSource={_this.state.dataSource}
        className="myListView"
        renderRow={row}
        renderFooter={renderFooter}
        initialListSize={60}
        pageSize={20} //每次事件循环（每帧）渲染的行数
        scrollRenderAheadDistance={200} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
        onEndReached={this.onEndReached.bind(this)} //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
        onEndReachedThreshold={100} //调用onEndReached之前的临界值，单位是像素
      />
    );
  }

  render() {
    return (
      <div className="HistoryRecord anmateContent">
        <NavBar
          btnGoback={true}
          btnService={true}
          title={this.state.title}
        ></NavBar>
        <div className="fastSelection">
          <div className="timeZone-date">
            <FastTimeSelect
              timeZone={this.state.timeZoneIndex}
              getVal={(val: any) => {
                this.setState({
                  timeZone: val[0] === 0 ? 8 : -4
                });
              }}
              // disable={this.state.FastTimeSelectDisable}
            />
            <div className="timeBtn" onClick={this.showTimeChoose.bind(this)}>
              <span className="date">
                {this.state.fromDate} ~ {this.state.toDate}{' '}
              </span>
              <Icon size="sm" type="down" />
            </div>
          </div>

          <SegmentedControl
            values={['今日', '昨日', '本周', '上周']}
            selectedIndex={this.state.QSelectTabsType - 0}
            onChange={this.QSelectTabChange.bind(this)}
            className="SegmentedQSelect"
          />
        </div>
        <div className="record-list">{this.renderList()}</div>

        {this.state.showTimeChoose ? (
          <div className="timeChoose">
            <div
              className="mask"
              onClick={this.hideTimeChoose.bind(this)}
            ></div>
            <div className="timeCon">
              <div className="timeConBtn">
                <a className="left" onClick={this.hideTimeChoose.bind(this)}>
                  取消
                </a>
                <a className="right" onClick={this.chooseTime.bind(this)}>
                  确定
                </a>
              </div>
              <div className="sub-title">开始时间</div>
              <DatePickerView
                mode="date"
                value={this.state.beginValue}
                onChange={this.onBeginChange.bind(this)}
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
              />
              <div className="sub-title">结束时间</div>
              <DatePickerView
                mode="date"
                value={this.state.endValue}
                onChange={this.onEndChange.bind(this)}
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}



const mapStateToProps = (state: any, ownProps: any) => (
    {
        records: state.records
    }
);
export default withRouter(connect(mapStateToProps)(HistoryRecordPage));