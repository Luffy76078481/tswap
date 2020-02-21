import React from "react";
import {List} from 'antd-mobile';
import "./Pui.scss";

// ——————————————————rain ↓
import BaseClass from "@/baseClass";
import {Picker, InputItem} from 'antd-mobile';
// import { Super } from "@babel/types";
// ————————————————————————↑

interface Pro {
  state: any
}

class StatusUi extends React.Component<Pro> {
  render() {
    return (
      <div className="Pui">
        {this.runStatus()}
      </div>
    );
  }

  runStatus() {
    switch (this.props.state) {
      case "noData": {
        return <div className="StatusUi noData"></div>
      }
      case "noMore": {
        return <div className="StatusUi noMore">
          ------------人家是有底线的------------
        </div>
      }
      case "loading":{
        return <div className="StatusUi loading">
          <i className="icon iconfont icon-ggkicon-spinner"></i>
          加载中...
        </div>
      }
      default: {
        return <div className="StatusUi homeNoData"></div>
      }
    }
  }

}



// ————————————————————————————————————————————————————rain ↓
class NumPicker extends BaseClass {  //wap下拉选择数字组件
  constructor(props: any) {
    super(props, []);
}
      public state = {
          data: [
              [
                  {label: '0',value: '0'},
                  {label: '1',value: '1'},
                  {label: '2',value: '2'},
                  {label: '3',value: '3'},                    
                  {label: '4',value: '4'},   
                  {label: '5',value: '5'},
                  {label: '6',value: '6'},
                  {label: '7',value: '7'},
                  {label: '8',value: '8'},                    
                  {label: '9',value: '9'},                 
              ],
              [
                  {label: '0',value: '0'},
                  {label: '1',value: '1'},
                  {label: '2',value: '2'},
                  {label: '3',value: '3'},                    
                  {label: '4',value: '4'},   
                  {label: '5',value: '5'},
                  {label: '6',value: '6'},
                  {label: '7',value: '7'},
                  {label: '8',value: '8'},                    
                  {label: '9',value: '9'},                 
              ],
              [
                  {label: '0',value: '0'},
                  {label: '1',value: '1'},
                  {label: '2',value: '2'},
                  {label: '3',value: '3'},                    
                  {label: '4',value: '4'},   
                  {label: '5',value: '5'},
                  {label: '6',value: '6'},
                  {label: '7',value: '7'},
                  {label: '8',value: '8'},                    
                  {label: '9',value: '9'},                 
              ],
              [
                  {label: '0',value: '0'},
                  {label: '1',value: '1'},
                  {label: '2',value: '2'},
                  {label: '3',value: '3'},                    
                  {label: '4',value: '4'},   
                  {label: '5',value: '5'},
                  {label: '6',value: '6'},
                  {label: '7',value: '7'},
                  {label: '8',value: '8'},                    
                  {label: '9',value: '9'},                 
              ]
          ],
          // withdrawalPassword: this.props.withdrawalPassword,
      };

  render(){
      // const {withdrawalPassword} = this.state;

      const {value,onChange,onOk,error,onErrorClick,tipText} = this.props;
      return (
          <div className='set_withdraw_pwd'>
              <Picker
                  cascade={false}
                  data={this.state.data}
                  value={value}
                  onOk = {onOk}
              >
                  <InputItem
                      value={value}
                      error={error}
                      onErrorClick={onErrorClick}
                      onChange={onChange}
                  >
                      <label className="label">{tipText}</label>
                  </InputItem>
              </Picker>
          </div>   
      )
  }
}

class FastTimeSelect extends BaseClass {
  constructor(props: any) {
    super(props, [], true);
}
  public state = {
    timeZoneIndex:this.props.timeZone,
  }


  static getDerivedStateFromProps(props:any, state:any) {
      if (props.timeZone.length !== state.timeZoneIndex.length) {
        return {
          timeZoneIndex:props.timeZone,
        }
      }
      return null;
    }

  timeZoneChange(val:any){
      this.setState({
          timeZoneIndex:val,
      });
      this.props.getVal(val);
  }
  render(){
      return (
          <div className='timeZone'>
              <Picker title="选择时区"
                      data={[{label: ('北京时间'), value: 0},{label: ('美东时间'), value: 1}]}
                      value={this.state.timeZoneIndex}
                      cols={1}
                      onOk={(val)=>{this.timeZoneChange(val)}}
                      disabled={this.props.disable}
              >
                  <List.Item arrow="down"></List.Item>
              </Picker>
          </div>
      )
  }
}


export {
  StatusUi,
  NumPicker,
  FastTimeSelect
};
