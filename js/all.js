
var app=angular.module('myapp',[]);
app.controller('todo',function($scope){
    (function(key){
        if(localStorage.getItem(key)==null){//本地存储中没有数据时候
            $scope.lists=[{id:0,title:'新列表1',color:'',item:[]}];//默认数据库中有一条数据，因为默认要有有一条数据在页面上显示
            localStorage.setItem(key,JSON.stringify($scope.lists));//发送数据到本地存储
        }else{//如果本地存储有数据，就获取本地数据存储到lists属性上
            $scope.lists=JSON.parse(localStorage.getItem(key));
        }
    })('toDo');
    //保存数据到后台函数
    function saveData () {
        localStorage.setItem("toDo",JSON.stringify($scope.lists));
    }
    $scope.color=['#62DA37','#1BAEF8','#CC72E1','#A3855F','#F7CA00','#FF8200','#FF2C6F'];
    $scope.$watch(function(){
        angular.forEach($scope.lists,function(o,i){
            o.color=$scope.color[i%$scope.color.length];
        });
        saveData ();//只要监测到数据变化，就保存数据到后台
    });

    //$scope.showNow这个函数是实现点击左边列表时在右边显示当前事项的详细信息，这里的参数obj就是当前点击的这个对象的一条json数据，可以看看html页面的调用这个函数的返回值就知道了
    $scope.showObj=$scope.lists[0];//定义初始值：默认右边显示第一条数据内容
    $scope.currentId=0;//这个属性是记录当前显示的数据的id，主要是左边的列表的背景色需要用到这个id来决定加不加背景色的那个类名，默认值是0
    $scope.showNow=function(obj){
        $scope.showObj=obj;
        $scope.currentId=$scope.showObj.id;
    };

    //添加数据函数
    $scope.add=function(){
        $scope.endId= $scope.lists[$scope.lists.length-1].id;//先把数据中最后一条数据的id获取到，新增的数据id就是最后这条数据的id+1
        var obj={id:$scope.endId+1,title:'新列表'+($scope.endId+2),color:'',item:[]};
        $scope.lists.push(obj);
        $scope.showNow(obj);
    };

    //添加事项函数，前台会返回操作当前列表数据的item数据，即当前列表的事项的数组
    $scope.addItem=function(attr){
        attr.push({title:'',done:false});
    };

    //下面这部分都是已完成事项的数量的显示
    $scope.alreadyNum=0;
    $scope.alreadyNumSum=function(){
        var num=0;
        angular.forEach($scope.showObj.item,function(o,i){
            if (o.done==true){
                num++;
            }
        });
        $scope.alreadyNum=num;
    };
    $scope.$watch(function(){//这里必须写在￥watch里面，当切换列表时候要重新执行下计算未完成事项的数量函数
        $scope.alreadyNumSum();
    });
    $scope.changeState=function(obj){//改变事项状态的方法
        obj.done=!obj.done;
        $scope.alreadyNumSum();
    }
});

//自定义过滤器，功能：过滤事项的状态
app.filter('showN',function(){
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