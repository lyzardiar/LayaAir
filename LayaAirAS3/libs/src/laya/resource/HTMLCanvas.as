package laya.resource {
	import laya.renders.Render;
	import laya.utils.Browser;
	
	/**
	 * <code>HTMLCanvas</code> 是 Html Canvas 的代理类，封装了 Canvas 的属性和方法。
	 */
	public class HTMLCanvas extends Bitmap {
		/*[DISABLE-ADD-VARIABLE-DEFAULT-VALUE]*/
		
		/** 2D 模式。*/
		public static const TYPE2D:String = "2D";
		/** 3D 模式。*/
		public static const TYPE3D:String = "3D";
		/** 自动模式。*/
		public static const TYPEAUTO:String = "AUTO";
		
		/** @private */
		public static var _createContext:Function;
		
		private var _ctx:Context;
		private var _is2D:Boolean = false;
		
		/**
		 * 根据指定的类型，创建一个 <code>HTMLCanvas</code> 实例。
		 * @param	type 类型。2D、3D。
		 */
		public function HTMLCanvas(type:String) {
			_source = this;
			
			if (type === "2D" || (type === "AUTO" && !Render.isWebGl)) {
				_is2D = true;
				_source = Browser.createElement("canvas");
				var o:* = this;
				o.getContext = function(contextID:String, other:*):Context {
					if (_ctx) return _ctx;
					var ctx:* = _ctx = _source.getContext(contextID, other);
					if (ctx) {
						ctx._canvas = o;
						ctx.size = function():void {
						};
					}
					contextID === "2d" && Context._init(o, ctx);
					return ctx;
				}
			} else _source = {};
		}
		
		/**
		 * 清空画布内容。
		 */
		public function clear():void {
			_ctx && _ctx.clear();
		}
		
		/**
		 * 销毁。
		 */
		public function destroy():void {
			_ctx && _ctx.destroy();
			_ctx = null;
		}
		
		/**
		 * 释放。
		 */
		public function release():void {
		}
		
		/**
		 * Canvas 渲染上下文。
		 */
		public function get context():Context {
			return _ctx;
		}
		
		/**
		 * @private
		 * 设置 Canvas 渲染上下文。
		 * @param	context Canvas 渲染上下文。
		 */
		public function _setContext(context:Context):void {
			_ctx = context;
		}
		
		/**
		 * 获取 Canvas 渲染上下文。
		 * @param	contextID 上下文ID.
		 * @param	other
		 * @return  Canvas 渲染上下文 Context 对象。
		 */
		public function getContext(contextID:String, other:* = null):Context {
			return _ctx ? _ctx : (_ctx = _createContext(this));
		}
		
		/**
		 * 将此对象的成员属性值复制给指定的 Bitmap 对象。
		 * @param	dec 一个 Bitmap 对象。
		 */
		override public function copyTo(dec:Bitmap):void {
			super.copyTo(dec);
			(dec as HTMLCanvas)._ctx = _ctx;
		}
		
		/**
		 * 获取内存大小。
		 * @return 内存大小。
		 */
		public function getMemSize():int {
			return /*_is2D ? super.getMemSize() :*/ 0;//待调整
		}
		
		/**
		 * 是否当作 Bitmap 对象。
		 */
		public function set asBitmap(value:Boolean):void {
		}
		
		/**
		 * 设置宽高。
		 * @param	w 宽度。
		 * @param	h 高度。
		 */
		public function size(w:Number, h:Number):void {
			if (_w != w || _h != h) {
				_w = w;
				_h = h;
				_ctx && _ctx.size(w, h);
				_source && (_source.height = h, _source.width = w);
			}
		}
	}
}