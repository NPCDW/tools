(function(e){function t(t){for(var a,i,s=t[0],c=t[1],l=t[2],u=0,m=[];u<s.length;u++)i=s[u],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&m.push(r[i][0]),r[i]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);f&&f(t);while(m.length)m.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],a=!0,s=1;s<n.length;s++){var c=n[s];0!==r[c]&&(a=!1)}a&&(o.splice(t--,1),e=i(i.s=n[0]))}return e}var a={},r={index:0},o=[];function i(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=a,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(n,a,function(t){return e[t]}.bind(null,a));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var f=c;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";n("85ec")},1:function(e,t){},10:function(e,t){},11:function(e,t){},12:function(e,t){},13:function(e,t){},14:function(e,t){},2:function(e,t){},3:function(e,t){},4:function(e,t){},5:function(e,t){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("8bbf"),r=n.n(a),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container"},[n("div",{staticStyle:{color:"white","background-color":"#F56C6C","text-align":"center","font-size":"12px",padding:"5px 0 5px 0",position:"absolute",top:"0",width:"100%"}},[e._v("内部人员专用，请勿输入任何账号秘钥等信息")]),n("ocr"),n("a",{staticClass:"github-corner",attrs:{href:"https://github.com/NPCDW/ocr","aria-label":"View source on GitHub"}},[n("svg",{staticStyle:{fill:"#151513",color:"#fff",position:"absolute",top:"0",border:"0",right:"0"},attrs:{width:"80",height:"80",viewBox:"0 0 250 250","aria-hidden":"true"}},[n("path",{attrs:{d:"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"}}),n("path",{staticClass:"octo-arm",staticStyle:{"transform-origin":"130px 106px"},attrs:{d:"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",fill:"currentColor"}}),n("path",{staticClass:"octo-body",attrs:{d:"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",fill:"currentColor"}})])])],1)},i=[],s=function(){var e=this,t=this,n=t.$createElement,a=t._self._c||n;return a("div",{staticStyle:{margin:"40px",display:"flex"}},[a("div",{staticStyle:{margin:"40px"}},[a("div",{staticStyle:{"max-width":"500px"}},[a("input",{staticStyle:{width:"438px",margin:"20px",padding:"10px"},attrs:{type:"text",placeholder:"粘贴图片到此处",autofocus:""},on:{paste:function(e){return t.handleImagePaste(e)}}}),a("div",{staticStyle:{display:"flex","justify-content":"center"}},[a("div",{staticStyle:{position:"relative"}},[t.srcImageUrl?a("div",[a("img",{staticStyle:{"max-width":"460px","max-height":"260px"},attrs:{src:t.srcImageUrl,alt:t.srcImageName,srcset:""}})]):a("div",{staticStyle:{border:"#DDDDDD 3px dashed",height:"200px",width:"260px"}},[t._m(0)]),a("input",{staticStyle:{opacity:"0",position:"absolute",top:"0",left:"0",width:"100%",height:"100%"},attrs:{type:"file",accept:"image/*"},on:{change:function(e){return t.handleImageUpload(e)}}})])])]),a("el-button",{staticStyle:{margin:"20px",width:"460px"},attrs:{loading:t.loading,type:"primary"},on:{click:t.textRecognition}},[t._v("文本识别")]),a("div",{staticStyle:{margin:"20px",width:"460px"}},[a("el-tabs",{on:{"tab-click":t.handleTabSwitch},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"百度云",name:"baidu"}},[a("baidu-ocr",{ref:"baidu-ocr",on:{"fill-ocr-result":function(t){e.ocrResult=t}}})],1),a("el-tab-pane",{attrs:{label:"腾讯云",name:"tencent"}},[a("tencent-ocr",{ref:"tencent-ocr",on:{"fill-ocr-result":function(t){e.ocrResult=t}}})],1)],1)],1)],1),a("div",{staticStyle:{margin:"40px",flex:"1"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:30},placeholder:"识别结果...",readonly:!0},model:{value:t.ocrResult,callback:function(e){t.ocrResult=e},expression:"ocrResult"}})],1)])},c=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{"text-align":"center",height:"100%",width:"100%",display:"flex","flex-direction":"column","justify-content":"center"}},[n("span",{staticStyle:{"font-size":"40px",color:"#DDDDDD"}},[e._v("+")]),n("span",{staticStyle:{"font-size":"14px","text-align":"center",color:"#AAAAAA"}},[e._v("拖拽图片到此处，或点击此处上传")])])}],l=(n("d3b7"),n("b0c0"),n("3ca3"),n("ddb0"),n("2b3d"),n("9861"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-form",{attrs:{model:e.form,"label-width":"140px"}},[n("el-form-item",{attrs:{label:"识别类型"}},[n("el-radio-group",{model:{value:e.form.type,callback:function(t){e.$set(e.form,"type",t)},expression:"form.type"}},[n("el-radio",{attrs:{label:"general_basic"}},[e._v("标准")]),n("el-radio",{attrs:{label:"accurate_basic"}},[e._v("高精度")]),n("el-radio",{attrs:{label:"handwriting"}},[e._v("手写体")])],1)],1),n("el-form-item",{attrs:{label:"access_token"}},[n("el-input",{attrs:{type:"password","show-password":"",placeholder:"选填，与下方两个输入框二选一"},model:{value:e.form.access_token,callback:function(t){e.$set(e.form,"access_token",t)},expression:"form.access_token"}})],1),n("el-form-item",{attrs:{label:"API Key"}},[n("el-input",{model:{value:e.form.client_id,callback:function(t){e.$set(e.form,"client_id",t)},expression:"form.client_id"}})],1),n("el-form-item",{attrs:{label:"Secret Key"}},[n("el-input",{attrs:{type:"password","show-password":""},model:{value:e.form.client_secret,callback:function(t){e.$set(e.form,"client_secret",t)},expression:"form.client_secret"}})],1),n("el-form-item",{attrs:{label:"保存账户信息（在当前浏览器）","label-width":"280px"}},[n("el-switch",{on:{change:function(t){return e.saveChange()}},model:{value:e.form.save,callback:function(t){e.$set(e.form,"save",t)},expression:"form.save"}})],1)],1)],1)}),f=[],u=n("1da1"),m=(n("e9c4"),n("96cf"),n("cebe")),d=n.n(m),p="/baiduCloud/";function h(e,t){return d.a.post(p+"oauth/2.0/token","grant_type=client_credentials&client_id="+e+"&client_secret="+t,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})}function g(e,t,n){return d.a.post("https://aip.baidubce.com/rest/2.0/ocr/v1/"+t,"image="+encodeURIComponent(n),{params:{access_token:e},headers:{"Content-Type":"application/x-www-form-urlencoded"}})}var v={name:"BaiduOcr",data:function(){return{form:{type:"general_basic",access_token:"",client_id:"",client_secret:"",save:!1}}},created:function(){var e=localStorage.getItem("ocr-baidu-info");e&&(this.form=JSON.parse(e))},methods:{ocr:function(e){var t=this;return Object(u["a"])(regeneratorRuntime.mark((function n(){var a,r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(t.form.access_token){n.next=6;break}if(t.form.client_id&&t.form.client_secret){n.next=4;break}return t.$message.error("请填写 access_token，或 APIKey 和 SecretKey"),n.abrupt("return");case 4:return n.next=6,h(t.form.client_id,t.form.client_secret).then((function(e){var n=e.data;t.form.access_token=n.access_token}));case 6:return a=t.form.access_token.substring(0,t.form.access_token.lastIndexOf(".")),a=a.substr(a.lastIndexOf(".")+1),r=Date.parse(new Date)/1e3,r+"">a?t.$message.error("access_token 已过期，请更换"):parseInt(a)-r<432e3&&t.$message.warning("access_token 即将过期，请及时更换"),n.abrupt("return",g(t.form.access_token,t.form.type,e.toDataURL("image/jpeg",1)).then((function(e){var n=e.data;if(n.error)t.$message.error(n.error_description);else{for(var a="",r=0;r<n.words_result.length;r++)a+=n.words_result[r].words+"\n";t.$emit("fill-ocr-result",a)}})).catch((function(e){t.$message.error(e)})));case 11:case"end":return n.stop()}}),n)})))()},saveChange:function(){this.form.save?localStorage.setItem("ocr-baidu-info",JSON.stringify(this.form)):localStorage.removeItem("ocr-baidu-info")}},watch:{"form.access_token":function(){this.saveChange(this.form.save)},"form.client_id":function(){this.saveChange(this.form.save)},"form.client_secret":function(){this.saveChange(this.form.save)},"form.type":function(){this.saveChange(this.form.save)}}},b=v,x=n("2877"),_=Object(x["a"])(b,l,f,!1,null,"8bea4602",null),C=_.exports,y=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-form",{attrs:{model:e.form,"label-width":"140px"}},[n("el-form-item",{attrs:{label:"识别类型"}},[n("el-radio-group",{model:{value:e.form.type,callback:function(t){e.$set(e.form,"type",t)},expression:"form.type"}},[n("el-radio",{attrs:{label:"GeneralBasicOCR"}},[e._v("标准")]),n("el-radio",{attrs:{label:"GeneralAccurateOCR"}},[e._v("高精度")]),n("el-radio",{attrs:{label:"GeneralHandwritingOCR"}},[e._v("手写体")])],1)],1),n("el-form-item",{attrs:{label:"SecretId"}},[n("el-input",{model:{value:e.form.SECRET_ID,callback:function(t){e.$set(e.form,"SECRET_ID",t)},expression:"form.SECRET_ID"}})],1),n("el-form-item",{attrs:{label:"SecretKey"}},[n("el-input",{attrs:{type:"password","show-password":""},model:{value:e.form.SECRET_KEY,callback:function(t){e.$set(e.form,"SECRET_KEY",t)},expression:"form.SECRET_KEY"}})],1),n("el-form-item",{attrs:{label:"保存账户信息（在当前浏览器）","label-width":"280px"}},[n("el-switch",{on:{change:function(t){return e.saveChange()}},model:{value:e.form.save,callback:function(t){e.$set(e.form,"save",t)},expression:"form.save"}})],1)],1)],1)},w=[],S=(n("25f0"),n("fb6a"),n("99af"),n("1c46")),E=n.n(S),I="/tencentCloudOcr/";function R(e,t){return d.a.post(I,t,{headers:e})}var T={name:"TencentOcr",data:function(){return{form:{type:"GeneralBasicOCR",SECRET_ID:"",SECRET_KEY:"",save:!1}}},created:function(){var e=localStorage.getItem("ocr-tencent-info");e&&(this.form=JSON.parse(e))},methods:{ocr:function(e){var t=this;if(this.form.SECRET_ID&&this.form.SECRET_KEY){var n=JSON.stringify({ImageBase64:e.toDataURL("image/jpeg",1)});return R(this.sign(n),n).then((function(e){var n=e.data;if(n.Response.Error)t.$message.error(n.Response.Error.Code+"\n"+n.Response.Error.Message);else{for(var a="",r=0;r<n.Response.TextDetections.length;r++)a+=n.Response.TextDetections[r].DetectedText+"\n";t.$emit("fill-ocr-result",a)}})).catch((function(e){t.$message.error(e)}))}this.$message.error("请填写 SECRET_ID 和 SECRET_KEY")},sign:function(e){var t=this.form.SECRET_ID,n=this.form.SECRET_KEY,a="ocr.tencentcloudapi.com",r="ocr",o="ap-beijing",i=this.form.type,s="2018-11-19",c=Date.parse(new Date)/1e3,l=this.getDate(c),f="content-type;host",u=this.getHash(e),m="POST",d="/",p="",h="content-type:application/json\nhost:"+a+"\n",g=m+"\n"+d+"\n"+p+"\n"+h+"\n"+f+"\n"+u;console.log(g);var v="TC3-HMAC-SHA256",b=this.getHash(g),x=l+"/"+r+"/tc3_request",_=v+"\n"+c+"\n"+x+"\n"+b;console.log(_);var C=this.sha256(l,"TC3"+n),y=this.sha256(r,C),w=this.sha256("tc3_request",y),S=this.sha256(_,w,"hex");console.log(S);var E=v+" Credential="+t+"/"+x+", SignedHeaders="+f+", Signature="+S;return console.log(E),{Authorization:E,"Content-Type":"application/json",Host:a,"X-TC-Action":i,"X-TC-Timestamp":c.toString(),"X-TC-Version":s,"X-TC-Region":o}},sha256:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2?arguments[2]:void 0,a=E.a.createHmac("sha256",t);return a.update(e).digest(n)},getHash:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"hex",n=E.a.createHash("sha256");return n.update(e).digest(t)},getDate:function(e){var t=new Date(1e3*e),n=t.getUTCFullYear(),a=("0"+(t.getUTCMonth()+1)).slice(-2),r=("0"+t.getUTCDate()).slice(-2);return"".concat(n,"-").concat(a,"-").concat(r)},saveChange:function(){this.form.save?localStorage.setItem("ocr-tencent-info",JSON.stringify(this.form)):localStorage.removeItem("ocr-tencent-info")}},watch:{"form.SECRET_ID":function(){this.saveChange(this.form.save)},"form.SECRET_KEY":function(){this.saveChange(this.form.save)},"form.type":function(){this.saveChange(this.form.save)}}},k=T,O=Object(x["a"])(k,y,w,!1,null,"07aa529e",null),D=O.exports,$={name:"Ocr",components:{TencentOcr:D,BaiduOcr:C},data:function(){return{srcImageFile:null,srcImageUrl:null,srcImageName:null,srcImageCanvas:null,activeName:"baidu",ocrResult:"",loading:!1}},created:function(){var e=localStorage.getItem("ocr-cloud-type");e&&(this.activeName=e)},methods:{textRecognition:function(){var e=this;this.srcImageUrl?(this.loading=!0,this.$nextTick((function(){"baidu"===e.activeName?e.$refs["baidu-ocr"].ocr(e.srcImageCanvas).finally((function(){e.loading=!1})):"tencent"===e.activeName&&e.$refs["tencent-ocr"].ocr(e.srcImageCanvas).finally((function(){e.loading=!1}))}))):this.$message.error("请先选择图片")},handleTabSwitch:function(){localStorage.setItem("ocr-cloud-type",this.activeName)},handleImagePaste:function(e){if(e.clipboardData||e.originalEvent){var t=e.clipboardData||e.originalEvent.clipboardData;if(t.items)for(var n=t.items,a=n.length,r=null,o=0;o<a;o++)-1!==n[o].type.indexOf("image")&&(r=n[o].getAsFile(),this.handleImage(r))}},handleImageUpload:function(e){e.target.files[0]&&this.handleImage(e.target.files[0])},handleImage:function(e){var t=this;this.srcImageFile=e,this.srcImageUrl=this.getFileUrl(this.srcImageFile),this.srcImageName=this.srcImageFile.name,this.getCanvas(this.srcImageUrl).then((function(e){t.srcImageCanvas=e,t.textRecognition()}))},getFileUrl:function(e){var t=null;return void 0!==window.URL?t=window.URL.createObjectURL(e):void 0!==window.webkitURL&&(t=window.webkitURL.createObjectURL(e)),t},getCanvas:function(e){return new Promise((function(t){var n=new Image;n.src=e,n.onload=function(){var e=document.createElement("canvas");e.width=n.width,e.height=n.height;var a=e.getContext("2d");a.fillStyle="white",a.fillRect(0,0,e.width,e.height),a.drawImage(n,0,0,n.width,n.height),t(e)}}))}}},j=$,U=Object(x["a"])(j,s,c,!1,null,"72d90224",null),N=U.exports,L={name:"App",components:{Ocr:N}},A=L,P=(n("034f"),Object(x["a"])(A,o,i,!1,null,null,null)),K=P.exports,H=n("5f72"),M=n.n(H);n("0fae");r.a.config.productionTip=!1,r.a.use(M.a),new r.a({render:function(e){return e(K)}}).$mount("#app")},"5f72":function(e,t){e.exports=ELEMENT},6:function(e,t){},7:function(e,t){},8:function(e,t){},"85ec":function(e,t,n){},"8bbf":function(e,t){e.exports=Vue},9:function(e,t){},cebe:function(e,t){e.exports=axios}});