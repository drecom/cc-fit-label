// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// const MyOverflow = cc.Enum({
//     NONE: cc.Label.Overflow.NONE,
//     CLAMP: cc.Label.Overflow.CLAMP,
//     SHRINK: cc.Label.Overflow.SHRINK,
//     RESIZE_HEIGHT: cc.Label.Overflow.RESIZE_HEIGHT,

// });

cc.Class({
    extends: cc.Label,
    properties: {
        _fitToWidth: false,
        fitToWidth: {
            get () {
                return this._fitToWidth;
            },
            set (value) {
                if (this._fitToWidth === value) return;

                if (value) {
                    this._toClampedWidth();
                }
                else {
                    this._toOverflowNone();
                }

                this._fitToWidth = value;
            },
            animatable: false,
        },
        string: {
            override: true,
            get () {
                return this._string;
            },
            set (value) {
                let oldValue = this._string;
                this._string = value.toString();

                if (this.string !== oldValue) {
                    this._updateRenderData();

                    // Same as original source code except here.
                    if (this._fitToWidth) {
                        this._toClampedWidth();
                    }
                }

                this._checkStringEmpty();
            },
            visible: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.string'
        },
    },

    _toOverflowNone: function _toOverflowNone() {
        this.node.scaleX = 1;
        this.overflow = cc.Label.Overflow.NONE;
        this._assembler.updateRenderData(this);
    },

    _toClampedWidth: function _toClampedWidth() {
        // Width of the want to display.
        let requestWidth = Math.floor(this.node.width * this.node.scaleX);

        // set CLAMP for Overflow and sets width to want to display.
        this.node.scaleX = 1;
        this.node.width = requestWidth;
        this.overflow = cc.Label.Overflow.CLAMP;
        this._assembler.updateRenderData(this);

        // Get the width need for full display.
        this.overflow = cc.Label.Overflow.NONE;
        this._assembler.updateRenderData(this);
        const fullWidth = this.node.width;

        // update.
        this.node.width = Math.max(requestWidth, fullWidth);
        this.node.scaleX = Math.min(1, requestWidth / fullWidth);
        this.overflow = cc.Label.Overflow.CLAMP;
        this._assembler.updateRenderData(this);
        // Since the value changes, it sets again.
        this.node.width = Math.max(requestWidth, fullWidth);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad() {
    },

    start () {
    },

    update (dt) {},
});
