export function pointAlert(data,title) {
    let content = data.alarmTime!==undefined ? monitorInfo(data) : data.wellName !== undefined ? manholeInfo(data) : deviceInfo(data)
    return {
        title,
        content
    }
}

function monitorInfo(data) {
    let name = data.monitorName || '--'
    // 灾害类型
    let location = data.location || '--'
    let longitude = data.longitude || 0
    let latitude = data.latitude || 0
    // 预警状态
    let state = function(){
        var stateList = [];
        var labelList = []
        if(data.type){
            if(data.type.indexOf(",")!==-1){
                stateList = data.type.split(",")
            }else{
                stateList.push(data.type)
            }
        }
        stateList.forEach(item=>{
            switch(item){
                case "1":
                    labelList.push("水位告警")
                    break;
                case "2":
                    labelList.push("气体告警")
                    break;
                case "3":
                    labelList.push("倾斜告警")
                    break;
                case "4":
                    labelList.push("丢失告警")
                    break;
                case "5":
                    labelList.push("破损告警")
                    break;
            }
        })
        return labelList.join(",");
    }
    // 归属组织结构
    let deptName = data.deptName || '--'
    // 巡查人员
    let examiner = data.examiner || '--'
    // 巡查人员电话
    let examinerPhone = data.examinerPhone || '--'
    // 传参
    let monitorid = data.id || ''

    return `
        <div class="aler-pop"></div>
        <div class="dev-alert" v-show="alert_type">
            <div class="dev-title">
                <span>监测点详情</span>
                <i class="el-icon-close" onclick="window.closePop()"></i>
            </div>
            <div class="monitor-title-infor">
                <ul class="dev-title-list">
                    <li>
                        <div class="dev-infor-div">
                            <span>监测点名称：${name}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div">
                            <span>位置：${location}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div">
                            <span>经纬度：${longitude + ',' + latitude}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div">
                            <span>归属组织结构：${deptName}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div">
                            <span>巡查人员：${examiner}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div">
                            <span>联系方式：${examinerPhone}</span>
                        </div>
                    </li>
                </ul>
                <button class="patrol-list" onclick="window.showPatrolInfo('${monitorid}')">巡查记录</button>
            </div>
        </div>
    `
}
/**
 * <div class="dev-title-type">
        <p>告警状态</p>
        <div class="dev-title-typeInfor">
            <li>
                <div class="dev-infor-div" title="${state()}">
                    <span>${state()}</span>
                </div>
            </li>
        </div>
    </div>
 */

function deviceInfo(data) {
    // 设备编号
    let code = data.code || '--'
    // 厂商设备编号
    let name = data.name || '--'
    // mac
    let mac = data.mac || '--'
    // 设备类型
    let monitorId = data.monitorId || '--'
    // 巡查人员
    let examiner = data.examiner || '--'
    // 巡查人员联系方式
    let examinerPhone = data.examinerPhone || '--'
    // gps经纬度
    let gdLatitude = data.gdLatitude
    let gdLongitude = data.gdLongitude
    let longitude = data.longitude || 0
    let latitude = data.latitude || 0
    // 安装地址
    let location = data.location || '--'
    // 行政区划
    let market = data.market || '--'
    // 设备状态
    let devStatus = data.devStatus || '--'
    // 设备厂商
    let factory = data.factory || '--'
    // 电量
    let electric = data.electric || '--'
    // 信号
    let semaphore = data.semaphore || '--'
    // 防务状态
    let equipvalue = data.equipvalue || '--'
    let params1 = data.unifiedCode || data.disNo || ''
    let params2 = data.devName || ''
    let params3 = data.devId || ''
    return `
        <div class="aler-pop"></div>
        <div class="dev-alert" v-show="alert_type">
            <div class="dev-title">
                <span>设备详情</span>
                <i class="el-icon-close" onclick="window.closePop()"></i>
            </div>
            <div class="dev-title-infor">
                <ul class="dev-title-list">
                    <li>
                        <div class="dev-infor-div" title="${code}">
                            <span>设备编号：${code}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${name}">
                            <span>设备名称：${name}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${mac}">
                            <span>MAC地址：${mac}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${monitorId}">
                            <span>归属监测点：${monitorId}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${examiner}">
                            <span>巡查人员：${examiner}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${examinerPhone}">
                            <span>联系方式：${examinerPhone}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="GPS经纬度">
                            <span>GPS经纬度：${gdLongitude + ',' + gdLatitude}</span>
                        </div>
                    </li>
                </ul>
                <ul class="dev-title-list">
                    <li>
                        <div class="dev-infor-div" title="${location}">
                            <span>位置：${location}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="经纬度">
                            <span>设备经纬度：${longitude + ',' + latitude}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="设备厂商">
                            <span>设备厂商：${factory}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="电量">
                            <span>电量：${electric}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="信号">
                            <span>信号：${semaphore}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="防务状态">
                            <span>防务状态：${equipvalue?'已设防':'未设防'}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div">
                            <span>设备状态：${devStatus == 1 ? '<span style="color:red;">离线</span>':'<span style="color:green;">在线</span>'}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    `
}

