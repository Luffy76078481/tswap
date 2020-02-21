import 'babel-polyfill'
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "serviceWorker";
import FreamPage from "pages/fream/FreamPage";
import init from "init/init";

window.Promise = Promise;
//解决IE下Promise报错 【1.install babel-runtime和babel-plugin-transform-runtime 
//2.添加在主页之前添加window.Promise = Promise】
const store = init();

ReactDOM.render(
  <FreamPage store={store} />,
  document.getElementById("root") as HTMLElement
);
serviceWorker.unregister();
