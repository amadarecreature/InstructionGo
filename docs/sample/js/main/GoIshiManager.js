import { GoBoadInfo } from "./GoSetting.js";
var ChakushuType;
(function (ChakushuType) {
    ChakushuType["BLACK_TURN"] = "B";
    ChakushuType["WHITE_TURN"] = "W";
    ChakushuType["OKI"] = "O";
    ChakushuType["NONE"] = "N";
})(ChakushuType || (ChakushuType = {}));
var GoishiColor;
(function (GoishiColor) {
    GoishiColor["BLACK"] = "black";
    GoishiColor["WHITE"] = "white";
    GoishiColor["NONE"] = "NONE";
})(GoishiColor || (GoishiColor = {}));
var KifuPart = /** @class */ (function () {
    function KifuPart(color, roX, roY, isPassed) {
        this.color = color;
        this.position = new PositionOnGoBoad(roX, roY);
        this.isPassed = isPassed;
    }
    return KifuPart;
}());
var PointerPosition = /** @class */ (function () {
    function PointerPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    return PointerPosition;
}());
var PositionOnGoBoad = /** @class */ (function () {
    /**
     * 路数で位置を指定
     * @param roX 0～18
     * @param roY 0～18
     */
    function PositionOnGoBoad(roX, roY) {
        if (roX < 0 || roY < 0) {
            throw new Error("ro must be greater than 0.");
        }
        this.roX = roX;
        this.roY = roY;
    }
    return PositionOnGoBoad;
}());
/**
 * 碁石を管理するクラス
 */
