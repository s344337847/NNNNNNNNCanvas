function SoImageView(img, imgw, imgh, priority) {
    this.img = img;
    this.w = imgw;
    this.h = imgh;
    this.x = (w - imgw) / 2;
    this.y = (h - imgh) / 2;
    this.scale = 1;
    this.type = 0;
    this.priority = priority; // 移动或者缩放的优先权，保证图片同一时间只能有一个进行移动和缩放
    this.isshowScale = false;
    this.temp_imgW = imgw; // 图片缩放时存放临时宽高
    this.temp_imgH = imgh;
    this.scaleAble = false;
    this.scaletype = -1;
    this.moveAble = false;
    this.cricles = new Array();
}
SoImageView.prototype.draw = function() {
    ctx.clearRect(-cvsW, -cvsH, 2 * cvsW, 2 * cvsH);
    drawBackground();
    for (var i = 0; i < viewList.length; i++) {
        if (viewList[i].type === 0) {
            if (viewList[i].isshowScale) {
                initCricle(viewList[i].x, viewList[i].y, viewList[i].w, viewList[i].h, this);
                for (var j = 0; j < this.cricles.length; j++) {
                    var k = j + 1;
                    if (j == this.cricles.length - 1)
                        k = 0;
                    drawLine(this.cricles[j].x, this.cricles[j].y, this.cricles[k].x, this.cricles[k].y);
                    drwaCircle(this.cricles[j].x, this.cricles[j].y, this.cricles[j].r);
                }
            }
            viewList[i].w = viewList[i].temp_imgW * viewList[i].scale;
            viewList[i].h = viewList[i].temp_imgH * viewList[i].scale;
            ctx.beginPath();
            ctx.drawImage(viewList[i].img, 0, 0, viewList[i].img.width, viewList[i].img.height, viewList[i].x, viewList[i].y, viewList[i].w, viewList[i].h);
            ctx.stroke();
        }
    }
};

// 生成控制大小的点
function initCricle(x, y, w, h, img) {
    var cricle_x_list = [x - Selected_Scale_R,
        x + w / 2,
        x + w + Selected_Scale_R,
        x + w + Selected_Scale_R,
        x + w + Selected_Scale_R,
        x + w / 2, x - Selected_Scale_R, x - Selected_Scale_R
    ];
    var cricle_y_list = [y - Selected_Scale_R, y - Selected_Scale_R, y - Selected_Scale_R,
        y + h / 2,
        y + h + Selected_Scale_R,
        y + h + Selected_Scale_R,
        y + h + Selected_Scale_R, y + h / 2
    ];
    img.cricles = [];
    for (var i = 0; i < cricle_x_list.length; i++) {
        var circle = new Circle(cricle_x_list[i], cricle_y_list[i], Selected_Scale_R, i);
        img.cricles.push(circle);
    }
    cricle_x_list = [];
    cricle_Y_list = [];
}

function Circle(x, y, r, type) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
}

function drwaCircle(centetx, centety) {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(centetx, centety, Selected_Scale_R, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ff0000";
    ctx.stroke();

}

function drawLine(mx, my, tox, toy) {
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = "#ff0000";
    ctx.stroke();
}

// 绘制背景
function drawBackground() {
    ctx.beginPath();
    ctx.rect(w / 3, 0, 300, h);
    ctx.stroke();
}

SoImageView.prototype.setOnTouchListener = function(canvas, Soimg) {
    canvas.addEventListener("mousedown", down, false);
    canvas.addEventListener("mousemove", moving, false);
    canvas.addEventListener("mouseup", endup, false);
    canvas.addEventListener("mouseout", endup, false);

    var beginX, beginY;
    var isDown = false;

    function down() {
        event.preventDefault();
        var loc = getEvtLoc(); //获取鼠标事件在屏幕坐标系的位置（原点在canvas标签左上角）
        var x1 = loc.x,
            y1 = loc.y;
        isDown = true;
        Soimg.moveAble = imgIsDown(x1, y1);
        beginX = x1;
        beginY = y1;
        // 判断点击了哪一个点
        Soimg.scaletype = ScaleIsDown(x1, y1);
        switch (Soimg.scaletype) {
            case -1:
                Soimg.scaleAble = false;
                break;
            case 0:
                Soimg.scaleAble = true;
                cvs.style.cursor = "se-resize";
                break;
            case 2:
                Soimg.scaleAble = true;
                cvs.style.cursor = "sw-resize";
                break;
            case 4:
                Soimg.scaleAble = true;
                cvs.style.cursor = "nw-resize";
                break;
            case 6:
                Soimg.scaleAble = true;
                cvs.style.cursor = "ne-resize";
                break;
        }

        if (Soimg.moveAble) {
            overlying_List.push(Soimg);

            if (overlying_List.length >= 2) {
                for (var i = 0; i < overlying_List.length - 1; i++) {
                    overlying_List[i].moveAble = false;
                }
            }
            cvs.style.cursor = "move";
            Soimg.isshowScale = true;
        } else if (!Soimg.scaleAble) {
            Soimg.isshowScale = false;
        }
        Soimg.draw();
    }

    function moving() {
        event.preventDefault();
        if (isDown === false) return;
        var loc = getEvtLoc();
        var x = loc.x,
            y = loc.y;
        var dx = x - beginX,
            dy = y - beginY;
        if (Soimg.moveAble) {
            Soimg.x += dx;
            Soimg.y += dy;
            Soimg.draw();
            Soimg.x = Soimg.x;
            Soimg.y = Soimg.y;
            beginX = x;
            beginY = y; //记录移动后鼠标在屏幕坐标系的新位置
        } else if (Soimg.scaleAble) {
            if (Soimg.scaletype == 2 || Soimg.scaletype == 4) {
                if (dx >= 0) {
                    Soimg.scale = (Soimg.temp_imgW + Math.abs(dx) * 2) / Soimg.temp_imgW;
                } else {
                    Soimg.scale = (Soimg.temp_imgW - Math.abs(dx) * 2) / Soimg.temp_imgW;
                }
            } else if (Soimg.scaletype === 0 || Soimg.scaletype === 6) {
                if (dx >= 0) {
                    Soimg.scale = (Soimg.temp_imgW - Math.abs(dx) * 2) / Soimg.temp_imgW;
                } else {
                    Soimg.scale = (Soimg.temp_imgW + Math.abs(dx) * 2) / Soimg.temp_imgW;
                }
            }
            Soimg.draw();
        }
    }

    function endup() {
        event.preventDefault();
        isDown = false;
        overlying_List = [];
        if (Soimg.scaleAble) {
            Soimg.temp_imgW = Soimg.w;
            Soimg.temp_imgH = Soimg.h;
            Soimg.scale = 1;
        }
        Soimg.moveAble = Soimg.scaleAble = false;
        cvs.style.cursor = "auto";
    }

    function imgIsDown(x, y) {
        return (x >= Soimg.x && x <= Soimg.x + Soimg.temp_imgW && y >= Soimg.y && y <= Soimg.y + Soimg.temp_imgH);
    }

    function ScaleIsDown(x, y) {
        for (var i = 0; i < Soimg.cricles.length; i++) {
            var bool = getPointDistance({
                x: x,
                y: y
            }, {
                x: Soimg.cricles[i].x,
                y: Soimg.cricles[i].y
            }) <= Selected_Scale_R;
            if (bool)
                return i;
        }
        return -1;
    }
    //获取两点距离
    function getPointDistance(a, b) {
        var x1 = a.x,
            y1 = a.y,
            x2 = b.x,
            y2 = b.y;
        var dd = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        return dd;
    }
};
