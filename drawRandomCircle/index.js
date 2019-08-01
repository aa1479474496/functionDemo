/***
 * mockDatas: 
 *    value 显示的文字
 *    size: big / medium / small  三种尺寸半径  big: 36   medium: 26  small: 18
 *    emotion:  1 / 2  显示的背景色不一样  
 *      datas后台返回24条数据 1600以上的屏幕取24条, 1600以下的取前18条,  三等分 各为大 中 小
 * 
 */
let mockDatas = [
    { value: '商办交易1' },
    { value: '商办交易2' },
    { value: '商办交易3' },
    { value: '商办4' },
    { value: '商办交易5' },
    { value: '商办交易6' },
    { value: '商办交易7' },
    { value: '楼市8' },
    { value: '商办交易9' },
    { value: '楼市10' },
    { value: '商办交易11' },
    { value: '楼市12' },
    { value: '交易13' },
    { value: '交易14' },
    { value: '交易15' },
    { value: '交易16' },
    { value: '交易17' },
    { value: '交易18' },
    { value: '交易19' },
    { value: '交易20' },
    { value: '交易21' },
    { value: '交易22' },
    { value: '交易23' },
    { value: '交易24' }
]

class Circle {
    constructor(datas, el) {
        this.originDatas = datas;
        this.datas = [];
        this.splitNum = 3;
        this.maxCount = 0;
        this.bigRadius = 36;
        this.mediumRadius = 26;
        this.smallRadius = 20;
        this.bigCount = 0;
        this.mediumCount = 0;
        this.smallCount = 0;
        this.circleBox = el;
        this.w = '';
        this.h = '';
        this.timer = null;
        this.debugCount = 0;

        this.init();
    }

    init() {
        this.w = this.circleBox.width();
        this.h = this.circleBox.height();
        let flag = this.isBigScreen();
        if (flag) {
            this.datas = this.originDatas;
        }
        else {
            this.datas = this.originDatas.slice(0, 18);
        }
        this.maxCount = this.datas.length;
        this.forMatterDatas();
        this.startDraw();
    }

    forMatterDatas() {
        let split_count = parseInt(this.maxCount / this.splitNum);
        this.datas.forEach((item, index) => {
            let size = '';
            if (index < split_count) {
                size = 'big';
            }
            else if (index < 2 * split_count) {
                size = 'medium';
            }
            else {
                size = 'small'
            }
            Object.assign(item, { size });
        });
    }

    startDraw() {
        let pointArr = [];
        let count = 0;
        let strDom = '';
        var startD = new Date();
        while (count < this.maxCount) {
            let current = this.datas[count];
            let newPoint = this.randomPoint(current);
            if (this.testAvailable(pointArr, newPoint)) {
                Object.assign(current, newPoint);
                pointArr.push(newPoint);
                this.calcCount(current);
                strDom += this.createDom(current);
                count += 1;
            }

            var endD = new Date();
            var diff = (endD.getTime() - startD.getTime()) / 1000;
            if (diff > 1) {
                this.debugCount++;
                if (this.debugCount >= 3) {
                    break; // 如果三次没有重绘出来， 说明空间不足画，直接break，画最大的个数 
                }
                console.log('this.debugCount', this.debugCount);
                // 假如在1s里无法分配出空间,那么重绘
                this.startDraw();
                break
            }
        }
        this.circleBox.html(strDom);
    }

    isBigScreen() {
        return document.body.clientWidth > 1600 ? true : false;
    }

    randomPoint(current) {
        let { size } = current;
        let r = 0;
        let sizeClass = '';
        let max_y = '';
        let min_y = '';
        let max_x = ''
        let min_x = '';
        let countType = '';
        if (size == 'big') {
            r = this.bigRadius;
            sizeClass = 'is_big';
            countType = this.bigCount;
        }
        else if (size == 'medium') {
            r = this.mediumRadius;
            sizeClass = 'is_medium';
            countType = this.mediumCount;
        }
        else if (size == 'small') {
            r = this.smallRadius;
            sizeClass = 'is_small';
            countType = this.smallCount;
        }
        let o = this.equalDivision(countType, r);
        max_x = o.max_x;
        min_x = o.min_x;

        max_y = this.h - r;
        min_y = r;

        const x = parseInt(Math.random() * (max_x - min_x) + min_x);
        const y = parseInt(Math.random() * (max_y - min_y) + min_y);
        return { x, y, r, sizeClass }
    }

    equalDivision(count, r) {
        let min_x = '';
        let max_x = '';
        if (count % 2) {
            min_x = r;
            max_x = this.w / 2 - r;
        }
        else {
            min_x = this.w / 2;
            max_x = this.w - r;
        }

        return {
            min_x,
            max_x
        }
    }

    createDom(current) {
        let { value, size, x, y, sizeClass, r } = current;
        let colorClass = Math.random() > 0.5 ? 'emotion1' : 'emotion2';
        let sName = value;
        if (value.length > 3) {
            sName = value.slice(0, 2) + '<br>' + value.slice(2);
        }
        let _left = x - r;
        let _top = y - r;
        let str = `<div style="left: ${_left}px; top: ${_top}px;" class="hot_ball ${sizeClass} ${colorClass}"><span class="text" data-name="${value}">${sName}</span></div>`;
        return str;
    }

    calcCount(current) {
        let { size } = current;
        if (size == 'big') {
            this.bigCount++;
        }
        else if (size == 'medium') {
            this.mediumCount++;
        }
        else if (size == 'small') {
            this.smallCount++;
        }
    }

    testOverlay(pointA, pointB) {
        const x = Math.abs(pointA.x - pointB.x);
        const y = Math.abs(pointA.y - pointB.y);
        const distance = Math.sqrt((x * x) + (y * y));
        if (distance >= (pointA.r + pointB.r)) {
            return false
        } else {
            return true
        }
    }

    testAvailable(pointArr, newPoint) {
        let arr = Array.from(pointArr);
        let aval = true;
        while (arr.length > 0) {
            let lastPoint = arr.pop()
            if (this.testOverlay(lastPoint, newPoint)) {
                aval = false
                break;
            }
        }
        return aval
    }

    resize() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.init();
        }, 100);
    }
}
$(function () {
    var c = new Circle(mockDatas, $('#circleBox'));

    window.onresize = function () {
        c.resize();
    }

    $('.hot_ball .text').on('click', function () {
        let value = $(this).attr('data-name');
        console.log('跳转页面', value);
    });
});




