const crawler = require('./crawler')
console.log('enter data fetch')
var sqlquery = require('sqlquery-tool');


/**
 * 抓取所有省级数据
 * @author   https://github.com/modood
 * @datetime 2018-01-31 22:11
 */
exports.fetchProvinces = async () => {
  console.log('[1/1]正在抓取省级数据...')
  const o = await crawler.fetchProvinces()
  const rows = []
  for (const code in o) {
    const name = o[code]
    rows.push({ code, name })
  }
  await sqlquery.search('province').insert(rows);
}

/**
 * 抓取所有地级数据
 * @author   https://github.com/modood
 * @datetime 2018-01-31 22:13
 */
exports.fetchCities = async () => {
  await exports.fetchProvinces()

  const list = await sqlquery.search('province').list();
  const count = list.length;
  const rows = [];
  for(var i=0;i<list.length;i++){
    var p = list[i];
    console.log(`[${i+1}/${count}]正在抓取地级数据，当前省级：${p.code} ${p.name}`)
    const o = await crawler.fetchCities(p.code)
    for (const code in o) {
      const name = o[code]
      rows.push({ code, name, pcode : p.code })
    }
  }
  await sqlquery.search('city').insert(rows);
}

/**
 * 获取所有县级数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 09:12
 */
exports.fetchAreas = async () => {
  await exports.fetchCities()

  const list = await sqlquery.search('city').list();
  const count = list.length;
  
  for(let i=0;i<count;i++){
    const rows = [];
    var data = list[i];
    console.log(`[${i+1}/${count}]正在抓取县级数据，当前地级：${data.code} ${data.name}`)
    if (['4420', '4419', '4604'].includes(data.code)) continue
    const o = await crawler.fetchAreas(data.code)
    for (const code in o) {
      const name = o[code]
      rows.push({ code, name, ccode : data.code, pcode : data.pcode })
    }
    if(rows.length > 0){
      await sqlquery.search('area').insert(rows);
    }
  }

  // 特殊处理：广东省中山市（3320）、广东省东莞市（4419）、海南省儋州市（4604）没有县级，
  // 需要手动插入。
  var area2  = [
    { code: '441900', name: '东莞市', ccode: '4419', pcode: '44' },
    { code: '442000', name: '中山市', ccode: '4420', pcode: '44' },
    { code: '460400', name: '儋州市', ccode: '4604', pcode: '46' }
  ];
  await sqlquery.search('area').insert(area2);
  await sqlquery.search('area').where({code : '620201'}).update({name : '嘉峪关市'});
}

/**
 * 获取所有乡级数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 09:28
 */
exports.fetchStreets = async () => {
  await exports.fetchAreas();

  const list = await sqlquery.search('area').list();
  const count = list.length;
  for(let i=0;i<count;i++){
    const rows = [];
    var data = list[i],areaName = data.name,areaCode = data.code,cityCode = data.ccode,provinceCode = data.pcode;
    console.log(`[${i+1}/${count}]正在抓取乡级数据，当前县级：${areaCode} ${areaName}`)
    if ((areaName === '市辖区' && !['620201', '460201'].includes(areaCode)) || ['350527'].includes(areaCode)) continue
    let route
    if (['4420', '4419', '4604'].includes(cityCode)) route = `${provinceCode}/${cityCode}`

    const o = await crawler.fetchStreets(areaCode, route)
    for (const code in o) {
      const name = o[code]
      rows.push({ code, name, acode : areaCode, ccode : cityCode, pcode : provinceCode })
    }
    if(rows.length > 0){
      await sqlquery.search('street').insert(rows);
    }
  }

}

/**
 * 抓取所有村级数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 09:47
 */
exports.fetchVillages = async () => {
  await exports.fetchStreets()
  const list = await sqlquery.search('street').list();
  const count = list.length;
  for(let i=0;i<count;i++){
    const rows = [];
    var data = list[i],streetCode = data.code,streetName = data.name,cityCode = data.ccode,provinceCode = data.pcode,areaCode = data.acode;

    console.log(`[${i+1}/${count}]正在抓取村级数据，当前乡级：${streetCode} ${streetName}`)
    let route
    const cCodeSuffix = cityCode.substr(2, 2)
    if (['4420', '4419', '4604'].includes(cityCode)) route = `${provinceCode}/${cCodeSuffix}/${streetCode}`

    const o = await crawler.fetchVillages(streetCode, route)
    for (const code in o) {
      const name = o[code]
      rows.push({ code, name, scode : streetCode, acode : areaCode, ccode : cityCode, pcode : provinceCode })
    }
    if(rows.length > 0){
      await sqlquery.search('village').insert(rows);
    }
  }

}

/**
 * 补漏
 * @author   https://github.com/modood
 * @datetime 2018-02-02 13:39
 */
exports.patch = async () => {
  // 特殊处理：福建省泉州市金门县（350527）没有乡级导致没有匹配上爬取县级的正则表达式。
  // 手动插入县级、乡级、村级
  const areas = [
    { code: '350527', name: '金门县', ccode: '3505', pcode: '35' }
  ]
  const streets = [
    { code: '350527000', name: '金门县', acode: '350527', ccode: '3505', pcode: '35' }
  ]
  const villages = [
    { code: '350527000000', name: '金门县', scode: '350527000', acode: '350527', ccode: '3505', pcode: '35' }
  ]
  await sqlquery.search('area').insert(areas);
  await sqlquery.search('street').insert(streets);
  await sqlquery.search('village').insert(villages);
}
