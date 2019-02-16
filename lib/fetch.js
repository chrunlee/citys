const sql = require('./sql')
const worker = require('./worker')

async function main () {
  await sql.init();
  await worker.fetchVillages()
  await worker.patch()
  console.log('[100%] 数据抓取完成！')
}

main().then(() => process.exit(0)).catch(e => {
  console.log(e)
  process.exit(-1)
})
