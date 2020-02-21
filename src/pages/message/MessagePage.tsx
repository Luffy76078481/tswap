import React from 'react';
import NavBar from "components/navBar/NavBar"
import { List, Badge,ListView,Tabs} from 'antd-mobile';
import { _dispatch } from "../../store/anctions";
import { connect } from "react-redux";
import './MessagePage.scss';
import {config} from "../../config/projectConfig";
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import { setStorage,getStorage } from "tollPlugin/commonFun";
import { StatusUi } from "components/pui/Pui";


let pageIndex = 0;
let listData: any[] = [];
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => row1 !== row2,
});

interface RouterProps {
    history: any
}

class Message extends BaseClass<RouterProps> {
    public state = {
        tabLoading: false,
        dataSource: dataSource.cloneWithRows({}),
        isLoading: false,
        hasMore: true,
        promoTabType:'',
    };
    constructor(props: any) {
        super(props, []);

    }

    

    readNew(id:any){
        let isReadNews = getStorage('isReadNews')?getStorage('isReadNews'):"";
        let isRedList = isReadNews.split(",");
        if(!isRedList.includes(id+"")){
            setStorage('isReadNews',isReadNews+id+',');
            _dispatch({type:"changeReadNewsNum",tabsType:0});
        }
        this.props.history.push('/Message/read/'+id)
    }

    onEndReached = () => {
        if(!this.state.hasMore || this.state.isLoading)  return false;
        this.setState({ isLoading: true });
        this.getList();
    };

    componentDidMount(){
        pageIndex=0;
        listData=[];
        if(this.props.promoData.length === 0){//首次进来获取数据
            new window.actions.ApiQueryPromotionTypesAction().fly();
            this.getList();
        }else{//N次进来不用获取首屏数据
            pageIndex++;
            listData=listData.concat(this.props.promoData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.props.promoData),
                hasMore: true,
                isLoading: false,
                tabLoading:false
            });
        }
    }

    // 获取数据
    getList() {
        new window.actions.ApiQueryPromotionsAction(pageIndex,5,this.state.promoTabType).fly((resp:any)=>{
            if(resp.StatusCode ===0){
                pageIndex++;
                listData=listData.concat(resp.List);
                let cloneListData = JSON.parse(JSON.stringify(listData));
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(cloneListData),
                    hasMore: resp.Count>pageIndex*5,
                    isLoading: false,
                    tabLoading:false
                });
            }
        })
    }

    // 优惠活动渲染
    renderList(){
        let isReadNews = getStorage('isReadNews')?getStorage('isReadNews'):"";
        if(this.state.tabLoading){
            return(
                <StatusUi state={"loading"} />
            )
        }
        let row = (rowData:any) => {
            return (
                <List.Item onClick={this.readNew.bind(this, rowData.Id)} className="listItem listformessage">
                    <img className="promoImg" src={config.devImgUrl + rowData.Img} alt=''/>
                    <div className={'content'}>
                        {
                            isReadNews.indexOf(rowData.Id + ',') > -1 ? "" : <Badge text="新" hot className="Badge"/>
                        }
                        <span className={'txt'}>{rowData.Title}</span>
                        <small className="time">{rowData.StartTime.slice(0, 10)}</small>
                    </div>
                </List.Item>
            )

        };
        const renderFooter = ()=>{
            if (this.state.isLoading) {
                return (<StatusUi state={"loading"} />)
            } 
            return (<StatusUi state={"noMore"} />)         
        };
        return(
            <ListView
                dataSource={this.state.dataSource}
                className="myListView"
                renderFooter={renderFooter}
                renderRow={row}
                pageSize={5}//每次事件循环（每帧）渲染的行数
                scrollRenderAheadDistance={100}//当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                onEndReached={this.onEndReached.bind(this)}//当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                onEndReachedThreshold={100}//调用onEndReached之前的临界值，单位是像素
            />
        )
    }

    changepPromoType (tab:any) {
        listData=[];
        pageIndex=0;
        this.setState({
            promoTabType:tab.Key,
            tabLoading:true,
            hasMore:true,
        },()=>{
            this.getList();
        });
    }
    render(){
        const tabs = [{ title: '全部优惠',Key:''},...(
            this.props.promoType.map((i:any) => (
                    {title:i.TypeName,Key:i.Id}
                ))
        )];
        return(
            <div className="MyMessage">
                <NavBar
                    btnGoback={true}
                    btnService={true}
                    title={"优惠活动"}
                >    
                </NavBar>
                <Tabs tabs={tabs} 
                    onChange={this.changepPromoType.bind(this)}
                >
                </Tabs>
                <div className="scroll-content">
                    {this.renderList()}
                </div>
            </div>
        )
    }

}


const mapStateToProps = (state: any, ownProps: any) => (
    {
        promoData:state.promotions.promoData,
        promoType:state.promotions.promoTypes,
        promotions:state.promotions.promotions.rows
    }
);
export default withRouter(connect(mapStateToProps)(Message));