var GoishiManager = /** @class */ (function () {
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas
     * @param goBoadSetting
     * @param roCount
     * @param logger
     */
    function GoishiManager(canvas, goBoadSetting, roCount) {
        this.now = -1;
        this.roWidth = goBoadSetting.roHW;
        this.roHeight = goBoadSetting.roHW;
        this._turn = ChakushuType.BLACK_TURN;
        this.roCount = roCount;
        this._goBoadInfo = new GoBoadInfo(goBoadSetting.roHW, goBoadSetting.roHW, goBoadSetting.gobanLeft, goBoadSetting.gobanTop, roCount);
        this.kifu = new Array();
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.roCount = 0;
            this.realtimePosition = new Array();
            return;
        }
        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        // 現在地の初期化
        this.realtimePosition = new Array();
        for (var i = 0; i < roCount; i++) {
            this.realtimePosition[i] = new Array(); // （2）
            for (var j = 0; j < roCount; j++) {
                this.realtimePosition[i][j] = ChakushuType.NONE; // （3）
            }
        }
        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.initCanvas(this.canvas, this._goBoadInfo);
    }
    Object.defineProperty(GoishiManager.prototype, "turn", {
        get: function () {
            return this._turn;
        },
        enumerable: false,
        configurable: true
    });
    GoishiManager.prototype.viewFromKifu = function (kifuString) {
        var kifuList = KifuUtil.convertFromString(kifuString);
        var positions = new Array();
        for (var i = 0; i < this.roCount; i++) {
            positions[i] = new Array();
            for (var j = 0; j < this.roCount; j++) {
                positions[i][j] = ChakushuType.NONE;
            }
        }
        for (var index = 0; index < kifuList.length; index++) {
            var element = this.kifu[index];
            var x = element.position.roX;
            var y = element.position.roY;
            positions[x][y] = element.color;
        }
        this.viewFromPosition(positions);
    };
    /**
     * 棋譜の内容をそのまま表示する。
     */
    GoishiManager.prototype.viewFromPosition = function (realtimePosition) {
        this.clearAll();
        for (var x = 0; x < realtimePosition.length; x++) {
            var col = realtimePosition[x];
            for (var y = 0; y < col.length; y++) {
                var color = realtimePosition[x][y];
                var kifuPart = new KifuPart(color, x, y, false);
                if (kifuPart.color == ChakushuType.NONE) {
                    // 何もしない
                }
                else {
                    this.addGoishi(kifuPart);
                }
            }
        }
    };
    /**
     * 碁盤上での位置左上から数えた路数
     * @param x
     * @param y
     */
    GoishiManager.prototype.calcPositionOnGoban = function (position, goBoadInfo) {
        var top = goBoadInfo.top;
        var left = goBoadInfo.left;
        console.log("boad:" + top + ":" + left);
        var x0 = position.x - left;
        // 1区画の半分先までは、手前の路数として判断する
        var xRo = Math.floor((x0 + (goBoadInfo.roHeight / 2)) / goBoadInfo.roWidth) - 1;
        var y0 = position.y - top;
        // 1区画の半分先までは、手前の路数として判断する
        var yRo = Math.floor((y0 + (goBoadInfo.roHeight / 2)) / goBoadInfo.roHeight) - 1;
        // console.info("ro=" + xRo + ":" + yRo);
        return new PositionOnGoBoad(xRo, yRo);
    };
    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoishiManager.prototype.initCanvas = function (canvas, goBoadInfo) {
        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;
        // console.log("initCanvas:", canvas.width, canvas.height);
    };
    GoishiManager.prototype.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    /**
     * 指定した座標に石を描画する。
     * @param mouseX
     * @param mouseY
     * @param color
     */
    GoishiManager.prototype.drawGoIshiByPosition = function (position, color) {
        var positionOnGoban = this.calcPositionOnGoban(position, this._goBoadInfo);
        var circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoban);
        var fillstyle = color;
        var radius = this._goBoadInfo.roHeight * 0.475; // 半径
        this.drawFillCircle(circleCenterPosition.x, circleCenterPosition.y, radius, this.context, fillstyle);
        return positionOnGoban;
    };
    GoishiManager.prototype.isDuplicatePosition = function (mouseX, mouseY, goBoadInfo) {
        var positionOnGoban = this.calcPositionOnGoban(new PointerPosition(mouseX, mouseY), goBoadInfo);
        if (this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] != ChakushuType.NONE) {
            console.log("既に石がある。");
            return true;
        }
        return false;
    };
    GoishiManager.prototype.addHandicapStone = function (mouseX, mouseY) {
        console.info("click=" + mouseX + ":" + mouseY);
        if (this.isDuplicatePosition(mouseX, mouseY, this._goBoadInfo)) {
            return;
        }
        var positionOnBoad = this.drawGoIshiByPosition(new PointerPosition(mouseX, mouseY), GoishiColor.BLACK);
        // 棋譜の設定
        this.kifu.push(new KifuPart(ChakushuType.BLACK_TURN, positionOnBoad.roX, positionOnBoad.roY, false));
        // 次を白番にする
        this._turn = ChakushuType.WHITE_TURN;
        this.now += 1;
    };
    Object.defineProperty(GoishiManager.prototype, "kifuString", {
        get: function () {
            var tmp = "";
            this.kifu.forEach(function (kifu) {
                tmp += kifu.color + "(" + kifu.position.roX + ":" + kifu.position.roY + ")";
            });
            return tmp;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 待った
     */
    GoishiManager.prototype.chakushBack = function () {
        // const now = this.kifu.length - 1;
        var targetNo = this.now;
        var targetChakushu = this.kifu[targetNo];
        // 消す対象を次の手番として設定する。
        this._turn = targetChakushu.color;
        this.now = targetNo - 1;
        this.clearGoishiByRo(targetChakushu.position);
    };
    GoishiManager.prototype.clearGoishiByRo = function (positionOnGoban) {
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoban);
        this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
    };
    GoishiManager.prototype.addGoishi = function (kifuPart) {
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, kifuPart.position);
        this.drawGoishi(kifuPart.color, circleCenterPosition, kifuPart.position);
    };
    /**
     * 着手動作
     * @param mouseX
     * @param mouseY
     */
    GoishiManager.prototype.chakushu = function (mouseX, mouseY) {
        console.info("click position=" + mouseX + ":" + mouseY);
        var nowTurn = this._turn;
        var positionOnGoBoad = this.calcPositionOnGoban(new PointerPosition(mouseX, mouseY), this._goBoadInfo);
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoBoad);
        // console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);
        // console.info("positionOnGoBoad=" + positionOnGoBoad.roX + ":" + positionOnGoBoad.roY);
        if (this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] != ChakushuType.NONE) {
            console.log("既に石がある。");
            this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
            this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] = ChakushuType.NONE;
            return;
        }
        var tmp = this.drawGoishi(nowTurn, circleCenterPosition, positionOnGoBoad);
        // ターンを入れ替える
        this._turn = (nowTurn == ChakushuType.BLACK_TURN) ? ChakushuType.WHITE_TURN : ChakushuType.BLACK_TURN;
        this.now += 1;
        // auClick.play();
        // turn = 3 - turn;
    };
    GoishiManager.prototype.drawGoishi = function (nowTurn, circleCenterPosition, positionOnGoban) {
        var fillstyle = (nowTurn == ChakushuType.BLACK_TURN) ? "black" : "white";
        var radius = this._goBoadInfo.roHeight * 0.475; // 半径
        this.drawFillCircle(circleCenterPosition.x, circleCenterPosition.y, radius, this.context, fillstyle);
        // 棋譜の設定
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.roX, positionOnGoban.roY, false));
        // 配置の設定
        this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = nowTurn;
    };
    GoishiManager.prototype.calcCircleCenterPosition = function (goBoadInfo, positionOnGoban) {
        var circleX = goBoadInfo.areaLeft + goBoadInfo.keisenWidth + (this.roWidth) * (positionOnGoban.roX);
        // 端の線は2px(格子ごとの線+1pxなので、足りない1pxだけ足す)
        var circleY = goBoadInfo.areaTop + goBoadInfo.keisenWidth + (this.roHeight) * (positionOnGoban.roY);
        var circleCenterPosition = new PointerPosition(circleX, circleY);
        return circleCenterPosition;
    };
    /**
     * 円形オブジェクトを消します。
     * @param x 左端座標
     * @param y 上端座標
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoishiManager.prototype.clearGoishi = function (x, y, context) {
        context.clearRect(x, y, this.roWidth, this.roHeight);
        // 透明度
        console.log("color", "clear");
    };
    /**
     * 円形オブジェクトを描画します。
     * @param x 左端座標
     * @param y 上端座標
     * @param r 半径
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoishiManager.prototype.drawFillCircle = function (x, y, r, context, fillStyle) {
        context.beginPath();
        // context.arc(x + r, y + r, r, 0, 2 * Math.PI);
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fillStyle = fillStyle;
        // 透明度
        context.globalAlpha = 1;
        context.fill();
        // テカリ
        context.beginPath();
        context.arc(x, y, r * 0.8, 0, -0.25 * Math.PI, true);
        context.closePath;
        context.strokeStyle = (fillStyle == "black") ? "white" : "black";
        context.lineCap = "round";
        context.lineWidth = 0.5;
        context.stroke();
        console.log("color", fillStyle);
    };
    GoishiManager.prototype.drawCircle = function (x, y, r, globalAlpha, context, fillStyle) {
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.globalAlpha = globalAlpha;
        context.fillStyle = fillStyle;
        context.fill();
        // 透明度
        context.lineWidth = 3;
        context.strokeStyle = "white";
        context.stroke();
        context.closePath();
    };
    return GoishiManager;
}());
export { GoishiManager };
var KifuUtil = /** @class */ (function () {
    function KifuUtil() {
    }
    KifuUtil.convertFromString = function (value) {
        // TODO:実装する
        return new Array();
    };
    /**
     * TODO 実装する
     * @param kifuList
     */
    KifuUtil.convertToString = function (kifuList) {
        return "";
    };
    return KifuUtil;
}());
var GoishiUtil = /** @class */ (function () {
    function GoishiUtil() {
    }
    GoishiUtil.convertColor = function (chakushu) {
        if (chakushu == ChakushuType.BLACK_TURN) {
            return GoishiColor.BLACK;
        }
        if (chakushu == ChakushuType.WHITE_TURN) {
            return GoishiColor.WHITE;
        }
        if (chakushu == ChakushuType.OKI) {
            return GoishiColor.BLACK;
        }
        return GoishiColor.NONE;
    };
    return GoishiUtil;
}());