/**<div class="dev-title-type">
                <div class="dev-title-btn">
                    <span onclick="window.showDevInfo('${params1}','${params2}','${params3}')">详情></span>
                </div>
            </div>
 */ 

function manholeInfo(data) {
    // 标题
    let wellName = data.wellName || '--'
    // 厂商设备编号
    let location = data.location || '--'
    let longitude = data.longitude || 0
    let latitude = data.latitude || 0
    // 归属监测点
    let monitorId = data.monitorId || '--'
    // 归属组织结构
    let deptId = data.deptId || '--'
    // 供应商名称
    let devSupplier = data.devSupplier || '--'
    // 监测点编号
    let disNo = data.disNo || '--'
    // 主管领导
    let governor = data.governor || '--'
    // 行政区划
    let market = data.market || '--'
    // 设备状态
    let devStatus = data.devStatus || '--'

    let wellType = function(){
        if(data.type){
            if(data.type){
                return "普通井盖"
            }else{
                return "液压井盖"
            }
        }
        
    }

    // 传参
    let params1 = data.unifiedCode || data.disNo || ''
    let params2 = data.devName || ''
    let params3 = data.devId || ''
    return `
        <div class="aler-pop"></div>
        <div class="dev-alert" v-show="alert_type">
            <div class="dev-title">
                <span>井盖详情</span>
                <i class="el-icon-close" onclick="window.closePop()"></i>
            </div>
            <div class="dev-title-infor">
                <ul class="dev-title-list">
                    <li>
                        <div class="dev-infor-div" title="${wellName}">
                            <span>井盖名称：${wellName}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${location}">
                            <span>位置：${location}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="经纬度">
                            <span>井盖经纬度：${longitude + ',' + latitude}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${monitorId}">
                            <span>归属监测点：${monitorId}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${deptId}">
                            <span>归属组织结构：${deptId}</span>
                        </div>
                    </li>
                </ul>
                <ul class="dev-title-list">
                    <li>
                        <div class="dev-infor-div" title="${disNo}">
                            <span>巡查人员：${disNo}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${market}">
                            <span>联系方式：${market}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${governor}">
                            <span>主管领导：${governor}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div">
                            <span>设备状态：${devStatus == 1 ? '<span style="color:red;">离线</span>':'<span style="color:green;">在线</span>'}</span>
                        </div>
                    </li>
                    <li>
                        <div class="dev-infor-div" title="${wellType()}">
                            <span>井盖类型：${wellType()}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    `
}

/* <div class="dev-title-type">
    <div class="dev-title-btn">
        <span onclick="window.showDevInfo('${params1}','${params2}','${params3}')">详情></span>
    </div>
</div> */