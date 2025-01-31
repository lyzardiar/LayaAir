package laya.resource {
	import laya.events.Event;
	import laya.events.EventDispatcher;
	import laya.net.URL;
	import laya.system.System;
	
	/**
	 * 资源加载完成后调度。
	 * @eventType Event.LOADED
	 */
	[Event(name = "loaded", type = "laya.events.Event")]
	
	/**
	 * <code>Texture</code> 是一个纹理处理类。
	 */
	public class Texture extends EventDispatcher {
		/*[DISABLE-ADD-VARIABLE-DEFAULT-VALUE]*/
		/** 2D 纹理。*/
		public static const TEXTURE2D:int = 1;
		/** 3D 纹理。*/
		public static const TEXTURE3D:int = 2;
		
		/**
		 * 默认 UV 信息。
		 */
		public static var DEF_UV:Array =/*[STATIC SAFE]*/ [0, 0, 1.0, 0, 1.0, 1.0, 0, 1.0];
		/**
		 * 反转 UV 信息。
		 */
		public static var INV_UV:Array =/*[STATIC SAFE]*/ [0, 1, 1.0, 1, 1.0, 0.0, 0, 0.0];
		
		/**
		 * 平移 UV。
		 * @param offsetX 沿 X 轴偏移量。
		 * @param offsetY 沿 Y 轴偏移量。
		 * @param uv 需要平移操作的的 UV。
		 * @return 平移后的UV。
		 */
		public static function moveUV(offsetX:Number, offsetY:Number, uv:Array):Array {
			for (var i:int = 0; i < 8; i += 2) {
				uv[i] += offsetX;
				uv[i + 1] += offsetY;
			}
			return uv;
		}
		
		/**
		 *  根据指定资源和坐标、宽高、偏移量等创建 <code>Texture</code> 对象。
		 * @param	source 绘图资源 img 或者 Texture 对象。
		 * @param	x 起始绝对坐标 x 。
		 * @param	y 起始绝对坐标 y 。
		 * @param	width 宽绝对值。
		 * @param	height 高绝对值。
		 * @param	offsetX X 轴偏移量。
		 * @param	offsetY Y 轴偏移量。
		 * @param	canInAtlas 是否存入图集。
		 * @return  <code>Texture</code> 对象。
		 */
		public static function create(source:*, x:Number, y:Number, width:Number, height:Number, offsetX:Number = 0, offsetY:Number = 0):Texture {
			var uv:Array = source.uv || DEF_UV;
			var bitmapResource:FileBitmap = source.bitmap || source;
			var tex:Texture = new Texture(bitmapResource, null);
			tex.width = width;
			tex.height = height;
			tex.offsetX = offsetX;
			tex.offsetY = offsetY;
			
			var dwidth:Number = 1 / bitmapResource.width;
			var dheight:Number = 1 / bitmapResource.height;
			x *= dwidth;
			y *= dheight;
			width *= dwidth;
			height *= dheight;
			
			var u1:Number = tex.uv[0], v1:Number = tex.uv[1], u2:Number = tex.uv[4], v2:Number = tex.uv[5];
			var inAltasUVWidth:Number = (u2 - u1), inAltasUVHeight:Number = (v2 - v1);
			var oriUV:Array = moveUV(uv[0], uv[1], [x, y, x + width, y, x + width, y + height, x, y + height]);
			tex.uv = [u1 + oriUV[0] * inAltasUVWidth, v1 + oriUV[1] * inAltasUVHeight, u2 - (1 - oriUV[2]) * inAltasUVWidth, v1 + oriUV[3] * inAltasUVHeight, u2 - (1 - oriUV[4]) * inAltasUVWidth, v2 - (1 - oriUV[5]) * inAltasUVHeight, u1 + oriUV[6] * inAltasUVWidth, v2 - (1 - oriUV[7]) * inAltasUVHeight];
			return tex;
		}
		
		/** 图片或者canvas 。*/
		public var bitmap:*;
		/** UV信息。*/
		public var uv:Array;
		/**
		 * @private
		 * */
		protected var _loaded:Boolean;
		/** @private */
		protected var _w:Number = 0;
		/** @private */
		protected var _h:Number = 0;
		/**
		 * 沿 X 轴偏移量。
		 */
		public var offsetX:Number = 0;
		/**
		 * 沿 Y 轴偏移量。
		 */
		public var offsetY:Number = 0;
		
		/**
		 * 表示是否加载成功，只能表示初次载入成功（通常包含下载和载入）,并不能完全表示资源是否可立即使用（资源管理机制释放影响等）。
		 */
		public function get loaded():Boolean {
			return _loaded;
		}
		
		/**
		 * 表示资源是否已释放。
		 */
		public function get released():Boolean {
			return bitmap.released;
		}
		
		/**
		 * 创建一个 <code>Texture</code> 实例。
		 * @param	bitmapResource 位图资源。
		 * @param	uv UV 数据信息。
		 * @param	canInAtlas 是否存入图集。
		 */
		public function Texture(bitmapResource:Bitmap = null, uv:Array = null) {
			super();
			set(bitmapResource, uv);
		}
		
		/**
		 * 设置此对象的位图资源、UV数据信息。
		 * @param	bitmapResource 位图资源
		 * @param	uv UV数据信息
		 * @param	canInAtlas 是否存入图集。
		 */
		public function set(bitmapResource:Bitmap = null, uv:Array = null):void {
			this.bitmap = bitmapResource;
			this.uv = uv || DEF_UV;
			//canInAtlas = canInAtlas;
			if (bitmapResource) {
				_w = bitmapResource.width;
				_h = bitmapResource.height;
				_loaded = _w > 0;
				var _this:Texture = this;
				if (_loaded) {
					(System.addToAtlas) && (System.addToAtlas(_this));
				} else {
					var bm:* = bitmapResource;
					if ((bm is HTMLImage) && (bm.image))//必须是webglImage(只有必须是webglImage包含image)
						bm.image.addEventListener('load', function(e:*):void {
							(System.addToAtlas) && (System.addToAtlas(_this));
						}, false);
				}
			}
		}
		
		/** 激活资源。*/
		public function active():void {
			bitmap.activeResource();
		}
		
		/** 激活并获取资源。*/
		public function get source():* {
			bitmap.activeResource();
			return bitmap.source;
		}
		
		/** 销毁。*/
		public function destroy():void {
			bitmap = null;
			//uv = null;
		}
		
		/** 实际宽度。*/
		public function get width():Number {
			if (_w) return _w;
			return (uv && uv !== DEF_UV) ? (uv[2] - uv[0]) * bitmap.width : bitmap.width;
		}
		
		public function set width(value:Number):void {
			_w = value;
		}
		
		/** 实际高度。*/
		public function get height():Number {
			if (_h) return _h;
			return (uv && uv !== DEF_UV) ? (uv[5] - uv[1]) * bitmap.height : bitmap.height;
		}
		
		public function set height(value:Number):void {
			_h = value;
		}
		
		/**
		 * 加载指定地址的图片。
		 * @param	url 图片地址。
		 */
		public function load(url:String):void {
			_loaded = false;
			var fileBitmap:FileBitmap = (this.bitmap || (this.bitmap = new HTMLImage())) as FileBitmap;//WebGl模式被自动替换为WebGLImage
			var _this:Texture = this;
			fileBitmap.onload = function():void {
				fileBitmap.onload = null;
				_this._loaded = true;
				_w = fileBitmap.width;
				_h = fileBitmap.height;
				_this.event(Event.LOADED, this);//this为webglimage 待调整
				(System.addToAtlas) && (System.addToAtlas(_this));
			};
			fileBitmap.src = URL.formatURL(url);
		}
	
	}
}