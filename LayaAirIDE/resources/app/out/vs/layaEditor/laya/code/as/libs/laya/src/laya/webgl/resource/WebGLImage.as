package laya.webgl.resource {
	import laya.maths.Arith;
	import laya.resource.Bitmap;
	import laya.resource.FileBitmap;
	import laya.resource.HTMLImage;
	import laya.utils.Browser;
	import laya.utils.Stat;
	import laya.webgl.atlas.AtlasResourceManager;
	import laya.webgl.WebGL;
	import laya.webgl.WebGLContext;
	
	/**
	 * ...
	 * @author
	 */
	public class WebGLImage extends FileBitmap implements IMergeAtlasBitmap {
		
		/**异步加载锁*/
		private var _recreateLock:Boolean = false;
		/**异步加载完成后是否需要释放（有可能在恢复过程中,再次被释放，用此变量做标记）*/
		private var _needReleaseAgain:Boolean = false;
		/**HTML Image*/
		private var _image:*;
		/***是否创建私有Source,值为false时不根据src创建私有WebGLTexture,同时销毁时也只清空source=null,不调用WebGL.mainContext.deleteTexture类似函数，调用资源激活前有效*/
		private var _allowMerageInAtlas:Boolean;
		/**是否允许加入大图合集*/
		private var _enableMerageInAtlas:Boolean;
		
		/**是否使用重复模式纹理寻址*/
		public var repeat:Boolean;
		/**是否使用mipLevel*/
		public var mipmap:Boolean;
		/**缩小过滤器*/
		public var minFifter:int;//动态默认值，判断是否可生成miplevel
		/**放大过滤器*/
		public var magFifter:int;//动态默认值，判断是否可生成miplevel
		
		/**
		 * 返回HTML Image,as3无internal货friend，通常禁止开发者修改image内的任何属性
		 * @param HTML Image
		 */
		public function get image():* {
			return _image;
		}
		
		public function get atlasSource():* {
			return _image;
		}
		
		/**
		 * 是否创建私有Source
		 * @return 是否创建
		 */
		public function get allowMerageInAtlas():Boolean {
			return _allowMerageInAtlas;
		}
		
		/**
		 * 是否创建私有Source
		 * @return 是否创建
		 */
		public function get enableMerageInAtlas():Boolean {
			return _allowMerageInAtlas;
		}
		
		/**
		 * 是否创建私有Source,通常禁止修改
		 * @param value 是否创建
		 */
		public function set enableMerageInAtlas(value:Boolean):void {
			_allowMerageInAtlas = value;
		}
		
		/**
		 * 设置文件路径全名
		 * @param 文件路径全名
		 */
		override public function set src(value:String):void {
			_src = value;
			_image && (_image.src = value);
		}
		
		/***
		 * 设置onload函数
		 * @param value onload函数
		 */
		override public function set onload(value:Function):void {
			_onload = value;
			_image && (_image.onload = _onload != null ? (function():void {
				onresize();
				_onload();
			}) : null);
		}
		
		/***
		 * 设置onerror函数
		 * @param value onerror函数
		 */
		override public function set onerror(value:Function):void {
			_onerror = value;
			_image && (_image.onerror = _onerror != null ? (function():void {
				_onerror()
			}) : null);
		}
		
		public function WebGLImage(im:* = null) {
			super();
			repeat = true;
			mipmap = false;
			minFifter = -1;
			magFifter = -1;
			_image = im || new Browser.window.Image();
			_enableMerageInAtlas = true;
		}
		
		/***重新创建资源*/
		override protected function recreateResource():void {//未处理SRC恢复过程中更换问题
			if (_src == null || _src === "")
				return;
			
			startCreate();
			if (!_image) {
				_recreateLock = true;
				var _this:WebGLImage = this;
				_image = new Browser.window.Image();
				_image.onload = function():void {
					_this._image.onload = null;
					if (_this._needReleaseAgain)//异步处理，加载完后可能，资源存在已被释放的风险
					{
						_this._needReleaseAgain = false;
						_this._image = null;
						return;
					}
					(!(_this._allowMerageInAtlas && _this._enableMerageInAtlas)) ? (_this.createWebGlTexture()) : (memorySize = 0, _recreateLock = false);
					_this.compoleteCreate();//处理创建完成后相关操作
				};
				_this._image.src = _src;
			} else {
				if (_recreateLock) {
					return;
				}
				(!(_allowMerageInAtlas && _enableMerageInAtlas)) ? (createWebGlTexture()) : (memorySize = 0, _recreateLock = false);
				compoleteCreate();//处理创建完成后相关操作
			}
		}
		
		/***复制资源,此方法为浅复制*/
		override public function copyTo(dec:Bitmap):void {
			var webglImage:WebGLImage = dec as WebGLImage;
			webglImage._image = _image;
			super.copyTo(webglImage);
		}
		
		/***销毁资源*/
		override protected function detoryResource():void {
			if (_recreateLock) {
				_needReleaseAgain = true;
			}
			if (_source) {
				WebGL.mainContext.deleteTexture(_source);
				_source = null;
				memorySize = 0;
			}
		}
		
		private function createWebGlTexture():void {
			
			var gl:WebGLContext = WebGL.mainContext;
			if (!_image) {
				throw "create GLTextur err:no data:" + _image;
			}
			var glTex:* = _source = gl.createTexture();
			gl.bindTexture(WebGLContext.TEXTURE_2D, glTex);
			gl.texImage2D(WebGLContext.TEXTURE_2D, 0, WebGLContext.RGBA, WebGLContext.RGBA, WebGLContext.UNSIGNED_BYTE, _image);
			
			var minFifter:int = this.minFifter;
			var magFifter:int = this.magFifter;
			var repeat:int = this.repeat ? WebGLContext.REPEAT : WebGLContext.CLAMP_TO_EDGE
			
			var isPOT:Boolean = Arith.isPOT(width, height);//提前修改内存尺寸，忽悠异步影响
			if (isPOT) {
				if (this.mipmap)
					(minFifter !== -1) || (minFifter = WebGLContext.LINEAR_MIPMAP_LINEAR);
				else
					(minFifter !== -1) || (minFifter = WebGLContext.LINEAR);
				
				(magFifter !== -1) || (magFifter = WebGLContext.LINEAR);
				
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_MAG_FILTER, magFifter);
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_MIN_FILTER, minFifter);
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_WRAP_S, repeat);
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_WRAP_T, repeat);
				this.mipmap && gl.generateMipmap(WebGLContext.TEXTURE_2D);
			} else {
				(minFifter !== -1) || (minFifter = WebGLContext.LINEAR);
				(magFifter !== -1) || (magFifter = WebGLContext.LINEAR);
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_MIN_FILTER, minFifter);
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_MAG_FILTER, magFifter);
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_WRAP_S, WebGLContext.CLAMP_TO_EDGE);
				gl.texParameteri(WebGLContext.TEXTURE_2D, WebGLContext.TEXTURE_WRAP_T, WebGLContext.CLAMP_TO_EDGE);
			}
			
			gl.bindTexture(WebGLContext.TEXTURE_2D, null);
			_image = null;
			
			if (isPOT)
				memorySize = _w * _h * 4 * (1 + 1 / 3);//使用mipmap则在原来的基础上增加1/3
			else
				memorySize = _w * _h * 4;
			_recreateLock = false;
		}
		
		/***调整尺寸*/
		private function onresize():void {
			this._w = this._image.width;
			this._h = this._image.height;
			(AtlasResourceManager.enabled) && (_w < AtlasResourceManager.atlasLimitWidth && _h < AtlasResourceManager.atlasLimitHeight) ? _allowMerageInAtlas = true : _allowMerageInAtlas = false;
		}
		
		public function clearAtlasSource():void {
			_image = null;
		}
		
		override public function dispose():void {
			resourceManager.removeResource(this);
			super.dispose();
		}
	}
}