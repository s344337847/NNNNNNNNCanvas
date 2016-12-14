var w, h, cvs, ctx, cvsH, cvsW, input1;
var viewList = [];
var cricles = [];
var priority = 0;
var overlying_List = [];
var Selected_Scale_R = 5; //控制点半劲
var LT = {
    x: 30,
    y: 30
};

window.onload = function() {
    init();
};

// 实例化画板
function init() {
    w = screen.width;
    h = screen.height - 250;
    cvs = document.getElementById("canvas");
    cvs.setAttribute("width", w);
    cvs.setAttribute("height", h);
    ctx = cvs.getContext("2d");
    cvsH = cvs.height;
    cvsW = cvs.width;
    input1 = document.getElementById("upload");
    addImage();
    drawBackground();
    //cvs.addEventListener("mousedown", down, false);
    // cvs.addEventListener("mousemove", moving, false);
    // cvs.addEventListener("mouseup", endMove, false);
    // cvs.addEventListener("mouseout", endMove, false);
}


// 绘制背景
function drawBackground() {
    ctx.beginPath();
    ctx.rect(w / 3, 0, 300, h);
    ctx.stroke();
}

function mousedown() {
    event.preventDefault();
    isDown = true;
    var loc = getEvtLoc(); //获取鼠标事件在屏幕坐标系的位置（原点在canvas标签左上角）
    var x = loc.x,
        y = loc.y;
    var cLoc = convertCoor(loc);
    var Xc = cLoc.x,
        Yc = cLoc.y;

}

function getEvtLoc() { //获取相对canvas标签左上角的鼠标事件坐标
    return {
        x: event.offsetX,
        y: event.offsetY
    };
}

function convertCoor(P) { //坐标变换 屏幕坐标系的点 转换为canvas坐标系的点
    var x = P.x - PO.x; //在屏幕坐标系中，P点相对canvas坐标系原点PO的偏移
    var y = P.y - PO.y;
    return {
        x: x,
        y: y
    };
}

// 添加图片 图片分为本地，和网络，目前只测试本地
function addImage() {
    if (typeof FileReader === 'undefined') {　　
        alert("抱歉，你的浏览器不支持 FileReader");　　
        input1.setAttribute('disabled', 'disabled');
    } else {
        input1.addEventListener('change', readFile, false);　　
    }
}

function readFile() {　　
    var file = this.files[0]; //获取上传文件列表中第一个文件　
    if (!/image\/\w+/.test(file.type)) {　　 //图片文件的type值为image/png或image/jpg　　
        alert("文件必须为图片！");　　
        return false; //结束进程  　　
    }　　　
    var reader = new FileReader(); //实例一个文件对象  　　
    reader.readAsDataURL(file); //把上传的文件转换成url //当文件读取成功便可以调取上传的接口
    reader.onload = function(e) {　
        var　 img = new Image();　　　
        img.src = this.result;　　　　 // 绑定load事件，加载完成后执行，避免同步问题
        img.onload = function() {
            var temp_imgH, temp_imgW;
            if (img.height < img.width) {
                temp_imgH = 200 * (img.height / img.width);
                temp_imgW = 200;
            } else if (img.height > img.width) {
                temp_imgH = 200;
                temp_imgW = 200 * (img.width / img.height);
            } else {
                temp_imgH = 200;
                temp_imgW = 200;
            }　　　　　　　　　　
            // 获取到图片　
            var Soimg = new SoImageView(img, temp_imgW, temp_imgH, (viewList.length + 1));
            Soimg.setOnTouchListener(cvs, Soimg);
            viewList.push(Soimg);
            drawAll();
        };　　　　
    };
}

function drawAll() {
    ctx.clearRect(-cvsW, -cvsH, 2 * cvsW, 2 * cvsH);
    drawBackground();
    for (var i = 0; i < viewList.length; i++) {
        viewList[i].draw();
    }
}
