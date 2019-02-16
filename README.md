# citys
国家统计局中国行政区划数据抓取-mysql简化版本，源代码来自 https://github.com/modood/Administrative-divisions-of-China

# 说明
代码基本来自与https://github.com/modood/Administrative-divisions-of-China， 由于本身存储数据库为sqllite,这里把数据存储部分更改为mysql。

# 运行

安装
```
npm i
```

修改数据库链接
```
/lib/sql.js 
```

执行抓取
```
npm run fetch
```

# 查看结果
由于数据库设计比较简单，关联关系都没有增加，目前在存储的时候也没有做唯一性校验，所以抓取时候请注意，第二次请清空数据再执行。

# 其他
如果想要抓取其他年份的数据，则可以在`crawler.js`文件中`path`中修改对应的年度。