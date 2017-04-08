<?php
	// 连接数据库共能
	header('Content-type:text/html;charset=utf-8');

	// 设置数据库的参数
	define('DB_HOST', 'localhost');
	define('DB_USER','root');
	define('DB_PWD','412552347a');
	define('DB_NAME','blog');

	// 连接mysql数据库
	$conn=@mysql_connect(DB_HOST,DB_USER,DB_PWD)or die('数据库连接失败：'.mysql_error());

	// 选择制定数据库，设置字符集
	@mysql_select_db(DB_NAME) or die('数据库错误：'.mysql_error());
	@mysql_query('SET NAMES UTF8') or die('字符集错误'.mysql_error());
?>