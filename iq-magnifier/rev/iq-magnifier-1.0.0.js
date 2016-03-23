/*
	Title	: iQuery Magnifier
	Version	: 1.0.0 (2016/03/22)
	Author	: Inpyo Jeon
	Website	: www.inpyo.kr
	
	Upcoming Updates :
	- Exception Handling
	- Keyboard Interaction
	- Thumbnail Slide
	- Smooth Animation
	- FadeIn/Out Flicker Fix
*/

(function($) {
	$.fn.iqMagnifier = function(options) {
		var obj = $(this);

		// options
		var param = $.extend({			
			imgMainSrc			: '',
			imgMainWidth		: 480,
			imgMainHeight		: '',
			imgMainBdWidth		: 20,
			imgMainBdColor		: '#CCCCCC',
			
			imgPopupSrc			: '',
			imgPopupWidth		: 480,
			imgPopupHeight		: '',
			imgPopupBdWidth		: 20,
			imgPopupBdColor		: '#CCCCCC',
			
			imgPopupPosition	: 'right',
			imgPopupOffsetX		: 50,
			imgPopupOffsetY		: 0,
			
			imgOverlaySrc		: '',
			imgOverlayOffsetX	: '',
			imgOverlayOffsetY	: '',
			
			magnifierWidth		: 200,
			magnifierHeight		: '',
			magnifierBdWidth	: 10,
			magnifierBdColor	: '#AA0000',
			
			zoomScale			: 20,
			zoomMaximum			: 4.0,
			
			dimType				: 'colored', // colored, tint, shade, none
			dimColor			: '#2266AA',
			dimDepth			: 0.4			
		}, options);

		if (!param.imgMainHeight) param.imgMainHeight = param.imgMainWidth;
		if (!param.imgPopupHeight) param.imgPopupHeight = param.imgPopupWidth;
		if (!param.magnifierHeight) param.magnifierHeight = param.magnifierWidth;		
		if (!param.imgPopupSrc) param.imgPopupSrc = param.imgMainSrc;
		
		if (param.dimType == 'tint') param.dimColor = '#FFFFFF';
		else if (param.dimType == 'shade') param.dimColor = '#000000';
		else if (param.dimType == 'none') param.dimDepth = 0;
		else if (param.dimType != 'colored') {
			alert('Invalid dimType');
			return false;
		}
		
		var imgPopupPosX, imgPopupPosY;
				
		if (param.imgPopupPosition == 'right') {
			imgPopupPosX = param.imgMainWidth + param.imgMainBdWidth + param.imgPopupOffsetX;
			imgPopupPosY = param.imgPopupOffsetY;
		} else if (param.imgPopupPosition == 'left') {
			imgPopupPosX = 0 - param.imgMainWidth - param.imgMainBdWidth - param.imgPopupOffsetX;
			imgPopupPosY = param.imgPopupOffsetY;
		} else if (param.imgPopupPosition == 'top') {
			imgPopupPosX = param.imgPopupOffsetX;
			imgPopupPosY = 0 - param.imgMainHeight - param.imgMainBdWidth - param.imgPopupOffsetY;
		} else if (param.imgPopupPosition == 'bottom') {
			imgPopupPosX = param.imgPopupOffsetX;
			imgPopupPosY = param.imgMainHeight + param.imgMainBdWidth + param.imgPopupOffsetY;
		} else {
			alert('Invalid imgPopupPosition');
			return false;
		}
				
		// initialize
		var appendInitial = 
			'<div class="iq-magnifier-wrap">' +
				'<div class="iq-magnifier-img-main-container-outside">' +
					'<div class="iq-magnifier-img-main-container-inside">' +
						'<div class="iq-magnifier-magnifier iq-magnifier-class-hover">' +
							'<div class="iq-magnifier-img-magnifier-container iq-magnifier-class-hover">' +
								'<img class="iq-magnifier-img-magnifier iq-magnifier-class-hover" src="' + param.imgMainSrc + '">' +
							'</div>' +
						'</div>' +
						'<div class="iq-magnifier-dim iq-magnifier-class-hover"></div>' +
						'<img class="iq-magnifier-img-main" src="' + param.imgMainSrc + '">' +
					'</div>' +
				'</div>' +
				'<div class="iq-magnifier-img-popup-container-outside iq-magnifier-class-hover">' +
					'<div class="iq-magnifier-img-popup-container-inside iq-magnifier-class-hover">' +
						'<img class="iq-magnifier-img-popup iq-magnifier-class-hover" src="' + param.imgPopupSrc + '">' +
					'</div>' +
				'</div>' +
			'</div>';
		
		obj.append(appendInitial);
						
		var $wrap = obj.find($('.iq-magnifier-wrap'));
		var $imgMainOuter = obj.find($('.iq-magnifier-img-main-container-outside'));
		var $imgMainInner = obj.find($('.iq-magnifier-img-main-container-inside'));
		var $magnifier = obj.find($('.iq-magnifier-magnifier'));
		var $imgMagnifierInner = obj.find($('.iq-magnifier-img-magnifier-container'));
		var $imgMagnifier = obj.find($('.iq-magnifier-img-magnifier'));
		var $dim = obj.find($('.iq-magnifier-dim'));
		var $imgMain = obj.find($('.iq-magnifier-img-main'));
		var $imgPopupOuter = obj.find($('.iq-magnifier-img-popup-container-outside'));
		var $imgPopupInner = obj.find($('.iq-magnifier-img-popup-container-inside'));
		var $imgPopup = obj.find($('.iq-magnifier-img-popup'));
		var $clsHover = obj.find($('.iq-magnifier-class-hover'));
		
		for (var i=0 ; i < param.imgOverlaySrc.length ; i++) {
			$imgMainInner.append('<img class="iq-magnifier-img-overlay">');
		}
		
		$wrap.css({
			position: 'relative',
			margin: 0,
			padding: 0
		});
		
		$imgMainOuter.css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: param.imgMainWidth,
			height: param.imgMainHeight,
			borderStyle: 'solid',
			borderWidth: param.imgMainBdWidth,
			borderColor: param.imgMainBdColor
		});
		
		$imgMainInner.css({			
			position: 'relative',
			width: param.imgMainWidth,
			height: param.imgMainHeight,
			cursor: 'crosshair'
		});
		
		$magnifier.css({
			position: 'absolute',
			top: 0 - param.magnifierBdWidth,
			left: 0 - param.magnifierBdWidth,
			width: param.magnifierWidth,
			height: param.magnifierHeight,
			borderStyle: 'solid',
			borderWidth: param.magnifierBdWidth,
			borderColor: param.magnifierBdColor,
			zIndex: 20,
			display: 'none'
		});
		
		$imgMagnifierInner.css({
			position: 'relative',
			width: '100%',
			height: '100%',
			overflow: 'hidden'
		});
		
		$imgMagnifier.css({
			position: 'absolute',
			width: param.imgMainWidth,
			height: param.imgMainHeight
		});
		
		$dim.css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: param.imgMainWidth,
			height: param.imgMainHeight,
			backgroundColor: param.dimColor,
			opacity: param.dimDepth,
			zIndex: 10,
			display: 'none'
		});
		
		$imgMain.css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: param.imgMainWidth,
			height: param.imgMainHeight
		});
		
		$imgPopupOuter.css({			
			position: 'absolute',
			top: imgPopupPosY,
			left: imgPopupPosX,
			width: param.imgPopupWidth,
			height: param.imgPopupHeight,
			borderStyle: 'solid',
			borderWidth: param.imgPopupBdWidth,
			borderColor: param.imgPopupBdColor,
			display: 'none'
		});
		
		$imgPopupInner.css({
			position: 'relative',
			width: param.imgPopupWidth,
			height: param.imgPopupHeight,
			overflow: 'hidden'
		});
		
		$imgPopup.css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: param.imgPopupWidth * param.imgMainWidth / param.magnifierWidth,
			height: param.imgPopupHeight * param.imgMainHeight / param.magnifierHeight
		});
		
		var $imgOverlay =  obj.find($('.iq-magnifier-img-overlay'));
		
		$imgOverlay.css({
			position: 'absolute'
		});
		
		for (i=0 ; i < param.imgOverlaySrc.length ; i++) {
			obj.find($('.iq-magnifier-img-overlay')).eq(i).attr('src', param.imgOverlaySrc[i]);
			obj.find($('.iq-magnifier-img-overlay')).eq(i).css({
				top: param.imgOverlayOffsetY[i],
				left: param.imgOverlayOffsetX[i]
			});
		}

		// variables
		var imgMainWidth = $imgMainInner.width();
		var imgMainHeight = $imgMainInner.height();
		var imgMainTop = $imgMainInner.offset().top;
		var imgMainBottom = $imgMainInner.offset().top + imgMainHeight;
		var imgMainLeft = $imgMainInner.offset().left;
		var imgMainRight = $imgMainInner.offset().left + imgMainWidth;
		var imgPopupWidth = $imgPopupInner.width();
		var imgPopupHeight = $imgPopupInner.height();
		var imgPopupTop = $imgPopupInner.offset().top;
		var imgPopupBottom = $imgPopupInner.offset().top + imgPopupHeight;
		var imgPopupLeft = $imgPopupInner.offset().left;
		var imgPopupRight = $imgPopupInner.offset().left + imgPopupWidth;

		var currMagnifierWidth;
		var currMagnifierHeight;
		var currMagnifierTop;
		var currMagnifierBottom;
		var currMagnifierLeft;
		var currMagnifierRight;
		
		var zoomRatio = 1 / param.zoomMaximum;
		var x, y;
		
		// functions				
		$imgMainInner
			.on('mouseenter mouseleave', over)
			.on('mousemove', move)
			.on('mousewheel', zoom);
		
		function over(e) {
			if (e.type == 'mouseenter') {
				$magnifier.css({
					width: param.magnifierWidth,
					height: param.magnifierHeight
				});
				$clsHover.fadeIn(100);
				window.onwheel = function() { return false; };
			} else {
				$clsHover.fadeOut(100);
				window.onwheel = function() { return true; };
			}
		}
		
		function move(e) {
			getMagnifier();
			
			x = e.pageX;
			y = e.pageY;
			
			if (x < imgMainLeft + currMagnifierWidth * 0.5) {
				$magnifier.css({
					left: param.magnifierBdWidth * (-1)
				});
				$imgMagnifier.css({
					left: 0
				});
			} else if (x > imgMainLeft + imgMainWidth - currMagnifierWidth * 0.5) {
				$magnifier.css({
					left: imgMainWidth - currMagnifierWidth - param.magnifierBdWidth
				});
				$imgMagnifier.css({
					left: (imgMainWidth - currMagnifierWidth) * (-1)
				});
			} else {
				$magnifier.css({
					left: x - imgMainLeft - currMagnifierWidth * 0.5 - param.magnifierBdWidth
				});
				$imgMagnifier.css({
					left: (x - imgMainLeft - currMagnifierWidth * 0.5) * (-1)
				});
			}
			
			if (y < imgMainTop + currMagnifierHeight * 0.5) {
				$magnifier.css({
					top: param.magnifierBdWidth * (-1)
				});
				$imgMagnifier.css({
					top: 0
				});
			} else if (y > imgMainTop + imgMainHeight - currMagnifierHeight * 0.5) {
				$magnifier.css({
					top: imgMainHeight - currMagnifierHeight - param.magnifierBdWidth
				});
				$imgMagnifier.css({
					top: (imgMainHeight - currMagnifierHeight) * (-1)
				});
			} else {
				$magnifier.css({
					top: y - imgMainTop - currMagnifierHeight * 0.5 - param.magnifierBdWidth
				});
				$imgMagnifier.css({
					top: (y - imgMainTop - currMagnifierHeight * 0.5) * (-1)
				});
			}
			
			getMagnifier();
			projectPopup();
		}
		
		function zoom(e) {
			getMagnifier();
				
			if (e.originalEvent.wheelDelta < 0) {
				if (currMagnifierWidth + param.zoomScale < imgMainWidth) {
					if (x - (currMagnifierWidth + param.zoomScale) * 0.5 < imgMainLeft) {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1),
							width: "+=" + param.zoomScale
						});
						$imgMagnifier.css({
							left: 0
						});
					} else if (x + (currMagnifierWidth + param.zoomScale) * 0.5 > imgMainRight) {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1) + imgMainWidth - currMagnifierWidth - param.zoomScale,
							width: "+=" + param.zoomScale
						});
						$imgMagnifier.css({
							left: (imgMainWidth - currMagnifierWidth - param.zoomScale) * (-1)
						});
					} else {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1) + x - imgMainLeft - (currMagnifierWidth + param.zoomScale) * 0.5,
							width: "+=" + param.zoomScale
						});
						$imgMagnifier.css({
							left: (x - imgMainLeft - (currMagnifierWidth + param.zoomScale) * 0.5) * (-1)
						});
					}
					
					if (y - (currMagnifierHeight + param.zoomScale) * 0.5 < imgMainTop) {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1),
							height: "+=" + param.zoomScale
						});
						$imgMagnifier.css({
							top: 0
						});
					} else if (y + (currMagnifierHeight + param.zoomScale) * 0.5 > imgMainBottom) {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1) + imgMainHeight - currMagnifierHeight - param.zoomScale,
							height: "+=" + param.zoomScale
						});
						$imgMagnifier.css({
							top: (imgMainHeight - currMagnifierHeight - param.zoomScale) * (-1)
						});
					} else {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1) + y - imgMainTop - (currMagnifierHeight + param.zoomScale) * 0.5,
							height: "+=" + param.zoomScale
						});
						$imgMagnifier.css({
							top: (y - imgMainTop - (currMagnifierHeight + param.zoomScale) * 0.5) * (-1)
						});
					}
				} else {
					$magnifier.css({
						top: param.magnifierBdWidth * (-1),
						left: param.magnifierBdWidth * (-1),
						width: imgMainWidth,
						height: imgMainHeight
					});
					$imgMagnifier.css({
						top: 0,
						left: 0
					});
				}				
			} else {
				if (currMagnifierWidth - param.zoomScale > imgMainWidth * zoomRatio) {
					if (x - currMagnifierWidth * 0.5 + param.zoomScale * 0.5 < imgMainLeft) {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1),
							width: "-=" + param.zoomScale
						});
						$imgMagnifier.css({
							left: 0
						});
					} else if (x + currMagnifierWidth * 0.5 - param.zoomScale * 0.5 > imgMainRight) {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1) + imgMainWidth - currMagnifierWidth + param.zoomScale,
							width: "-=" + param.zoomScale
						});
						$imgMagnifier.css({
							left: (imgMainWidth - currMagnifierWidth + param.zoomScale) * (-1)
						});
					} else {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1) + x - imgMainLeft - (currMagnifierWidth - param.zoomScale) * 0.5,
							width: "-=" + param.zoomScale
						});
						$imgMagnifier.css({
							left: (x - imgMainLeft - (currMagnifierWidth - param.zoomScale) * 0.5) * (-1)
						});
					}
					
					if (y - currMagnifierHeight * 0.5 + param.zoomScale * 0.5 < imgMainTop) {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1),
							height: "-=" + param.zoomScale
						});
						$imgMagnifier.css({
							top: 0
						});
					} else if (y + currMagnifierHeight * 0.5 - param.zoomScale * 0.5 > imgMainBottom) {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1) + imgMainHeight - currMagnifierHeight + param.zoomScale,
							height: "-=" + param.zoomScale
						});
						$imgMagnifier.css({
							top: (imgMainHeight - currMagnifierHeight + param.zoomScale) * (-1)
						});
					} else {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1) + y - imgMainTop - (currMagnifierHeight - param.zoomScale) * 0.5,
							height: "-=" + param.zoomScale
						});
						$imgMagnifier.css({
							top: (y - imgMainTop - (currMagnifierHeight - param.zoomScale) * 0.5) * (-1)
						});
					}
				} else {
					if (x - imgMainWidth * zoomRatio * 0.5 < imgMainLeft) {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1),
							width: imgMainWidth * zoomRatio
						});
						$imgMagnifier.css({
							left: 0
						});
					} else if (x + imgMainWidth * zoomRatio * 0.5 > imgMainRight) {
						$magnifier.css({
							left: param.magnifierBdWidth * (-1) + imgMainWidth - imgMainWidth * zoomRatio,
							width: imgMainWidth * zoomRatio
						});
						$imgMagnifier.css({
							left: (imgMainWidth - imgMainWidth * zoomRatio) * (-1)
						});
					} else {						
						$magnifier.css({
							left: param.magnifierBdWidth * (-1) + x - imgMainLeft - (imgMainWidth * zoomRatio) * 0.5,
							width: imgMainWidth * zoomRatio
						});
						$imgMagnifier.css({
							left: (x - imgMainLeft - (imgMainWidth * zoomRatio) * 0.5) * (-1)
						});
					}
					
					if (y - imgMainHeight * zoomRatio * 0.5 < imgMainTop) {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1),
							height: imgMainHeight * zoomRatio
						});
						$imgMagnifier.css({
							top: 0
						});
					} else if (y + imgMainHeight * zoomRatio * 0.5 > imgMainBottom) {
						$magnifier.css({
							top: param.magnifierBdWidth * (-1) + imgMainHeight - imgMainHeight * zoomRatio,
							height: imgMainWidth * zoomRatio
						});
						$imgMagnifier.css({
							top: (imgMainHeight - imgMainHeight * zoomRatio) * (-1)
						});
					} else {						
						$magnifier.css({
							top: param.magnifierBdWidth * (-1) + y - imgMainTop - (imgMainHeight * zoomRatio) * 0.5,
							height: imgMainHeight * zoomRatio
						});
						$imgMagnifier.css({
							top: (y - imgMainLeft - (imgMainHeight * zoomRatio) * 0.5) * (-1)
						});
					}
				}
			}
			getMagnifier();
			projectPopup();
		}
		
		function getMagnifier() {
			currMagnifierWidth = $imgMagnifierInner.width();
			currMagnifierHeight = $imgMagnifierInner.height();
			currMagnifierTop = $imgMagnifierInner.offset().top;
			currMagnifierBottom = $imgMagnifierInner.offset().top + currMagnifierHeight;
			currMagnifierLeft = $imgMagnifierInner.offset().left;
			currMagnifierRight = $imgMagnifierInner.offset().left + currMagnifierWidth;
		}
		
		function projectPopup() {
			var currZoomMulti = imgMainWidth / currMagnifierWidth;
						
			$imgPopup.css({
				top: ((currMagnifierTop - imgMainTop) * currZoomMulti) * (-1),
				left: ((currMagnifierLeft - imgMainLeft) * currZoomMulti) * (-1),
				width: imgMainWidth * currZoomMulti,
				height: imgMainHeight * currZoomMulti
			});
		}
		
		return this;
	};
})(jQuery);