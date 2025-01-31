package laya.display {
	import laya.events.Event;
	import laya.events.EventDispatcher;
	import laya.utils.Timer;
	
	/**
	 * 添加到父对象后调度。
	 * @eventType Event.ADDED
	 */
	[Event(name = "added", type = "laya.events.Event")]
	/**
	 * 被父对象移除后调度。
	 * @eventType Event.REMOVED
	 */
	[Event(name = "removed", type = "laya.events.Event")]
	/**
	 * 加入节点树时调度。
	 * @eventType Event.DISPLAY
	 */
	[Event(name = "display", type = "laya.events.Event")]
	/**
	 * 从节点树移除时调度。
	 * @eventType Event.UNDISPLAY
	 */
	[Event(name = "undisplay", type = "laya.events.Event")]
	
	/**
	 * <code>Node</code> 类用于创建节点对象，节点是最基本的元素。
	 */
	public class Node extends EventDispatcher {
		/**类询问为类对象。 */
		public static const ASK_CLASS:int = 1;
		/**值询问为NODE。 */
		public static const ASK_VALUE_NODE:int = 1;
		/**值询问为NODE。 */
		public static const ASK_VALUE_SPRITE:int = 2;
		/**值询问为HTMLELEMENT。 */
		public static const ASK_VALUE_HTMLELEMENT:int = 3;
		/**值询问为SPRITE3D。 */
		public static const ASK_VALUE_SPRITE3D:int = 100;
		
		/**@private */
		private static const ARRAY_EMPTY:Array = [];
		/**@private 子对象集合，请不要直接修改此对象。*/
		public var _childs:Array = ARRAY_EMPTY;
		/**节点名称。*/
		public var name:String = "";
		/**是否已经销毁。*/
		public var destroyed:Boolean;
		/**时间控制器。*/
		public var timer:Timer = Laya.timer;
		/**@private 是否在显示列表中显示*/
		protected var _displayInStage:Boolean;
		/**@private 父节点对象*/
		protected var _parent:Node;
		/**@private 系统保留的私有变量集合*/
		public var _privates:Object;
		
		/**
		 * <p>销毁此对象。</p>
		 * @param	destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
		 */
		public function destroy(destroyChild:Boolean = true):void {
			destroyed = true;
			this._parent && this._parent.removeChild(this);
			
			//销毁子节点
			if (_childs) {
				if (destroyChild) destroyChildren();
				else this.removeChildren();
			}
			
			this._childs = null;
			
			_privates && (this._privates = null);
			
			//移除所有事件监听
			this.offAll();
		}
		
		/**
		 * 销毁所有子对象，不销毁自己本身。
		 */
		public function destroyChildren():void {
			//销毁子节点
			if (_childs) {
				for (var i:int = this._childs.length - 1; i > -1; i--) {
					this._childs[i].destroy(true);
				}
			}
		}
		
		/**
		 * 添加子节点。
		 * @param	node 节点对象
		 * @return	返回添加的节点
		 */
		public function addChild(node:Node):Node {
			if (node === this) return node;
			if (node._parent === this) {
				this._childs.splice(getChildIndex(node), 1);
				this._childs.push(node);
				childChanged();
			} else {
				node.parent && node.parent.removeChild(node);
				this._childs === ARRAY_EMPTY && (this._childs = []);
				this._childs.push(node);
				node.parent = this;
			}
			return node;
		}
		
		/**
		 * 批量增加子节点
		 * @param	...args 无数子节点。
		 */
		public function addChildren(... args):void {
			var i:int = 0, n:int = args.length;
			while (i < n) {
				addChild(args[i++]);
			}
		}
		
		/**
		 * 添加子节点到指定的索引位置。
		 * @param	node 节点对象。
		 * @param	index 索引位置。
		 * @return	返回添加的节点。
		 */
		public function addChildAt(node:Node, index:int):Node {
			if (node === this) return node;
			
			if (index >= 0 && index <= this._childs.length) {
				if (node._parent === this) {
					this._childs.splice(getChildIndex(node), 1);
					this._childs.splice(index, 0, node);
					childChanged();
				} else {
					node.parent && node.parent.removeChild(node);
					this._childs === ARRAY_EMPTY && (this._childs = []);
					this._childs.splice(index, 0, node);
					node.parent = this;
				}
				return node;
			} else {
				throw new Error("appendChildAt:The index is out of bounds");
			}
		}
		
		/**
		 * 根据子节点对象，获取子节点的索引位置。
		 * @param	node 子节点。
		 * @return	子节点所在的索引位置。
		 */
		public function getChildIndex(node:Node):int {
			return this._childs.indexOf(node);
		}
		
		/**
		 * 根据子节点的名字，获取子节点对象。
		 * @param	name 子节点的名字。
		 * @return	节点对象。
		 */
		public function getChildByName(name:String):Node {
			var nodes:Array = this._childs;
			for (var i:int = 0, n:int = nodes.length; i < n; i++) {
				var node:Node = nodes[i];
				if (node.name === name) return node;
			}
			return null;
		}
		
		/**@private */
		public function getPrivates():Object {
			return _privates;
		}
		
		/**
		 * 根据子节点的索引位置，获取子节点对象。
		 * @param	index 索引位置
		 * @return	子节点
		 */
		public function getChildAt(index:int):Node {
			return this._childs[index];
		}
		
		/**
		 * 设置子节点的索引位置。
		 * @param	node 子节点。
		 * @param	index 新的索引。
		 * @return	返回子节点本身。
		 */
		public function setChildIndex(node:Node, index:int):Node {
			var childs:Array = this._childs;
			if (index < 0 || index >= childs.length) {
				throw new Error("setChildIndex:The index is out of bounds.");
			}
			
			var oldIndex:int = getChildIndex(node);
			childs.splice(oldIndex, 1);
			childs.splice(index, 0, node);
			childChanged();
			return node;
		}
		
		/**
		 * 子节点发生改变。
		 * @param	child 子节点。
		 */
		public function childChanged(child:Node = null):void {
		
		}
		
		/**
		 * 删除子节点。
		 * @param	node 子节点
		 * @return	被删除的节点
		 */
		public function removeChild(node:Node):Node {
			if (!this._childs) return node;
			var index:int = this._childs.indexOf(node);
			return removeChildAt(index);
		}
		
		/**
		 * 从父容器删除自己，如已经被删除不会抛出异常。
		 * @return 当前节点（ Node ）对象。
		 */
		public function removeSelf():Node {
			this._parent && this._parent.removeChild(this);
			return this;
		}
		
		/**
		 * 根据子节点名字删除对应的子节点对象，如果找不到不会抛出异常。
		 * @param	name 对象名字。
		 * @return 查找到的节点（ Node ）对象。
		 */
		public function removeChildByName(name:String):Node {
			var node:Node = getChildByName(name);
			node && removeChild(node);
			return node;
		}
		
		/**
		 * 根据子节点索引位置，删除对应的子节点对象。
		 * @param	index 节点索引位置。
		 * @return	被删除的节点。
		 */
		public function removeChildAt(index:int):Node {
			var node:Node = getChildAt(index);
			if (node) {
				this._childs.splice(index, 1);
				node.parent = null;
			}
			return node;
		}
		
		/**
		 * 删除指定索引区间的所有子对象。
		 * @param	beginIndex 开始索引。
		 * @param	endIndex 结束索引。
		 * @return 当前节点对象。
		 */
		public function removeChildren(beginIndex:int = 0, endIndex:int = 0x7fffffff):Node {
			if (_childs.length > 0) {
				var childs:Array = this._childs;
				if (beginIndex === 0 && endIndex >= n) {
					var arr:Array = childs;
					this._childs = ARRAY_EMPTY;
				} else {
					arr = childs.splice(beginIndex, endIndex - beginIndex);
				}
				for (var i:int = 0, n:int = arr.length; i < n; i++) {
					arr[i].parent = null;
				}
			}
			return this;
		}
		
		/**
		 * 替换子节点。
		 * @internal 将传入的新节点对象替换到已有子节点索引位置处。
		 * @param	newNode 新节点。
		 * @param	oldNode 老节点。
		 * @return	返回新节点。
		 */
		public function replaceChild(newNode:Node, oldNode:Node):Node {
			var index:int = this._childs.indexOf(oldNode);
			if (index > -1) {
				this._childs.splice(index, 1, newNode);
				oldNode.parent = null;
				newNode.parent = this;
				return newNode;
			}
			return null;
		}
		
		/**
		 * 子对象数量。
		 */
		public function get numChildren():int {
			return this._childs.length;
		}
		
		/**父节点。*/
		public function get parent():Node {
			return this._parent;
		}
		
		public function set parent(value:Node):void {
			if (this._parent !== value) {
				if (value) {
					this._parent = value;
					//如果父对象可见，则设置子对象可见					
					event(Event.ADDED);
					value.displayInStage && _displayChild(this, true);
					value.childChanged(this);
				} else {
					//设置子对象不可见
					event(Event.REMOVED);
					this._parent.childChanged();
					_displayChild(this, false);
					this._parent = value;
				}
			}
		}
		
		/**表示是否在显示列表中显示。是否在显示渲染列表中。*/
		public function get displayInStage():Boolean {
			return _displayInStage;
		}
		
		/** @private */
		public function _setDisplay(value:Boolean):void {
			if (_displayInStage !== value) {
				_displayInStage = value;
				if (value) event(Event.DISPLAY);
				else event(Event.UNDISPLAY);
			}
		}
		
		/**
		 * @private
		 * 设置指定节点对象是否可见(是否在渲染列表中)。
		 * @param	node 节点。
		 * @param	display 是否可见。
		 */
		private function _displayChild(node:Node, display:Boolean):void {
			node._setDisplay(display);
			var childs:Array = node._childs;
			if (childs) {
				for (var i:int = childs.length - 1; i > -1; i--) {
					var child:Node = childs[i];
					child._setDisplay(display);
					child.numChildren && _displayChild(child, display);
				}
			}
		}
		
		/**
		 * 询问是否为某类型的某值。
		 * <p>常用来对对象类型进行快速判断。</p>
		 * @param	type 类型。
		 * @param	value 数值。
		 * @return 如果类型和值检测都相等则值为 ture，否则值为 false。
		 */
		public function ask(type:int, value:*):Boolean {
			return type == ASK_CLASS ? (value == ASK_VALUE_NODE) : false;
		}
		
		/**
		 * 当前容器是否包含 <code>node</code> 节点。
		 * @param	node  某一个节点 <code>Node</code>。
		 * @return	一个布尔值表示是否包含<code>node</code>节点。
		 */
		public function contains(node:Node):Boolean {
			if (node === this) return true;
			while (node) {
				if (node.parent === parent) return true;
				node = node.parent;
			}
			return false;
		}
		
		/**
		 * 定时重复执行某函数。
		 * @param	delay	间隔时间(单位毫秒)。
		 * @param	caller	执行域(this)。
		 * @param	method	结束时的回调方法。
		 * @param	args	回调参数。
		 * @param	coverBefore	是否覆盖之前的延迟执行，默认为true。
		 */
		public function timerLoop(delay:int, caller:*, method:Function, args:Array = null, coverBefore:Boolean = false):void {
			timer._create(false, true, delay, caller, method, args, coverBefore);
		}
		
		/**
		 * 定时执行某函数一次。
		 * @param	delay	延迟时间(单位毫秒)。
		 * @param	caller	执行域(this)。
		 * @param	method	结束时的回调方法。
		 * @param	args	回调参数。
		 * @param	coverBefore	是否覆盖之前的延迟执行，默认为true。
		 */
		public function timerOnce(delay:int, caller:*, method:Function, args:Array = null, coverBefore:Boolean = false):void {
			timer._create(false, false, delay, caller, method, args, coverBefore);
		}
		
		/**
		 * 定时重复执行某函数(基于帧率)。
		 * @param	delay	间隔几帧(单位为帧)。
		 * @param	caller	执行域(this)。
		 * @param	method	结束时的回调方法。
		 * @param	args	回调参数。
		 * @param	coverBefore	是否覆盖之前的延迟执行，默认为true。
		 */
		public function frameLoop(delay:int, caller:*, method:Function, args:Array = null, coverBefore:Boolean = false):void {
			timer._create(true, true, delay, caller, method, args, coverBefore);
		}
		
		/**
		 * 定时执行一次某函数(基于帧率)。
		 * @param	delay	延迟几帧(单位为帧)。
		 * @param	caller	执行域(this)
		 * @param	method	结束时的回调方法
		 * @param	args	回调参数
		 * @param	coverBefore	是否覆盖之前的延迟执行，默认为true
		 */
		public function frameOnce(delay:int, caller:*, method:Function, args:Array = null, coverBefore:Boolean = false):void {
			timer._create(true, false, delay, caller, method, args, coverBefore);
		}
		
		/**
		 * 清理定时器。
		 * @param	caller 执行域(this)。
		 * @param	method 结束时的回调方法。
		 */
		public function clearTimer(caller:*, method:Function):void {
			timer.clear(caller, method);
		}
	}
}