<?php
	//连接到加载好的数据库中
	require 'config.php';

	$_birthday=$_POST['year'].'-'.$_POST['month'].'-'.$_POST['day'];

	$query="INSERT INTO blog_user (user, pass, ques, ans, email, birthday, ps)
	                  VALUES('{$_POST['user']}',sha1('{$_POST['pass']}'),'{$_POST['ques']}','{$_POST['ans']}','{$_POST['email']}','{$_birthday}','{$_POST['ps']}')";


	 //新增用户
	 mysql_query($query)or die('新增失败'.mysql_error());

	 //影响了几行数据,返回到js数据
	 sleep(3);
	 echo mysql_affected_rows();

	 //关闭数据库
	 mysql_close();
	
?>