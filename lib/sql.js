var query = require('sqlquery-tool');
//mysql 数据库链接配置
query.query({
  host : '127.0.0.1',
  port : '3306',
  user : 'root',
  password : 'root',
  database : 'citys'
});
//表清空
const drop1 = `drop table if exists province;`,
	  drop2 = `drop table if exists city;`,
	  drop3 = `drop table if exists area;`,
	  drop4 = `drop table if exists street;`,
	  drop5 = `drop table if exists village;`;
//创建表
const province = 
	`
	create table province (
		code varchar(50) ,
		name varchar(100)
	)
	`,
	city = 
	`
	create table city (
		code varchar(50),
		name varchar(100),
		pcode varchar(50)
	)
	`,
	area = 
	`
	create table area (
		code varchar(50),
		name varchar(100),
		ccode varchar(50),
		pcode varchar(50)
	)
	`,
	
	street = 
	`
	create table street (
		code varchar(50),
		name varchar(100),
		acode varchar(50),
		ccode varchar(50),
		pcode varchar(50)
	)
	`,
	village = 
	`
	create table village (
		code varchar(50),
		name varchar(100),
		scode varchar(50),
		acode varchar(50),
		ccode varchar(50),
		pcode varchar(50)
	)
	`;

module.exports.init = async ()=>{
	await query.query({sql : drop1,params : []})
	.then(()=>{
		return query.query({sql : drop2,params : []})
	})
	.then(()=>{
		return query.query({sql : drop3,params : []})
	})
	.then(()=>{
		return query.query({sql : drop4,params : []})
	})
	.then(()=>{
		return query.query({sql : drop5,params : []})
	})
	.then(()=>{
		return query.query({sql : province,params : []})
	})
	.then(()=>{
		return query.query({sql : city,params : []})
	})
	.then(()=>{
		return query.query({sql : area,params : []})
	})
	.then(()=>{
		return query.query({sql : street,params : []})
	})
	.then(()=>{
		return query.query({sql : village,params : []})
	})
}
