<?php
	//连接到加载好的数据库中
	require 'config.php';


	$query="INSERT INTO blog_blog (title,content,date)
	                  VALUES('{$_POST['title']}','{$_POST['content']}',NOW())";


	 //新增用户
	 mysql_query($query)or die('新增失败'.mysql_error());

	 //影响了几行数据,返回到js数据
	 sleep(3);
	 echo mysql_affected_rows();

	 //关闭数据库
	 mysql_close();
	
?>