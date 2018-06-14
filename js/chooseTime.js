// 打开选择时间弹窗
function chooseTime($obj) {
	var parentObj = $obj.parents('.record_list'),           //最大的父元素
		parentId = parentObj.attr('data-id');               //父元素id
	toggleObj($('.time_modal'));
	$('#submitTime').attr('data-id', parentId);
}
// 提交时间
function submitTime($obj) {
	var dataId = $obj.attr('data-id'),
		listObj = $('.record_list[data-id="'+dataId+'"]');

	var time = $('.bespeak_data .active_bespeak').attr('date') + ' ' + $('.bespeak_data .active_bespeak').attr('time')
	var onlyChoseAlert = simpleAlert({
        "content": "预约时间提交成功！",
        "buttons": {
            "确定": function() {
            	listObj.find('.order_time').text(time);
                onlyChoseAlert.close();
                toggleObj($('.time_modal'));
            }
        }
    })
}

// 选择预约时间
$(document).on('click', '.bespeak_data .can_bespeak', function() {
	console.log($(this).attr('date') + ' ' + $(this).attr('time'))
	var isClass = $(this).hasClass('active_bespeak');
	if (isClass) {
		$(this).removeClass('active_bespeak');
		$(this).find('span:last-child').text('可约');
	} else {
		$('.bespeak_data .can_bespeak').removeClass('active_bespeak');
		$(this).addClass('active_bespeak');
		$(this).find('span:last-child').text('已选');
	}
})

// 点击日历
chooseDate($('.choose_time'), $('#datetimepicker'));
// 日历中选择日期
function chooseDate(clickObj, inputObj) {
	clickObj.click(function(e){
		e.stopPropagation();
		inputObj.lqdatetimepicker({
			css : 'datetime-day',
			dateType : 'D',
			selectback : function(){
				console.log(inputObj.val())
			}
		});
	});
}

var fake_data = [
	{
		date: '2017-12-26',
		monthDay: '12-26',
		week: '周二',
		timeArr: [
			{	
				status: '2',
				startHours: '06.00',
				endHours: '08.30',
				label: '休息'
			},
			{	
				status: '1',
				startHours: '09.00',
				endHours: '10.00',
				label: '约满'
			},
			{
				status: '1',
				startHours: '10.00',
				endHours: '11.00',
				label: '约满'
			},
			{
				status: '2',
				startHours: '11.00',
				endHours: '13.30',
				label: '休息'
			},
			{
				status: '1',
				startHours: '14.00',
				endHours: '15.00',
				label: '约满'
			},
			{
				status: '2',
				startHours: '15.00',
				endHours: '16.00',
				label: '休息'
			},
			{
				status: '2',
				startHours: '22.00',
				endHours: '23.30',
				label: '休息'
			}
		]
	},
	{
		date: '2017-12-27',
		monthDay: '12-27',
		week: '周三',
		timeArr: [
			{	
				status: '2',
				startHours: '06.00',
				endHours: '08.30',
				label: '休息'
			},
			{	
				status: '1',
				startHours: '09.00',
				endHours: '10.00',
				label: '约满'
			},
			{
				status: '1',
				startHours: '10.00',
				endHours: '11.00',
				label: '约满'
			},
			{
				status: '2',
				startHours: '11.00',
				endHours: '13.30',
				label: '休息'
			},
			{
				status: '1',
				startHours: '14.00',
				endHours: '15.00',
				label: '约满'
			},
			{
				status: '2',
				startHours: '15.00',
				endHours: '16.00',
				label: '休息'
			},
			{
				status: '2',
				startHours: '22.00',
				endHours: '23.30',
				label: '休息'
			}
		]
	}
]
handleData(fake_data, $('.bespeak_data'));


// 处理数据
function handleData(data, appendToObj) {
	$.each(data, function(index, value) {
		var domCont = '';
	    domCont += '<ul>';
	    domCont += '<p><em style="display: none;">'+value.date+'</em><span>' + value.monthDay + '</span><br />' + value.week + '</p>';
	    for (var i = 0; i < 24; i++) {
	    	domCont += '<li class="can_bespeak" date="'+value.date+'" time="' + formatHour(i) + '"><span>' + formatHour(i) + ':00</span> <span>可约</span></li>';
	    }
	    domCont += '</ul>';
	    appendToObj.append(domCont);

	    var _this = appendToObj.find('ul').eq(index);
    	$.each(value.timeArr, function(index, value) {
	    	var time_start =  value.startHours, //开始时间
	    		time_end = value.endHours,      //结束时间
	    		time_status = value.status;     //预约状态

	    	if (time_status == '1') { // 约满
	    		time_start = time_start.split('.')[0];
	    		_this.find('li[time='+time_start+']').removeClass('can_bespeak');
	    		_this.find('li[time='+time_start+']').find('span:first-child').text(time_start + ':00');
	    		_this.find('li[time='+time_start+']').find('span:last-child').text('约满');
	    	} else if (time_status == '2') { // 休息
				var timeLen = Math.ceil(time_end - time_start) // 时间长度
    			var returnArr = formatData(time_start, timeLen);
    			$.each(returnArr, function(index, value) {
    				_this.find('li[time='+formatHour(value)+']').remove();
    			})
	    	}
	    })
	});
}
// 格式化休息的时间段
function formatData(start, len) {
	var formatArr = [];
	for(var i = 0; i < len; i++) {
		formatArr.push(parseInt(start) + i);
	}
	return formatArr;	
}
// 格式化小时 把0-9变成00-09
function formatHour(h) {
	if (h < 10) {
		h = '0' + h;
	}
	return h;
}