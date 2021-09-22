import 'pgearth/Build/Widgets/widgets.css'
import { FilterNullValue, deepClone, getObjType } from '@/utils/util'

// baseMap ScreenSpaceEventHandler 事件
import ScreenSpaceEventHandler from 'pgearth/Source/Core/ScreenSpaceEventHandler'
import ScreenSpaceEventType from 'pgearth/Source/Core/ScreenSpaceEventType'

// initBaseMap
import SceneView from 'pgearth/PGEarthExtends/views/SceneView'
import EventDrive from 'pgearth/PGEarthExtends/others/EventDrive'

// point
import Graphic from 'pgearth/PGEarthExtends/Graphic'
import GraphicsLayer from 'pgearth/PGEarthExtends/layers/GraphicsLayer'
import Color from 'pgearth/PGEarthExtends/_Color'
import Cartographic from 'pgearth/Source/Core/Cartographic'
import Matrix4 from 'pgearth/Source/Core/Matrix4'
import Cartesian3 from 'pgearth/Source/Core/Cartesian3'
import Cartesian2 from "pgearth/Source/Core/Cartesian2"
import CMath from "pgearth/Source/Core/Math"
import QueryTask from "pgearth/Source/extends/tasks/QueryTask"
import Query from "pgearth/Source/extends/tasks/Query"
import SpatialRelation from "pgearth/Source/extends/tasks/support/SpatialRelation"
// import when from 'pgearth/ThirdParty/when'
// import Color from 'pgearthExtends/_Color'
// import TextSymbol from 'pgearthExtends/symbols/TextSymbol'
// import PopupTemplate from 'pgearthExtends/widgets/PopupTemplate/PopupTemplate'
import when from 'pgearth/Source/ThirdParty/when'
import PicStyleSymbol from 'pgearth/PGEarthExtends/symbols/PicStyleSymbol'
import SimpleMarkerSymbol from 'pgearth/PGEarthExtends/symbols/SimpleMarkerSymbol'
import PictureMarkerSymbol from 'pgearth/PGEarthExtends/symbols/PictureMarkerSymbol'

import PrimitiveSymbol from 'pgearth/PGEarthExtends/symbols/PrimitiveSymbol'
import GeoUtils from 'pgearth/PGEarthExtends/core/GeoUtils'
import TextSymbol from 'pgearth/PGEarthExtends/symbols/TextSymbol'
import HeightReference from 'pgearth/Source/Scene/HeightReference'
import LSPageLOD from 'pgearth/Source/Oblique/PGPageLOD/PGPageLOD'
import SceneMode from 'pgearth/Source/Scene/SceneMode'
import GeoJsonDataSource from 'pgearth/Source/DataSources/GeoJsonDataSource'

import VerticalOrigin from 'pgearth/Source/Scene/VerticalOrigin'
import NearFarScalar from 'pgearth/Source/Core/NearFarScalar'
import ElevationLayerNew from 'pgearth/Source/extends/layers/ElevationLayer'
import WMSLayer from 'pgearth/PGEarthExtends/layers/WMSLayer'
import WMTSLayer from 'pgearth/PGEarthExtends/layers/WMTSLayer'//路网
import SceneLayer from 'pgearth/PGEarthExtends/layers/SceneLayer'
import LodMeshLayer from 'pgearth/PGEarthExtends/layers/LodMeshLayer'//倾斜摄影
import BaseLayerControl from 'pgearth/PGEarthExtends/widgets/BaseLayerControl'
import UnderGround from 'pgearth/Source/extends/widgets/UnderGround'

import { mapIconsType } from './mapConfig'
import { pointAlert } from "./alertOption"

var ranges = [];
var clickDraw = null;
var stopClickDraw = null;
var firstPoint = null; // 记录第一个点，画闭合的线需要将第一点坐标点添加到数组的最后
var myPrimitive;
var clickGetInfo = null;
var myPolygon = null;
var ug = null


