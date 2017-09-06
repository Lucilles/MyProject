$(function () {
    var indexJs = {
        //  初始化
        init: function () {
            this.setEvent();
            this.softSlide();
            this.fixScroll();
            //this.iosInput();

            indexJs.setSwiperHeight("#work-b-box");
            indexJs.unifiedHeight();
            indexJs.checkSome("#chooseStylist-list li", "active", "#btnSend1", "active");
            indexJs.checkSome("#chooseStyle-list li", "active", "#btnSend2", "active", true);
        },
        //  一般事件
        setEvent: function () {
            //  滑动执行方法
            $(document).scroll(function () {
                indexJs.serveToggle();
                indexJs.fixScroll();
            });

            //  打包成app不支持链式
            //  底部导航伸缩
            $("#toggleBtn").on("click", function () {
                var $footer = $(this).parents("#footer-popup");

                if ($footer.hasClass("show")) {
                    startMove();
                    kvRefresh();

                    $footer.removeClass("show");
                } else {
                    stopMove();

                    $("form input").val("");
                    $("#footer-popup form p").hide();
                    refreshVerifyCode();

                    $footer.addClass("show");
                }
            });
            //  弹窗轮播图关闭
            $(".swiper-popup-box .history-back, #swiper-popup-big .swiper-slide").on("click", function () {
                $(this).parents(".swiper-popup-box").hide();
            });
            //  设计师查看更多介绍
            $(".imgBox").on("click", function () {
                var $parent = $(this).parents(".introduce-a");

                if ($parent.hasClass("active")) {
                    $parent.removeClass("active");
                } else {
                    $parent.addClass("active");
                }
            })

            $(document)
                //  弹窗轮播图打开
                .on("click", ".work .swiper-slide", function () {
                    var idx = $(this).index();

                    stopMove();
                    indexJs.swiperPopup("#swiper-popup-box", ".swiper-popup", idx);
                    indexJs.setSwiperHeight("#swiper-popup-box", ".swiper-lazybox");
                })
                //  弹窗大图轮播图打开
                .on("click", "#swiper-popup-box .swiper-slide", function () {
                    var $parent = $(this).parents(".swiper-popup"),
                        idx = $parent.index(),
                        showIdx = $(this).index();

                    indexJs.swiperPopup("#swiper-popup-big", ".swiper-popup-bigbox", idx, showIdx);
                    //indexJs.setSwiperHeight("#swiper-popup-big", ".swiper-lazybox");
                    setHeight();
                })
                //  屏幕解锁
                .on("click", "#swiper-popup-box .history-back", function () {
                    startMove();
                })

            function setHeight() {
                var $screenHeight = $(window).height(),
                    $headerHeight = $(".icolor_title").first().outerHeight(),
                    $target = $("#swiper-popup-big .swiper-wrapper");

                $target.css({
                    height: $screenHeight - $headerHeight + "px"
                });
            }
        },
        //  梦改同款改造空间定制A滑动选项卡
        privateOrderA: function () {
            var box = new Swiper('#privateOrder-box-swiper', {
                preloadImages: false,
                lazyLoading: true
            });

            $("#privateOrder-a .swiper-nav li").click(function () {
                var idx = $(this).index();

                $(this).addClass("active")
                    .siblings().removeClass("active");

                box.slideTo(idx, 600, false);
            });
        },
        //  软装定制滑动门
        softSlide: function () {
            var $par = $("#soft-pic"),
                $target = $par.find(".soft-pic-intro"),
                $img = $par.find("img").eq(0),
                img = new Image();

            img.src = $img.attr("src");
            img.onload = function () {
                $par.height($img.height() + "px");
            }

            $target.click(function () {
                var $parent = $(this).parent();
                if ($parent.hasClass("active")) {
                    $(this).parents("#soft-pic")
                        .children("div")
                        .removeClass("active noActive");
                } else {
                    $(this).parent().addClass("active").removeClass("noActive")
                        .siblings().addClass("noActive").removeClass("active");
                }
            });
        },
        //  解决方案拖拽效果
        divider: function () {
            var imageWrap = $('.vfx-image-wrap'),
                topImage = imageWrap.find('.before-image'),
                divider = imageWrap.find('.divider-bar');

            //图片宽度设定
            var w = imageWrap.width();

            imageWrap.find("img").css({
                width: w
            });

            imageWrap.on("touchmove", function (e) {
                e = e || window.event;

                var offsets = $(this).offset(),
                    fullWidth = $(this).width(),
                    mouseX = e.originalEvent.targetTouches[0].pageX - offsets.left,
                    topImage = $(this).find('.before-image'),
                    divider = $(this).find('.divider-bar');
                if (mouseX < 0) {
                    mouseX = 0;
                } else if (mouseX > fullWidth) {
                    mouseX = fullWidth
                }

                $(this).addClass('special');
                divider.css(
                    {
                        left: mouseX,
                        transition: 'none',
                        webkitTransition: "none"
                    }
                );
                topImage.css({width: mouseX, transition: 'none', webkitTransition: "none"});
            });
        },
        //  设计领袖左右高度同步
        unifiedHeight: function () {
            var $box = $("#history-swiper"),
                $intro = $box.find(".designer-intro"),
                $img = $box.find("img").last(),
                img = new Image();

            img.src = $img.attr("src");
            img.onload = function () {
                var iH = parseInt($img.css("height"));

                $intro.css({
                    height: iH + "px"
                });
            }
        },
        //  滑动时隐藏客服
        serveToggle: function () {
            var $serve = $(".serve"),
                timer = null;

            $serve.addClass("hide");
            clearTimeout(timer);

            timer = setTimeout(serveSH, 1000);

            function serveSH() {
                clearTimeout(timer);
                $serve.removeClass("hide");
            }
        },
        //  解决滑动到顶底部时无法滑动
        fixScroll: function () {
            var $scrollTop = $(document).scrollTop(),
                $windowHeight = $(window).height(),
                $scrollHeight = $(document).height();

            if ($scrollTop < 1) {
                $(document).scrollTop(1);
            } else if ($scrollHeight == $windowHeight + $scrollTop) {
                $(document).scrollTop($scrollHeight - $windowHeight - 1);
            }
        },
        //  IOS系统点击input时，输入框上滑
        iosInput: function () {
            var system = navigator.userAgent,
                isIOS;

            isIOS = !!system.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

            if (isIOS) {
                inputFocus();
            } else {
                return false;
            }

            function inputFocus() {
                $(".popup input").focus(function () {
                    var $box = $(this).parents(".popupBox");

                    $box.css({
                        webkitTransform: "translate(-50%, -75%)",
                        transform: "translate(-50%, -75%)"
                    });
                }).blur(function () {
                    var $box = $(this).parents(".popupBox");

                    $box.css({
                        webkitTransform: "translate(-50%, -50%)",
                        transform: "translate(-50%, -50%)"
                    });
                });
            }
        },
        /*
         * 根据轮播图设定div高度，让loading居中·
         * parentID:  传入swiper板块ID
         * target:  需要设定高度的目标选择器
         * */
        setSwiperHeight: function (parentID, target) {
            var $box = $(parentID),
                $swiperWrapper = target ? $box.find(target) : $box.find(".swiper-wrapper"),
                $firstImg = $swiperWrapper.find(".swiper-lazy"),
                img = new Image(),
                rate,
                result;

            $firstImg.each(function () {
                if ($(this).is(":visible")) {
                    var $firstImgSrc = $(this).data("src");

                    img.src = $firstImgSrc;
                    img.onload = function () {
                        var imgHeight = img.height,
                            imgWidth = img.width;

                        rate = imgWidth / imgHeight;
                        result = $box.width() / rate;
                        $swiperWrapper.css({
                            height: result + "px"
                        });

                        img.onload = null;
                    }
                    return false;
                }
            });
        },
        /*
         * 弹窗轮播图
         * box:  目标父级ID
         * targetPopup:  需要显示隐藏的窗口
         * i:   需要显示隐藏的窗口索引值
         * showIdx:    显示第几张轮播图
         * */
        swiperPopup: function (box, targetPopup, i, showIdx) {
            var $box = $(box),
                $swiperBox = $box.find(targetPopup),
                len = $swiperBox.length,
                showI = showIdx ? showIdx : 0;

            if (len <= 0) {
                return false;
            } else {
                $box.show()
                    .find(targetPopup).hide()
                    .eq(i).show();

                i++;

                new Swiper($box.find(targetPopup + i), {
                    preloadImages: false,
                    lazyLoading: true,
                    initialSlide: showI
                });
            }
        },
        /*
         * 多选增|删class
         * el:   目标选择器
         * className:    增|删className
         * btn:  关联按钮ID选择器
         * btnClassName: 关联按钮切换的className
         * mode: 单选|多选模式 true:多选 false:单选
         * */
        checkSome: function (el, className, btn, btnClassName, mode) {
            var target = el,
                targetClass = className,
                len;

            $(document).on("click", target, function () {
                if (mode) {
                    $(this).toggleClass(targetClass);
                } else {
                    $(this).addClass(targetClass)
                        .siblings().removeClass(targetClass);
                }

                len = $(target).parent().find("." + className).length;

                btnToggle();
            });

            function btnToggle() {
                if (len > 0) {
                    $(btn).addClass(btnClassName);
                } else {
                    $(btn).removeClass(btnClassName);
                }
            }
        },
    };
    indexJs.init();
});

//开启滑动
function startMove() {
    $("body").css({
        overflowY: "auto"
    });
    document.removeEventListener("touchmove", stopDefault, false);
}
//禁止滑动
function stopMove() {
    $("body").css({
        overflowY: "hidden"
    });
    document.addEventListener("touchmove", stopDefault, false);
}
function stopDefault(e) {
    e.preventDefault();
}