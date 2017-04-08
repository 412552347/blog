-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2017-03-20 04:15:22
-- 服务器版本： 5.7.15-log
-- PHP Version: 5.6.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blog`
--

-- --------------------------------------------------------

--
-- 表的结构 `blog_blog`
--

CREATE TABLE `blog_blog` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `blog_blog`
--

INSERT INTO `blog_blog` (`id`, `title`, `content`, `date`) VALUES
(2, '文章1 ', '这是一篇文章，没有什么意义', '2017-03-11 21:07:25'),
(3, '文章2', '这还是一篇文章，没有什么意义', '2017-03-11 21:08:59'),
(4, '文章3', '这依然是一篇文章，哦哈哈哈', '2017-03-11 21:11:10'),
(5, '文章4', '试试能不能刷新呢', '2017-03-12 19:37:42'),
(6, '文章5', '这次一定会好使，哦哈哈哈', '2017-03-12 19:41:37'),
(7, '文章不知道第几个', '哦哈哈哈', '2017-03-12 19:46:31');

-- --------------------------------------------------------

--
-- 表的结构 `blog_user`
--

CREATE TABLE `blog_user` (
  `id` mediumint(8) NOT NULL,
  `user` varchar(20) NOT NULL,
  `pass` char(40) NOT NULL,
  `ques` varchar(200) NOT NULL,
  `ans` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `birthday` date NOT NULL,
  `ps` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `blog_user`
--

INSERT INTO `blog_user` (`id`, `user`, `pass`, `ques`, `ans`, `email`, `birthday`, `ps`) VALUES
(3, 'xiao', '4be30d9814c6d4e9800e0d2ea9ec9fb00efa887b', '1', 'asdf', '412552347@qq.com', '1967-02-17', 'good'),
(4, 'ming', '4be30d9814c6d4e9800e0d2ea9ec9fb00efa887b', '1', '666', 'yc5@163.com', '1967-02-17', 'nice'),
(5, 'wang', '4be30d9814c6d4e9800e0d2ea9ec9fb00efa887b', '1', 'baid', 'asdfg@qq.com', '1968-01-17', 'sdfg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blog_blog`
--
ALTER TABLE `blog_blog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_user`
--
ALTER TABLE `blog_user`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `blog_blog`
--
ALTER TABLE `blog_blog`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- 使用表AUTO_INCREMENT `blog_user`
--
ALTER TABLE `blog_user`
  MODIFY `id` mediumint(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