export default {
  // 初始化地图组件
  initBaseMap(id, vue) {
    this.vue = vue
    this.viewer = new SceneView({
      container: id,
      baseMap: new WMTSLayer({
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=1d109683f4d84198e37a38c442d68311",
        title: 'tdt',
        tileMatrixSet: 'tdt1',
        id: id
      }),
      scene3DOnly: false,
    })
    window.viewer = this.viewer;
    this.map = this.viewer.map
    this.viewer.map.remove(this.viewer.map.findLayerById('luwang'))
    
    this.wmtsLayer = new WMTSLayer({
      id: 'luwang',
      url: '//t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=1d109683f4d84198e37a38c442d68311',
      title: 'TileMatrix',
      tileMatrixSet: 'default028mm',
    });
    this.map.add(this.wmtsLayer);
    
    setTimeout(()=>{
      this.goView({longitude: 107.789898, latitude: 29.881242, height: 200000 })
    }, 3000)

    new ScreenSpaceEventHandler(this.viewer.canvas)
    .setInputAction(click => {
      const pick = this.viewer.scene.pick(click.position)
      if (pick && pick.id && pick.id.popupTemplate) { // 栽点数据点击事件处理
        pick && pick.id && this.removeGraphics('foucsGraphics')
        pick && pick.id && this.viewer.popupTemplate.closePop()
        pick.id.popupTemplate.actions()
      } else if(pick && pick.id && pick.id.callBack) { // 聚合点击事件处理
        pick.id.callBack()
      }
    }, ScreenSpaceEventType.LEFT_DOWN)

    new ScreenSpaceEventHandler(this.viewer.canvas)
    .setInputAction(click => {
      const pick = this.viewer.scene.pick(click.endPosition)
      if (pick && pick.id && pick.id.popupTemplate) {
        pick.id.popupTemplate.action && pick.id.popupTemplate.actions('textGraphics')
      } else {
        this.removeGraphics('textGraphics')
      }
    }, ScreenSpaceEventType.MOUSE_MOVE)

    new EventDrive({
      viewer: this.viewer,
      eventType: 'MOUSE_MOVE',
      callBack: a => {
        this.mousePosition = a.mapPoint
        const { longitude, latitude, height } = a.mapPoint
        this.vue.coord.lon = `${FilterNullValue(longitude, 4) || '--'}°`
        this.vue.coord.lat = `${FilterNullValue(latitude, 4) || '--'}°`
        this.vue.coord.height = `${FilterNullValue(height, 4) > 0 ? FilterNullValue(height, 4) : false || '--'}m`
      }
    })

    return this
  },

  goView({ longitude, latitude, height = 150000,heading,pitch} = {}) {
    let center = [longitude, latitude, height]
    if(height == 3000) center = [longitude, latitude, height]
    this.viewer && this.viewer.goTo({
      center: center,
      heading: heading||0,
      pitch: pitch || -90,
      roll: 0
    })
  },

  //移除地图点击事件
  remove () {
    this.viewer.scene.globe.depthTestAgainstTerrain = false
    this.move && this.move.destroy()
    this.move = null
    this.rightClick && this.rightClick.destroy()
    this.rightClick = null
    this.symPoint && viewer.map.remove(this.symPoint);
  },

  mouseMove (mold) {//鼠标移动
    this.move && this.move.destroy()
    this.move = null
    this.move = new EventDrive({
      viewer: this.viewer,
      eventType: 'MOUSE_MOVE',
      callBack: a => {
        // const { longitude, latitude, height } = a.mapPoint
        mold['type'] == 'point' ? this.skimSpot(a.mapPoint) : ''
      }
    })
  },

  rightRemove () {
    this.rightClick = new EventDrive({
      viewer: this.viewer,
      eventType: 'right_click',
      callBack: a => {
        this.remove()
      }
    })
  },

  //绘制点
  skimSpot (a) {
    this.symPoint = new PrimitiveSymbol({
      type: 'circle',
      center: [Number(a.longitude), Number(a.latitude)],
      radius: 20,
      color: 'rgba(255,0,0,0.7)',
      class: 'both'
    });
    this.map.add(this.symPoint);
  },

  
  getLonLat(callback){
    this.viewer.scene.globe.depthTestAgainstTerrain = true
    // this.mouseMove({type:'point'});
    this.rightRemove();
    this.lonlat = new EventDrive({
      viewer: this.viewer,
      eventType: 'left_click', // mouse_move,right_click
      callBack: (e) => {
        this.skimSpot(e.mapPoint)
        const { longitude, latitude, height } = e.mapPoint
        callback({ longitude, latitude, height })
        this.lonlat && this.lonlat.destroy()
        this.lonlat = null
      }
    })
  },

  removeGraphics(id) {
    if (FilterNullValue(this.Layers)) {
      let layers = this.Layers
      for (let key in layers) {
        let pointsLayer = layers[key]
        // foucsGraphics
        let foucsGraphics = pointsLayer && pointsLayer.findGraphicById
          && pointsLayer.findGraphicById(id)
        foucsGraphics && pointsLayer.remove(foucsGraphics)
      }
    }
  },
  Layers: {},
  simpleSymbol: {
    color: 'transparent',
    outline: { color: 'transparent', width: 5 },
    size: 28, 
    type: 'simple-marker',
    heightReference: HeightReference.RELATIVE_TO_GROUND,
    verticalOrigin: VerticalOrigin.BOTTOM, // 添加鼠标点击属性后解决栽点下陷问题
    scaleByDistance: new NearFarScalar(130000, 1, 140001, 0.5)
  },
  pictureSymbol: {
    type: 'picture-marker', width: 20, height: 30,
    heightReference: HeightReference.RELATIVE_TO_GROUND,
    verticalOrigin: VerticalOrigin.BOTTOM, // 添加鼠标点击属性后解决栽点下陷问题
    scaleByDistance: new NearFarScalar(40000, 1, 140001, 0.4)
  },

  addLayer(id, isReWrite) {
    // 新建栽点图层
    if (isReWrite) {
      this.removeLayer(id)
      if(id == "monitorLayer"){
        this.removeLayer("deviceLayer")
        this.removeLayer("manholeLayer")
      }else if(id == "deviceLayer"){
        this.removeLayer("monitorLayer")
        this.removeLayer("manholeLayer")
      }else{
        this.removeLayer("monitorLayer")
        this.removeLayer("deviceLayer")
      }
    } else {
      for (let key in this.Layers) {
        if (key === id) {
          console.error('[提示]:您现在栽点失败咯!')
          console.warn(`[提示]:您现在栽点[没有传入或重复]图层名字[${key}]!`)
          return true
        }
      }
    }

    this.Layers[id] = new GraphicsLayer({
      id, viewer: this.viewer
    })

    this.map.add(this.Layers[id])
  },

  removeLayer(id) {
    if (id === undefined) id = 'pointsLayer'
    const layerId = this.map.findLayerById(id)
    layerId && this.map.remove(layerId)
    this.Layers[id] && delete this.Layers[id]
  },

  // 倾斜摄影加载
  async addQxsyLayers({ name = 'photographyLayer', url,
  photographyType = 'LodMesh' } = {}){
    if (this.Layers[name]) {
      this.removeLayer(name)
      return console.warn(`[${name}]重名了, 请重新传入新名称!`)
    }
    
    if (photographyType === 'LodMesh') {
      this.Layers[name] = new LodMeshLayer({ url, id: name })
    } else {
      this.Layers[name] = new SceneLayer({ url, id: name })
    }
    let photographyLayerPromise = new Promise(resolve => {
      this.Layers[name].readyPromise.then(pagelod => resolve(pagelod))
        .otherwise(_ => { delete this.Layers[name]; resolve(null) })
    })
    let isGoNext = await photographyLayerPromise
    if (isGoNext) {
      let destination
      if (photographyType === 'LodMesh') {
        destination = Cartesian3.fromDegrees(
          isGoNext.origin.x, isGoNext.origin.y, isGoNext.origin.z + 2000
        )
      } else {
        this.Layers[name].modelMatrix = Matrix4.fromTranslation(this.ajustHeight(isGoNext.boundingSphere));
        destination = deepClone(isGoNext.boundingSphere.center)
      }
      //加载页面时候添加影响要定位
      this.viewer.camera.flyTo({
        destination, 
        orientation: {  heading: 6.28 }
      })
      this.map.add(this.Layers[name])
    }
  },

  ajustHeight (boundingSphere){
      let heightOffset = -10;
      let cartographic = Cartographic.fromCartesian(boundingSphere.center);
      let surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
      let offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
      let translation = Cartesian3.subtract(offset, surface, new Cartesian3());
      return translation
  },

  removeOrArrayLayers(name) {
    if (this.Layers[name]) {
      this.removeLayer(name)
    } else {
      let layersNameKey = Object.keys(this.Layers)
      let hasLayers = layersNameKey.filter(n => new RegExp(`${name}`).test(n))
      hasLayers.forEach(val => this.removeLayer(val))
    }
  },

  removeQxsyLayers(name) {
    if (getObjType(name) === 'string') {
      this.removeOrArrayLayers(name)
    } else if (getObjType(name) === 'array') {
      name.forEach(one => this.removeOrArrayLayers(one))
    } else {
      console.log(`layers对象内,暂不支持该格式${getObjType(layers[title])}`)
    }
  },

  getMapIcon(actualtype, pointType, state) {
    let typeId = actualtype
    let pointsTypeIcon
    if (this.mapCfgPointsTypeIconKey) {
      pointsTypeIcon = this.mapCfgPointsTypeIconKey
    } else {
      pointsTypeIcon = this.pointsTypeIcon
    }
    let type = "";
    if(pointType == "deviceType"){
      if(mapIconsType[pointType][actualtype]) { 
        type = mapIconsType[pointType][typeId][state]
      }
    }else if(pointType == "manholeType"){
      if(mapIconsType[pointType][actualtype]){
        type = mapIconsType[pointType][actualtype]
      }
    }else{
      type = !pointType && pointType !== 0 && pointType !== '0' ? 'default-value' : !mapIconsType[pointsTypeIcon]
      ? 'default-type' : !mapIconsType[pointType]["monitor"]
      ? 'default-type_value' : mapIconsType[pointType]["monitor"]
    }
    let ownWarn, typeArr = type.split('-'),
      ownWarnArr = {
        'value': '没有传入[标识字段名]!',
        'type': '没有设置[标识字段名]!请到mapsConfig配置[mapIconsType]',
        'type_value': `没有设置[${pointsTypeIcon
          }]对应图片名! 请到mapsConfig配置[${pointsTypeIcon}]`
      }

    if (typeArr[0] === 'default') {
      ownWarn = ownWarnArr[typeArr[1]]
    }

    return new Promise((resovle) => {
      let iconUrl =  type + '.png'
      require(['@/assets/icons/map/' + iconUrl], res => {
        resovle(res)
      }, _ => {
        resovle(require('@/assets/icons/map/blue.png'))
        console.warn(`中文提示: ${ownWarn}`)
      })
    })
  },

  hasSceneLayer() {
    let allLayers = this.viewer.scene.primitives._primitives
    let hasSceneLayer = false

    allLayers.forEach(v => {
      if (v instanceof LSPageLOD) hasSceneLayer = true
    })
    return hasSceneLayer
  },

  formatePointsTypeIcon(pointsTypeIcon) {
    let pointsTypeText
    if (getObjType(pointsTypeIcon) === 'array') {

      if (getObjType(pointsTypeIcon[0]) === 'object') {
        this.mapCfgPointsTypeIconKey = Object.keys(pointsTypeIcon[0])[0]
        this.pointsTypeIcon = pointsTypeIcon[0][this.mapCfgPointsTypeIconKey]
      } else if (getObjType(pointsTypeIcon[0]) === 'array') {
        this.mapCfgPointsTypeIconKey = pointsTypeIcon[0][0]
        this.pointsTypeIcon = pointsTypeIcon[0][1]
      } else { this.pointsTypeIcon = pointsTypeIcon[0] }
      pointsTypeText = pointsTypeIcon[1]

    } else if (getObjType(pointsTypeIcon) === 'object') {

      if (getObjType(pointsTypeIcon.icon) === 'array') {
        this.mapCfgPointsTypeIconKey = pointsTypeIcon.icon[0]
        this.pointsTypeIcon = pointsTypeIcon.icon[1]
      } else if (getObjType(pointsTypeIcon.icon) === 'object') {
        this.mapCfgPointsTypeIconKey = Object.keys(pointsTypeIcon.icon)[0]
        this.pointsTypeIcon = pointsTypeIcon.icon[this.mapCfgPointsTypeIconKey]
      } else {
        this.pointsTypeIcon = pointsTypeIcon.icon
      }

      pointsTypeText = pointsTypeIcon.text

    } else { this.pointsTypeIcon = pointsTypeIcon }
    return pointsTypeText
  },

  // 栽点
  async addPoint(value, graphics, {
    height = 2, //y原值-.4 解决点击不准问题
    symbolType = deepClone(this.simpleSymbol),
    pointsTypeIcon = false,
    hasSceneLayer = false
  } = {}, options) {
    if(value.installLongitude !== undefined) {
      value.longitude = value.installLongitude
      value.latitude = value.installLatitude
    }
    if(value.wellType){
      value.type = value.wellType
    }
    value.longitude /= 1, value.latitude /= 1

    let { longitude, latitude } = value
    if (graphics === 'textGraphics') latitude += this.getMoveLatitude(50)
    const oneHeight = symbolType.type === 'simple-marker' ? height :
      hasSceneLayer ? 35 : 1 //y 原值 35 ： 1 解决点击不准问题
    const geometry = {
      type: 'point', longitude, latitude, height: oneHeight
    }
    let { layerName, action, isOption } = options
    let symbol = deepClone(symbolType)
    if (symbol.type === 'picture-marker') {
      // 栽设备点时，图标小一点
      if(this.pointsTypeIcon == 'deviceType') symbol.width = 30,symbol.height = 30
      symbol.url = await this.getMapIcon(value.type, this.pointsTypeIcon, value.state)
    } else if (symbol.type === 'text') {
      symbol.text = value[pointsTypeIcon || this.pointsTypeIcon]
    }
    
    if( layerName !== 'areaNameLayer'){ // 不是行政区名称栽点
      symbol.scaleByDistance = new NearFarScalar(10000, 1, 131000, 1)
    }
    
    const graphicsConfig = { // 标识点
      id: graphics, geometry, symbol
    }
    if(isOption){
      graphicsConfig.popupEnabled = true
      graphicsConfig.popupTemplate = pointAlert(value,value[options.key])
    }
    if (action) {
      // graphicsConfig.popupEnabled = true
      graphicsConfig.popupTemplate = {
        // ...devAlert(value,value[options.key || 'id']),//更改了PopupTemplate.js代码，注释了原flyTo方法
        actions: (val)=> {
          if(val) return
          this.showFocusPoint(value, options)
        }
        // actions: this.addFocusPoint.bind(this, value, options, true)
      }
    }
    this.removeGraphics('textGraphics')
    this.removeGraphics(graphicsConfig.id)
    let symbolGraphics = new Graphic(graphicsConfig)
    this.Layers[layerName] && this.Layers[layerName].add(symbolGraphics)
    
    if(isOption && !value[options.key]) console.warn(`原错误:${options.key} [中文提示:传入的options中key值无效]`)
    if(isOption) this.viewer.popupTemplate.autoPopOut(value[options.key])
  },

  addLocationPoint(value){
    let nameLayer = 'pointLayer'
    const geometry = {
      type: 'point', longitude:value.longitude, latitude:value.latitude, height: 2
    }
    const symbol = deepClone(this.simpleSymbol)
    const graphicsConfig = { // 标识点
      id: 'foucsGraphics', geometry, symbol
    }

    this.removeGraphics('textGraphics')
    this.removeGraphics(graphicsConfig.id)
    let symbolGraphics = new Graphic(graphicsConfig)
    this.Layers[nameLayer] && this.Layers[nameLayer].add(symbolGraphics)
    this.goView({
      longitude: value.longitude,
      latitude: value.latitude,
      height: 4000 // camera.positionCartographic.height  // 解决定位不拉近
    })
  },

  async showFocusPoint(value, options){
    value.longitude /= 1, value.latitude /= 1
    if(!value.longitude || !value.latitude) return (console.log('当前无正确的经纬度信息！'),window.$message.error('当前无正确的经纬度信息！'))

    if(!value[options.apiKey]) { 
      this.goView({longitude:value.longitude, latitude:value.latitude, height:3000})
      window.showDevInfo(value[options.apiKey])
      return false
    }

    this.addLayer(options.nameLayer, false)

    let resData = options.action && await options.action(value) // -------
    value = {...value, ...resData}

    this.removeGraphics('foucsGraphics')
    this.removeLayer('foucsGraphics')
    // let { action, typeFunc } = options
    let focusOptions = deepClone(options)
    focusOptions.isOption = options.action && true // -------
    delete focusOptions.action
    delete focusOptions.typeFunc
    // if (focusOptions.nameLayer === undefined) {
    //   focusOptions.nameLayer = options.typeFunc !== undefined ?
    //     options.typeFunc : 'pointsLayer'
    // }
    this.addPoint(value, 'foucsGraphics', {
      hasSceneLayer: this.hasSceneLayer()
    }, focusOptions)

    // 贴地的点
    let gra4 = new PrimitiveSymbol({
      id: 'foucsGraphics',
      type: 'circle',
      center: [value.longitude, value.latitude],
      radius: 5,
      color: 'rgba(35, 139, 241,0.7)',
      class: "both"
    });
    this.map.add(gra4);

    this.goView({longitude:value.longitude, latitude:value.latitude, height:500})
  },
  // 图层清理
  clearPlantingPtLayer() {
    if (window.viewer.map.findLayerById("PlantingPtLayer")) {
      window.viewer.map.remove(window.viewer.map.findLayerById("PlantingPtLayer"));
    }
    window.PlantingPtLayer = new GraphicsLayer({
      id: "PlantingPtLayer",
      viewer: window.viewer,
      elevationInfo: "on-the-ground",
    });
    window.viewer.map.add(window.PlantingPtLayer);
    window.viewer.goTo({ center: [107.789898, 29.881242, 200000] });
  },
  // 栽点2
  plantingPt(data, type) {
    switch(type) {
      case 'hiddenDanger':
        for (let i = 0; i < data.length; i++) {
          let url
          switch(data[i].disasterType) {
            case "滑坡":
              url = '/icons/dis-icon/滑坡.png'
              break;
            case "不稳定斜坡":
              url = '/icons/dis-icon/不稳定斜坡.png'
              break;
            case "危岩":
              url = '/icons/dis-icon/危岩.png'
              break;
            case "库岸":
              url = '/icons/dis-icon/库岸.png'
              break
          }
          var pictureSymbol = new PictureMarkerSymbol({
            width: 20,
            height: 20,
            url,
          });
          let point = {
            type: "point",
            longitude: (data[i].longitude)/1,
            latitude: (data[i].latitude)/1,
            height: 100,
          };
          let graphic = new Graphic({
            geometry: point,
            symbol: pictureSymbol,
            id: data[i].disasterId,
          });
          window.PlantingPtLayer.add(graphic);
        }
        break;
      case 'deviceMon':
        for (let i = 0; i < data.length; i++) {
           let url
          switch(data[i].deviceType) {
            case "dlf_001":
              url = '/icons/dis-icon/dlf_001.png'
              break;
            case "bjq_001":
              url = '/icons/dis-icon/bjq_001.png'
              break;
            case "dmqx_001":
              url = '/icons/dis-icon/dmqx_001.png'
              break;
            case "qlf_001":
              url = '/icons/dis-icon/qlf_001.png'
              break
          }
          let point = {
            type: "point",
            longitude: (data[i].reportLongitude)/1,
            latitude: (data[i].reportLatitude)/1,
            height: 100
          }
          var pictureSymbol = new PictureMarkerSymbol({
            width: 20,
            height: 20,
            url,
          });
          let graphic = new Graphic({
            geometry: point,
            symbol: pictureSymbol,
            id: data[i].deviceNumber
          });
          window.PlantingPtLayer.add(graphic);
        }
        break;
      case 'mpadpPerson':
        for (let i = 0; i < data.length; i++) {
          let point = {
            type: "point",
            longitude: (data[i].longitude)/1,
            latitude: (data[i].latitude)/1,
            height: 100
          }
           var pictureSymbol = new PictureMarkerSymbol({
            width: 20,
            height: 20,
            url: '/icons/dis-icon/human.png',
          });
          let graphic = new Graphic({
            geometry: point,
            symbol: pictureSymbol,
            id: data[i].id
          });
          window.PlantingPtLayer.add(graphic);
        }
        break;
    }
  },

  addFocusPoint(value, options, isPoint = true, addPoint) {
    if (addPoint) {
      let focusOptions = deepClone(options)
      delete focusOptions.action
      delete focusOptions.typeFunc
      this.removeGraphics('addPoint')
      this.addPoint(value, 'addPoint', {
          hasSceneLayer: this.hasSceneLayer()
      }, focusOptions)
      this.viewer.popupTemplate = {...devAlert(value)}
      this.viewer.popupTemplate.popOut()
      if(options.change) {
        this.goView({
          longitude: value.reportLongitude,
          latitude: value.reportLatitude,
          height: 3000
        })
      } else {
        this.goView({
          longitude: value.longitude,
          latitude: value.latitude,
          height: 3000
        })
      }
    } else {
      if (isPoint) {
        this.removeGraphics('foucsGraphics')
        let { action, typeFunc } = options
        let focusOptions = deepClone(options)
        delete focusOptions.action
        delete focusOptions.typeFunc
        if (focusOptions.nameLayer === undefined) {
          focusOptions.nameLayer = options.typeFunc !== undefined ?
            options.typeFunc : 'pointsLayer'
        }
        const camera = this.viewer.camera
        this.addPoint(value, 'foucsGraphics', {
          hasSceneLayer: this.hasSceneLayer()
        }, focusOptions)
        console.log(value)
        if(options.change) {
          this.goView({
            longitude: value.reportLongitude,
            latitude: value.reportLatitude,
            height: 3000
          })
        } else {
          this.goView({
            longitude: value.longitude,
            latitude: value.latitude,
            height: 3000
          })
        }
        try {
          if (!typeFunc) {
            console.log('[提示]:没有传入栽点的功能性分类!')
          }
          action({ typeFunc, value })
        } catch (e) {
          console.warn(`原错误:${e}[中文提示:在栽点没有传入您执行popup的方法]`)
          console.warn('[注意]:这样的栽点是没有单点数据返回!')
        } finally {
          console.log('[注意]:栽点时[是否]传入您的方法,影响单点数据返回!')
        }
      }
    }
  },

  addPointLists(pointsList, options = {}) {
    let { pointsTypeIcon, layerName, isReWrite, symbolType, action, typeFunc } = options
    options.layerName = layerName !== undefined ? layerName :
    typeFunc !== undefined ? typeFunc : 'pointsLayer';
    options.isReWrite = isReWrite !== undefined ? isReWrite : true
    options.action = action !== undefined ? action : false
    symbolType = symbolType !== undefined ? symbolType : deepClone(this.pictureSymbol)

    delete options.symbolType

    if (this.addLayer(options.layerName, options.isReWrite)) {
      // return loadinginstace.close()
    }

    options.pointsTypeText = this.formatePointsTypeIcon(pointsTypeIcon)

    let points = []
    let i = 0
    let timer = setInterval(() => {
        points = pointsList.slice(i, i+100)
        i = i + 100
        
        points.forEach((value, index) => {
          if (symbolType.type === 'simple-marker') {
            // 自定义栽点颜色
            // let {colors,pointsTypeIcon:pti} = options
            if(value.warnLevel>0) {
              symbolType.outline = { color: ['rgba(255,0,0,.6)','#ffa500','rgba(255,255,0,.6)','rgba(0,0,255,.6)'][value.warnLevel-1], width: 8 }
            }else{
              symbolType.outline = false
            }
            symbolType.color = options.colors[value[options.pointsTypeIcon]] || symbolType.color //colors[value[pti]] || symbolType.color
            symbolType = {
              ...symbolType,
              heightReference: HeightReference.RELATIVE_TO_GROUND,
              verticalOrigin: VerticalOrigin.BOTTOM, // 添加鼠标点击属性后解决栽点下陷问题
            }
          }else if(symbolType.type == 'primitiveSymbol'){
            symbolType.color = options.colors[value[options.pointsTypeIcon]] || symbolType.color //colors[value[pti]] || symbolType.color
            this.addPointPrimitive(value, options, symbolType, index) //primitiveSymbol 栽点
            return 
          }
          this.addPoint(
            value, `${options.layerName}${i+index}`, {
            symbolType, hasSceneLayer: this.hasSceneLayer(),height: 1
          }, options)
        })

        if(i >= pointsList.length+100) clearInterval(timer)
    }, 500);
  },

  // 启用停用透明度
  enableTrans(viewModel){
    this.viewer.scene.globe.baseColor = new Color('rgba(18, 19, 20, 0.8)');
    var digHeight = 0;
    this.ug = new UnderGround(this.viewer, {
        depth: 1000,
        alpha: viewModel.height
    })
    if(viewModel.changeHeight){
      digHeight = viewModel.height;
      this.ug._updateImageryLayersAlpha(digHeight)
    }
    viewModel.showTrans ? this.ug.activate() : this.ug.disable();
  },

  drawPipeLine(pipeLineUrl, callback){
    let _this = this
    this.goView({longitude: 120.42385918, latitude: 30.11787765, height: 20000 })
    let scene = this.viewer.scene;
    let popHandler = new ScreenSpaceEventHandler(scene.canvas);
    popHandler.setInputAction(function(movement) {
      var pickedObject = scene.pick(movement.position);
      if(pickedObject && pickedObject.id) {
        callback({
          layer: pickedObject.id._Layer,
          name: pickedObject.id._id,
        })
      }
    }, ScreenSpaceEventType.LEFT_CLICK)
    
    this.viewer.scene.globe.depthTestAgainstTerrain = false
    var task = new QueryTask({
			url: pipeLineUrl //'http://221.13.67.194:12022/service/gis/server/qianqingzhen_wushuiguan1'
    });       

		var query = new Query({
			where: "",
			spatialRelation : SpatialRelation.INTERSECTS
		})

		var linesData = task.execute(query);
    linesData.then(function(dataSource){
      var myLine = dataSource.entities.values
      var materialColor = ""
      for (var i = 0;i < myLine.length;i++) {
        var position = myLine[i]._polyline._positions._value
        var lineColor = myLine[i]._properties._Color._value
        var lineLayer = myLine[i]._properties._Layer._value
        var lineWidth = myLine[i]._properties._LineWt._value
        if(lineColor == 3) {
            materialColor = new Color('rgba(5, 206, 79, 1)');
        }else if(lineColor == 30) {
            materialColor = new Color('rgba(201, 101, 27, 1)');
        }
        var greenBox = _this.viewer.entities.add({
          id: myLine[i]._id,
          Layer: lineLayer,
          name : 'gw' + myLine[i]._id,
          polylineVolume : {
              positions : position,
              shape : _this.computeCircle(lineWidth / 10),
              material : materialColor
          }
        });
        _this.map.add(greenBox)
      }
    })
  },

  removePipeLine() {
    this.viewer.entities.removeAll()
  },

  computeCircle(radius) {
    var positions = [];
    for (var i = 0; i < 360; i++) {
        var radians = CMath.toRadians(i);
        positions.push(new Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return positions;
  },

  drawEcologyRedLine(lineUrl, id) {
    let wmsLayer = new WMSLayer({
      url: lineUrl,
      id: id
    });
    this.map.add(wmsLayer)
    this.goView({longitude: 107.789898, latitude: 29.881242, height: 120000 })
  },

  // 应急逃生路线
  drawEscapeLine({name, url}) {
    console.log(name, url)
    let wmsLayer = new WMSLayer({ url: url, id: name });
    this.map.add(wmsLayer)
  }
}