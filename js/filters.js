
//自定义过滤器，功能：过滤事项的状态
angular.module('filters',[]).filter('showN',function(){
    return function (attr,state){
        var newArr=[];
        angular.forEach(attr,function(o,i){
            if (o.done==state){
                newArr.push(o);
            }
        });
        return newArr;
    }
});