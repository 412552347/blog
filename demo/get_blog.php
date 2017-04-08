<?php
	//连接到加载好的数据库中
	require 'config.php';

	$query=mysql_query("SELECT title,content,date FROM blog_blog ORDER BY date DESC LIMIT 0,3") or die("SQL错误!");

	//php的数组格式传到js里面无法使用，只能转化成两者都通用的字符串或者json
	$json='';
	//打开获取的数据
	while(!!$row=mysql_fetch_array($query,MYSQL_ASSOC)){
		$json .= json_encode($row).',';
	}
	sleep(3);
	echo '['.substr($json,0,strlen($json)-1).']';
	//关闭数据库
	mysql_close();
	
?>