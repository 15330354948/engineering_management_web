
export const mapIconsType = {
  monitorType: {
    '气体告警': 'gas',
    '丢失告警': 'lose',
    '倾斜告警': 'tilt',
    '水位告警': 'water',
    '破损告警': 'torn',
    '正常': 'blue'
  },
  deviceType: {
    "1": {
      "0": 'tilt-unusual',
      "1": 'tilt-off-line',
      "2": 'tilt-unusual',
      "3": 'tilt-on-line',
    },
    "2": {
      "0": 'water-unusual',
      "1": 'water-off-line',
      "2": 'water-unusual',
      "3": 'water-on-line',
    },
    "3": {
      "0": 'gas-unusual',
      "1": 'gas-off-line',
      "2": 'gas-unusual',
      "3": 'gas-on-line',
    },
    "4": {
      "0": 'light-unusual',
      "1": 'light-off-line',
      "2": 'light-unusual',
      "3": 'light-on-line',
    },
    "5": {
      "0": 'gps-unusual',
      "1": 'gps-off-line',
      "2": 'gps-unusual',
      "3": 'gps-on-line',
    }   
  },
  
  sensorType: {
    "倾斜计": "tilt-on-line",
    "水位计": "water-on-line",
    "气体传感器": "gas-on-line",
    "光线传感感": "light-on-line",
    "GPS": "gps-on-line",
  },
  manholeType: {
    "1": "manhole",
    "2": "manhole",
  },
  hiddenDanger: {
    "滑坡": "滑坡",
    "库岸": "库岸",
    "不稳定斜坡": "不稳定斜坡",
    "危岩": "危岩"
  },
  deviceMon: {
    "dlf_001": "dlf_001",
    "dmqx_001": "dmqx_001",
    "qlf_001": "qlf_001",
    "bjq_001": "bjq_001"
  },
  mpadpPerson: {
    "human": "群测群防人员"
  }
}
