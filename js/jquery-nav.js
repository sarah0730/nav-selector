/**
 * Created by Vania on 16/1/25.
 */
var navMethods = {
    "init"   : function(a,b,c){//初始化
        return createNav(a,b,c);
    },
    "reload" : function(a,b,c){//刷新

    },
    "append" : function(a){//新增一行

    },
    "delete" : function(a){//删除一行
        console.log(a);
    }
};

/**
 * nav初始化
 * @param a  触发类型
 * @param b  参数
 */
$.fn.nav = function (a,b) {
    a = $.extend({}, $.fn.nav.options, a);
    //若第一个参数为string,触发定法方法
    if(typeof a == "string"){
        delete arguments[0];
        return navMethods[a].apply(this,arguments);
    }else{//否则触发初始化
        try{
            var url = a.url;
            $.ajax({
                url : url,
                data:{},
                type:'post',
                content:this,
                dataType:'json',
                success:function(json){
                    navMethods['init'].apply(this,[json,this.content,a]);
                }
            })
        }catch(e){
            console.log(e.message);
        }
    }
}

$.fn.nav.options = {
    onSelect : function(node){

    },
    onUnSelect : function(node){

    }
}
/**
 * 创建nav
 * @param a   url返回数据
 * @param b   content上下文
 * @param c   前端传递参数
 * @returns {*}
 */
function createNav(a,b,c){
    b.before('<div class="phxl-nav"><ul><li>全部</li></ul></div>');
    for(var i in a){
        var html = "<li>" + a[i].title + ":";
        for(var j in a[i].childNodes){
            html += '<button id="nodeBtn_'+i+'_'+j+'" pValue="'+a[i].value+'" value="'+a[i].childNodes[j].value+'">'+a[i].childNodes[j].text+'</button>';
        }
        html += "</li>";
        b.prev().find("ul").append(html);
    }
    return createTitle(b,c);
}
/**
 * 创建标题
 * @param b content上下文
 * @param c 前端传递参数
 * @returns {*}
 */
function createTitle(b,c){
    return  $.each(b.prev().find("button"),function(){
                $(this).on('click',function(){
                    //c.onSelect($(this));
                    $(this).parent().hide();
                    b.prev().find("li:first").append("<button id='nav_"+this.id+"' pValue='"+$(this).attr("pValue")+"' value='"+this.value+"' style='background-color: yellow;'>"+$(this).text()+"</button>");
                    var node = {"id":this.value,"text":$(this).text(),"pid":$(this).attr("pValue")};
                    c.onSelect(node);
                    titleBindBtn(b,c);
                })
            })
}
/**
 * 绑定标题按键事件
 * @param b content上下文
 * @param c 前端传递参数
 * @returns {*}
 */
function titleBindBtn(b,c){
    return    b.prev().find("li:first button").each(function(){
                    $(this).on('click',function(){
                        $("#"+$(this).prop("id").substring(4)).parent().show();
                        var unNode = {"id":this.value,"text":$(this).text(),"pid":$(this).attr("pValue")};
                        c.onUnSelect(unNode);
                        $(this).remove();
                    })
              })
}