# HtmlDiff
Html文本比对实现，基于google的[diff_match_patch](https://github.com/google/diff-match-patch)

[尝试一下：https://npcdw.github.io/HtmlDiff/](https://npcdw.github.io/HtmlDiff/)

HtmlDiff支持还原成两个原始的html，并添加标记，支持添加到忽略列表的标签不进行对比

支持生成一个html（不推荐，因为格式可能会错乱，例如两个结构不同的表格对比）

效果图如下：
![image](https://user-images.githubusercontent.com/32638459/131209241-9f992de8-d196-452b-a02e-e960d1ba1445.png)

对比原理：
1. 获取到两个节点下的HTML文本
2. 去掉所有的html标签，只对比内容
3. 使用google的算法对比完成后，返回的结果是这样的：`[{"0": 0,"1": "Hamlet: Do you see "},{"0": -1,"1": "yonder cloud"},{"0": 1,"1": "the cloud over there"}]`
4. 分别还原成最初的HTML文本并添加标记

还原成HTML文本的过程大致是

拿到原始的html文本，遍历文本，拿到一块标签和一块文本（如果开头是文本，则只拿文本），比如拿到`</span><div><p>这是一块文本，，，`

然后，将标签直接放到需要向用户展示的html中，将文字与对比结果进行对比，比如拿到的文本是`Hamlet: Do you see yonder `，对比的是上面给的例子

`Hamlet: Do you see yonder `与数组的第一段`Hamlet: Do you see `对比，文本包含数组第一段，将数组第一段的内容加入到向用户展示的html中，删除数组第一段内容，删除文本中与数组第一段相同的内容

再将文本`yonder `与数组第二段`yonder cloud`对比，数组第二段包含文本，则将文本加入到向用户展示的html中，删掉文本，删掉数组第二段与文本相同的内容

再拿到一块标签和一块文本，循环，直到原始文本或数组被清空
