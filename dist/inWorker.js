!function(a,b){typeof exports==='object'&&typeof module!=='undefined'?module.exports=b():typeof define==='function'&&define.amd?define(b):(a.inWorker=b())}(this,(function(){'use strict';function a(a){var b=Object.keys(a).map(function(b){return b+' : '+JSON.stringify(a[b])}).join(', ');return'{ '+b+' }'}function b(b,c){function d(b,d){if(d===0){return b.length!==0&&'var '+b+' = DISPATCH_TO_MAIN_THREAD;'||''}else if(d===1){return b.length!==0&&'var '+b+' = '+a(c)||''}else{return''}}var e=b.toString(),f=e.substring(e.indexOf('(')+1,e.indexOf(')')),g=f.split(',').map(function(a){return a.trim()}),h=g.map(d).join('\n'),i='\nvar DISPATCH_TO_MAIN_THREAD = (x) => postMessage(JSON.stringify(x))\n'+h+'\n'+e.substring(e.indexOf('{')+1,e.lastIndexOf('}'))+'\n  ';return i}function c(a,c){var d,e;!c&&typeof a==='function'?(d=a,e={}):(d=c,e=a);return function(a,c){var f=b(d,e),g=new Blob([f],{type:'application/javascript'}),h=new Worker(URL.createObjectURL(g)),i=function a(){return h.terminate()};h.onmessage=function(a){c(JSON.parse(a.data));i()};h.onerror=function(b){a(b);i()};return i}}return c}))