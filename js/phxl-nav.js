/**
 * Created by Vania on 16/2/15.
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
$.fn.phxlNav = function (a,b) {
    a = $.extend({}, $.fn.phxlNav.options, a);
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

/**
 * 创建nav
 * @param a   url返回数据
 * @param b   content上下文
 * @param c   前端传递参数
 * @returns {*}
 */
function createNav(a,b,c){
    var navSelector = $("<div>").addClass("J_selectorLine s-brand");
    b.addClass("container-fluid")
     .append($("<div>").addClass("container")
     .append($("<div>").addClass("nav-selector")
     .append($("<div>").addClass("selector")
     .append(navSelector))));
    $.each(a,function(i,item){
        var wrap = $("<div>").addClass("sl-wrap").append($("<div>").prop("id",item.parentId).addClass("sl-key").text(item.text+":"));
        var ul = $("<ul>").addClass("J_valueList v-fixed");
        $.each(item.content,function(j,sItem){
            ul.append("<li><a href='"+sItem.url+"' title='"+sItem.title+"' rel='nofollow'><i></i>"+sItem.name+"</a></li>");
        })
        var ulParent = $("<div>").addClass("sl-v-list");
        var wrapContent = $("<div>").addClass("sl-value").append(ulParent);
        ul.appendTo(ulParent);
        wrapContent.appendTo(wrap);
        navSelector.append(wrap);
    });
    var w = c.width;
    var h = c.height;
    if(w && w != ""){
        var w = isNaN(w) ? w : w + "px";
        b.find(".selector").width(w);
    }
    if(h && h != ""){
        var h = isNaN(h) ? h : h + "px";
        b.find(".selector").height(h);
    }
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