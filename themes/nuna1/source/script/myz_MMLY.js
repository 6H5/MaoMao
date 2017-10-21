;(function () {
	function getLocalTime(nS) {     
	   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
	}
    function loadMMLY(){
        // $('body .MMLY').remove()
        $.ajax({
            url:"http://h5.test.cloudm.com/n/news_myz/getdata?act=getNewsListJsonp&selectCategory=MM%E7%95%99%E8%A8%80&publishStatus=1",  
            dataType:'jsonp',
            data:'',
            jsonp:'callback',  
            success:function(result) {  
                console.log(result)
                var arr=result.data,htmlDOM=''
                if(arr.length>0){
                    arr.forEach(function(n,i){
                        htmlDOM+='<div class="ly-one"><p class="t"><span>'+getLocalTime(n.createtime)+'：</span><span style="float:right;"><span>来自'+n.title+'</span><span data-id='+n.id+' data-sort='+n.sort+' class="zan"><span>'+n.sort+'</span><img style="width:30px;" src="../zan-off.png"></span><span></p><p style="padding-right:100px;">'+n.content+'</p></div>'
                    })
                }
                $(window).on('load',function(){
                    $(".paginator").after('<div class="MMLY"><h4>给毛毛的留言：<a class="admin" target="_blank" href="http://h5.test.cloudm.com/n/news_myz/manage">管理</a></h4>'+htmlDOM+'<p style="text-align:center;"><button class="addLMsg-btn">添加留言</button></p></div>');
                })
            },
            timeout:3000  
        });
    }
    loadMMLY()
    // 显示增加留言弹框
    $('main').on('click','.addLMsg-btn',function(){
		// alert('暂未开放')
        $('body .MMLY-add').remove()
        $('body').append('<div class="MMLY-add"><p><input class="title" placeholder="留言者昵称/邮箱"/></p><p><input class="content" placeholder="留言内容"/></p><p><button class="MMLY-ok-btn">提交</button></p><p><button class="MMLY-cancel-btn">取消</button></p></div>')
    })
    // 隐藏增加留言弹框
    $('body').on('click','.MMLY-cancel-btn',function(){
        $('body .MMLY-add').remove()
    })
    // 确定添加留言
    $('body').on('click','.MMLY-ok-btn',function(){
        var title=$('body').find('.MMLY-add input.title').val()
        var content=$('body').find('.MMLY-add input.content').val()
        if(!title||!content){
            alert('请填写留言者和留言内容')
            return
        }
        // alert('ajax')
        $.ajax({  
            url:"http://h5.test.cloudm.com/n/news_myz/api/addLeaveMsgJsonp?category=MM留言&title="+title+"&content="+content,
            dataType:'jsonp',
            data:'',
            jsonp:'callback',  
            success:function(result) {  
                console.log(result)
                if(result.head.retcode==0){
                    alert('非常感谢，您的留言毛毛已收到！毛毛主人审核通过后会在留言列表展示')
                    $('body .MMLY-add').remove()
                }else{
                    alert('留言失败（'+result.head.retmsg+'）')
                }
            },
            timeout:3000  
        });
    })
    // 点赞
    $('body').on('click','span.zan',function(){
        // console.log(this)
        var id=$(this).attr('data-id'),
            sort=Number($(this).find('span').text()),
            src=$(this).find('img').attr('src'),
            status='off'
        if(String(src).indexOf('on')>0){
            sort-=1
            status='off'
        }
        if(String(src).indexOf('off')>0){
            sort+=1
            status='on'
        }
        console.log(id,sort)
        // alert('ajax')
        var that=this
        $.ajax({  
            url:"http://h5.test.cloudm.com/n/news_myz/api/changeSortJsonp?id="+id+"&sort="+sort,
            dataType:'jsonp',
            data:'',
            jsonp:'callback',  
            success:function(result) {  
                console.log(result)
                if(result.head.retcode==0){
                    alert('操作成功')
                    $(that).find('img').attr('src','../zan-'+status+'.png')
                    $(that).find('span').text(sort)
                }else{
                    alert('操作失败（'+result.head.retmsg+'）')
                }
            },
            timeout:3000  
        });
    })
}())

