var zIndex = 1;    //点击拖拽的时候 让拖拽的永远在最上层。
var container = document.getElementById('container');
var input = document.querySelector('input');
var paperWidth = 170;
var paperHeight = 170;
var vWidth = document.documentElement.clientWidth;
var vHeight = document.documentElement.clientHeight;
console.log(container)
//利用事件委托
window.onmousedown = function (e) {
    var div = getMoveDiv(e.target)
    if (!div) {
        return;
    }
    div.style.zIndex = zIndex;
    zIndex++;
    var style = getComputedStyle(div);
    var divLeft = parseFloat(style.left);
    var divTop = parseFloat(style.top)
    // var divLeft = parseFloat(div.offsetLeft);
    // var divTop = parseFloat(div.offsetTop);
    var pageX = e.pageX;
    var pageY = e.pageY;
    window.onmousemove = function (e) {
        var divX = e.pageX - pageX;
        var divY = e.pageY - pageY;
        var newLeft = divLeft + divX;
        var newTop = divTop + divY;
        if (newLeft < 0) {
            newLeft = 0;
        }
        if (newLeft > document.documentElement.clientWidth - paperWidth) {
            newLeft = document.documentElement.clientWidth - paperWidth;
        }
        if (newTop < 0) {
            newTop = 0;
        }
        if (newTop > document.documentElement.clientHeight - paperHeight - 80) {
            newTop = document.documentElement.clientHeight - paperHeight - 80;
        }
        //有坑，movementX  会在屏幕分辨率大或者小的时候，获取的值会有偏移差。
        // divLeft += e.movementX;
        // divTop += e.movementY;
        div.style.left = newLeft + 'px';
        div.style.top = newTop + 'px';
    }
    window.onmouseup = window.onmouseleave = function () {
        window.onmousemove = null;
    }
}
//实现关闭功能
window.onclick = function (e) {
    if (e.target.parentElement && e.target.parentElement.className === "paper" && e.target.tagName === "SPAN") {
        console.dir(e.target.parentElement)
        container.removeChild(e.target.parentElement)
    }
}
/**
 * 写一个函数帮我们获取到div
 */
function getMoveDiv(dom) {
    if (dom.className === 'paper') {
        return dom;
    }
    else if (dom.parentElement && dom.parentElement.className === "paper" && dom.tagName === "P") {
        return dom.parentElement;
    }
}
/**
 * 创建一个愿望
 * @param {} wish
 */

function createWish(words) {
    var div = document.createElement('div');
    div.className = 'paper';
    div.innerHTML = `<p>${words}</p><span>X</span>`;
    //设置颜色
    div.style.background = `rgba(${getRandom(100, 200)},${getRandom(100, 200)},${getRandom(100, 200)})`;
    //设置位置
    var maxLeft = document.documentElement.clientWidth - paperWidth;
    var maxTop = document.documentElement.clientHeight - paperHeight - 80;
    div.style.left = getRandom(0, maxLeft) + 'px';
    div.style.top = getRandom(0, maxTop) + 'px';
    container.appendChild(div);
    //写一个随机函数帮助我们每次生成的颜色不一样。

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min)
    }
}
//初始化页面愿望
function createInitpaper() {
    var arr = ['伊诺快乐', '丁赫高兴'];
    arr.forEach(function (item, i) {
        createWish(item)
    })
}

//input输入愿望
input.onkeypress = function (e) {
    if (e.key === "Enter") {
        if (this.value) {
            createWish(this.value);
            this.value = "";
        }
    }
}
//窗口的大小使愿望标签不跑出视口。
window.onresize = function () {
    //重新调整所有的div.paper的位置
    var disX = document.documentElement.clientWidth - vWidth;  //让新的视口宽度 -老的视口宽度
    var disY = document.documentElement.clientHeight - vHeight;
    console.log(disX, ':', vWidth, disY, ':', vHeight)

    for (var i = 0; i < this.container.children.length; i++) {
        var paper = container.children[i];
        //改变Left的值；
        var left = parseFloat(paper.style.left)  //获取paper上面的原来left值
        var right = vWidth - paperWidth - left;   //计算新的right值
        var newLeft = left + left / (left + right) * disX;
        paper.style.left = newLeft + 'px';
        //改变top的值
        var top = parseFloat(paper.style.top)
        var bottom = vHeight - paperHeight - top;
        var newtop = top + top / (top + bottom) * disY;
        paper.style.top = newtop + 'px';

    }
    vWidth = document.documentElement.clientWidth;
    vHeight = document.documentElement.clientHeight;
}
createInitpaper();