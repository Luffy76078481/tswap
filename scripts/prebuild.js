
//replace(" ","")
var fs = require("fs"); //获取fs模块
var glob = require("glob") // 遍歷
// 获取 package.json 环境变量
var isRunStartWap = process.env.isRunStartWap;
var isBuildWap = process.env.isBuildWap;
var isBuildApp = process.env.isBuildApp;


if (isRunStartWap) {
    console.log(' =================================== 前方高能：移动端配置启动...ing ======================================= ')
} else if (isBuildWap) {
    console.log(' =================================== 前方高能：Wap正在打包前配置...ing  ======================================= ')
} else if (isBuildApp) {
    console.log(' =================================== 前方高能：App正在打包前配置...ing ======================================= ')
} else {
    console.log(' ========== ========== ========== 前方高能：PC打包ing ========== ========== ========== ')
}

var config = readConfig("src/config/projectConfig.ts");  //读取配置文件
changeConfig();//替换原有config文件
changeScss();//替换css
changeImg();//替换img

// 讀取文件
function readFile(path) {
    return fs.readFileSync(path).toString();
}
// 寫入文件 - 寫入的文件路徑 寫入的内容
function writeFile(path, content) {
    fs.writeFileSync(path, content, {
        encoding: "utf8", // 可选值，默认 ‘utf8′
        flag: "w" // 默认值 ‘w'
    });
}
// 讀取Config配置文件
function readConfig(str) {
    var configContent = readFile(str);
    var i = configContent.indexOf("{"); // 開始
    configContent = configContent.substring(i); // 獲取整個config對象
    return JSON.parse(configContent); // 轉換
}



// 替換内容
function replaceVariables(content, api) {
    var tag = false;
    var ret = "";
    var off = 0;
    var startTag = "//__start";
    var endTag = "//__end";
    while (true) {
        var i = content.indexOf(startTag, off);//__start下标
        if (i < 0) {
            if (tag) {
                ret += content.substring(off); // 连接end之后
                return ret;
            } else {
                return false;
            }
        } else {
            tag = true;
        }
        // 处理end以前
        var j = content.indexOf("\n", i + startTag.length) // 换行符下标
        var tem = content.substring(i + startTag.length, j).trim(); // 修改内容
        // 替换api 或者 spec 
        if (api) {
            tem = tem.replace("#{spec}", config.api)
        } else {
            tem = tem.replace("#{spec}", config.spec)
        }
        var k = content.indexOf(endTag, j); //__end下标
        // 連接 
        ret += content.substring(off, j) + "\n";
        ret += tem + "\n";
        off = k;// 重新找__start
    }
}

// configData=>配置config文件
function changeConfig() {
    var configData = readFile("src/config/configData.js")
    var end = 0;
    var startIndex = configData.indexOf("//〓〓〓" + config.spec + "〓〓〓");
    if (startIndex == -1) {
        console.error(" ==== configData/configDataWap 無此項配置，請核對配置 ")
    } else {
        startIndex = configData.indexOf("export", startIndex);
        end = configData.indexOf("//〓〓〓End〓〓〓", startIndex);
        var newConfigData = configData.substring(startIndex, end);
        writeFile("src/config/projectConfig.ts", newConfigData);
        config = readConfig("src/config/projectConfig.ts");  //读取修改后的配置文件
        // 打包和啓動的不同處理
        if (isRunStartWap) {
            var webpackConfig = readFile("src/setupProxy.js");
            webpackConfig = replaceVariables(webpackConfig, true);//替换API
            writeFile("src/setupProxy.js", webpackConfig);
        } else {
            newConfigData = readConfig('src/config/projectConfig.ts');
            newConfigData.devImgUrl = "";
            if (isBuildApp) {
                newConfigData.isApp = true;
            }
            if (isBuildWap) {
                newConfigData.isApp = false;
            }
            newConfigData = JSON.stringify(newConfigData)
            newConfigData = "export const config =" + newConfigData;
            writeFile("src/config/projectConfig.ts", newConfigData);
        }

        config = readConfig("src/config/projectConfig.ts");  //读取修改后的配置文件

    }
}


function changeScss() {//替换css
    var scss = readFile('src/common/style/' + config.model + '.scss');
    writeFile("src/common/style/theme.scss", scss);
}





function changeImg() {//替换图片
    glob('src/common/style/images/loading_' + config.model + '.png', (err, files) => {
        files.forEach( //循环出所有图片
            function (path) {
                var Img = fs.readFileSync(path, { //读取图片
                    encoding: 'hex',
                    flag: 'r'
                })
                fs.writeFileSync("public/loading.png", Img, {
                    encoding: "hex",
                    flag: "w"
                });
            }
        )
    });
}


// if (isRunStartWap || isBuildWap || isBuildApp) {
//     config = readConfig('config/config_Wap.js');
//     changeImg();
//     changeScss();
//     // 更換圖片
//     function changeImg() {
//         //glob('src/wapSrc/wapThemes/' + config.spec + '/style/images/*.png', (err, files) => {

//         //glob('src/wapSrc/wapThemes/' + config.spec + '/style/images/*.ico', (err, files) => {
//         glob('src/themes_wap/themes/' + config.model + '/images/*.ico', (err, files) => {
//             files.forEach( //循环出所有图片
//                 function (path) {
//                     var Img = fs.readFileSync(path, { //读取图片
//                         encoding: 'hex',
//                         flag: 'r'
//                     })
//                     var replaPath = path.split("/images/")[1];
//                     writeImg(replaPath, Img)
//                 }
//             )
//         });
//         //glob('src/wapSrc/wapThemes/' + config.spec + '/style/images/*.jpg', (err, files) => {
//         glob('src/themes_wap/themes/' + config.model + '/images/*.jpg', (err, files) => {
//             files.forEach( //循环出所有图片
//                 function (path) {
//                     var Img = fs.readFileSync(path, { //读取图片
//                         encoding: 'hex',
//                         flag: 'r'
//                     })
//                     var replaPath = path.split("/images/")[1];
//                     writeImg(replaPath, Img)
//                 }
//             )
//         });

//     }
//     // 切換SCSS

// }
