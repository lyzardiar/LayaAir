/***********************************/
/*http://www.layabox.com 2016/2/27*/
/***********************************/
window.Laya=(function(window,document){
	var Laya={
		__internals:[],
		__packages:{},
		__classmap:{'Object':Object,'Function':Function,'Array':Array,'String':String},
		__sysClass:{'object':'Object','array':'Array','string':'String','dictionary':'Dictionary'},
		__propun:{writable: true,enumerable: false,configurable: true},
		__presubstr:String.prototype.substr,
		__substr:function(ofs,sz){return arguments.length==1?Laya.__presubstr.call(this,ofs):Laya.__presubstr.call(this,ofs,sz>0?sz:(this.length+sz));},
		__init:function(_classs){_classs.forEach(function(o){o.__init$ && o.__init$();});},
		__parseInt:function(value){return !value?0:parseInt(value);},
		__isClass:function(o){return o && (o.__isclass || o==Object || o==String || o==Array);},
		__newvec:function(sz,value){
			var d=[];
			d.length=sz;
			for(var i=0;i<sz;i++) d[i]=value;
			return d;
		},
		__extend:function(d,b){
			for (var p in b){
				if (!b.hasOwnProperty(p)) continue;
				var g = b.__lookupGetter__(p), s = b.__lookupSetter__(p); 
				if ( g || s ) {
					g && d.__defineGetter__(p, g);
					s && d.__defineSetter__(p, s);
				} 
				else d[p] = b[p];
			}
			function __() { Laya.un(this,'constructor',d); }__.prototype=b.prototype;d.prototype=new __();Laya.un(d.prototype,'__imps',Laya.__copy({},b.prototype.__imps));
		},
		__copy:function(dec,src){
			if(!src) return null;
			dec=dec||{};
			for(var i in src) dec[i]=src[i];
			return dec;
		},
		__package:function(name,o){
			if(Laya.__packages[name]) return;
			Laya.__packages[name]=true;
			var p=window,strs=name.split('.');
			if(strs.length>1){
				for(var i=0,sz=strs.length-1;i<sz;i++){
					var c=p[strs[i]];
					p=c?c:(p[strs[i]]={});
				}
			}
			p[strs[strs.length-1]] || (p[strs[strs.length-1]]=o||{});
		},
		__hasOwnProperty:function(name,o){
			o=o ||this;
		    function classHas(name,o){
				if(Object.hasOwnProperty.call(o.prototype,name)) return true;
				var s=o.prototype.__super;
				return s==null?null:classHas(name,s);
			}
			return (Object.hasOwnProperty.call(o,name)) || classHas(name,o.__class);
		},
		__typeof:function(o,value){
			if(!o || !value) return false;
			if(value==String) return (typeof o=='string');
			if(value==Number) return (typeof o=='number');
			if(value.__interface__) value=value.__interface__;
			else if(typeof value!='string')  return (o instanceof value);
			return (o.__imps && o.__imps[value]) || (o.__class==value);
		},
		__as:function(value,type){
			return (this.__typeof(value,type))?value:null;
		},		
		interface:function(name,_super){
			Laya.__package(name,{});
			var ins=Laya.__internals;
			var a=ins[name]=ins[name] || {};
			a.self=name;
			if(_super)a.extend=ins[_super]=ins[_super] || {};
			var o=window,words=name.split('.');
			for(var i=0;i<words.length-1;i++) o=o[words[i]];o[words[words.length-1]]={__interface__:name};
		},
		class:function(o,fullName,_super,miniName){
			_super && Laya.__extend(o,_super);
			if(fullName){
				Laya.__package(fullName,o);
				Laya.__classmap[fullName]=o;
				if(fullName.indexOf('.')>0){
					if(fullName.indexOf('laya.')==0){
						var paths=fullName.split('.');
						miniName=miniName || paths[paths.length-1];
						if(Laya[miniName]) console.log('warning:class name redefinition,'+fullName+'/'+Laya[miniName]);
						Laya[miniName]=o;
					}					
				}
				else {
					if(fullName=="Main")
						window.Main=o;
					else{
						if(Laya[fullName]){
							console.log('warning:class name redefinition,'+fullName+'/'+Laya[fullName]);
						}
						Laya[fullName]=o;
					}
				}
			}
			var un=Laya.un,p=o.prototype;
			un(p,'hasOwnProperty',Laya.__hasOwnProperty);
			un(p,'__class',o);
			un(p,'__super',_super);
			un(p,'__className',fullName);
			un(o,'__super',_super);
			un(o,'__className',fullName);
			un(o,'__isclass',true);
			un(o,'super',function(o){this.__super.call(o);});
		},
		imps:function(dec,src){
			if(!src) return null;
			var d=dec.__imps|| Laya.un(dec,'__imps',{});
			for(var i in src){
				d[i]=src[i];
				var c=i;
				while((c=this.__internals[c]) && (c=c.extend) ){
					c=c.self;d[c]=true;
				}
			}
		},		
		getset:function(isStatic,o,name,getfn,setfn){
			if(!isStatic){
				getfn && Laya.un(o,'_$get_'+name,getfn);
				setfn && Laya.un(o,'_$set_'+name,setfn);
			}
			else{
				getfn && (o['_$GET_'+name]=getfn);
				setfn && (o['_$SET_'+name]=setfn);
			}
			if(getfn && setfn) 
				Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false});
			else{
				getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false});
				setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false});
			}
		},
		static:function(_class,def){
				for(var i=0,sz=def.length;i<sz;i+=2){
					if(def[i]=='length') 
						_class.length=def[i+1].call(_class);
					else{
						function tmp(){
							var name=def[i];
							var getfn=def[i+1];
							Object.defineProperty(_class,name,{
								get:function(){delete this[name];return this[name]=getfn.call(this);},
								set:function(v){delete this[name];this[name]=v;},enumerable: true,configurable: true});
						}
						tmp();
					}
				}
		},		
		un:function(obj,name,value){
			arguments.length<3 &&(value=obj[name]);
			Laya.__propun.value=value;
			Object.defineProperty(obj, name, Laya.__propun);
			return value;
		},
		uns:function(obj,names){
			names.forEach(function(o){Laya.un(obj,o)});
		}
	};

	window.console=window.console || ({log:function(){}});
	window.trace=window.console.log;
	Error.prototype.throwError=function(){throw arguments;};
	String.prototype.substr=Laya.__substr;
	Object.defineProperty(Array.prototype,'fixed',{enumerable: false});

	return Laya;
})(window,document);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
	Laya.interface('laya.display.ILayout');
	Laya.interface('laya.webgl.shapes.IShape');
	Laya.interface('laya.filters.IFilter');
	Laya.interface('laya.resource.IDispose');
	Laya.interface('laya.filters.IFilterAction');
	Laya.interface('laya.webgl.canvas.save.ISaveData');
	Laya.interface('laya.webgl.submit.ISubmit');
	Laya.interface('laya.filters.IFilterActionGL','laya.filters.IFilterAction');
	var load=Laya.load=function(url,type){
		return Asyn.load(url,type);
	}


	var wait=Laya.wait=function(conditions){
		return Asyn.wait(conditions);
	}


	var await=Laya.await=function(caller,fn,nextLine){
		Asyn._caller_=caller;
		Asyn._callback_=fn;
		Asyn._nextLine_=nextLine;
	}


	var sleep=Laya.sleep=function(value){
		Asyn.sleep(value);
	}


	/**
	*全局引用入口
	*@author yung
	*/
	//class Laya
	var ___Laya=(function(){
		//function Laya(){};
		/**是否捕获全局错误并弹出提示*/
		__getset(1,Laya,'alertGlobalError',null,function(value){
			var erralert=0;
			if (value){
				Browser.window.onerror=function (msg,url,line,column,detail){
					if (erralert++< 5 && detail)
						alert("出错啦，请把此信息截图给研发商\n"+msg+"\n"+detail.stack);
				}
				}else {
				Browser.window.onerror=null;
			}
		});

		Laya.init=function(width,height,__plugins){
			var plugins=[];for(var i=2,sz=arguments.length;i<sz;i++)plugins.push(arguments[i]);
			for (var i=0,n=plugins.length;i < n;i++){
				if (plugins[i].enable)plugins[i].enable();
			}
			Font.__init__();
			Style.__init__();
			ResourceManager.__init__();
			Laya.stage=new Stage();
			var location=Browser.window.location;
			URL.rootPath=URL.basePath=URL.getPath(location.protocal=="file:" ? location.pathname :location.href);
			Laya.initAsyn();
			Laya.render=new Render(width,height);
			Laya.stage.size(width,height);
			RenderSprite.__init__();
			KeyBoardManager.__init__();
			MouseManager.instance.__init__();
		}

		Laya.initAsyn=function(){
			Asyn.loadDo=function (url,type,d){
				var l=new Loader();
				if (d){
					l.once("complete",null,function(data){
						d.callback(data);
					});
					l.once("error",null,function(err){
					});
				}
				l.load(url,type);
				return d;
			}
			Asyn.onceTimer=function (delay,d){
				Laya.timer.once(delay,d,d.callback);
			}
			Asyn.onceEvent=function (type,listener){
				Laya.stage.once(type,null,listener);
			}
			Laya.timer.frameLoop(1,null,Asyn._loop_);
		}

		Laya.stage=null;
		Laya.render=null
		Laya.version="0.9.6";
		Laya.is3DMode=false;
		__static(Laya,
		['timer',function(){return this.timer=new Timer();},'loader',function(){return this.loader=new LoaderManager();}
		]);
		return Laya;
	})()


	/**
	*事件调度类
	*@author yung
	*/
	//class laya.events.EventDispatcher
	var EventDispatcher=(function(){
		var EventHandler;
		function EventDispatcher(){
			this._events=null;
		}

		__class(EventDispatcher,'laya.events.EventDispatcher');
		var __proto=EventDispatcher.prototype;
		/**
		*是否有某种事件监听
		*@param type 事件名称
		*@return 是否有某种事件监听
		*/
		__proto.hasListener=function(type){
			var listener=this._events && this._events[type];
			return !!listener;
		}

		/**
		*发送事件
		*@param type 事件类型
		*@param data 回调数据，可以是单数据或者Array(作为多参)
		*@return 如果没有监听者，则返回false，否则true
		*/
		__proto.event=function(type,data){
			if (!this._events || !this._events[type])return false;
			var listeners=this._events[type];
			if (listeners.run){
				if (listeners.once)delete this._events[type];
				data !=null ? listeners.runWith(data):listeners.run();
				}else {
				for (var i=0,n=listeners.length;i < n;i++){
					var listener=listeners[i];
					if (listener){
						data !=null ? listener.runWith(data):listener.run();
					}
					if (!listener || listener.once){
						listeners.splice(i,1);
						i--;
						n--;
					}
				}
				if (listeners.length===0)delete this._events[type];
			}
			return true;
		}

		/**
		*增加事件监听
		*@param type 事件类型，可以参考Event类定义
		*@param caller 执行域(this域)，默认为监听对象的this域
		*@param listener 回调方法，如果为空，则移除所有type类型的事件监听
		*@param args 回调参数
		*@return 返回对象本身
		*/
		__proto.on=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,false);
		}

		/**
		*增加一次性事件监听，执行后会自动移除监听
		*@param type 事件类型，可以参考Event类定义
		*@param caller 执行域(this域)，默认为监听对象的this域
		*@param listener 回调方法，如果为空，则移除所有type类型的事件监听
		*@param args 回调参数
		*@return 返回对象本身
		*/
		__proto.once=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,true);
		}

		__proto._createListener=function(type,caller,listener,args,once){
			this.off(type,caller,listener,once);
			var handler=EventHandler.create(caller || this,listener,args,once);
			this._events || (this._events={});
			var events=this._events;
			if (!events[type])events[type]=handler;
			else {
				if (!events[type].run)events[type].push(handler);
				else events[type]=[events[type],handler];
			}
			return this;
		}

		/**
		*移除事件监听，同removeListener方法
		*@param type 事件类型，可以参考Event类定义
		*@param caller 执行域(this域)，默认为监听对象的this域
		*@param listener 回调方法，如果为空，则移除所有type类型的事件监听
		*@param onceOnly 是否只移除once监听，默认为false
		*@return 返回对象本身
		*/
		__proto.off=function(type,caller,listener,onceOnly){
			(onceOnly===void 0)&& (onceOnly=false);
			if (!this._events || !this._events[type])return this;
			var listeners=this._events[type];
			if (listener !=null){
				if (listeners.run){
					if ((!caller || listeners.caller===caller)&& listeners.method===listener && (!onceOnly || listeners.once)){
						delete this._events[type];
						listeners.recover();
					}
					}else {
					var count=0;
					for (var i=0,n=listeners.length;i < n;i++){
						var item=listeners[i];
						if (item && (!caller || item.caller===caller)&& item.method===listener && (!onceOnly || item.once)){
							count++;
							listeners[i]=null;
							item.recover();
						}
					}
					if (count===n)delete this._events[type];
				}
			}
			return this;
		}

		/**
		*移除某类型所有事件监听
		*@param type 事件类型，如果为空，则移除本对象所有事件监听
		*@return 返回对象本身
		*/
		__proto.offAll=function(type){
			var events=this._events;
			if (!events)return this;
			if (type){
				this._recoverHandlers(events[type]);
				delete events[type];
				}else {
				for (var name in events){
					this._recoverHandlers(events[name]);
				}
				this._events=null;
			}
			return this;
		}

		__proto._recoverHandlers=function(arr){
			if (arr.run){
				arr.recover();
				}else {
				for (var i=arr.length-1;i >-1;i--){
					if (arr[i]){
						arr[i].recover();
						arr[i]=null;
					}
				}
			}
		}

		/**
		*是否是鼠标事件
		*@param type 事件类型
		*@return 是否鼠标事件
		*/
		__proto.isMouseEvent=function(type){
			return EventDispatcher.MOUSE_EVENTS[type];
		}

		EventDispatcher.MOUSE_EVENTS={"rightmousedown":true,"rightmouseup":true,"rightclick":true,"mousedown":true,"mouseup":true,"mousemove":true,"mouseover":true,"mouseout":true,"click":true,"doubleclick":true};
		EventDispatcher.__init$=function(){
			//class EventHandler extends laya.utils.Handler
			EventHandler=(function(_super){
				function EventHandler(caller,method,args,once){
					EventHandler.__super.call(this,caller,method,args,once);
				}
				__class(EventHandler,'',_super);
				var __proto=EventHandler.prototype;
				__proto.recover=function(){
					if (this._id > 0){
						this._id=0;
						EventHandler._pool.push(this.clear());
					}
				}
				EventHandler.create=function(caller,method,args,once){
					(once===void 0)&& (once=true);
					if (EventHandler._pool.length)return EventHandler._pool.pop().setTo(caller,method,args,once);
					return new EventHandler(caller,method,args,once);
				}
				EventHandler._pool=[];
				return EventHandler;
			})(Handler)
		}

		return EventDispatcher;
	})()


	/**
	*处理器，推荐使用Handler.create()方法从对象池创建，减少对象创建消耗
	*【注意】由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行
	*@author yung
	*/
	//class laya.utils.Handler
	var Handler=(function(){
		function Handler(caller,method,args,once){
			//this.caller=null;
			//this.method=null;
			//this.args=null;
			this.once=false;
			this._id=0;
			(once===void 0)&& (once=false);
			this.setTo(caller,method,args,once);
		}

		__class(Handler,'laya.utils.Handler');
		var __proto=Handler.prototype;
		/**
		*设置处理器
		*@param caller 执行域(this)
		*@param method 回调方法
		*@param args 携带的参数
		*@param once 是否只执行一次，如果为true，执行后执行recover()进行回收
		*@return 返回handler本身
		*/
		__proto.setTo=function(caller,method,args,once){
			this._id=Handler._gid++;
			this.caller=caller;
			this.method=method;
			this.args=args;
			this.once=once;
			return this;
		}

		/**
		*执行处理器
		*/
		__proto.run=function(){
			if (this.method==null)return;
			var id=this._id;
			this.method.apply(this.caller,this.args);
			this._id===id && this.once && this.recover();
		}

		/**
		*执行处理器，携带额外数据
		*@param data 附加的回调数据，可以是单数据或者Array(作为多参)
		*/
		__proto.runWith=function(data){
			if (this.method==null)return;
			var id=this._id;
			if (data==null)this.method.apply(this.caller,this.args);
			else if (!this.args && !data.pop)this.method.call(this.caller,data);
			else if (this.args)this.method.apply(this.caller,this.args ? this.args.concat(data):data);
			else this.method.apply(this.caller,data);
			this._id===id && this.once && this.recover();
		}

		/**
		*清理对象引用
		*/
		__proto.clear=function(){
			this.caller=null;
			this.method=null;
			this.args=null;
			return this;
		}

		/**
		*clear()并回收到Handler对象池内
		*/
		__proto.recover=function(){
			if (this._id > 0){
				this._id=0;
				Handler._pool.push(this.clear());
			}
		}

		Handler.create=function(caller,method,args,once){
			(once===void 0)&& (once=true);
			if (Handler._pool.length)return Handler._pool.pop().setTo(caller,method,args,once);
			return new Handler(caller,method,args,once);
		}

		Handler._pool=[];
		Handler._gid=1;
		return Handler;
	})()


	/**
	*事件类型
	*@author yung
	*/
	//class laya.events.Event
	var Event=(function(){
		function Event(){
			//this.type=null;
			//this.nativeEvent=null;
			//this.target=null;
			//this.currentTarget=null;
			//this._stoped=false;
			//this.touchId=0;
		}

		__class(Event,'laya.events.Event');
		var __proto=Event.prototype;
		/**
		*设置事件数据
		*@param type 事件类型
		*@param currentTarget 事件目标触发对象
		*@param target 事件当前冒泡对象
		*@return
		*/
		__proto.setTo=function(type,currentTarget,target){
			this.type=type;
			this.currentTarget=currentTarget;
			this.target=target;
			return this;
		}

		/**停止事件冒泡*/
		__proto.stopPropagation=function(){
			this._stoped=true;
		}

		/**鼠标事件的同时是否按下shift键*/
		__getset(0,__proto,'shiftKey',function(){
			return this.nativeEvent.shiftKey;
		});

		/**多点触摸时，返回触摸点的集合*/
		__getset(0,__proto,'touches',function(){
			var arr=this.nativeEvent.touches;
			if (arr){
				for (var i=0,n=arr.length;i < n;i++){
					var e=arr[i];
					var point=Point.TEMP;
					point.setTo(e.clientX,e.clientY);
					Laya.stage._canvasTransform.invertTransformPoint(point);
					e.stageX=point.x;
					e.stageY=point.y;
				}
			}
			return arr;
		});

		/**鼠标事件的同时是否按下alt键*/
		__getset(0,__proto,'altKey',function(){
			return this.nativeEvent.altKey;
		});

		/**鼠标事件的同时是否按下ctrl键*/
		__getset(0,__proto,'ctrlKey',function(){
			return this.nativeEvent.ctrlKey;
		});

		Event.EMPTY=new Event();
		Event.MOUSE_DOWN="mousedown";
		Event.MOUSE_UP="mouseup";
		Event.CLICK="click";
		Event.RIGHT_MOUSE_DOWN="rightmousedown";
		Event.RIGHT_MOUSE_UP="rightmouseup";
		Event.RIGHT_CLICK="rightclick";
		Event.MOUSE_MOVE="mousemove";
		Event.MOUSE_OVER="mouseover";
		Event.MOUSE_OUT="mouseout";
		Event.MOUSE_WHEEL="mousewheel";
		Event.ROLL_OVER="mouseover";
		Event.ROLL_OUT="mouseout";
		Event.DOUBLE_CLICK="doubleclick";
		Event.CHANGE="change";
		Event.CHANGED="changed";
		Event.RESIZE="resize";
		Event.ADDED="added";
		Event.REMOVED="removed";
		Event.DISPLAY="display";
		Event.UNDISPLAY="undisplay";
		Event.ERROR="error";
		Event.COMPLETE="complete";
		Event.LOADED="loaded";
		Event.PROGRESS="progress";
		Event.INPUT="input";
		Event.RENDER="render";
		Event.OPEN="open";
		Event.MESSAGE="message";
		Event.CLOSE="close";
		Event.KEY_DOWN="keydown";
		Event.KEY_PRESS="keypress";
		Event.KEY_UP="keyup";
		Event.ENTER_FRAME="enterframe";
		Event.DRAG_START="dragstart";
		Event.DRAG_MOVE="dragmove";
		Event.DRAG_END="dragend";
		Event.ENTER="enter";
		Event.SELECT="select";
		Event.BLUR="blur";
		Event.FOCUS="focus";
		Event.PLAYED="played";
		Event.PAUSED="paused";
		Event.STOPPED="stopped";
		Event.START="start";
		Event.END="end";
		Event.ENABLED_CHANGED="enabledchanged";
		Event.COMPONENT_ADDED="componentadded";
		Event.COMPONENT_REMOVED="componentremoved";
		Event.ACTIVE_CHANGED="activechanged";
		Event.LAYER_CHANGED="layerchanged";
		Event.HIERARCHY_LOADED="hierarchyloaded";
		Event.MEMORY_CHANGED="memorychanged";
		Event.RECOVERED="recovered";
		Event.RELEASED="released";
		Event.LINK="link";
		return Event;
	})()


	//class PerformanceTest_Robots
	var PerformanceTest_Robots=(function(){
		function PerformanceTest_Robots(){
			this.robotDataPath="res/robot/data.bin";
			this.robotTexturePath="res/robot/texture.png";
			this.robotAmount=1;
			this.colAmount=15;
			this.robotScale=0.3;
			this.textureWidth=0;
			this.textureHeight=0;
			this.rowAmount=Math.ceil(this.robotAmount / this.colAmount);
			Laya.init(Browser.width,Browser.height,WebGL);
			Laya.stage.bgColor="#000000";
			Stat.show();
			var assets=[];
			assets.push({url:this.robotDataPath,type:"arraybuffer" });
			assets.push({url:this.robotTexturePath,type:"image" });
			Laya.loader.load(assets,Handler.create(this,this.onAssetsLoaded));
		}

		__class(PerformanceTest_Robots,'PerformanceTest_Robots');
		var __proto=PerformanceTest_Robots.prototype;
		__proto.onAssetsLoaded=function(){
			var data=Loader.getRes(this.robotDataPath);
			var img=Loader.getRes(this.robotTexturePath);
			var temp0=new Templet(data,img);
			this.textureWidth=temp0.textureWidth;
			this.textureHeight=temp0.textureHeight;
			var horizontalGap=(Laya.stage.width-this.textureWidth *this.robotScale)/ this.colAmount;
			var verticalGap=(Laya.stage.height-this.textureHeight *this.robotScale)/ this.rowAmount;
			for (var i=0;i < this.robotAmount;i++){
				var col=i % this.colAmount;
				var row=i / this.colAmount | 0;
				var robot=this.createRobot(temp0);
				robot.pos(horizontalGap *col,verticalGap *row);
				robot.stAnimName("Walk");
				robot.play();
			}
		}

		__proto.createRobot=function(templet){
			var sk=new Skeleton(templet);
			sk.pivot(-this.textureWidth,-this.textureHeight);
			sk.scaleX=sk.scaleY=this.robotScale;
			Laya.stage.addChild(sk);
			return sk;
		}

		return PerformanceTest_Robots;
	})()


	/**
	*...
	*@author laya
	*/
	//class Config
	var Config=(function(){
		function Config(){};
		__class(Config,'Config');
		Config.showLog=false;
		Config.atlasEnable=false;
		Config.atlasLimitWidth=0;
		Config.atlasLimitHeight=0;
		Config.showCanvasMark=false;
		Config.CPUMemoryLimit=120 *1024 *1024;
		Config.GPUMemoryLimit=160 *1024 *1024;
		return Config;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.asyn.Asyn
	var Asyn=(function(){
		function Asyn(){};
		__class(Asyn,'laya.asyn.Asyn');
		Asyn.wait=function(conditions){
			var d=new Deferred();
			if (conditions.indexOf("event:")==0){
				Asyn.onceEvent(conditions.substr(8),function(){
					d.callback();
				});
				return null;
			}
			d.loopIndex=Asyn._loopCount;
			return Asyn._Deferreds[conditions]=d;
		}

		Asyn.callLater=function(d){
			Asyn._callLater.push(d);
		}

		Asyn.notify=function(conditions,value){
			var o=Asyn._Deferreds[conditions];
			if (o){
				Asyn._Deferreds[conditions]=null;
				o.callback(value);
			}
		}

		Asyn.load=function(url,type){
			return Asyn.loadDo(url,type,new Deferred());
		}

		Asyn.sleep=function(delay){
			if (delay < 1){
				if (Asyn._loopsCount >=Asyn.loops[Asyn._loopsIndex].length){
					Asyn._loopsCount++;
					Asyn.loops[Asyn._loopsIndex].push(new Deferred());
					}else {
					var d=Asyn.loops[Asyn._loopsIndex][Asyn._loopsCount];
					d._reset();
					Asyn._loopsCount++;
				}
				return;
			}
			Asyn.onceTimer(delay,new Deferred());
		}

		Asyn._loop_=function(){
			Deferred._TIMECOUNT_++;
			Asyn._loopCount++;
			var sz=0;
			if ((sz=Asyn._loopsCount)> 0){
				var _loops=Asyn.loops[Asyn._loopsIndex];
				Asyn._loopsCount=0;
				Asyn._loopsIndex=(Asyn._loopsIndex+1)% 2;
				for (var i=0;i < sz;i++)
				_loops[i].callback();
			}
			if ((sz=Asyn._callLater.length)> 0){
				var accept=Asyn._callLater;
				Asyn._callLater=[];
				for (i=0,sz=accept.length;i < sz;i++){
					var d=accept[i];
					d.callback();
				}
			}
		}

		Asyn._Deferreds={};
		Asyn.loops=[[],[]];
		Asyn._loopsIndex=0;
		Asyn._loopCount=0;
		Asyn._loopsCount=0;
		Asyn._callLater=[];
		Asyn._waitFunctionId=0;
		Asyn.loadDo=null
		Asyn.onceEvent=null
		Asyn.onceTimer=null
		Asyn._caller_=null
		Asyn._callback_=null
		Asyn._nextLine_=0;
		return Asyn;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.asyn.Deferred
	var Deferred=(function(){
		function Deferred(){
			this._caller=null;
			this._callback=null;
			this._nextLine=0;
			this._value=null;
			this._createTime=0;
			this._reset();
		}

		__class(Deferred,'laya.asyn.Deferred');
		var __proto=Deferred.prototype;
		__proto.setValue=function(v){
			this._value=v;
		}

		__proto.getValue=function(){
			return this._value;
		}

		__proto._reset=function(){
			this._caller=Asyn._caller_;
			this._callback=Asyn._callback_;
			this._nextLine=Asyn._nextLine_;
			this._createTime=Deferred._TIMECOUNT_;
		}

		__proto.callback=function(value){
			(arguments.length > 0)&& (this._value=value);
			if (this._createTime==Deferred._TIMECOUNT_)
				Asyn.callLater(this);
			else this._callback && this._callback.call(this._caller,this._nextLine);
		}

		__proto.errback=function(value){
			(arguments.length > 0)&& (this._value=value);
			this._callback && this._callback.call(this._caller,this._nextLine);
		}

		Deferred._TIMECOUNT_=0;
		return Deferred;
	})()


	/**
	*位图字体，用于自定义字体及一些儿字体性能优化
	*@author ...
	*/
	//class laya.display.BitmapFont
	var BitmapFont=(function(){
		function BitmapFont(){
			this.fontSize=12;
			this.useFontScaleKey=false;
			this._texture=null;
			this._fontCharDic={};
			this._callHandler=null;
			this._path=null;
			this._maxHeight=0;
			this._maxWidth=0;
			this._minWordWidth=0;
			this._spaceWidth=10;
			this._useScaleKey=false;
		}

		__class(BitmapFont,'laya.display.BitmapFont');
		var __proto=BitmapFont.prototype;
		/**
		*通过指定位图字体文件路径，加载位图字体文件
		*@param path 位图字体文件的路径，不含扩展名（需要.fnt跟.png文件同名）
		*@param callHandler 加载完成的回调，通知上层字体文件已经完成加载并解析
		*/
		__proto.loadFont=function(path,callHandler){
			this._path=path;
			this._callHandler=callHandler;
			Laya.loader.load(this._path+".png",Handler.create(this,this.onTextureComplete),null,"image");
		}

		__proto.onTextureComplete=function(data){
			this._texture=data;
			Laya.loader.load(this._path+".fnt",Handler.create(this,this.onLoaded),null,"xml");
		}

		__proto.onLoaded=function(data){
			this.parseFontXml(data,this._texture);
			if (this._callHandler){
				this._callHandler.run();
			}
		}

		/**
		*解析字体文件
		*@param xml 字体文件XML
		*@param texture 字体的纹理
		*/
		__proto.parseFontXml=function(xml,texture){
			this._texture=texture;
			var tX=0;
			var tScale=1;
			var tInfo=xml.getElementsByTagName("info");
			this.fontSize=Laya.__parseInt(tInfo[0].attributes["size"].nodeValue);
			var chars=xml.getElementsByTagName("char");
			var i=0;
			for (i=0;i < chars.length;i++){
				var tAttribute=chars[i].attributes;
				var tId=Laya.__parseInt(tAttribute["id"].nodeValue);
				var xOffset=Laya.__parseInt(tAttribute["xoffset"].nodeValue)/ tScale;
				var yOffset=Laya.__parseInt(tAttribute["yoffset"].nodeValue)/ tScale;
				var xAdvance=Laya.__parseInt(tAttribute["xadvance"].nodeValue)/ tScale;
				var region=new Rectangle();
				region.x=Laya.__parseInt(tAttribute["x"].nodeValue);
				region.y=Laya.__parseInt(tAttribute["y"].nodeValue);
				region.width=Laya.__parseInt(tAttribute["width"].nodeValue);
				region.height=Laya.__parseInt(tAttribute["height"].nodeValue);
				var tTexture=Texture.create(texture,region.x,region.y,region.width,region.height,xOffset,yOffset);
				this._maxHeight=Math.max(this._maxHeight,tTexture.height);
				this._maxWidth=Math.max(this._maxWidth,tTexture.width);
				this._minWordWidth=Math.min(this._minWordWidth,tTexture.width);
				this._fontCharDic[tId]=tTexture;
			}
			if (this.getBitmapByText(" ")){
				this.setSpaceWidth(this.getWordWidth(" "));
			}
		}

		/**
		*@private
		*通过字符找到相对应的字体纹理
		*@param text
		*@return
		*/
		__proto.getBitmapByText=function(text){
			return this._fontCharDic[text.charCodeAt(0)];
		}

		/**
		*销毁位图字体，调用Text.unregisterBitmapFont时，默认会销毁
		*/
		__proto.destory=function(){
			var tTexture=null;
			for (var p in this._fontCharDic){
				tTexture=this._fontCharDic[p];
				if (tTexture){
					tTexture.destroy();
				}
				delete this._fontCharDic[p];
			}
			this._texture.destroy();
		}

		/**
		*设置空格的宽（如果有字体库有空格，这里就可以不用设置了）
		*@param spaceWidth
		*/
		__proto.setSpaceWidth=function(spaceWidth){
			this._spaceWidth=spaceWidth;
		}

		/**
		*@private
		*得到单个字符的宽
		*@param word
		*@return
		*/
		__proto.getWordWidth=function(word){
			if (word==" "){
				return this._spaceWidth;
			};
			var tTexture=this.getBitmapByText(word)
			if (tTexture){
				return tTexture.width+tTexture.offsetX *2;
			}
			return 0;
		}

		/**
		*@private
		*得到最大字符的宽
		*@return
		*/
		__proto.getWordMaxWidth=function(){
			return this._maxWidth;
		}

		/**
		*@private
		*得到一段文本的宽
		*@param words
		*@return
		*/
		__proto.getWordsWidth=function(words){
			var tWidth=0;
			for (var i=0,n=words.length;i < n;i++){
				tWidth+=this.getWordWidth(words[i]);
			}
			return tWidth;
		}

		/**
		*得到当前字符的高度（这里用最大字符的高度）
		*@return
		*/
		__proto.getWordHeight=function(){
			return this._maxHeight;
		}

		/**
		*@private
		*画一段文字
		*@param words
		*@param sprite
		*@param drawX
		*@param drawY
		*@param align
		*@param width
		*/
		__proto.drawWords=function(words,sprite,drawX,drawY,align,width){
			var tWidth=0;
			var tTexture;
			for (var i=0,n=words.length;i <n;i++){
				tWidth+=this.getWordWidth(words[i]);
			};
			var dx=0;
			align==="center" && (dx=(width-tWidth)/ 2);
			align==="right" && (dx=(width-tWidth));
			var tX=0;
			for (i=0,n=words.length;i < n;i++){
				tTexture=this.getBitmapByText(words[i]);
				if (tTexture){
					sprite.graphics.drawTexture(tTexture,drawX+tX+dx,drawY,tTexture.width,tTexture.height);
				}
				tX+=this.getWordWidth(words[i]);
			}
		}

		return BitmapFont;
	})()


	/**
	*<code>Style</code> 类是元素样式定义类。
	*@author yung
	*/
	//class laya.display.css.Style
	var Style=(function(){
		function Style(){
			this._type=0;
			this.alpha=1;
			this.visible=true;
			//this.scrollRect=null;
			//this.blendMode=null;
			this._transform=Style._TRANSFORMEMPTY;
		}

		__class(Style,'laya.display.css.Style');
		var __proto=Style.prototype;
		/**
		*返回是否需要 2D、3D 转化。
		*@return
		*/
		__proto.withTransform=function(){
			return this._transform===Style._TRANSFORMEMPTY;
		}

		/**
		*定义 X 轴、Y 轴移动转换。
		*@param x
		*@param y
		*/
		__proto.translate=function(x,y){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.translateX=x;
			this._transform.translateY=y;
		}

		/**
		*定义 缩放转换。
		*@param x
		*@param y
		*/
		__proto.scale=function(x,y){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.scaleX=x;
			this._transform.scaleY=y;
		}

		/**
		*销毁此对象。
		*/
		__proto.destroy=function(){
			this.scrollRect=null;
		}

		/**
		*判断传入的对象是否设置了有效的 width 属性。
		*@param sprite
		*@return
		*/
		__proto.widthed=function(sprite){
			return sprite.width > 0;
		}

		/**
		*渲染传入的显示对象。
		*@param sprite
		*@param context
		*@param x
		*@param y
		*/
		__proto.render=function(sprite,context,x,y){}
		/**
		*获取默认的CSS样式对象。
		*@return
		*/
		__proto.getCSSStyle=function(){
			return CSSStyle.EMPTY;
		}

		/**@private */
		__proto._enableLayout=function(){
			return false;
		}

		/**
		*表示元素是否显示为块级元素。
		*/
		__getset(0,__proto,'block',function(){
			return (this._type & 0x1)!=0;
			},function(value){
			value ? (this._type |=0x1):(this._type &=(~0x1));
		});

		/**
		*表示元素的上内边距。
		*/
		__getset(0,__proto,'paddingTop',function(){
			return 0;
		});

		/**
		*X 轴缩放值。
		*/
		__getset(0,__proto,'scaleX',function(){
			return this._transform.scaleX;
			},function(value){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.scaleX=value;
		});

		/**
		*Y 轴缩放值。
		*/
		__getset(0,__proto,'scaleY',function(){
			return this._transform.scaleY;
			},function(value){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.scaleY=value;
		});

		/**
		*元素应用的 2D 或 3D 转换的值。该属性允许我们对元素进行旋转、缩放、移动或倾斜。
		*/
		__getset(0,__proto,'transform',function(){
			return this._transform;
			},function(value){
			(value==='none')&& (this._transform=Style._TRANSFORMEMPTY);
		});

		/**
		*定义转换，只是用 X 轴的值。
		*/
		__getset(0,__proto,'translateX',function(){
			return this._transform.translateX;
			},function(value){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.translateX=value;
		});

		/**
		*定义转换，只是用 Y 轴的值。
		*/
		__getset(0,__proto,'translateY',function(){
			return this._transform.translateY;
			},function(value){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.translateY=value;
		});

		/**
		*定义旋转角度。
		*/
		__getset(0,__proto,'rotate',function(){
			return this._transform.rotate;
			},function(value){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.rotate=value;
		});

		/**
		*定义沿着 X 轴的 2D 倾斜转换。
		*/
		__getset(0,__proto,'skewX',function(){
			return this._transform.skewX;
			},function(value){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.skewX=value;
		});

		/**
		*定义沿着 Y 轴的 2D 倾斜转换。
		*/
		__getset(0,__proto,'skewY',function(){
			return this._transform.skewY;
			},function(value){
			this._transform===Style._TRANSFORMEMPTY && (this._transform=Style._createTransform());
			this._transform.skewY=value;
		});

		/**
		*是否为绝对定位。
		*/
		__getset(0,__proto,'absolute',function(){
			return true;
		});

		/**
		*表示元素的左内边距。
		*/
		__getset(0,__proto,'paddingLeft',function(){
			return 0;
		});

		Style._createTransform=function(){
			return {translateX:0,translateY:0,scaleX:1,scaleY:1,rotate:0,skewX:0,skewY:0};
		}

		Style.__init__=function(){
			Style._TRANSFORMEMPTY=Style._createTransform();
			Style.EMPTY=new Style();
		}

		Style._TRANSFORMEMPTY=null;
		Style.EMPTY=null;
		Style._CSS_BLOCK=0x1;
		Style._DISPLAY_NONE=0x2;
		Style._ABSOLUTE=0x4;
		Style._WIDTH_SET=0x8;
		return Style;
	})()


	/**
	*<code>Font</code> 类是字体显示定义类。
	*@author laya
	*/
	//class laya.display.css.Font
	var Font=(function(){
		function Font(src){
			this._type=0;
			this._weight=0;
			this._decoration=null;
			this._text=null;
			this.indent=0;
			this._color=Color.create(Font.defaultColor);
			this.family=Font.defaultFamily;
			this.stroke=Font._STROKE;
			this.size=Font.defaultSize;
			src && src!==Font.EMPTY && src.copyTo(this);
		}

		__class(Font,'laya.display.css.Font');
		var __proto=Font.prototype;
		/**
		*设置字体样式字符串。
		*@param value
		*/
		__proto.set=function(value){
			this._text=null;
			var strs=value.split(' ');
			for (var i=0,n=strs.length;i < n;i++){
				var str=strs[i];
				switch (str){
					case 'italic':
						this.italic=true;
						continue ;
					case 'bold':
						this.bold=true;
						continue ;
					}
				if (str.indexOf('px')> 0){
					this.size=Laya.__parseInt(str);
					this.family=strs[i+1];
					i++;
					continue ;
				}
			}
		}

		/**
		*返回字体样式字符串。
		*@return
		*/
		__proto.toString=function(){
			this._text=""
			this.italic && (this._text+="italic ");
			this.bold && (this._text+="bold ");
			return this._text+=this.size+"px "+this.family;
		}

		/**
		*将当前的属性值复制到传入的 <code>Font</code> 对象。
		*@param dec
		*/
		__proto.copyTo=function(dec){
			dec._type=this._type;
			dec._text=this._text;
			dec._weight=this._weight;
			dec._color=this._color;
			dec.family=this.family;
			dec.stroke=this.stroke !=Font._STROKE ? this.stroke.slice():Font._STROKE;
			dec.indent=this.indent;
			dec.size=this.size;
		}

		/**
		*表示颜色字符串。
		*/
		__getset(0,__proto,'color',function(){
			return this._color.strColor;
			},function(value){
			this._color=Color.create(value);
		});

		/**
		*规定添加到文本的修饰。
		*/
		__getset(0,__proto,'decoration',function(){
			return this._decoration ? this._decoration.value :"none";
			},function(value){
			var strs=value.split(' ');
			this._decoration || (this._decoration={});
			switch (strs[0]){
				case '_':
					this._decoration.type='underline'
					break ;
				case '-':
					this._decoration.type='line-through'
					break ;
				case 'overline':
					this._decoration.type='overline'
					break ;
				default :
					this._decoration.type=strs[0];
				}
			strs[1] && (this._decoration.color=Color.create(strs));
			this._decoration.value=value;
		});

		/**
		*表示是否为斜体。
		*/
		__getset(0,__proto,'italic',function(){
			return (this._type & 0x200)!==0;
			},function(value){
			value ? (this._type |=0x200):(this._type &=~0x200);
		});

		/**
		*表示是否为粗体。
		*/
		__getset(0,__proto,'bold',function(){
			return (this._type & 0x800)!==0;
			},function(value){
			value ? (this._type |=0x800):(this._type &=~0x800);
		});

		/**
		*表示是否为密码格式。
		*/
		__getset(0,__proto,'password',function(){
			return (this._type & 0x400)!==0;
			},function(value){
			value ? (this._type |=0x400):(this._type &=~0x400);
		});

		/**
		*文本的粗细。
		*/
		__getset(0,__proto,'weight',function(){
			return ""+this._weight;
			},function(value){
			var weight=0;
			switch (value){
				case 'normal':
					break ;
				case 'bold':
					this.bold=true;
					weight=700;
					break ;
				case 'bolder':
					weight=800;
					break ;
				case 'lighter':
					weight=100;
					break ;
				default :
					weight=Laya.__parseInt(value);
				}
			this._weight=weight;
			this._text=null;
		});

		Font.__init__=function(){
			Font.EMPTY=new Font(null);
		}

		Font.EMPTY=null
		Font.defaultColor="#000000";
		Font.defaultSize=12;
		Font.defaultFamily="Arial";
		Font.defaultFont="12px Arial";
		Font._STROKE=[0,"#000000"];
		Font._ITALIC=0x200;
		Font._PASSWORD=0x400;
		Font._BOLD=0x800;
		return Font;
	})()


	/**
	*<code>Graphics</code> 类用于创建绘图显示对象。
	*
	*@see laya.display.Sprite#graphics
	*@author yung
	*/
	//class laya.display.Graphics
	var Graphics=(function(){
		function Graphics(){
			this._one=null;
			this._cmds=null;
			this._temp=null;
			this._bounds=null;
			this._rstBoundPoints=null;
			//this.sp=null;
			this._render=this._renderEmpty;
			this._render=this._renderEmpty;
		}

		__class(Graphics,'laya.display.Graphics');
		var __proto=Graphics.prototype;
		/**
		*<p>销毁此对象。</p>
		*/
		__proto.destroy=function(){
			this.clear();
			this._temp=null;
			this._bounds=null;
			this._rstBoundPoints=null;
			this.sp && (this.sp._renderType=0);
			this.sp=null;
		}

		/**
		*<p>清理此对象。</p>
		*/
		__proto.clear=function(){
			this._one=null;
			this._render=this._renderEmpty;
			this._cmds=null;
			this._temp && (this._temp.length=0);
			this.repaint();
		}

		__proto.empty=function(){
			return this._one===null && (!this._cmds || this._cmds.length===0);
		}

		/**
		*重绘此对象。
		*/
		__proto.repaint=function(){
			this._temp && (this._temp.length=0);
			this.sp && this.sp.repaint();
		}

		/**@private */
		__proto._isOnlyOne=function(){
			return !this._cmds || this._cmds.length===0;
		}

		/**
		*获取位置及宽高信息矩阵(比较耗，尽量少用)。
		*/
		__proto.getBounds=function(){
			if (!this._bounds || !this._temp || this._temp.length < 1){
				this._bounds=Rectangle._getWrapRec(this.getBoundPoints(),this._bounds)
			}
			return this._bounds;
		}

		/**
		*@private
		*获取端点列表。
		*@return
		*/
		__proto.getBoundPoints=function(){
			if (!this._temp || this._temp.length < 1)
				this._temp=this.getCmdPoints();
			return this._rstBoundPoints=Utils1.setValueArr(this._rstBoundPoints,this._temp);
		}

		__proto.getCmdPoints=function(){
			var context=Render.context;
			var cmds=this._cmds;
			var rst;
			rst=this._temp || (this._temp=[]);
			rst.length=0;
			if (!cmds && this._one !=null){
				cmds=[this._one];
			}
			if (!cmds)
				return [];
			var matrixs;
			matrixs=[];
			var tMatrix=new Matrix();
			var tempMatrix=Graphics._tempMatrix;
			var cmd;
			for (var i=0,n=cmds.length;i < n;i++){
				cmd=cmds[i];
				switch (cmd.callee){
					case context.save:
						matrixs.push(tMatrix);
						tMatrix=tMatrix.clone();
						break ;
					case context.restore:
						tMatrix=matrixs.pop();
						break ;
					case context._scale:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[2],-cmd[3]);
						tempMatrix.scale(cmd[0],cmd[1]);
						tempMatrix.translate(cmd[2],cmd[3]);
						this.switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._rotate:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.rotate(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this.switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._translate:
						tempMatrix.identity();
						tempMatrix.translate(cmd[0],cmd[1]);
						this.switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._transform:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.concat(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this.switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._drawTexture:
						if (cmd[3] && cmd[4]){
							Graphics.addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
							}else {
							var tex=cmd[0];
							Graphics.addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tMatrix);
						}
						break ;
					case context._drawRect:
					case context._fillRect:
						Graphics.addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
						break ;
					case context._drawCircle:
					case context._fillCircle:
						Graphics.addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0]-cmd[2],cmd[1]-cmd[2],cmd[2]+cmd[2],cmd[2]+cmd[2]),tMatrix);
						break ;
					case context._drawLine:
						Graphics.addPointArrToRst(rst,[cmd[0],cmd[1],cmd[2],cmd[3]],tMatrix);
						break ;
					case context.drawCurves:
						Graphics.addPointArrToRst(rst,Bezier.I.getBezierPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPoly:
						Graphics.addPointArrToRst(rst,cmd[2],tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPath:
						Graphics.addPointArrToRst(rst,this.getPathPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPie:
					case context._drawPieWebGL:
						Graphics.addPointArrToRst(rst,this.getPiePoints(cmd[0],cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
						break ;
					}
			}
			if (rst.length > 200){
				rst=Utils1.setValueArr(rst,Rectangle._getWrapRec(rst)._getBoundPoints());
			}else if (rst.length > 8)
			rst=GrahamScan.scanPList(rst);
			return rst;
		}

		__proto.switchMatrix=function(tMatix,tempMatrix){
			tempMatrix.concat(tMatix);
			tempMatrix.copy(tMatix);
		}

		/**
		*绘制纹理。
		*@param tex 纹理。
		*@param x X轴偏移量。
		*@param y Y轴偏移量。
		*@param width 宽度。
		*@param height 高度。
		*@param m 矩阵信息。
		*/
		__proto.drawTexture=function(tex,x,y,width,height,m){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			if (!width)width=tex.width;
			if (!height)height=tex.height;
			var args=[tex,x,y,width,height,m];
			if (this._one==null){
				this._one=args;
				this._render=this._renderOneImg;
				}else {
				this._render=this._renderAll;
				(this._cmds || (this._cmds=[])).length===0 && this._cmds.push(this._one);
				this._cmds.push(args);
			}
			args.callee=m ? Render.context._drawTextureWithTransform :Render.context._drawTexture;
			this.repaint();
		}

		__proto.textureLoaded=function(tex,param){
			tex.off("loaded",this,this.textureLoaded);
			param[3]=tex.width;
			param[4]=tex.height;
			this.repaint();
		}

		/**
		*绘制纹理对象。
		*@param tex
		*@param x
		*@param y
		*@param width
		*@param height
		*/
		__proto.drawRenderTarget=function(tex,x,y,width,height){
			var mat=new Matrix(1,0,0,-1,0,height);
			this.drawTexture(tex,x,y,width,height,mat);
		}

		/**
		*@private
		*保存到命令流。
		*@param fun
		*@param args
		*@return
		*/
		__proto._saveToCmd=function(fun,args){
			if (this._one==null){
				this._one=args;
				this._render=this._renderOne;
				}else {
				this._render=this._renderAll;
				(this._cmds || (this._cmds=[])).length===0 && this._cmds.push(this._one);
				this._cmds.push(args);
			}
			args.callee=fun;
			this._temp && (this._temp.length=0);
			this.repaint();
			return args;
		}

		/**
		*画布的剪裁区域,超出剪裁区域的坐标可以画图,但不能显示。
		*@param x X轴偏移量。
		*@param y Y轴偏移量。
		*@param width 宽度。
		*@param height 高度。
		*/
		__proto.clipRect=function(x,y,width,height){
			this._saveToCmd(Render.context._clipRect,arguments);
		}

		/**
		*在画布上绘制“被填充的”文本。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字体和字号。
		*@param color 定义文本颜色。
		*@param textAlign 文本对齐反式。
		*/
		__proto.fillText=function(text,x,y,font,color,textAlign){
			this._saveToCmd(Render.context._fillText,[text,x,y,font || Font.defaultFont,color,textAlign]);
		}

		/**
		*在画布上绘制“被填充且镶边的”文本。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字体和字号。
		*@param fillColor 定义文本颜色。
		*@param borderColor 定义镶边文本颜色。
		*@param lineWidth 镶边线条宽度。
		*@param textAlign 文本对齐方式。
		*/
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			this._saveToCmd(Render.context._fillBorderText,[text,x,y,font || Font.defaultFont,fillColor,borderColor,lineWidth,textAlign]);
		}

		/**
		*在画布上绘制文本（没有填色）。文本的默认颜色是黑色。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字体和字号。
		*@param color 定义文本颜色。
		*@param lineWidth 线条宽度。
		*@param textAlign 文本对齐方式。
		*/
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this._saveToCmd(Render.context._strokeText,[text,x,y,font || Font.defaultFont,color,lineWidth,textAlign]);
		}

		/**
		*设置透明度。
		*@param value
		*/
		__proto.alpha=function(value){
			this._saveToCmd(Render.context._alpha,arguments);
		}

		/**
		*设置混合模式。
		*@param value
		*/
		__proto.blendMode=function(value){
			this._saveToCmd(Render.context._blendMode,arguments);
		}

		/**
		*替换绘图的当前转换矩阵。
		*@param mat 矩阵。
		*@param pivotX 水平方向轴心点坐标。
		*@param pivotY 垂直方向轴心点坐标。
		*/
		__proto.transform=function(mat,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render.context._transform,[mat,pivotX,pivotY]);
		}

		/**
		*旋转当前绘图。
		*@param angle 旋转角度，以弧度计。
		*@param pivotX 水平方向轴心点坐标。
		*@param pivotY 垂直方向轴心点坐标。
		*/
		__proto.rotate=function(angle,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render.context._rotate,[angle,pivotX,pivotY]);
		}

		/**
		*缩放当前绘图至更大或更小。
		*@param scaleX 水平方向缩放值。
		*@param scaleY 垂直方向缩放值。
		*@param pivotX 水平方向轴心点坐标。
		*@param pivotY 垂直方向轴心点坐标。
		*/
		__proto.scale=function(scaleX,scaleY,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render.context._scale,[scaleX,scaleY,pivotX,pivotY]);
		}

		/**
		*重新映射画布上的 (0,0)位置。
		*@param x 添加到水平坐标（x）上的值。
		*@param y 添加到垂直坐标（y）上的值。
		*/
		__proto.translate=function(x,y){
			this._saveToCmd(Render.context._translate,[x,y]);
		}

		/**
		*保存当前环境的状态。
		*/
		__proto.save=function(){
			this._saveToCmd(Render.context.save,arguments);
		}

		/**
		*返回之前保存过的路径状态和属性。
		*/
		__proto.restore=function(){
			this._saveToCmd(Render.context.restore,arguments);
		}

		/**
		*替换文本内容。
		*@param text 文本内容。
		*@return
		*/
		__proto.replaceText=function(text){
			this.repaint();
			var cmds=this._cmds;
			if (!cmds){
				return this._one && this._one.callee===Render.context._fillText && (this._one[0]=text,true);
			}
			for (var i=cmds.length-1;i >-1;i--){
				if (cmds[i].callee===Render.context._fillText){
					cmds[i][0]=text;
					return true;
				}
			}
			return false;
		}

		/**
		*替换文本颜色。
		*@param color 颜色。
		*@return
		*/
		__proto.replaceTextColor=function(color){
			this.repaint();
			var cmds=this._cmds;
			if (!cmds){
				return this._one && (this._one.callee===Render.context._fillBorderText || this._one.callee===Render.context._fillText)&& (this._one[4]=color,true);
			}
			for (var i=cmds.length-1;i >-1;i--){
				if (cmds[i].callee===Render.context._fillText){
					cmds[i][4]=color;
					return true;
				}
			}
			return false;
		}

		/**
		*加载并显示一个图片。
		*@param url 图片地址。
		*@param x 显示图片的x位置
		*@param y 显示图片的y位置
		*@param width 显示图片的宽度，设置为0表示使用图片默认宽度
		*@param height 显示图片的高度，设置为0表示使用图片默认高度
		*@param complete 加载完成回调
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			var tex=Loader.getRes(url);
			if (tex)onloaded(tex);
			else Laya.loader.load(url,Handler.create(null,onloaded));
			function onloaded (tex){
				_$this.drawTexture(tex,x,y,width,height);
				if (complete !=null)complete.call(_$this.sp,tex);
			}
		}

		/**
		*@private
		*@param sprite
		*@param context
		*@param x
		*@param y
		*/
		__proto._renderEmpty=function(sprite,context,x,y){}
		/**
		*@private
		*@param sprite
		*@param context
		*@param x
		*@param y
		*/
		__proto._renderAll=function(sprite,context,x,y){
			var cmds=this._cmds,cmd;
			for (var i=0,n=cmds.length;i < n;i++){
				(cmd=cmds[i]).callee.call(context,x,y,cmd);
			}
		}

		/**
		*@private
		*@param sprite
		*@param context
		*@param x
		*@param y
		*/
		__proto._renderOne=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
		}

		/**
		*@private
		*@param sprite
		*@param context
		*@param x
		*@param y
		*/
		__proto._renderOneImg=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
			sprite._renderType |=0x01;
		}

		/**
		*绘制一条线。
		*@param fromX X开始位置。
		*@param fromY Y开始位置。
		*@param toX X结束位置。
		*@param toY Y结束位置。
		*@param lineColor 颜色。
		*@param lineWidth 线条宽度。
		*/
		__proto.drawLine=function(fromX,fromY,toX,toY,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var arr=[fromX+0.5,fromY+0.5,toX+0.5,toY+0.5,lineColor,lineWidth];
			this._saveToCmd(Render.context._drawLine,arr);
		}

		/**
		*绘制一系列线段。
		*@param points 线段的点集合，格式[x,y,x,y,x,y...]。
		*@param lineColor 线段颜色，或者填充绘图的渐变对象。
		*@param lineWidth 线段宽度。
		*/
		__proto.drawLines=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var arr=[x+0.5,y+0.5,points,lineColor,lineWidth];
			if (Render.isWebGl)
				arr[3]=Color.create(lineColor).numColor;
			this._saveToCmd(Render.isWebGl ? Render.context.drawLinesWebGL :Render.context.drawLines,arr);
		}

		/**
		*绘制一系列曲线。
		*@param points 线段的点集合，格式[startx,starty,ctrx,ctry,startx,starty...]。
		*@param lineColor 线段颜色，或者填充绘图的渐变对象。
		*@param lineWidth 线段宽度。
		*/
		__proto.drawCurves=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var arr=[x+0.5,y+0.5,points,lineColor,lineWidth];
			this._saveToCmd(Render.context.drawCurves,arr);
		}

		/**
		*绘制矩形。
		*@param x 开始绘制的x位置。
		*@param y 开始绘制的y位置。
		*@param width 矩形宽度。
		*@param height 矩形高度。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawRect=function(x,y,width,height,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var arr=[x+offset,y+offset,width,height,fillColor,lineColor,lineWidth];
			this._saveToCmd(Render.context._drawRect,arr);
		}

		/**
		*绘制圆形。
		*@param x 圆点x位置。
		*@param y 圆点y位置。
		*@param radius 半径。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawCircle=function(x,y,radius,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var arr=[x+offset,y+offset,radius,fillColor,lineColor,lineWidth];
			if (Render.isWebGl){
				arr[3]=fillColor ? Color.create(fillColor).numColor :fillColor;
				arr[4]=lineColor ? Color.create(lineColor).numColor :lineColor;
			}
			this._saveToCmd(Render.isWebGl ? Render.context._drawCircleWebGL :Render.context._drawCircle,arr);
		}

		/**
		*绘制扇形。
		*@param x 开始绘制的x位置。
		*@param y 开始绘制的y位置。
		*@param radius 扇形半径。
		*@param startAngle 开始角度。
		*@param endAngle 结束角度。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawPie=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var arr=[x+offset,y+offset,radius,startAngle,endAngle,fillColor,lineColor,lineWidth];
			if (Render.isWebGl){
				startAngle=90-startAngle;
				endAngle=90-endAngle;
				arr[5]=fillColor ? Color.create(fillColor).numColor :fillColor;
				arr[6]=lineColor ? Color.create(lineColor).numColor :lineColor;
			}
			arr[3]=Utils1.toRadian(startAngle);
			arr[4]=Utils1.toRadian(endAngle);
			this._saveToCmd(Render.isWebGl ? Render.context._drawPieWebGL :Render.context._drawPie,arr);
		}

		__proto.getPiePoints=function(x,y,radius,startAngle,endAngle){
			var rst;
			rst=[x,y];
			var dP=Math.PI / 10;
			var i=NaN;
			for (i=startAngle;i < endAngle;i+=dP){
				rst.push(x+radius *Math.cos(i),y+radius *Math.sin(i));
			}
			if (endAngle !=i){
				rst.push(x+radius *Math.cos(endAngle),y+radius *Math.sin(endAngle));
			}
			return rst;
		}

		/**
		*绘制多边形。
		*@param points 多边形的点集合。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawPoly=function(x,y,points,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var arr=[x+offset,y+offset,points,fillColor,lineColor,lineWidth];
			this._saveToCmd(Render.context._drawPoly,arr);
		}

		__proto.getPathPoints=function(paths){
			var i=0,len=0;
			var rst=[];
			len=paths.length;
			var tCMD;
			for (i=0;i < len;i++){
				tCMD=paths[i];
				if (tCMD.length > 1){
					rst.push(tCMD[1],tCMD[2]);
					if (tCMD.length > 3){
						rst.push(tCMD[3],tCMD[4]);
					}
				}
			}
			return rst;
		}

		/**
		*绘制路径。
		*@param x 开始绘制的x位置。
		*@param y 开始绘制的y位置。
		*@param paths 路径集合，路径支持以下格式：[["moveTo",x,y],["lineTo",x,y],["arcTo",x1,y1,x2,y2,r],["closePath"]]。
		*@param brush 刷子定义，支持以下设置{fillStyle}。
		*@param pen 画笔定义，支持以下设置{strokeStyle,lineWidth,lineJoin,lineCap,miterLimit}。
		*/
		__proto.drawPath=function(x,y,paths,brush,pen){
			var arr=[x+0.5,y+0.5,paths,brush,pen];
			this._saveToCmd(Render.context._drawPath,arr);
		}

		/**@private */
		/**
		*命令流。
		*@private
		*/
		__getset(0,__proto,'cmds',function(){
			return this._cmds;
			},function(value){
			this._cmds=value;
			this._render=this._renderAll;
			this.repaint();
		});

		Graphics.addPointArrToRst=function(rst,points,matrix,dx,dy){
			(dx===void 0)&& (dx=0);
			(dy===void 0)&& (dy=0);
			var i=0,len=0;
			len=points.length;
			for (i=0;i < len;i+=2){
				Graphics.addPointToRst(rst,points[i]+dx,points[i+1]+dy,matrix);
			}
		}

		Graphics.addPointToRst=function(rst,x,y,matrix){
			var _tempPoint=Point.TEMP;
			x=x ? x :0;
			y=y ? y :0;
			_tempPoint.setTo(x,y);
			matrix.transformPoint(x,y,_tempPoint);
			rst.push(_tempPoint.x,_tempPoint.y);
		}

		__static(Graphics,
		['_tempMatrix',function(){return this._tempMatrix=new Matrix();}
		]);
		return Graphics;
	})()


	/**
	*键盘事件管理类
	*该类从浏览器中接收键盘事件，并转发该事件
	*转发事件时若Stage.focus为空则只从Stage上派发该事件，不然将从Stage.focus对象开始一直冒泡派发该事件
	*所以在Laya.stage上监听键盘事件一定能够收到，如果在其他地方监听，则必须处在Stage.focus的冒泡链上才能收到该事件
	*用户可以通过代码Laya.stage.focus=someNode的方式来设置focus对象
	*用户可统一的根据事件对象中 e.keyCode来判断按键类型，该属性兼容了不同浏览器的实现
	*其他事件属性可自行从 e 中获取
	*@author ww
	*@version 1.0
	*@created 2015-9-23 上午10:57:26
	*/
	//class laya.events.KeyBoardManager
	var KeyBoardManager=(function(){
		function KeyBoardManager(){};
		__class(KeyBoardManager,'laya.events.KeyBoardManager');
		KeyBoardManager.__init__=function(){
			KeyBoardManager.addEvent("keydown");
			KeyBoardManager.addEvent("keypress");
			KeyBoardManager.addEvent("keyup");
		}

		KeyBoardManager.addEvent=function(type){
			Browser.document.addEventListener(type,function(e){
				laya.events.KeyBoardManager.dispatch(e,type);
			},true);
		}

		KeyBoardManager.dispatch=function(e,type){
			e.keyCode=e.keyCode || e.which || e.charCode;
			if (type==="keydown")KeyBoardManager.pressKeys[e.keyCode]=true;
			else if (type==="keyup")KeyBoardManager.pressKeys[e.keyCode]=null;
			var tar=(Laya.stage.focus && (Laya.stage.focus.event !=null))? Laya.stage.focus :Laya.stage;
			while (tar){
				tar.event(type,e);
				tar=tar.parent;
			}
		}

		KeyBoardManager.hasKeyDown=function(key){
			return KeyBoardManager.pressKeys[key];
		}

		KeyBoardManager.pressKeys={};
		return KeyBoardManager;
	})()


	/**
	*鼠标交互管理器
	*@author yung
	*/
	//class laya.events.MouseManager
	var MouseManager=(function(){
		function MouseManager(){
			this.mouseX=0;
			this.mouseY=0;
			this.disableMouseEvent=false;
			this.mouseDownTime=0;
			this._stage=null;
			this._target=null;
			this._lastOvers=[];
			this._currOvers=[];
			this._lastClickTimer=0;
			this._lastMoveTimer=0;
			this._isDoubleClick=false;
			this._isLeftMouse=false;
			this._eventList=[];
			this._event=new Event();
			this._matrix=new Matrix();
			this._point=new Point();
			this._rect=new Rectangle();
		}

		__class(MouseManager,'laya.events.MouseManager');
		var __proto=MouseManager.prototype;
		__proto.__init__=function(){
			var _$this=this;
			this._stage=Laya.stage;
			var _this=this;
			var canvas=Render.canvas.source;
			var list=this._eventList;
			Browser.document.oncontextmenu=function (e){
				return false;
			}
			canvas.addEventListener('mousedown',function(e){
				e.preventDefault();
				list.push(e);
				_$this.mouseDownTime=Browser.now();
			});
			canvas.addEventListener('mouseup',function(e){
				e.preventDefault();
				list.push(e);
				_$this.mouseDownTime=-Browser.now();
			},true);
			Browser.document.addEventListener('mousemove',function(e){
				var now=Browser.now();
				if (now-_this._lastMoveTimer < 10)return;
				_this._lastMoveTimer=now;
				list.push(e);
			},true);
			canvas.addEventListener("mouseout",function(e){
				list.push(e);
			})
			canvas.addEventListener("mouseover",function(e){
				list.push(e);
			})
			canvas.addEventListener("touchstart",function(e){
				e.preventDefault();
				list.push(e);
				_$this.mouseDownTime=Browser.now();
			});
			canvas.addEventListener("touchend",function(e){
				e.preventDefault();
				list.push(e);
				_$this.mouseDownTime=-Browser.now();
			},true);
			canvas.addEventListener("touchmove",function(e){
				e.preventDefault();
				list.push(e);
			},true);
			canvas.addEventListener('mousewheel',function(e){
				list.push(e);
			});
			canvas.addEventListener('DOMMouseScroll',function(e){
				list.push(e);
			});
		}

		__proto.initEvent=function(e,nativeEvent){
			var _this=laya.events.MouseManager.instance;
			_this._event._stoped=false;
			_this._event.nativeEvent=nativeEvent || e;
			_this._target=null;
			this._point.setTo(e.clientX,e.clientY);
			this._stage._canvasTransform.invertTransformPoint(this._point);
			e.stageX=_this.mouseX=this._point.x;
			e.stageY=_this.mouseY=this._point.y;
			_this._event.touchId=e.identifier;
		}

		__proto.checkMouseWheel=function(e){
			this._event.delta=e.wheelDelta ? e.wheelDelta *0.025 :-e.detail;
			for (var i=0,n=this._lastOvers.length;i < n;i++){
				var ele=this._lastOvers[i];
				ele.event("mousewheel",this._event.setTo("mousewheel",ele,this._target));
			}
		}

		__proto.checkMouseOut=function(){
			if (this.disableMouseEvent)return;
			for (var i=0,n=this._lastOvers.length;i < n;i++){
				var ele=this._lastOvers[i];
				if (this._currOvers.indexOf(ele)< 0){
					ele.$_MOUSEOVER=false;
					ele.event("mouseout",this._event.setTo("mouseout",ele,this._target));
				}
			};
			var temp=this._lastOvers;
			this._lastOvers=this._currOvers;
			this._currOvers=temp;
			this._currOvers.length=0;
		}

		__proto.onMouseMove=function(ele){
			this.sendMouseMove(ele);
			this._event._stoped=false;
			this.sendMouseOver(this._target);
		}

		__proto.sendMouseMove=function(ele){
			ele.event("mousemove",this._event.setTo("mousemove",ele,this._target));
			!this._event._stoped && ele.parent && this.sendMouseMove(ele.parent);
		}

		__proto.sendMouseOver=function(ele){
			if (ele.parent){
				if (!ele.$_MOUSEOVER){
					ele.$_MOUSEOVER=true;
					ele.event("mouseover",this._event.setTo("mouseover",ele,this._target));
				}
				this._currOvers.push(ele);
			}
			!this._event._stoped && ele.parent && this.sendMouseOver(ele.parent);
		}

		__proto.onMouseDown=function(ele){
			if (this._isLeftMouse){
				ele.$_MOUSEDOWN=true;
				ele.event("mousedown",this._event.setTo("mousedown",ele,this._target));
				}else {
				ele.$_RIGHTMOUSEDOWN=true;
				ele.event("rightmousedown",this._event.setTo("rightmousedown",ele,this._target));
			}
			!this._event._stoped && ele.parent && this.onMouseDown(ele.parent);
		}

		__proto.onMouseUp=function(ele){
			var type=this._isLeftMouse ? "mouseup" :"rightmouseup";
			this.sendMouseUp(ele,type);
			this._event._stoped=false;
			this.sendClick(this._target,type);
		}

		__proto.sendMouseUp=function(ele,type){
			ele.event(type,this._event.setTo(type,ele,this._target));
			!this._event._stoped && ele.parent && this.sendMouseUp(ele.parent,type);
		}

		__proto.sendClick=function(ele,type){
			if (type==="mouseup" && ele.$_MOUSEDOWN){
				ele.$_MOUSEDOWN=false;
				ele.event("click",this._event.setTo("click",ele,this._target));
				this._isDoubleClick && ele.event("doubleclick",this._event.setTo("doubleclick",ele,this._target));
				}else if (type==="rightmouseup" && ele.$_RIGHTMOUSEDOWN){
				ele.$_RIGHTMOUSEDOWN=false;
				ele.event("rightclick",this._event.setTo("rightclick",ele,this._target));
			}
			!this._event._stoped && ele.parent && this.sendClick(ele.parent,type);
		}

		__proto.check=function(sp,mouseX,mouseY,callBack){
			var transform=sp.transform || this._matrix;
			var pivotX=sp.pivotX;
			var pivotY=sp.pivotY;
			if (pivotX===0 && pivotY===0){
				transform.setTranslate(sp.x,sp.y);
				}else {
				if (transform===this._matrix){
					transform.setTranslate(sp.x-pivotX,sp.y-pivotY);
					}else {
					var cos=transform.cos;
					var sin=transform.sin;
					transform.setTranslate(sp.x-(pivotX *cos-pivotY *sin)*sp.scaleX,sp.y-(pivotX *sin+pivotY *cos)*sp.scaleY);
				}
			}
			transform.invertTransformPoint(this._point.setTo(mouseX,mouseY));
			transform.setTranslate(0,0);
			mouseX=this._point.x;
			mouseY=this._point.y;
			var scrollRect=sp.scrollRect;
			if (scrollRect){
				this._rect.setTo(0,0,scrollRect.width,scrollRect.height);
				var isHit=this._rect.contains(mouseX,mouseY);
				if (!isHit)return false;
			}
			if (!this.disableMouseEvent){
				var flag=false;
				for (var i=sp._childs.length-1;i >-1;i--){
					var child=sp._childs[i];
					if (child.mouseEnabled && child.visible){
						flag=this.check(child,mouseX+(scrollRect ? scrollRect.x :0),mouseY+(scrollRect ? scrollRect.y :0),callBack);
						if (flag)return true;
					}
				}
			}
			if (sp.width > 0 && sp.height > 0){
				var graphicHit=false;
				var hitRect=this._rect;
				if (!sp.mouseThrough){
					if (sp.hitArea)hitRect=sp.hitArea;
					else hitRect.setTo(0,0,sp.width,sp.height);
					isHit=hitRect.contains(mouseX,mouseY);
					}else {
					isHit=sp.getGraphicBounds().contains(mouseX,mouseY);
				}
				if (isHit){
					this._target=sp;
					callBack.call(this,sp);
				}
			}
			return isHit;
		}

		__proto.runEvent=function(){
			var len=this._eventList.length;
			if (!len)return;
			var _this=this;
			var i=0;
			while (i < len){
				var evt=this._eventList[i];
				switch (evt.type){
					case 'mousedown':
						_this._isLeftMouse=evt.button===0;
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						break ;
					case 'mouseup':
						_this._isLeftMouse=evt.button===0;
						var now=Browser.now();
						_this._isDoubleClick=(now-_this._lastClickTimer)< 300;
						_this._lastClickTimer=now;
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
						break ;
					case 'mousemove':
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
						_this.checkMouseOut();
						break ;
					case "touchstart":
						_this._isLeftMouse=true;
						var touches=evt.changedTouches;
						for (var j=0,n=touches.length;j < n;j++){
							_this.initEvent(touches[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						}
						break ;
					case "touchend":
						_this._isLeftMouse=true;
						var touchends=evt.changedTouches;
						for (j=0,n=touchends.length;j < n;j++){
							_this.initEvent(touchends[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
						}
						break ;
					case "touchmove":;
						var touchemoves=evt.changedTouches;
						for (j=0,n=touchemoves.length;j < n;j++){
							_this.initEvent(touchemoves[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
						}
						_this.checkMouseOut();
						break ;
					case "wheel":
					case "mousewheel":
					case "DOMMouseScroll":
						_this.checkMouseWheel(evt);
						break ;
					case "mouseout":
						_this._stage.event("mouseout",_this._event.setTo("mouseout",_this._stage,_this._stage));
						break ;
					case "mouseover":
						_this._stage.event("mouseover",_this._event.setTo("mouseover",_this._stage,_this._stage));
						break ;
					}
				i++;
			}
			this._eventList.length=0;
		}

		__static(MouseManager,
		['instance',function(){return this.instance=new MouseManager();}
		]);
		return MouseManager;
	})()


	/**
	*...
	*@author wk
	*/
	//class laya.filters.Filter
	var Filter=(function(){
		function Filter(){
			this._action=null;
		}

		__class(Filter,'laya.filters.Filter');
		var __proto=Filter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		__getset(0,__proto,'type',function(){return-1});
		__getset(0,__proto,'action',function(){return this._action});
		Filter.BLUR=0x10;
		Filter.COLOR=0x20;
		Filter.GLOW=0x08;
		Filter._filterStart=null
		Filter._filterEnd=null
		Filter._EndTarget=null
		Filter._recycleScope=null
		Filter._filter=null
		return Filter;
	})()


	//class laya.filters.ColorFilterAction
	var ColorFilterAction=(function(){
		function ColorFilterAction(){
			this.data
		}

		__class(ColorFilterAction,'laya.filters.ColorFilterAction');
		var __proto=ColorFilterAction.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterAction":true})
		__proto.apply=function(srcCanvas){
			var ctx=srcCanvas.ctx.ctx;
			var canvas=srcCanvas.ctx.ctx.canvas;
			if (canvas.width==0 || canvas.height==0)return canvas;
			var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
			var data=imgdata.data;
			var nData;
			for (var i=0,n=data.length;i < n;i+=4){
				nData=this.getColor(data[i],data[i+1],data[i+2],data[i+3]);
				if (data[i+3]==0)continue ;
				data[i]=nData[0];
				data[i+1]=nData[1];
				data[i+2]=nData[2];
				data[i+3]=nData[3];
			}
			ctx.putImageData(imgdata,0,0);
			return srcCanvas;
		}

		__proto.getColor=function(red,green,blue,alpha){
			var rst=[];
			if (this.data._elements){
				var a=this.data._elements;
				rst[0]=a[0] *red+a[1] *green+a[2] *blue+a[3] *alpha+a[4];
				rst[1]=a[5] *red+a[6] *green+a[7] *blue+a[8] *alpha+a[9];
				rst[2]=a[10] *red+a[11] *green+a[12] *blue+a[13] *alpha+a[14];
				rst[3]=a[15] *red+a[16] *green+a[17] *blue+a[18] *alpha+a[19];
			}
			return rst;
		}

		return ColorFilterAction;
	})()


	//class laya.maths.Arith
	var Arith=(function(){
		function Arith(){};
		__class(Arith,'laya.maths.Arith');
		Arith.formatR=function(r){
			if (r > Math.PI)r-=Math.PI *2;
			if (r <-Math.PI)r+=Math.PI *2;
			return r;
		}

		Arith.isPOT=function(w,h){
			return (w > 0 && (w & (w-1))===0 && h > 0 && (h & (h-1))===0);
		}

		Arith.setMatToArray=function(mat,array){
			mat.a,mat.b,0,0,mat.c,mat.d,0,0,0,0,1,0,mat.tx+20,mat.ty+20,0,1
			array[0]=mat.a;
			array[1]=mat.b;
			array[4]=mat.c;
			array[5]=mat.d;
			array[12]=mat.tx;
			array[13]=mat.ty;
		}

		return Arith;
	})()


	/**
	*计算贝塞尔曲线的工具类
	*...
	*@author ww
	*/
	//class laya.maths.Bezier
	var Bezier=(function(){
		function Bezier(){
			this.controlPoints=[new Point(),new Point(),new Point()];
			this._calFun=this.getPoint2;
		}

		__class(Bezier,'laya.maths.Bezier');
		var __proto=Bezier.prototype;
		__proto.switchPoint=function(x,y){
			var tPoint=this.controlPoints.shift();
			tPoint.setTo(x,y);
			this.controlPoints.push(tPoint);
		}

		/**
		*计算二次贝塞尔点
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint2=function(t,rst){
			var p1=this.controlPoints[0];
			var p2=this.controlPoints[1];
			var p3=this.controlPoints[2];
			var lineX=Math.pow((1-t),2)*p1.x+2 *t *(1-t)*p2.x+Math.pow(t,2)*p3.x;
			var lineY=Math.pow((1-t),2)*p1.y+2 *t *(1-t)*p2.y+Math.pow(t,2)*p3.y;
			rst.push(lineX,lineY);
		}

		/**
		*计算三次贝塞尔点
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint3=function(t,rst){
			var p1=this.controlPoints[0];
			var p2=this.controlPoints[1];
			var p3=this.controlPoints[2];
			var p4=this.controlPoints[3];
			var lineX=Math.pow((1-t),3)*p1.x+3 *p2.x *t *(1-t)*(1-t)+3 *p3.x *t *t *(1-t)+p4.x *Math.pow(t,3);
			var lineY=Math.pow((1-t),3)*p1.y+3 *p2.y *t *(1-t)*(1-t)+3 *p3.y *t *t *(1-t)+p4.y *Math.pow(t,3);
			rst.push(lineX,lineY);
		}

		/**
		*计算贝塞尔点序列
		*@param count
		*@param rst
		*
		*/
		__proto.insertPoints=function(count,rst){
			var i=0,len=0;
			count=count > 0 ? count :5;
			len=count;
			var dLen=NaN;
			dLen=1 / count;
			for (i=0;i <=1;i+=dLen){
				this._calFun(i,rst);
			}
		}

		/**
		*获取贝塞尔曲线上的点
		*@param pList 控制点[x0,y0,x1,y1...]
		*@param inSertCount 每次曲线的插值数量
		*@return
		*
		*/
		__proto.getBezierPoints=function(pList,inSertCount,count){
			(inSertCount===void 0)&& (inSertCount=5);
			(count===void 0)&& (count=2);
			var i=0,len=0;
			len=pList.length;
			if (len < (count+1)*2)return [];
			var rst;
			rst=[];
			switch (count){
				case 2:
					this._calFun=this.getPoint2;
					break ;
				case 3:
					this._calFun=this.getPoint3;
					break ;
				default :
					return [];
				}
			for (i=0;i < count *2;i+=2){
				this.switchPoint(pList[i],pList[i+1]);
			}
			for (i=count *2;i < len;i+=2){
				this.switchPoint(pList[i],pList[i+1]);
				if ((i / 2)% count==0)
					this.insertPoints(inSertCount,rst);
			}
			return rst;
		}

		__static(Bezier,
		['I',function(){return this.I=new Bezier();}
		]);
		return Bezier;
	})()


	/**
	*凸包算法
	*@author ww
	*@version 1.0
	*
	*@created 2015-9-22 下午4:16:41
	*/
	//class laya.maths.GrahamScan
	var GrahamScan=(function(){
		function GrahamScan(){};
		__class(GrahamScan,'laya.maths.GrahamScan');
		GrahamScan.multiply=function(p1,p2,p0){
			return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));
		}

		GrahamScan.dis=function(p1,p2){
			return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
		}

		GrahamScan.getPoints=function(count,tempUse,rst){
			(tempUse===void 0)&& (tempUse=false);
			if (!GrahamScan._mPointList)GrahamScan._mPointList=[];
			while (GrahamScan._mPointList.length < count)GrahamScan._mPointList.push(new Point());
			if (!rst)rst=[];
			rst.length=0;
			if (tempUse){
				Utils1.getFrom(rst,GrahamScan._mPointList,count);
				}else {
				Utils1.getFromR(rst,GrahamScan._mPointList,count);
			}
			return rst;
		}

		GrahamScan.pListToPointList=function(pList,tempUse){
			(tempUse===void 0)&& (tempUse=false);
			var i=0,len=pList.length / 2,rst=GrahamScan.getPoints(len,tempUse,GrahamScan._tempPointList);
			for (i=0;i < len;i++){
				rst[i].setTo(pList[i+i],pList[i+i+1]);
			}
			return rst;
		}

		GrahamScan.pointListToPlist=function(pointList){
			var i=0,len=pointList.length,rst=GrahamScan._temPList,tPoint;
			rst.length=0;
			for (i=0;i < len;i++){
				tPoint=pointList[i];
				rst.push(tPoint.x,tPoint.y);
			}
			return rst;
		}

		GrahamScan.scanPList=function(pList){
			return Utils1.setValueArr(pList,GrahamScan.pointListToPlist(GrahamScan.scan(GrahamScan.pListToPointList(pList,true))));
		}

		GrahamScan.scan=function(PointSet){
			var i=0,j=0,k=0,top=2,tmp,n=PointSet.length,ch;
			var _tmpDic={};
			var key;
			ch=GrahamScan._temArr;
			ch.length=0;
			n=PointSet.length;
			for (i=n-1;i >=0;i--){
				tmp=PointSet[i];
				key=tmp.x+"_"+tmp.y;
				if (!_tmpDic.hasOwnProperty(key)){
					_tmpDic[key]=true;
					ch.push(tmp);
				}
			}
			n=ch.length;
			Utils1.setValueArr(PointSet,ch);
			for (i=1;i < n;i++)
			if ((PointSet[i].y < PointSet[k].y)|| ((PointSet[i].y==PointSet[k].y)&& (PointSet[i].x < PointSet[k].x)))
				k=i;
			tmp=PointSet[0];
			PointSet[0]=PointSet[k];
			PointSet[k]=tmp;
			for (i=1;i < n-1;i++){
				k=i;
				for (j=i+1;j < n;j++)
				if ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])> 0)|| ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])==0)&& (GrahamScan.dis(PointSet[0],PointSet[j])< GrahamScan.dis(PointSet[0],PointSet[k]))))
					k=j;
				tmp=PointSet[i];
				PointSet[i]=PointSet[k];
				PointSet[k]=tmp;
			}
			ch=GrahamScan._temArr;
			ch.length=0;
			if (PointSet.length < 3){
				return Utils1.setValueArr(ch,PointSet);
			}
			ch.push(PointSet[0],PointSet[1],PointSet[2]);
			for (i=3;i < n;i++){
				while (ch.length >=2 && GrahamScan.multiply(PointSet[i],ch[ch.length-1],ch[ch.length-2])>=0)ch.pop();
				PointSet[i] && ch.push(PointSet[i]);
			}
			return ch;
		}

		GrahamScan._mPointList=null
		GrahamScan._tempPointList=[];
		GrahamScan._temPList=[];
		GrahamScan._temArr=[];
		return GrahamScan;
	})()


	/**
	*矩阵
	*@author yung
	*/
	//class laya.maths.Matrix
	var Matrix=(function(){
		function Matrix(a,b,c,d,tx,ty){
			this.cos=1;
			this.sin=0;
			//this.a=NaN;
			//this.b=NaN;
			//this.c=NaN;
			//this.d=NaN;
			//this.tx=NaN;
			//this.ty=NaN;
			this.bTransform=false;
			this.inPool=false;
			(a===void 0)&& (a=1);
			(b===void 0)&& (b=0);
			(c===void 0)&& (c=0);
			(d===void 0)&& (d=1);
			(tx===void 0)&& (tx=0);
			(ty===void 0)&& (ty=0);
			this.a=a;
			this.b=b;
			this.c=c;
			this.d=d;
			this.tx=tx;
			this.ty=ty;
			this._checkTransform();
		}

		__class(Matrix,'laya.maths.Matrix');
		var __proto=Matrix.prototype;
		__proto.identity=function(){
			this.a=this.d=1;
			this.b=this.tx=this.ty=this.c=0;
			this.bTransform=false;
			return this;
		}

		__proto._checkTransform=function(){
			return this.bTransform=(this.a!==1 || this.b!==0 || this.c!==0 || this.d!==1);
		}

		__proto.setTranslate=function(x,y){
			this.tx=x;
			this.ty=y;
		}

		__proto.translate=function(x,y){
			this.tx+=x;
			this.ty+=y;
			return this;
		}

		__proto.scale=function(x,y){
			this.a *=x;
			this.d *=y;
			this.c *=x;
			this.b *=y;
			this.tx *=x;
			this.ty *=y;
			this.bTransform=true;
		}

		__proto.rotate=function(angle){
			var cos=this.cos=Math.cos(angle);
			var sin=this.sin=Math.sin(angle);
			var a1=this.a;
			var c1=this.c;
			var tx1=this.tx;
			this.a=a1 *cos-this.b *sin;
			this.b=a1 *sin+this.b *cos;
			this.c=c1 *cos-this.d *sin;
			this.d=c1 *sin+this.d *cos;
			this.tx=tx1 *cos-this.ty *sin;
			this.ty=tx1 *sin+this.ty *cos;
			this.bTransform=true;
		}

		__proto.skew=function(x,y){
			var tanX=Math.tan(x);
			var tanY=Math.tan(y);
			var a1=this.a;
			var b1=this.b;
			this.a+=tanY *this.c;
			this.b+=tanY *this.d;
			this.c+=tanX *a1;
			this.d+=tanX *b1;
			return this;
		}

		__proto.invertTransformPoint=function(out){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			var a2=d1 / n;
			var b2=-b1 / n;
			var c2=-c1 / n;
			var d2=a1 / n;
			var tx2=(c1 *this.ty-d1 *tx1)/ n;
			var ty2=-(a1 *this.ty-b1 *tx1)/ n;
			out.setTo(a2 *out.x+c2 *out.y+tx2,b2 *out.x+d2 *out.y+ty2);
		}

		__proto.transformPoint=function(x,y,out){
			out.setTo(this.a *x+this.c *y+this.tx,this.b *x+this.d *y+this.ty);
		}

		__proto.transformPointArray=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y+this.tx;
				out[i+1]=this.b *x+this.d *y+this.ty;
			}
		}

		__proto.transformPointArrayScale=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y;
				out[i+1]=this.b *x+this.d *y;
			}
		}

		__proto.getScaleX=function(){
			return this.b===0 ? this.a :Math.sqrt(this.a *this.a+this.b *this.b);
		}

		__proto.getScaleY=function(){
			return this.c===0 ? this.d :Math.sqrt(this.c *this.c+this.d *this.d);
		}

		__proto.invert=function(){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			this.a=d1 / n;
			this.b=-b1 / n;
			this.c=-c1 / n;
			this.d=a1 / n;
			this.tx=(c1 *this.ty-d1 *tx1)/ n;
			this.ty=-(a1 *this.ty-b1 *tx1)/ n;
			return this;
		}

		__proto.setTo=function(a,b,c,d,tx,ty){
			this.a=a,this.b=b,this.c=c,this.d=d,this.tx=tx,this.ty=ty;
			return this;
		}

		__proto.concat=function(mtx){
			var a=this.a;
			var c=this.c;
			var tx=this.tx;
			this.a=a *mtx.a+this.b *mtx.c;
			this.b=a *mtx.b+this.b *mtx.d;
			this.c=c *mtx.a+this.d *mtx.c;
			this.d=c *mtx.b+this.d *mtx.d;
			this.tx=tx *mtx.a+this.ty *mtx.c+mtx.tx;
			this.ty=tx *mtx.b+this.ty *mtx.d+mtx.ty;
			return this;
		}

		__proto.clone=function(){
			var no=Matrix._cache;
			var dec=!no._length ? (new Matrix()):no[--no._length];
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		__proto.copy=function(dec){
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		__proto.toString=function(){
			return this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty;
		}

		//内存管理应该是数学计算以外的事情不能放到这里哎
		__proto.destroy=function(){
			if (this.inPool)return;
			var cache=Matrix._cache;
			this.inPool=true;
			cache._length || (cache._length=0);
			cache[cache._length++]=this;
			this.a=this.d=1;
			this.b=this.c=this.tx=this.ty=0;
			this.bTransform=false;
		}

		Matrix.mul=function(m1,m2,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			var ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPre=function(m1,ba,bb,bc,bd,btx,bty,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPos=function(m1,aa,ab,ac,ad,atx,aty,out){
			var ba=m1.a,bb=m1.b,bc=m1.c,bd=m1.d,btx=m1.tx,bty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.preMul=function(parent,self,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			var na=self.a,nb=self.b,nc=self.c,nd=self.d,ntx=self.tx,nty=self.ty;
			out.a=na *pa;
			out.b=out.c=0;
			out.d=nd *pd;
			out.tx=ntx *pa+parent.tx;
			out.ty=nty *pd+parent.ty;
			if (nb!==0 || nc!==0 || pb!==0 || pc!==0){
				out.a+=nb *pc;
				out.d+=nc *pb;
				out.b+=na *pb+nb *pd;
				out.c+=nc *pa+nd *pc;
				out.tx+=nty *pc;
				out.ty+=ntx *pb;
			}
			return out;
		}

		Matrix.preMulXY=function(parent,x,y,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			out.a=pa;
			out.b=pb;
			out.c=pc;
			out.d=pd;
			out.tx=x *pa+parent.tx+y *pc;
			out.ty=y *pd+parent.ty+x *pb;
			return out;
		}

		Matrix.create=function(){
			var cache=Matrix._cache;
			var mat=!cache._length ? (new Matrix()):cache[--cache._length];
			mat.inPool=false;
			return mat;
		}

		Matrix.EMPTY=new Matrix();
		Matrix.TEMP=new Matrix();
		Matrix._cache=[];
		return Matrix;
	})()


	/**
	*Point类
	*@author yung
	*/
	//class laya.maths.Point
	var Point=(function(){
		function Point(x,y){
			//this.x=NaN;
			//this.y=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			this.x=x;
			this.y=y;
		}

		__class(Point,'laya.maths.Point');
		var __proto=Point.prototype;
		__proto.setTo=function(x,y){
			this.x=x;
			this.y=y;
			return this;
		}

		Point.TEMP=new Point();
		Point.EMPTY=new Point();
		return Point;
	})()


	/**
	*矩形
	*@author yung
	*/
	//class laya.maths.Rectangle
	var Rectangle=(function(){
		function Rectangle(x,y,width,height){
			//this.x=NaN;
			//this.y=NaN;
			//this.width=NaN;
			//this.height=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
		}

		__class(Rectangle,'laya.maths.Rectangle');
		var __proto=Rectangle.prototype;
		/**
		*将 Rectangle 的成员设置为指定值
		*@param x 矩形左上角的 x 坐标。
		*@param y 矩形左上角的 y 坐标。
		*@param width 矩形的宽度。
		*@param height 矩形的高。
		*@return 返回矩形对象本身
		*/
		__proto.setTo=function(x,y,width,height){
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*复制 source 对象的值到此矩形对象中。
		*@param sourceRect 源 Rectangle 对象
		*@return 返回对象本身
		*/
		__proto.copyFrom=function(source){
			this.x=source.x;
			this.y=source.y;
			this.width=source.width;
			this.height=source.height;
			return this;
		}

		/**
		*确定此矩形对象是否包含指定的点。
		*@param x 点的 x 坐标（水平位置）。
		*@param y 点的 y 坐标（垂直位置）。
		*@return 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
		*/
		__proto.contains=function(x,y){
			if (this.width <=0 || this.height <=0)return false;
			if (x >=this.x && x < this.right){
				if (y >=this.y && y < this.bottom){
					return true;
				}
			}
			return false;
		}

		/**
		*确定在 rect 参数中指定的对象是否与此 Rectangle 对象相交。
		*@param rect 要与此 Rectangle 对象比较的 Rectangle 对象
		*@return 如果相交，则返回 true 值，否则返回 false
		*/
		__proto.intersects=function(rect){
			return !(rect.x > this.right || rect.right < this.x || rect.y > this.bottom || rect.bottom < this.y);
		}

		/**
		*获取和某个矩形区域相交的区域
		*@param rect 比较的矩形区域
		*@param out 输出的矩形区域，尽量用此对象复用对象，减少对象创建消耗
		*@return 返回相交的矩形区域
		*/
		__proto.intersection=function(rect,out){
			if (!this.intersects(rect))return null;
			out || (out=new Rectangle());
			out.x=Math.max(this.x,rect.x);
			out.y=Math.max(this.y,rect.y);
			out.width=Math.min(this.right,rect.right)-out.x;
			out.height=Math.min(this.bottom,rect.bottom)-out.y;
			return out;
		}

		/**
		*通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象
		*@param 目标矩形对象
		*@param out 输出的矩形区域，尽量用此对象复用对象，减少对象创建消耗
		*@return 充当两个矩形的联合的新 Rectangle 对象
		*/
		__proto.union=function(source,out){
			out || (out=new Rectangle());
			this.clone(out);
			if (source.width <=0 || source.height <=0)return out;
			out.addPoint(source.x,source.y);
			out.addPoint(source.right,source.bottom);
			return this;
		}

		/**
		*返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
		*@param out 输出的矩形区域，尽量用此对象复用对象，减少对象创建消耗
		*@return 新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
		*/
		__proto.clone=function(out){
			out || (out=new Rectangle());
			out.x=this.x;
			out.y=this.y;
			out.width=this.width;
			out.height=this.height;
			return out;
		}

		/**
		*生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
		*/
		__proto.toString=function(){
			return this.x+","+this.y+","+this.width+","+this.height;
		}

		/**
		*确定在 rect 参数中指定的对象是否等于此 Rectangle 对象。
		*@param rect 要与此 Rectangle 对象进行比较的矩形
		*@return 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false
		*/
		__proto.equal=function(rect){
			if (!rect || rect.x!==this.x || rect.y!==this.y || rect.width!==this.width || rect.height!==this.height)return false;
			return true;
		}

		/**
		*在矩形区域中加一个点
		*@param x x坐标
		*@param y y坐标
		*@return 返回此对象
		*/
		__proto.addPoint=function(x,y){
			this.x > x && (this.width+=this.x-x,this.x=x);
			this.y > y && (this.height+=this.y-y,this.y=y);
			if (this.width < x-this.x)this.width=x-this.x;
			if (this.height < y-this.y)this.height=y-this.y;
			return this;
		}

		/**
		*返回代表当前矩形的顶点数据
		*@return 顶点数据
		*@private
		*/
		__proto._getBoundPoints=function(){
			var rst=Rectangle._temB;
			rst.length=0;
			if (this.width==0 || this.height==0)return rst;
			rst.push(this.x,this.y,this.x+this.width,this.y,this.x,this.y+this.height,this.x+this.width,this.y+this.height);
			return rst;
		}

		/**x 和 width 属性的和。*/
		__getset(0,__proto,'right',function(){
			return this.x+this.width;
		});

		/**y 和 height 属性的和。*/
		__getset(0,__proto,'bottom',function(){
			return this.y+this.height;
		});

		Rectangle._getBoundPointS=function(x,y,width,height){
			var rst=Rectangle._temA;
			rst.length=0;
			if (width==0 || height==0)return rst;
			rst.push(x,y,x+width,y,x,y+height,x+width,y+height);
			return rst;
		}

		Rectangle._getWrapRec=function(pointList,rst){
			if (!pointList || pointList.length < 1)return rst ? rst.setTo(0,0,0,0):Rectangle.EMPTY;
			rst=rst ? rst :new Rectangle();
			var i,len=pointList.length,minX,maxX,minY,maxY,tPoint=Point.TEMP;
			minX=minY=99999;
			maxX=maxY=-minX;
			for (i=0;i < len;i+=2){
				tPoint.x=pointList[i];
				tPoint.y=pointList[i+1];
				minX=minX < tPoint.x ? minX :tPoint.x;
				minY=minY < tPoint.y ? minY :tPoint.y;
				maxX=maxX > tPoint.x ? maxX :tPoint.x;
				maxY=maxY > tPoint.y ? maxY :tPoint.y;
			}
			return rst.setTo(minX,minY,maxX-minX,maxY-minY);
		}

		Rectangle.EMPTY=new Rectangle();
		Rectangle.TEMP=new Rectangle();
		Rectangle._temB=[];
		Rectangle._temA=[];
		return Rectangle;
	})()


	/**
	*声音管理类
	*@author ww
	*@version 1.0
	*@created 2015-9-10 下午2:35:21
	*/
	//class laya.media.SoundManager
	var SoundManager=(function(){
		function SoundManager(){};
		__class(SoundManager,'laya.media.SoundManager');
		/**
		*是否失去焦点后自动停止背景音乐
		*@param v
		*
		*/
		/**
		*是否失去焦点后自动停止背景音乐
		*@return
		*
		*/
		__getset(1,SoundManager,'autoStopMusic',function(){
			return SoundManager._autoStopMusic;
			},function(v){
			Laya.stage.off("blur",null,SoundManager.stageOnBlur);
			Laya.stage.off("focus",null,SoundManager.stageOnFocus);
			SoundManager._autoStopMusic=v;
			if (v){
				Laya.stage.on("blur",null,SoundManager.stageOnBlur);
				Laya.stage.on("focus",null,SoundManager.stageOnFocus);
			}
		});

		/**是否静音*/
		__getset(1,SoundManager,'muted',function(){
			return SoundManager._muted;
			},function(value){
			if (value){
				if (SoundManager._tMusic)
					SoundManager.stopSound(SoundManager._tMusic);
			}
			SoundManager._muted=value;
		});

		/**是否音效静音*/
		__getset(1,SoundManager,'soundMuted',function(){
			return SoundManager._soundMuted;
			},function(value){
			SoundManager._soundMuted=value;
		});

		/**是否背景音乐静音*/
		__getset(1,SoundManager,'musicMuted',function(){
			return SoundManager._musicMuted;
			},function(value){
			if (value){
				if (SoundManager._tMusic)
					SoundManager.stopSound(SoundManager._tMusic);
			}
			SoundManager._musicMuted=value;
		});

		SoundManager.addChannel=function(channel){
			SoundManager._channels.push(channel);
		}

		SoundManager.removeChannel=function(channel){
			var i=0;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				if (SoundManager._channels[i]==channel){
					SoundManager._channels.splice(i,1);
				}
			}
		}

		SoundManager.stageOnBlur=function(){
			if (SoundManager._musicChannel){
				if (!SoundManager._musicChannel.isStopped){
					SoundManager._blurPaused=true;
					SoundManager._musicChannel.stop();
				}
			}
		}

		SoundManager.stageOnFocus=function(){
			if (SoundManager._blurPaused){
				SoundManager.playMusic(SoundManager._tMusic);
				SoundManager._blurPaused=false;
			}
		}

		SoundManager.playSound=function(url,loops,complete){
			(loops===void 0)&& (loops=1);
			if (SoundManager._muted)
				return null;
			var tSound=Laya.loader.getRes(url);
			if (!tSound){
				tSound=new Sound();
				tSound.load(url);
				Loader.cacheRes(url,tSound);
			};
			var channel;
			channel=tSound.play(0,loops);
			channel.volume=(url==SoundManager._tMusic)? SoundManager.musicVolume :SoundManager.soundVolume;
			channel.completeHandler=complete;
			return channel;
		}

		SoundManager.destroySound=function(url){
			var tSound=Laya.loader.getRes(url);
			if (tSound){
				Loader.clearRes(url);
				tSound.dispose();
			}
		}

		SoundManager.playMusic=function(url,loops,complete){
			(loops===void 0)&& (loops=0);
			SoundManager._tMusic=url;
			if (SoundManager._musicChannel)
				SoundManager._musicChannel.stop();
			return SoundManager._musicChannel=SoundManager.playSound(url,loops,complete);
		}

		SoundManager.stopSound=function(url){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.stop();
				}
			}
		}

		SoundManager.stopMusic=function(){
			if (SoundManager._musicChannel)
				SoundManager._musicChannel.stop();
		}

		SoundManager.setSoundVolume=function(volume,url){
			if (url){
				SoundManager._setVolume(url,volume);
			}
			else{
				SoundManager.soundVolume=volume;
			}
		}

		SoundManager.setMusicVolume=function(volume){
			SoundManager.musicVolume=volume;
			SoundManager._setVolume(SoundManager._tMusic,volume);
		}

		SoundManager._setVolume=function(url,volume){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.volume=volume;
				}
			}
		}

		SoundManager.musicVolume=1;
		SoundManager.soundVolume=1;
		SoundManager._muted=false;
		SoundManager._soundMuted=false;
		SoundManager._musicMuted=false;
		SoundManager._tMusic=null;
		SoundManager._musicChannel=null;
		SoundManager._channels=[];
		SoundManager._autoStopMusic=false;
		SoundManager._blurPaused=false;
		return SoundManager;
	})()


	/**
	*<p> <code>URL</code> 类用于定义地址信息。</p>
	*@author laya
	*/
	//class laya.net.URL
	var URL=(function(){
		function URL(url){
			this._url=null;
			this._path=null;
			this._url=URL.formatURL(url);
			this._path=URL.getPath(url);
		}

		__class(URL,'laya.net.URL');
		var __proto=URL.prototype;
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		__getset(0,__proto,'path',function(){
			return this._path;
		});

		URL.formatURL=function(url,_basePath){
			if (URL.customFormat !=null)url=URL.customFormat(url,_basePath);
			if (!url)return "null path";
			URL.version[url] && (url+="?v="+URL.version[url]);
			if(url.indexOf(":")>0||url.charAt(0)=='/')return url;
			return (_basePath || URL.rootPath)+url;
		}

		URL.getPath=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(0,ofs+1):"";
		}

		URL.getName=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(ofs+1):url;
		}

		URL.version={};
		URL.basePath="";
		URL.rootPath="";
		URL.customFormat=null
		return URL;
	})()


	/**
	*Render管理类，单例，可以通过Laya.render访问
	*@author yung
	*/
	//class laya.renders.Render
	var Render=(function(){
		/**
		*初始化引擎
		*@param width 游戏窗口宽度
		*@param height 游戏窗口高度
		*@param renderType 渲染类型(auto,canvas,webgl)默认为auto，优先用webgl渲染，如果webgl不可用，则用canvas渲染
		*/
		function Render(width,height){
			Render._mainCanvas=new HTMLCanvas('2D');
			var style=Render._mainCanvas.source.style;
			style.position='absolute';
			style.top=style.left="0px";
			style.background="#000000";
			var isWebGl=Render.WebGL !=null;
			isWebGl && Render.WebGL.init(Render.canvas,width,height);
			Browser.document.body.appendChild(Render._mainCanvas.source);
			Render._context=new RenderContext(width,height,isWebGl ? null :Render._mainCanvas);
			Browser.window.requestAnimationFrame(loop);
			function loop (){
				Laya.stage._loop();
				Browser.window.requestAnimationFrame(loop);
			}
		}

		__class(Render,'laya.renders.Render');
		/**目前使用的渲染器*/
		__getset(1,Render,'context',function(){
			return Render._context;
		});

		/**是否是WebGl模式*/
		__getset(1,Render,'isWebGl',function(){
			return Render.WebGL !=null;
		});

		/**渲染使用的画布*/
		__getset(1,Render,'canvas',function(){
			return Render._mainCanvas;
		});

		Render._context=null
		Render._mainCanvas=null
		Render.WebGL=null
		Render.clear=function(value){
			Render._context.ctx.clear();
		}

		Render.clearAtlas=function(value){
		};

		Render.finish=function(){};
		return Render;
	})()


	/**
	*@private
	*渲染环境
	*/
	//class laya.renders.RenderContext
	var RenderContext=(function(){
		function RenderContext(width,height,canvas){
			this.x=0;
			this.y=0;
			//this.canvas=null;
			//this.ctx=null;
			if (canvas){
				this.ctx=canvas.getContext('2d');
				}else {
				canvas=new HTMLCanvas("3D");
				this.ctx=System.createWebGLContext2D(canvas);
				canvas._setContext(this.ctx);
			}
			canvas.size(width,height);
			this.canvas=canvas;
		}

		__class(RenderContext,'laya.renders.RenderContext');
		var __proto=RenderContext.prototype;
		/**销毁当前渲染环境*/
		__proto.destroy=function(){
			if (this.canvas){
				this.canvas.destroy();
				this.canvas=null;
			}
			if (this.ctx){
				this.ctx.destroy();
				this.ctx=null;
			}
		}

		__proto.drawTexture=function(tex,x,y,width,height){
			tex.loaded && this.ctx.drawTexture(tex,x,y,width,height,this.x,this.y);
		}

		__proto._drawTexture=function(x,y,args){
			args[0].loaded && this.ctx.drawTexture(args[0],args[1],args[2],args[3],args[4],x,y);
		}

		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m){
			tex.loaded && this.ctx.drawTextureWithTransform(tex,x,y,width,height,m,this.x,this.y);
		}

		__proto._drawTextureWithTransform=function(x,y,args){
			args[0].loaded && this.ctx.drawTextureWithTransform(args[0],args[1],args[2],args[3],args[4],args[5],x,y);
		}

		__proto.fillQuadrangle=function(tex,x,y,point4,m){
			this.ctx.fillQuadrangle(tex,x,y,point4,m);
		}

		__proto._fillQuadrangle=function(x,y,args){
			this.ctx.fillQuadrangle(args[0],args[1],args[2],args[3],args[4]);
		}

		__proto.drawCanvas=function(canvas,x,y,width,height){
			this.ctx.drawCanvas(canvas,x+this.x,y+this.y,width,height);
		}

		__proto.drawRect=function(x,y,width,height,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.strokeRect(x+this.x,y+this.y,width,height);
		}

		__proto._drawRect=function(x,y,args){
			var ctx=this.ctx;
			if (args[4] !=null){
				ctx.fillStyle=args[4];
				ctx.fillRect(x+args[0],y+args[1],args[2],args[3]);
			}
			if (args[5] !=null){
				ctx.strokeStyle=args[5];
				ctx.lineWidth=args[6];
				ctx.strokeRect(x+args[0],y+args[1],args[2],args[3]);
			}
		}

		//x:Number,y:Number,points:Array,fillColor:String,lineColor:String=null,lineWidth:Number=1
		__proto._drawPoly=function(x,y,args){
			var ctx=this.ctx;
			ctx.beginPath();
			var points=args[2];
			x+=args[0],y+=args[1];
			ctx.moveTo(x+points[0],y+points[1]);
			var i=2,n=points.length;
			while (i < n){
				ctx.lineTo(x+points[i++],y+points[i++]);
			}
			ctx.closePath();
			this.fillAndStroke(args[3],args[4],args[5]);
		}

		//x:Number,y:Number,paths:Array,brush:Object=null,pen:Object=null
		__proto._drawPath=function(x,y,args){
			var ctx=this.ctx;
			ctx.beginPath();
			x+=args[0],y+=args[1];
			var paths=args[2];
			for (var i=0,n=paths.length;i < n;i++){
				var path=paths[i];
				switch (path[0]){
					case "moveTo":
						ctx.moveTo(x+path[1],y+path[2]);
						break ;
					case "lineTo":
						ctx.lineTo(x+path[1],y+path[2]);
						break ;
					case "arcTo":
						ctx.arcTo(x+path[1],y+path[2],x+path[3],y+path[4],path[5]);
						break ;
					case "closePath":
						ctx.closePath();
						break ;
					}
			};
			var brush=args[3];
			if (brush !=null){
				ctx.fillStyle=brush.fillStyle;
				ctx.fill();
			};
			var pen=args[4];
			if (pen !=null){
				ctx.strokeStyle=pen.strokeStyle;
				ctx.lineWidth=pen.lineWidth || 1;
				ctx.lineJoin=pen.lineJoin;
				ctx.lineCap=pen.lineCap;
				ctx.miterLimit=pen.miterLimit;
				ctx.stroke();
			}
		}

		__proto.fillAndStroke=function(fillColor,strokeColor,lineWidth){
			if (fillColor !=null){
				this.ctx.fillStyle=fillColor;
				this.ctx.fill();
			}
			if (strokeColor !=null){
				this.ctx.strokeStyle=strokeColor;
				this.ctx.lineWidth=lineWidth;
				this.ctx.stroke();
			}
		}

		//矢量方法
		__proto._drawPie=function(x,y,args){
			var ctx=this.ctx;
			ctx.translate(x+args[0],y+args[1]);
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.arc(0,0,args[2],args[3],args[4]);
			ctx.closePath();
			this.fillAndStroke(args[5],args[6],args[7]);
			ctx.translate(-x-args[0],-y-args[1]);
		}

		__proto._drawPieWebGL=function(x,y,args){
			var ctx=this.ctx;
			ctx.lineWidth=args[7];
			ctx.fan(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4],args[5],args[6]);
		}

		__proto.clipRect=function(x,y,width,height){
			this.ctx.clipRect(x+this.x,y+this.y,width,height);
		}

		__proto._clipRect=function(x,y,args){
			this.ctx.clipRect(x+args[0],y+args[1],args[2],args[3]);
		}

		__proto.fillRect=function(x,y,width,height,fillStyle){
			this.ctx.fillRect(x+this.x,y+this.y,width,height,fillStyle);
		}

		__proto._fillRect=function(x,y,args){
			this.ctx.fillRect(x+args[0],y+args[1],args[2],args[3],args[4]);
		}

		__proto.drawCircle=function(x,y,radius,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.stroke();
		}

		__proto._drawCircle=function(x,y,args){
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
			this.fillAndStroke(args[3],args[4],args[5]);
		}

		__proto._drawCircleWebGL=function(x,y,args){
			this.ctx.drawPoly(x+this.x+args[0],y+this.y+args[1],args[2],40,args[4],args[5],args[3]);
		}

		__proto.fillCircle=function(x,y,radius,color){
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.fillStyle=color;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.fill();
		}

		__proto._fillCircle=function(x,y,args){
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.fillStyle=args[3];
			ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
			ctx.fill();
		}

		__proto.setShader=function(shader){
			this.ctx.setShader(shader);
		}

		__proto._setShader=function(x,y,args){
			this.ctx.setShader(args[0]);
		}

		__proto.drawLine=function(fromX,fromY,toX,toY,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.moveTo(this.x+fromX,this.y+fromY);
			ctx.lineTo(this.x+toX,this.y+toY);
			ctx.stroke();
		}

		__proto.drawLinesWebGL=function(x,y,args){
			this.ctx.drawLines(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4]);
		}

		__proto._drawLine=function(x,y,args){
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=args[4];
			ctx.lineWidth=args[5];
			ctx.moveTo(x+args[0],y+args[1]);
			ctx.lineTo(x+args[2],y+args[3]);
			ctx.stroke();
		}

		__proto.drawLines=function(x,y,args){
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=args[3];
			ctx.lineWidth=args[4];
			var points=args[2];
			x+=args[0],y+=args[1];
			ctx.moveTo(x+points[0],y+points[1]);
			var i=2,n=points.length;
			while (i < n){
				ctx.lineTo(x+points[i++],y+points[i++]);
			}
			ctx.stroke();
		}

		//x:Number,y:Number,points:Array,lineColor:String,lineWidth:Number=1
		__proto.drawCurves=function(x,y,args){
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=args[3];
			ctx.lineWidth=args[4];
			var points=args[2];
			x+=args[0],y+=args[1];
			ctx.moveTo(x+points[0],y+points[1]);
			var i=2,n=points.length;
			while (i < n){
				ctx.quadraticCurveTo(x+points[i++],y+points[i++],x+points[i++],y+points[i++]);
			}
			ctx.stroke();
		}

		__proto.draw=function(x,y,args){
			args[0].call(null,this,x,y);
		}

		__proto.clear=function(){
			this.ctx.clear();
		}

		__proto.transform=function(a,b,c,d,tx,ty){
			this.ctx.transform(a,b,c,d,tx,ty);
		}

		__proto.transformByMatrix=function(value){
			this.ctx.transformByMatrix(value);
		}

		__proto._transformByMatrix=function(x,y,args){
			this.ctx.transformByMatrix(args[0]);
		}

		__proto.setTransform=function(a,b,c,d,tx,ty){
			this.ctx.setTransform(a,b,c,d,tx,ty);
		}

		__proto._setTransform=function(x,y,args){
			this.ctx.setTransform(args[0],args[1],args[2],args[3],args[4],args[5]);
		}

		__proto.setTransformByMatrix=function(value){
			this.ctx.setTransformByMatrix(value);
		}

		__proto._setTransformByMatrix=function(x,y,args){
			this.ctx.setTransformByMatrix(args[0]);
		}

		__proto.save=function(){
			this.ctx.save();
		}

		__proto.restore=function(){
			this.ctx.restore();
		}

		__proto.translate=function(x,y){
			this.ctx.translate(x,y);
		}

		__proto._translate=function(x,y,args){
			this.ctx.translate(args[0],args[1]);
		}

		__proto.rotate=function(angle){
			this.ctx.rotate(angle);
		}

		__proto._transform=function(x,y,args){
			this.ctx.translate(args[1]+x,args[2]+y);
			var mat=args[0];
			this.ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
			this.ctx.translate(-x-args[1],-y-args[2]);
		}

		__proto._rotate=function(x,y,args){
			this.ctx.translate(args[1]+x,args[2]+y);
			this.ctx.rotate(args[0]);
			this.ctx.translate(-x-args[1],-y-args[2]);
		}

		__proto._scale=function(x,y,args){
			this.ctx.translate(args[2]+x,args[3]+y);
			this.ctx.scale(args[0],args[1]);
			this.ctx.translate(-x-args[2],-y-args[3]);
		}

		__proto.scale=function(scaleX,scaleY){
			this.ctx.scale(scaleX,scaleY);
		}

		__proto.alpha=function(value){
			this.ctx.globalAlpha=value;
		}

		__proto._alpha=function(x,y,args){
			this.ctx.globalAlpha=args[0];
		}

		__proto.setAlpha=function(value){
			this.ctx.globalAlpha=value;
		}

		__proto._setAlpha=function(x,y,args){
			this.ctx.globalAlpha=args[0];
		}

		__proto.fillWords=function(words,x,y,font,color){
			this.ctx.fillWords(words,x,y,font,color);
		}

		__proto.fillText=function(text,x,y,font,color,textAlign){
			this.ctx.fillText(text,x+this.x,y+this.y,font,color,textAlign);
		}

		__proto._fillText=function(x,y,args){
			this.ctx.fillText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5]);
		}

		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this.ctx.strokeText(text,x+this.x,y+this.y,font,color,lineWidth,textAlign);
		}

		__proto._strokeText=function(x,y,args){
			this.ctx.strokeText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6]);
		}

		__proto._fillBorderText=function(x,y,args){
			this.ctx.fillBorderText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
		}

		__proto.blendMode=function(type){
			this.ctx.globalCompositeOperation=type;
		}

		__proto._blendMode=function(x,y,args){
			this.ctx.globalCompositeOperation=args[0];
		}

		__proto.flush=function(){
			this.ctx.flush && this.ctx.flush();
		}

		__proto.addRenderObject=function(o){
			this.ctx.addRenderObject(o);
		}

		__proto.beginClip=function(x,y,w,h){
			this.ctx.beginClip && this.ctx.beginClip(x,y,w,h);
		}

		__proto._beginClip=function(x,y,args){
			this.ctx.beginClip && this.ctx.beginClip(x+args[0],y+args[1],args[2],args[3]);
		}

		__proto.endClip=function(){
			this.ctx.endClip && this.ctx.endClip();
		}

		__proto._setIBVB=function(x,y,args){
			this.ctx.setIBVB(args[0]+x,args[1]+y,args[2],args[3],args[4],args[5],args[6],args[7]);
		}

		__proto.fillTrangles=function(x,y,args){
			this.ctx.fillTrangles(args[0],args[1],args[2],args[3],args.length > 4 ? args[4] :null);
		}

		__proto._fillTrangles=function(x,y,args){
			this.ctx.fillTrangles(args[0],args[1]+x,args[2]+y,args[3],args[4]);
		}

		__proto.drawPath=function(x,y,args){
			this.ctx.drawPath(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4]);
		}

		// polygon(x:Number,y:Number,r:Number,edges:Number,color:uint,borderWidth:int=2,borderColor:uint=0)
		__proto.drawPoly=function(x,y,args){
			this.ctx.drawPoly(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4],args[5],args[6]);
		}

		__proto.drawParticle=function(x,y,args){
			this.ctx.drawParticle(x+this.x,y+this.y,args[0]);
		}

		__getset(0,__proto,'enableMerge',null,function(value){
			this.ctx.enableMerge=value;
		});

		RenderContext.PI2=2 *Math.PI;
		return RenderContext;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.renders.RenderSprite
	var RenderSprite=(function(){
		function RenderSprite(type,next){
			//this._next=null;
			//this._fun=null;
			this._next=next || RenderSprite.NORENDER;
			switch (type){
				case 0:
					this._fun=this._no;
					return;
				case 0x01:
					this._fun=this._image;
					return;
				case 0x04:
					this._fun=this._alpha;
					return;
				case 0x08:
					this._fun=this._transform;
					return;
				case 0x20:
					this._fun=this._blend;
					return;
				case 0x10:
					this._fun=this._canvas;
					return;
				case 0x40:
					this._fun=this._clip;
					return;
				case 0x80:
					this._fun=this._style;
					return;
				case 0x100:
					this._fun=this._graphics;
					return;
				case 0x400:
					this._fun=this._enableRenderMerge;
					return;
				case 0x800:
					this._fun=this._childs;
					return;
				case 0x200:
					this._fun=this._custom;
					return;
				case 0x01 | 0x100:
					this._fun=this._image2;
					return;
				case 0x01 | 0x08 | 0x100:
					this._fun=this._image2;
					return;
				case 0x02:
					this._fun=Filter._filter;
					return;
				case 0x11111:
					this._fun=RenderSprite._initRenderFun;
					return;
				}
			this.onCreate(type);
		}

		__class(RenderSprite,'laya.renders.RenderSprite');
		var __proto=RenderSprite.prototype;
		__proto.onCreate=function(type){}
		__proto._style=function(sprite,context,x,y){
			sprite._style.render(sprite,context,x,y);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._no=function(sprite,context,x,y){}
		__proto._custom=function(sprite,context,x,y){
			sprite.customRender(context,x,y);
			var style=sprite._style;
			this._next._fun.call(this._next,sprite,context,x-style.translateX,y-style.translateY);
		}

		__proto._clip=function(sprite,context,x,y){
			var next=this._next;
			if (next==RenderSprite.NORENDER)return;
			var r=sprite._style.scrollRect;
			context.ctx.save();
			context.ctx.clipRect(x,y,r.width,r.height);
			next._fun.call(next,sprite,context,x-r.x,y-r.y);
			context.ctx.restore();
		}

		__proto._enableRenderMerge=function(sprite,context,x,y){
			var next=this._next;
			if (next==RenderSprite.NORENDER)return;
			context.ctx.save();
			context.ctx.enableMerge=true;
			next._fun.call(next,sprite,context,x,y);
			context.ctx.restore();
		}

		__proto._blend=function(sprite,context,x,y){
			var style=sprite._style;
			if (style.blendMode){
				context.ctx.globalCompositeOperation=style.blendMode;
			};
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
			var mask=sprite.mask;
			if (mask){
				context.ctx.globalCompositeOperation="destination-in";
				if (mask.numChildren > 0 || !mask.graphics._isOnlyOne()){
					mask.cacheAsBitmap=true;
				}
				mask.render(context,x,y);
			}
			context.ctx.globalCompositeOperation="source-over";
		}

		__proto._graphics=function(sprite,context,x,y){
			var style=sprite._style;
			sprite._graphics && sprite._graphics._render(sprite,context,x-style.translateX,y-style.translateY);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._image=function(sprite,context,x,y){
			if (sprite._graphics._isOnlyOne()){
				var style=sprite._style;
				context.ctx.drawTexture2(x,y,style.translateX,style.translateY,sprite.transform,style.alpha,style.blendMode,sprite._graphics._one);
				}else {
				this._graphics(sprite,context,x,y);
				sprite._renderType &=~ 0x01;
			}
		}

		__proto._image2=function(sprite,context,x,y){
			if (sprite._graphics._isOnlyOne()){
				var style=sprite._style;
				context.ctx.drawTexture2(x,y,style.translateX,style.translateY,sprite.transform,1,null,sprite._graphics._one);
				}else {
				this._graphics(sprite,context,x,y);
				sprite._renderType &=~ 0x01;
			}
		}

		__proto._alpha=function(sprite,context,x,y){
			var style=sprite._style;
			var alpha;
			if ((alpha=style.alpha)> 0.01){
				var temp=context.ctx.globalAlpha;
				context.ctx.globalAlpha *=alpha;
				var next=this._next;
				next._fun.call(next,sprite,context,x,y);
				context.ctx.globalAlpha=temp;
			}
		}

		__proto._transform=function(sprite,context,x,y){
			var transform=sprite.transform,_next=this._next;
			if (transform && _next !=RenderSprite.NORENDER){
				context.save();
				context.transform(transform.a,transform.b,transform.c,transform.d,transform.tx+x,transform.ty+y);
				_next._fun.call(_next,sprite,context,0,0);
				context.restore();
			}else
			_next._fun.call(_next,sprite,context,x,y);
		}

		__proto._childs=function(sprite,context,x,y){
			var style=sprite._style;
			x+=-style.translateX+style.paddingLeft;
			y+=-style.translateY+style.paddingTop;
			var words=sprite._getWords();
			words && context.fillWords(words,x,y,(style).font,(style).color);
			var childs=sprite._childs,n=childs.length,ele;
			if (!sprite.optimizeFloat || sprite.scrollRect==null){
				for (var i=0;i < n;++i)
				(ele=(childs [i]))._style.visible && ele.render(context,x,y);
			}
			else{
				var rect=sprite.scrollRect;
				for (i=0;i < n;++i){
					ele=childs [i];
					if (ele._style.visible && rect.intersects(Rectangle.TEMP.setTo(ele.x,ele.y,ele.width,ele.height)))
						ele.render(context,x,y);
				}
			}
		}

		__proto._canvas=function(sprite,context,x,y){
			var _cacheCanvas=sprite._$P.cacheCanvas;
			var _next=this._next;
			if (!_cacheCanvas){
				_next._fun.call(_next,sprite,tx,x,y);
				return;
			};
			var _repaint=sprite.isRepaint();
			var tx=_cacheCanvas.ctx;
			var canvas;
			var left;
			var top;
			var tRec;
			_repaint=_repaint || (!tx);
			_cacheCanvas.type==='bitmap'?(Stat.canvasBitmap++):(Stat.canvasNormal++);
			if (_repaint){
				left=-sprite.pivotX;
				top=-sprite.pivotY;
				if (!_cacheCanvas._cacheRec)
					_cacheCanvas._cacheRec=new Rectangle();
				var w=sprite.width,h=sprite.height;
				if (sprite.autoSize || w===0 || h===0){
					tRec=sprite.getSelfBounds();
					tRec.x-=sprite.pivotX;
					tRec.y-=sprite.pivotY;
					tRec.width+=20;
					tRec.height+=20;
					_cacheCanvas._cacheRec.copyFrom(tRec);
					tRec=_cacheCanvas._cacheRec;
					}else{
					tRec=_cacheCanvas._cacheRec.setTo(left,top,w,h);
				}
				w=tRec.width;
				h=tRec.height;
				left=tRec.x;
				top=tRec.y;
				if (!tx){
					tx=_cacheCanvas.ctx=new RenderContext(w,h,new HTMLCanvas("AUTO"));
				}
				canvas=tx.canvas;
				if (_cacheCanvas.type==='bitmap')canvas.asBitmap=true;
				canvas.clear();
				(canvas.width !=w || canvas.height !=h)&& canvas.size(w,h);
				_next._fun.call(_next,sprite,tx,-left,-top);
				sprite.applyFilters();
				if (sprite._$P.isStatic)_cacheCanvas.reCache=false;
				Stat.canvasReCache++;
				}else{
				tRec=_cacheCanvas._cacheRec;
				left=tRec.x;
				top=tRec.y;
				canvas=tx.canvas;
			}
			context.drawCanvas(canvas,x+left,y+top,canvas.width,canvas.height);
		}

		RenderSprite.__init__=function(){
			var i=0,len=0;
			var initRender;
			initRender=System.createRenderSprite(0x11111,null);
			len=RenderSprite.renders.length=0x800 *2;
			for (i=0;i < len;i++)
			RenderSprite.renders[i]=initRender;
			RenderSprite.renders[0]=System.createRenderSprite(0,null);
			function _initSame (value,o){
				var n=0;
				for (var i=0;i < value.length;i++){
					n |=value[i];
					RenderSprite.renders[n]=o;
				}
			}
			_initSame([0x01,0x100,0x08,0x04],new RenderSprite(0x01,null));
			RenderSprite.renders[0x01 | 0x100]=System.createRenderSprite(0x01 | 0x100,null);
			RenderSprite.renders[0x01 | 0x08 | 0x100]=new RenderSprite(0x01 | 0x08 | 0x100,null);
		}

		RenderSprite._initRenderFun=function(sprite,context,x,y){
			var type=sprite._renderType;
			var r=RenderSprite.renders[type]=RenderSprite._getTypeRender(type);
			r._fun(sprite,context,x,y);
		}

		RenderSprite._getTypeRender=function(type){
			var rst=null;
			var tType=0x800;
			while (tType > 1){
				if (tType & type)
					rst=System.createRenderSprite(tType,rst);
				tType=tType >> 1;
			}
			return rst;
		}

		RenderSprite.IMAGE=0x01;
		RenderSprite.FILTERS=0x02;
		RenderSprite.ALPHA=0x04;
		RenderSprite.TRANSFORM=0x08;
		RenderSprite.CANVAS=0x10;
		RenderSprite.BLEND=0x20;
		RenderSprite.CLIP=0x40;
		RenderSprite.STYLE=0x80;
		RenderSprite.GRAPHICS=0x100;
		RenderSprite.CUSTOM=0x200;
		RenderSprite.ENABLERENDERMERGE=0x400;
		RenderSprite.CHILDS=0x800;
		RenderSprite.INIT=0x11111;
		RenderSprite.renders=[];
		RenderSprite.NORENDER=new RenderSprite(0,null);
		return RenderSprite;
	})()


	/**
	*@private
	*Context扩展类
	*/
	//class laya.resource.Context
	var Context=(function(){
		function Context(){
			//this._canvas=null;
		}

		__class(Context,'laya.resource.Context');
		var __proto=Context.prototype;
		/***@private */
		__proto.drawCanvas=function(canvas,x,y,width,height){
			Stat.drawCall++;
			this.drawImage(canvas.source,x,y,width,height);
		}

		/***@private */
		__proto.fillRect=function(x,y,width,height,style){
			Stat.drawCall++;
			style && (this.fillStyle=style);
			this.__fillRect(x,y,width,height);
		}

		/***@private */
		__proto.fillText=function(text,x,y,font,color,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				this.fillStyle=color;
				this.textAlign=textAlign;
				this.textBaseline="top";
			}
			this.__fillText(text,x,y);
		}

		/***@private */
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			Stat.drawCall++;
			this.font=font;
			this.fillStyle=fillColor;
			this.textBaseline="top";
			this.strokeStyle=borderColor;
			this.lineWidth=lineWidth;
			this.textAlign=textAlign;
			this.__strokeText(text,x,y);
			this.__fillText(text,x,y);
		}

		/***@private */
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				this.strokeStyle=color;
				this.lineWidth=lineWidth;
				this.textAlign=textAlign;
				this.textBaseline="top";
			}
			this.__strokeText(text,x,y);
		}

		/***@private */
		__proto.transformByMatrix=function(value){
			this.transform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.setTransformByMatrix=function(value){
			this.setTransform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.clipRect=function(x,y,width,height){
			Stat.drawCall++;
			this.beginPath();
			this.rect(x,y,width,height);
			this.clip();
		}

		/***@private */
		__proto.drawTexture=function(tex,x,y,width,height,tx,ty){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.drawImage(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tex.offsetX+tx,y+tex.offsetY+ty,width,height);
		}

		/***@private */
		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,tx,ty){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.save();
			this.transform(m.a,m.b,m.c,m.d,m.tx+tx,m.ty+ty);
			this.drawImage(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tex.offsetX,y+tex.offsetY,width,height);
			this.restore();
		}

		/***@private */
		__proto.drawTexture2=function(x,y,pivotX,pivotY,m,alpha,blendMode,args2){
			'use strict';
			Stat.drawCall++;
			var alphaChanged=alpha!==1;
			if (alphaChanged){
				var temp=this.globalAlpha;
				this.globalAlpha *=alpha;
			};
			var tex=args2[0];
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			if (m){
				this.save();
				this.transform(m.a,m.b,m.c,m.d,m.tx+x,m.ty+y);
				this.drawImage(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX+tex.offsetX,args2[2]-pivotY+tex.offsetY,args2[3],args2[4]);
				this.restore();
				}else {
				this.drawImage(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX+x+tex.offsetX,args2[2]-pivotY+y+tex.offsetY,args2[3],args2[4]);
			}
			if(alphaChanged)this.globalAlpha=temp;
		}

		/***@private */
		__proto.flush=function(){
			return 0;
		}

		/***@private */
		__proto.fillWords=function(words,x,y,font,color){
			font && (this.font=font);
			color && (this.fillStyle=color);
			var _this=this;
			this.textBaseline="top";
			this.textAlign='left';
			for (var i=0,n=words.length;i < n;i++){
				var a=words[i];
				this.__fillText(a.char,a.x+x,a.y+y);
			}
		}

		/***@private */
		__proto.destroy=function(){
			this.canvas.width=this.canvas.height=0;
		}

		/***@private */
		__proto.clear=function(){
			this.clearRect(0,0,this._canvas.width,this._canvas.height);
		}

		/***@private */
		__getset(0,__proto,'enableMerge',function(){
			return false;
			},function(value){
		});

		Context._init=function(canvas,ctx){
			ctx.__fillText=ctx.fillText;
			ctx.__fillRect=ctx.fillRect;
			ctx.__strokeText=ctx.strokeText;
			var funs=['fillWords','fillRect','strokeText','fillText','transformByMatrix','setTransformByMatrix','clipRect','drawTexture','drawTexture2','drawTextureWithTransform','flush','clear','destroy','drawCanvas','fillBorderText'];
			funs.forEach(function(i){
				ctx[i]=Context._default[i];
			});
		}

		Context._default=new Context();
		return Context;
	})()


	/**
	*...
	*@author
	*/
	//class laya.resource.ResourceManager
	var ResourceManager=(function(){
		function ResourceManager(){
			this._id=0;
			this._name=null;
			this._resources=null;
			this._memorySize=0;
			this._garbageCollectionRate=NaN;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=0;
			this._id=ResourceManager._uniqueIDCounter;
			ResourceManager._uniqueIDCounter++;
			this._name="Content Manager";
			ResourceManager._isResourceManagersSorted=false;
			this._memorySize=0;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=1024 *1024 *512;
			this._garbageCollectionRate=0.2;
			ResourceManager._resourceManagers.push(this);
			this._resources=[];
		}

		__class(ResourceManager,'laya.resource.ResourceManager');
		var __proto=ResourceManager.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		/**
		*通过索引获取资源
		*@param 索引
		*@return 资源
		*/
		__proto.getResourceByIndex=function(index){
			return this._resources[index];
		}

		/**
		*获取资源长度
		*@return 资源
		*/
		__proto.getResourcesLength=function(){
			return this._resources.length;
		}

		/**
		*添加资源
		*@param 资源
		*@return 是否成功
		*/
		__proto.addResource=function(resource){
			if (resource.resourceManager)
				resource.resourceManager.removeResource(resource);
			var index=this._resources.indexOf(resource);
			if (index===-1){
				resource._resourceManager=this;
				this._resources.push(resource);
				this.addSize(resource.memorySize);
				resource.on("memorychanged",this,this.addSize);
				return true;
			}
			return false;
		}

		/**
		*移除资源
		*@param 资源
		*@return 是否成功
		*/
		__proto.removeResource=function(resource){
			var index=this._resources.indexOf(resource);
			if (index!==-1){
				this._resources.splice(index,1);
				resource._resourceManager=null;
				this._memorySize-=resource.memorySize;
				resource.off("memorychanged",this,this.addSize);
				return true;
			}
			return false;
		}

		/**卸载所有被本资源管理员载入的资源*/
		__proto.unload=function(){
			if (this===ResourceManager._systemResourceManager)
				throw new Error("systemResourceManager不能被释放！");
			var tempResources=this._resources.slice(0,this._resources.length);
			for (var i=0;i < tempResources.length;i++){
				var resource=tempResources[i];
				resource._resourceManager=null;
				resource.dispose();
			}
			tempResources.length=0;
		}

		/**
		*设置唯一名字
		*@param newName 名字,如果名字重复则自动加上“-copy”
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				if (ResourceManager._resourceManagers[i]._name!==newName || ResourceManager._resourceManagers[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					ResourceManager._isResourceManagersSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**释放资源*/
		__proto.dispose=function(){
			if (this===ResourceManager._systemResourceManager)
				throw new Error("systemResourceManager不能被释放！");
			ResourceManager._resourceManagers.splice(ResourceManager._resourceManagers.indexOf(this),1);
			ResourceManager._isResourceManagersSorted=false;
			for (var i=0;i < this._resources.length;i++){
				var resource=this._resources[i];
				resource._resourceManager=null;
				resource.dispose();
			}
		}

		/**
		*增加内存
		*@param add 添加尺寸
		*/
		__proto.addSize=function(add){
			if (add){
				if (this.autoRelease && add > 0)
					((this._memorySize+add)> this.autoReleaseMaxSize)&& (this.garbageCollection((1-this._garbageCollectionRate)*this.autoReleaseMaxSize));
				this._memorySize+=add;
			}
		}

		/**
		*垃圾回收
		*@param reserveSize 保留尺寸
		*/
		__proto.garbageCollection=function(reserveSize){
			var all=this._resources;
			all=all.slice();
			all.sort(function(a,b){
				if (!a || !b)
					throw new Error("a或b不能为空！");
				if (a.released && b.released)
					return 0;
				else if (a.released)
				return 1;
				else if (b.released)
				return-1;
				return a.lastUseFrameCount-b.lastUseFrameCount;
			});
			var currentFrameCount=Stat.loopCount;
			for (var i=0,n=all.length;i < n;i++){
				var resou=all[i];
				if (currentFrameCount-resou.lastUseFrameCount > 1){
					resou.releaseResource();
					}else {
					if (this._memorySize >=reserveSize)
						this._isOverflow=true;
					return;
				}
				if (this._memorySize < reserveSize){
					this._isOverflow=false;
					return;
				}
			}
		}

		/**
		*获取唯一标识ID
		*@return 编号
		*/
		__getset(0,__proto,'id',function(){
			return this._id;
		});

		/**
		*设置名字
		*@param value 名字
		*/
		/**
		*获取名字
		*@return 名字
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this._name!==value){
				this._name=value;
				ResourceManager._isResourceManagersSorted=false;
			}
		});

		/**
		*获取所管理资源的累计内存,以字节为单位
		*@return 内存尺寸
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
		});

		/**
		*获取排序后资源管理器列表
		*@return 排序后资源管理器列表
		*/
		__getset(1,ResourceManager,'sortedResourceManagersByName',function(){
			if (!ResourceManager._isResourceManagersSorted){
				ResourceManager._isResourceManagersSorted=true;
				ResourceManager._resourceManagers.sort(ResourceManager.compareResourceManagersByName);
			}
			return ResourceManager._resourceManagers;
		});

		/**
		*返回本类型排序后的已载入资源
		*@return 本类型排序后的已载入资源
		*/
		__getset(1,ResourceManager,'systemResourceManager',function(){
			(ResourceManager._systemResourceManager===null)&& (ResourceManager._systemResourceManager=new ResourceManager(),ResourceManager._systemResourceManager._name="System Resource Manager");
			return ResourceManager._systemResourceManager;
		});

		ResourceManager.__init__=function(){
			ResourceManager.currentResourceManager=ResourceManager.systemResourceManager;
		}

		ResourceManager.getLoadedResourceManagerByIndex=function(index){
			return ResourceManager._resourceManagers[index];
		}

		ResourceManager.getLoadedResourceManagersCount=function(){
			return ResourceManager._resourceManagers.length;
		}

		ResourceManager.recreateContentManagers=function(){
			var temp=ResourceManager.currentResourceManager;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
				for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
					ResourceManager.currentResourceManager._resources[i].activeResource(true);
				}
			}
			ResourceManager.currentResourceManager=temp;
		}

		ResourceManager.compareResourceManagersByName=function(left,right){
			if (left==right)
				return 0;
			var x=left._name;
			var y=right._name;
			if (x==null){
				if (y==null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right._name;
						return x.localeCompare(y);
					}
				}
			}
		}

		ResourceManager._uniqueIDCounter=-2147483648;
		ResourceManager._systemResourceManager=null
		ResourceManager._isResourceManagersSorted=false;
		ResourceManager._resourceManagers=[];
		ResourceManager.currentResourceManager=null
		ResourceManager.resourcesDirectory="";
		return ResourceManager;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.system.System
	var System=(function(){
		function System(){};
		__class(System,'laya.system.System');
		System.changeDefinition=function(name,classObj){
			Laya[name]=classObj;
			var str=name+"=classObj";
			eval(str);
		}

		System.__init__=function(){
			System.isConchApp=window.conch ? true :false;;
		}

		System.isConchApp=false;
		System.FILTER_ACTIONS=[];
		System.createRenderSprite=function(type,next){
			return new RenderSprite(type,next);
		}

		System.createGLTextur=null;
		System.createWebGLContext2D=null;
		System.changeWebGLSize=function(w,h){
		};

		System.createGraphics=function(){
			return new Graphics();
		}

		System.createFilterAction=function(type){
			return new ColorFilterAction();
		}

		System.drawToCanvas=function(sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
			var canvas=new HTMLCanvas("2D");
			var context=new RenderContext(canvasWidth,canvasHeight,canvas);
			RenderSprite.renders[_renderType]._fun(sprite,context,offsetX,offsetY);
			return canvas;
		}

		System.addToAtlas=null
		System.createParticleTemplate2D=null
		return System;
	})()


	/**
	*浏览器代理类，封装浏览器及原生js提供的一些功能
	*@author yung
	*/
	//class laya.utils.Browser
	var Browser=(function(){
		function Browser(){};
		__class(Browser,'laya.utils.Browser');
		/**浏览器可视宽度*/
		__getset(1,Browser,'clientWidth',function(){
			return Browser.document.body.clientWidth;
		});

		/**浏览器可视高度*/
		__getset(1,Browser,'clientHeight',function(){
			return Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight;
		});

		/**设备像素比*/
		__getset(1,Browser,'pixelRatio',function(){
			if (Browser._pixelRatio < 0){
				var ctx=laya.utils.Browser.ctx;
				var backingStore=ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
				Browser._pixelRatio=(laya.utils.Browser.window.devicePixelRatio || 1)/ backingStore;
			}
			return Browser._pixelRatio;
		});

		/**浏览器物理宽度*/
		__getset(1,Browser,'width',function(){
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientHeight :Browser.clientWidth)*Browser.pixelRatio;
		});

		/**浏览器物理高度*/
		__getset(1,Browser,'height',function(){
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientWidth :Browser.clientHeight)*Browser.pixelRatio;
		});

		Browser.createElement=function(type){
			return Browser.document.__createElement(type);
		}

		Browser.getElementById=function(type){
			return Browser.document.getElementById(type);
		}

		Browser.removeElement=function(ele){
			if(ele&&ele.parentNode)ele.parentNode.removeChild(ele);
		}

		Browser.now=function(){
			return Date.now();
		}

		Browser.window=null
		Browser.document=null
		Browser.userAgent=navigator.userAgent;
		Browser.u=Browser.userAgent;
		Browser.onIOS=!!Browser.u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
		Browser.onMobile=!!Browser.u.match(/AppleWebKit.*Mobile.*/);
		Browser.onIPhone=Browser.u.indexOf("iPhone")>-1;
		Browser.onIPad=Browser.u.indexOf("iPad")>-1;
		Browser.onAndriod=Browser.u.indexOf('Android')>-1 || Browser.u.indexOf('Adr')>-1;
		Browser.onWP=Browser.u.indexOf("Windows Phone")>-1;
		Browser.onQQBrowser=Browser.u.indexOf("QQBrowser")>-1;
		Browser.onMQQBrowser=Browser.u.indexOf("MQQBrowser")>-1;
		Browser.onWeiXin=Browser.u.indexOf('MicroMessenger')>-1;
		Browser.onPC=!Browser.onMobile;
		Browser.webAudioOK=false;
		Browser.soundType=null
		Browser._pixelRatio=-1;
		__static(Browser,
		['canvas',function(){return this.canvas=new HTMLCanvas('2D');},'ctx',function(){return this.ctx=Browser.canvas.getContext('2d');}
		]);
		Browser.__init$=function(){
			AudioSound;
			WebAudioSound;
			Browser.window=window;
			Browser.document=window.document;
			Browser.document.__createElement=Browser.document.createElement;
			window.requestAnimationFrame=(function(){return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||function (c){return window.setTimeout(c,1000 / 60);};})();
			Browser.webAudioOK=Browser.window["AudioContext"] || Browser.window["webkitAudioContext"] || Browser.window["mozAudioContext"] ? true :false;
			Browser.soundType=Browser.webAudioOK ? "WEBAUDIOSOUND" :"AUDIOSOUND";
			Sound=Browser.webAudioOK?WebAudioSound:AudioSound;;
		}

		return Browser;
	})()


	//class laya.utils.Byte
	var Byte=(function(){
		function Byte(d){
			this._xd_=true;
			this._allocated_=8;
			//this._d_=null;
			//this._u8d_=null;
			this._pos_=0;
			this._length=0;
			if (d){
				this._u8d_=new Uint8Array(d);
				this._d_=new DataView(this._u8d_.buffer);
				this._length=this._d_.byteLength;
				}else {
				this.___resizeBuffer(this._allocated_);
			}
		}

		__class(Byte,'laya.utils.Byte');
		var __proto=Byte.prototype;
		__proto.___resizeBuffer=function(len){
			try {
				var newByteView=new Uint8Array(len);
				if (this._u8d_ !=null){
					if (this._u8d_.length <=len)newByteView.set(this._u8d_);
					else newByteView.set(this._u8d_.subarray(0,len));
				}
				this._u8d_=newByteView;
				this._d_=new DataView(newByteView.buffer);
				}catch (err){
				throw "___resizeBuffer err:"+len;
			}
		}

		__proto.getString=function(){
			return this.rUTF(this.getUint16());
		}

		//LITTLE_ENDIAN only now;
		__proto.getFloat32Array=function(start,len){
			var v=new Float32Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		__proto.getUint8Array=function(start,len){
			var v=new Uint8Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		__proto.getInt16Array=function(start,len){
			var v=new Int16Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		__proto.getFloat32=function(){
			var v=this._d_.getFloat32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		__proto.writeFloat32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setFloat32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		__proto.getInt32=function(){
			var float=this._d_.getInt32(this._pos_,this._xd_);
			this._pos_+=4;
			return float;
		}

		__proto.getUint32=function(){
			var v=this._d_.getUint32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		__proto.writeInt32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setInt32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		__proto.writeUint32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setUint32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		__proto.getInt16=function(){
			var us=this._d_.getInt16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		__proto.getUint16=function(){
			var us=this._d_.getUint16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		__proto.writeUint16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setUint16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		__proto.writeInt16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setInt16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		__proto.getUint8=function(){
			return this._d_.getUint8(this._pos_++);
		}

		__proto.writeUint8=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setUint8(this._pos_,value,this._xd_);
			this._pos_++;
		}

		__proto._getUInt8=function(pos){
			return this._d_.getUint8(pos);
		}

		__proto._getUint16=function(pos){
			return this._d_.getUint16(pos,this._xd_);
		}

		__proto._getMatrix=function(){
			var rst=new Matrix(this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32());
			return rst;
		}

		__proto.rUTF=function(len){
			var v="",max=this._pos_+len,c=0,c2=0,c3=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (this._pos_ < max){
				c=u[this._pos_++];
				if (c < 0x80){
					if (c !=0){
						v+=f(c);
					}
					}else if (c < 0xE0){
					v+=f(((c & 0x3F)<< 6)| (u[this._pos_++] & 0x7F));
					}else if (c < 0xF0){
					c2=u[this._pos_++];
					v+=f(((c & 0x1F)<< 12)| ((c2 & 0x7F)<< 6)| (u[this._pos_++] & 0x7F));
					}else {
					c2=u[this._pos_++];
					c3=u[this._pos_++];
					v+=f(((c & 0x0F)<< 18)| ((c2 & 0x7F)<< 12)| ((c3 << 6)& 0x7F)| (u[this._pos_++] & 0x7F));
				}
				i++;
			}
			return v;
		}

		// River:自定义的字符串读取,项目相关的内容
		__proto.getCustomString=function(len){
			var v="",ulen=0,c=0,c2=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (len > 0){
				c=u[this._pos_];
				if (c < 0x80){
					v+=f(c);
					this._pos_++;
					len--;
					}else {
					ulen=c-0x80;
					this._pos_++;
					len-=ulen;
					while (ulen > 0){
						c=u[this._pos_++];
						c2=u[this._pos_++];
						v+=f((c2 << 8)| c);
						ulen--;
					}
				}
			}
			return v;
		}

		__proto.clear=function(){
			this._pos_=0;
			this.length=0;
		}

		__proto.__getBuffer=function(){
			return this._d_.buffer;
		}

		/**
		*写字符串，该方法写的字符串要使用 readUTFBytes方法读
		*@param value 要写入的字符串
		*/
		__proto.writeUTFBytes=function(value){
			value=value+"";
			for (var i=0,sz=value.length;i < sz;i++){
				var c=value.charCodeAt(i);
				if (c <=0x7F){
					this.writeByte(c);
					}else if (c <=0x7FF){
					this.writeByte(0xC0 | (c >> 6));
					this.writeByte(0x80 | (c & 63));
					}else if (c <=0xFFFF){
					this.writeByte(0xE0 | (c >> 12));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
					}else {
					this.writeByte(0xF0 | (c >> 18));
					this.writeByte(0x80 | ((c >> 12)& 63));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
				}
			}
		}

		__proto.writeUTFString=function(value){
			var tPos=0;
			tPos=this.pos;
			this.writeInt16(1);
			this.writeUTFBytes(value);
			var dPos=0;
			dPos=this.pos-tPos-2;
			this._d_.setInt16(tPos,dPos,this._xd_);
		}

		__proto.readUTFString=function(){
			var tPos=0;
			tPos=this.pos;
			var len=0;
			len=this.getInt16();
			return this.readUTFBytes(len);
		}

		/**
		*读字符串，必须是 writeUTFBytes方法写入的字符串
		*@param len 要读的buffer长度,默认将读取缓冲区全部数据
		*@return 读取的字符串
		*/
		__proto.readUTFBytes=function(len){
			(len===void 0)&& (len=-1);
			len=len > 0 ? len :this.bytesAvailable;
			return this.rUTF(len);
		}

		__proto.writeByte=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setInt8(this._pos_,value);
			this._pos_+=1;
		}

		__proto.ensureWrite=function(lengthToEnsure){
			if (this._length < lengthToEnsure)this.length=lengthToEnsure;
		}

		__proto.writeArrayBuffer=function(arraybuffer,offset,length){
			(offset===void 0)&& (offset=0);
			(length===void 0)&& (length=0);
			if (offset < 0 || length < 0)throw "writeArrayBuffer error - Out of bounds";
			if (length==0)length=arraybuffer.byteLength-offset;
			this.ensureWrite(this._pos_+length);
			var uint8array=new Uint8Array(arraybuffer);
			this._u8d_.set(uint8array.subarray(offset,offset+length),this._pos_);
			this._pos_+=length;
		}

		__getset(0,__proto,'buffer',function(){
			return this._u8d_.buffer;
		});

		__getset(0,__proto,'endian',function(){
			return this._xd_ ? "littleEndian" :"bigEndian";
			},function(endianStr){
			this._xd_=(endianStr=="littleEndian");
		});

		__getset(0,__proto,'bytesAvailable',function(){
			return this.length-this._pos_;
		});

		__getset(0,__proto,'length',function(){
			return this._length;
			},function(value){
			if (this._allocated_ < value)
				this.___resizeBuffer(this._allocated_=Math.floor(Math.max(value,this._allocated_ *2)));
			else if (this._allocated_ > value)
			this.___resizeBuffer(this._allocated_=value);
			this._length=value;
		});

		__getset(0,__proto,'pos',function(){
			return this._pos_;
			},function(value){
			this._pos_=value;
			this._d_.byteOffset=value;
		});

		Byte.getSystemEndian=function(){
			if (!Byte._sysEndian){
				var buffer=new ArrayBuffer(2);
				new DataView(buffer).setInt16(0,256,true);
				Byte._sysEndian=(new Int16Array(buffer))[0]===256 ? "littleEndian" :"bigEndian";
			}
			return Byte._sysEndian;
		}

		Byte.BIG_ENDIAN="bigEndian";
		Byte.LITTLE_ENDIAN="littleEndian";
		Byte._sysEndian=null;
		return Byte;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.utils.Color
	var Color=(function(){
		function Color(str){
			this._color=[];
			//this.strColor=null;
			//this.numColor=0;
			if ((typeof str=='string')){
				this.strColor=str;
				if (str===null)str="#000000";
				str.charAt(0)=='#' && (str=str.substr(1));
				var color=this.numColor=parseInt(str,16);
				var flag=(str.length==8);
				if (flag){
					this._color=[parseInt(str.substr(0,2),16)/ 255,((0x00FF0000 & color)>> 16)/ 255,((0x0000FF00 & color)>> 8)/ 255,(0x000000FF & color)/ 255];
					return;
				}
				}else {
				color=this.numColor=str;
				this.strColor=Utils1.toHexColor(color);
			}
			this._color=[((0xFF0000 & color)>> 16)/ 255,((0xFF00 & color)>> 8)/ 255,(0xFF & color)/ 255,1];
			(this._color).__id=++Color._COLODID;
		}

		__class(Color,'laya.utils.Color');
		Color._initDefault=function(){
			Color._DEFAULT={};
			for (var i in Color._COLOR_MAP)Color._SAVE[i]=Color._DEFAULT[i]=new Color(Color._COLOR_MAP[i]);
			return Color._DEFAULT;
		}

		Color._initSaveMap=function(){
			Color._SAVE_SIZE=0;
			Color._SAVE={};
			for (var i in Color._DEFAULT)Color._SAVE[i]=Color._DEFAULT[i];
		}

		Color.create=function(str){
			var color=Color._SAVE[str+""];
			if (color !=null)return color;
			(Color._SAVE_SIZE < 1000)|| Color._initSaveMap();
			return Color._SAVE[str+""]=new Color(str);
		}

		Color._SAVE={};
		Color._SAVE_SIZE=0;
		Color._COLOR_MAP={"white":'#FFFFFF',"red":'#FF0000',"green":'#00FF00',"blue":'#0000FF',"black":'#000000',"yellow":'#FFFF00','gray':'#AAAAAA'};
		Color._DEFAULT=Color._initDefault();
		Color._COLODID=1;
		return Color;
	})()


	/**
	*触摸滑动控件
	*@author yung
	*/
	//class laya.utils.Dragging
	var Dragging=(function(){
		function Dragging(){
			//this.target=null;
			this.ratio=0.92;
			this.maxOffset=60;
			//this.area=null;
			//this.hasInertia=false;
			//this.elasticDistance=NaN;
			//this.elasticBackTime=NaN;
			//this.data=null;
			this._dragging=false;
			this._clickOnly=true;
			//this._elasticRateX=NaN;
			//this._elasticRateY=NaN;
			//this._lastX=NaN;
			//this._lastY=NaN;
			//this._offsetX=NaN;
			//this._offsetY=NaN;
			//this._offsets=null;
			//this._disableMouseEvent=false;
			//this._tween=null;
		}

		__class(Dragging,'laya.utils.Dragging');
		var __proto=Dragging.prototype;
		__proto.start=function(target,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent){
			this.clearTimer();
			this.target=target;
			this.area=area;
			this.hasInertia=hasInertia;
			this.elasticDistance=elasticDistance;
			this.elasticBackTime=elasticBackTime;
			this.data=data;
			this._disableMouseEvent=disableMouseEvent;
			this._clickOnly=true;
			this._dragging=true;
			this._elasticRateX=this._elasticRateY=1;
			this._lastX=Laya.stage.mouseX;
			this._lastY=Laya.stage.mouseY;
			Laya.stage.on("mouseup",this,this.onStageMouseUp);
			Laya.stage.on("mouseout",this,this.onStageMouseUp);
			Laya.timer.frameLoop(1,this,this.loop);
		}

		__proto.clearTimer=function(){
			if (this._tween){
				this._tween.clear();
				this._tween=null;
			}
			Laya.timer.clear(this,this.tweenMove);
			Laya.stage.off("mouseup",this,this.onStageMouseUp);
			Laya.stage.off("mouseout",this,this.onStageMouseUp);
			Laya.timer.clear(this,this.loop);
		}

		__proto.stop=function(){
			if (this._dragging){
				MouseManager.instance.disableMouseEvent=false;
				this._dragging=false;
				this.target && this.area && this.backToArea();
				this.clear();
			}
		}

		__proto.loop=function(){
			var mouseX=Laya.stage.mouseX;
			var mouseY=Laya.stage.mouseY;
			var offsetX=mouseX-this._lastX;
			var offsetY=mouseY-this._lastY;
			if (this._clickOnly){
				if (Math.abs(offsetX *Laya.stage._canvasTransform.getScaleX())> 1 || Math.abs(offsetY *Laya.stage._canvasTransform.getScaleY())> 1){
					this._clickOnly=false;
					this._offsets || (this._offsets=[]);
					this._offsets.length=0;
					this.target.event("dragstart",this.data);
					MouseManager.instance.disableMouseEvent=this._disableMouseEvent;
					this.target["$_MOUSEDOWN"]=false;
				}else return;
				}else {
				this._offsets.push(offsetX,offsetY);
				this._lastX=mouseX;
				this._lastY=mouseY;
			}
			if (offsetX===0 && offsetY===0)return;
			this.target.x+=offsetX *this._elasticRateX;
			this.target.y+=offsetY *this._elasticRateY;
			this.area && this.checkArea();
			this.target.event("dragmove",this.data);
		}

		__proto.checkArea=function(){
			if (this.elasticDistance <=0){
				this.backToArea();
				}else {
				if (this.target.x < this.area.x){
					var offsetX=this.area.x-this.target.x;
					}else if (this.target.x > this.area.x+this.area.width){
					offsetX=this.target.x-this.area.x-this.area.width;
					}else {
					offsetX=0;
				}
				this._elasticRateX=Math.max(0,1-(offsetX / this.elasticDistance));
				if (this.target.y < this.area.y){
					var offsetY=this.area.y-this.target.y;
					}else if (this.target.y > this.area.y+this.area.height){
					offsetY=this.target.y-this.area.y-this.area.height;
					}else {
					offsetY=0;
				}
				this._elasticRateY=Math.max(0,1-(offsetY / this.elasticDistance));
			}
		}

		__proto.backToArea=function(){
			this.target.x=Math.min(Math.max(this.target.x,this.area.x),this.area.x+this.area.width);
			this.target.y=Math.min(Math.max(this.target.y,this.area.y),this.area.y+this.area.height);
		}

		__proto.onStageMouseUp=function(e){
			MouseManager.instance.disableMouseEvent=false;
			Laya.stage.off("mouseup",this,this.onStageMouseUp);
			Laya.stage.off("mouseout",this,this.onStageMouseUp);
			Laya.timer.clear(this,this.loop);
			if (this._clickOnly || !this.target)return;
			if (this.hasInertia){
				if (this._offsets.length < 1){
					this._offsets.push(Laya.stage.mouseX-this._lastX,Laya.stage.mouseY-this._lastY);
				}
				this._offsetX=this._offsetY=0;
				var len=this._offsets.length;
				var n=Math.min(len,6);
				var m=this._offsets.length-n;
				for (var i=len-1;i > m;i--){
					this._offsetY+=this._offsets[i--];
					this._offsetX+=this._offsets[i];
				}
				this._offsetX=this._offsetX / n *2;
				this._offsetY=this._offsetY / n *2;
				if (Math.abs(this._offsetX)> this.maxOffset)this._offsetX=this._offsetX > 0 ? this.maxOffset :-this.maxOffset;
				if (Math.abs(this._offsetY)> this.maxOffset)this._offsetY=this._offsetY > 0 ? this.maxOffset :-this.maxOffset;
				Laya.timer.frameLoop(1,this,this.tweenMove);
				}else if (this.elasticDistance > 0){
				this.checkElastic();
				}else {
				this.clear();
			}
		}

		__proto.checkElastic=function(){
			var flag=true;
			if (this.target.x < this.area.x){
				this._tween=Tween.to(this.target,{x:this.area.x},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
				flag=false;
				}else if (this.target.x > this.area.x+this.area.width){
				this._tween=Tween.to(this.target,{x:this.area.x+this.area.width},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
				flag=false;
			}
			if (this.target.y < this.area.y){
				this._tween=Tween.to(this.target,{y:this.area.y},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
				flag=false;
				}else if (this.target.y > this.area.y+this.area.height){
				this._tween=Tween.to(this.target,{y:this.area.y+this.area.height},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
				flag=false;
			}
			flag && this.clear();
		}

		__proto.tweenMove=function(){
			this._offsetX *=this.ratio *this._elasticRateX;
			this._offsetY *=this.ratio *this._elasticRateY;
			this.target.x+=this._offsetX;
			this.target.y+=this._offsetY;
			this.area && this.checkArea();
			this.target.event("dragmove",this.data);
			if ((Math.abs(this._offsetX)< 1 && Math.abs(this._offsetY)< 1)|| this._elasticRateX < 0.5 || this._elasticRateY < 0.5){
				Laya.timer.clear(this,this.tweenMove);
				if (this.elasticDistance > 0)this.checkElastic();
				else this.clear();
			}
		}

		__proto.clear=function(){
			if (this.target){
				this.clearTimer();
				var sp=this.target;
				this.target=null;
				sp.event("dragend",this.data);
			}
		}

		return Dragging;
	})()


	/**
	*Ease
	*@author yung
	*/
	//class laya.utils.Ease
	var Ease=(function(){
		function Ease(){};
		__class(Ease,'laya.utils.Ease');
		Ease.strongIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.strongOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.strongInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.sineIn=function(t,b,c,d){
			return-c *Math.cos(t / d *Ease.HALF_PI)+c+b;
		}

		Ease.sineOut=function(t,b,c,d){
			return c *Math.sin(t / d *Ease.HALF_PI)+b;
		}

		Ease.sineInOut=function(t,b,c,d){
			return-c *0.5 *(Math.cos(Math.PI *t / d)-1)+b;
		}

		Ease.quintIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.quintOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.quintInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.quartIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t+b;
		}

		Ease.quartOut=function(t,b,c,d){
			return-c *((t=t / d-1)*t *t *t-1)+b;
		}

		Ease.quartInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t+b;
			return-c *0.5 *((t-=2)*t *t *t-2)+b;
		}

		Ease.QuadIn=function(t,b,c,d){
			return c *(t /=d)*t+b;
		}

		Ease.QuadOut=function(t,b,c,d){
			return-c *(t /=d)*(t-2)+b;
		}

		Ease.QuadInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t+b;
			return-c *0.5 *((--t)*(t-2)-1)+b;
		}

		Ease.linearNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearIn=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearInOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.expoIn=function(t,b,c,d){
			return (t==0)? b :c *Math.pow(2,10 *(t / d-1))+b-c *0.001;
		}

		Ease.expoOut=function(t,b,c,d){
			return (t==d)? b+c :c *(-Math.pow(2,-10 *t / d)+1)+b;
		}

		Ease.expoInOut=function(t,b,c,d){
			if (t==0)return b;
			if (t==d)return b+c;
			if ((t /=d *0.5)< 1)return c *0.5 *Math.pow(2,10 *(t-1))+b;
			return c *0.5 *(-Math.pow(2,-10 *--t)+2)+b;
		}

		Ease.elasticIn=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return-(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
		}

		Ease.elasticOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return (a *Math.pow(2,-10 *t)*Math.sin((t *d-s)*Ease.PI2 / p)+c+b);
		}

		Ease.elasticInOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d *0.5)==2)return b+c;
			if (!p)p=d *(.3 *1.5);
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			if (t < 1)return-.5 *(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
			return a *Math.pow(2,-10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p)*.5+c+b;
		}

		Ease.cubicIn=function(t,b,c,d){
			return c *(t /=d)*t *t+b;
		}

		Ease.cubicOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t+1)+b;
		}

		Ease.cubicInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t+b;
			return c *0.5 *((t-=2)*t *t+2)+b;
		}

		Ease.circIn=function(t,b,c,d){
			return-c *(Math.sqrt(1-(t /=d)*t)-1)+b;
		}

		Ease.circOut=function(t,b,c,d){
			return c *Math.sqrt(1-(t=t / d-1)*t)+b;
		}

		Ease.circInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return-c *0.5 *(Math.sqrt(1-t *t)-1)+b;
			return c *0.5 *(Math.sqrt(1-(t-=2)*t)+1)+b;
		}

		Ease.bounceOut=function(t,b,c,d){
			if ((t /=d)< (1 / 2.75))return c *(7.5625 *t *t)+b;
			else if (t < (2 / 2.75))return c *(7.5625 *(t-=(1.5 / 2.75))*t+.75)+b;
			else if (t < (2.5 / 2.75))return c *(7.5625 *(t-=(2.25 / 2.75))*t+.9375)+b;
			else return c *(7.5625 *(t-=(2.625 / 2.75))*t+.984375)+b;
		}

		Ease.bounceIn=function(t,b,c,d){
			return c-Ease.bounceOut(d-t,0,c,d)+b;
		}

		Ease.bounceInOut=function(t,b,c,d){
			if (t < d *0.5)return Ease.bounceIn(t *2,0,c,d)*.5+b;
			else return Ease.bounceOut(t *2-d,0,c,d)*.5+c *.5+b;
		}

		Ease.backIn=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *(t /=d)*t *((s+1)*t-s)+b;
		}

		Ease.backOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *((t=t / d-1)*t *((s+1)*t+s)+1)+b;
		}

		Ease.backInOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			if ((t /=d *0.5)< 1)return c *0.5 *(t *t *(((s *=(1.525))+1)*t-s))+b;
			return c / 2 *((t-=2)*t *(((s *=(1.525))+1)*t+s)+2)+b;
		}

		Ease.HALF_PI=Math.PI *0.5;
		Ease.PI2=Math.PI *2;
		return Ease;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.utils.HTMLChar
	var HTMLChar=(function(){
		function HTMLChar(char,w,h,style){
			//this._x=NaN;
			//this._y=NaN;
			//this._w=NaN;
			//this._h=NaN;
			//this.isWord=false;
			//this.char=null;
			//this.charNum=NaN;
			//this.style=null;
			//this._sprite=null;
			this.char=char;
			this.charNum=char.charCodeAt(0);
			this._x=this._y=0;
			this.width=w;
			this.height=h;
			this.style=style;
			this.isWord=!HTMLChar._isWordRegExp.test(char);
		}

		__class(HTMLChar,'laya.utils.HTMLChar');
		var __proto=HTMLChar.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		__proto.setSprite=function(sprite){
			this._sprite=sprite;
		}

		__proto.getSprite=function(){
			return this._sprite;
		}

		__proto._isChar=function(){
			return true;
		}

		__proto._getCSSStyle=function(){
			return this.style;
		}

		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			if (this._sprite){
				this._sprite.x=value;
			}
			this._x=value;
		});

		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			if (this._sprite){
				this._sprite.y=value;
			}
			this._y=value;
		});

		__getset(0,__proto,'width',function(){
			return this._w;
			},function(value){
			this._w=value;
		});

		__getset(0,__proto,'height',function(){
			return this._h;
			},function(value){
			this._h=value;
		});

		HTMLChar._isWordRegExp=new RegExp("[\\w\.]","");
		return HTMLChar;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.utils.Log
	var Log=(function(){
		function Log(){};
		__class(Log,'laya.utils.Log');
		Log.start=function(){
			Log._logdiv=Browser.window.document.createElement('div');
			Browser.window.document.body.appendChild(Log._logdiv);
			Log._logdiv.style.cssText="border:white;overflow:scroll;z-index:1000000;background:rgba(100,100,100,0.7);color:white;position: absolute;left:0px;top:0px;width:100%;height:50%";
			Log._logdiv.onclick=function (){
				if (Laya.__parseInt(this.style.width)==30){
					this.style.width='100%';
					this.style.height="50%";
					this.style.overflow="scroll"
					this.style.background="rgba(100,100,100,0.7)"
				}
				else{
					this.style.width=this.style.height="30px";
					this.style.overflow="hidden";
					this.style.background="white"
				}
			}
		}

		Log.print=function(value){
			if (!Log._logdiv){
				return;
			}
			Log._logdiv.innerText+=value+"\n";
		}

		Log.enable=function(){
			return Log._logdiv !=null;
		}

		Log._logdiv=null
		return Log;
	})()


	/**
	*对象池类
	*@author ww
	*/
	//class laya.utils.Pool
	var Pool=(function(){
		function Pool(){}
		__class(Pool,'laya.utils.Pool');
		Pool.getPoolBySign=function(sign){
			return Pool._poolDic[sign] || (Pool._poolDic[sign]=[]);
		}

		Pool.recover=function(sign,item){
			if (item["__InPool"])return;
			item["__InPool"]=true;
			Pool.getPoolBySign(sign).push(item);
		}

		Pool.getItemByClass=function(sign,clz){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length?pool.pop():new clz();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItemByCreateFun=function(sign,createFun){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length?pool.pop():createFun();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItem=function(sign){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length?pool.pop():null;
			if(rst)rst["__InPool"]=false;
			return rst;
		}

		Pool._poolDic={};
		Pool.InPoolSign="__InPool";
		return Pool;
	})()


	/**
	*帧率统计
	*@author yung
	*/
	//class laya.utils.Stat
	var Stat=(function(){
		function Stat(){};
		__class(Stat,'laya.utils.Stat');
		__getset(1,Stat,'onclick',null,function(fn){
			Stat._canvas.source.onclick=fn;
			Stat._canvas.source.style.pointerEvents='';
		});

		Stat.show=function(x,y){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			Stat.preFrameTime=Stat._timer=Browser.now()-1000;
			Stat._view[0]={title:"FPS(3D)",value:"_fpsStr",color:"yellow",units:"int"};
			Stat._view[1]={title:"Sprite",value:"spriteDraw",color:"white",units:"int"};
			Stat._view[2]={title:"DrawCall",value:"drawCall",color:"white",units:"int"};
			Stat._view[3]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
			Stat._view[4]={title:"MaxMem",value:"maxMemorySize",color:"white",units:"M"};
			Stat._view[5]={title:"CurMem",value:"currentMemorySize",color:"Yellow",units:"M"};
			Stat._view[6]={title:"TexMem",value:"texturesMemSize",color:"LightGoldenRodYellow",units:"M"};
			Stat._view[7]={title:"BufMem",value:"buffersMemSize",color:"LightGoldenRodYellow",units:"M"};
			Stat._view[8]={title:"Shader",value:"shaderCall",color:"white",units:"int"};
			Stat._view[9]={title:"TriFaces",value:"trianglesFaces",color:"white",units:"int"};
			Stat._view[10]={title:"BufLen",value:"bufferLen",color:"white",units:"int"};
			if (!Render.isWebGl){
				Stat._view[0].title="FPS(2D)";
				Stat._view.length=4;
			}
			for (var i=0;i < Stat._view.length;i++){
				Stat._view[i].x=4;
				Stat._view[i].y=i *12+2;
			}
			Stat._height=Stat._view.length *12+4;
			if (!Stat._canvas){
				Stat._canvas=new HTMLCanvas('2D');
				Stat._canvas.size(Stat._width,Stat._height);
				Stat._ctx=Stat._canvas.getContext('2d');
				Stat._ctx.textBaseline="top";
				var canvas=Stat._canvas.source;
				canvas.style.cssText="pointer-events:none;z-index:100000;position: absolute;left:"+x+"px;top:"+y+"px;width:"+Stat._width+"px;height:"+Stat._height+"px;";
			}
			Laya.timer.frameLoop(1,Stat,Stat.loop);
			Browser.document.body.appendChild(Stat._canvas.source);
		}

		Stat.hide=function(){
			var canvas=Stat._canvas.source;
			Browser.removeElement(canvas);
			Laya.timer.clear(Stat,Stat.loop);
		}

		Stat.clear=function(){
			Stat.trianglesFaces=0;
			Stat.drawCall=0;
			Stat.shaderCall=0;
			Stat.spriteDraw=-1;
			Stat.bufferLen=0;
			Stat.canvasNormal=0;
			Stat.canvasBitmap=0;
			Stat.canvasReCache=0;
		}

		Stat.loop=function(){
			Stat._count++;
			var timer=Browser.now();
			Stat.interval=Browser.now()-Stat.preFrameTime;
			Stat.preFrameTime=timer;
			if (timer-Stat._timer < 1000){
				Stat.clear();
				return;
			}
			Stat._count=Math.round((Stat._count *1000)/ (timer-Stat._timer));
			Stat.maxMemorySize=ResourceManager.systemResourceManager.autoReleaseMaxSize;
			Stat.currentMemorySize=ResourceManager.systemResourceManager.memorySize;
			Stat.texturesMemSize=0;
			Stat.buffersMemSize=0;
			for (var i=0;i < Resource.getLoadedResourcesCount();i++){
				var resource=Resource.getLoadedResourceByIndex(i);
				if (((resource instanceof laya.resource.Bitmap )))
					Stat.texturesMemSize+=resource.memorySize;
			}
			Stat.FPS=Stat._count;
			Stat._fpsStr=Stat._count+(Stat.renderSlow?" slow":"");
			Stat._canvasStr=Stat.canvasReCache+"/"+Stat.canvasNormal+"/"+Stat.canvasBitmap;
			var ctx=Stat._ctx;
			ctx.clearRect(0,0,Stat._width,Stat._height);
			ctx.fillStyle="rgba(50,50,60,0.8)";
			ctx.fillRect(0,0,Stat._width,Stat._height);
			for (i=0;i < Stat._view.length;i++){
				var one=Stat._view[i];
				ctx.fillStyle="white";
				ctx.fillText(one.title,one.x,one.y);
				ctx.fillStyle=one.color;
				var value=Stat[one.value];
				(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
				ctx.fillText(value+"",one.x+60,one.y);
			}
			Stat._count=0;
			Stat._timer=timer;
			Stat.clear();
		}

		Stat.loopCount=0;
		Stat.maxMemorySize=0;
		Stat.currentMemorySize=0;
		Stat.texturesMemSize=0;
		Stat.buffersMemSize=0;
		Stat.shaderCall=0;
		Stat.drawCall=0;
		Stat.trianglesFaces=0;
		Stat.spriteDraw=0;
		Stat.FPS=0;
		Stat.canvasNormal=0;
		Stat.canvasBitmap=0;
		Stat.canvasReCache=0;
		Stat.interval=0;
		Stat.preFrameTime=0;
		Stat.bufferLen=0;
		Stat.renderSlow=false;
		Stat._fpsStr=null
		Stat._canvasStr=null
		Stat._canvas=null
		Stat._ctx=null
		Stat._timer=NaN
		Stat._count=0;
		Stat._width=120;
		Stat._height=100;
		Stat._view=[];
		return Stat;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.utils.StringKey
	var StringKey=(function(){
		function StringKey(){
			this._strs={};
			this._length=0;
		}

		__class(StringKey,'laya.utils.StringKey');
		var __proto=StringKey.prototype;
		__proto.add=function(str){
			var index=this._strs[str];
			if (index !=null)return index;
			return this._strs[str]=this._length++;
		}

		__proto.get=function(str){
			var index=this._strs[str];
			return index==null ?-1 :index;
		}

		return StringKey;
	})()


	/**
	*时钟管理类，单例，可以通过Laya.timer访问
	*@author yung
	*/
	//class laya.utils.Timer
	var Timer=(function(){
		var TimerHandler;
		function Timer(){
			this.scale=1;
			this.currFrame=0;
			this._mid=1;
			this._map=[];
			this._laters=[];
			this._handlers=[];
			this._temp=[];
			this._pool=[];
			this._count=0;
			this.currTimer=Browser.now();
			this._lastTimer=Browser.now();
			Laya.timer && Laya.timer.frameLoop(1,this,this._update);
		}

		__class(Timer,'laya.utils.Timer');
		var __proto=Timer.prototype;
		__proto._update=function(){
			if (this.scale <=0){
				this._lastTimer=Browser.now();
				return;
			};
			var frame=this.currFrame=this.currFrame+this.scale;
			var now=Browser.now()
			Timer.DELTA=now-this._lastTimer;
			var timer=this.currTimer=this.currTimer+Timer.DELTA *this.scale;
			this._lastTimer=now;
			var handlers=this._handlers;
			this._count=0;
			for (i=0,n=handlers.length;i < n;i++){
				handler=handlers[i];
				if (handler.method!==null){
					var t=handler.userFrame ? frame :timer;
					if (t >=handler.exeTime){
						if (handler.repeat){
							do {
								handler.exeTime+=handler.delay;
								handler.run(false);
							}while (t >=handler.exeTime);
							}else {
							handler.run(true);
						}
					}
					}else {
					this._count++;
				}
			}
			if (this._count > 30 || frame % 200===0)this._clearHandlers();
			var laters=this._laters;
			for (var i=0,n=laters.length-1;i <=n;i++){
				var handler=laters[i];
				handler.method!==null && handler.run(false);
				this._recoverHandler(handler);
				i===n && (n=laters.length-1);
			}
			laters.length=0;
		}

		__proto._clearHandlers=function(){
			var handlers=this._handlers;
			for (var i=0,n=handlers.length;i < n;i++){
				var handler=handlers[i];
				if (handler.method!==null)this._temp.push(handler);
				else this._recoverHandler(handler);
			}
			this._handlers=this._temp;
			this._temp=handlers;
			this._temp.length=0;
		}

		__proto._recoverHandler=function(handler){
			handler.clear();
			this._map[handler.key]=null;
			this._pool.push(handler);
		}

		__proto._create=function(useFrame,repeat,delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			if (!delay){
				method.apply(caller,args);
				return;
			}
			if (coverBefore){
				var handler=this._getHandler(caller,method);
				if (handler){
					handler.repeat=repeat;
					handler.userFrame=useFrame;
					handler.delay=delay;
					handler.caller=caller;
					handler.method=method;
					handler.args=args;
					handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer);
					return;
				}
			}
			handler=this._pool.length > 0 ? this._pool.pop():new TimerHandler();
			handler.repeat=repeat;
			handler.userFrame=useFrame;
			handler.delay=delay;
			handler.caller=caller;
			handler.method=method;
			handler.args=args;
			handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer);
			this._indexHandler(handler);
			this._handlers.push(handler);
		}

		__proto._indexHandler=function(handler){
			var caller=handler.caller;
			var method=handler.method;
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils1.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			handler.key=cid+mid;
			this._map[handler.key]=handler;
		}

		/**
		*定时执行一次
		*@param delay 延迟时间(单位毫秒)
		*@param caller 执行域(this)
		*@param method 定时器回调函数
		*@param args 回调参数
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false
		*/
		__proto.once=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行
		*@param delay 间隔时间(单位毫秒)
		*@param caller 执行域(this)
		*@param method 定时器回调函数
		*@param args 回调参数
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false
		*/
		__proto.loop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行一次(基于帧率)
		*@param delay 延迟几帧(单位为帧)
		*@param caller 执行域(this)
		*@param method 定时器回调函数
		*@param args 回调参数
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行(基于帧率)
		*@param delay 间隔几帧(单位为帧)
		*@param caller 执行域(this)
		*@param method 定时器回调函数
		*@param args 回调参数
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**输出统计信息*/
		__proto.toString=function(){
			return "callLater:"+this._laters.length+" handlers:"+this._handlers.length+" pool:"+this._pool.length;
		}

		/**
		*清理定时器
		*@param caller 执行域(this)
		*@param method 定时器回调函数
		*/
		__proto.clear=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler){
				this._map[handler.key]=null;
				handler.key=0;
				handler.clear();
			}
		}

		/**
		*清理对象身上的所有定时器
		*@param caller 执行域(this)
		*/
		__proto.clearAll=function(caller){
			for (var i=0,n=this._handlers.length;i < n;i++){
				var handler=this._handlers[i];
				if (handler.caller===caller){
					this._map[handler.key]=null;
					handler.key=0;
					handler.clear();
				}
			}
		}

		__proto._getHandler=function(caller,method){
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils1.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			return this._map[cid+mid];
		}

		/**
		*延迟执行
		*@param caller 执行域(this)
		*@param method 定时器回调函数
		*@param args 回调参数
		*/
		__proto.callLater=function(caller,method,args){
			if (this._getHandler(caller,method)==null){
				if (this._pool.length)var handler=this._pool.pop();
				else handler=new TimerHandler();
				handler.caller=caller;
				handler.method=method;
				handler.args=args;
				this._indexHandler(handler);
				this._laters.push(handler);
			}
		}

		/**
		*立即执行callLater
		*@param caller 执行域(this)
		*@param method 定时器回调函数
		*/
		__proto.runCallLater=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler && handler.method !=null){
				handler.run(true);
				this._map[handler.key]=null;
			}
		}

		Timer.DELTA=0;
		Timer.__init$=function(){
			//class TimerHandler
			TimerHandler=(function(){
				function TimerHandler(){
					this.key=0;
					this.repeat=false;
					this.delay=0;
					this.userFrame=false;
					this.exeTime=0;
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__class(TimerHandler,'');
				var __proto=TimerHandler.prototype;
				__proto.clear=function(){
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__proto.run=function(widthClear){
					var caller=this.caller;
					if (caller && caller.destroyed)return this.clear();
					var method=this.method;
					var args=this.args;
					widthClear && this.clear();
					if (method==null)return;
					args ? method.apply(caller,args):method.call(caller);
				}
				return TimerHandler;
			})()
		}

		return Timer;
	})()


	/**
	*缓动类
	*@author yung
	*/
	//class laya.utils.Tween
	var Tween=(function(){
		function Tween(){
			//this._complete=null;
			//this._target=null;
			//this._ease=null;
			//this._props=null;
			//this._duration=0;
			//this._delay=0;
			//this._startTimer=0;
			//this._usedTimer=0;
			//this._usedPool=false;
			this.gid=0;
		}

		__class(Tween,'laya.utils.Tween');
		var __proto=Tween.prototype;
		/**
		*缓动对象的props属性到目标值
		*@param target 目标对象(即将更改属性值的对象)
		*@param props 变化的属性列表，比如{x:100,y:20}
		*@param duration 花费的时间，单位毫秒
		*@param ease 缓动类型，默认为匀速运动
		*@param complete 结束回调函数
		*@param delay 延迟执行时间
		*@param coverBefore 是否覆盖之前的缓动
		*@return 返回Tween对象
		*/
		__proto.to=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,true,false,true);
		}

		/**
		*从props属性，缓动到当前状态
		*@param target 目标对象(即将更改属性值的对象)
		*@param props 变化的属性列表，比如{x:100,y:20}
		*@param duration 花费的时间，单位毫秒
		*@param ease 缓动类型，默认为匀速运动
		*@param complete 结束回调函数
		*@param delay 延迟执行时间
		*@param coverBefore 是否覆盖之前的缓动
		*@return 返回Tween对象
		*/
		__proto.from=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,false,false,true);
		}

		/**@private */
		__proto._create=function(target,props,duration,ease,complete,delay,coverBefore,isTo,usePool,runNow){
			if (!target)throw new Error("Tween:target is null");
			this._target=target;
			this._duration=duration;
			this._ease=ease || Tween.easeNone;
			this._complete=complete;
			this._delay=delay;
			this._props=[];
			this._usedTimer=0;
			this._startTimer=Browser.now();
			this._usedPool=usePool;
			var gid=(target.$_GID || (target.$_GID=Utils1.getGID()));
			if (!Tween.tweenMap[gid]){
				Tween.tweenMap[gid]=[this];
				}else {
				if (coverBefore)Tween.clearTween(target);
				Tween.tweenMap[gid].push(this);
			}
			if (runNow){
				if (delay <=0)this.firstStart(target,props,isTo);
				else Laya.timer.once(delay,this,this.firstStart,[target,props,isTo]);
				}else {
				this._initProps(target,props,isTo);
			}
			return this;
		}

		__proto.firstStart=function(target,props,isTo){
			this._initProps(target,props,isTo);
			this._beginLoop();
		}

		__proto._initProps=function(target,props,isTo){
			for (var p in props){
				if ((typeof (target[p])=='number')){
					var start=isTo ? target[p] :props[p];
					var end=isTo ? props[p] :target[p];
					this._props.push([p,start,end-start]);
				}
			}
		}

		__proto._beginLoop=function(){
			Laya.timer.frameLoop(1,this,this._doEase);
		}

		/**执行缓动**/
		__proto._doEase=function(){
			this.updateEase(Browser.now());
		}

		__proto.updateEase=function(time){
			var target=this._target;
			if (target.destroyed)return Tween.clearTween(target);
			var usedTimer=this._usedTimer=time-this._startTimer-this._delay;
			if (usedTimer < 0)return;
			if (usedTimer >=this._duration)return this.complete();
			var ratio=usedTimer > 0 ? this._ease(usedTimer,0,1,this._duration):0;
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+(ratio *prop[2]);
			}
		}

		/**
		*立即结束缓动并到终点
		*/
		__proto.complete=function(){
			var target=this._target;
			var props=this._props;
			var handler=this._complete;
			this.clear();
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+prop[2];
			}
			handler && handler.run();
		}

		/**
		*暂停缓动，可以通过resume或restart重新开始
		*/
		__proto.pause=function(){
			Laya.timer.clear(this,this._beginLoop);
			Laya.timer.clear(this,this._doEase);
		}

		/**
		*设置开始时间
		*@param startTime
		*/
		__proto.setStartTime=function(startTime){
			this._startTimer=startTime;
			this.updateEase(this._startTimer);
		}

		/**
		*停止并清理当前缓动
		*/
		__proto.clear=function(){
			if (this._target){
				this._remove();
				this._clear();
			}
		}

		__proto._clear=function(){
			this.pause();
			Laya.timer.clear(this,this.firstStart);
			this._complete=null;
			this._target=null;
			this._ease=null;
			this._props=null;
			if (this._usedPool){
				Pool.recover("tween",this);
			}
		}

		__proto._remove=function(){
			var tweens=Tween.tweenMap[this._target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					if (tweens[i]===this){
						tweens.splice(i,1);
						break ;
					}
				}
			}
		}

		/**
		*重新开始暂停的缓动
		*/
		__proto.restart=function(){
			this.pause();
			this._usedTimer=0;
			this._startTimer=Browser.now();
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				this._target[prop[0]]=prop[1];
			}
			Laya.timer.once(this._delay,this,this._beginLoop);
		}

		/**
		*恢复暂停的缓动
		*/
		__proto.resume=function(){
			if (this._usedTimer >=this._duration)return;
			this._startTimer=Browser.now()-this._usedTimer-this._delay;
			this._beginLoop();
		}

		Tween.to=function(target,props,duration,ease,complete,delay,coverBefore,usePool){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(usePool===void 0)&& (usePool=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,true,usePool,true);
		}

		Tween.from=function(target,props,duration,ease,complete,delay,coverBefore,usePool){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(usePool===void 0)&& (usePool=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,false,usePool,true);
		}

		Tween.clearAll=function(target){
			if (!target || !target.$_GID)return;
			var tweens=Tween.tweenMap[target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					tweens[i]._clear();
				}
				tweens.length=0;
			}
		}

		Tween.clear=function(tween){
			tween.clear();
		}

		Tween.clearTween=function(target){
			Tween.clearAll(target);
		}

		Tween.easeNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Tween.tweenMap={};
		return Tween;
	})()


	/**
	*工具类
	*@author yung
	*/
	//class laya.utils.Utils
	var Utils1=(function(){
		function Utils(){};
		__class(Utils,'laya.utils.Utils',null,'Utils1');
		Utils.toRadian=function(angle){
			return angle *Utils._pi2;
		}

		Utils.toAngle=function(radian){
			return radian *Utils._pi;
		}

		Utils.toHexColor=function(color){
			if (color < 0 || isNaN(color))return null;
			var str=color.toString(16);
			while (str.length < 6)str="0"+str;
			return "#"+str;
		}

		Utils.getGID=function(){
			return Utils._gid++;
		}

		Utils.parseXMLFromString=function(value){
			var rst;
			rst=(new DOMParser()).parseFromString(value,'text/xml');
			return rst;
		}

		Utils.preFixNumber=function(num,strLen){
			return ("0000000000"+num).slice(-strLen);
		}

		Utils.concatArr=function(src,a){
			if (!a)return src;
			if (!src)return a;
			var i=0,len=a.length;
			for (i=0;i < len;i++){
				src.push(a[i]);
			}
			return src;
		}

		Utils.clearArr=function(arr){
			if (!arr)return arr;
			arr.length=0;
			return arr;
		}

		Utils.setValueArr=function(src,v){
			src || (src=[]);
			src.length=0;
			return Utils.concatArr(src,v);
		}

		Utils.getFrom=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src[i]);
			}
			return rst;
		}

		Utils.getFromR=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src.pop());
			}
			return rst;
		}

		Utils.getGlobalRec=function(sprite){
			return Utils.getGlobalRecByPoints(sprite,0,0,sprite.width,sprite.height);
		}

		Utils.getGlobalRecByPoints=function(sprite,x0,y0,x1,y1){
			var newLTPoint;
			newLTPoint=new Point(x0,y0);
			newLTPoint=sprite.localToGlobal(newLTPoint);
			var newRBPoint;
			newRBPoint=new Point(x1,y1);
			newRBPoint=sprite.localToGlobal(newRBPoint);
			var rst;
			rst=Rectangle._getWrapRec([newLTPoint.x,newLTPoint.y,newRBPoint.x,newRBPoint.y]);
			return rst;
		}

		Utils.getGlobalPosAndScale=function(sprite){
			return Utils.getGlobalRecByPoints(sprite,0,0,1,1);
		}

		Utils.enableDisplayTree=function(dis){
			while (dis){
				dis.mouseEnabled=true;
				dis=dis.parent;
			}
		}

		Utils.bind=function(fun,_scope){
			var rst;
			rst=fun.bind(_scope);;
			return rst;
		}

		Utils.copyFunction=function(src,dec,permitOverrides){
			for (var i in src){
				if (!permitOverrides && dec[i])continue ;
				dec[i]=src[i];
			}
		}

		Utils.measureText=function(txt,font){
			if (Utils._charSizeTestDiv==null){
				Utils._charSizeTestDiv=Browser.createElement('div');
				Utils._charSizeTestDiv.style.cssText="z-index:10000000;padding:0px;position: absolute;left:0px;visibility:hidden;top:0px;background:white";
				Browser.document.body.appendChild(Utils._charSizeTestDiv);
			}
			Utils._charSizeTestDiv.style.font=font;
			Utils._charSizeTestDiv.innerText=txt==" " ? "i" :txt;
			var out={width:Utils._charSizeTestDiv.offsetWidth,height:Utils._charSizeTestDiv.offsetHeight};
			if (txt==' ')out.width=out.height *0.25;
			return out;
		}

		Utils.regClass=function(className,fullClassName){
			Utils._systemClass[className]=fullClassName;
		}

		Utils.New=function(className){
			className=Utils._systemClass[className] || className;
			return new Laya.__classmap[className];
		}

		Utils.updateOrder=function(childs){
			if (childs.length < 2)return false;
			var c=childs[0];
			var i=1,sz=childs.length;
			var z=c._zOrder,low=NaN,high=NaN,mid=NaN,zz=NaN;
			var repaint=false;
			for (i=1;i < sz;i++){
				c=childs [i];
				if (!c)continue ;
				if ((z=c._zOrder)< 0)z=c._zOrder;
				if(z<childs[i-1]._zOrder){
					mid=low=0;
					high=i-1;
					while (low <=high){
						mid=(low+high)>>>1;
						if (!childs[mid])break ;
						zz=childs[mid]._zOrder;
						if (zz < 0)zz=childs[mid]._zOrder;
						if (zz< z)
							low=mid+1;
						else if (zz > z)
						high=mid-1;
						else break ;
					}
					if(z>childs[mid]._zOrder)mid++;
					childs.splice(i,1);
					childs.splice(mid,0,c);
					repaint=true;
				}
			}
			return repaint;
		}

		Utils.attachAllClassTimeDelay=function(timeout,exclude){
			Utils._attachAllClassTimeDelay=timeout;
			var __classmap=Laya["__classmap"];
			var excludes=((exclude?exclude.join('%'):"")+"%Laya%laya.ui.%laya.utils.Log%laya2.display%laya.utils2%laya.asyn%laya.display.css%laya.maths%laya.utils").split("%");
			var j=0,excludelen=excludes.length;
			for (var i in __classmap){
				if (i.indexOf('.')< 0)continue ;
				for (j=0;j < excludelen;j++){
					if (i.indexOf(excludes[j])==0){
						j=-1;
						break ;
					}
				}
				if(j>0)Utils.attachClassTimeDelay(__classmap[i],i,timeout);
			}
		}

		Utils.attachClassTimeDelay=function(_class,className,timeout){
			var i;
			var pre;
			for (i in _class){
				if (_class['_$GET_'+i] !=null || i.charAt(0)=='_')continue ;
				pre=_class[i];
				if (((typeof pre=='function'))){
					_class[i]=function (_class,className,protoName,pre,timeout){
						return function (){
							var tm=Browser.now();
							var r=pre.apply(_class,arguments);
							if ((Browser.now()-tm)> timeout)Log.print("static prototype delay: "+className+"."+protoName+" "+(Browser.now()-tm));
							return r;
						}
					}(_class,className,i,pre,timeout);
				}
			};
			var __proto=_class.prototype;
			for (i in __proto){
				if (__proto['_$get_'+i] !=null || i.charAt(0)=='_')continue ;
				pre=__proto[i];
				if (((typeof pre=='function'))&& !pre.__ISCHECK){
					pre.__ISCHECK=true;
					__proto[i]=function (_class,className,protoName,pre,timeout){
						return function (){
							var tm=Browser.now();
							var r=pre.apply(this,arguments);
							if ((Browser.now()-tm)> timeout)Log.print("prototype delay:"+className+"."+protoName+" "+(Browser.now()-tm));
							return r;
						}
					}(_class,className,i,pre,timeout);
					__proto[i].__ISCHECK=true;
				}
			}
		}

		Utils._gid=1;
		Utils._pi=180 / Math.PI;
		Utils._pi2=Math.PI / 180;
		Utils._charSizeTestDiv=null
		Utils._systemClass={'Sprite':'laya.display.Sprite','Sprite3D':'laya.d3.display.Sprite3D','Mesh':'laya.d3.display.Mesh','Sky':'laya.d3.display.Sky','div':'laya.html.dom.HTMLDivElement','img':'laya.html.dom.HTMLImageElement','span':'laya.html.dom.HTMLElement','br':'laya.html.dom.HTMLBrElement','style':'laya.html.dom.HTMLStyleElement','font':'laya.html.dom.HTMLElement','a':'laya.html.dom.HTMLElement','#text':'laya.html.dom.HTMLElement'};
		Utils._attachAllClassTimeDelay=-1;
		return Utils;
	})()


	//class laya.filters.webgl.FilterActionGL
	var FilterActionGL=(function(){
		function FilterActionGL(){}
		__class(FilterActionGL,'laya.filters.webgl.FilterActionGL');
		var __proto=FilterActionGL.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
		__proto.setValue=function(shader){}
		__proto.setValueMix=function(shader){}
		__proto.apply3d=function(scope,sprite,context,x,y){return null;}
		__proto.apply=function(srcCanvas){return null;}
		__getset(0,__proto,'typeMix',function(){
			return 0;
		});

		return FilterActionGL;
	})()


	//class laya.webgl.atlas.AtlasGrid
	var AtlasGrid=(function(){
		var TexMergeCellInfo,TexRowInfo,TexMergeTexSize;
		function AtlasGrid(width,height,atlasID){
			this._atlasID=0;
			this._width=0;
			this._height=0;
			this._texCount=0;
			this._rowInfo=null;
			this._cells=null;
			this._failSize=new TexMergeTexSize();
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(atlasID===void 0)&& (atlasID=0);
			this._cells=null;
			this._rowInfo=null;
			this._init(width,height);
			this._atlasID=atlasID;
		}

		__class(AtlasGrid,'laya.webgl.atlas.AtlasGrid');
		var __proto=AtlasGrid.prototype;
		//------------------------------------------------------------------------------
		__proto.getAltasID=function(){
			return this._atlasID;
		}

		//------------------------------------------------------------------------------
		__proto.setAltasID=function(atlasID){
			if(atlasID >=0){
				this._atlasID=atlasID;
			}
		}

		//------------------------------------------------------------------
		__proto.addTex=function(type,width,height){
			var result=this._get(width,height);
			if (result.ret==false){
				return result;
			}
			this._fill(result.x,result.y,width,height,type);
			this._texCount++;
			return result;
		}

		//------------------------------------------------------------------------------
		__proto._release=function(){
			if(this._cells !=null){
				this._cells.length=0;
				this._cells=null;
			}
			if(this._rowInfo){
				this._rowInfo.length=0;
				this._rowInfo=null;
			}
		}

		//------------------------------------------------------------------------------
		__proto._init=function(width,height){
			this._width=width;
			this._height=height;
			this._release();
			if (this._width==0)return false;
			this._cells=new Array(this._width *this._height);
			this._rowInfo=__newvec(this._height);
			for(var i=0;i < this._height;i++){
				this._rowInfo[i]=new TexRowInfo();
			}
			for(i=0;i < this._width *this._height;i++){
				this._cells[i]=new TexMergeCellInfo();
			}
			this._clear();
			return true;
		}

		//------------------------------------------------------------------
		__proto._get=function(width,height){
			var pFillInfo=new MergeFillInfo();
			if(width >=this._failSize.width && height >=this._failSize.height){
				return pFillInfo;
			};
			var rx=-1;
			var ry=-1;
			var nWidth=this._width;
			var nHeight=this._height;
			var pCellBox=this._cells;
			for(var y=0;y < nHeight;y++){
				if(this._rowInfo[y].spaceCount < width)continue ;
				for(var x=0;x < nWidth;){
					if (pCellBox[ y *nWidth+x].type !=0 || pCellBox[ y *nWidth+x].successionWidth < width || pCellBox[ y *nWidth+x].successionHeight < height){
						x+=pCellBox[y *nWidth+x].successionWidth;
						continue ;
					}
					rx=x;
					ry=y;
					for(var xx=0;xx < width;xx++){
						if (pCellBox[y *nWidth+x+xx].successionHeight < height){
							rx=-1;
							break ;
						}
					}
					if(rx < 0){
						x+=pCellBox[y *nWidth+x].successionWidth;
						continue ;
					}
					pFillInfo.ret=true;
					pFillInfo.x=rx;
					pFillInfo.y=ry;
					return pFillInfo;
				}
			}
			return pFillInfo;
		}

		//------------------------------------------------------------------
		__proto._fill=function(x,y,w,h,type){
			var nWidth=this._width;
			var nHeghit=this._height;
			this._check((x+w)<=nWidth && (y+h)<=nHeghit);
			for(var yy=y;yy < (h+y);++yy){
				this._check(this._rowInfo[yy].spaceCount >=w);
				this._rowInfo[yy].spaceCount-=w;
				for(var xx=0;xx < w;xx++){
					this._check(this._cells[x+yy *nWidth+xx].type==0);
					this._cells[x+yy *nWidth+xx].type=type;
					this._cells[x+yy *nWidth+xx].successionWidth=w;
					this._cells[x+yy *nWidth+xx].successionHeight=h;
				}
			}
			if(x>0){
				for(yy=0;yy < h;++yy){
					var s=0;
					for(xx=x-1;xx >=0;--xx,++s){
						if (this._cells[(y+yy)*nWidth+xx].type !=0)break ;
					}
					for(xx=s;xx>0;--xx){
						this._cells[(y+yy)*nWidth+x-xx].successionWidth=xx;
						this._check(xx>0);
					}
				}
			}
			if(y > 0){
				for(xx=x;xx < (x+w);++xx){
					s=0;
					for(yy=y-1;yy >=0;--yy,s++){
						if(this._cells[ xx+yy*nWidth].type!=0)break ;
					}
					for(yy=s;yy>0;--yy){
						this._cells[ xx+(y-yy)*nWidth].successionHeight=yy;
						this._check(yy>0);
					}
				}
			}
		}

		__proto._check=function(ret){
			if (ret==false){
				console.log("xtexMerger 错误啦");
			}
		}

		//------------------------------------------------------------------
		__proto._clear=function(){
			this._texCount=0;
			for (var y=0;y < this._height;y++){
				this._rowInfo[y].spaceCount=this._width;
			}
			for (var i=0;i < this._height;i++){
				for (var j=0;j < this._width;j++){
					var pCellbox=this._cells[ i *this._width+j];
					pCellbox.type=0;
					pCellbox.successionWidth=this._width-j;
					pCellbox.successionHeight=this._width-i;
				}
			}
			this._failSize.width=this._width+1;
			this._failSize.height=this._height+1;
		}

		AtlasGrid.__init$=function(){
			//------------------------------------------------------------------------------
			//class TexMergeCellInfo
			TexMergeCellInfo=(function(){
				function TexMergeCellInfo(){
					this.type=0;
					this.successionWidth=0;
					this.successionHeight=0;
				}
				__class(TexMergeCellInfo,'');
				return TexMergeCellInfo;
			})()
			//------------------------------------------------------------------------------
			//class TexRowInfo
			TexRowInfo=(function(){
				function TexRowInfo(){
					this.spaceCount=0;
				}
				__class(TexRowInfo,'');
				return TexRowInfo;
			})()
			//------------------------------------------------------------------------------
			//class TexMergeTexSize
			TexMergeTexSize=(function(){
				function TexMergeTexSize(){
					this.width=0;
					this.height=0;
				}
				__class(TexMergeTexSize,'');
				return TexMergeTexSize;
			})()
		}

		return AtlasGrid;
	})()


	;
	;
	;
	//class laya.webgl.atlas.AtlasManager
	var AtlasManager=(function(){
		function AtlasManager(width,height,gridSize,maxTexNum){
			this._maxAtlasNum=0;
			this._width=0;
			this._height=0;
			this._gridSize=0;
			this._gridNumX=0;
			this._gridNumY=0;
			this._init=false;
			this._curAtlasIndex=0;
			this._setAtlasParam=false;
			this._atlaserArray=null;
			this._needGC=false;
			this._setAtlasParam=true;
			this._width=width;
			this._height=height;
			this._gridSize=gridSize;
			this._maxAtlasNum=maxTexNum;
			this._gridNumX=width / gridSize;
			this._gridNumY=height / gridSize;
			this._curAtlasIndex=0;
			this._atlaserArray=[];
			if (WebGL.mainContext)this.Initialize();
		}

		__class(AtlasManager,'laya.webgl.atlas.AtlasManager');
		var __proto=AtlasManager.prototype;
		__proto.Initialize=function(){
			for (var i=0;i < this._maxAtlasNum;i++){
				this._atlaserArray.push(new Atlaser(this._gridNumX,this._gridNumY,this._width,this._height,AtlasManager._sid_));
				AtlasManager._sid_++;
			}
			return true;
		}

		__proto.setAtlasParam=function(width,height,gridSize,maxTexNum){
			if (this._setAtlasParam==true){
				AtlasManager._sid_=0;
				this._width=width;
				this._height=height;
				this._gridSize=gridSize;
				this._maxAtlasNum=maxTexNum;
				this._gridNumX=width / gridSize;
				this._gridNumY=height / gridSize;
				this._curAtlasIndex=0;
				this.freeAll();
				this.Initialize();
				return true;
				}else {
				console.log("设置大图合集参数错误，只能在开始页面设置各种参数");
				throw-1;
				return false;
			}
			return false;
		}

		__proto.computeUVinAtlasTexture=function(texture,offsetX,offsetY){
			var tex=texture;
			var u1=offsetX / this._width,v1=offsetY / this._height,u2=(offsetX+texture.bitmap.width)/ this._width,v2=(offsetY+texture.bitmap.height)/ this._height;
			var inAltasUVWidth=texture.bitmap.width / this._width,inAltasUVHeight=texture.bitmap.height / this._height;
			var oriUV=tex.originalUV;
			texture.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
		}

		//添加 图片到大图集
		__proto.pushData=function(texture){
			var tex=texture;
			this._setAtlasParam=false;
			var bFound=false;
			var nImageGridX=(Math.ceil((texture.bitmap.width+2)/ this._gridSize));
			var nImageGridY=(Math.ceil((texture.bitmap.height+2)/ this._gridSize));
			var bSuccess=false;
			for (var k=0;k < 2;k++){
				var nAtlasSize=this._atlaserArray.length;
				for (var i=0;i < nAtlasSize;++i){
					var altasIndex=(this._curAtlasIndex+i)% nAtlasSize;
					var atlas=this._atlaserArray[altasIndex];
					var bitmap=texture.bitmap;
					if (atlas.webGLImages.indexOf(bitmap)==-1){
						var fillInfo=atlas.addTex(1,nImageGridX,nImageGridY);
						if (fillInfo.ret){
							var offsetX=fillInfo.x *this._gridSize+1;
							var offsetY=fillInfo.y *this._gridSize+1;
							atlas.addToAtlasTexture(bitmap,offsetX,offsetY);
							(!tex.originalUV)&& (tex.originalUV=texture.uv.slice());
							bSuccess=true;
							this._curAtlasIndex=altasIndex;
							this.computeUVinAtlasTexture(texture,bitmap.offsetX,bitmap.offsetY);
							atlas.addToAtlas(texture);
							break ;
						}
						}else {
						(!tex.originalUV)&& (tex.originalUV=texture.uv.slice());
						bSuccess=true;
						this._curAtlasIndex=altasIndex;
						this.computeUVinAtlasTexture(texture,bitmap.offsetX,bitmap.offsetY);
						atlas.addToAtlas(texture);
						break ;
					}
				}
				if (bSuccess)
					break ;
				this._atlaserArray.push(new Atlaser(this._gridNumX,this._gridNumY,this._width,this._height,AtlasManager._sid_++));
				this._needGC=true;
				this.garbageCollection();
				this._curAtlasIndex=this._atlaserArray.length-1;
			}
			if (!bSuccess){
				console.log(">>>AtlasManager pushData error");
			}
			return bSuccess;
		}

		__proto.addToAtlas=function(tex){
			laya.webgl.atlas.AtlasManager.instance.pushData(tex);
		}

		/**
		*回收大图合集,不建议手动调用
		*@return
		*/
		__proto.garbageCollection=function(){
			if (this._needGC===true){
				var n=this._atlaserArray.length-this._maxAtlasNum;
				for (var i=0;i < n;i++)
				this._atlaserArray[i].destroy();
				this._atlaserArray.splice(0,n);
				this._needGC=false;
			}
			return true;
		}

		__proto.freeAll=function(){
			for (var i=0,n=this._atlaserArray.length;i < n;i++){
				this._atlaserArray[i].destroy();
			}
			this._atlaserArray.length=0;
		}

		__getset(1,AtlasManager,'instance',function(){
			if (!AtlasManager.__S_Instance__){
				AtlasManager.__S_Instance__=new AtlasManager(AtlasManager.atlasTextureWidth,AtlasManager.atlasTextureHeight,AtlasManager.gridSize,AtlasManager.maxTextureCount);
			}
			return AtlasManager.__S_Instance__;
		});

		__getset(1,AtlasManager,'atlasLimitWidth',function(){
			return AtlasManager._atlasLimitWidth;
			},function(value){
			AtlasManager._atlasLimitWidth=value;
			Config.atlasLimitWidth=value;
		});

		__getset(1,AtlasManager,'enabled',function(){
			return AtlasManager._enabled;
		});

		__getset(1,AtlasManager,'atlasLimitHeight',function(){
			return AtlasManager._atlasLimitHeight;
			},function(value){
			AtlasManager._atlasLimitHeight=value;
			Config.atlasLimitHeight=value;
		});

		AtlasManager.enable=function(){
			AtlasManager._enabled=true;
			Config.atlasEnable=true;
		}

		AtlasManager.__init__=function(){
			AtlasManager.atlasLimitWidth=512;
			AtlasManager.atlasLimitHeight=512;
		}

		AtlasManager._enabled=false;
		AtlasManager._atlasLimitWidth=0;
		AtlasManager._atlasLimitHeight=0;
		AtlasManager.atlasTextureWidth=2048;
		AtlasManager.atlasTextureHeight=2048;
		AtlasManager.gridSize=16;
		AtlasManager.maxTextureCount=8;
		AtlasManager.BOARDER_TYPE_NO=0;
		AtlasManager.BOARDER_TYPE_RIGHT=1;
		AtlasManager.BOARDER_TYPE_LEFT=2;
		AtlasManager.BOARDER_TYPE_BOTTOM=4;
		AtlasManager.BOARDER_TYPE_TOP=8;
		AtlasManager.BOARDER_TYPE_ALL=15;
		AtlasManager._sid_=0;
		AtlasManager.__S_Instance__=null;
		return AtlasManager;
	})()


	//class laya.webgl.atlas.MergeFillInfo
	var MergeFillInfo=(function(){
		function MergeFillInfo(){
			this.x=0;
			this.y=0;
			this.ret=false;
			this.ret=false;
			this.x=0;
			this.y=0;
		}

		__class(MergeFillInfo,'laya.webgl.atlas.MergeFillInfo');
		return MergeFillInfo;
	})()


	;
	//class laya.webgl.canvas.BlendMode
	var BlendMode=(function(){
		function BlendMode(){};
		__class(BlendMode,'laya.webgl.canvas.BlendMode');
		BlendMode._init_=function(gl){
			BlendMode.fns=[BlendMode.BlendNormal,BlendMode.BlendAdd,BlendMode.BlendMultiply,BlendMode.BlendScreen,BlendMode.BlendOverlay,BlendMode.BlendLight];
			BlendMode.targetFns=[BlendMode.BlendNormalTarget,BlendMode.BlendAddTarget,BlendMode.BlendMultiplyTarget,BlendMode.BlendScreenTarget,BlendMode.BlendOverlayTarget,BlendMode.BlendLightTarget];
		}

		BlendMode.BlendNormal=function(gl){
			gl.blendFunc(0x0302,0x0303);
		}

		BlendMode.BlendAdd=function(gl){
			gl.blendFunc(0x0302,0x0304);
		}

		BlendMode.BlendMultiply=function(gl){
			gl.blendFunc(0x0306,0x0303);
		}

		BlendMode.BlendScreen=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.BlendOverlay=function(gl){
			gl.blendFunc(1,0x0301);
		}

		BlendMode.BlendLight=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.BlendNormalTarget=function(gl){
			gl.blendFuncSeparate(0x0302,0x0303,1,0x0303);
		}

		BlendMode.BlendAddTarget=function(gl){
			gl.blendFunc(0x0302,0x0304);
		}

		BlendMode.BlendMultiplyTarget=function(gl){
			gl.blendFunc(0x0306,0x0303);
		}

		BlendMode.BlendScreenTarget=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.BlendOverlayTarget=function(gl){
			gl.blendFunc(1,0x0301);
		}

		BlendMode.BlendLightTarget=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.NAMES=["normal","add","multiply","screen","overlay","light"];
		BlendMode.TOINT={"normal":0,"add":1,"multiply":2,"screen":3 ,"lighter":1,"overlay":4,"light":5};
		BlendMode.NORMAL="normal";
		BlendMode.ADD="add";
		BlendMode.MULTIPLY="multiply";
		BlendMode.SCREEN="screen";
		BlendMode.LIGHT="light";
		BlendMode.OVERLAY="overlay";
		BlendMode.fns=[];
		BlendMode.targetFns=[];
		return BlendMode;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.DrawStyle
	var DrawStyle=(function(){
		function DrawStyle(value){
			this._color=Color.create("black");
			this.setValue(value);
		}

		__class(DrawStyle,'laya.webgl.canvas.DrawStyle');
		var __proto=DrawStyle.prototype;
		__proto.setValue=function(value){
			if (value){
				if ((typeof value=='string')){
					this._color=Color.create(value);
					return;
				}
				if ((value instanceof laya.utils.Color )){
					this._color=value;
					return;
				}
			}
		}

		__proto.reset=function(){
			this._color=Color.create("black");
		}

		__proto.equal=function(value){
			if ((typeof value=='string'))return this._color.strColor===value;
			return false;
		}

		__proto.toColorStr=function(){
			return this._color.strColor;
		}

		DrawStyle.DEFAULT=new DrawStyle("#000000");
		return DrawStyle;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.Path
	var Path=(function(){
		function Path(){
			this._x=0;
			this._y=0;
			//this._rect=null;
			//this.ib=null;
			//this.vb=null;
			this.dirty=false;
			//this.geomatrys=null;
			//this._curGeomatry=null;
			this.offset=0;
			this.count=0;
			this.geoStart=0;
			this.geomatrys=[];
			var gl=WebGL.mainContext;
			this.ib=new Buffer(0x8893,"INDEX",null,0x88E4);
			this.vb=new Buffer(0x8892);
		}

		__class(Path,'laya.webgl.canvas.Path');
		var __proto=Path.prototype;
		__proto.clear=function(){
			this._rect=null;
		}

		__proto.rect2=function(x,y,w,h,color,borderWidth,borderColor){
			(borderWidth===void 0)&& (borderWidth=2);
			(borderColor===void 0)&& (borderColor=0);
			this.geomatrys.push(this._curGeomatry=new Rect1(x,y,w,h,color,borderWidth,borderColor));
		}

		__proto.rect=function(x,y,width,height){
			this._rect=new Rectangle(x,y,width,height);
			this.dirty=true;
		}

		__proto.strokeRect=function(x,y,width,height){
			this._rect=new Rectangle(x,y,width,height);
		}

		__proto.circle=function(x,y,r,color,borderWidth,borderColor,fill){
			this.geomatrys.push(this._curGeomatry=new Circle(x,y,r,color,borderWidth,borderColor,fill));
		}

		__proto.fan=function(x,y,r,r0,r1,color,borderWidth,borderColor){
			var geo;
			this.geomatrys.push(this._curGeomatry=geo=new Fan(x,y,r,r0,r1,color,borderWidth,borderColor));
			if(!color)geo.fill=false;
		}

		__proto.ellipse=function(x,y,rw,rh,color,borderWidth,borderColor){
			this.geomatrys.push(this._curGeomatry=new Ellipse(x,y,rw,rh,color,borderWidth,borderColor));
		}

		__proto.polygon=function(x,y,r,edges,color,borderWidth,borderColor){
			var geo;
			this.geomatrys.push(this._curGeomatry=geo=new Polygon(x,y,r,edges,color,borderWidth,borderColor));
			if(!color)geo.fill=false;if(borderColor==undefined)geo.borderWidth=0;
		}

		__proto.drawPath=function(x,y,points,color,borderWidth){
			this.geomatrys.push(this._curGeomatry=new Line(x,y,points,color,borderWidth));
		}

		__proto.update=function(){
			var si=this.ib.length;
			var len=this.geomatrys.length;
			this.offset=si;
			for(var i=this.geoStart;i<len;i++){
				this.geomatrys[i].getData(this.ib,this.vb,this.vb.length/(5*4));
			}
			this.geoStart=len;
			this.count=(this.ib.length-si)/2;
		}

		__proto.sector=function(x,y,rW,rH){}
		__proto.roundRect=function(x,y,w,h,rW,rH){}
		__proto.reset=function(){
			this.vb.clear();
			this.ib.clear();
			this.offset=this.count=this.geoStart=0;
			this.geomatrys.length=0;
		}

		return Path;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveBase
	var SaveBase=(function(){
		function SaveBase(){
			//this._valueName=null;
			//this._value=null;
			//this._dataObj=null;
			//this._newSubmit=false;
		}

		__class(SaveBase,'laya.webgl.canvas.save.SaveBase');
		var __proto=SaveBase.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			this._dataObj[this._valueName]=this._value;
			SaveBase._cache[SaveBase._cache._length++]=this;
			this._newSubmit && (context._curSubmit=Submit.RENDERBASE);
		}

		SaveBase._createArray=function(){
			var value=[];
			value._length=0;
			return value;
		}

		SaveBase._init=function(){
			var namemap=SaveBase._namemap={};
			namemap[0x1]="ALPHA";
			namemap[0x2]="fillStyle";
			namemap[0x8]="font";
			namemap[0x100]="lineWidth";
			namemap[0x200]="strokeStyle";
			namemap[0x2000]="_mergeID";
			namemap[0x400]=
			namemap[0x800]=
			namemap[0x1000]=[];
			namemap[0x4000]="textBaseline";
			namemap[0x8000]="textAlign";
			namemap[0x10000]="_nBlendType";
			namemap[0x80000]="shader";
			namemap[0x100000]="filters";
			return namemap;
		}

		SaveBase.save=function(context,type,dataObj,newSubmit){
			if ((context._saveMark._saveuse & type)!==type){
				context._saveMark._saveuse |=type;
				var cache=SaveBase._cache;
				var o=cache._length > 0 ?cache[--cache._length] :(new SaveBase());
				o._value=dataObj[ o._valueName=SaveBase._namemap[type]];
				o._dataObj=dataObj;
				o._newSubmit=newSubmit;
				var _save=context._save;
				_save[_save._length++]=o;
			}
		}

		SaveBase._cache=laya.webgl.canvas.save.SaveBase._createArray();
		SaveBase._namemap=SaveBase._init();
		return SaveBase;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveClipRect
	var SaveClipRect=(function(){
		function SaveClipRect(){
			//this._clipSaveRect=null;
			//this._submitScissor=null;
			this._clipRect=new Rectangle();
		}

		__class(SaveClipRect,'laya.webgl.canvas.save.SaveClipRect');
		var __proto=SaveClipRect.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			context._clipRect=this._clipSaveRect;
			SaveClipRect._cache[SaveClipRect._cache._length++]=this;
			this._submitScissor.submitLength=context._submits._length-this._submitScissor.submitIndex;
			context._curSubmit=Submit.RENDERBASE;
		}

		SaveClipRect.save=function(context,submitScissor){
			if ((context._saveMark._saveuse & 0x20000)==0x20000)return;
			context._saveMark._saveuse |=0x20000;
			var cache=SaveClipRect._cache;
			var o=cache._length > 0?cache[--cache._length]:(new SaveClipRect());
			o._clipSaveRect=context._clipRect;
			context._clipRect=o._clipRect.copyFrom(context._clipRect);
			o._submitScissor=submitScissor;
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveClipRect._cache=SaveBase._createArray();
		return SaveClipRect;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveMark
	var SaveMark=(function(){
		function SaveMark(){
			this._saveuse=0;
			//this._preSaveMark=null;
			;
		}

		__class(SaveMark,'laya.webgl.canvas.save.SaveMark');
		var __proto=SaveMark.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){
			return true;
		}

		__proto.restore=function(context){
			context._saveMark=this._preSaveMark;
			SaveMark._no[SaveMark._no._length++]=this;
		}

		SaveMark.Create=function(context){
			var no=SaveMark._no;
			var o=no._length > 0?no[--no._length]:(new SaveMark());
			o._saveuse=0;
			o._preSaveMark=context._saveMark;
			context._saveMark=o;
			return o;
		}

		SaveMark._no=SaveBase._createArray();
		return SaveMark;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveTransform
	var SaveTransform=(function(){
		function SaveTransform(){
			//this._savematrix=null;
			this._matrix=new Matrix();
		}

		__class(SaveTransform,'laya.webgl.canvas.save.SaveTransform');
		var __proto=SaveTransform.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			context._curMat=this._savematrix;
			SaveTransform._no[SaveTransform._no._length++]=this;
		}

		SaveTransform.save=function(context){
			var _saveMark=context._saveMark;
			if ((_saveMark._saveuse & 0x800)===0x800)return;
			_saveMark._saveuse |=0x800;
			var no=SaveTransform._no;
			var o=no._length > 0?no[--no._length]:(new SaveTransform());
			o._savematrix=context._curMat;
			context._curMat=context._curMat.copy(o._matrix);
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveTransform._no=SaveBase._createArray();
		return SaveTransform;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveTranslate
	var SaveTranslate=(function(){
		function SaveTranslate(){
			//this._x=NaN;
			//this._y=NaN;
		}

		__class(SaveTranslate,'laya.webgl.canvas.save.SaveTranslate');
		var __proto=SaveTranslate.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			var mat=context._curMat;
			context._x=this._x;
			context._y=this._y;
			SaveTranslate._no[SaveTranslate._no._length++]=this;
		}

		SaveTranslate.save=function(context){
			var no=SaveTranslate._no;
			var o=no._length > 0?no[--no._length]:(new SaveTranslate());
			o._x=context._x;
			o._y=context._y;
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveTranslate._no=SaveBase._createArray();
		return SaveTranslate;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.resource.RenderTargetMAX
	var RenderTargetMAX=(function(){
		var OneTarget;
		function RenderTargetMAX(){
			this.targets=null;
			this.oneTargets=null;
			this.repaint=false;
			this._width=NaN;
			this._height=NaN;
			this._clipRect=new Rectangle();
		}

		__class(RenderTargetMAX,'laya.webgl.resource.RenderTargetMAX');
		var __proto=RenderTargetMAX.prototype;
		__proto.size=function(w,h){
			if (this._width===w && this._height===h)return;
			this.repaint=true;
			this._width=w;
			this._height=h;
			if (!this.oneTargets)this.oneTargets=new OneTarget(w,h);
			else this.oneTargets.target.size(w,h);
		}

		__proto._flushToTarget=function(context,target){
			var worldScissorTest=RenderState2D.worldScissorTest;
			var preworldClipRect=RenderState2D.worldClipRect;
			RenderState2D.worldClipRect=this._clipRect;
			this._clipRect.x=this._clipRect.y=0;
			this._clipRect.width=this._width;
			this._clipRect.height=this._height;
			WebGL.mainContext.disable(0x0C11);
			var preAlpha=RenderState2D.worldAlpha;
			var preMatrix4=RenderState2D.worldMatrix4;
			var preMatrix=RenderState2D.worldMatrix;
			var preFilters=RenderState2D.worldFilters;
			var preShaderDefinesValue=RenderState2D.worldShaderDefinesValue;
			RenderState2D.worldMatrix=RenderTargetMAX._matrixDefault;
			RenderState2D.worldMatrix4=RenderState2D.TEMPMAT4_ARRAY;
			RenderState2D.worldAlpha=1;
			RenderState2D.worldFilters=null;
			RenderState2D.worldShaderDefinesValue=0;
			Shader.activeShader=null;
			target.start();
			Config.showCanvasMark?target.clear(0,1,0,0.3):target.clear(0,0,0,0);
			context.flush();
			target.end();
			Shader.activeShader=null;
			RenderState2D.worldAlpha=preAlpha;
			RenderState2D.worldMatrix4=preMatrix4;
			RenderState2D.worldMatrix=preMatrix;
			RenderState2D.worldFilters=preFilters;
			RenderState2D.worldShaderDefinesValue=preShaderDefinesValue;
			worldScissorTest && WebGL.mainContext.enable(0x0C11);
			RenderState2D.worldClipRect=preworldClipRect;
		}

		__proto.flush=function(context){
			if (this.repaint){
				this._flushToTarget(context,this.oneTargets.target);
				this.repaint=false;
			}
		}

		__proto.drawTo=function(context,x,y,width,height){
			context.drawTexture(this.oneTargets.target.getTexture(),x,y,width,height,0,0);
		}

		__proto.destroy=function(){
			if (this.oneTargets){
				this.oneTargets.target.destroy();
				this.oneTargets.target=null;
				this.oneTargets=null;
			}
		}

		__static(RenderTargetMAX,
		['_matrixDefault',function(){return this._matrixDefault=new Matrix();}
		]);
		RenderTargetMAX.__init$=function(){
			//class OneTarget
			OneTarget=(function(){
				function OneTarget(w,h){
					//this.x=NaN;
					//this.y=NaN;
					//this.width=NaN;
					//this.height=NaN;
					//this.target=null;
					this.width=w;
					this.height=h;
					this.target=RenderTarget2D.create(w,h);
				}
				__class(OneTarget,'');
				return OneTarget;
			})()
		}

		return RenderTargetMAX;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.Shader
	var Shader=(function(){
		function Shader(vs,ps,saveName,nameMap){
			this.customCompile=false;
			//this._nameMap=null;
			//this._vs=null;
			//this._ps=null;
			//this._texIndex=0;
			this.tag={};
			this._program=null;
			this._params=null;
			this._paramsMap={};
			this._offset=0;
			//this._id=0;
			this._id=++Shader._count;
			this._vs=vs;
			this._ps=ps;
			this._nameMap=nameMap ? nameMap :{};
			saveName !=null && (Shader.sharders[saveName]=this);
		}

		__class(Shader,'laya.webgl.shader.Shader');
		var __proto=Shader.prototype;
		__proto.compile=function(){
			if (!this._vs || !this._ps || this._params)
				return;
			this._params=[];
			var text=[this._vs,this._ps];
			var result;
			if (this.customCompile)
				result=this.preCompile(this._vs,this._ps);
			var gl=WebGL.mainContext;
			this._program=gl.createProgram();
			var vshader=Shader._createShader(gl,text[0],0x8B31);
			var pshader=Shader._createShader(gl,text[1],0x8B30);
			gl.attachShader(this._program,vshader);
			gl.attachShader(this._program,pshader);
			gl.linkProgram(this._program);
			if (!gl.getProgramParameter(this._program,0x8B82)){
				throw gl.getProgramInfoLog(this._program);
			};
			var one,i=0,j=0,n=0,location=0;
			var attribNum=0;
			if (this.customCompile)
				attribNum=result.attributes.length;
			else
			attribNum=gl.getProgramParameter(this._program,0x8B89);
			for (i=0;i < attribNum;i++){
				var attrib;
				if (this.customCompile)
					attrib=result.attributes[i];
				else
				attrib=gl.getActiveAttrib(this._program,i);
				location=gl.getAttribLocation(this._program,attrib.name);
				one={vartype:"attribute",ivartype:0,attrib:attrib,location:location,name:attrib.name,type:attrib.type,isArray:false,isSame:false,preValue:null,indexOfParams:0 };
				this._params.push(one);
			};
			var nUniformNum=0;
			if (this.customCompile)
				nUniformNum=result.uniforms.length;
			else
			nUniformNum=gl.getProgramParameter(this._program,0x8B86);
			for (i=0;i < nUniformNum;i++){
				var uniform;
				if (this.customCompile)
					uniform=result.uniforms[i];
				else
				uniform=gl.getActiveUniform(this._program,i);
				location=gl.getUniformLocation(this._program,uniform.name);
				one={vartype:"uniform",ivartype:1,attrib:attrib,location:location,name:uniform.name,type:uniform.type,isArray:false,isSame:false,preValue:null,indexOfParams:0};
				if (one.name.indexOf('[0]')> 0){
					one.name=one.name.substr(0,one.name.length-3);
					one.isArray=true;
					one.location=gl.getUniformLocation(this._program,one.name);
				}
				this._params.push(one);
			}
			for (i=0,n=this._params.length;i < n;i++){
				one=this._params[i];
				one.indexOfParams=i;
				one.index=1;
				one.value=[one.location,null];
				one.codename=one.name;
				one.name=this._nameMap[one.codename] ? this._nameMap[one.codename] :one.codename;
				this._paramsMap[one.name]=one;
				one._this=this;
				one.saveValue=[];
				if (one.vartype==="attribute"){
					one.fun=this._attribute;
					continue ;
				}
				switch (one.type){
					case 0x1406:
						one.fun=one.isArray ? this._uniform1fv :this._uniform1f;
						break ;
					case 0x8B50:
						one.fun=this._uniform_vec2;
						break ;
					case 0x8B51:
						one.fun=this._uniform_vec3;
						break ;
					case 0x8B52:
						one.fun=this._uniform_vec4;
						break ;
					case 0x8B5E:
						one.fun=this._uniform_sampler2D;
						break ;
					case 0x8B5C:
						one.fun=this._uniformMatrix4fv;
						break ;
					case 0x8B56:
						one.fun=this._uniform1i;
						break ;
					case 0x8B60:
					case 0x8B5A:
					case 0x8B5B:
						throw new Error("compile shader err!");
						break ;
					default :
						throw new Error("compile shader err!");
						break ;
					}
			}
			this._vs=this._ps=null;
		}

		/**
		*根据变量名字获得
		*@param name
		*@return
		*/
		__proto.getUniform=function(name){
			return this._paramsMap[name];
		}

		__proto._attribute=function(one,value){
			var gl=WebGL.mainContext;
			gl.enableVertexAttribArray(one.location);
			gl.vertexAttribPointer(one.location,value[0],value[1],value[2],value[3],value[4]+this._offset);
			return 2;
		}

		__proto._uniformMatrix4fv=function(one,value){
			WebGL.mainContext.uniformMatrix4fv(one.location,false,value);
			return 1;
		}

		__proto._uniform1i=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value){
				WebGL.mainContext.uniform1i(one.location,saveValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform1f=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value){
				WebGL.mainContext.uniform1f(one.location,saveValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform1fv=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value){
				WebGL.mainContext.uniform1fv(one.location,saveValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec2=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value[0] || saveValue[1]!==value[1]){
				WebGL.mainContext.uniform2f(one.location,saveValue[0]=value[0],saveValue[1]=value[1]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec3=function(one,value){
			WebGL.mainContext.uniform3f(one.location,value[0],value[1],value[2]);
			return 1;
		}

		__proto._uniform_vec4=function(one,value){
			WebGL.mainContext.uniform4f(one.location,value[0],value[1],value[2],value[3]);
			return 1;
		}

		__proto._uniform_sampler2D=function(one,value){
			var gl=WebGL.mainContext;
			gl.activeTexture(Shader._TEXTURES[this._texIndex]);
			gl.bindTexture(0x0DE1,value);
			var saveValue=one.saveValue;
			if (saveValue[0]!==this._texIndex)
				gl.uniform1i(one.location,saveValue[0]=this._texIndex);
			this._texIndex++;
			return 1;
		}

		__proto.uploadOne=function(name,value){
			this._program || this.compile();
			WebGLContext.UseProgram(this._program);
			var one=this._paramsMap[name];
			one.fun.call(this,one,value);
		}

		__proto._noSetValue=function(one){
			console.log("no....:"+one.name);
		}

		/**
		*提交shader到GPU
		*@param shaderValue
		*/
		__proto.upload=function(shaderValue,params){
			Shader.activeShader=this;
			this._program || this.compile();
			WebGLContext.UseProgram(this._program);
			this._texIndex=0;
			params=params || this._params;
			var one,value,n=params.length,shaderCall=0;
			for (var i=0;i < n;i++){
				one=params[i];
				((value=shaderValue[one.name])!==null)&& (shaderCall+=one.fun.call(this,one,value));
			}
			Stat.shaderCall+=shaderCall;
		}

		/**
		*按数组的定义提交
		*@param shaderValue 数组格式[name,[value,id],...]
		*/
		__proto.uploadArray=function(shaderValue,length,_bufferUsage){
			Shader.activeShader=this;
			this._program || this.compile();
			this._texIndex=0;
			var sameProgram=!WebGLContext.UseProgram(this._program);
			var params=this._params,value;
			var one,shaderCall=0,uploadArrayCount=Shader._uploadArrayCount++;
			for (var i=length-2;i >=0;i-=2){
				one=this._paramsMap[shaderValue[i]]
				if (!one || one._uploadArrayCount===uploadArrayCount)
					continue ;
				one._uploadArrayCount=uploadArrayCount;
				var v=shaderValue[i+1];
				var uid=v[1];
				if (sameProgram&&one.ivartype===1 && uid > 0 && uid===one.__uploadid)
					continue ;
				value=v[0];
				if (value!=null){
					_bufferUsage && _bufferUsage[one.name] && _bufferUsage[one.name].bind();
					shaderCall+=one.fun.call(this,one,value);
					one.__uploadid=uid;
				}
			}
			Stat.shaderCall+=shaderCall;
		}

		/**
		*得到编译后的变量及相关预定义
		*@return
		*/
		__proto.getParams=function(){
			return this._params;
		}

		__proto.preCompile=function(vs,ps){
			var text=[vs,ps];
			var result={};
			var attributes=[];
			var uniforms=[];
			result.attributes=attributes;
			result.uniforms=uniforms;
			var removeAnnotation=new RegExp("(/\\*([^*]|[\\r\\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/)|(//.*)","g");
			var reg=new RegExp("(\".*\")|('.*')|([\\w\\*-\\.+/()=<>{}\\\\]+)|([,;:\\\\])","g");
			var i=0,n=0,one;
			for (var s=0;s < 2;s++){
				text[s]=text[s].replace(removeAnnotation,"");
				var words=text[s].match(reg);
				var str="";
				var ofs=0;
				for (i=0,n=words.length;i < n;i++){
					var word=words[i];
					if (word !="attribute" && word !="uniform"){
						str+=word;
						if (word !=";")str+=" ";
						continue ;
					}
					one={type:Shader.shaderParamsMap[words[i+1]],name:words[i+2],size:isNaN(Laya.__parseInt(words[i+3]))?1:Laya.__parseInt(words[i+3])};
					if (word=="attribute"){
						attributes.push(one);
					}
					else{
						uniforms.push(one);
					}
					str+=one.vartype+" "+one.type+" "+one.name+" ";
					if (words[i+3]==':'){
						one.type=words[i+4];
						i+=2;
					}
					i+=2;
				}
				text[s]=str;
			}
			return result;
		}

		Shader.getShader=function(name){
			return Shader.sharders[name];
		}

		Shader.create=function(vs,ps,saveName,nameMap){
			return new Shader(vs,ps,saveName,nameMap);
		}

		Shader._createShader=function(gl,str,type){
			var shader=gl.createShader(type);
			gl.shaderSource(shader,str);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader,0x8B81)){
				throw gl.getShaderInfoLog(shader);
			}
			return shader;
		}

		Shader.addInclude=function(fileName,txt){
			if (!txt || txt.length===0)
				throw new Error("add shader include file err:"+fileName);
			if (Shader._includeFiles[fileName])
				throw new Error("add shader include file err, has add:"+fileName);
			Shader._includeFiles[fileName]=txt;
		}

		Shader.preCompile=function(nameID,mainID,vs,ps,nameMap){
			var id=0.0002 *nameID+mainID;
			Shader._preCompileShader[id]=new ShaderCompile(id,vs,ps,nameMap,Shader._includeFiles);
		}

		Shader.withCompile=function(nameID,mainID,define,shaderName,createShader){
			if (shaderName && Shader.sharders[shaderName])
				return Shader.sharders[shaderName];
			var pre=Shader._preCompileShader[0.0002 *nameID+mainID];
			if (!pre)
				throw new Error("withCompile shader err!"+nameID+" "+mainID);
			return pre.createShader(define,shaderName,createShader);
		}

		Shader.SHADERNAME2ID=0.0002;
		Shader.activeShader=null
		Shader.sharders=(Shader.sharders=[],Shader.sharders.length=0x20,Shader.sharders);
		Shader._includeFiles={};
		Shader._count=0;
		Shader._preCompileShader={};
		Shader._uploadArrayCount=1;
		Shader._TEXTURES=[0x84C0,0x84C1,0x84C2,0x84C3,0x84C4,0x84C5,0x84C6,,0x84C7,0x84C8];
		__static(Shader,
		['nameKey',function(){return this.nameKey=new StringKey();},'shaderParamsMap',function(){return this.shaderParamsMap={
				"float":0x1406,
				"int":0x1404,
				"bool":0x8B56,
				"vec2":0x8B50,
				"vec3":0x8B51,
				"vec4":0x8B52,
				"ivec2":0x8B53,
				"ivec3":0x8B54,
				"ivec4":0x8B55,
				"bvec2":0x8B57,
				"bvec3":0x8B58,
				"bvec4":0x8B59,
				"mat2":0x8B5A,
				"mat3":0x8B5B,
				"mat4":0x8B5C,
				"sampler2D":0x8B5E,
				"samplerCube":0x8B60
		};}

		]);
		return Shader;
	})()


	//class laya.webgl.shader.d2.Shader2D
	var Shader2D=(function(){
		function Shader2D(){
			this.ALPHA=1;
			//this.shader=null;
			//this.filters=null;
			this.shaderType=0;
			//this.colorAdd=null;
			//this.strokeStyle=null;
			//this.fillStyle=null;
			this.glTexture=new WebGLImage();
			this.defines=new ShaderDefines2D();
		}

		__class(Shader2D,'laya.webgl.shader.d2.Shader2D');
		Shader2D.__init__=function(){
			Shader.addInclude("parts/ColorFilter_ps_uniform.glsl","uniform float u_colorMatrix[20];\n");
			Shader.addInclude("parts/ColorFilter_ps_logic.glsl","vec4 rgba=gl_FragColor;\ngl_FragColor.r =rgba.r*u_colorMatrix[0]+rgba.g*u_colorMatrix[1]+rgba.b*u_colorMatrix[2]+rgba.a*u_colorMatrix[3]+u_colorMatrix[4];\ngl_FragColor.g =rgba.r*u_colorMatrix[5]+rgba.g*u_colorMatrix[6]+rgba.b*u_colorMatrix[7]+rgba.a*u_colorMatrix[8]+u_colorMatrix[9];\ngl_FragColor.b =rgba.r*u_colorMatrix[10]+rgba.g*u_colorMatrix[11]+rgba.b*u_colorMatrix[12]+rgba.a*u_colorMatrix[13]+u_colorMatrix[14];\ngl_FragColor.a =rgba.r*u_colorMatrix[15]+rgba.g*u_colorMatrix[16]+rgba.b*u_colorMatrix[17]+rgba.a*u_colorMatrix[18]+u_colorMatrix[19];");
			Shader.addInclude("parts/GlowFilter_ps_uniform.glsl","uniform bool u_blurX;\nuniform vec4 u_color;\nuniform float u_offset;\nuniform float u_strength;\nuniform float u_texW;\nuniform float u_texH;");
			Shader.addInclude("parts/GlowFilter_ps_logic.glsl","const int c_FilterTime = 9;\nconst float c_Gene = (1.0/(1.0 + 2.0*(0.93 + 0.8 + 0.7 + 0.6 + 0.5 + 0.4 + 0.3 + 0.2 + 0.1)));\nvec4 vec4Color = gl_FragColor*c_Gene;\nfloat aryAttenuation[c_FilterTime];\naryAttenuation[0] = 0.93;\naryAttenuation[1] = 0.8;\naryAttenuation[2] = 0.7;\naryAttenuation[3] = 0.6;\naryAttenuation[4] = 0.5;\naryAttenuation[5] = 0.4;\naryAttenuation[6] = 0.3;\naryAttenuation[7] = 0.2;\naryAttenuation[8] = 0.1;\n\nfloat u_TexSpaceU=1.0/u_texW;\nfloat u_TexSpaceV=1.0/u_texH;\nvec2 vec2FilterDir;\nif(u_blurX)\n	vec2FilterDir = vec2(u_offset*u_TexSpaceU/9.0, 0.0);\nelse\n	vec2FilterDir = vec2(0.0,u_offset*u_TexSpaceV/9.0);\nvec2 vec2Step = vec2FilterDir;\n\nfor(int i = 0;i< c_FilterTime; ++i){\n	vec4Color += texture2D(texture, v_texcoord + vec2Step)*aryAttenuation[i]*c_Gene;\n	vec4Color += texture2D(texture, v_texcoord - vec2Step)*aryAttenuation[i]*c_Gene;\n	vec2Step += vec2FilterDir;\n}\n\ngl_FragColor = vec4Color.a*u_color*u_strength;");
			Shader.addInclude("parts/BlurFilter_ps_logic.glsl","gl_FragColor=vec4(0.0);\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 0])*0.004431848411938341;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 1])*0.05399096651318985;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 2])*0.2419707245191454;\ngl_FragColor += texture2D(texture, v_texcoord        )*0.3989422804014327;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 3])*0.2419707245191454;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 4])*0.05399096651318985;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 5])*0.004431848411938341;");
			Shader.addInclude("parts/BlurFilter_ps_uniform.glsl","varying vec2 vBlurTexCoords[6];");
			Shader.addInclude("parts/BlurFilter_vs_uniform.glsl","uniform float strength;\nvarying vec2 vBlurTexCoords[6];");
			Shader.addInclude("parts/BlurFilter_vs_logic.glsl","\nvBlurTexCoords[ 0] = v_texcoord + vec2(-0.012 * strength, 0.0);\nvBlurTexCoords[ 1] = v_texcoord + vec2(-0.008 * strength, 0.0);\nvBlurTexCoords[ 2] = v_texcoord + vec2(-0.004 * strength, 0.0);\nvBlurTexCoords[ 3] = v_texcoord + vec2( 0.004 * strength, 0.0);\nvBlurTexCoords[ 4] = v_texcoord + vec2( 0.008 * strength, 0.0);\nvBlurTexCoords[ 5] = v_texcoord + vec2( 0.012 * strength, 0.0);");
			Shader.addInclude("parts/ColorAdd_ps_uniform.glsl","uniform vec4 colorAdd;\n");
			Shader.addInclude("parts/ColorAdd_ps_logic.glsl","gl_FragColor = vec4(colorAdd.rgb,colorAdd.a*gl_FragColor.a);");
			var vs,ps;
			vs="attribute vec4 position;\nattribute vec2 texcoord;\nuniform vec2 size;\nuniform mat4 mmat;\nvarying vec2 v_texcoord;\n\n#include?BLUR_FILTER  \"parts/BlurFilter_vs_uniform.glsl\";\nvoid main() {\n  vec4 pos=mmat*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  v_texcoord = texcoord;\n  #include?BLUR_FILTER  \"parts/BlurFilter_vs_logic.glsl\";\n}";
			ps="precision mediump float;\n//precision highp float;\nvarying vec2 v_texcoord;\nuniform sampler2D texture;\nuniform float alpha;\n#include?BLUR_FILTER  \"parts/BlurFilter_ps_uniform.glsl\";\n#include?COLOR_FILTER \"parts/ColorFilter_ps_uniform.glsl\";\n#include?GLOW_FILTER \"parts/GlowFilter_ps_uniform.glsl\";\n#include?COLOR_ADD \"parts/ColorAdd_ps_uniform.glsl\";\n\nvoid main() {\n   vec4 color= texture2D(texture, v_texcoord);\n   color.a*=alpha;\n   gl_FragColor=color;\n   #include?COLOR_ADD \"parts/ColorAdd_ps_logic.glsl\";   \n   #include?BLUR_FILTER  \"parts/BlurFilter_ps_logic.glsl\";\n   #include?COLOR_FILTER \"parts/ColorFilter_ps_logic.glsl\";\n   #include?GLOW_FILTER \"parts/GlowFilter_ps_logic.glsl\";\n}";
			Shader.preCompile(0,0x01,vs,ps,null);
			vs="attribute vec4 position;\nuniform vec2 size;\nuniform mat4 mmat;\nvoid main() {\n  vec4 pos=mmat*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n}";
			ps="precision mediump float;\nuniform vec4 color;\nuniform float alpha;\n#include?COLOR_FILTER \"parts/ColorFilter_ps_uniform.glsl\";\nvoid main() {\n	vec4 a = vec4(color.r, color.g, color.b, color.a);\n	a.w = alpha;\n	gl_FragColor = a;\n	#include?COLOR_FILTER \"parts/ColorFilter_ps_logic.glsl\";\n}";
			Shader.preCompile(0,0x02,vs,ps,null);
			vs="attribute vec4 position;\nattribute vec3 a_color;\nuniform mat4 mmat;\nuniform mat4 u_mmat2;\nuniform vec2 size;\nvarying vec3 color;\nvoid main(){\n  vec4 pos=mmat*u_mmat2*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  color=a_color;\n}";
			ps="precision lowp float;\n//precision mediump float;\nvarying vec3 color;\nuniform float alpha;\nvoid main(){\n	//vec4 a=vec4(color.r, color.g, color.b, 1);\n	//a.a*=alpha;\n    gl_FragColor=vec4(color.r, color.g, color.b, alpha);\n}";
			Shader.preCompile(0,0x04,vs,ps,null);
		}

		return Shader2D;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.ShaderDefines
	var ShaderDefines=(function(){
		function ShaderDefines(name2int,int2name,int2nameMap){
			this._value=0;
			//this._name2int=null;
			//this._int2name=null;
			//this._int2nameMap=null;
			this._name2int=name2int;
			this._int2name=int2name;
			this._int2nameMap=int2nameMap;
		}

		__class(ShaderDefines,'laya.webgl.shader.ShaderDefines');
		var __proto=ShaderDefines.prototype;
		__proto.add=function(value){
			if ((typeof value=='string'))value=this._name2int[value];
			this._value |=value;
			return this._value;
		}

		__proto.addInt=function(value){
			this._value |=value;
			return this._value;
		}

		__proto.remove=function(value){
			if ((typeof value=='string'))value=this._name2int[value];
			this._value &=(~value);
			return this._value;
		}

		__proto.isDefine=function(def){
			return (this._value & def)===def;
		}

		__proto.getValue=function(){
			return this._value;
		}

		__proto.setValue=function(value){
			this._value=value;
		}

		__proto.toString=function(){
			var r=this._int2nameMap[this._value];
			return r?r:ShaderDefines._toText(this._value,this._int2name,this._int2nameMap);
		}

		ShaderDefines._reg=function(name,value,_name2int,_int2name){
			_name2int[name]=value;
			_int2name[value]=name;
		}

		ShaderDefines._toText=function(value,_int2name,_int2nameMap){
			var r=_int2nameMap[value];
			if (r)return r;
			var o={};
			var d=1;
			for (var i=0;i < 32;i++){
				d=1 << i;
				if (d > value)break ;
				if (value & d){
					var name=_int2name[d];
					name && (o[name]="");
				}
			}
			_int2nameMap[value]=o;
			return o;
		}

		ShaderDefines._toInt=function(names,_name2int){
			var words=names.split('.');
			var num=0;
			for (var i=0,n=words.length;i < n;i++){
				var value=_name2int[words[i]];
				if (!value)throw new Error("Defines to int err:"+names+"/"+words[i]);
				num |=value;
			}
			return num;
		}

		return ShaderDefines;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.ShaderValue
	var ShaderValue=(function(){
		function ShaderValue(){}
		__class(ShaderValue,'laya.webgl.shader.ShaderValue');
		return ShaderValue;
	})()


	//此类可以减少代码
	//class laya.webgl.shapes.BasePoly
	var BasePoly=(function(){
		function BasePoly(x,y,width,height,edges,color,borderWidth,borderColor,round){
			//this.x=NaN;
			//this.y=NaN;
			//this.r=NaN;
			//this.width=NaN;
			//this.height=NaN;
			//this.edges=NaN;
			this.r0=0
			//this.color=0;
			//this.borderColor=NaN;
			//this.borderWidth=NaN;
			//this.round=0;
			this.fill=true;
			this.r1=Math.PI / 2;
			(round===void 0)&& (round=0);
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
			this.edges=edges;
			this.color=color;
			this.borderWidth=borderWidth;
			this.borderColor=borderColor;
		}

		__class(BasePoly,'laya.webgl.shapes.BasePoly');
		var __proto=BasePoly.prototype;
		Laya.imps(__proto,{"laya.webgl.shapes.IShape":true})
		__proto.getData=function(ib,vb,start){
			var indices=[];
			var verts=[];
			this.circle(verts,indices,start);
			if (this.fill){
				(this.borderWidth > 0)&& this.createLoopLine(verts,indices,this.borderWidth,start+verts.length / 5);
				ib.append(new Uint16Array(indices));
				vb.append(new Float32Array(verts));
			}
			else{
				var outV=[];
				var outI=[];
				this.createLoopLine(verts,indices,this.borderWidth,start,outV,outI);
				ib.append(new Uint16Array(outI));
				vb.append(new Float32Array(outV));
			}
		}

		__proto.circle=function(outVert,outIndex,start){
			var x=this.x,y=this.y,edges=this.edges,seg=(Math.PI *2)/ edges;
			var w=this.width,h=this.height,color=this.color;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			outVert.push(x,y,r,g,b);
			for (var i=0;i < edges;i++){
				outVert.push(x+Math.sin(seg *i)*w,y+Math.cos(seg *i)*h);
				outVert.push(r,g,b);
			}
			for (i=0;i < edges;i++){
				outIndex.push(start,start+i+1,start+i+2);
			}
			outIndex[outIndex.length-1]=start+1;
		}

		__proto.sector=function(outVert,outIndex,start){
			var x=this.x,y=this.y,edges=this.edges,seg=(this.r1-this.r0)/ edges;
			var w=this.width,h=this.height,color=this.color;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			outVert.push(x,y,r,g,b);
			for (var i=0;i < edges+1;i++){
				outVert.push(x+Math.sin(seg *i+this.r0)*w,y+Math.cos(seg *i+this.r0)*h);
				outVert.push(r,g,b);
			}
			for (i=0;i < edges;i++){
				outIndex.push(start,start+i+1,start+i+2);
			}
		}

		//outIndex[outIndex.length-1]=start+1;
		__proto.createFanLine=function(p,indices,lineWidth,len,outVertex,outIndex){
			var points=p.concat();
			var result=outVertex ? outVertex :p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			var firstPoint=[points[0],points[1]];
			var lastPoint=[points[points.length-5],points[points.length-4]];
			var midPointX=lastPoint[0]+(firstPoint[0]-lastPoint[0])*0.5;
			var midPointY=lastPoint[1]+(firstPoint[1]-lastPoint[1])*0.5;
			points.unshift(midPointX,midPointY,0,0,0);
			points.push(midPointX,midPointY,0,0,0);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			indices=outIndex ? outIndex :indices;
			var groupLen=this.edges+3;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+1,iStart+1,iStart,iStart+(i-1)*2);
			return result;
		}

		//用于画线
		__proto.createLine2=function(p,indices,lineWidth,len,outVertex,indexCount){
			var points=p.concat();
			var result=outVertex;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			var length=points.length / 2;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[2];
			p2y=points[3];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx+this.x,p1y-perpy+this.y,r,g,b,p1x+perpx+this.x,p1y+perpy+this.y,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*2];
				p1y=points[(i-1)*2+1];
				p2x=points[(i)*2];
				p2y=points[(i)*2+1];
				p3x=points[(i+1)*2];
				p3y=points[(i+1)*2+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx+this.x,p2y-perpy+this.y,r,g,b,p2x+perpx+this.x,p2y+perpy+this.y,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px+this.x,py+this.y,r,g,b,p2x-(px-p2x)+this.x,p2y-(py-p2y)+this.y,r,g,b);
			}
			p1x=points[points.length-4];
			p1y=points[points.length-3];
			p2x=points[points.length-2];
			p2y=points[points.length-1];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p2x-perpx+this.x,p2y-perpy+this.y,r,g,b,p2x+perpx+this.x,p2y+perpy+this.y,r,g,b);
			var groupLen=indexCount;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			return result;
		}

		//用于比如 扇形 不带两直线
		__proto.createLine=function(p,indices,lineWidth,len){
			var points=p.concat();
			var result=p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			points.splice(0,5);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			p1x=points[points.length-10];
			p1y=points[points.length-9];
			p2x=points[points.length-5];
			p2y=points[points.length-4];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			return result;
		}

		//闭合路径
		__proto.createLoopLine=function(p,indices,lineWidth,len,outVertex,outIndex){
			var points=p.concat();
			var result=outVertex ? outVertex :p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			points.splice(0,5);
			var firstPoint=[points[0],points[1]];
			var lastPoint=[points[points.length-5],points[points.length-4]];
			var midPointX=lastPoint[0]+(firstPoint[0]-lastPoint[0])*0.5;
			var midPointY=lastPoint[1]+(firstPoint[1]-lastPoint[1])*0.5;
			points.unshift(midPointX,midPointY,0,0,0);
			points.push(midPointX,midPointY,0,0,0);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			if (outIndex){
				indices=outIndex;
			};
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+1,iStart+1,iStart,iStart+(i-1)*2);
			return result;
		}

		return BasePoly;
	})()


	/**
	*...
	*@author River
	*/
	//class laya.webgl.submit.Submit
	var Submit=(function(){
		function Submit(renderType){
			//this._renderType=0;
			//this._selfVb=null;
			//this._ib=null;
			//this._blendFn=null;
			//this._vb=null;
			//this._startIdx=0;
			//this._numEle=0;
			//this._submitID=NaN;
			//this._mergID=0;
			//this.shaderValue=null;
			(renderType===void 0)&& (renderType=1);
			this._renderType=renderType;
		}

		__class(Submit,'laya.webgl.submit.Submit');
		var __proto=Submit.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.releaseRender=function(){
			var cache=Submit._cache;
			cache[cache._length++]=this;
			this.shaderValue.release();
			this._submitID=-1;
			this._vb=null;
		}

		__proto.getRenderType=function(){
			return this._renderType;
		}

		__proto.renderSubmit=function(){
			if (this._numEle===0)return 1;
			if (this.shaderValue.textureHost){
				if (!this.shaderValue.textureHost.bitmap||!this.shaderValue.textureHost.source)
					return 1;
				this.shaderValue.texture=this.shaderValue.textureHost.source;
			}
			this._ib.upload_bind();
			this._vb.upload_bind();
			this.shaderValue.upload();
			var gl=WebGL.mainContext;
			if (Submit.activeBlendFunction!==this._blendFn){
				gl.enable(0x0BE2);
				this._blendFn(gl);
				Submit.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle / 3;
			gl.drawElements(0x0004,this._numEle,0x1403,this._startIdx);
			return 1;
		}

		Submit.__init__=function(){
			var s=Submit.RENDERBASE=new Submit(-1);
			s.shaderValue=new Value2D(0,0);
			s.shaderValue.ALPHA=-1234;
		}

		Submit.create=function(context,submitID,mergID,ib,vb,pos,sv){
			var o=Submit._cache._length?Submit._cache[--Submit._cache._length]:new Submit();
			if (vb==null){
				vb=o._selfVb || (o._selfVb=new Buffer(0x8892));
				vb.clear();
				pos=0;
			}
			o._ib=ib;
			o._vb=vb;
			o._submitID=submitID;
			o._mergID=mergID;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			var blendType=context._nBlendType;
			o._blendFn=context._targets?BlendMode.targetFns[blendType]:BlendMode.fns[blendType];
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			var filters=context._shader2D.filters;
			filters && o.shaderValue.setFilters(filters);
			return o;
		}

		Submit.createShape=function(ctx,ib,vb,numEle,offset,sv){
			var o=(!Submit._cache._length)?(new Submit()):Submit._cache[--Submit._cache._length];
			o._ib=ib;
			o._vb=vb;
			o._numEle=numEle;
			o._startIdx=offset;
			o.shaderValue=sv;
			o.shaderValue.setValue(ctx._shader2D);
			var blendType=ctx._nBlendType;
			o._blendFn=ctx._targets?BlendMode.targetFns[blendType]:BlendMode.fns[blendType];
			return o;
		}

		Submit.TYPE_2D=1;
		Submit.TYPE_CANVAS=3;
		Submit.TYPE_CMDSETRT=4;
		Submit.TYPE_CUSTOM=5;
		Submit.TYPE_BLURRT=6;
		Submit.TYPE_CMDDESTORYPRERT=7;
		Submit.TYPE_DISABLESTENCIL=8;
		Submit.TYPE_OTHERIBVB=9;
		Submit.TYPE_PRIMITIVE=10;
		Submit.TYPE_RT=11;
		Submit.TYPE_BLUR_RT=12;
		Submit.TYPE_TARGET=13;
		Submit.TYPE_CHANGE_VALUE=14;
		Submit.TYPE_SHAPE=15;
		Submit.RENDERBASE=null
		Submit.activeBlendFunction=null;
		Submit._cache=(Submit._cache=[],Submit._cache._length=0,Submit._cache);
		return Submit;
	})()


	//class laya.webgl.submit.SubmitCMD
	var SubmitCMD=(function(){
		function SubmitCMD(){
			this.fun=null;
			this.args=null;
		}

		__class(SubmitCMD,'laya.webgl.submit.SubmitCMD');
		var __proto=SubmitCMD.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		//debugger;
		__proto.renderSubmit=function(){
			this.fun.apply(null,this.args);
			return 1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitCMD._cache;
			cache[cache._length++]=this;
		}

		SubmitCMD.create=function(args,fun){
			var o=SubmitCMD._cache._length?SubmitCMD._cache[--SubmitCMD._cache._length]:new SubmitCMD();
			o.fun=fun;
			o.args=args;
			return o;
		}

		SubmitCMD._cache=(SubmitCMD._cache=[],SubmitCMD._cache._length=0,SubmitCMD._cache);
		return SubmitCMD;
	})()


	//class laya.webgl.submit.SubmitCMDScope
	var SubmitCMDScope=(function(){
		function SubmitCMDScope(){
			this.variables={};
		}

		__class(SubmitCMDScope,'laya.webgl.submit.SubmitCMDScope');
		var __proto=SubmitCMDScope.prototype;
		__proto.getValue=function(name){
			return this.variables[name];
		}

		__proto.addValue=function(name,value){
			return this.variables[name]=value;
		}

		__proto.setValue=function(name,value){
			if(this.variables.hasOwnProperty(name)){
				return this.variables[name]=value;
			}
			return null;
		}

		__proto.clear=function(){
			for(var key in this.variables){
				delete this.variables[key];
			}
		}

		__proto.recycle=function(){
			this.clear();
			SubmitCMDScope.POOL.push(this);
		}

		SubmitCMDScope.create=function(){
			var scope=SubmitCMDScope.POOL.pop();
			scope||(scope=new SubmitCMDScope());
			return scope;
		}

		SubmitCMDScope.POOL=[];
		return SubmitCMDScope;
	})()


	/**
	*...
	*@author wk
	*/
	//class laya.webgl.submit.SubmitOtherIBVB
	var SubmitOtherIBVB=(function(){
		function SubmitOtherIBVB(){
			this.offset=0;
			//this._vb=null;
			//this._ib=null;
			//this._blendFn=null;
			//this._mat=null;
			//this._shader=null;
			//this._shaderValue=null;
			//this._numEle=0;
			this.startIndex=0;
			;
			this._mat=Matrix.create();
		}

		__class(SubmitOtherIBVB,'laya.webgl.submit.SubmitOtherIBVB');
		var __proto=SubmitOtherIBVB.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.releaseRender=function(){
			var cache=SubmitOtherIBVB._cache;
			cache[cache._length++]=this;
		}

		__proto.getRenderType=function(){
			return 9;
		}

		__proto.renderSubmit=function(){
			if (this._shaderValue.textureHost){
				var source=this._shaderValue.textureHost.source;
				if (!source)return 1;
				this._shaderValue.texture=source;
			}
			this._ib.upload_bind();
			this._vb.upload_bind();
			var w=RenderState2D.worldMatrix4;
			var wmat=Matrix.TEMP;
			Matrix.mulPre(this._mat,w[0],w[1],w[4],w[5],w[12],w[13],wmat);
			var tmp=RenderState2D.worldMatrix4=SubmitOtherIBVB.tempMatrix4;
			tmp[0]=wmat.a;
			tmp[1]=wmat.b;
			tmp[4]=wmat.c;
			tmp[5]=wmat.d;
			tmp[12]=wmat.tx;
			tmp[13]=wmat.ty;
			this._shader._offset=this.offset;
			this._shaderValue.refresh();
			this._shader.upload(this._shaderValue);
			this._shader._offset=0;
			var gl=WebGL.mainContext;
			if (Submit.activeBlendFunction!==this._blendFn){
				gl.enable(0x0BE2);
				this._blendFn(gl);
				Submit.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle/3;
			gl.drawElements(0x0004,this._numEle,0x1403,this.startIndex);
			RenderState2D.worldMatrix4=w;
			Shader.activeShader=null;
			return 1;
		}

		SubmitOtherIBVB.create=function(context,vb,ib,numElement,shader,shaderValue,startIndex,offset){
			var o=(!SubmitOtherIBVB._cache._length)?(new SubmitOtherIBVB()):SubmitOtherIBVB._cache[--SubmitOtherIBVB._cache._length];
			o._ib=ib;
			o._vb=vb;
			o._numEle=numElement;
			o._shader=shader;
			o._shaderValue=shaderValue;
			var blendType=context._nBlendType;
			o._blendFn=context._targets?BlendMode.targetFns[blendType]:BlendMode.fns[blendType];
			o.startIndex=startIndex;
			o.offset=offset;
			return o;
		}

		SubmitOtherIBVB._cache=(SubmitOtherIBVB._cache=[],SubmitOtherIBVB._cache._length=0,SubmitOtherIBVB._cache);
		SubmitOtherIBVB.tempMatrix4=[
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1,];
		return SubmitOtherIBVB;
	})()


	//class laya.webgl.submit.SubmitScissor
	var SubmitScissor=(function(){
		function SubmitScissor(){
			this.submitIndex=0;
			this.submitLength=0;
			this.context=null;
			this.clipRect=new Rectangle();
			this.screenRect=new Rectangle();
		}

		__class(SubmitScissor,'laya.webgl.submit.SubmitScissor');
		var __proto=SubmitScissor.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto._scissor=function(x,y,w,h){
			var m=RenderState2D.worldMatrix4;
			var a=m[0],d=m[5],tx=m[12],ty=m[13];
			x=x *a+tx;
			y=y *d+ty;
			w *=a;
			h *=d;
			if (w < 1 || h < 1){
				return false;
			};
			var r=x+w;
			var b=y+h;
			x < 0 && (x=0,w=r-x);
			y < 0 && (y=0,h=b-y);
			var screen=RenderState2D.worldClipRect;
			x=Math.max(x,screen.x);
			y=Math.max(y,screen.y);
			w=Math.min(r,screen.right)-x;
			h=Math.min(b,screen.bottom)-y;
			if (w < 1 || h < 1){
				return false;
			};
			var worldScissorTest=RenderState2D.worldScissorTest;
			this.screenRect.copyFrom(screen);
			screen.x=x;
			screen.y=y;
			screen.width=w;
			screen.height=h;
			RenderState2D.worldScissorTest=true;
			y=RenderState2D.height-y-h;
			WebGL.mainContext.scissor(x,y,w,h);
			WebGL.mainContext.enable(0x0C11);
			this.context.submitElement(this.submitIndex,this.submitIndex+this.submitLength);
			if (worldScissorTest){
				y=RenderState2D.height-this.screenRect.y-this.screenRect.height;
				WebGL.mainContext.scissor(this.screenRect.x,y,this.screenRect.width,this.screenRect.height);
				WebGL.mainContext.enable(0x0C11);
			}
			else{
				WebGL.mainContext.disable(0x0C11);
				RenderState2D.worldScissorTest=false;
			}
			screen.copyFrom(this.screenRect);
			return true;
		}

		__proto._scissorWithTagart=function(x,y,w,h){
			if (w < 1 || h < 1){
				return false;
			};
			var r=x+w;
			var b=y+h;
			x < 0 && (x=0,w=r-x);
			y < 0 && (y=0,h=b-y);
			var screen=RenderState2D.worldClipRect;
			x=Math.max(x,screen.x);
			y=Math.max(y,screen.y);
			w=Math.min(r,screen.right)-x;
			h=Math.min(b,screen.bottom)-y;
			if (w < 1 || h < 1){
				return false;
			};
			var worldScissorTest=RenderState2D.worldScissorTest;
			this.screenRect.copyFrom(screen);
			RenderState2D.worldScissorTest=true;
			screen.x=x;
			screen.y=y;
			screen.width=w;
			screen.height=h;
			y=RenderState2D.height-y-h;
			WebGL.mainContext.scissor(x,y,w,h);
			WebGL.mainContext.enable(0x0C11);
			this.context.submitElement(this.submitIndex,this.submitIndex+this.submitLength);
			if (worldScissorTest){
				y=RenderState2D.height-this.screenRect.y-this.screenRect.height;
				WebGL.mainContext.scissor(this.screenRect.x,y,this.screenRect.width,this.screenRect.height);
				WebGL.mainContext.enable(0x0C11);
			}
			else{
				WebGL.mainContext.disable(0x0C11);
				RenderState2D.worldScissorTest=false;
			}
			screen.copyFrom(this.screenRect);
			return true;
		}

		__proto.renderSubmit=function(){
			this.submitLength=Math.min(this.context._submits._length-1,this.submitLength);
			if (this.submitLength < 1 || this.clipRect.width < 1 || this.clipRect.height < 1)
				return this.submitLength+1;
			if (this.context._targets)
				this._scissorWithTagart(this.clipRect.x,this.clipRect.y,this.clipRect.width,this.clipRect.height);
			else this._scissor(this.clipRect.x,this.clipRect.y,this.clipRect.width,this.clipRect.height);
			return this.submitLength+1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitScissor._cache;
			cache[cache._length++]=this;
			this.context=null;
		}

		SubmitScissor.create=function(context){
			var o=SubmitScissor._cache._length?SubmitScissor._cache[--SubmitScissor._cache._length]:new SubmitScissor();
			o.context=context;
			return o;
		}

		SubmitScissor._cache=(SubmitScissor._cache=[],SubmitScissor._cache._length=0,SubmitScissor._cache);
		return SubmitScissor;
	})()


	//class laya.webgl.submit.SubmitStencil
	var SubmitStencil=(function(){
		function SubmitStencil(){
			this.step=0;
			this.level=0;
		}

		__class(SubmitStencil,'laya.webgl.submit.SubmitStencil');
		var __proto=SubmitStencil.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			switch(this.step){
				case 1:
					this.do1();
					break ;
				case 2:
					this.do2();
					break ;
				case 3:
					this.do3();
					break ;
				}
			return 1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitStencil._cache;
			cache[cache._length++]=this;
		}

		__proto.do1=function(){
			var gl=WebGL.mainContext;
			gl.enable(0x0B90);
			gl.clear(0x00000400);
			gl.colorMask(false,false,false,false);
			gl.stencilFunc(0x0202,this.level,0xFF);
			gl.stencilOp(0x1E00,0x1E00,0x1E02);
		}

		//gl.stencilOp(WebGLContext.KEEP,WebGLContext.KEEP,WebGLContext.INVERT);//测试通过给模版缓冲 写入值 一开始是0 现在是 0xFF (模版缓冲中不知道是多少位的数据)
		__proto.do2=function(){
			var gl=WebGL.mainContext;
			gl.stencilFunc(0x0202,this.level+1,0xFF);
			gl.colorMask(true,true,true,true);
			gl.stencilOp(0x1E00,0x1E00,0x1E00);
		}

		__proto.do3=function(){
			var gl=WebGL.mainContext;
			gl.clear(0x00000400);
			gl.disable(0x0B90);
		}

		SubmitStencil.create=function(step){
			var o=SubmitStencil._cache._length?SubmitStencil._cache[--SubmitStencil._cache._length]:new SubmitStencil();
			o.step=step;
			return o;
		}

		SubmitStencil._cache=(SubmitStencil._cache=[],SubmitStencil._cache._length=0,SubmitStencil._cache);
		return SubmitStencil;
	})()


	//class laya.webgl.submit.SubmitTarget
	var SubmitTarget=(function(){
		function SubmitTarget(){
			this._renderType=0;
			this._vb=null;
			this._ib=null;
			this._startIdx=0;
			this._numEle=0;
			this.shaderValue=null;
			this.blendType=0;
			this.proName=null;
			this.scope=null;
		}

		__class(SubmitTarget,'laya.webgl.submit.SubmitTarget');
		var __proto=SubmitTarget.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			this._ib.upload_bind();
			this._vb.upload_bind();
			var target=this.scope.getValue(this.proName);
			this.shaderValue.texture=target.source;
			this.shaderValue.upload();
			this.blend();
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle/3;
			WebGL.mainContext.drawElements(0x0004,this._numEle,0x1403,this._startIdx);
			return 1;
		}

		__proto.blend=function(){
			if (SubmitTarget.activeBlendType!==this.blendType){
				var gl=WebGL.mainContext;
				gl.enable(0x0BE2);
				BlendMode.fns[this.blendType](gl);
				SubmitTarget.activeBlendType=this.blendType;
			}
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitTarget._cache;
			cache[cache._length++]=this;
		}

		SubmitTarget.create=function(context,ib,vb,pos,sv,proName){
			var o=SubmitTarget._cache._length?SubmitTarget._cache[--SubmitTarget._cache._length]:new SubmitTarget();
			o._ib=ib;
			o._vb=vb;
			o.proName=proName;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			o.blendType=context._nBlendType;
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			return o;
		}

		SubmitTarget.activeBlendType=-1;
		SubmitTarget._cache=(SubmitTarget._cache=[],SubmitTarget._cache._length=0,SubmitTarget._cache);
		return SubmitTarget;
	})()


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.text.CharValue
	var CharValue=(function(){
		function CharValue(){
			//this.txtID=NaN;
			//this.font=null;
			//this.fillColor=null;
			//this.borderColor=null;
			//this.lineWidth=0;
			//this.size=NaN;
			//this.scaleX=NaN;
			//this.scaleY=NaN;
		}

		__class(CharValue,'laya.webgl.text.CharValue');
		var __proto=CharValue.prototype;
		__proto.value=function(font,fillColor,borderColor,lineWidth,size,scaleX,scaleY){
			this.font=font;
			this.fillColor=fillColor;
			this.borderColor=borderColor;
			this.lineWidth=lineWidth;
			this.size=size;
			this.scaleX=scaleX;
			this.scaleY=scaleY;
			var key=[font,scaleX,scaleY,lineWidth,fillColor,borderColor].join('`');
			this.txtID=CharValue._keymap[key]
			if (!this.txtID){
				this.txtID=(++CharValue._keymapCount)*0.0000001;
				CharValue._keymap[key]=this.txtID;
			}
		}

		CharValue._keymap={};
		CharValue._keymapCount=1;
		return CharValue;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.text.DrawText
	var DrawText=(function(){
		function DrawText(){};
		__class(DrawText,'laya.webgl.text.DrawText');
		DrawText.getChar=function(char,id,drawValue){
			return DrawText._wordsMsg[id]=DrawTextChar.createOneChar(char,drawValue);
		}

		DrawText.drawText=function(ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y){
			if (txt && txt.length===0)return;
			if (words && words.length===0)return;
			DrawText._fontTemp || (DrawText._fontTemp=new FontInContext());
			var i,n;
			var rot=curMat.b==0 && curMat.c==0 ? 0 :1;
			var sx=curMat.a,sy=curMat.d;
			(rot!==0)&& (sx=sy=1);
			sx=sy=1;
			var sx2=1,sy2=1;
			var italic=font.hasType("italic");
			if (sx !=1 || sy !=1 || italic >=0)font=font.copyTo(DrawText._fontTemp);
			italic >=0 && font.removeType("italic");
			if (sx !=1 || sy !=1){
				if (sx > sy){
					font.size=font.size *sx;
					sy2=sy / sx;
					}else {
					font.size=font.size *sy;
					sx2=sx / sy;
				}
				font.size=Math.floor(font.size);
			};
			var width=0;
			var chars=DrawText._charsTemp;
			var oneChar;
			var htmlWord;
			var id;
			var size=Math.floor(font.size / 16+0.5)*16;
			var drawValue=DrawText._drawValue;
			drawValue.value(font,fillColor,borderColor,lineWidth,size,sx2,sy2);
			if (words){
				chars.length=words.length;
				for (i=0,n=words.length;i < n;i++){
					htmlWord=words[i];
					id=htmlWord.charNum+drawValue.txtID;
					chars[i]=oneChar=DrawText._wordsMsg[id] || DrawText.getChar(htmlWord.char,id,drawValue);
					oneChar.active();
				}
				}else {
				chars.length=txt.length;
				for (i=0,n=txt.length;i < n;i++){
					id=txt.charCodeAt(i)+drawValue.txtID;
					chars[i]=oneChar=DrawText._wordsMsg[id] || DrawText.getChar(txt.charAt(i),id,drawValue);
					oneChar.active();
					width+=oneChar.width;
				}
			};
			var curMat2=curMat;
			if (sx !=1 || sy !=1 || italic >=0){
				curMat2=WebGLContext2D._tmpMatrix;
				curMat.copy(curMat2);
			}
			if (sx !=1 || sy !=1){
				var tx=curMat2.tx;
				var ty=curMat2.ty;
				curMat2.scale(1 / sx,1 / sy);
				curMat2.tx=tx;
				curMat2.ty=ty;
				x *=sx;
				y *=sy;
			}
			curMat2.tx |=0;
			curMat2.ty |=0;
			switch (textAlign){
				case "center":
					x-=width / 2;
					break ;
				case "right":
					x-=width;
					break ;
				};
			var dx;
			var uv;
			var bdSz;
			var texture;
			if (words){
				for (i=0,n=chars.length;i < n;i++){
					oneChar=chars[i];
					if (!oneChar.isSpace){
						htmlWord=words[i];
						dx=italic >=0 ? (oneChar.height *0.4):0;
						bdSz=oneChar.borderSize;
						texture=oneChar.texture;
						ctx._drawText(texture,x+htmlWord.x *sx-bdSz,y+htmlWord.y *sy-bdSz,
						texture.width,texture.height,curMat2,0,0,dx,0);
					}
				}
				}else {
				for (i=0,n=chars.length;i < n;i++){
					oneChar=chars[i];
					if (!oneChar.isSpace){
						dx=italic >=0 ? (oneChar.height *0.4):0;
						bdSz=oneChar.borderSize;
						texture=oneChar.texture;
						ctx._drawText(texture,x-bdSz,y-bdSz,
						texture.width,texture.height,curMat2,0,0,dx,0);
					}
					x+=oneChar.width;
				}
			}
		}

		DrawText._wordsMsg={};
		DrawText._charsTemp=new Array;
		DrawText._fontTemp=null;
		__static(DrawText,
		['_drawValue',function(){return this._drawValue=new CharValue();}
		]);
		return DrawText;
	})()


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.text.DrawTextChar
	var DrawTextChar=(function(){
		function DrawTextChar(content,drawValue){
			//this.xs=NaN;
			//this.ys=NaN;
			//this.width=0;
			//this.height=0;
			//this.char=null;
			//this.fillColor=null;
			//this.borderColor=null;
			//this.borderSize=0;
			//this.font=null;
			//this.fontSize=0;
			//this.texture=null;
			//this.lineWidth=0;
			//this.UV=null;
			//this.isSpace=false;
			this.char=content;
			this.isSpace=content===' ';
			this.xs=drawValue.scaleX;
			this.ys=drawValue.scaleY;
			this.font=drawValue.font.toString();
			this.fontSize=drawValue.size;
			this.fillColor=drawValue.fillColor;
			this.borderColor=drawValue.borderColor;
			this.lineWidth=drawValue.lineWidth;
			var bIsConchApp=System.isConchApp;
			if (bIsConchApp){
				canvas=ConchTextCanvas;;
				canvas._source=ConchTextCanvas;;
				canvas._source.canvas=ConchTextCanvas;;
			}
			else{
				this.texture=new Texture(new WebGLCharImage(Browser.canvas.source,this));
				(!AtlasManager.enabled)&& (System.addToAtlas)&& (System.addToAtlas(this.texture,true));
			}
		}

		__class(DrawTextChar,'laya.webgl.text.DrawTextChar');
		var __proto=DrawTextChar.prototype;
		//如果没有开启大图合集则也强制加入图集中
		__proto.active=function(){
			this.texture.active();
		}

		DrawTextChar.createOneChar=function(content,drawValue){
			var char=new DrawTextChar(content,drawValue);
			return char;
		}

		return DrawTextChar;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.text.FontInContext
	var FontInContext=(function(){
		function FontInContext(font){
			//this._text=null;
			//this._words=null;
			this._index=0;
			this._size=14;
			this.setFont(font || "14px Arial");
		}

		__class(FontInContext,'laya.webgl.text.FontInContext');
		var __proto=FontInContext.prototype;
		__proto.setFont=function(value){
			this._words=value.split(' ');
			for (var i=0,n=this._words.length;i < n;i++){
				if (this._words[i].indexOf('px')> 0){
					this._index=i;
					break ;
				}
			}
			this._size=Laya.__parseInt(this._words[this._index]);
			this._text=null;
		}

		__proto.hasType=function(name){
			for (var i=0,n=this._words.length;i < n;i++)
			if (this._words[i]===name)return i;
			return-1;
		}

		__proto.removeType=function(name){
			for (var i=0,n=this._words.length;i < n;i++)
			if (this._words[i]===name){
				this._words.splice(i,1);
				if (this._index > i)this._index--;
				break ;
			}
			this._text=null;
		}

		__proto.copyTo=function(dec){
			dec._text=this._text;
			dec._size=this._size;
			dec._index=this._index;
			dec._words=this._words.slice();
			return dec;
		}

		__proto.toString=function(){
			return this._text?this._text:(this._text=this._words.join(' '));
		}

		__getset(0,__proto,'size',function(){
			return this._size;
			},function(value){
			this._size=value;
			this._words[this._index]=value+"px";
			this._text=null;
		});

		FontInContext.EMPTY=new FontInContext();
		return FontInContext;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.CONST3D2D
	var CONST3D2D=(function(){
		function CONST3D2D(){};
		__class(CONST3D2D,'laya.webgl.utils.CONST3D2D');
		CONST3D2D.BYTES_PE=window.Float32Array && Float32Array.BYTES_PER_ELEMENT;
		CONST3D2D.BYTES_PIDX=window.Uint16Array && Uint16Array.BYTES_PER_ELEMENT;
		CONST3D2D.defaultMatrix4=[
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1,];
		CONST3D2D.defaultMinusYMatrix4=[
		1,0,0,0,
		0,-1,0,0,
		0,0,1,0,
		0,0,0,1,];
		CONST3D2D.uniformMatrix3=[
		1,0 ,0,0,
		0,1,0,0,
		0,0,1,0];
		CONST3D2D._TMPARRAY=[];
		CONST3D2D._OFFSETX=0;
		CONST3D2D._OFFSETY=0;
		return CONST3D2D;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.GlUtils
	var GlUtils=(function(){
		function GlUtils(){};
		__class(GlUtils,'laya.webgl.utils.GlUtils');
		GlUtils.make2DProjection=function(width,height,depth){
			return [
			2.0 / width,0,0,0,
			0,-2.0 / height,0,0,
			0,0,2.0 / depth,0,
			-1,1,0,1,];
		}

		GlUtils.fillIBQuadrangle=function(buffer,count){
			if (count> 65535/4){
				throw Error("IBQuadrangle count:"+count+" must<:"+Math.floor(65535/4));
				return false;
			}
			count=Math.floor(count);
			buffer._resizeBuffer((count+1)*6 *2,false);
			buffer.length=buffer.bufferLength;
			var bufferData=new Uint16Array(buffer.getBuffer());
			var idx=0;
			for (var i=0;i < count;i++){
				bufferData[idx++]=i *4;
				bufferData[idx++]=i *4+2;
				bufferData[idx++]=i *4+1;
				bufferData[idx++]=i *4;
				bufferData[idx++]=i *4+3;
				bufferData[idx++]=i *4+2;
			}
			buffer.setNeedUpload();
			buffer.upload();
			return true;
		}

		GlUtils.expandIBQuadrangle=function(buffer,count){
			buffer.bufferLength >=(count *6 *2)|| GlUtils.fillIBQuadrangle(buffer,count);
		}

		GlUtils.mathCeilPowerOfTwo=function(value){
			value--;
			value |=value >> 1;
			value |=value >> 2;
			value |=value >> 4;
			value |=value >> 8;
			value |=value >> 16;
			value++;
			return value;
		}

		GlUtils.fillQuadrangleImgVb=function(vb,x,y,point4,uv,m,_x,_y){
			'use strict';
			x |=0;y |=0;_x |=0;_y |=0;
			var vpos=(vb._length>>2)+16;
			vb.length=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vpos-=16;
			vbdata[vpos+2]=uv[0];
			vbdata[vpos+3]=uv[1];
			vbdata[vpos+6]=uv[2];
			vbdata[vpos+7]=uv[3];
			vbdata[vpos+10]=uv[4];
			vbdata[vpos+11]=uv[5];
			vbdata[vpos+14]=uv[6];
			vbdata[vpos+15]=uv[7];
			var a=m.a,b=m.b,c=m.c,d=m.d;
			if (a!==1 || b!==0 || c!==0 || d!==1){
				m.bTransform=true;
				var tx=m.tx+_x,ty=m.ty+_y;
				vbdata[vpos]=(point4[0]+x)*a+(point4[1]+y)*c+tx;
				vbdata[vpos+1]=(point4[0]+x)*b+(point4[1]+y)*d+ty;
				vbdata[vpos+4]=(point4[2]+x)*a+(point4[3]+y)*c+tx;
				vbdata[vpos+5]=(point4[2]+x)*b+(point4[3]+y)*d+ty;
				vbdata[vpos+8]=(point4[4]+x)*a+(point4[5]+y)*c+tx;
				vbdata[vpos+9]=(point4[4]+x)*b+(point4[5]+y)*d+ty;
				vbdata[vpos+12]=(point4[6]+x)*a+(point4[7]+y)*c+tx;
				vbdata[vpos+13]=(point4[6]+x)*b+(point4[7]+y)*d+ty;
			}
			else{
				m.bTransform=false;
				x+=m.tx+_x;
				y+=m.ty+_y;
				vbdata[vpos]=x+point4[0];
				vbdata[vpos+1]=y+point4[1];
				vbdata[vpos+4]=x+point4[2];
				vbdata[vpos+5]=y+point4[3];
				vbdata[vpos+8]=x+point4[4];
				vbdata[vpos+9]=y+point4[5];
				vbdata[vpos+12]=x+point4[6];
				vbdata[vpos+13]=y+point4[7];
			}
			vb._upload=true;
			return true;
		}

		GlUtils.fillTranglesVB=function(vb,x,y,points,m,_x,_y){
			'use strict';
			x |=0;y |=0;_x |=0;_y |=0;
			var vpos=(vb._length >> 2)+points.length;
			vb.length=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vpos-=points.length;
			var len=points.length;
			var a=m.a,b=m.b,c=m.c,d=m.d;
			for (var i=0;i < len;i+=4){
				vbdata[vpos+i+2]=points[i+2];
				vbdata[vpos+i+3]=points[i+3];
				if (a!==1 || b!==0 || c!==0 || d!==1){
					m.bTransform=true;
					var tx=m.tx+_x,ty=m.ty+_y;
					vbdata[vpos+i]=(points[i]+x)*a+(points[i+1]+y)*c+tx;
					vbdata[vpos+i+1]=(points[i]+x)*b+(points[i+1]+y)*d+ty;
				}
				else{
					m.bTransform=false;
					x+=m.tx+_x;
					y+=m.ty+_y;
					vbdata[vpos+i]=x+points[i];
					vbdata[vpos+i+1]=y+points[i+1];
				}
			}
			vb._upload=true;
			return true;
		}

		GlUtils.fillRectImgVb=function(vb,clip,x,y,width,height,uv,m,_x,_y,dx,dy){
			'use strict';
			var mType=1;
			var toBx,toBy,toEx,toEy;
			var cBx,cBy,cEx,cEy;
			var w0,h0,tx,ty;
			var a=m.a,b=m.b,c=m.c,d=m.d;
			var useClip=false;
			if (a!==1 || b!==0 || c!==0 || d!==1){
				m.bTransform=true;
				if (b===0 && c===0){
					x |=0;y |=0;_x |=0;_y |=0;
					mType=useClip?30:23;
					w0=width+x,h0=height+y;
					tx=m.tx+_x,ty=m.ty+_y;
					toBx=a *x+tx;
					toEx=a *w0+tx;
					toBy=d *y+ty;
					toEy=d *h0+ty;
				}
			}
			else{
				x |=0;y |=0;_x |=0;_y |=0;
				mType=useClip?30:23;
				m.bTransform=false;
				toBx=x+m.tx+_x;
				toEx=toBx+width;
				toBy=y+m.ty+_y;
				toEy=toBy+height;
			}
			if (useClip){
				cBx=clip.x,cBy=clip.y,cEx=clip.width+cBx,cEy=clip.height+cBy;
			}
			if (mType!==1 && (toBx >=cEx || toBy >=cEy || toEx <=cBx || toEy <=cBy))
				return false;
			var vpos=(vb._length >> 2)+16;
			vb.seLength((vpos << 2));
			var vbdata=vb.getFloat32Array();
			vpos-=16;
			vbdata[vpos+2]=uv[0];
			vbdata[vpos+3]=uv[1];
			vbdata[vpos+6]=uv[2];
			vbdata[vpos+7]=uv[3];
			vbdata[vpos+10]=uv[4];
			vbdata[vpos+11]=uv[5];
			vbdata[vpos+14]=uv[6];
			vbdata[vpos+15]=uv[7];
			switch(mType){
				case 1:
					tx=m.tx+_x,ty=m.ty+_y;
					w0=width+x,h0=height+y;
					var w1=x,h1=y;
					var aw1=a *w1,ch1=c *h1,dh1=d *h1,bw1=b *w1;
					var aw0=a *w0,ch0=c *h0,dh0=d *h0,bw0=b *w0;
					vbdata[vpos]=aw1+ch1+tx;
					vbdata[vpos+1]=dh1+bw1+ty;
					vbdata[vpos+4]=aw0+ch1+tx;
					vbdata[vpos+5]=dh1+bw0+ty;
					vbdata[vpos+8]=aw0+ch0+tx;
					vbdata[vpos+9]=dh0+bw0+ty;
					vbdata[vpos+12]=aw1+ch0+tx;
					vbdata[vpos+13]=dh0+bw1+ty;
					break ;
				case 23:
					vbdata[vpos]=toBx+dx;
					vbdata[vpos+1]=toBy;
					vbdata[vpos+4]=toEx+dx;
					vbdata[vpos+5]=toBy;
					vbdata[vpos+8]=toEx;
					vbdata[vpos+9]=toEy;
					vbdata[vpos+12]=toBx;
					vbdata[vpos+13]=toEy;
					break ;
				case 30:
					if (toBx < cBx || toBy < cBy || toEx > cEx || toEy > cEy){
						var dcx=cBx-toBx,dcty=cBy-toBy,decr=toEx-cEx,decb=toEy-cEy;
						if(dcx > 0){toBx=cBx;vbdata[vpos+14]=vbdata[vpos+2]=vbdata[vpos+2]+dcx / (width *a)*(vbdata[vpos+6]-vbdata[vpos+2])};
						if(dcty > 0){toBy=cBy;vbdata[vpos+7]=vbdata[vpos+3]=vbdata[vpos+3]+dcty / (height *d)*(vbdata[vpos+11]-vbdata[vpos+7])};
						if(decr > 0){toEx=cEx;vbdata[vpos+6]=vbdata[vpos+10]=vbdata[vpos+6]-decr / (width *a)*(vbdata[vpos+6]-vbdata[vpos+2])};
						if(decb > 0){toEy=cEy;vbdata[vpos+11]=vbdata[vpos+15]=vbdata[vpos+15]-decb / (height *d)*(vbdata[vpos+11]-vbdata[vpos+7])};
					}
					vbdata[vpos]=toBx+dx;
					vbdata[vpos+1]=toBy;
					vbdata[vpos+4]=toEx+dx;
					vbdata[vpos+5]=toBy;
					vbdata[vpos+8]=toEx;
					vbdata[vpos+9]=toEy;
					vbdata[vpos+12]=toBx;
					vbdata[vpos+13]=toEy;
				}
			vb._upload=true;
			return true;
		}

		GlUtils.fillLineVb=function(vb,clip,fx,fy,tx,ty,width,mat){
			'use strict';
			var linew=width *.5;
			var data=GlUtils._fillLineArray;
			var perpx=-(fy-ty),perpy=fx-tx;
			var dist=Math.sqrt(perpx*perpx+perpy*perpy);
			perpx /=dist,perpy /=dist,perpx *=width,perpy *=width;
			data[0]=fx-perpx,data[1]=fy-perpy,data[4]=fx+perpx,data[5]=fy+perpy,data[8]=tx+perpx,data[9]=ty+perpy,data[12]=tx-perpx,data[13]=ty-perpy;
			mat&&mat.transformPointArray(data,data);
			var vpos=(vb._length >> 2)+16;
			vb.length=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vbdata.set(data,vpos-16);
			vb._upload=true;
			return true;
		}

		GlUtils._fillLineArray=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		return GlUtils;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.RenderState2D
	var RenderState2D=(function(){
		function RenderState2D(){};
		__class(RenderState2D,'laya.webgl.utils.RenderState2D');
		RenderState2D.mat2MatArray=function(mat,matArray){
			var m=mat;
			var m4=matArray;
			m4[0]=m.a;
			m4[1]=m.b;
			m4[4]=m.c;
			m4[5]=m.d;
			m4[12]=m.tx;
			m4[13]=m.ty;
			return matArray;
		}

		RenderState2D.restoreTempArray=function(){
			RenderState2D.TEMPMAT4_ARRAY[0]=1;
			RenderState2D.TEMPMAT4_ARRAY[1]=0;
			RenderState2D.TEMPMAT4_ARRAY[4]=0;
			RenderState2D.TEMPMAT4_ARRAY[5]=1;
			RenderState2D.TEMPMAT4_ARRAY[12]=0;
			RenderState2D.TEMPMAT4_ARRAY[13]=0;
		}

		RenderState2D.clear=function(){
			RenderState2D.worldScissorTest=false;
			RenderState2D.worldShaderDefinesValue=0;
			RenderState2D.worldFilters=null;
			RenderState2D.worldAlpha=1;
			RenderState2D.worldClipRect.x=RenderState2D.worldClipRect.y=0;
			RenderState2D.worldClipRect.width=RenderState2D.width;
			RenderState2D.worldClipRect.height=RenderState2D.height;
			RenderState2D.curRenderTarget=null;
		}

		RenderState2D._MAXSIZE=99999999;
		RenderState2D.TEMPMAT4_ARRAY=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		RenderState2D.worldMatrix4=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		RenderState2D.worldAlpha=1.0;
		RenderState2D.worldScissorTest=false;
		RenderState2D.worldFilters=null
		RenderState2D.worldShaderDefinesValue=0;
		RenderState2D.worldClipRect=new Rectangle(0,0,99999999,99999999);
		RenderState2D.curRenderTarget=null
		RenderState2D.width=NaN
		RenderState2D.height=NaN
		__static(RenderState2D,
		['worldMatrix',function(){return this.worldMatrix=new Matrix();}
		]);
		return RenderState2D;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.ShaderCompile
	var ShaderCompile=(function(){
		var ShaderScriptBlock;
		function ShaderCompile(name,vs,ps,nameMap,includeFiles){
			//this._VS=null;
			//this._PS=null;
			//this._VSTXT=null;
			//this._PSTXT=null;
			//this._nameMap=null;
			this._VSTXT=vs;
			this._PSTXT=ps;
			function split (str){
				var words=str.split(' ');
				var out=[];
				for (var i=0;i < words.length;i++)
				words[i].length > 0 && out.push(words[i]);
				return out;
			}
			function c (script){
				var i=0,n=0,ofs=0,words,condition;
				var top=new ShaderScriptBlock(0,null,null,null);
				var parent=top;
				var lines=script.split('\n');
				for (i=0,n=lines.length;i < n;i++){
					var line=lines[i];
					if (line.indexOf("#ifdef")>=0){
						words=split(line);
						parent=new ShaderScriptBlock(1,words[1],"",parent);
						continue ;
					}
					if (line.indexOf("#else")>=0){
						condition=parent.condition;
						parent=new ShaderScriptBlock(2,null,"",parent.parent);
						parent.condition=condition;
						continue ;
					}
					if (line.indexOf("#endif")>=0){
						parent=parent.parent;
						continue ;
					}
					if (line.indexOf("#include")>=0){
						words=split(line);
						var fname=words[1];
						var chr=fname.charAt(0);
						if (chr==='"' || chr==="'"){
							fname=fname.substr(1,fname.length-2);
							ofs=fname.lastIndexOf(chr);
							if (ofs > 0)fname=fname.substr(0,ofs);
						}
						ofs=words[0].indexOf('?');
						var str=ofs > 0?words[0].substr(ofs+1):words[0];
						new ShaderScriptBlock(1,str,includeFiles[fname],parent);
						continue ;
					}
					if (parent.childs.length > 0 && parent.childs[parent.childs.length-1].type===0){
						parent.childs[parent.childs.length-1].text+="\n"+line;
					}
					else new ShaderScriptBlock(0,null,line,parent);
				}
				return top;
			}
			this._VS=c(vs);
			this._PS=c(ps);
			this._nameMap=nameMap;
		}

		__class(ShaderCompile,'laya.webgl.utils.ShaderCompile');
		var __proto=ShaderCompile.prototype;
		__proto.createShader=function(define,shaderName,createShader){
			var defMap={};
			var defineStr="";
			if (define){
				for (var i in define){
					defineStr+="#define "+i+"\n";
					defMap[i]=true;
				}
			};
			var vs=this._VS.toscript(defMap,[]);
			var ps=this._PS.toscript(defMap,[]);
			return (createShader || Shader.create)(defineStr+vs.join('\n'),defineStr+ps.join('\n'),shaderName,this._nameMap);
		}

		ShaderCompile.IFDEF_NO=0;
		ShaderCompile.IFDEF_YES=1;
		ShaderCompile.IFDEF_ELSE=2;
		ShaderCompile.__init$=function(){
			//class ShaderScriptBlock
			ShaderScriptBlock=(function(){
				function ShaderScriptBlock(type,condition,text,parent){
					//this.type=0;
					//this.condition=null;
					//this.text=null;
					//this.parent=null;
					this.childs=new Array;
					this.type=type;
					this.text=text;
					this.parent=parent;
					parent && parent.childs.push(this);
					if (!condition)return;
					var newcondition="";
					var preIsParam=false,isParam=false;
					for (var i=0,n=condition.length;i < n;i++){
						var c=condition.charAt(i);
						isParam="!&|() \t".indexOf(c)< 0;
						if (preIsParam !=isParam){
							isParam && (newcondition+="this.");
							preIsParam=isParam;
						}
						newcondition+=c;
					};
					var fn="(function() {return "+newcondition+";})";
					this.condition=Browser.window.eval(fn);
				}
				__class(ShaderScriptBlock,'');
				var __proto=ShaderScriptBlock.prototype;
				//生成条件判断函数
				__proto.toscript=function(def,out){
					if (this.type===0){
						this.text && out.push(this.text);
					}
					if (this.childs.length < 1 && !this.text)return out;
					if (this.type!==0){
						var ifdef=!!this.condition.call(def);
						this.type===2 && (ifdef=!ifdef);
						if (!ifdef)return out;
						this.text && out.push(this.text);
					}
					this.childs.length>0 && this.childs.forEach(function(o){o.toscript(def,out)});
					return out;
				}
				return ShaderScriptBlock;
			})()
		}

		return ShaderCompile;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.WebGL
	var WebGL=(function(){
		function WebGL(){};
		__class(WebGL,'laya.webgl.WebGL');
		WebGL.enable=function(){
			if (!WebGL.isWebGLSupported())return false;
			HTMLImage=WebGLImage;
			HTMLCanvas=WebGLCanvas;
			HTMLSubImage=WebGLSubImage;
			System.changeDefinition("HTMLImage",WebGLImage);
			System.changeDefinition("HTMLCanvas",WebGLCanvas);
			System.changeDefinition("HTMLSubImage",WebGLSubImage);
			Render.WebGL=WebGL;
			System.createRenderSprite=function (type,next){
				return new RenderSprite3D(type,next);
			}
			System.createWebGLContext2D=function (c){
				return new WebGLContext2D(c);
			}
			System.changeWebGLSize=function (width,height){
				laya.webgl.WebGL.onStageResize(width,height);
			}
			System.createGraphics=function (){
				return new GraphicsGL();
			};
			var action=System.createFilterAction;
			System.createFilterAction=action ? action :function (type){
				return new ColorFilterActionGL()
			}
			Render.clear=function (color){
				RenderState2D.worldScissorTest && laya.webgl.WebGL.mainContext.disable(0x0C11);
				var c=Color.create(color)._color;
				Render.context.ctx.clearBG(c[0],c[1],c[2],c[3]);
				RenderState2D.clear();
			}
			System.addToAtlas=function (texture,force){
				(force===void 0)&& (force=false);
				var bitmap=texture.bitmap;
				var isEnable=AtlasManager.enabled || force;
				var bMerge=false;
				if (System.isConchApp){
					bMerge=(Render.isWebGl && isEnable && ((bitmap instanceof laya.webgl.resource.WebGLImage )|| bitmap==ConchTextCanvas)&& bitmap.width < AtlasManager.atlasLimitWidth && bitmap.height < AtlasManager.atlasLimitHeight);
					}else {
					bMerge=(Render.isWebGl && isEnable && ((bitmap instanceof laya.webgl.resource.WebGLImage )|| (bitmap instanceof laya.webgl.resource.WebGLSubImage )|| (bitmap instanceof laya.webgl.resource.WebGLCharImage ))&& bitmap.width < AtlasManager.atlasLimitWidth && bitmap.height < AtlasManager.atlasLimitHeight);
				}
				if (bMerge){
					bitmap.createOwnWebGLTexture=false;
					(bitmap.resourceManager)&& (bitmap.resourceManager.removeResource(bitmap));
					AtlasManager.instance.addToAtlas(texture);
					if (System.isConchApp && bitmap==ConchTextCanvas){
						console.log(">>>>conchApp resotre todo todo");
						}else {
						bitmap.on("recovered",this,function(bitmap){
							(AtlasManager.enable)&& (AtlasManager.instance.addToAtlas(texture));
						});
					}
				}
			}
			System.drawToCanvas=function (sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
				var renderTarget=new RenderTarget2D(canvasWidth,canvasHeight,false,0x1908,0x1401,0);
				renderTarget.start();
				renderTarget.clear(1.0,0.0,0.0,1.0);
				sprite.render(Render.context,-offsetX,RenderState2D.height-canvasHeight-offsetY);
				Render.context.flush();
				renderTarget.end();
				var pixels=renderTarget.getData(0,0,renderTarget.width,renderTarget.height);
				renderTarget.dispose();
				return pixels;
			}
			System.createFilterAction=function (type){
				var action;
				switch (type){
					case 0x20:
						action=new ColorFilterActionGL();
						break ;
					}
				return action;
			}
			Filter._filter=function (sprite,context,x,y){
				var next=this._next;
				if (next){
					var filters=sprite.filters,len=filters.length;
					if (len==1 && filters[0].type==0x20){
						context.ctx.save();
						context.ctx.setFilters(sprite.filters);
						next._fun.call(next,sprite,context,x,y);
						context.ctx.restore();
						return;
					}
				}
			}
			return true;
		}

		WebGL.isWebGLSupported=function(){
			var canvas=Browser.createElement('canvas');
			var gl;
			var names=["webgl","experimental-webgl","webkit-3d","moz-webgl"];
			for (var i=0;i < names.length;i++){
				try {
					gl=canvas.getContext(names[i]);
				}
				catch (e){}
				if (gl)return names[i];
			}
			return null;
		}

		WebGL.onStageResize=function(width,height){
			WebGL.mainContext.viewport(0,0,width,height);
			RenderState2D.width=width;
			RenderState2D.height=height;
		}

		WebGL.init=function(canvas,width,height){
			WebGL.mainCanvas=canvas;
			HTMLCanvas._createContext=function (canvas){
				return new WebGLContext2D(canvas);
			};
			var webGLName=WebGL.isWebGLSupported();
			var gl=WebGL.mainContext=canvas.getContext(webGLName,{stencil:true,alpha:false,antialias:true,premultipliedAlpha:false});
			if (webGLName=="experimental-webgl" && (Browser.onWeiXin || Browser.onMQQBrowser)){
				Render.finish=function (){
					Render.context.ctx.finish();
				}
			}
			if (Browser.window.SetupWebglContext){
				Browser.window.SetupWebglContext(gl);
			}
			WebGL.onStageResize(width,height);
			if (WebGL.mainContext==null)
				throw new Error("webGL getContext err!");
			System.__init__();
			AtlasManager.__init__();
			ShaderDefines2D.__init__();
			Submit.__init__();
			WebGLContext2D.__init__();
			Value2D.__init__();
			Shader2D.__init__();
			Buffer.__int__(gl);
			BlendMode._init_(gl);
		}

		WebGL.mainCanvas=null
		WebGL.mainContext=null
		WebGL.antialias=true;
		WebGL._bg_null=[0,0,0,0];
		return WebGL;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.WebGLContext
	var WebGLContext=(function(){
		function WebGLContext(){};
		__class(WebGLContext,'laya.webgl.WebGLContext');
		WebGLContext.UseProgram=function(program){
			if (WebGLContext._useProgram===program)return false;
			WebGL.mainContext.useProgram(program);
			WebGLContext._useProgram=program;
			return true;
		}

		WebGLContext.setDepthTest=function(gl,value){
			value!==WebGLContext._depthTest && (WebGLContext._depthTest=value,value?gl.enable(0x0B71):gl.disable(0x0B71));
		}

		WebGLContext.setDepthMask=function(gl,value){
			value!==WebGLContext._depthMask && (WebGLContext._depthMask=value,gl.depthMask(value));
		}

		WebGLContext.setBlend=function(gl,value){
			value!==WebGLContext._blend && (WebGLContext._blend=value,value?gl.enable(0x0BE2):gl.disable(0x0BE2));
		}

		WebGLContext.setBlendFunc=function(gl,sFactor,dFactor){
			(sFactor!==WebGLContext._sFactor||dFactor!==WebGLContext._dFactor)&& (WebGLContext._sFactor=sFactor,WebGLContext._dFactor=dFactor,gl.blendFunc(sFactor,dFactor));
		}

		WebGLContext.setCullFace=function(gl,value){
			value!==WebGLContext._cullFace && (WebGLContext._cullFace=value,value?gl.enable(0x0B44):gl.disable(0x0B44));
		}

		WebGLContext.setFrontFaceCCW=function(gl,value){
			value!==WebGLContext._frontFace && (WebGLContext._frontFace=value,gl.frontFace(value));
		}

		WebGLContext._useProgram=null;
		WebGLContext._depthTest=true;
		WebGLContext._depthMask=1;
		WebGLContext._blend=false;
		WebGLContext._sFactor=1;
		WebGLContext._dFactor=0;
		WebGLContext._cullFace=false;
		WebGLContext._frontFace=0x0901;
		WebGLContext.__init$=function(){
			;
		}

		return WebGLContext;
	})()


	//class laya.ani.bone.Templet
	var Templet=(function(){
		function Templet(data,tex){
			this._vision="";
			//this._usePack=0;
			//this._uv=null;
			//this._bones=null;
			this._anims=[];
			//this._strArr=null;
			this._targetAnim=[];
			this._boneCount=0;
			//this._boneMatrix=null;
			this._textures=[];
			//this._textureWidth=NaN;
			//this._textureHeight=NaN;
			this.frameCount=0;
			this.frameRate=0;
			this.animNames={};
			this._graphicsArrs_=[];
			//this._texture=null;
			this._texture=tex;
			this._textureWidth=tex.width;
			this._textureHeight=tex.height;
			this._execute(data);
		}

		__class(Templet,'laya.ani.bone.Templet');
		var __proto=Templet.prototype;
		__proto._execute=function(data){
			var b=new Byte(data);
			this._vision=[b.getUint8(),b.getUint8(),b.getUint8(),b.getUint8()].join(",");
			this.frameRate=b.getUint8();
			this._usePack=b.getUint8();
			this._strArr=b.getString().split("\n");
			var len=b.getInt16();
			this._uv=b.getInt16Array(b.pos,len *8 *2);
			for (var i=0;i < len;++i){
				var u1=this._texture.uv[0],v1=this._texture.uv[1],u2=this._texture.uv[4],v2=this._texture.uv[5];
				var inAltasUVWidth=(u2-u1),inAltasUVHeight=(v2-v1);
				var uvStart=i *8,l=this._uv[uvStart],u=this._uv[uvStart+1],w=this._uv[uvStart+2],h=this._uv[uvStart+3];
				var oriU1=l / this._textureWidth,oriU2=(l+w)/ this._textureWidth,oriV1=u / this._textureHeight,oriV2=(u+h)/ this._textureHeight;
				var oriUV=[oriU1,oriV1,oriU2,oriV1,oriU2,oriV2,oriU1,oriV2];
				var tex=this._textures[i]=new Texture(this._texture.bitmap,[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight]);
				tex.w=this._uv[uvStart+4];
				tex.h=this._uv[uvStart+5];
				tex.__w=w;
				tex.__h=h;
				tex._offsetX=this._uv[uvStart+6];
				tex._offsetY=this._uv[uvStart+7];
			}
			this._boneCount=len=b.getInt16()
			this._boneMatrix=b.getFloat32Array(b.pos,len *6 *4);
			this._bones=b.getInt16Array(b.pos,len *4 *2);
			len=b.getInt16();
			for (var k=0;k < len;k++){
				var arr=[];
				arr._index_=k;
				this._graphicsArrs_.push(arr);
				var nameIndex=b.getInt16();
				this.animNames[this._strArr[nameIndex]]=k;
				this.frameCount=b.getInt16();
				arr.length=arr._length=this.frameCount;
				var blockNum=b.getInt16();
				this._anims.push(b.getFloat32Array(b.pos,blockNum *Templet.SRC_ANIMLEN *4));
				var outPut=new Float32Array(this.frameCount *this._boneCount *Templet.ANIMLEN);
				this._targetAnim.push(outPut);
				this.interpolation(this._anims[k],outPut,blockNum);
			}
		}

		__proto.planish=function(i,_index_){
			var outAnim=this._targetAnim[_index_];
			var gr=new Graphics();
			var planishMat=[];
			var i_animlen=i *Templet.ANIMLEN;
			for (var j=0;j < this._boneCount;j++){
				var bStart=j *4;
				var mStart=j *6;
				var pIndex=this._bones[bStart];
				var mAStart=j *this.frameCount *Templet.ANIMLEN+i_animlen;
				var mM=this._getMat(this._boneMatrix,mStart);
				var mAM,tmp,outM=new Matrix();
				if (pIndex >-1){
					var mpAStart=pIndex *this.frameCount *Templet.ANIMLEN+i_animlen;
					var mpAM=planishMat[pIndex];
					var nodeType=this._bones[bStart+2];
					switch (nodeType){
						case 0:
							mAM=this._getMat(outAnim,mAStart);
							tmp=Matrix.TEMP;
							var tx=mAM.tx,ty=mAM.ty;
							mAM.setTranslate(0,0);
							Matrix.mul(mAM,mM,tmp);
							tmp.translate(tx,ty);
							Matrix.mul(tmp,mpAM,planishMat[j]=outM);
							mAM=null;
							break ;
						case 1:;
							var texIndex=outAnim[mAStart+7];
							if (texIndex==-1)
								continue ;
							var alpha=outAnim[mAStart+6];
							if (alpha < 0.001)continue ;
							texIndex=outAnim[mAStart+7];
							var tex=this._textures[texIndex];
							mM.tx-=tex._offsetX;
							mM.ty-=tex._offsetY;
							Matrix.mul(mM,mpAM,outM);
							if (alpha < 0.9999){
								gr.save();
								gr.alpha(alpha);
								gr.drawTexture(tex,-tex.w / 2,-tex.w / 2,tex.__w,tex.__h,outM);
								gr.restore();
							}
							else{
								gr.drawTexture(tex,-tex.w / 2,-tex.w / 2,tex.__w,tex.__h,outM);
							}
							break ;
						case 2:
							break ;
						default :
							break ;
						}
				}
				else{
					mAM=this._getMat(outAnim,mAStart);
					Matrix.mul(mAM,mM,planishMat[j]=outM);
				}
			}
			return gr;
		}

		__proto.interpolation=function(input,outPut,blockNum){
			var outFrameNum=0,i=0,j=0,k=0,start=0,duration=0,type=0,outStart=0,delta=NaN,next=0;
			for (i=0;i < blockNum;i++,start+=Templet.SRC_ANIMLEN){
				duration=input[start+6];
				type=input[start+7];
				if (duration > 1){
					next=start+Templet.SRC_ANIMLEN;
					for (j=0;j < duration;j++){
						outStart=outFrameNum++*Templet.ANIMLEN;
						if (type==-1){
							for (k=0;k < 6;k++){
								outPut[outStart+k]=input[start+k];
							}
							outPut[outStart+6]=input[start+8];
							outPut[outStart+7]=input[start+9];
						}
						else{
							for (k=0;k < 6;k++){
								delta=input[next+k]-input[start+k];
								if (k==1 || k==2)
									delta=Arith.formatR(delta);
								delta /=duration;
								outPut[outStart+k]=j *delta+input[start+k];
							}
							delta=(input[next+8]-input[start+8])/ duration;
							outPut[outStart+6]=j *delta+input[start+8];
							outPut[outStart+7]=input[start+9];
						}
					}
				}
				else{
					outStart=outFrameNum++*Templet.ANIMLEN;
					for (j=0;j < 6;j++)
					outPut[outStart+j]=input[start+j];
					outPut[outStart+6]=1;
					outPut[outStart+7]=input[start+9];
				}
			}
		}

		//贴图索引
		__proto._getMat=function(tran,start){
			var mat=new Matrix();
			var a=tran[start],b=tran[start+1],c=tran[start+2],d=tran[start+3],tx=tran[start+4],ty=tran[start+5];
			if (c !=0 || b !=0){
				var cos=Math.cos(b),sin=Math.sin(b);
				mat.setTo(a *cos,a *sin,d *-sin,d *cos,tx,ty);
			}
			else
			mat.setTo(a,b,c,d,tx,ty);
			return mat;
		}

		__getset(0,__proto,'textureWidth',function(){
			return this._textureWidth;
		});

		__getset(0,__proto,'textureHeight',function(){
			return this._textureHeight;
		});

		Templet.ANIMLEN=8;
		Templet.SRC_ANIMLEN=10;
		return Templet;
	})()


	/**
	*<code>Node</code> 类用于创建节点对象，节点是最基本的元素。
	*@author yung
	*/
	//class laya.display.Node extends laya.events.EventDispatcher
	var Node=(function(_super){
		function Node(){
			this.name="";
			this.destroyed=false;
			this._displayInStage=false;
			this._parent=null;
			this._privates=null;
			Node.__super.call(this);
			this._childs=Node.ARRAY_EMPTY;
			this.timer=Laya.timer;
		}

		__class(Node,'laya.display.Node',_super);
		var __proto=Node.prototype;
		/**
		*<p>销毁此对象。</p>
		*@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this.destroyed=true;
			this._parent && this._parent.removeChild(this);
			if (this._childs){
				if (destroyChild)this.destroyChildren();
				else this.removeChildren();
			}
			this._childs=null;
			this._privates && (this._privates=null);
			this.offAll();
		}

		/**
		*销毁所有子对象，不销毁自己本身。
		*/
		__proto.destroyChildren=function(){
			if (this._childs){
				for (var i=this._childs.length-1;i >-1;i--){
					this._childs[i].destroy(true);
				}
			}
		}

		/**
		*添加子节点。
		*@param node 节点对象
		*@return 返回添加的节点
		*/
		__proto.addChild=function(node){
			if (node===this)return node;
			if (node._parent===this){
				this._childs.splice(this.getChildIndex(node),1);
				this._childs.push(node);
				}else {
				node.parent && node.parent.removeChild(node);
				this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
				this._childs.push(node);
				node.parent=this;
			}
			return node;
		}

		/**
		*批量增加子节点
		*@param ...args 无数子节点
		*/
		__proto.addChildren=function(__args){
			var args=arguments;
			var i=0,n=args.length;
			while (i < n){
				this.addChild(args[i++]);
			}
		}

		/**
		*添加子节点到指定的索引位置。
		*@param node 节点对象。
		*@param index 索引位置。
		*@return 返回添加的节点。
		*/
		__proto.addChildAt=function(node,index){
			if (node===this)return node;
			if (index >=0 && index <=this._childs.length){
				if (node._parent===this){
					this._childs.splice(this.getChildIndex(node),1);
					this._childs.splice(index,0,node);
					}else {
					node.parent && node.parent.removeChild(node);
					this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
					this._childs.splice(index,0,node);
					node.parent=this;
				}
				return node;
				}else {
				throw new Error("appendChildAt:The index is out of bounds");
			}
		}

		/**
		*根据子节点对象，获取子节点的索引位置。
		*@param node 子节点。
		*@return 子节点所在的索引位置。
		*/
		__proto.getChildIndex=function(node){
			return this._childs.indexOf(node);
		}

		/**
		*根据子节点的名字，获取子节点对象。
		*@param name 子节点的名字。
		*@return 节点对象。
		*/
		__proto.getChildByName=function(name){
			var nodes=this._childs;
			for (var i=0,n=nodes.length;i < n;i++){
				var node=nodes[i];
				if (node.name===name)return node;
			}
			return null;
		}

		__proto.getPrivates=function(){
			return this._privates;
		}

		/**
		*根据子节点的索引位置，获取子节点对象。
		*@param index 索引位置
		*@return 子节点
		*/
		__proto.getChildAt=function(index){
			return this._childs[index];
		}

		/**
		*设置子节点的索引位置。
		*@param node 子节点。
		*@param index 新的索引。
		*@return 返回子节点本身。
		*/
		__proto.setChildIndex=function(node,index){
			var childs=this._childs;
			if (index < 0 || index >=childs.length){
				throw new Error("setChildIndex:The index is out of bounds.");
			};
			var oldIndex=this.getChildIndex(node);
			childs.splice(oldIndex,1);
			childs.splice(index,0,node);
			this.childChanged();
			return node;
		}

		/**
		*@private
		*子节点发生改变。
		*/
		__proto.childChanged=function(child){}
		/**
		*删除子节点。
		*@param node 子节点
		*@return 被删除的节点
		*/
		__proto.removeChild=function(node){
			if (!this._childs)return node;
			var index=this._childs.indexOf(node);
			return this.removeChildAt(index);
		}

		/**
		*从父容器删除自己，如已经被删除则不会抛出异常。
		*/
		__proto.removeSelf=function(){
			this._parent && this._parent.removeChild(this);
			return this;
		}

		/**
		*根据子节点名字删除对应的子节点对象，如找不到不会抛出异常。
		*@param name 对象名字。
		*/
		__proto.removeChildByName=function(name){
			var node=this.getChildByName(name);
			node && this.removeChild(node);
			return node;
		}

		/**
		*根据子节点索引位置，删除对应的子节点对象。
		*@param index 节点索引位置。
		*@return 被删除的节点。
		*/
		__proto.removeChildAt=function(index){
			var node=this.getChildAt(index);
			if (node){
				this._childs.splice(index,1);
				node.parent=null;
			}
			return node;
		}

		/**
		*删除所有子对象。
		*/
		__proto.removeChildren=function(beginIndex,endIndex){
			(beginIndex===void 0)&& (beginIndex=0);
			(endIndex===void 0)&& (endIndex=0x7fffffff);
			if (this._childs.length > 0){
				var childs=this._childs;
				for (var i=beginIndex,n=childs.length;i < n && i < endIndex;i++){
					childs[i].parent=null;
				}
				if (beginIndex===0 && endIndex >=n)childs.length=0;
				else childs.splice(beginIndex,endIndex-beginIndex);
				this.childChanged();
			}
			return this;
		}

		/**
		*替换子节点。
		*@internal 将传入的新节点对象替换到已有子节点索引位置处。
		*@param newNode 新节点。
		*@param oldNode 老节点。
		*@return 返回新节点。
		*/
		__proto.replaceChild=function(newNode,oldNode){
			var index=this._childs.indexOf(oldNode);
			if (index >-1){
				this._childs.splice(index,1,newNode);
				oldNode.parent=null;
				newNode.parent=this;
				return newNode;
			}
			return null;
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (this._displayInStage!==value){
				this._displayInStage=value;
				if (value)this.event("display");
				else this.event("undisplay");
			}
		}

		/**
		*@private
		*设置对象是否可见(是否在渲染列表中)
		*@param node 节点
		*@param display 是否可见
		*/
		__proto._displayChild=function(node,display){
			node._setDisplay(display);
			var childs=node._childs;
			if (childs){
				for (var i=childs.length-1;i >-1;i--){
					var child=childs[i];
					child._setDisplay(display);
					child.numChildren && this._displayChild(child,display);
				}
			}
		}

		/**
		*询问是否为某类型的某值。
		*<p>常用来对对象类型进行快速判断。</p>
		*@param type
		*@param value
		*@return
		*/
		__proto.ask=function(type,value){
			return type==1 ? (value==1):false;
		}

		/**
		*当前容器是否包含 <code>node</code> 节点。
		*@param node 某一个节点 <code>Node</code>。
		*@return 一个布尔值表示是否包含<code>node</code>节点。
		*/
		__proto.contains=function(node){
			if (node===this)return true;
			while (node){
				if (node.parent===this.parent)return true;
				node=node.parent;
			}
			return false;
		}

		/**
		*定时重复执行某函数。
		*@param delay 间隔时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false。
		*/
		__proto.timerLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this.timer._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行某函数一次。
		*@param delay 延迟时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false。
		*/
		__proto.timerOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this.timer._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行某函数(基于帧率)。
		*@param delay 间隔几帧(单位为帧)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false。
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this.timer._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行一次某函数(基于帧率)。
		*@param delay 延迟几帧(单位为帧)。
		*@param caller 执行域(this)
		*@param method 结束时的回调方法
		*@param args 回调参数
		*@param coverBefore 是否覆盖之前的延迟执行，默认为false
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=false);
			this.timer._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*清理定时器。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*/
		__proto.clearTimer=function(caller,method){
			this.timer.clear(caller,method);
		}

		/**
		*子对象数量。
		*/
		__getset(0,__proto,'numChildren',function(){
			return this._childs.length;
		});

		/**父节点。*/
		__getset(0,__proto,'parent',function(){
			return this._parent;
			},function(value){
			if (this._parent!==value){
				if (value){
					this._parent=value;
					this.event("added");
					value.displayInStage && this._displayChild(this,true);
					value.childChanged(this);
					}else {
					this.event("removed");
					this._displayChild(this,false);
					this._parent.childChanged();
					this._parent=value;
				}
			}
		});

		/**表示是否在显示列表中显示。是否在显示渲染列表中。*/
		__getset(0,__proto,'displayInStage',function(){
			return this._displayInStage;
		});

		Node.ASK_CLASS=1;
		Node.ASK_VALUE_NODE=1;
		Node.ASK_VALUE_SPRITE=2;
		Node.ASK_VALUE_HTMLELEMENT=3;
		Node.ASK_VALUE_SPRITE3D=100;
		Node.ARRAY_EMPTY=[];
		return Node;
	})(EventDispatcher)


	/**
	*使用Audio标签播放声音
	*@author ww
	*/
	//class laya.media.h5audio.AudioSound extends laya.events.EventDispatcher
	var AudioSound=(function(_super){
		function AudioSound(){
			this.url=null;
			this.audio=null;
			this.loaded=false;
			AudioSound.__super.call(this);
		}

		__class(AudioSound,'laya.media.h5audio.AudioSound',_super);
		var __proto=AudioSound.prototype;
		/**
		*释放声音
		*
		*/
		__proto.dispose=function(){
			var ad=AudioSound._audioCache[this.url];
			if (ad){
				ad.src="";
				delete AudioSound._audioCache[this.url];
			}
		}

		/**
		*加载声音
		*@param url
		*
		*/
		__proto.load=function(url){
			this.url=url;
			var ad=AudioSound._audioCache[url];
			if (ad && ad.readyState >=2){
				this.event("complete");
				return;
			}
			if (!ad){
				ad=Browser.createElement("audio");
				ad.src=url;
				AudioSound._audioCache[url]=ad;
			}
			ad.addEventListener("canplaythrough",onLoaded);
			ad.addEventListener("error",onErr);
			var me=this;
			function onLoaded (){
				offs();
				me.loaded=true;
				me.event("complete");
			}
			function onErr (){
				offs();
				me.event("error");
			}
			function offs (){
				ad.removeEventListener("canplaythrough",onLoaded);
				ad.removeEventListener("error",onErr);
			}
			this.audio=ad;
			ad.load();
		}

		/**
		*播放声音
		*@param startTime 起始时间
		*@param loops 循环次数
		*@return
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			if (!this.url)return null;
			var ad;
			ad=AudioSound._audioCache[this.url];
			if (!ad)return null;
			ad.autoplay=true;
			var tAd;
			tAd=Pool.getItem(this.url);
			tAd=tAd?tAd:ad.cloneNode();
			var channel=new AudioSoundChannel(tAd);
			channel.url=this.url;
			channel.loops=loops;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		AudioSound._audioCache={};
		return AudioSound;
	})(EventDispatcher)


	/**
	*声音播放控制
	*@author ww
	*/
	//class laya.media.SoundChannel extends laya.events.EventDispatcher
	var SoundChannel=(function(_super){
		function SoundChannel(){
			this.url=null;
			this.loops=0;
			this.startTime=NaN;
			this.isStopped=false;
			this.completeHandler=null;
			SoundChannel.__super.call(this);
		}

		__class(SoundChannel,'laya.media.SoundChannel',_super);
		var __proto=SoundChannel.prototype;
		/**
		*播放
		*
		*/
		__proto.play=function(){}
		/**
		*停止
		*
		*/
		__proto.stop=function(){}
		/**
		*设置音量
		*@param v
		*
		*/
		/**
		*获取音量
		*@return
		*
		*/
		__getset(0,__proto,'volume',function(){
			return 1;
			},function(v){
		});

		/**
		*获取当前播放时间
		*@return
		*
		*/
		__getset(0,__proto,'position',function(){
			return 0;
		});

		return SoundChannel;
	})(EventDispatcher)


	/**
	*声音类
	*@author ww
	*/
	//class laya.media.Sound extends laya.events.EventDispatcher
	var Sound=(function(_super){
		function Sound(){Sound.__super.call(this);;
		};

		__class(Sound,'laya.media.Sound',_super);
		var __proto=Sound.prototype;
		/**
		*加载声音
		*@param url
		*
		*/
		__proto.load=function(url){}
		/**
		*播放声音
		*@param startTime 开始时间,单位秒
		*@param loops 循环次数,0表示一直循环
		*@return
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			return null;
		}

		/**
		*释放声音资源
		*
		*/
		__proto.dispose=function(){}
		return Sound;
	})(EventDispatcher)


	/**
	*web audio api方式播放声音
	*@author ww
	*/
	//class laya.media.webaudio.WebAudioSound extends laya.events.EventDispatcher
	var WebAudioSound=(function(_super){
		function WebAudioSound(){
			this.url=null;
			this.loaded=false;
			this.data=null;
			this.audioBuffer=null;
			WebAudioSound.__super.call(this);
		}

		__class(WebAudioSound,'laya.media.webaudio.WebAudioSound',_super);
		var __proto=WebAudioSound.prototype;
		/**
		*加载声音
		*@param url
		*
		*/
		__proto.load=function(url){
			var me=this;
			this.url=url;
			this.audioBuffer=WebAudioSound._dataCache[url];
			if (this.audioBuffer){
				_loaded();
				return;
			};
			var request=new Browser.window.XMLHttpRequest();
			request.open("GET",url,true);
			request.responseType="arraybuffer";
			request.onload=function (){
				me.data=request.response;
				WebAudioSound.buffs.push({"buffer":me.data,"loaded":_loaded,"err":_err,"me":me,"url":me.url});
				WebAudioSound.decode();
			};
			request.send();
			function _loaded (){
				WebAudioSound._dataCache[url]=me.audioBuffer;
				me.loaded=true;
				me.event("complete");
			}
			function _err (){
				me.event("error");
			}
		}

		/**
		*播放声音
		*@param startTime 起始时间
		*@param loops 循环次数
		*@return
		*
		*/
		__proto.play=function(startTime,loops,channel){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			channel=channel ? channel :new WebAudioSoundChannel();
			if (!this.audioBuffer){
				if (this.url){
					this.once("complete",this,this.play,[startTime,loops,channel]);
					this.load(this.url);
				}
			}
			channel.url=this.url;
			channel.loops=loops;
			channel["audioBuffer"]=this.audioBuffer;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		__proto.dispose=function(){
			delete WebAudioSound._dataCache[this.url];
		}

		WebAudioSound.decode=function(){
			if (WebAudioSound.buffs.length <=0 || WebAudioSound.isDecoding){
				return;
			}
			WebAudioSound.isDecoding=true;
			WebAudioSound.tInfo=WebAudioSound.buffs.shift();
			WebAudioSound.ctx.decodeAudioData(WebAudioSound.tInfo["buffer"],WebAudioSound._done,WebAudioSound._fail);
		}

		WebAudioSound._done=function(audioBuffer){
			WebAudioSound.tInfo["me"].audioBuffer=audioBuffer;
			if (WebAudioSound.tInfo["loaded"]){
				WebAudioSound.tInfo["loaded"]();
			}
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound._fail=function(){
			if (WebAudioSound.tInfo["err"]){
				WebAudioSound.tInfo["err"]();
			}
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound.buffs=[];
		WebAudioSound.isDecoding=false;
		WebAudioSound.tInfo=null
		WebAudioSound._dataCache={};
		__static(WebAudioSound,
		['window',function(){return this.window=Browser.window;},'webAudioOK',function(){return this.webAudioOK=WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"];},'ctx',function(){return this.ctx=WebAudioSound.webAudioOK ? new (WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"])():undefined;}
		]);
		return WebAudioSound;
	})(EventDispatcher)


	/**
	*HTTP请求
	*@author yung
	*/
	//class laya.net.HttpRequest extends laya.events.EventDispatcher
	var HttpRequest=(function(_super){
		function HttpRequest(){
			this._responseType=null;
			this._data=null;
			HttpRequest.__super.call(this);
			this._http=new Browser.window.XMLHttpRequest();
		}

		__class(HttpRequest,'laya.net.HttpRequest',_super);
		var __proto=HttpRequest.prototype;
		/**
		*发送请求
		*@param url 请求的地址
		*@param data 发送的数据，可选
		*@param method 发送数据方式，值为"get"或"post"，默认为get方式
		*@param responseType 返回消息类型，可设置为"text"，"json"，"xml","arraybuffer"
		*@param headers 头信息，key value数组，比如["Content-Type","application/json"]
		*/
		__proto.send=function(url,data,method,responseType,headers){
			(method===void 0)&& (method="get");
			(responseType===void 0)&& (responseType="text");
			this._responseType=responseType;
			this._data=null;
			var _this=this;
			var http=this._http;
			http.open(method,url,true);
			if (headers){
				for (var i=0;i < headers.length;i++){
					http.setRequestHeader(headers[i++],headers[i]);
				}
				}else {
				if (!data || (typeof data=='string'))http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				else http.setRequestHeader("Content-Type","application/json");
			}
			http.responseType=responseType!=="arraybuffer" ? "text" :"arraybuffer";
			http.onerror=function (e){
				_this.onError(e);
			}
			http.onabort=function (e){
				_this.onAbort(e);
			}
			http.onprogress=function (e){
				_this.onProgress(e);
			}
			http.onload=function (e){
				_this.onLoad(e);
			}
			http.send(data);
		}

		__proto.onProgress=function(e){
			if (e && e.lengthComputable)this.event("progress",e.loaded / e.total);
		}

		__proto.onAbort=function(e){
			this.error("Request was aborted by user");
		}

		__proto.onError=function(e){
			this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText);
		}

		__proto.onLoad=function(e){
			var http=this._http;
			var status=http.status!==undefined ? http.status :200;
			if (status===200 || status===204 || status===0){
				this.complete();
				}else {
				this.error("["+http.status+"]"+http.statusText+":"+http.responseURL);
			}
		}

		__proto.error=function(message){
			this.clear();
			this.event("error",message);
		}

		__proto.complete=function(){
			this.clear();
			if (this._responseType==="json"){
				this._data=JSON.parse(this._http.responseText);
				}else if (this._responseType==="xml"){
				var dom=new Browser.window.DOMParser();
				this._data=dom.parseFromString(this._http.responseText,"text/xml");
				}else {
				this._data=this._http.response || this._http.responseText;
			}
			this.event("complete",(this._data instanceof Array)? [this._data] :this._data);
		}

		__proto.clear=function(){
			var http=this._http;
			http.onerror=http.onabort=http.onprogress=http.onload=null;
		}

		/**返回的数据*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		/**请求的地址*/
		__getset(0,__proto,'url',function(){
			return this._http.responseURL;
		});

		return HttpRequest;
	})(EventDispatcher)


	/**
	*加载器，实现了文本，JSON，XML,二进制,图像的加载及管理
	*@author yung
	*/
	//class laya.net.Loader extends laya.events.EventDispatcher
	var Loader=(function(_super){
		function Loader(){
			this._data=null;
			this._url=null;
			this._type=null;
			this._cache=false;
			this._http=null;
			Loader.__super.call(this);
		}

		__class(Loader,'laya.net.Loader',_super);
		var __proto=Loader.prototype;
		/**
		*加载资源
		*@param url 地址
		*@param type 类型，如果为null，则根据文件后缀，自动分析类型
		*@param cache 是否缓存数据
		*/
		__proto.load=function(url,type,cache){
			(cache===void 0)&& (cache=true);
			url=URL.formatURL(url);
			this._url=url;
			this._type=type || (type=this.getTypeFromUrl(url));
			this._cache=cache;
			this._data=null;
			if (Loader.loadedMap[url]){
				this._data=Loader.loadedMap[url];
				this.event("progress",1);
				this.event("complete",this._data);
				return;
			}
			if (type==="image")
				return this._loadImage(url);
			if (type==="sound")
				return this._loadSound(url);
			if (!this._http){
				this._http=new HttpRequest();
				this._http.on("progress",this,this.onProgress);
				this._http.on("error",this,this.onError);
				this._http.on("complete",this,this.onLoaded);
			}
			this._http.send(url,null,"get",type!=="atlas" ? type :"json");
		}

		__proto.getTypeFromUrl=function(url){
			Loader._extReg.lastIndex=url.lastIndexOf(".");
			var result=Loader._extReg.exec(url);
			if (result && result.length > 1){
				return Loader.typeMap[result[1].toLowerCase()];
			}
			console.log("Not recognize the resources suffix",url);
			return "text";
		}

		__proto._loadImage=function(url){
			var image=new HTMLImage();
			var _this=this;
			image.onload=function (){
				clear();
				_this.onLoaded(image);
			};
			image.onerror=function (){
				clear();
				_this.event("error","Load image filed");
			}
			function clear (){
				image.onload=null;
				image.onerror=null;
			}
			image.src=url;
		}

		__proto._loadSound=function(url){
			var _$this=this;
			var sound=new Sound();
			var _this=this;
			sound.on("complete",this,soundOnload);
			sound.on("error",this,soundOnErr);
			sound.load(url);
			function soundOnload (){
				clear();
				_this.onLoaded(sound);
			}
			function soundOnErr (){
				clear();
				_this.event("error","Load sound filed");
			}
			function clear (){
				sound.off("complete",_$this,soundOnload);
				sound.off("error",_$this,soundOnErr);
			}
		}

		__proto.onProgress=function(value){
			this.event("progress",value);
		}

		__proto.onError=function(message){
			this.event("error",message);
		}

		__proto.onLoaded=function(data){
			var type=this._type;
			if (type==="image"){
				this.complete(new Texture(data));
				}else if (type==="sound"){
				this.complete(data);
				}else if (type==="texture"){
				this.complete(new Texture(data));
				}else if (type==="atlas"){
				var toloadPics;
				if (!data.src){
					if (!this._data){
						this._data=data;
						if (data.meta && data.meta.image){
							toloadPics=data.meta.image.split(",");
							var folderPath;
							var split;
							split=this._url.indexOf("/")>=0 ? "/" :"\\";
							var idx=0;
							idx=this._url.lastIndexOf(split);
							if (idx >=0){
								folderPath=this._url.substr(0,idx+1);
								}else {
								folderPath="";
							};
							var i=0,len=0;
							len=toloadPics.length;
							for (i=0;i < len;i++){
								toloadPics[i]=folderPath+toloadPics[i];
							}
							}else{
							toloadPics=[this._url.replace(".json",".png")];
						}
						data.toLoads=toloadPics;
						data.pics=[];
					}
					return this._loadImage(URL.formatURL(toloadPics.pop()));
					}else {
					this._data.pics.push(data);
					if (this._data.toLoads.length > 0){
						return this._loadImage(URL.formatURL(this._data.toLoads.pop()));
					};
					var frames=this._data.frames;
					var directory=(this._data.meta && this._data.meta.prefix)? URL.basePath+this._data.meta.prefix :this._url.substring(0,this._url.lastIndexOf("."))+"/";
					var pics;
					pics=this._data.pics;
					var tPic;
					var map=Loader.atlasMap[this._url] || (Loader.atlasMap[this._url]={});
					var needSub=Config.atlasEnable && Render.isWebGl;
					for (var name in frames){
						var obj=frames[name];
						tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						var url=directory+name;
						map[url]=Loader.loadedMap[url]=Texture.create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y);
					}
					if (needSub)
						for (i=0;i < pics.length;i++)
					pics[i].dispose();
					this.complete(this._data);
				}
				}else {
				this.complete(data);
			}
		}

		__proto.complete=function(data){
			this._data=data;
			Loader._loaders.push(this);
			if (!Loader._isWorking)Loader.checkNext();
		}

		__proto._endLoad=function(){
			if (this._cache)Loader.loadedMap[this._url]=this._data;
			this.event("progress",1);
			this.event("complete",(this.data instanceof Array)? [this.data] :this.data);
		}

		/**是否缓存，只读*/
		__getset(0,__proto,'cache',function(){
			return this._cache;
		});

		/**返回的数据*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		/**加载地址，只读*/
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		/**加载类型，只读*/
		__getset(0,__proto,'type',function(){
			return this._type;
		});

		Loader.checkNext=function(){
			Loader._isWorking=true;
			var startTimer=Browser.now();
			var thisTimer=startTimer;
			while (Loader._startIndex < Loader._loaders.length){
				thisTimer=Browser.now();
				Loader._loaders[Loader._startIndex]._endLoad();
				Loader._startIndex++;
				if (Browser.now()-startTimer > Loader.maxTimeOut){
					console.log("loader callback cost a long time:"+(Browser.now()-startTimer)+")"+" url="+Loader._loaders[Loader._startIndex-1].url);
					Laya.timer.frameOnce(1,null,Loader.checkNext);
					return;
				}
			}
			Loader._loaders.length=0;
			Loader._startIndex=0;
			Loader._isWorking=false;
		}

		Loader.clearRes=function(url){
			url=URL.formatURL(url);
			var map=Loader.atlasMap[url];
			if (map){
				for (var name in map){
					var tex=Loader.loadedMap[name];
					if (tex){
						tex.destroy();
						delete Loader.loadedMap[name];
					}
				}
				delete Loader.atlasMap[url];
			}
			delete Loader.loadedMap[url];
		}

		Loader.getRes=function(url){
			return Loader.loadedMap[URL.formatURL(url)];
		}

		Loader.cacheRes=function(url,data){
			Loader.loadedMap[URL.formatURL(url)]=data;
		}

		Loader.basePath="";
		Loader.TEXT="text";
		Loader.JSOn="json";
		Loader.XML="xml";
		Loader.BUFFER="arraybuffer";
		Loader.IMAGE="image";
		Loader.SOUND="sound";
		Loader.TEXTURE="texture";
		Loader.ATLAS="atlas";
		Loader.typeMap={"png":"image","jpg":"image","txt":"text","json":"json","xml":"xml","als":"atlas"};
		Loader.loadedMap={};
		Loader.atlasMap={};
		Loader._loaders=[];
		Loader._isWorking=false;
		Loader._startIndex=0;
		Loader.maxTimeOut=100;
		Loader._extReg=/\.(\w+)\??/g;
		return Loader;
	})(EventDispatcher)


	/**
	*<p> <code>LoaderManager</code> 类用于用于批量加载资源、数据。</p>
	*<p>批量加载器，单例，可以通过Laya.loader访问。</p>
	*多线程(默认5个线程)，5个优先级(0最快，4最慢,默认为1)
	*某个资源加载失败后，会按照最低优先级重试加载(属性retryNum决定重试几次)，如果重试后失败，则调用complete函数，并返回null
	*@author yung
	*/
	//class laya.net.LoaderManager extends laya.events.EventDispatcher
	var LoaderManager=(function(_super){
		var ResInfo;
		function LoaderManager(){
			this.retryNum=1;
			this.maxLoader=5;
			this._loaders=[];
			this._loaderCount=0;
			this._resInfos=[];
			this._resMap={};
			this._infoPool=[];
			this._maxPriority=5;
			this._failRes={};
			LoaderManager.__super.call(this);
			for (var i=0;i < this._maxPriority;i++)this._resInfos[i]=[];
		}

		__class(LoaderManager,'laya.net.LoaderManager',_super);
		var __proto=LoaderManager.prototype;
		/**
		*加载资源
		*@param url 地址，或者数组
		*@param type 类型
		*@param complete 结束回调，如果加载失败，则返回null
		*@param progress 进度回调，回调参数为当前文件加载的进度信息(0-1)
		*@param priority 优先级，0-4，五个优先级，0优先级最高，默认为1
		*@param cache 是否缓存加载结果
		*/
		__proto.load=function(url,complete,progress,type,priority,cache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			if ((url instanceof Array))return this._loadAssets(url,complete,progress,cache);
			var content=Loader.getRes(url);
			if (content !=null){
				complete && complete.runWith(content);
				this._loaderCount || this.event("complete");
				}else {
				var info=this._resMap[url];
				if (!info){
					info=this._infoPool.length ? this._infoPool.pop():new ResInfo();
					info.url=url;
					info.type=type;
					info.cache=cache;
					complete && info.on("complete",complete.caller,complete.method,complete.args);
					progress && info.on("progress",progress.caller,progress.method,progress.args);
					this._resMap[url]=info;
					priority=priority < this._maxPriority ? priority :this._maxPriority-1;
					this._resInfos[priority].push(info);
					this._next();
					}else {
					complete && info.on("complete",complete.caller,complete.method,complete.args);
					progress && info.on("progress",progress.caller,progress.method,progress.args);
				}
			}
			return this;
		}

		__proto._next=function(){
			if (this._loaderCount >=this.maxLoader)return;
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				if (infos.length > 0)return this._doLoad(infos.shift())
			}
			this._loaderCount || this.event("complete");
		}

		__proto._doLoad=function(resInfo){
			this._loaderCount++;
			var loader=this._loaders.length ? this._loaders.pop():new Loader();
			loader.on("complete",null,onLoaded);
			loader.on("progress",null,function(num){
				resInfo.event("progress",num);
			});
			loader.on("error",null,function(msg){
				onLoaded(null);
			});
			var _this=this;
			function onLoaded (data){
				loader.offAll();
				_this._loaders.push(loader);
				_this._endLoad(resInfo,data);
				_this._loaderCount--;
				_this._next();
			}
			loader.load(resInfo.url,resInfo.type,resInfo.cache);
		}

		__proto._endLoad=function(resInfo,content){
			if (content===null){
				var errorCount=this._failRes[resInfo.url] || 0;
				if (errorCount < this.retryNum){
					console.log("[warn]Retry to load:",resInfo.url);
					this._failRes[resInfo.url]=errorCount+1;
					this._resInfos[this._maxPriority-1].push(resInfo);
					return;
					}else {
					console.log("[error]Failed to load:",resInfo.url);
					this.event("error",resInfo.url);
				}
			}
			delete this._resMap[resInfo.url];
			resInfo.event("complete",content);
			resInfo.offAll();
			this._infoPool.push(resInfo);
		}

		/**
		*清理缓存
		*@param url 地址
		*/
		__proto.clearRes=function(url){
			Loader.clearRes(url);
		}

		/**
		*获取已加载资源(如有缓存)
		*@param url 地址
		*@return 返回资源
		*/
		__proto.getRes=function(url){
			return Loader.getRes(url);
		}

		/**清理当前未完成的加载*/
		__proto.clearUnLoaded=function(){
			this._resInfos.length=0;
			this._loaderCount=0;
			this._resMap={};
		}

		/**加载数组里面的资源
		*@param arr 简单：["a.png","b.png"]，复杂[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSOn,size:50,priority:1}]*/
		__proto._loadAssets=function(arr,complete,progress,cache){
			(cache===void 0)&& (cache=true);
			var itemCount=arr.length;
			var loadedSize=0;
			var totalSize=0;
			var items=[];
			for (var i=0;i < itemCount;i++){
				var item=arr[i];
				if ((typeof item=='string'))item={url:item,type:"image",size:1,priority:1};
				if (!item.size)item.size=1;
				item.progress=0;
				totalSize+=item.size;
				items.push(item);
				var progressHandler=progress ? Handler.create(this,loadProgress,[item]):null;
				this.load(item.url,Handler.create(item,loadComplete,[item]),progressHandler,item.type,item.priority || 1,cache);
			}
			function loadComplete (item,content){
				loadedSize++;
				item.progress=1;
				if (loadedSize===itemCount && complete){
					complete.run();
				}
			}
			function loadProgress (item,value){
				if (progress !=null){
					item.progress=value;
					var num=0;
					for (var j=0;j < itemCount;j++){
						var item1=items[j];
						num+=item1.size *item1.progress;
					};
					var v=num / totalSize;
					progress.runWith(v);
				}
			}
			return this;
		}

		LoaderManager.cacheRes=function(url,data){
			Loader.cacheRes(url,data);
		}

		LoaderManager.__init$=function(){
			//class ResInfo extends laya.events.EventDispatcher
			ResInfo=(function(_super){
				function ResInfo(){
					this.url=null;
					this.type=null;
					this.cache=false;
					ResInfo.__super.call(this);
				}
				__class(ResInfo,'',_super);
				return ResInfo;
			})(EventDispatcher)
		}

		return LoaderManager;
	})(EventDispatcher)


	/**
	*...
	*@author
	*/
	//class laya.resource.Resource extends laya.events.EventDispatcher
	var Resource=(function(_super){
		function Resource(){
			this._id=0;
			this._name=null;
			this._resourceManager=null;
			this._lastUseFrameCount=0;
			this._memorySize=0;
			this._released=false;
			this.lock=false;
			Resource.__super.call(this);
			this._$1__id=Resource._uniqueIDCounter;
			Resource._uniqueIDCounter++;
			Resource._loadedResources.push(this);
			Resource._isLoadedResourcesSorted=false;
			this._released=true;
			this.lock=false;
			this._memorySize=0;
			this._lastUseFrameCount=-1;
			(ResourceManager.currentResourceManager)&& (ResourceManager.currentResourceManager.addResource(this));
		}

		__class(Resource,'laya.resource.Resource',_super);
		var __proto=Resource.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		/**重新创建资源，override it,同时修改memorySize属性,通常保留super.recreateResource()!*/
		__proto.recreateResource=function(){
			this.compoleteCreate();
		}

		/**销毁资源，override it,同时修改memorySize属性!*/
		__proto.detoryResource=function(){}
		/**
		*激活资源，使用资源前应先调用此函数激活
		*@param forceCreate 是否强制创建
		*/
		__proto.activeResource=function(forceCreate){
			(forceCreate===void 0)&& (forceCreate=false);
			this._lastUseFrameCount=Stat.loopCount;
			if (this._released || forceCreate){
				this.recreateResource();
			}
		}

		/**
		*释放资源
		*@return 是否成功释放
		*/
		__proto.releaseResource=function(){
			if (this.lock)
				return false;
			if (!this._released){
				this.detoryResource();
				this._released=true;
				this._lastUseFrameCount=-1;
				this.event("released",this);
			}
			return true;
		}

		/**
		*设置唯一名字,如果名字重复则自动加上“-copy”
		*@param newName 名字
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < Resource._loadedResources.length;i++){
				if (Resource._loadedResources[i]._name!==newName || Resource._loadedResources[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					Resource._isLoadedResourcesSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**彻底清理资源,注意会强制解锁清理*/
		__proto.dispose=function(){
			if (this._resourceManager!==null)
				throw new Error("附属于resourceManager的资源不能独立释放！");
			this.lock=false;
			this.releaseResource();
			var index=Resource._loadedResources.indexOf(this);
			if (index!==-1){
				Resource._loadedResources.splice(index,1);
				Resource._isLoadedResourcesSorted=false;
			}
		}

		/**完成资源激活*/
		__proto.compoleteCreate=function(){
			this._released=false;
			this.event("recovered",this);
		}

		/**
		*获取唯一标识ID
		*@return 编号
		*/
		__getset(0,__proto,'id',function(){
			return this._$1__id;
		});

		/**
		*获取距离上次使用帧率
		*@return 距离上次使用帧率
		*/
		__getset(0,__proto,'lastUseFrameCount',function(){
			return this._lastUseFrameCount;
		});

		/**
		*设置名字
		*@param value 名字
		*/
		/**
		*获取名字
		*@return 名字
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this.name!==value){
				this._name=value;
				Resource._isLoadedResourcesSorted=false;
			}
		});

		/**
		*获取资源管理员
		*@return 资源管理员
		*/
		__getset(0,__proto,'resourceManager',function(){
			return this._resourceManager;
		});

		/**
		*设置内存尺寸(as3中属性不能使用protected，开发者避免修改，或待优化)
		*@param value 尺寸
		*/
		/**
		*获取占用内存尺寸
		*@return 占用内存尺寸
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
			},function(value){
			var offsetValue=value-this._memorySize;
			this._memorySize=value;
			this.event("memorychanged",offsetValue);
		});

		/**
		*获取是否已释放
		*@return 是否已释放
		*/
		__getset(0,__proto,'released',function(){
			return this._released;
		});

		/**
		*返回本类型排序后的已载入资源
		*@return 本类型排序后的已载入资源
		*/
		__getset(1,Resource,'sortedLoadedResourcesByName',function(){
			if (!Resource._isLoadedResourcesSorted){
				Resource._isLoadedResourcesSorted=true;
				Resource._loadedResources.sort(Resource.compareResourcesByName);
			}
			return Resource._loadedResources;
		},laya.events.EventDispatcher._$SET_sortedLoadedResourcesByName);

		Resource.getLoadedResourceByIndex=function(index){
			return Resource._loadedResources[index];
		}

		Resource.getLoadedResourcesCount=function(){
			return Resource._loadedResources.length;
		}

		Resource.compareResourcesByName=function(left,right){
			if (left===right)
				return 0;
			var x=left.name;
			var y=right.name;
			if (x===null){
				if (y===null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right.name;
						return x.localeCompare(y);
					}
				}
			}
		}

		Resource.animationCache={};
		Resource.meshCache={};
		Resource._uniqueIDCounter=-2147483648;
		Resource._loadedResources=[];
		Resource._isLoadedResourcesSorted=false;
		return Resource;
	})(EventDispatcher)


	/**
	*纹理
	*@author yung
	*/
	//class laya.resource.Texture extends laya.events.EventDispatcher
	var Texture=(function(_super){
		function Texture(bitmapResource,uv){
			//this.bitmap=null;
			//this.uv=null;
			//this._loaded=false;
			this._w=0;
			this._h=0;
			this.offsetX=0;
			this.offsetY=0;
			this.canInAtlas=true;
			Texture.__super.call(this);
			this.set(bitmapResource,uv);
		}

		__class(Texture,'laya.resource.Texture',_super);
		var __proto=Texture.prototype;
		__proto.set=function(bitmapResource,uv){
			var _$this=this;
			this.bitmap=bitmapResource;
			this.uv=uv || Texture.DEF_UV;
			if (bitmapResource){
				this._w=bitmapResource.width;
				this._h=bitmapResource.height;
				this._loaded=this._w > 0;
				var _this=this;
				if (this._loaded){
					(System.addToAtlas&&this.canInAtlas)&& (System.addToAtlas(_this));
					}else {
					var bm=bitmapResource;
					if (((bm instanceof laya.resource.HTMLImage ))&& (bm.image))
						bm.image.addEventListener('load',function(e){
						(System.addToAtlas&&_$this.canInAtlas)&& (System.addToAtlas(_this));
					},false);
				}
			}
		}

		/**激活资源*/
		__proto.active=function(){
			this.bitmap.activeResource();
		}

		/**销毁*/
		__proto.destroy=function(){
			this.bitmap=null;
		}

		/**
		*从一个图片加载
		*@param url 图片地址
		*/
		__proto.load=function(url){
			var _$this=this;
			this._loaded=false;
			var fileBitmap=(this.bitmap || (this.bitmap=new HTMLImage()));
			var _this=this;
			fileBitmap.onload=function (){
				fileBitmap.onload=null;
				_this._loaded=true;
				_$this._w=fileBitmap.width;
				_$this._h=fileBitmap.height;
				_this.event("loaded",this);
				(System.addToAtlas&&_$this.canInAtlas)&& (System.addToAtlas(_this));
			};
			fileBitmap.src=URL.formatURL(url);
		}

		/**实际高度*/
		__getset(0,__proto,'height',function(){
			if (this._h)return this._h;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[5]-this.uv[1])*this.bitmap.height :this.bitmap.height;
			},function(value){
			this._h=value;
		});

		/**
		*是否加载成功，只能表示初次载入成功（通常包含下载和载入）,并不能完全表示资源是否可立即使用（资源管理机制释放影响等）
		*@return 是否成功
		*/
		__getset(0,__proto,'loaded',function(){
			return this._loaded;
		});

		__getset(0,__proto,'released',function(){
			return this.bitmap.released;
		});

		//临时代码，万江项目需要，日后删掉
		__getset(0,__proto,'repeat',null,function(value){
			var bitm=this.bitmap;
			bitm.repeat=value;
		});

		/**激活并获取资源*/
		__getset(0,__proto,'source',function(){
			this.bitmap.activeResource();
			return this.bitmap.source;
		});

		/**实际宽度*/
		__getset(0,__proto,'width',function(){
			if (this._w)return this._w;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[2]-this.uv[0])*this.bitmap.width :this.bitmap.width;
			},function(value){
			this._w=value;
		});

		Texture.moveUV=function(offsetX,offsetY,uv){
			for (var i=0;i < 8;i+=2){
				uv[i]+=offsetX;
				uv[i+1]+=offsetY;
			}
			return uv;
		}

		Texture.create=function(source,x,y,width,height,offsetX,offsetY){
			(offsetX===void 0)&& (offsetX=0);
			(offsetY===void 0)&& (offsetY=0);
			var uv=source.uv || Texture.DEF_UV;
			var bitmapResource=source.bitmap || source;
			var tex=new Texture(bitmapResource,null);
			tex.width=width;
			tex.height=height;
			tex.offsetX=offsetX;
			tex.offsetY=offsetY;
			var dwidth=1 / bitmapResource.width;
			var dheight=1 / bitmapResource.height;
			x *=dwidth;
			y *=dheight;
			width *=dwidth;
			height *=dheight;
			var u1=tex.uv[0],v1=tex.uv[1],u2=tex.uv[4],v2=tex.uv[5];
			var inAltasUVWidth=(u2-u1),inAltasUVHeight=(v2-v1);
			var oriUV=Texture.moveUV(uv[0],uv[1],[x,y,x+width,y,x+width,y+height,x,y+height]);
			tex.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
			return tex;
		}

		Texture.TEXTURE2D=1;
		Texture.TEXTURE3D=2;
		Texture.DEF_UV=[0,0,1.0,0,1.0,1.0,0,1.0];
		Texture.INV_UV=[0,1,1.0,1,1.0,0.0,0,0.0];
		return Texture;
	})(EventDispatcher)


	/**
	*<code>CSSStyle</code> 类是元素CSS样式定义类。
	*@author laya
	*/
	//class laya.display.css.CSSStyle extends laya.display.css.Style
	var CSSStyle=(function(_super){
		function CSSStyle(ower){
			this._bgground=null;
			this._border=null;
			//this._ower=null;
			this._rect=null;
			this.lineHeight=0;
			CSSStyle.__super.call(this);
			this._padding=CSSStyle._PADDING;
			this._spacing=CSSStyle._SPACING;
			this._aligns=CSSStyle._ALIGNS;
			this._font=Font.EMPTY;
			this._ower=ower;
		}

		__class(CSSStyle,'laya.display.css.CSSStyle',_super);
		var __proto=CSSStyle.prototype;
		/**@inheritDoc */
		__proto.destroy=function(){
			this._ower=null;
			this._font=null;
			this._rect=null;
		}

		/**
		*复制传入的 CSSStyle 属性值。
		*@param src
		*/
		__proto.inherit=function(src){
			this._font=src._font;
			this._spacing=src._spacing===CSSStyle._SPACING ? CSSStyle._SPACING :src._spacing.slice();
			this.lineHeight=src.lineHeight;
		}

		/**@private */
		__proto._widthAuto=function(){
			return (this._type & 0x40000)!==0;
		}

		/**@inheritDoc */
		__proto.widthed=function(sprite){
			return (this._type & 0x8)!=0;
		}

		__proto._calculation=function(type,value){
			if (value.indexOf('%')< 0)return false;
			var ower=this._ower;
			var parent=ower.parent;
			var rect=this._rect;
			function getValue (pw,w,nums){
				return (pw *nums[0]+w *nums[1]+nums[2]);
			}
			function onParentResize (type){
				var pw=parent.width,w=ower.width;
				rect.width && (ower.width=getValue(pw,w,rect.width));
				rect.height && (ower.height=getValue(pw,w,rect.height));
				rect.left && (ower.x=getValue(pw,w,rect.left));
				rect.top && (ower.y=getValue(pw,w,rect.top));
			}
			if (rect===null){
				parent._getCSSStyle()._type |=0x80000;
				parent.on("resize",this,onParentResize);
				this._rect=rect={input:{}};
			};
			var nums=value.split(' ');
			nums[0]=parseFloat(nums[0])/ 100;
			if (nums.length==1)
				nums[1]=nums[2]=0;
			else {
				nums[1]=parseFloat(nums[1])/ 100;
				nums[2]=parseFloat(nums[2]);
			}
			rect[type]=nums;
			rect.input[type]=value;
			onParentResize(type);
			return true;
		}

		/**
		*
		*@param sprite
		*@return
		*/
		__proto.heighted=function(sprite){
			return (this._type & 0x2000)!=0;
		}

		/**
		*设置宽高。
		*@param w
		*@param h
		*/
		__proto.size=function(w,h){
			var ower=this._ower;
			var resize=false;
			if (w!==-1 && w !=this._ower.width){
				this._type |=0x8;
				this._ower.width=w;
				resize=true;
			}
			if (h!==-1 && h !=this._ower.height){
				this._type |=0x2000;
				this._ower.height=h;
				resize=true;
			}
			if (resize){
				ower.layoutLater();
				(this._type & 0x80000)&& ower.event("resize",this);
			}
		}

		/**@private */
		__proto._getAlign=function(){
			return this._aligns[0];
		}

		/**@private */
		__proto._getValign=function(){
			return this._aligns[1];
		}

		/**@private */
		__proto._getCssFloat=function(){
			return (this._type & 0x8000)!=0 ? 0x8000 :0;
		}

		__proto._createFont=function(){
			return (this._type & 0x1000)? this._font :(this._type |=0x1000,this._font=new Font(this._font));
		}

		/**@inheritDoc */
		__proto.render=function(sprite,context,x,y){
			var w=sprite.width;
			var h=sprite.height;
			this._bgground && this._bgground.color !=null && context.ctx.fillRect(x,y,w,h,this._bgground.color);
			this._border && this._border.color && context.drawRect(x,y,w,h,this._border.color.strColor,this._border.size);
		}

		/**@inheritDoc */
		__proto.getCSSStyle=function(){
			return this;
		}

		/**
		*设置CSS样式字符串。
		*@param text
		*/
		__proto.cssText=function(text){
			this.attrs(CSSStyle.parseOneCSS(text,';'));
		}

		/**
		*根据传入的属性名、属性值列表，设置此对象的属性值。
		*@param attrs
		*/
		__proto.attrs=function(attrs){
			if (attrs){
				for (var i=0,n=attrs.length;i < n;i++){
					var attr=attrs[i];
					this[attr[0]]=attr[1];
				}
			}
		}

		/**@private */
		__proto._enableLayout=function(){
			return (this._type & 0x2)===0 && (this._type & 0x4)===0;
		}

		/**
		*表示宽度。
		*/
		__getset(0,__proto,'width',null,function(w){
			this._type |=0x8;
			if ((typeof w=='string')){
				var offset=w.indexOf('auto');
				if (offset >=0){
					this._type |=0x40000;
					w=w.substr(0,offset);
				}
				if (this._calculation("width",w))return;
				w=Laya.__parseInt(w);
			}
			this.size(w,-1);
		});

		__getset(0,__proto,'_scale',null,function(value){
			this._ower.scale(value[0],value[1]);
		});

		/**
		*浮动方向。
		*/
		__getset(0,__proto,'cssFloat',function(){
			return (this._type & 0x8000)!=0 ? "right" :"left";
			},function(value){
			this.lineElement=false;
			value==="right" ? (this._type |=0x8000):(this._type &=(~0x8000));
		});

		/**
		*字体、字号。
		*/
		__getset(0,__proto,'font',function(){
			return this._font.toString();
			},function(value){
			this._createFont().set(value);
		});

		__getset(0,__proto,'lineElement',function(){
			return (this._type & 0x10000)!=0;
			},function(value){
			value ? (this._type |=0x10000):(this._type &=(~0x10000));
		});

		/**
		*表示高度。
		*/
		__getset(0,__proto,'height',null,function(h){
			this._type |=0x2000;
			if ((typeof h=='string')){
				if (this._calculation("height",h))return;
				h=Laya.__parseInt(h);
			}
			this.size(-1,h);
		});

		/**
		*垂直对齐方式。
		*/
		__getset(0,__proto,'valign',function(){
			return CSSStyle._valigndef[this._aligns[1]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[1]=CSSStyle._valigndef[value];
		});

		/**
		*边框属性。
		*/
		__getset(0,__proto,'border',function(){
			return this._border ? this._border.value :"";
			},function(value){
			if (value=='none'){
				this._border=null;
				return;
			}
			this._border || (this._border={});
			this._border.value=value;
			var values=value.split(' ');
			this._border.color=Color.create(values[values.length-1]);
			if (values.length==1){
				this._border.size=1;
				this._border.type='solid';
				return;
			};
			var i=0;
			if (values[0].indexOf('px')> 0){
				this._border.size=Laya.__parseInt(values[0]);
				i++;
			}else this._border.size=1;
			this._border.type=values[i];
			this._ower._renderType |=0x80;
		});

		/**
		*行间距。
		*/
		__getset(0,__proto,'leading',function(){
			return this._spacing[1];
			},function(d){
			((typeof d=='string'))&& (d=Laya.__parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[1]=d;
		});

		/**
		*表示左边距。
		*/
		__getset(0,__proto,'left',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="center")
					value="50% -50% 0";
				else if (value==="right")
				value="100% -100% 0";
				if (this._calculation("left",value))return;
				value=Laya.__parseInt(value);
			}
			ower.x=value;
		});

		/**
		*元素的定位类型。
		*/
		__getset(0,__proto,'position',function(){
			return (this._type & 0x4)? "absolute" :"";
			},function(value){
			value=="absolute" ? (this._type |=0x4):(this._type &=~0x4);
		});

		/**
		*表示上边距。
		*/
		__getset(0,__proto,'top',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="middle")
					value="50% -50% 0";
				else if (value==="bottom")
				value="100% -100% 0";
				if (this._calculation("top",value))return;
				value=Laya.__parseInt(value);
			}
			ower.y=value;
		});

		/**
		*水平对齐方式。
		*/
		__getset(0,__proto,'align',function(){
			return CSSStyle._aligndef[this._aligns[0]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[0]=CSSStyle._aligndef[value];
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingTop',function(){
			return this.padding[0];
		});

		/**
		*边距信息。
		*/
		__getset(0,__proto,'padding',function(){
			return this._padding;
			},function(value){
			this._padding=value;
		});

		/**
		*设置如何处理元素内的空白。
		*/
		__getset(0,__proto,'whiteSpace',function(){
			return (this._type & 0x20000)? "nowrap" :"";
			},function(type){
			type==="nowrap" && (this._type |=0x20000);
			type==="none" && (this._type &=~0x20000);
		});

		/**
		*表示是否换行。
		*/
		__getset(0,__proto,'wordWrap',function(){
			return (this._type & 0x20000)===0;
			},function(value){
			value ? (this._type &=~0x20000):(this._type |=0x20000);
		});

		/**
		*表示是否加粗。
		*/
		__getset(0,__proto,'bold',function(){
			return this._font.bold;
			},function(value){
			this._createFont().bold=value;
		});

		/**
		*<p>指定文本字段是否是密码文本字段。</p>
		*如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
		*/
		__getset(0,__proto,'password',function(){
			return this._font.password;
			},function(value){
			this._createFont().password=value;
		});

		/**
		*设置文本的粗细。
		*/
		__getset(0,__proto,'weight',null,function(value){
			this._createFont().weight=value;
		});

		/**
		*间距。
		*/
		__getset(0,__proto,'letterSpacing',function(){
			return this._spacing[0];
			},function(d){
			((typeof d=='string'))&& (d=Laya.__parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[0]=d;
		});

		/**
		*字体大小。
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._font.size;
			},function(value){
			this._createFont().size=value;
		});

		/**
		*表示是否为斜体。
		*/
		__getset(0,__proto,'italic',function(){
			return this._font.italic;
			},function(value){
			this._createFont().italic=value;
		});

		/**
		*字体系列。
		*/
		__getset(0,__proto,'fontFamily',function(){
			return this._font.family;
			},function(value){
			this._createFont().family=value;
		});

		/**
		*字体粗细。
		*/
		__getset(0,__proto,'fontWeight',function(){
			return this._font.weight;
			},function(value){
			this._createFont().weight=value;
		});

		/**
		*添加到文本的修饰。
		*/
		__getset(0,__proto,'textDecoration',function(){
			return this._font.decoration;
			},function(value){
			this._createFont().decoration=value;
		});

		/**
		*字体颜色。
		*/
		__getset(0,__proto,'color',function(){
			return this._font.color;
			},function(value){
			this._createFont().color=value;
		});

		/**
		*<p>描边颜色，以字符串表示。</p>
		*@default "#000000";
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._font.stroke[1];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[1]=value;
		});

		/**
		*边框的颜色。
		*/
		__getset(0,__proto,'borderColor',function(){
			return (this._border && this._border.color)? this._border.color.strColor :null;
			},function(value){
			this._border || (this._border={size:1,type:'solid'});
			this._border.color=(value==null)? null :Color.create(value);
			this._ower._renderType |=0x80;
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*@default 0
		*/
		__getset(0,__proto,'stroke',function(){
			return this._font.stroke[0];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[0]=value;
		});

		/**
		*背景颜色。
		*/
		__getset(0,__proto,'backgroundColor',function(){
			return this._bgground ? this._bgground.color :"";
			},function(value){
			if (value==='none')this._bgground=null;
			else (this._bgground || (this._bgground={}),this._bgground.color=value);
			this._ower._renderType |=0x80;
		});

		/**@inheritDoc */
		__getset(0,__proto,'absolute',function(){
			return (this._type & 0x4)!==0;
		});

		__getset(0,__proto,'background',null,function(value){
			this._bgground || (this._bgground={});
			this._bgground.color=value;
			this._type |=0x4000;
			this._ower._renderType |=0x80;
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingLeft',function(){
			return this.padding[3];
		});

		/**
		*规定元素应该生成的框的类型。
		*/
		__getset(0,__proto,'display',null,function(value){
			switch (value){
				case '':
					this._type &=~0x2;
					this.visible=true;
					break ;
				case 'none':
					this._type |=0x2;
					this.visible=false;
					this._ower.layoutLater();
					break ;
				}
		});

		/**@inheritDoc */
		__getset(0,__proto,'transform',_super.prototype._$get_transform,function(value){
			(value==='none')? (this._transform=Style._TRANSFORMEMPTY):this.attrs(CSSStyle.parseOneCSS(value,','));
		});

		__getset(0,__proto,'_translate',null,function(value){
			this.translate(value[0],value[1]);
		});

		__getset(0,__proto,'_rotate',null,function(value){
			this._ower.rotation=value;
		});

		CSSStyle.parseOneCSS=function(text,clipWord){
			var out=[];
			var attrs=text.split(clipWord);
			var valueArray;
			for (var i=0,n=attrs.length;i < n;i++){
				var attr=attrs[i];
				var ofs=attr.indexOf(':');
				var name=attr.substr(0,ofs).replace(/^\s+|\s+$/g,'');
				var value=attr.substr(ofs+1).replace(/^\s+|\s+$/g,'');
				var one=[name,value];
				switch (name){
					case 'italic':
					case 'bold':
						one[1]=value=="true";
						break ;
					case 'line-height':
						one[0]='lineHeight';
						one[1]=Laya.__parseInt(value);
						break ;
					case 'font-size':
						one[0]='fontSize';
						one[1]=Laya.__parseInt(value);
						break ;
					case 'padding':
						valueArray=value.split(' ');
						valueArray.length > 1 || (valueArray[1]=valueArray[2]=valueArray[3]=valueArray[0]);
						one[1]=[Laya.__parseInt(valueArray[0]),Laya.__parseInt(valueArray[1]),Laya.__parseInt(valueArray[2]),Laya.__parseInt(valueArray[3])];
						break ;
					case 'rotate':
						one[0]="_rotate";
						one[1]=parseFloat(value);
						break ;
					case 'scale':
						valueArray=value.split(' ');
						one[0]="_scale";
						one[1]=[parseFloat(valueArray[0]),parseFloat(valueArray[1])];
						break ;
					case 'translate':
						valueArray=value.split(' ');
						one[0]="_translate";
						one[1]=[Laya.__parseInt(valueArray[0]),Laya.__parseInt(valueArray[1])];
						break ;
					default :
						(one[0]=CSSStyle._CSSTOVALUE[name])|| (one[0]=name);
					}
				out.push(one);
			}
			return out;
		}

		CSSStyle.parseCSS=function(text,uri){
			var one;
			while ((one=CSSStyle._parseCSSRegExp.exec(text))!=null){
				CSSStyle.styleSheets[one[1]]=CSSStyle.parseOneCSS(one[2],';');
			}
		}

		CSSStyle.EMPTY=new CSSStyle(null);
		CSSStyle.styleSheets={};
		CSSStyle.ALIGN_CENTER=1;
		CSSStyle.ALIGN_RIGHT=2;
		CSSStyle.VALIGN_MIDDLE=1;
		CSSStyle.VALIGN_BOTTOM=2;
		CSSStyle._PADDING=[0,0,0,0];
		CSSStyle._RECT=[-1,-1,-1,-1];
		CSSStyle._SPACING=[0,0];
		CSSStyle._ALIGNS=[0,0,0];
		CSSStyle.ADDLAYOUTED=0x200;
		CSSStyle._NEWFONT=0x1000;
		CSSStyle._HEIGHT_SET=0x2000;
		CSSStyle._BACKGROUND_SET=0x4000;
		CSSStyle._FLOAT_RIGHT=0x8000;
		CSSStyle._LINE_ELEMENT=0x10000;
		CSSStyle._NOWARP=0x20000;
		CSSStyle._WIDTHAUTO=0x40000;
		CSSStyle._LISTERRESZIE=0x80000;
		CSSStyle._aligndef={'left':0,'center':1,'right':2,0:'left',1:'center',2:'right'};
		CSSStyle._valigndef={'top':0,'middle':1,'bottom':2,0:'top',1:'middle',2:'bottom'};
		CSSStyle._CSSTOVALUE={'letter-spacing':'letterSpacing','line-spacing':'lineSpacing','white-space':'whiteSpace','line-height':'lineHeight','scale-x':'scaleX','scale-y':'scaleY','translate-x':'translateX','translate-y':'translateY','font-family':'fontFamily','font-weight':'fontWeight','vertical-align':'valign','text-decoration':'textDecoration','background-color':'backgroundColor','border-color':'borderColor','float':'cssFloat'};
		CSSStyle._parseCSSRegExp=new RegExp("([\.\#]\\w+)\\s*{([\\s\\S]*?)}","g");
		return CSSStyle;
	})(Style)


	/**
	*颜色变化滤镜
	*@author ww
	*@version 1.0
	*
	*@created 2015-9-18 上午10:52:10
	*/
	//class laya.filters.ColorFilter extends laya.filters.Filter
	var ColorFilter=(function(_super){
		function ColorFilter(mat){
			//this._elements=null;
			ColorFilter.__super.call(this);
			if (!mat){
				this._elements=ColorFilter.DEFAULT._elements;
				return;
			}
			this._elements=new Float32Array(20);
			for (var i=0;i < 20;i++){
				this._elements[i]=mat[i];
			}
			this._action=System.createFilterAction(0x20);
			this._action.data=this;
		}

		__class(ColorFilter,'laya.filters.ColorFilter',_super);
		var __proto=ColorFilter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		__getset(0,__proto,'type',function(){
			return 0x20;
		});

		__getset(0,__proto,'action',function(){
			return this._action;
		});

		__static(ColorFilter,
		['DEFAULT',function(){return this.DEFAULT=new ColorFilter([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]);},'GRAY',function(){return this.GRAY=new ColorFilter([0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0]);}
		]);
		return ColorFilter;
	})(Filter)


	//class laya.webgl.display.GraphicsGL extends laya.display.Graphics
	var GraphicsGL=(function(_super){
		function GraphicsGL(){
			GraphicsGL.__super.call(this);
		}

		__class(GraphicsGL,'laya.webgl.display.GraphicsGL',_super);
		var __proto=GraphicsGL.prototype;
		__proto.setShader=function(shader){
			this._saveToCmd(Render.context._setShader,arguments);
		}

		__proto.setIBVB=function(x,y,ib,vb,numElement,shader){
			this._saveToCmd(Render.context._setIBVB,arguments);
		}

		__proto.drawParticle=function(x,y,ps){
			var pt=System.createParticleTemplate2D(ps);
			pt.x=x;
			pt.y=y;
			this._saveToCmd(Render.context.drawParticle,[pt]);
		}

		return GraphicsGL;
	})(Graphics)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.WebGLContext2D extends laya.resource.Context
	var WebGLContext2D=(function(_super){
		var ContextParams;
		function WebGLContext2D(c){
			this._x=0;
			this._y=0;
			this._id=++WebGLContext2D._COUNT;
			//this._other=null;
			this._drawCount=1;
			this._maxNumEle=0;
			this._clear=false;
			this._submits=[];
			this._mergeID=0;
			this._curSubmit=null;
			this._ib=null;
			this._vb=null;
			//this._curMat=null;
			this._nBlendType=0;
			//this._save=null;
			//this._targets=null;
			this._saveMark=null;
			WebGLContext2D.__super.call(this);
			this._path=new Path();
			this._width=99999999;
			this._height=99999999;
			this._clipRect=WebGLContext2D.MAXCLIPRECT;
			this._shader2D=new Shader2D();
			this.drawTexture=this._drawTextureM;
			this._canvas=c;
			this._curMat=Matrix.create();
			this._ib=Buffer.QuadrangleIB;
			this._vb=new Buffer(0x8892);
			this._vb.getFloat32Array();
			this._other=ContextParams.DEFAULT;
			this._save=[SaveMark.Create(this)];
			this._save.length=10;
			this.clear();
		}

		__class(WebGLContext2D,'laya.webgl.canvas.WebGLContext2D',_super);
		var __proto=WebGLContext2D.prototype;
		__proto.clearBG=function(r,g,b,a){
			var gl=WebGL.mainContext;
			gl.clearColor(r,g,b,a);
			gl.clear(0x00004000 | 0x00000100);
		}

		__proto._getSubmits=function(){
			return this._submits;
		}

		__proto.destroy=function(){
			this._curMat && this._curMat.destroy();
			this._targets && this._targets.destroy();
			this._vb && this._vb.releaseResource();
			this._ib && (this._ib !=Buffer.QuadrangleIB)&& this._ib.releaseResource();
		}

		__proto.clear=function(){
			this._vb.clear();
			this._targets && (this._targets.repaint=true);
			this._other=ContextParams.DEFAULT;
			this._clear=true;
			this._mergeID=0;
			this._drawCount=1;
			this._other.lineWidth=this._shader2D.ALPHA=1.0;
			this._nBlendType=0;
			this._clipRect=WebGLContext2D.MAXCLIPRECT;
			this._curSubmit=Submit.RENDERBASE;
			this._shader2D.glTexture=null;
			this._shader2D.fillStyle=this._shader2D.strokeStyle=DrawStyle.DEFAULT;
			for (var i=0,n=this._submits._length;i < n;i++)
			this._submits[i].releaseRender();
			this._submits._length=0;
			this._curMat.identity();
			this._other.clear();
			this._saveMark=this._save[0];
			this._save._length=1;
		}

		__proto.size=function(w,h){
			this._width=w;
			this._height=h;
			this._targets && (this._targets.size(w,h));
		}

		__proto._getTransformMatrix=function(){
			return this._curMat;
		}

		__proto.translate=function(x,y){
			if (x!==0 || y!==0){
				SaveTranslate.save(this);
				if (this._curMat.bTransform){
					SaveTransform.save(this);
					this._curMat.transformPoint(x,y,Point.TEMP);
					x=Point.TEMP.x;
					y=Point.TEMP.y;
				}
				this._x+=x;
				this._y+=y;
			}
		}

		__proto.save=function(){
			this._save[this._save._length++]=SaveMark.Create(this);
		}

		__proto.restore=function(){
			var sz=this._save._length;
			if (sz < 1)
				return;
			for (var i=sz-1;i >=0;i--){
				var o=this._save[i];
				o.restore(this);
				if (o.isSaveMark()){
					this._save._length=i;
					return;
				}
			}
		}

		__proto.measureText=function(text){
			return Utils1.measureText(text,this._other.font.toString());
		}

		__proto._fillText=function(txt,words,x,y,fontStr,color,textAlign){
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			var font=fontStr ? (WebGLContext2D._fontTemp.setFont(fontStr),WebGLContext2D._fontTemp):this._other.font;
			if (AtlasManager.enabled){
				if (shader.ALPHA!==curShader.ALPHA)
					shader.glTexture=null;
				DrawText.drawText(this,txt,words,this._curMat,font,textAlign || this._other.textAlign,color,null,-1,x,y);
				}else {
				var preDef=this._shader2D.defines.getValue();
				var colorAdd=color?Color.create(color)._color:shader.colorAdd;
				if (shader.ALPHA!==curShader.ALPHA || colorAdd!==shader.colorAdd || curShader.colorAdd!==shader.colorAdd){
					shader.glTexture=null;
					shader.colorAdd=colorAdd;
				}
				shader.defines.add(0x40);
				DrawText.drawText(this,txt,words,this._curMat,font,textAlign || this._other.textAlign,null,null,-1,x,y);
				shader.defines.setValue(preDef);
			}
		}

		__proto.fillWords=function(words,x,y,fontStr,color){
			words.length > 0 && this._fillText(null,words,x,y,fontStr,color,null);
		}

		__proto.fillText=function(txt,x,y,fontStr,color,textAlign){
			txt.length > 0 && this._fillText(txt,null,x,y,fontStr,color,textAlign);
		}

		__proto.strokeText=function(txt,x,y,fontStr,color,lineWidth,textAlign){
			if (txt.length===0)
				return;
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			var font=fontStr ? (WebGLContext2D._fontTemp.setFont(fontStr),WebGLContext2D._fontTemp):this._other.font;
			if (AtlasManager.enabled){
				if (shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
				}
				DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,null,color,lineWidth || 1,x,y);
				}else {
				var preDef=this._shader2D.defines.getValue();
				var colorAdd=color?Color.create(color)._color:shader.colorAdd;
				if (shader.ALPHA!==curShader.ALPHA || colorAdd!==shader.colorAdd || curShader.colorAdd!==shader.colorAdd){
					shader.glTexture=null;
					shader.colorAdd=colorAdd;
				}
				shader.defines.add(0x40);
				DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,null,color,lineWidth || 1,x,y);
				shader.defines.setValue(preDef);
			}
		}

		__proto.fillBorderText=function(txt,x,y,fontStr,fillColor,borderColor,lineWidth,textAlign){
			if (txt.length===0)
				return;
			if (!AtlasManager.enabled){
				this.strokeText(txt,x,y,fontStr,borderColor,lineWidth,textAlign);
				this.fillText(txt,x,y,fontStr,fillColor,textAlign);
				return;
			};
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			if (shader.ALPHA!==curShader.ALPHA)
				shader.glTexture=null;
			var font=fontStr ? (WebGLContext2D._fontTemp.setFont(fontStr),WebGLContext2D._fontTemp):this._other.font;
			DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,fillColor,borderColor,lineWidth || 1,x,y);
		}

		__proto.fillRect=function(x,y,width,height,fillStyle){
			var vb=this._vb;
			if (GlUtils.fillRectImgVb(vb,this._clipRect,x,y,width,height,Texture.DEF_UV,this._curMat,this._x,this._y,0,0)){
				var pre=this._shader2D.fillStyle;
				fillStyle && (this._shader2D.fillStyle=new DrawStyle(fillStyle));
				var shader=this._shader2D;
				var curShader=this._curSubmit.shaderValue;
				if (shader.fillStyle!==curShader.fillStyle || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					var submit=this._curSubmit=Submit.create(this,0,this._mergeID,this._ib,vb,((vb._length-16 *4)/ 32)*3,Value2D.create(0x02,0));
					submit.shaderValue.color=shader.fillStyle._color._color;
					submit.shaderValue.ALPHA=shader.ALPHA;
					this._submits[this._submits._length++]=submit;
				}
				this._curSubmit._numEle+=6;
				this._shader2D.fillStyle=pre;
			}
		}

		__proto.setShader=function(shader){
			SaveBase.save(this,0x80000,this._shader2D,true);
			this._shader2D.shader=shader;
		}

		__proto.setFilters=function(value){
			SaveBase.save(this,0x100000,this._shader2D,true);
			this._shader2D.filters=value;
			this._curSubmit=Submit.RENDERBASE;
		}

		__proto._findSameSubmit=function(submitID){
			for (var i=this._submits._length-1;i >=0;i--){
				var submit=this._submits [i];
				if (submit._mergID && submit._mergID!==this._mergeID)break ;
				if (submit._submitID===submitID){
					return submit;
				}
			}
			return null;
		}

		__proto._drawTextureM=function(tex,x,y,width,height,tx,ty,m){
			if (!(tex.loaded && tex.bitmap))
				return;
			var webGLImg=tex.bitmap;
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			this._drawCount++;
			if (shader.glTexture!==webGLImg || shader.ALPHA!==curShader.ALPHA){
				shader.glTexture=webGLImg;
				var vb=this._vb;
				var submit=null;
				var submitID=NaN;
				var vbSize=(vb._length / 32)*3;
				if (this._mergeID){
					submitID=webGLImg._id+shader.ALPHA / 10;
					submit=this._findSameSubmit(submitID);
					vb=null;
				}
				if (!submit){
					submit=Submit.create(this,submitID,this._mergeID,this._ib,vb,vbSize,Value2D.create(0x01,0));
					this._submits[this._submits._length++]=submit;
					submit.shaderValue.textureHost=tex;
				}
				this._curSubmit=submit;
			}
			if (GlUtils.fillRectImgVb(this._curSubmit._vb || this._vb,this._clipRect,x+tx+tex.offsetX,y+ty+tex.offsetY,width || tex.width,height || tex.height,tex.uv,m || this._curMat,this._x,this._y,0,0)){
				this._curSubmit._numEle+=6;
				this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
			}
		}

		/**
		*请保证图片已经在内存
		*@param ... args
		*/
		__proto.drawImage=function(__args){
			var args=arguments;
			var img=args[0];
			var tex=(img.__texture || (img.__texture=new Texture(new WebGLImage(img))));
			tex.uv=Texture.DEF_UV;
			switch (args.length){
				case 3:
					if (!img.__width){
						img.__width=img.width;
						img.__height=img.height
					};
					this.drawTexture(tex,args[1],args[2],img.__width,img.__height,0,0);
					break ;
				case 5:
					this.drawTexture(tex,args[1],args[2],args[3],args[4],0,0);
					break ;
				case 9:;
					var x1=args[1] / img.__width;
					var x2=(args[1]+args[3])/ img.__width;
					var y1=args[2] / img.__height;
					var y2=(args[2]+args[4])/ img.__height;
					tex.uv=[x1,y1,x2,y1,x2,y2,x1,y2];
					this.drawTexture(tex,args[5],args[6],args[7],args[8],0,0);
					break ;
				}
		}

		__proto._drawText=function(tex,x,y,width,height,m,tx,ty,dx,dy){
			var webGLImg=tex.bitmap;
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			this._drawCount++;
			if (shader.glTexture!==webGLImg){
				shader.glTexture=webGLImg;
				var vb=this._vb;
				var submit=null;
				var submitID=NaN;
				var vbSize=(vb._length / 32)*3;
				if (this._mergeID){
					submitID=webGLImg._id+shader.ALPHA / 10+(AtlasManager.enabled ? 0 :(shader.colorAdd.__id / 10000));
					submit=this._findSameSubmit(submitID);
					vb=null;
				}
				if (!submit){
					if (AtlasManager.enabled){
						submit=Submit.create(this,submitID,this._mergeID,this._ib,vb,vbSize,Value2D.create(0x01,0));
						}else {
						submit=Submit.create(this,submitID,this._mergeID,this._ib,vb,vbSize,TextSV.create());
						submit.shaderValue.colorAdd=shader.colorAdd;
						submit.shaderValue.defines.add(0x40);
					}
					submit.shaderValue.textureHost=tex;
					this._submits[this._submits._length++]=submit;
				}
				this._curSubmit=submit;
			}
			if (GlUtils.fillRectImgVb(this._curSubmit._vb || this._vb,this._clipRect,x+tx,y+ty,width || tex.width,height || tex.height,tex.uv,m || this._curMat,this._x,this._y,dx,dy)){
				this._curSubmit._numEle+=6;
				this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
			}
		}

		__proto.drawTextureWithTransform=function(tex,x,y,width,height,transform,tx,ty){
			var curMat=this._curMat;
			(tx!==0 || ty!==0)&& (this._x=tx *curMat.a+ty *curMat.c,this._y=ty *curMat.d+tx *curMat.b);
			if (transform && curMat.bTransform){
				Matrix.mul(transform,curMat,WebGLContext2D._tmpMatrix);
				transform=WebGLContext2D._tmpMatrix;
				transform._checkTransform();
				}else {
				this._x+=curMat.tx;
				this._y+=curMat.ty;
			}
			this._drawTextureM(tex,x,y,width,height,0,0,transform);
			this._x=this._y=0;
		}

		__proto.fillQuadrangle=function(tex,x,y,point4,m){
			var submit=this._curSubmit;
			var vb=this._vb;
			var shader=this._shader2D;
			var curShader=submit.shaderValue;
			if (tex.bitmap){
				var t_tex=tex.bitmap;
				if (shader.glTexture !=t_tex || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=t_tex;
					submit=this._curSubmit=Submit.create(this,0,this._mergeID,this._ib,vb,((vb._length)/ 32)*3,Value2D.create(0x01,0));
					submit.shaderValue.glTexture=t_tex;
					this._submits[this._submits._length++]=submit;
				}
				GlUtils.fillQuadrangleImgVb(vb,x,y,point4,tex.uv,m || this._curMat,this._x,this._y);
				}else {
				if (!submit.shaderValue.fillStyle || !submit.shaderValue.fillStyle.equal(tex)|| shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					submit=this._curSubmit=Submit.create(this,0,this._mergeID,this._ib,vb,((vb._length)/ 32)*3,Value2D.create(0x02,0));
					submit.shaderValue.defines.add(0x02);
					submit.shaderValue.fillStyle=new DrawStyle(tex);
					this._submits[this._submits._length++]=submit;
				}
				GlUtils.fillQuadrangleImgVb(vb,x,y,point4,Texture.DEF_UV,m || this._curMat,this._x,this._y);
			}
			submit._numEle+=6;
		}

		__proto.drawTexture2=function(x,y,pivotX,pivotY,transform,alpha,blendMode,args){
			var curMat=this._curMat;
			this._x=x *curMat.a+y *curMat.c;
			this._y=y *curMat.d+x *curMat.b;
			if (transform && curMat.bTransform){
				Matrix.mul(transform,curMat,WebGLContext2D._tmpMatrix);
				transform=WebGLContext2D._tmpMatrix;
			}
			if (alpha===1 && !blendMode)
				this._drawTextureM(args[0],args[1]-pivotX,args[2]-pivotY,args[3],args[4],0,0,transform);
			else {
				var preAlpha=this._shader2D.ALPHA;
				var preblendType=this._nBlendType;
				this._shader2D.ALPHA=alpha;
				blendMode && (this._nBlendType=BlendMode.TOINT(blendMode));
				this._drawTextureM(args[0],args[1]-pivotX,args[2]-pivotY,args[3],args[4],0,0,transform);
				this._shader2D.ALPHA=preAlpha;
				this._nBlendType=preblendType;
			}
			this._x=this._y=0;
		}

		__proto.drawCanvas=function(canvas,x,y,width,height){
			var src=canvas.context;
			if (src._targets){
				this._submits[this._submits._length++]=SubmitCanvas.create(src,0,null);
				this._curSubmit=Submit.RENDERBASE;
				src._targets.drawTo(this,x,y,width,height);
			}
			else{
				var submit=this._submits[this._submits._length++]=SubmitCanvas.create(src,this._shader2D.ALPHA,this._shader2D.filters);
				var sx=width / canvas.width;
				var sy=height / canvas.height;
				var mat=submit._matrix;
				this._curMat.copy(mat);
				sx !=1 && sy !=1 && mat.scale(sx,sy);
				var tx=mat.tx,ty=mat.ty;
				mat.tx=mat.ty=0;
				mat.transformPoint(x,y,Point.TEMP);
				mat.translate(Point.TEMP.x+tx,Point.TEMP.y+ty);
				this._curSubmit=Submit.RENDERBASE;
			}
			if (Config.showCanvasMark){
				this.save();
				this.lineWidth=4;
				this.strokeStyle=src._targets?"yellow":"green";
				this.strokeRect(x-1,y-1,width+2,height+2);
				this.strokeRect(x,y,width,height);
				this.restore();
			}
		}

		__proto.transform=function(a,b,c,d,tx,ty){
			SaveTransform.save(this);
			Matrix.mul(Matrix.TEMP.setTo(a,b,c,d,tx,ty),this._curMat,this._curMat);
			this._curMat._checkTransform();
		}

		__proto.setTransformByMatrix=function(value){
			value.copy(this._curMat);
		}

		__proto.transformByMatrix=function(value){
			SaveTransform.save(this);
			Matrix.mul(value,this._curMat,this._curMat);
			this._curMat._checkTransform();
		}

		__proto.rotate=function(angle){
			SaveTransform.save(this);
			this._curMat.rotate(angle);
		}

		__proto.scale=function(scaleX,scaleY){
			SaveTransform.save(this);
			this._curMat.scale(scaleX,scaleY);
		}

		__proto.clipRect=function(x,y,width,height){
			width *=this._curMat.a;
			height *=this._curMat.d;
			var p=Point.TEMP;
			this._curMat.transformPoint(x,y,p);
			var submit=this._curSubmit=SubmitScissor.create(this);
			this._submits[this._submits._length++]=submit;
			submit.submitIndex=this._submits._length;
			submit.submitLength=9999999;
			SaveClipRect.save(this,submit);
			var clip=this._clipRect;
			var x1=clip.x,y1=clip.y;
			var r=p.x+width,b=p.y+height;
			x1 < p.x && (clip.x=p.x);
			y1 < p.y && (clip.y=p.y);
			clip.width=Math.min(r,x1+clip.width)-clip.x;
			clip.height=Math.min(b,y1+clip.height)-clip.y;
			this._shader2D.glTexture=null;
			submit.clipRect.copyFrom(clip);
			this._curSubmit=Submit.RENDERBASE;
			this._mergeID=0;
		}

		__proto.setIBVB=function(x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex,offset){
			(startIndex===void 0)&& (startIndex=0);
			(offset===void 0)&& (offset=0);
			(ib===null)&& (GlUtils.expandIBQuadrangle(this._ib,(vb.length / (4 *16)+8)),ib=this._ib);
			if (!shaderValues || !shader)
				throw Error("setIBVB must input:shader shaderValues");
			var submit=SubmitOtherIBVB.create(this,vb,ib,numElement,shader,shaderValues,startIndex,offset);
			mat || (mat=Matrix.EMPTY);
			mat.translate(x,y);
			Matrix.mul(mat,this._curMat,submit._mat);
			mat.translate(-x,-y);
			this._submits[this._submits._length++]=submit;
			this._curSubmit=Submit.RENDERBASE;
		}

		__proto.addRenderObject=function(o){
			this._submits[this._submits._length++]=o;
		}

		__proto.fillTrangles=function(tex,x,y,points,m){
			var submit=this._curSubmit;
			var vb=this._vb;
			var shader=this._shader2D;
			var curShader=submit.shaderValue;
			var length=points.length >> 4;
			var t_tex=tex.bitmap;
			if (shader.glTexture !=t_tex || shader.ALPHA!==curShader.ALPHA){
				submit=this._curSubmit=Submit.create(this,0,this._mergeID,this._ib,vb,((vb._length)/ 32)*3,Value2D.create(0x01,0));
				submit.shaderValue.textureHost=tex;
				this._submits[this._submits._length++]=submit;
			}
			GlUtils.fillTranglesVB(vb,x,y,points,m || this._curMat,this._x,this._y);
			submit._numEle+=length *6;
		}

		__proto.arc=function(x,y,r,sAngle,eAngle,counterclockwise){
			(counterclockwise===void 0)&& (counterclockwise=true);
		}

		// debugger;
		__proto.fill=function(){}
		// debugger;
		__proto.closePath=function(){}
		__proto.beginPath=function(){
			this._other=this._other.make();
			this._other.path || (this._other.path=new Path());
			this._other.path.clear();
		}

		__proto.rect=function(x,y,width,height){
			this._other=this._other.make();
			this._other.path || (this._other.path=new Path());
			this._other.path.rect(x,y,width,height);
		}

		__proto.strokeRect=function(x,y,width,height,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			this.line(x,y,x+width,y,lineWidth / 2,this._curMat);
			this.line(x+width,y,x+width,y+height,lineWidth / 2,this._curMat);
			this.line(x,y,x,y+height,lineWidth / 2,this._curMat);
			this.line(x,y+height,x+width,y+height,lineWidth / 2,this._curMat);
		}

		__proto.clip=function(){}
		// debugger;
		__proto.stroke=function(){
			if (this._other!==ContextParams.DEFAULT){
				if (this._other.path._rect){
					var r=this._other.path._rect;
					this.strokeRect(r.x,r.y,r.width,r.height,this._other.lineWidth);
				}
				this._other.path.clear();
			}
		}

		__proto.moveTo=function(x,y){
			this._other.path._x=x;
			this._other.path._y=y;
		}

		__proto.lineTo=function(x,y){
			this.line(this._other.path._x,this._other.path._y,x,y,this._other.lineWidth / 2,this._curMat);
		}

		__proto.line=function(fromX,fromY,toX,toY,lineWidth,mat){
			var submit=this._curSubmit;
			var vb=this._vb;
			if (GlUtils.fillLineVb(vb,this._clipRect,fromX,fromY,toX,toY,lineWidth,mat)){
				var shader=this._shader2D;
				var curShader=submit.shaderValue;
				if (shader.strokeStyle!==curShader.strokeStyle || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					submit=this._curSubmit=Submit.create(this,0,this._mergeID,this._ib,vb,((vb._length-16 *4)/ 32)*3,Value2D.create(0x02,0));
					submit.shaderValue.strokeStyle=shader.strokeStyle;
					submit.shaderValue.mainID=0x02;
					submit.shaderValue.ALPHA=shader.ALPHA;
					this._submits[this._submits._length++]=submit;
				}
				submit._numEle+=6;
			}
		}

		__proto.submitElement=function(start,end){
			var renderList=this._submits;
			end < 0 && (end=renderList._length);
			while (start < end){
				start+=renderList[start].renderSubmit();
			}
		}

		__proto.finish=function(){
			WebGL.mainContext.finish();
		}

		__proto.flush=function(){
			this._ib.upload_bind();
			var maxNum=Math.max(this._vb.length / (4 *16),this._maxNumEle / 6)+8;
			if (maxNum > (this._ib.bufferLength / (6 *2))){
				GlUtils.expandIBQuadrangle(this._ib,maxNum);
			}
			this._vb.upload_bind();
			this.submitElement(0,this._submits._length);
			this._path.reset();
			this._curSubmit=Submit.RENDERBASE;
			return this._submits._length;
		}

		__proto.fan=function(x,y,r,sAngle,eAngle,fillColor,lineColor){
			this._path.fan(x,y,r,sAngle,eAngle,fillColor,this._other.lineWidth ? this._other.lineWidth :1,lineColor);
			this._path.update();
			var submit=Submit.createShape(this,this._path.ib,this._path.vb,this._path.count,this._path.offset,Value2D.create(0x04,0));
			this._submits[this._submits._length++]=submit;
		}

		__proto.drawPoly=function(x,y,r,edges,boderColor,lineWidth,color){
			this._path.polygon(x,y,r,edges,color,lineWidth ? lineWidth :1,boderColor);
			this._path.update();
			var submit=Submit.createShape(this,this._path.ib,this._path.vb,this._path.count,this._path.offset,Value2D.create(0x04,0));
			submit.shaderValue.ALPHA=this._shader2D.ALPHA;
			submit.shaderValue.u_mmat2=RenderState2D.mat2MatArray(this._curMat,RenderState2D.TEMPMAT4_ARRAY);
			this._submits[this._submits._length++]=submit;
		}

		__proto.drawPath=function(x,y,points,color,lineWidth){
			this._path.drawPath(x,y,points,color,lineWidth);
			this._path.update();
			var submit=Submit.createShape(this,this._path.ib,this._path.vb,this._path.count,this._path.offset,Value2D.create(0x04,0));
			this._submits[this._submits._length++]=submit;
		}

		__proto.drawParticle=function(x,y,pt){
			pt.x=x;
			pt.y=y;
			this._submits[this._submits._length++]=pt;
		}

		__proto.drawLines=function(x,y,points,color,lineWidth){
			var tmp=Point.TEMP;
			this._curMat.transformPoint(x,y,tmp);
			if (this._curMat.bTransform){
				points=points.concat();
				this._curMat.transformPointArrayScale(points,points);
			}
			this._path.drawPath(tmp.x,tmp.y,points,color,lineWidth);
			this._path.update();
			var submit=Submit.createShape(this,this._path.ib,this._path.vb,this._path.count,this._path.offset,Value2D.create(0x04,0));
			this._submits[this._submits._length++]=submit;
		}

		__getset(0,__proto,'asBitmap',null,function(value){
			if (value){
				this._targets || (this._targets=new RenderTargetMAX());
				this._targets.repaint=true;
				if (!this._width || !this._height)throw Error("asBitmap no size!");
				this._targets.size(this._width,this._height);
			}
			else this._targets=null;
		});

		__getset(0,__proto,'fillStyle',function(){
			return this._shader2D.fillStyle;
			},function(value){
			this._shader2D.fillStyle.equal(value)|| (SaveBase.save(this,0x2,this._shader2D,false),this._shader2D.fillStyle=new DrawStyle(value));
		});

		/*,_shader2D.ALPHA=1*/
		__getset(0,__proto,'globalCompositeOperation',function(){
			return BlendMode.NAMES[this._nBlendType];
			},function(value){
			var n=BlendMode.TOINT[value];
			n==null || (this._nBlendType===n)|| (SaveBase.save(this,0x10000,this,true),this._curSubmit=Submit.RENDERBASE,this._nBlendType=n);
		});

		__getset(0,__proto,'textAlign',function(){
			return this._other.textAlign;
			},function(value){
			(this._other.textAlign===value)|| (this._other=this._other.make(),SaveBase.save(this,0x8000,this._other,false),this._other.textAlign=value);
		});

		__getset(0,__proto,'globalAlpha',function(){
			return this._shader2D.ALPHA;
			},function(value){
			value=Math.floor(value *1000)/ 1000;
			if (value !=this._shader2D.ALPHA){
				SaveBase.save(this,0x1,this._shader2D,true);
				this._shader2D.ALPHA=value;
			}
		});

		__getset(0,__proto,'textBaseline',function(){
			return this._other.textBaseline;
			},function(value){
			(this._other.textBaseline===value)|| (this._other=this._other.make(),SaveBase.save(this,0x4000,this._other,false),this._other.textBaseline=value);
		});

		__getset(0,__proto,'enableMerge',function(){
			return this._mergeID > 0;
			},function(value){
			SaveBase.save(this,0x2000,this,true);
			this._mergeID=this._drawCount;
		});

		__getset(0,__proto,'strokeStyle',function(){
			return this._shader2D.strokeStyle;
			},function(value){
			this._shader2D.strokeStyle.equal(value)|| (SaveBase.save(this,0x200,this._shader2D,false),this._shader2D.strokeStyle=new DrawStyle(value));
		});

		__getset(0,__proto,'lineWidth',function(){
			return this._other.lineWidth;
			},function(value){
			(this._other.lineWidth===value)|| (this._other=this._other.make(),SaveBase.save(this,0x100,this._other,false),this._other.lineWidth=value);
		});

		__getset(0,__proto,'font',null,function(str){
			if (str==this._other.font.toString())
				return;
			this._other=this._other.make();
			SaveBase.save(this,0x8,this._other,false);
			this._other.font===FontInContext.EMPTY ? (this._other.font=new FontInContext(str)):(this._other.font.setFont(str));
		});

		WebGLContext2D.__init__=function(){
			ContextParams.DEFAULT=new ContextParams();
		}

		WebGLContext2D._SUBMITVBSIZE=32000;
		WebGLContext2D._MAXSIZE=99999999;
		WebGLContext2D._RECTVBSIZE=16;
		WebGLContext2D.MAXCLIPRECT=new Rectangle(0,0,99999999,99999999);
		WebGLContext2D._COUNT=0;
		WebGLContext2D._tmpMatrix=new Matrix();
		__static(WebGLContext2D,
		['_fontTemp',function(){return this._fontTemp=new FontInContext();},'_drawStyleTemp',function(){return this._drawStyleTemp=new DrawStyle(null);}
		]);
		WebGLContext2D.__init$=function(){
			//class ContextParams
			ContextParams=(function(){
				function ContextParams(){
					this.lineWidth=1;
					this.path=null;
					this.textAlign=null;
					this.textBaseline=null;
					this.font=FontInContext.EMPTY;
				}
				__class(ContextParams,'');
				var __proto=ContextParams.prototype;
				__proto.clear=function(){
					this.lineWidth=1;
					this.path && this.path.clear();
					this.textAlign=this.textBaseline=null;
					this.font=FontInContext.EMPTY;
				}
				__proto.make=function(){
					return this===ContextParams.DEFAULT ? new ContextParams():this;
				}
				ContextParams.DEFAULT=null
				return ContextParams;
			})()
		}

		return WebGLContext2D;
	})(Context)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.RenderSprite3D extends laya.renders.RenderSprite
	var RenderSprite3D=(function(_super){
		function RenderSprite3D(type,next){
			RenderSprite3D.__super.call(this,type,next);
		}

		__class(RenderSprite3D,'laya.webgl.utils.RenderSprite3D',_super);
		var __proto=RenderSprite3D.prototype;
		__proto.onCreate=function(type){
			switch (type){
				case 0x20:
					this._fun=this._blend;
					return;
				case 0x08:
					this._fun=this._transform;
					return;
				}
		}

		// }
		__proto._blend=function(sprite,context,x,y){
			var style=sprite._style;
			var submit,next
			context.ctx.save();
			if (sprite.mask){
				submit=SubmitStencil.create(1);
				context.addRenderObject(submit);
				sprite.mask.render(context,x,y);
				submit=SubmitStencil.create(2);
				context.addRenderObject(submit);
				next=this._next;
				next._fun.call(next,sprite,context,x,y);
				submit=SubmitStencil.create(3);
				context.ctx._curSubmit=Submit.RENDERBASE;
				context.addRenderObject(submit);
			}
			else{
				context.ctx.globalCompositeOperation=style.blendMode;
				next=this._next;
				next._fun.call(next,sprite,context,x,y);
			}
			context.ctx.restore();
		}

		// }
		__proto._transform=function(sprite,context,x,y){
			'use strict';
			var transform=sprite.transform,_next=this._next;
			if (transform && _next !=RenderSprite.NORENDER){
				var ctx=context.ctx;
				var style=sprite._style;
				transform.tx=x;
				transform.ty=y;
				var m2=ctx._getTransformMatrix();
				var m1=m2.clone();
				Matrix.mul(transform,m2,m2);
				m2._checkTransform();
				_next._fun.call(_next,sprite,context,0,0);
				m1.copy(m2);
				m1.destroy();
				transform.tx=transform.ty=0;
			}else
			_next._fun.call(_next,sprite,context,x,y);
		}

		return RenderSprite3D;
	})(RenderSprite)


	//class laya.filters.webgl.ColorFilterActionGL extends laya.filters.webgl.FilterActionGL
	var ColorFilterActionGL=(function(_super){
		function ColorFilterActionGL(){
			this.data=null;
			ColorFilterActionGL.__super.call(this);
		}

		__class(ColorFilterActionGL,'laya.filters.webgl.ColorFilterActionGL',_super);
		var __proto=ColorFilterActionGL.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
		__proto.setValue=function(shader){
			shader.u_colorMatrix=this.data._elements;
		}

		return ColorFilterActionGL;
	})(FilterActionGL)


	//class laya.webgl.atlas.Atlaser extends laya.webgl.atlas.AtlasGrid
	var Atlaser=(function(_super){
		function Atlaser(gridNumX,gridNumY,width,height,atlasID){
			this._atlasCanvas=null;
			this._inAtlasTextureKey=null;
			this._inAtlasTextureValue=null;
			this._webGLImages=null;
			Atlaser.__super.call(this,gridNumX,gridNumY,atlasID);
			this._inAtlasTextureKey=[];
			this._inAtlasTextureValue=[];
			this._webGLImages=[];
			this._atlasCanvas=new AtlasWebGLCanvas();
			this._atlasCanvas.width=width;
			this._atlasCanvas.height=height;
			this._atlasCanvas.activeResource();
		}

		__class(Atlaser,'laya.webgl.atlas.Atlaser',_super);
		var __proto=Atlaser.prototype;
		/**
		*
		*@param inAtlasRes
		*@return 是否已经存在队列中
		*/
		__proto.addToAtlasTexture=function(bitmap,offsetX,offsetY){
			((bitmap instanceof laya.webgl.resource.WebGLImage ))&& (this._webGLImages.push(bitmap));
			bitmap.offsetX=offsetX;
			bitmap.offsetY=offsetY;
			this._atlasCanvas.texSubImage2D(bitmap,offsetX,offsetY,bitmap.image || bitmap.canvas);
			((bitmap instanceof laya.webgl.resource.WebGLImage ))&& (bitmap._image=null);
			((bitmap instanceof laya.webgl.resource.WebGLCharImage ))&&(bitmap.canvas=null);
			((bitmap instanceof laya.webgl.resource.WebGLSubImage ))&&(bitmap.canvas=null);
		}

		//_canvas为复用暂不清空
		__proto.addToAtlas=function(inAtlasRes){
			this._inAtlasTextureKey.push(inAtlasRes);
			this._inAtlasTextureValue.push(inAtlasRes.bitmap);
			inAtlasRes.bitmap=this._atlasCanvas;
		}

		__proto.clear=function(){
			for (var i=0,n=this._inAtlasTextureKey.length;i < n;i++){
				this._inAtlasTextureKey[i].bitmap=this._inAtlasTextureValue[i];
				this._inAtlasTextureKey[i].bitmap.releaseResource();
			}
			this._inAtlasTextureKey.length=0;
			this._inAtlasTextureValue.length=0;
			this._webGLImages.length=0;
		}

		__proto.destroy=function(){
			this.clear();
			this._atlasCanvas.releaseResource();
		}

		__getset(0,__proto,'texture',function(){
			return this._atlasCanvas;
		});

		__getset(0,__proto,'webGLImages',function(){
			return this._webGLImages;
		});

		return Atlaser;
	})(AtlasGrid)


	/**
	*@author wk
	*/
	//class laya.webgl.shader.d2.filters.ColorFilter extends laya.webgl.shader.Shader
	var ColorFilter1=(function(_super){
		function ColorFilter(){
			var vs="attribute vec4 position;\nattribute vec2 texcoord;\nuniform  mat4 mmat;\nuniform vec2 size;\nvarying vec2 v_texcoord;\nvoid main() {\n  gl_Position =mmat*vec4((position.x/size.x-0.5)*2.0,(0.5-position.y/size.y)*2.0,position.z,1.0);\n  v_texcoord = texcoord;\n}";
			var ps="precision mediump float;\nvarying vec2 v_texcoord;\nuniform sampler2D texture;\nuniform float alpha;\nuniform float u_colorMatrix[20];\n\nvoid main(){\n 	vec4 rgba=gl_FragColor= texture2D(texture, v_texcoord)*vec4(1,1,1,alpha);\n   gl_FragColor.r =rgba.r*u_colorMatrix[0]+rgba.g*u_colorMatrix[1]+rgba.b*u_colorMatrix[2]+rgba.a*u_colorMatrix[3]+u_colorMatrix[4];\n   gl_FragColor.g =rgba.r*u_colorMatrix[5]+rgba.g*u_colorMatrix[6]+rgba.b*u_colorMatrix[7]+rgba.a*u_colorMatrix[8]+u_colorMatrix[9];\n   gl_FragColor.b =rgba.r*u_colorMatrix[10]+rgba.g*u_colorMatrix[11]+rgba.b*u_colorMatrix[12]+rgba.a*u_colorMatrix[13]+u_colorMatrix[14];\n   gl_FragColor.a =rgba.r*u_colorMatrix[15]+rgba.g*u_colorMatrix[16]+rgba.b*u_colorMatrix[17]+rgba.a*u_colorMatrix[18]+u_colorMatrix[19];	   \n}\n";
			ColorFilter.__super.call(this,vs,ps,"colorFilter");
		}

		__class(ColorFilter,'laya.webgl.shader.d2.filters.ColorFilter',_super,'ColorFilter1');
		return ColorFilter;
	})(Shader)


	/**
	*@author wk
	*/
	//class laya.webgl.shader.d2.filters.GlowFilterShader extends laya.webgl.shader.Shader
	var GlowFilterShader=(function(_super){
		function GlowFilterShader(){
			var vs="attribute vec4 position;\nattribute vec2 texcoord;\nuniform vec2 size;\nuniform  mat4 mmat;\nuniform  mat4 pmat;\nvarying vec2  v_texcoord;\nvoid main(){\n gl_Position =mmat*vec4((position.x/size.x-0.5)*2.0,(0.5-position.y/size.y)*2.0,position.z,1.0);\n  v_texcoord = texcoord;\n}";
			var ps="precision mediump float;\nconst int c_FilterTime = 9;\nconst float c_Gene = (1.0/(1.0 + 2.0*(0.93 + 0.8 + 0.7 + 0.6 + 0.5 + 0.4 + 0.3 + 0.2 + 0.1)));\nuniform sampler2D texture;\nconst bool u_FiterMode=true;\nconst float u_GlowGene=1.5;\nconst vec4 u_GlowColor=vec4(1.0,0.0,0.0,0.5);\nconst float u_FilterOffset=2.0;\nconst float u_TexSpaceU=1.0/10.0;\nconst float u_TexSpaceV=1.0/10.0;\nvarying vec2 v_texcoord;\nvoid main()\n{\n	float aryAttenuation[c_FilterTime];\n	aryAttenuation[0] = 0.93;\n	aryAttenuation[1] = 0.8;\n	aryAttenuation[2] = 0.7;\n	aryAttenuation[3] = 0.6;\n	aryAttenuation[4] = 0.5;\n	aryAttenuation[5] = 0.4;\n	aryAttenuation[6] = 0.3;\n	aryAttenuation[7] = 0.2;\n	aryAttenuation[8] = 0.1;\n	vec4 vec4Color = texture2D(texture, v_texcoord)*c_Gene;\n	vec2 vec2FilterDir;\n	if(u_FiterMode)\n	  vec2FilterDir = vec2(u_FilterOffset*u_TexSpaceU/9.0, 0.0);\n	else\n		vec2FilterDir =  vec2(0.0, u_FilterOffset*u_TexSpaceV/9.0);\n	vec2 vec2Step = vec2FilterDir;\n	for(int i = 0;i< c_FilterTime; ++i){\n		vec4Color += texture2D(texture, v_texcoord + vec2Step)*aryAttenuation[i]*c_Gene;\n		vec4Color += texture2D(texture, v_texcoord - vec2Step)*aryAttenuation[i]*c_Gene;\n		vec2Step += vec2FilterDir;\n	}\n	if(u_FiterMode)\n		gl_FragColor = vec4Color.a*u_GlowColor*u_GlowGene;\n	else\n		gl_FragColor = vec4Color.a*u_GlowColor;\n}";
			GlowFilterShader.__super.call(this,vs,ps,"glowFilter");
		}

		__class(GlowFilterShader,'laya.webgl.shader.d2.filters.GlowFilterShader',_super);
		return GlowFilterShader;
	})(Shader)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.d2.Shader2X extends laya.webgl.shader.Shader
	var Shader2X=(function(_super){
		function Shader2X(vs,ps,saveName,nameMap){
			this._params2dQuick1=null;
			this._params2dQuick2=null;
			this._shaderValueWidth=0;
			this._shaderValueHeight=0;
			this._shaderValueAlpha=NaN;
			Shader2X.__super.call(this,vs,ps,saveName,nameMap);
		}

		__class(Shader2X,'laya.webgl.shader.d2.Shader2X',_super);
		var __proto=Shader2X.prototype;
		__proto.upload2dQuick1=function(shaderValue){
			this.upload(shaderValue,this._params2dQuick1 || this._make2dQuick1());
		}

		__proto._make2dQuick1=function(){
			try{
				if (!this._params2dQuick1){
					this._program || this.compile();
					this._params2dQuick1=[];
					var params=this._params,one;
					for (var i=0,n=params.length;i < n;i++){
						one=params[i];
						if (one.name==="size" || one.name==="al2pha" || one.name==="mmat" || one.name==="position" || one.name==="texcoord")continue ;
						this._params2dQuick1.push(one);
					}
				}
				return this._params2dQuick1;
			}
			catch (e){
			}
			return null;
		}

		__proto.upload2dQuick2=function(shaderValue){
			this.upload(shaderValue,this._params2dQuick2 || this._make2dQuick2());
		}

		__proto._make2dQuick2=function(){
			try{
				if (!this._params2dQuick2){
					this._program || this.compile();
					this._params2dQuick2=[];
					var params=this._params,one;
					for (var i=0,n=params.length;i < n;i++){
						one=params[i];
						if (one.name==="size" || one.name==="al2pha")continue ;
						this._params2dQuick2.push(one);
					}
				}
				return this._params2dQuick2;
			}
			catch (e){
			}
			return null;
		}

		Shader2X.create=function(vs,ps,saveName,nameMap){
			return new Shader2X(vs,ps,saveName,nameMap);
		}

		return Shader2X;
	})(Shader)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.d2.ShaderDefines2D extends laya.webgl.shader.ShaderDefines
	var ShaderDefines2D=(function(_super){
		function ShaderDefines2D(){
			ShaderDefines2D.__super.call(this,ShaderDefines2D._name2int,ShaderDefines2D._int2name,ShaderDefines2D._int2nameMap);
		}

		__class(ShaderDefines2D,'laya.webgl.shader.d2.ShaderDefines2D',_super);
		ShaderDefines2D.__init__=function(){
			ShaderDefines2D.reg("TEXTURE2D",0x01);
			ShaderDefines2D.reg("COLOR2D",0x02);
			ShaderDefines2D.reg("PRIMITIVE",0x04);
			ShaderDefines2D.reg("GLOW_FILTER",0x08);
			ShaderDefines2D.reg("BLUR_FILTER",0x10);
			ShaderDefines2D.reg("COLOR_FILTER",0x20);
			ShaderDefines2D.reg("COLOR_ADD",0x40);
		}

		ShaderDefines2D.reg=function(name,value){
			ShaderDefines._reg(name,value,ShaderDefines2D._name2int,ShaderDefines2D._int2name);
		}

		ShaderDefines2D.toText=function(value,_int2name,_int2nameMap){
			return ShaderDefines._toText(value,_int2name,_int2nameMap);
		}

		ShaderDefines2D.toInt=function(names){
			return ShaderDefines._toInt(names,ShaderDefines2D._name2int);
		}

		ShaderDefines2D.TEXTURE2D=0x01;
		ShaderDefines2D.COLOR2D=0x02;
		ShaderDefines2D.PRIMITIVE=0x04;
		ShaderDefines2D.FILTERGLOW=0x08;
		ShaderDefines2D.FILTERBLUR=0x10;
		ShaderDefines2D.FILTERCOLOR=0x20;
		ShaderDefines2D.COLORADD=0x40;
		ShaderDefines2D._name2int={};
		ShaderDefines2D._int2name=[];
		ShaderDefines2D._int2nameMap=[];
		return ShaderDefines2D;
	})(ShaderDefines)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.d2.value.Value2D extends laya.webgl.shader.ShaderValue
	var Value2D=(function(_super){
		function Value2D(mainID,subID){
			this.size=[0,0];
			this.alpha=1.0;
			this.mmat=null;
			this.ALPHA=1.0;
			this.shader=null;
			this.mainID=0;
			this.subID=0;
			this.filters=null;
			this.textureHost=null;
			this.texture=null;
			this.fillStyle=null;
			this.color=null;
			this.strokeStyle=null;
			this.colorAdd=null;
			this.glTexture=null;
			this.u_mmat2=null;
			this._inClassCache=null;
			this._cacheID=0;
			Value2D.__super.call(this);
			this.defines=new ShaderDefines2D();
			this.position=Value2D._POSITION;
			this.mainID=mainID;
			this.subID=subID;
			this.textureHost=null;
			this.texture=null;
			this.fillStyle=null;
			this.color=null;
			this.strokeStyle=null;
			this.colorAdd=null;
			this.glTexture=null;
			this.u_mmat2=null;
			this._cacheID=mainID|subID;
			this._inClassCache=Value2D._cache[this._cacheID];
			if (mainID>0 && !this._inClassCache){
				this._inClassCache=Value2D._cache[this._cacheID]=[];
				this._inClassCache._length=0;
			}
			this.clear();
		}

		__class(Value2D,'laya.webgl.shader.d2.value.Value2D',_super);
		var __proto=Value2D.prototype;
		__proto.setValue=function(value){}
		//throw new Error("todo in subclass");
		__proto.refresh=function(){
			var size=this.size;
			size[0]=RenderState2D.width;
			size[1]=RenderState2D.height;
			this.alpha=this.ALPHA *RenderState2D.worldAlpha;
			this.mmat=RenderState2D.worldMatrix4;
			return this;
		}

		__proto._ShaderWithCompile=function(){
			try{
				return Shader.withCompile(0,this.mainID,this.defines.toString(),this.mainID | this.defines._value | RenderState2D.worldShaderDefinesValue,Shader2X.create);
			}
			catch (e){
			}
			return null;
		}

		__proto._withWorldShaderDefinesValue=function(){
			try{
				var sd=Shader.sharders [this.mainID | this.defines._value | RenderState2D.worldShaderDefinesValue] || this._ShaderWithCompile();
				var worldFilters=RenderState2D.worldFilters;
				var n=worldFilters.length,f;
				for (var i=0;i < n;i++){
					((f=worldFilters[i]))&& f.action.setValue(this);
				}
			}
			catch (e){
			}
		}

		__proto.upload=function(){
			var sd;
			var renderstate2d=RenderState2D;
			this.alpha=this.ALPHA *renderstate2d.worldAlpha;
			renderstate2d.worldShaderDefinesValue?this._withWorldShaderDefinesValue()
			:(sd=Shader.sharders [this.mainID | this.defines._value] || this._ShaderWithCompile());
			var params;
			if (Shader.activeShader!==sd){
				this.mmat=renderstate2d.worldMatrix4;
				if (renderstate2d.width!==sd._shaderValueWidth || renderstate2d.height!==sd._shaderValueHeight){
					this.size[0]=sd._shaderValueWidth=renderstate2d.width;
					this.size[1]=sd._shaderValueHeight=renderstate2d.height;
				}
				else params=sd._params2dQuick2 || sd._make2dQuick2();
			}
			else{
				params=sd._params2dQuick1 || sd._make2dQuick1();
			}
			sd.upload(this,params);
		}

		__proto.setFilters=function(value){
			if (!value)return;
			this.filters=value;
			var n=value.length,f;
			for (var i=0;i < n;i++){
				f=value[i]
				if (f){
					this.defines.add(f.type);
					f.action.setValue(this);
				}
			}
		}

		__proto.clear=function(){
			this.defines.setValue(this.subID);
		}

		__proto.release=function(){
			this._inClassCache[this._inClassCache._length++]=this;
			this.clear();
		}

		Value2D._initone=function(type,classT){
			Value2D._typeClass[type]=classT;
			Value2D._cache[type]=[];
			Value2D._cache[type]._length=0;
		}

		Value2D.__init__=function(){
			Value2D._POSITION=[2,0x1406,false,4 *CONST3D2D.BYTES_PE,0];
			Value2D._TEXCOORD=[2,0x1406,false,4 *CONST3D2D.BYTES_PE,2 *CONST3D2D.BYTES_PE];
			Value2D._initone(0x02,Color2dSV);
			Value2D._initone(0x04,PrimitiveSV);
			Value2D._initone(0x01,TextureSV);
			Value2D._initone(0x01 | 0x40,TextSV);
			Value2D._initone(0x01 | 0x08,TextureSV);
		}

		Value2D.create=function(mainType,subType){
			var types=Value2D._cache[mainType|subType];
			if (types._length)
				return types[--types._length];
			else
			return new Value2D._typeClass[mainType|subType](subType);
		}

		Value2D._POSITION=null
		Value2D._TEXCOORD=null
		Value2D._cache=[];
		Value2D._typeClass=[];
		return Value2D;
	})(ShaderValue)


	//class laya.webgl.shapes.Circle extends laya.webgl.shapes.BasePoly
	var Circle=(function(_super){
		function Circle(x,y,r,color,borderWidth,borderColor,fill){
			Circle.__super.call(this,x,y,r,r,80,color,borderWidth,borderColor);
			this.fill=fill;
		}

		__class(Circle,'laya.webgl.shapes.Circle',_super);
		return Circle;
	})(BasePoly)


	//class laya.webgl.shapes.Ellipse extends laya.webgl.shapes.BasePoly
	var Ellipse=(function(_super){
		function Ellipse(x,y,width,height,color,borderWidth,borderColor){
			Ellipse.__super.call(this,x,y,width,height,40,color,borderWidth,borderColor);
		}

		__class(Ellipse,'laya.webgl.shapes.Ellipse',_super);
		return Ellipse;
	})(BasePoly)


	//class laya.webgl.shapes.Fan extends laya.webgl.shapes.BasePoly
	var Fan=(function(_super){
		function Fan(x,y,r,r0,r1,color,borderWidth,borderColor,round){
			(round===void 0)&& (round=0);
			Fan.__super.call(this,x,y,r,r,30,color,borderWidth,borderColor,round);
			this.r0=r0;
			this.r1=r1;
		}

		__class(Fan,'laya.webgl.shapes.Fan',_super);
		var __proto=Fan.prototype;
		__proto.getData=function(ib,vb,start){
			var indices=[];
			var verts=[];
			this.sector(verts,indices,start);
			if(this.fill){
				(this.borderWidth>0)&&(this.borderColor!=-1)&&this.createFanLine(verts,indices,this.borderWidth,start+verts.length/5,null,null);
				ib.append(new Uint16Array(indices));
				vb.append(new Float32Array(verts));
			}
			else{
				var outV=[];
				var outI=[];
				(this.borderColor!=-1)&&(this.borderWidth>0)&&this.createFanLine(verts,indices,this.borderWidth,start,outV,outI);
				ib.append(new Uint16Array(outI));
				vb.append(new Float32Array(outV));
			}
		}

		return Fan;
	})(BasePoly)


	//class laya.webgl.shapes.Line extends laya.webgl.shapes.BasePoly
	var Line=(function(_super){
		function Line(x,y,points,color,borderWidth){
			this.points
			Line.__super.call(this,x,y,0,0,0,color,borderWidth,color,0);
			this.points=points;
		}

		__class(Line,'laya.webgl.shapes.Line',_super);
		var __proto=Line.prototype;
		__proto.getData=function(ib,vb,start){
			var indices=[];
			var verts=[];
			(this.borderWidth > 0)&& this.createLine2(this.points,indices,this.borderWidth,start,verts,this.points.length / 2);
			ib.append(new Uint16Array(indices));
			vb.append(new Float32Array(verts));
		}

		return Line;
	})(BasePoly)


	//class laya.webgl.shapes.Polygon extends laya.webgl.shapes.BasePoly
	var Polygon=(function(_super){
		function Polygon(x,y,r,edges,color,borderWidth,borderColor){
			Polygon.__super.call(this,x,y,r,r,edges,color,borderWidth,borderColor);
		}

		__class(Polygon,'laya.webgl.shapes.Polygon',_super);
		return Polygon;
	})(BasePoly)


	//class laya.webgl.shapes.Rect extends laya.webgl.shapes.BasePoly
	var Rect1=(function(_super){
		function Rect(x,y,width,height,color,borderWidth,borderColor){
			Rect.__super.call(this,x+width / 2,y+height / 2,width / 2,height / 2,4,color,borderWidth,borderColor);
		}

		__class(Rect,'laya.webgl.shapes.Rect',_super,'Rect1');
		return Rect;
	})(BasePoly)


	/**
	*...
	*@author wk
	*/
	//class laya.webgl.submit.SubmitCanvas extends laya.webgl.submit.Submit
	var SubmitCanvas=(function(_super){
		function SubmitCanvas(){
			//this._ctx_src=null;
			//this._alpha=NaN;
			this._filters=[];
			//this._shaderDefines=null;
			SubmitCanvas.__super.call(this);
			this._matrix=new Matrix();
			this._matrix4=CONST3D2D.defaultMatrix4.concat();
		}

		__class(SubmitCanvas,'laya.webgl.submit.SubmitCanvas',_super);
		var __proto=SubmitCanvas.prototype;
		__proto.renderSubmit=function(){
			if (this._ctx_src._targets){
				this._ctx_src._targets.flush(this._ctx_src);
				return 1;
			};
			var preAlpha=RenderState2D.worldAlpha;
			var preMatrix4=RenderState2D.worldMatrix4;
			var preMatrix=RenderState2D.worldMatrix;
			var preFilters=RenderState2D.worldFilters;
			var preShaderDefinesValue=RenderState2D.worldShaderDefinesValue;
			var m=this._matrix;
			var m4=this._matrix4;
			var mout=Matrix.TEMP;
			Matrix.mul(m,preMatrix,mout);
			m4[0]=mout.a;
			m4[1]=mout.b;
			m4[4]=mout.c;
			m4[5]=mout.d;
			m4[12]=mout.tx;
			m4[13]=mout.ty;
			RenderState2D.worldMatrix=mout.clone();
			RenderState2D.worldMatrix4=m4;
			RenderState2D.worldAlpha=RenderState2D.worldAlpha *this._alpha;
			if (this._filters.length){
				RenderState2D.worldFilters=this._filters;
				RenderState2D.worldShaderDefinesValue=this._shaderDefines._value;
			}
			this._ctx_src.flush();
			RenderState2D.worldAlpha=preAlpha;
			RenderState2D.worldMatrix4=preMatrix4;
			RenderState2D.worldMatrix.destroy();
			RenderState2D.worldMatrix=preMatrix;
			RenderState2D.worldFilters=preFilters;
			RenderState2D.worldShaderDefinesValue=preShaderDefinesValue;
			return 1;
		}

		__proto.releaseRender=function(){
			var cache=SubmitCanvas._cache;
			cache[cache._length++]=this;
		}

		__proto.getRenderType=function(){
			return 3;
		}

		SubmitCanvas.create=function(ctx_src,alpha,filters){
			var o=(!SubmitCanvas._cache._length)?(new SubmitCanvas()):SubmitCanvas._cache[--SubmitCanvas._cache._length];
			o._ctx_src=ctx_src;
			o._alpha=alpha;
			if (filters && filters.length){
				o._shaderDefines || (o._shaderDefines=new ShaderDefines(SubmitCanvas._name2int,SubmitCanvas._int2name,SubmitCanvas._int2nameMap));
				var n=filters.length;
				o._filters.length=n;
				var f;
				for (var i=0;i < n;i++){
					o._filters[i]=f=filters[i];
					o._shaderDefines.add(f.type);
				}
			}
			else o._filters.length=0;
			return o;
		}

		SubmitCanvas._name2int={};
		SubmitCanvas._int2name=[];
		SubmitCanvas._int2nameMap=[];
		SubmitCanvas._cache=(SubmitCanvas._cache=[],SubmitCanvas._cache._length=0,SubmitCanvas._cache);
		return SubmitCanvas;
	})(Submit)


	/**
	*<p> <code>Sprite</code> 类是基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。</p>
	*
	*@example 以下示例代码，创建了一个 <code>Text</code> 实例。
	*<p>[EXAMPLE-AS-BEGIN]</p>
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Sprite;
		*import laya.events.Event;
		*
		*public class Sprite_Example
		*{
			*private var sprite:Sprite;
			*private var shape:Sprite
			*
			*public function Sprite_Example()
			*{
				*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
				*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
				*onInit();
				*}
			*
			*private function onInit():void
			*{
				*sprite=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
				*sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
				*sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
				*sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
				*sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
				*sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
				*Laya.stage.addChild(sprite);//将此 sprite 对象添加到显示列表。
				*sprite.on(Event.CLICK,this,onClickSprite);//给 sprite 对象添加点击事件侦听。
				*
				*shape=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
				*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
				*shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
				*shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
				*shape.width=100;//设置 shape 对象的宽度。
				*shape.height=100;//设置 shape 对象的高度。
				*shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
				*shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
				*Laya.stage.addChild(shape);//将此 shape 对象添加到显示列表。
				*shape.on(Event.CLICK,this,onClickShape);//给 shape 对象添加点击事件侦听。
				*}
			*
			*private function onClickSprite():void
			*{
				*trace("点击 sprite 对象。");
				*sprite.rotation+=5;//旋转 sprite 对象。
				*}
			*
			*private function onClickShape():void
			*{
				*trace("点击 shape 对象。");
				*shape.rotation+=5;//旋转 shape 对象。
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*var sprite;
	*var shape;
	*Sprite_Example();
	*function Sprite_Example()
	*{
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*onInit();
		*}
	*function onInit()
	*{
		*sprite=new laya.display.Sprite();//创建一个 Sprite 类的实例对象 sprite 。
		*sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
		*sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
		*sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
		*sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
		*sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
		*Laya.stage.addChild(sprite);//将此 sprite 对象添加到显示列表。
		*sprite.on(Event.CLICK,this,onClickSprite);//给 sprite 对象添加点击事件侦听。
		*shape=new laya.display.Sprite();//创建一个 Sprite 类的实例对象 sprite 。
		*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
		*shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
		*shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
		*shape.width=100;//设置 shape 对象的宽度。
		*shape.height=100;//设置 shape 对象的高度。
		*shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
		*shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
		*Laya.stage.addChild(shape);//将此 shape 对象添加到显示列表。
		*shape.on(laya.events.Event.CLICK,this,onClickShape);//给 shape 对象添加点击事件侦听。
		*}
	*function onClickSprite()
	*{
		*console.log("点击 sprite 对象。");
		*sprite.rotation+=5;//旋转 sprite 对象。
		*}
	*function onClickShape()
	*{
		*console.log("点击 shape 对象。");
		*shape.rotation+=5;//旋转 shape 对象。
		*}
	*</listing>
	*<listing version="3.0">
	*import Sprite=laya.display.Sprite;
	*class Sprite_Example {
		*private sprite:Sprite;
		*private shape:Sprite
		*public Sprite_Example(){
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*this.onInit();
			*}
		*private onInit():void {
			*this.sprite=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
			*this.sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
			*this.sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
			*this.sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
			*this.sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
			*this.sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
			*Laya.stage.addChild(this.sprite);//将此 sprite 对象添加到显示列表。
			*this.sprite.on(laya.events.Event.CLICK,this,this.onClickSprite);//给 sprite 对象添加点击事件侦听。
			*
			*this.shape=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
			*this.shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
			*this.shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
			*this.shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
			*this.shape.width=100;//设置 shape 对象的宽度。
			*this.shape.height=100;//设置 shape 对象的高度。
			*this.shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
			*this.shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
			*Laya.stage.addChild(this.shape);//将此 shape 对象添加到显示列表。
			*this.shape.on(laya.events.Event.CLICK,this,this.onClickShape);//给 shape 对象添加点击事件侦听。
			*}
		*
		*private onClickSprite():void {
			*console.log("点击 sprite 对象。");
			*this.sprite.rotation+=5;//旋转 sprite 对象。
			*}
		*
		*private onClickShape():void {
			*console.log("点击 shape 对象。");
			*this.shape.rotation+=5;//旋转 shape 对象。
			*}
		*}
	*</listing>
	*@author yung
	*
	*/
	//class laya.display.Sprite extends laya.display.Node
	var Sprite=(function(_super){
		function Sprite(){
			this.mouseThrough=false;
			this._transform=null;
			this._tfChanged=false;
			this._x=0;
			this._y=0;
			this._width=0;
			this._height=0;
			this._repaint=1;
			this._mouseEnableState=0;
			this._enableRenderMerge=false;
			this._zOrder=0;
			this._graphics=null;
			this._renderType=0;
			this.autoSize=false;
			this.optimizeFloat=false;
			Sprite.__super.call(this);
			this._style=Style.EMPTY;
			this._$P=Sprite.PropEmpty;
		}

		__class(Sprite,'laya.display.Sprite',_super);
		var __proto=Sprite.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._style && this._style.destroy();
			this._transform=null;
			this._style=null;
			this._graphics=null;
			this._$P=null
		}

		/**根据Z进行重新排序。*/
		__proto.updateOrder=function(){
			Utils1.updateOrder(this._childs)&& this.repaint();
		}

		/**在设置cacheAsBtimap=true或者staticCache=true的情况下，调用此方法会重新刷新缓存*/
		__proto.reCache=function(){
			if (this._$P.cacheCanvas)this._$P.cacheCanvas.reCache=true;
		}

		__proto.setBounds=function(bound){
			this.get$P().uBounds=bound;
		}

		/**
		*获取本对象在父容器坐标系的矩形显示区域。
		*计算量较大，尽量少用。
		*@return 矩形区域
		*/
		__proto.getBounds=function(){
			return Rectangle._getWrapRec(this.boundPointsToParent(),Rectangle.TEMP);
		}

		/**
		*获取本对象在自己坐标系的矩形显示区域。
		*计算量较大，尽量少用。
		*@return 矩形区域
		*/
		__proto.getSelfBounds=function(){
			return Rectangle._getWrapRec(this._getBoundPointsM(false),Rectangle.TEMP);
		}

		/**
		*批量操作点坐标。
		*@param pList 坐标列表。
		*@param x x轴偏移量。
		*@param y y轴偏移量。
		*
		*/
		__proto.transPointList=function(pList,x,y){
			var i=0,len=pList.length;
			for (i=0;i < len;i+=2){
				pList[i]+=x;
				pList[i+1]+=y;
			}
		}

		/**
		*获取本对象在父容器坐标系的显示区域多边形顶点列表。
		*当显示对象链中有旋转时，返回多边形顶点列表，无旋转时返回矩形的四个顶点。
		*@param ifRotate 之前的对象链中是否有旋转。
		*@return 顶点列表
		*/
		__proto.boundPointsToParent=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var pX=0,pY=0;
			if (this._style){
				pX=this._style.translateX;
				pY=this._style.translateY;
				ifRotate=ifRotate || (this._style.rotate!==0);
				if (this._style.scrollRect){
					pX+=this._style.scrollRect.x;
					pY+=this._style.scrollRect.y;
				}
			};
			var pList=this._getBoundPointsM(ifRotate);
			if (!pList || pList.length < 1)return pList;
			if (pList.length !=8){
				pList=ifRotate ? GrahamScan.scanPList(pList):Rectangle._getWrapRec(pList,Rectangle.TEMP)._getBoundPoints();
			}
			if (!this.transform){
				this.transPointList(pList,this.x-pX,this.y-pY);
				return pList;
			};
			var tPoint=Point.TEMP;
			var rst=[];
			var i=0,len=pList.length;
			for (i=0;i < len;i+=2){
				tPoint.x=pList[i];
				tPoint.y=pList[i+1];
				this.toParentPoint(tPoint);
				rst.push(tPoint.x,tPoint.y);
			}
			return rst;
		}

		/**
		*返回此实例中的绘图对象（ <code>Graphics</code> ）的显示区域。
		*@return
		*
		*/
		__proto.getGraphicBounds=function(){
			if (!this._graphics)return Rectangle.EMPTY;
			return this._graphics.getBounds();
		}

		/**
		*@private
		*获取自己坐标系的显示区域多边形顶点列表
		*@param ifRotate 当前的显示对象链是否由旋转
		*@return 顶点列表
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			if (this._$P.uBounds)return this._$P.uBounds._getBoundPoints();
			if (!this._$P.temBM)this.get$P().temBM=[];
			var pList=this._graphics ? this._graphics.getBoundPoints():Utils1.clearArr(this._$P.temBM);
			var child;
			var cList;
			for (var i=0,n=this.numChildren;i < n;i++){
				child=this.getChildAt(i);
				if ((child instanceof laya.display.Sprite )&& child.visible==true){
					cList=child.boundPointsToParent(ifRotate);
					if (cList)
						pList=pList ? Utils1.concatArr(pList,cList):cList;
				}
			}
			return pList;
		}

		/**
		*获取样式。
		*@return
		*@private
		*/
		__proto.getStyle=function(){
			this._style===Style.EMPTY && (this._style=new Style());
			return this._style;
		}

		/**@private */
		__proto.get$P=function(){
			this._$P===Sprite.PropEmpty && (this._$P={});
			return this._$P;
		}

		/**
		*设置样式。
		*@param value
		*/
		__proto.setStyle=function(value){
			this._style=value;
		}

		/**@private */
		__proto._adjustTransform=function(){
			'use strict';
			this._tfChanged=false;
			var style=this._style;
			var sx=style.scaleX,sy=style.scaleY;
			var m;
			if (style.rotate || sx!==1 || sy!==1 || style.skewX || style.skewY){
				m=this._transform || (this._transform=Matrix.create());
				m.bTransform=true;
				if (style.rotate){
					var angle=style.rotate *0.0174532922222222;
					var cos=m.cos=Math.cos(angle);
					var sin=m.sin=Math.sin(angle);
					m.a=sx *cos;
					m.b=sx *sin;
					m.c=-sy *sin;
					m.d=sy *cos;
					m.tx=m.ty=0;
					return m;
					}else {
					m.a=sx;
					m.d=sy;
					m.c=m.b=m.tx=m.ty=0;
					if (style.skewX || style.skewY){
						return m.skew(style.skewX *0.0174532922222222,style.skewY *0.0174532922222222);
					}
					return m;
				}
				}else {
				this._transform && this._transform.destroy();
				this._transform=null;
				this._renderType &=~0x08;
			}
			return m;
		}

		/**
		*设置坐标位置。
		*@param x X轴坐标
		*@param y Y轴坐标
		*@return 返回对象本身
		*/
		__proto.pos=function(x,y){
			if (this._x!==x || this._y!==y){
				this.x=x;
				this.y=y;
			}
			return this;
		}

		/**
		*设置轴心点。
		*@param x X轴心点
		*@param y Y轴心点
		*@return 返回对象本身
		*/
		__proto.pivot=function(x,y){
			this.pivotX=x;
			this.pivotY=y;
			return this;
		}

		/**
		*设置宽高。
		*@param width 宽度
		*@param hegiht 高度
		*@return 返回对象本身
		*/
		__proto.size=function(width,height){
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*设置缩放。
		*@param scaleX X轴缩放比例
		*@param scaleY Y轴缩放比例
		*@return 返回对象本身
		*/
		__proto.scale=function(scaleX,scaleY){
			this.scaleX=scaleX;
			this.scaleY=scaleY;
			return this;
		}

		/**
		*设置倾斜角度。
		*@param skewX 水平倾斜角度
		*@param skewY 垂直倾斜角度
		*@return 返回对象本身
		*/
		__proto.skew=function(skewX,skewY){
			this.skewX=this.scaleX;
			this.skewY=this.scaleY;
			return this;
		}

		/**@private */
		__proto._removeRenderType=function(type){
			((this._renderType & type)==type)&& (this._renderType &=~type);
		}

		/**@private */
		__proto._addRenderType=function(type){
			this._renderType |=type;
		}

		/**
		*更新、呈现显示对象。
		*@param context
		*@param x
		*@param y
		*/
		__proto.render=function(context,x,y){
			Stat.spriteDraw++;
			RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
			this._repaint=0;
		}

		/**
		*绘制 <code>Sprite</code> 到 <code>canvas</code> 上。
		*@param canvasWidth 画布宽度。
		*@param canvasHeight 画布高度。
		*@param x 绘制的X轴偏移量。
		*@param y 绘制的Y轴偏移量。
		*@return
		*/
		__proto.drawToCanvas=function(canvasWidth,canvasHeight,offsetX,offsetY){
			return System.drawToCanvas(this,this._renderType,canvasWidth,canvasHeight,offsetX,offsetY);
		}

		/**
		*自定义更新、呈现显示对象。
		*【注意】不要在此函数内增加或删除树节点，否则会树节点遍历照成影响
		*@param context
		*@param x
		*@param y
		*/
		__proto.customRender=function(context,x,y){}
		/**
		*应用滤镜。
		*/
		__proto.applyFilters=function(){
			if (Render.isWebGl)return;
			var _filters;
			_filters=this._$P.filters;
			if (!_filters || _filters.length < 1)return;
			for (var i=0,n=_filters.length;i < n;i++){
				_filters[i].action.apply(this._$P.cacheCanvas);
			}
		}

		/**@inheritDoc */
		__proto.ask=function(type,value){
			return type==1 ? (value==2):false;
		}

		/**
		*本地坐标转全局坐标
		*@param point 要转换的点
		*@return 转换后的点
		*/
		__proto.localToGlobal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (!this._displayInStage || !point)return point;
			if (createNewPoint===true){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			while (ele){
				if (ele==Laya.stage)break ;
				point=ele.toParentPoint(point);
				ele=ele.parent;
			}
			return point;
		}

		/**
		*全局坐标转本地坐标
		*@param point 要转换的点
		*@return 转换后的点
		*/
		__proto.globalToLocal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (!this._displayInStage || !point)return point;
			if (createNewPoint===true){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			var list=[];
			while (ele){
				if (ele==Laya.stage)break ;
				list.push(ele);
				ele=ele.parent;
			};
			var i=list.length-1;
			while (i >=0){
				ele=list[i];
				point=ele.fromParentPoint(point);
				i--;
			}
			return point;
		}

		/**
		*将本地坐标系坐标转换到父容器坐标系
		*@param point 要转换的点
		*@return 转换后的点
		*/
		__proto.toParentPoint=function(point){
			if (!point)return point;
			point.x-=this.pivotX;
			point.y-=this.pivotY;
			if (this.transform){
				this._transform.transformPoint(point.x,point.y,point);
			}
			point.x+=this._x;
			point.y+=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x-=scroll.x;
				point.y-=scroll.y;
			}
			return point;
		}

		/**
		*将父容器坐标系坐标转换到本地坐标系
		*@param point 要转换的点
		*@return 转换后的点
		*/
		__proto.fromParentPoint=function(point){
			if (!point)return point;
			point.x-=this._x;
			point.y-=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x+=scroll.x;
				point.y+=scroll.y;
			}
			if (this.transform){
				this._transform.invertTransformPoint(point);
			}
			point.x+=this.pivotX;
			point.y+=this.pivotY;
			return point;
		}

		/**
		*
		*增加事件监听，如果侦听鼠标事件，则会自动设置自己和父亲节点的mouseEnable=true
		*@param type 事件类型，可以参考Event类定义
		*@param caller 执行域(this域)，默认为监听对象的this域
		*@param listener 回调方法，如果为空，则移除所有type类型的事件监听
		*@param args 回调参数
		*@return 返回对象本身
		*/
		__proto.on=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				if (this._displayInStage)this._$2__onDisplay();
				else laya.events.EventDispatcher.prototype.once.call(this,"display",this,this._$2__onDisplay);
			}
			return laya.events.EventDispatcher.prototype.on.call(this,type,caller,listener,args);
		}

		/**
		*增加一次性事件监听，执行后会自动移除监听，如果侦听鼠标事件，则会自动设置自己和父亲节点的mouseEnable=true
		*@param type 事件类型，可以参考Event类定义
		*@param caller 执行域(this域)，默认为监听对象的this域
		*@param listener 回调方法，如果为空，则移除所有type类型的事件监听
		*@param args 回调参数
		*@return 返回对象本身
		*/
		__proto.once=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				if (this._displayInStage)this._$2__onDisplay();
				else laya.events.EventDispatcher.prototype.once.call(this,"display",this,this._$2__onDisplay);
			}
			return laya.events.EventDispatcher.prototype.once.call(this,type,caller,listener,args);
		}

		/**@private */
		__proto._$2__onDisplay=function(){
			if (this._mouseEnableState!==1){
				var ele=this;
				while (ele && ele._mouseEnableState!==1){
					ele.mouseEnabled=true;
					ele=ele.parent;
				}
			}
		}

		/**
		*加载并显示一个图片【注意】同一对象调用多次，会导致渲染多张图片。
		*@param url 图片地址。
		*@param x 显示图片的x位置
		*@param y 显示图片的y位置
		*@param width 显示图片的宽度，设置为0表示使用图片默认宽度
		*@param height 显示图片的高度，设置为0表示使用图片默认高度
		*@param complete 加载完成回调
		*@return 返回精灵对象本身
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			function loaded (image){
				if (!_$this._width && !_$this._height)
					_$this.size(width || image.width,height || image.height);
				_$this.repaint();
				complete && complete.run();
			}
			this.graphics.loadImage(url,x,y,width,height,loaded);
			return this;
		}

		/**cacheAsBitmap=true时，手动重新缓存本对象。*/
		__proto.repaint=function(){
			(this._repaint===0)&& (this._repaint=1,this.parentRepaint(this));
		}

		/**
		*获取是否重新缓存。
		*@return
		*/
		__proto.isRepaint=function(){
			return (this._repaint!==0)&& this._$P.cacheCanvas && this._$P.cacheCanvas.reCache;
		}

		/**@inheritDoc */
		__proto.childChanged=function(child){
			this._renderType |=0x800;
			if (child && (child).zOrder)Laya.timer.callLater(this,this.updateOrder);
			this.repaint();
		}

		/**cacheAsBitmap=true时，手动重新缓存父对象。 */
		__proto.parentRepaint=function(child){
			var p=this._parent;
			p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this));
		}

		/**
		*开始拖动此对象。
		*@param area 拖动区域，此区域为当前对象注册点活动区域（不包括对象宽高），可选。
		*@param hasInertia 鼠标松开后，是否还惯性滑动，默认为false，可选。
		*@param elasticDistance 橡皮筋效果的距离值，0为无橡皮筋效果，默认为0，可选。
		*@param elasticBackTime 橡皮筋回弹时间，单位为毫秒，默认为300毫秒，可选。
		*@param data 拖动事件携带的数据，可选。
		*@param disableMouseEvent禁用其他对象的鼠标检测，默认为false，设置为true能提高性能
		*/
		__proto.startDrag=function(area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent){
			(hasInertia===void 0)&& (hasInertia=false);
			(elasticDistance===void 0)&& (elasticDistance=0);
			(elasticBackTime===void 0)&& (elasticBackTime=300);
			(disableMouseEvent===void 0)&& (disableMouseEvent=false);
			this._$P.dragging || (this.get$P().dragging=new Dragging());
			this._$P.dragging.start(this,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent);
		}

		/**停止拖动此对象。*/
		__proto.stopDrag=function(){
			this._$P.dragging && this._$P.dragging.stop();
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (!value && this._$P.cacheCanvas && this._$P.cacheCanvas.ctx){
				this._$P.cacheCanvas.ctx.destroy();
				this._$P.cacheCanvas.ctx=null;
			};
			var fc=this["_filterCache"];
			fc && (fc.destroy(),fc.recycle(),this["_filterCache"]=null);
			_super.prototype._setDisplay.call(this,value);
		}

		/**
		*检测某个点是否在此对象内。
		*@param x 全局x坐标。
		*@param y 全局y坐标。
		*@return 表示是否在对象内。
		*/
		__proto.hitTestPoint=function(x,y){
			var point=this.globalToLocal(Point.TEMP.setTo(x,y));
			var rect=this._$P.hitArea ? this._$P.hitArea :Rectangle.EMPTY.setTo(0,0,this._width,this._height);
			return rect.contains(point.x,point.y);
		}

		/**获得相对于本对象上的鼠标坐标信息。*/
		__proto.getMousePoint=function(){
			return this.globalToLocal(Point.TEMP.setTo(Laya.stage.mouseX,Laya.stage.mouseY));
		}

		/**@private */
		__proto._getWords=function(){
			return null;
		}

		/**@private */
		__proto._addChildsToLayout=function(out){
			var words=this._getWords();
			if (words==null && this._childs.length==0)return false;
			words && words.forEach(function(o){
				out.push(o);
			});
			this._childs.forEach(function(o){
				o._style._enableLayout()&& o._addToLayout(out);
			});
			return true;
		}

		/**@private */
		__proto._addToLayout=function(out){
			if (this._style.absolute)return;
			this._style.block ? out.push(this):(this._addChildsToLayout(out)&& (this.x=this.y=0));
		}

		/**@private */
		__proto._isChar=function(){
			return false;
		}

		/**@private */
		__proto._getCSSStyle=function(){
			return this._style.getCSSStyle();
		}

		/**
		*通过属名设置对应属性的值。
		*@param name 属性名。
		*@param value 属性值。
		*/
		__proto.setValue=function(name,value){
			switch (name){
				case 'x':
					this.x=parseFloat(value);
					break ;
				case 'y':
					this.y=parseFloat(value);
					break ;
				case 'width':
					this.width=parseFloat(value);
					break ;
				case 'height':
					this.height=parseFloat(value);
					break ;
				default :
					this[name]=value;
				}
		}

		/**
		*@private
		*/
		__proto.layoutLater=function(){
			this.parent && (this.parent).layoutLater();
		}

		/**
		*功能同cacheAs
		*/
		__getset(0,__proto,'cacheAsBitmap',function(){
			return this.cacheAs!=="none";
			},function(value){
			this.cacheAs=value?"normal":"none";
		});

		/**显示对象的滚动矩形范围。*/
		__getset(0,__proto,'scrollRect',function(){
			return this._style.scrollRect;
			},function(value){
			this.getStyle().scrollRect=value;
			this.repaint();
			if (value)this._renderType |=0x40;
			else this._renderType &=~0x40;
		});

		/**
		*表示显示对象的显示高度，以像素为单位。
		*@return
		*
		*/
		__getset(0,__proto,'viewHeight',function(){
			return this.height *this._style.scaleY;
		});

		/**指定显示对象是否缓存为静态图像，cacheAsBitmap=true时，子对象发生变化，会自动重新缓存，同时也可以手动调用reCache方法更新缓存。
		*建议把不经常变化的复杂内容缓存为静态图像，能极大提高渲染性能，有"none"，"normal"和"bitmap"三个值可选
		*<p>默认为"none"，不做任何缓存。</p>
		*<p>当值为"normal"时，canvas下进行画布缓存，webgl模式下进行命令缓存。</p>
		*<p>当值为"bitmap"时，canvas下进行依然是画布缓存，webgl模式下使用renderTarget缓存。</p>
		*webgl下renderTarget缓存模式有最大2048大小限制，会额外增加内存开销，不断重绘时开销比较大，但是会减少drawcall，渲染性能最高。
		*webgl下命令缓存模式只会减少节点遍历及命令组织，不会减少drawcall，性能中等。
		*/
		__getset(0,__proto,'cacheAs',function(){
			return this._$P.cacheCanvas==null ? "none" :this._$P.cacheCanvas.type;
			},function(value){
			if (value===(this._$P.cacheCanvas ? this._$P.cacheCanvas.type :"none"))return;
			if (value!=="none"){
				this._$P.cacheCanvas || (this.get$P().cacheCanvas=Pool.getItemByClass("cacheCanvas",Object));
				this._$P.cacheCanvas.type=value;
				this._$P.cacheCanvas.reCache=true;
				this._renderType |=0x10;
				}else {
				if (this._$P.cacheCanvas)Pool.recover("cacheCanvas",this._$P.cacheCanvas);
				this._$P.cacheCanvas=null;
				this._renderType &=~0x10;
			}
			this.repaint();
		});

		/**cacheAsBitmap=true时此值才有效，staticCache=true时，子对象变化时不会自动更新缓存，只能通过调用reCache方法手动刷新*/
		__getset(0,__proto,'staticCache',function(){
			return this._$P.staticCache;
			},function(value){
			this._$P.staticCache=value;
			if (!value && this._$P.cacheCanvas){
				this._$P.cacheCanvas.reCache=true;
			}
		});

		/**表示显示对象相对于父容器的水平方向坐标值。*/
		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			var p=this._parent;
			this._x!==value && (this._x=value,p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this)));
		});

		/**表示显示对象相对于父容器的垂直方向坐标值。*/
		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			var p=this._parent;
			this._y!==value && (this._y=value,p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this)));
		});

		/**水平倾斜角度，默认值为0。*/
		__getset(0,__proto,'skewX',function(){
			return this._style.skewX;
			},function(value){
			var style=this.getStyle();
			if (style.skewX!==value){
				style.skewX=value;
				this._tfChanged=true;
				this._renderType |=0x08;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this));
			}
		});

		/**
		*表示显示对象的宽度，以像素为单位。
		*@return
		*/
		__getset(0,__proto,'width',function(){
			if (!this.autoSize)return this._width;
			return this.getSelfBounds().width;
			},function(value){
			this._width!==value && (this._width=value,this.repaint());
		});

		/**
		*表示显示对象的高度，以像素为单位。
		*@return
		*/
		__getset(0,__proto,'height',function(){
			if (!this.autoSize)return this._height;
			return this.getSelfBounds().height;
			},function(value){
			this._height!==value && (this._height=value,this.repaint());
		});

		/**
		*表示显示对象的显示宽度，以像素为单位。
		*@return
		*
		*/
		__getset(0,__proto,'viewWidth',function(){
			return this.width *this._style.scaleX;
		});

		/**X轴缩放值，默认值为1。*/
		__getset(0,__proto,'scaleX',function(){
			return this._style.scaleX;
			},function(value){
			var style=this.getStyle();
			if (style.scaleX!==value){
				style.scaleX=value;
				this._tfChanged=true;
				this._renderType |=0x08;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this));
			}
		});

		/**手动设置的可点击区域。*/
		__getset(0,__proto,'hitArea',function(){
			return this._$P.hitArea;
			},function(value){
			this.get$P().hitArea=value;
		});

		/**旋转角度，默认值为0。*/
		__getset(0,__proto,'rotation',function(){
			return this._style.rotate;
			},function(value){
			var style=this.getStyle();
			if (style.rotate!==value){
				style.rotate=value;
				this._tfChanged=true;
				this._renderType |=0x08;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this));
			}
		});

		/**Y轴缩放值，默认值为1。*/
		__getset(0,__proto,'scaleY',function(){
			return this._style.scaleY;
			},function(value){
			var style=this.getStyle();
			if (style.scaleY!==value){
				style.scaleY=value;
				this._tfChanged=true;
				this._renderType |=0x08;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this));
			}
		});

		/**指定要使用的混合模式。*/
		__getset(0,__proto,'blendMode',function(){
			return this._style.blendMode;
			},function(value){
			this.getStyle().blendMode=value;
			this._renderType |=0x20;
			this.parentRepaint(this);
		});

		/**垂直倾斜角度，默认值为0。*/
		__getset(0,__proto,'skewY',function(){
			return this._style.skewY;
			},function(value){
			var style=this.getStyle();
			if (style.skewY!==value){
				style.skewY=value;
				this._tfChanged=true;
				this._renderType |=0x08;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint(this));
			}
		});

		/**
		*对象的矩阵信息。
		*/
		__getset(0,__proto,'transform',function(){
			return this._tfChanged ? this._adjustTransform():this._transform;
			},function(value){
			this._tfChanged=false;
			this._transform=value;
			if (value)this._renderType |=0x08;
			else this._renderType &=~0x08;
			this.parentRepaint(this);
		});

		/**X轴心点的位置，默认为0，轴心点会影响对象位置，缩放，旋转。*/
		__getset(0,__proto,'pivotX',function(){
			return this._style.translateX;
			},function(value){
			this.getStyle().translateX=value;
			this.repaint();
		});

		/**Y轴心点的位置，默认为0，轴心点会影响对象位置，缩放，旋转。*/
		__getset(0,__proto,'pivotY',function(){
			return this._style.translateY;
			},function(value){
			this.getStyle().translateY=value;
			this.repaint();
		});

		/**透明度，值为0-1，默认为1表示不透明。*/
		__getset(0,__proto,'alpha',function(){
			return this._style.alpha;
			},function(value){
			if (this._style.alpha!==value){
				value=value < 0 ? 0 :(value > 1 ? 1 :value);
				this.getStyle().alpha=value;
				if (value!==1)this._renderType |=0x04;
				else this._renderType &=~0x04;
				this.parentRepaint(this);
			}
		});

		/**表示是否可见，默认为true。*/
		__getset(0,__proto,'visible',function(){
			return this._style.visible;
			},function(value){
			if (this._style.visible!==value){
				this.getStyle().visible=value;
				this.parentRepaint(this);
			}
		});

		/**绘图对象。*/
		__getset(0,__proto,'graphics',function(){
			this._renderType |=0x100;
			return this._graphics || (this.graphics=System.createGraphics());
			},function(value){
			if (this._graphics)this._graphics.sp=null;
			this._graphics=value;
			if (value){
				value.sp=this;
				this._renderType |=0x100;
				if (value.empty())this._renderType &=~0x01;
				}else {
				this._renderType &=~0x100;
				this._renderType &=~0x01;
			}
			this.repaint();
		});

		/**滤镜集合。*/
		__getset(0,__proto,'filters',function(){
			return this._$P.filters;
			},function(value){
			value && value.length===0 && (value=null);
			if (this._$P.filters==value)return;
			this.get$P().filters=value ? value.slice():null;
			if (Render.isWebGl){
				if (value && value.length){
					this._renderType |=0x02;
					}else {
					this._renderType &=~0x02;
				}
				this.repaint();
				return;
			}
			this.cacheAsBitmap=value && value.length > 0;
			this.repaint();
		});

		/**遮罩。*/
		__getset(0,__proto,'mask',function(){
			return this._$P._mask;
			},function(value){
			this.cacheAsBitmap=true;
			this.get$P()._mask=value;
			this._renderType |=0x20;
			this.parentRepaint(this);
		});

		/**对舞台 <code>stage</code> 的引用。*/
		__getset(0,__proto,'stage',function(){
			return Laya.stage;
		});

		/**
		*是否接受鼠标事件。
		*默认为false，如果监听鼠标事件，则会自动设置本对象及父节点的 mouseEnable 都为 true。
		**/
		__getset(0,__proto,'mouseEnabled',function(){
			return this._mouseEnableState > 1;
			},function(value){
			this._mouseEnableState=value ? 2 :1;
		});

		/**允许webgl绘制时指令合并优化。*/
		__getset(0,__proto,'enableRenderMerge',function(){
			return this._enableRenderMerge;
			},function(value){
			if (Render.isWebGl){
				if (value){
					this._renderType |=0x400;
					}else {
					this._renderType &=~0x400;
				}
				this._enableRenderMerge=value;
			}
		});

		/**
		*表示鼠标在此对象上的Y轴坐标信息。
		*/
		__getset(0,__proto,'mouseY',function(){
			return this.getMousePoint().y;
		});

		/**
		*表示鼠标在此对象上的X轴坐标信息。
		*/
		__getset(0,__proto,'mouseX',function(){
			return this.getMousePoint().x;
		});

		/**z排序，更改此值，能按照值大小显示先后顺序。*/
		__getset(0,__proto,'zOrder',function(){
			return this._zOrder;
			},function(value){
			if (this._zOrder !=value){
				this._zOrder=value;
				this._parent && Laya.timer.callLater(this._parent,this.updateOrder);
			}
		});

		Sprite.fromImage=function(url){
			return new Sprite().loadImage(url);
		}

		Sprite.PropEmpty={};
		return Sprite;
	})(Node)


	/**
	*audio标签播放声音的音轨控制
	*@author ww
	*/
	//class laya.media.h5audio.AudioSoundChannel extends laya.media.SoundChannel
	var AudioSoundChannel=(function(_super){
		function AudioSoundChannel(audio){
			this._audio=null;
			this._onEnd=null;
			this._resumePlay=null;
			AudioSoundChannel.__super.call(this);
			this._onEnd=Utils1.bind(this.onEnd,this);
			this._resumePlay=Utils1.bind(this.resumePlay,this);
			audio.addEventListener("ended",this._onEnd);
			this._audio=audio;
		}

		__class(AudioSoundChannel,'laya.media.h5audio.AudioSoundChannel',_super);
		var __proto=AudioSoundChannel.prototype;
		__proto.onEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					this.completeHandler.run();
					this.completeHandler=null;
				}
				this.stop();
				this.event("complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		__proto.resumePlay=function(){
			this._audio.removeEventListener("canplay",this._resumePlay);
			try {
				this._audio.currentTime=this.startTime;
				this._audio.play();
				}catch (e){
				this.event("error");
			}
		}

		/**
		*播放
		*/
		__proto.play=function(){
			try {
				this._audio.currentTime=this.startTime;
				}catch (e){
				this._audio.addEventListener("canplay",this._resumePlay);
				return;
			}
			this._audio.play();
		}

		/**
		*停止播放
		*
		*/
		__proto.stop=function(){
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
			if (!this._audio)
				return;
			this._audio.pause();
			this._audio.removeEventListener("ended",this._onEnd);
			Pool.recover(this.url,this._audio);
			this._audio=null;
		}

		/**
		*当前播放到的位置
		*@return
		*
		*/
		__getset(0,__proto,'position',function(){
			if (!this._audio)
				return 0;
			return this._audio.currentTime;
		});

		/**
		*设置音量
		*@param v
		*
		*/
		/**
		*获取音量
		*@return
		*
		*/
		__getset(0,__proto,'volume',function(){
			if (!this._audio)return 1;
			return this._audio.volume;
			},function(v){
			if (!this._audio)return;
			this._audio.volume=v;
		});

		return AudioSoundChannel;
	})(SoundChannel)


	/**
	*web audio api方式播放声音的音轨控制
	*@author ww
	*/
	//class laya.media.webaudio.WebAudioSoundChannel extends laya.media.SoundChannel
	var WebAudioSoundChannel=(function(_super){
		function WebAudioSoundChannel(){
			this.audioBuffer=null;
			this.gain=null;
			this.bufferSource=null;
			this._currentTime=0;
			this._volume=1;
			this._startTime=0;
			this._onPlayEnd=null;
			this.context=WebAudioSound.ctx;
			WebAudioSoundChannel.__super.call(this);
			this._onPlayEnd=Utils1.bind(this.onPlayEnd,this);
			if (this.context["createGain"]){
				this.gain=this.context["createGain"]();
				}else {
				this.gain=this.context["createGainNode"]();
			}
		}

		__class(WebAudioSoundChannel,'laya.media.webaudio.WebAudioSoundChannel',_super);
		var __proto=WebAudioSoundChannel.prototype;
		/**
		*播放声音
		*
		*/
		__proto.play=function(){
			if (this.bufferSource){
				this.bufferSource.disconnect();
				this.bufferSource.onended=null;
				this.bufferSource=null;
			}
			if (!this.audioBuffer)return;
			var context=this.context;
			var gain=this.gain;
			var bufferSource=context.createBufferSource();
			this.bufferSource=bufferSource;
			bufferSource.buffer=this.audioBuffer;
			bufferSource.connect(gain);
			if(gain)
				gain.disconnect();
			gain.connect(context.destination);
			bufferSource.onended=this._onPlayEnd;
			this._startTime=Browser.now();
			this.gain.gain.value=this._volume;
			if (this.loops==0){
				bufferSource.loop=true;
			}
			bufferSource.start(0,this.startTime);
			this._currentTime=0;
		}

		__proto.onPlayEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					this.completeHandler.run();
					this.completeHandler=null;
				}
				this.stop();
				this.event("complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		/**
		*停止播放
		*
		*/
		__proto.stop=function(){
			if (this.bufferSource){
				var sourceNode=this.bufferSource;
				if (sourceNode.stop){
					sourceNode.stop(0);
					}else {
					sourceNode.noteOff(0);
				}
				this.bufferSource.disconnect();
				this.bufferSource=null;
				this.audioBuffer=null;
			}
			if(this.gain)
				this.gain.disconnect();
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
		}

		/**
		*获取当前播放位置
		*@return
		*
		*/
		__getset(0,__proto,'position',function(){
			if (this.bufferSource){
				return (Browser.now()-this._startTime)/ 1000+this.startTime;
			}
			return 0;
		});

		/**
		*设置音量
		*@param v
		*
		*/
		/**
		*获取音量
		*@return
		*
		*/
		__getset(0,__proto,'volume',function(){
			return this._volume;
			},function(v){
			if (this.isStopped){
				return;
			}
			this._volume=v;
			this.gain.gain.value=v;
		});

		return WebAudioSoundChannel;
	})(SoundChannel)


	/**
	*...
	*@author laya
	*/
	//class laya.resource.Bitmap extends laya.resource.Resource
	var Bitmap=(function(_super){
		function Bitmap(){
			//this._source=null;
			//this._w=NaN;
			//this._h=NaN;
			//this._id=0;
			Bitmap.__super.call(this);
			this._w=0;
			this._h=0;
			this._id=++Bitmap.__count;
		}

		__class(Bitmap,'laya.resource.Bitmap',_super);
		var __proto=Bitmap.prototype;
		/***复制资源,此方法为浅复制*/
		__proto.copyTo=function(dec){
			dec._source=this._source;
			dec._w=this._w;
			dec._h=this._h;
		}

		/**彻底清理资源*/
		__proto.dispose=function(){
			this._resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		/***
		*获取HTML Image或HTML Canvas或WebGL Texture
		*@return HTML Image或HTML Canvas或WebGL Texture
		*/
		__getset(0,__proto,'source',function(){
			return this._source;
		});

		/***
		*获取图片宽度
		*@return 图片宽度
		*/
		__getset(0,__proto,'width',function(){
			return this._w;
		});

		/***
		*获取图片高度
		*@return 图片高度
		*/
		__getset(0,__proto,'height',function(){
			return this._h;
		});

		Bitmap.__count=0;
		return Bitmap;
	})(Resource)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.resource.RenderTarget2D extends laya.resource.Texture
	var RenderTarget2D=(function(_super){
		function RenderTarget2D(width,height,mipMap,surfaceFormat,surfaceType,depthFormat){
			this._type=0;
			this._svWidth=NaN;
			this._svHeight=NaN;
			this._preRenderTarget=null;
			this._alreadyResolved=false;
			this._looked=false;
			this._surfaceFormat=0;
			this._surfaceType=0;
			this._depthFormat=0;
			this._mipMap=false;
			this._destroy=false;
			this._type=1;
			this._w=width;
			this._h=height;
			this._surfaceFormat=surfaceFormat;
			this._surfaceType=surfaceType;
			this._depthFormat=depthFormat;
			this._mipMap=mipMap;
			this._createWebGLRenderTarget();
			this.bitmap.lock=true;
			RenderTarget2D.__super.call(this,this.bitmap,Texture.INV_UV);
		}

		__class(RenderTarget2D,'laya.webgl.resource.RenderTarget2D',_super);
		var __proto=RenderTarget2D.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		//TODO:临时......................................................
		__proto.getType=function(){
			return this._type;
		}

		//*/
		__proto.getTexture=function(){
			return this;
		}

		__proto.size=function(w,h){
			if (this._w==w && this._h==h)
				return;
			this._w=w;
			this._h=h;
			this.release();
		}

		__proto.release=function(){
			this.destroy();
		}

		__proto.recycle=function(){
			RenderTarget2D.POOL.push(this);
		}

		__proto.start=function(){
			var gl=WebGL.mainContext;
			this._destroy && this._createWebGLRenderTarget();
			this._preRenderTarget=RenderState2D.curRenderTarget;
			RenderState2D.curRenderTarget=this;
			gl.bindFramebuffer(0x8D40,this.bitmap.frameBuffer);
			this._alreadyResolved=false;
			if (this._type==1){
				gl.viewport(0,0,this._w,this._h);
				this._svWidth=RenderState2D.width;
				this._svHeight=RenderState2D.height;
				RenderState2D.width=this._w;
				RenderState2D.height=this._h;
				Shader.activeShader=null;
			}
			return this;
		}

		__proto.clear=function(r,g,b,a){
			(r===void 0)&& (r=0.0);
			(g===void 0)&& (g=0.0);
			(b===void 0)&& (b=0.0);
			(a===void 0)&& (a=1.0);
			var gl=WebGL.mainContext;
			gl.clearColor(r,g,b,a);
			var clearFlag=0x00004000;
			(this._depthFormat)&& (clearFlag |=0x00000100);
			gl.clear(clearFlag);
		}

		__proto.end=function(){
			var gl=WebGL.mainContext;
			gl.bindFramebuffer(0x8D40,this._preRenderTarget?this._preRenderTarget.bitmap.frameBuffer:null);
			this._alreadyResolved=true;
			RenderState2D.curRenderTarget=this._preRenderTarget;
			if (this._type==1){
				gl.viewport(0,0,this._svWidth,this._svHeight);
				RenderState2D.width=this._svWidth;
				RenderState2D.height=this._svHeight;
				Shader.activeShader=null;
			}
			else gl.viewport(0,0,Laya.stage.width,Laya.stage.height);
		}

		__proto.getData=function(x,y,width,height){
			var gl=WebGL.mainContext;
			gl.bindFramebuffer(0x8D40,(this.bitmap).frameBuffer);
			var canRead=(gl.checkFramebufferStatus(0x8D40)===0x8CD5);
			if (!canRead){
				gl.bindFramebuffer(0x8D40,null);
				return null;
			};
			var pixels=new Uint8Array(this._w *this._h *4);
			gl.readPixels(x,y,width,height,this._surfaceFormat,this._surfaceType,pixels);
			gl.bindFramebuffer(0x8D40,null);
			return pixels;
		}

		/**彻底清理资源,注意会强制解锁清理*/
		__proto.destroy=function(){
			if (!this._destroy){
				this._loaded=false;
				this.bitmap.dispose();
				this.bitmap=null;
				this._destroy=true;
				_super.prototype.destroy.call(this);
			}
		}

		//待测试
		__proto.dispose=function(){}
		__proto._createWebGLRenderTarget=function(){
			this.bitmap=new WebGLRenderTarget(this.width,this.height,this.mipMap,this.surfaceFormat,this.surfaceType,this.depthFormat);
			this.bitmap.activeResource();
			this._alreadyResolved=true;
			this._destroy=false;
			this._loaded=true;
		}

		__getset(0,__proto,'surfaceFormat',function(){
			return this._surfaceFormat;
		});

		__getset(0,__proto,'surfaceType',function(){
			return this._surfaceType;
		});

		__getset(0,__proto,'depthFormat',function(){
			return this._depthFormat;
		});

		__getset(0,__proto,'mipMap',function(){
			return this._mipMap;
		});

		/**返回RenderTarget的Texture*/
		__getset(0,__proto,'source',function(){
			if (this._alreadyResolved)
				return _super.prototype._$get_source.call(this);
			throw new Error("RenderTarget  还未准备好！");
		});

		RenderTarget2D.create=function(w,h,type){
			(type===void 0)&& (type=1);
			var t=RenderTarget2D.POOL.pop();
			t || (t=new RenderTarget2D(w,h,false,0x1908,0x1401,0));
			t._w=w;t._h=h;
			return t;
		}

		RenderTarget2D.TYPE2D=1;
		RenderTarget2D.TYPE3D=2;
		RenderTarget2D.POOL=[];
		return RenderTarget2D;
	})(Texture)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.Buffer extends laya.resource.Resource
	var Buffer=(function(_super){
		function Buffer(glTarget,usage,frome,bufferUsage){
			this._length=0;
			this._upload=true;
			//this._id=0;
			//this._glTarget=null;
			//this._buffer=null;
			//this._glBuffer=null;
			//this._bufferUsage=0;
			//this._floatArray32=null;
			this._uploadSize=0;
			//this._usage=null;
			this._maxsize=0;
			//this._uint16=null;
			(bufferUsage===void 0)&& (bufferUsage=0x88E8);
			Buffer.__super.call(this);
			this.lock=true;
			Buffer._gl=WebGL.mainContext;
			this._$2__id=++Buffer._COUNT;
			this._usage=usage;
			glTarget==0x8893 && (glTarget=0x8893,this._usage="INDEX");
			glTarget==0x8892 && (glTarget=0x8892);
			this._glTarget=glTarget;
			this._bufferUsage=bufferUsage;
			this._buffer=new ArrayBuffer(8);
			frome && this.append(frome);
		}

		__class(Buffer,'laya.webgl.utils.Buffer',_super);
		var __proto=Buffer.prototype;
		__proto.getFloat32Array=function(){
			return this._floatArray32 || (this._floatArray32=new Float32Array(this._buffer));
		}

		__proto.getUint16Array=function(){
			return new Uint16Array(this._buffer);
		}

		__proto.clear=function(){
			this._length=0;
			this._upload=true;
		}

		__proto.append=function(data){
			this._upload=true;
			var szu8=0,n;
			if ((data instanceof Uint8Array)){
				szu8=data.length;
				this._resizeBuffer(this._length+szu8,true);
				n=new Uint8Array(this._buffer,this._length);
				}else if ((data instanceof Float32Array)){
				szu8=data.length *4;
				this._resizeBuffer(this._length+szu8,true);
				n=new Float32Array(this._buffer,this._length);
				}else if ((data instanceof Uint16Array)){
				szu8=data.length *2;
				this._resizeBuffer(this._length+szu8,true);
				n=new Uint16Array(this._buffer,this._length);
			}
			n.set(data,0);
			this._length+=szu8;
			this._floatArray32 && (this._floatArray32=new Float32Array(this._buffer));
		}

		__proto.setdata=function(data){
			this._buffer=data.buffer;
			this._upload=true;
			this._floatArray32 || (this._floatArray32=new Float32Array(this._buffer));
			this._length=this._buffer.byteLength;
		}

		__proto.getBuffer=function(){
			return this._buffer;
		}

		__proto.seLength=function(value){
			if (this._length===value)
				return;
			value <=this._buffer.byteLength || (this._resizeBuffer(value *2+256,true));
			this._length=value;
		}

		__proto._resizeBuffer=function(nsz,copy){
			if (nsz < this._buffer.byteLength)
				return this;
			this.memorySize=this._buffer.byteLength;
			if (copy && this._buffer && this._buffer.byteLength > 0){
				var newbuffer=new ArrayBuffer(nsz);
				var n=new Uint8Array(newbuffer);
				n.set(new Uint8Array(this._buffer),0);
				this._buffer=newbuffer;
			}else
			this._buffer=new ArrayBuffer(nsz);
			this._floatArray32 && (this._floatArray32=new Float32Array(this._buffer));
			this._upload=true;
			return this;
		}

		__proto.setNeedUpload=function(){
			this._upload=true;
		}

		__proto.getNeedUpload=function(){
			return this._upload;
		}

		__proto.bind=function(){
			this.activeResource();
			(Buffer._bindActive[this._glTarget]===this._glBuffer)|| (Buffer._gl.bindBuffer(this._glTarget,Buffer._bindActive[this._glTarget]=this._glBuffer),Shader.activeShader=null);
		}

		__proto.recreateResource=function(){
			this._glBuffer || (this._glBuffer=Buffer._gl.createBuffer());
			this._upload=true;
			this.memorySize=0;
			_super.prototype.recreateResource.call(this);
		}

		__proto.detoryResource=function(){
			if (this._glBuffer){
				var glBuffer=this._glBuffer;
				Laya.timer.callLater(null,function(){
					WebGL.mainContext.deleteBuffer(glBuffer);
				});
				this._glBuffer=null;
				this._upload=true;
				this._uploadSize=0;
				this.memorySize=0;
			}
		}

		//待调整
		__proto.upload=function(){
			if (!this._upload)
				return false;
			this._upload=false;
			this.bind();
			this._maxsize=Math.max(this._maxsize,this._length);
			if (Stat.loopCount % 30==0){
				if (this._buffer.byteLength > (this._maxsize+64)){
					this.memorySize=this._buffer.byteLength;
					this._buffer=this._buffer.slice(0,this._maxsize+64);
					this._floatArray32 && (this._floatArray32=new Float32Array(this._buffer));
				}
				this._maxsize=this._length;
			}
			if (this._uploadSize < this._buffer.byteLength){
				this._uploadSize=this._buffer.byteLength;
				Buffer._gl.bufferData(this._glTarget,this._uploadSize,this._bufferUsage);
				this.memorySize=this._uploadSize;
			}
			Buffer._gl.bufferSubData(this._glTarget,0,this._buffer);
			Stat.bufferLen+=this._length;
			return true;
		}

		__proto.subUpload=function(offset,dataStart,dataLength){
			(offset===void 0)&& (offset=0);
			(dataStart===void 0)&& (dataStart=0);
			(dataLength===void 0)&& (dataLength=0);
			if (!this._upload)
				return false;
			this._upload=false;
			this.bind();
			this._maxsize=Math.max(this._maxsize,this._length);
			if (Stat.loopCount % 30==0){
				if (this._buffer.byteLength > (this._maxsize+64)){
					this.memorySize=this._buffer.byteLength;
					this._buffer=this._buffer.slice(0,this._maxsize+64);
					this._floatArray32 && (this._floatArray32=new Float32Array(this._buffer));
				}
				this._maxsize=this._length;
			}
			if (this._uploadSize < this._buffer.byteLength){
				this._uploadSize=this._buffer.byteLength;
				Buffer._gl.bufferData(this._glTarget,this._uploadSize,this._bufferUsage);
				this.memorySize=this._uploadSize;
			}
			if (dataStart || dataLength){
				var subBuffer=this._buffer.slice(dataStart,dataLength);
				Buffer._gl.bufferSubData(this._glTarget,offset,subBuffer);
				}else {
				Buffer._gl.bufferSubData(this._glTarget,offset,this._buffer);
			}
			return true;
		}

		__proto.upload_bind=function(){
			(this._upload && this.upload())|| this.bind();
		}

		/**
		*释放CPU中的内存（upload()后确定不再使用时可使用）
		*/
		__proto.disposeCPUData=function(){
			this._buffer=null;
			this._floatArray32=null;
		}

		__proto.dispose=function(){
			this._resourceManager=null;
			_super.prototype.dispose.call(this);
		}

		__getset(0,__proto,'uintArray16',function(){
			this._uint16=new Uint16Array(this._buffer);
			return this._uint16;
		});

		/*调试用*/
		__getset(0,__proto,'bufferLength',function(){
			return this._buffer.byteLength;
		});

		__getset(0,__proto,'length',function(){
			return this._length;
			},function(value){
			if (this._length===value)
				return;
			value <=this._buffer.byteLength || (this._resizeBuffer(value *2+256,true));
			this._length=value;
		});

		__getset(0,__proto,'usage',function(){
			return this._usage;
		});

		Buffer.__int__=function(gl){
			Buffer._gl=gl;
			Buffer.QuadrangleIB=new Buffer(0x8893,"INDEX",null,0x88E4);
			GlUtils.fillIBQuadrangle(Buffer.QuadrangleIB,16);
		}

		Buffer.INDEX="INDEX";
		Buffer.POSITION0="POSITION";
		Buffer.NORMAL0="NORMAL";
		Buffer.COLOR0="COLOR";
		Buffer.UV0="UV";
		Buffer.NEXTUV0="NEXTUV";
		Buffer.UV1="UV1";
		Buffer.NEXTUV1="NEXTUV1";
		Buffer.BLENDWEIGHT0="BLENDWEIGHT";
		Buffer.BLENDINDICES0="BLENDINDICES";
		Buffer.MATRIX0="MATRIX0";
		Buffer.MATRIX1="MATRIX1";
		Buffer.MATRIX2="MATRIX2";
		Buffer.DIFFUSETEXTURE="DIFFUSETEXTURE";
		Buffer.NORMALTEXTURE="NORMALTEXTURE";
		Buffer.SPECULARTEXTURE="SPECULARTEXTURE";
		Buffer.EMISSIVETEXTURE="EMISSIVETEXTURE";
		Buffer.AMBIENTTEXTURE="AMBIENTTEXTURE";
		Buffer.REFLECTTEXTURE="REFLECTTEXTURE";
		Buffer.MATRIXARRAY0="MATRIXARRAY0";
		Buffer.FLOAT0="FLOAT0";
		Buffer.UVAGEX="UVAGEX";
		Buffer.CAMERAPOS="CAMERAPOS";
		Buffer.LUMINANCE="LUMINANCE";
		Buffer.ALPHATESTVALUE="ALPHATESTVALUE";
		Buffer.FOGCOLOR="FOGCOLOR";
		Buffer.FOGSTART="FOGSTART";
		Buffer.FOGRANGE="FOGRANGE";
		Buffer.MATERIALAMBIENT="MATERIALAMBIENT";
		Buffer.MATERIALDIFFUSE="MATERIALDIFFUSE";
		Buffer.MATERIALSPECULAR="MATERIALSPECULAR";
		Buffer.LIGHTDIRECTION="LIGHTDIRECTION";
		Buffer.LIGHTDIRDIFFUSE="LIGHTDIRDIFFUSE";
		Buffer.LIGHTDIRAMBIENT="LIGHTDIRAMBIENT";
		Buffer.LIGHTDIRSPECULAR="LIGHTDIRSPECULAR";
		Buffer.POINTLIGHTPOS="POINTLIGHTPOS";
		Buffer.POINTLIGHTRANGE="POINTLIGHTRANGE";
		Buffer.POINTLIGHTATTENUATION="POINTLIGHTATTENUATION";
		Buffer.POINTLIGHTDIFFUSE="POINTLIGHTDIFFUSE";
		Buffer.POINTLIGHTAMBIENT="POINTLIGHTAMBIENT";
		Buffer.POINTLIGHTSPECULAR="POINTLIGHTSPECULAR";
		Buffer.SPOTLIGHTPOS="SPOTLIGHTPOS";
		Buffer.SPOTLIGHTDIRECTION="SPOTLIGHTDIRECTION";
		Buffer.SPOTLIGHTSPOT="SPOTLIGHTSPOT";
		Buffer.SPOTLIGHTRANGE="SPOTLIGHTRANGE";
		Buffer.SPOTLIGHTATTENUATION="SPOTLIGHTATTENUATION";
		Buffer.SPOTLIGHTDIFFUSE="SPOTLIGHTDIFFUSE";
		Buffer.SPOTLIGHTAMBIENT="SPOTLIGHTAMBIENT";
		Buffer.SPOTLIGHTSPECULAR="SPOTLIGHTSPECULAR";
		Buffer.CORNERTEXTURECOORDINATE="CORNERTEXTURECOORDINATE";
		Buffer.VELOCITY="VELOCITY";
		Buffer.SIZEROTATION="SIZEROTATION";
		Buffer.RADIUSRADIAN="RADIUSRADIAN";
		Buffer.AGEADDSCALE="AGEADDSCALE";
		Buffer.TIME="TIME";
		Buffer.VIEWPORTSCALE="VIEWPORTSCALE";
		Buffer.CURRENTTIME="CURRENTTIME";
		Buffer.DURATION="DURATION";
		Buffer.GRAVITY="GRAVITY";
		Buffer.ENDVELOCITY="ENDVELOCITY";
		Buffer.FLOAT32=4;
		Buffer.SHORT=2;
		Buffer.QuadrangleIB=null
		Buffer._gl=null
		Buffer._bindActive=[];
		Buffer._COUNT=1;
		return Buffer;
	})(Resource)


	//class laya.webgl.shader.d2.value.Color2dSV extends laya.webgl.shader.d2.value.Value2D
	var Color2dSV=(function(_super){
		function Color2dSV(){
			Color2dSV.__super.call(this,0x02,0);
			this.color=[];
		}

		__class(Color2dSV,'laya.webgl.shader.d2.value.Color2dSV',_super);
		var __proto=Color2dSV.prototype;
		__proto.setValue=function(value){
			value.fillStyle&&(this.color=value.fillStyle._color._color);
			value.strokeStyle&&(this.color=value.strokeStyle._color._color);
		}

		return Color2dSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.TextureSV extends laya.webgl.shader.d2.value.Value2D
	var TextureSV=(function(_super){
		function TextureSV(subID){
			this.u_colorMatrix=null;
			this.texcoord=Value2D._TEXCOORD;
			(subID===void 0)&& (subID=0);
			TextureSV.__super.call(this,0x01,subID);
		}

		__class(TextureSV,'laya.webgl.shader.d2.value.TextureSV',_super);
		var __proto=TextureSV.prototype;
		__proto.setValue=function(vo){
			this.ALPHA=vo.ALPHA;
			vo.filters && this.setFilters(vo.filters);
		}

		__proto.clear=function(){
			this.texture=null;
			this.shader=null;
			this.defines.setValue(0);
		}

		return TextureSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.PrimitiveSV extends laya.webgl.shader.d2.value.Value2D
	var PrimitiveSV=(function(_super){
		function PrimitiveSV(){
			this.a_color=null;
			PrimitiveSV.__super.call(this,0x04,0);
			this.position=[2,0x1406,false,5 *CONST3D2D.BYTES_PE,0];
			this.a_color=[3,0x1406,false,5 *CONST3D2D.BYTES_PE,2*4];
		}

		__class(PrimitiveSV,'laya.webgl.shader.d2.value.PrimitiveSV',_super);
		return PrimitiveSV;
	})(Value2D)


	/**
	*<p> <code>Animation</code> 类是位图动画,用于创建位图动画。</p>
	*<p> <code>Animation</code> 类可以加载并显示一组位图图片，并组成动画进行播放。</p>
	*
	*@example 以下示例代码，创建了一个 <code>Text</code> 实例。
	*<p>[EXAMPLE-AS-BEGIN]</p>
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Animation;
		*import laya.net.Loader;
		*import laya.utils.Handler;
		*
		*public class Animation_Example
		*{
			*public function Animation_Example()
			*{
				*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
				*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
				*Laya.loader.load("resource/ani/fighter.json",Handler.create(this,onLoadComplete),null,Loader.ATLAS);
				*}
			*
			*private function onLoadComplete():void
			*{
				*var animation:Animation=Animation.fromUrl("resource/ani/fighter/rollSequence{0000}.png",30);//创建一个 Animation 类的实例对象 animation 。
				*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
				*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
				*animation.interval=30;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
				*animation.play();//播放动画。
				*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*Animation_Example();
	*function Animation_Example(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ani/fighter.json",laya.utils.Handler.create(this,onLoadComplete),null,laya.net.Loader.ATLAS);
		*}
	*function onLoadComplete()
	*{
		*var animation=laya.display.Animation.fromUrl("resource/ani/fighter/rollSequence{0000}.png",30);//创建一个 Animation 类的实例对象 animation 。
		*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
		*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
		*animation.interval=30;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
		*animation.play();//播放动画。
		*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
		*}
	*</listing>
	*<listing version="3.0">
	*import Loader=laya.net.Loader;
	*import Handler=laya.utils.Handler;
	*class Animation_Example {
		*constructor(){
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ani/fighter.json",Handler.create(this,this.onLoadComplete),null,Loader.ATLAS);
			*}
		*
		*private onLoadComplete():void {
			*var animation:Animation=Animation.fromUrl("resource/ani/fighter/rollSequence{0000}.png",30);//创建一个 Animation 类的实例对象 animation 。
			*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
			*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
			*animation.interval=30;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
			*animation.play();//播放动画。
			*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
			*}
		*}
	*</listing>
	*
	*/
	//class laya.display.Animation extends laya.display.Sprite
	var Animation=(function(_super){
		function Animation(){
			this.interval=30;
			this._clips=null;
			this._index=0;
			this._count=0;
			this._isPlaying=false;
			Animation.__super.call(this);
			this.on("display",this,this._$3__onDisplay);
			this.on("undisplay",this,this._$3__onDisplay);
		}

		__class(Animation,'laya.display.Animation',_super);
		var __proto=Animation.prototype;
		/**
		*@inheritDoc
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._clips=null;
		}

		__proto._$3__onDisplay=function(){
			if (this._isPlaying){
				if (this._displayInStage)this.play();
				else this.clearTimer(this,this._loop);
			}
		}

		/**
		*初始化。
		*@param graphics graphics集合
		*/
		__proto.setGraphics=function(graphics){
			this._clips=graphics;
			this._count=graphics.length;
			this._renderType |=0x100;
			this._renderType &=~0x01;
		}

		/**
		*播放动画。
		*/
		__proto.play=function(){
			if (this._clips && this._clips.length > 0 && this.interval > 0){
				this._isPlaying=true;
				this.timerLoop(this.interval,this,this._loop,null,true);
			}
		}

		__proto._loop=function(){
			if (this._style.visible){
				this.index=this._index,this._index++;
				this._index >=this._count && (this._index=0,this.event("complete"));
			}
		}

		/**
		*停止播放。
		*/
		__proto.stop=function(){
			this._isPlaying=false;
			this.clearTimer(this,this._loop);
		}

		__proto.clear=function(){
			this.stop();
			this.graphics=null;
			this.graphics=null;
		}

		/**
		*加载图片集合，组成动画。
		*@param urls 图片地址集合
		*/
		__proto.loadImages=function(urls){
			var arr=[];
			for (var i=0,n=urls.length;i < n;i++){
				var g=new Graphics();
				g.loadImage(urls[i],0,0);
				arr.push(g);
			}
			this.setGraphics(arr);
			return this;
		}

		/**当前播放索引。*/
		__getset(0,__proto,'index',function(){
			return this._index;
			},function(value){
			this._index=value;
			this.graphics=this._clips[value];
		});

		/**动画长度。*/
		__getset(0,__proto,'count',function(){
			return this._count;
		});

		Animation.fromUrl=function(url,count){
			var result=Animation._urlReg.exec(url);
			var base=result[1];
			var serialNum=result[2];
			var extension=result[3];
			var serialNumBegin=Laya.__parseInt(serialNum);
			var serialNumLength=serialNum.length;
			var urls=[];
			for (var i=0;i < count;i++){
				var countNow=serialNumBegin+i;
				var countString=Utils1.preFixNumber(countNow,serialNumLength);
				urls.push(base+countString+extension);
			}
			return new Animation().loadImages(urls);
		}

		__static(Animation,
		['_urlReg',function(){return this._urlReg=/^(.*?)\{(.*?)\}(.*)$/;}
		]);
		return Animation;
	})(Sprite)


	/**
	*<p> <code>Text</code> 类用于创建显示对象以显示文本。</p>
	*@example 以下示例代码，创建了一个 <code>Text</code> 实例。
	*<p>[EXAMPLE-AS-BEGIN]</p>
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Text;
		*
		*public class Text_Example
		*{
			*public function Text_Example()
			*{
				*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
				*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
				*onInit();
				*}
			*
			*private function onInit():void
			*{
				*var text:Text=new Text();//创建一个 Text 类的实例对象 text 。
				*text.text="这个是一个 Text 文本示例。";
				*text.color="#008fff";//设置 text 的文本颜色。
				*text.font="Arial";//设置 text 的文本字体。
				*text.bold=true;//设置 text 的文本显示为粗体。
				*text.fontSize=30;//设置 text 的字体大小。
				*text.wordWrap=true;//设置 text 的文本自动换行。
				*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
				*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
				*text.width=300;//设置 text 的宽度。
				*text.height=200;//设置 text 的高度。
				*text.italic=true;//设置 text 的文本显示为斜体。
				*text.borderColor="#fff000";//设置 text 的文本边框颜色。
				*Laya.stage.addChild(text);//将 text 添加到显示列表。
				*}
			*}
		*}
	*</listing>
	*<p>[EXAMPLE-AS-END]</p>
	*<listing version="3.0">
	*Text_Example();
	*function Text_Example()
	*{
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*onInit();
		*}
	*function onInit()
	*{
		*var text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
		*text.text="这个是一个 Text 文本示例。";
		*text.color="#008fff";//设置 text 的文本颜色。
		*text.font="Arial";//设置 text 的文本字体。
		*text.bold=true;//设置 text 的文本显示为粗体。
		*text.fontSize=30;//设置 text 的字体大小。
		*text.wordWrap=true;//设置 text 的文本自动换行。
		*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
		*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
		*text.width=300;//设置 text 的宽度。
		*text.height=200;//设置 text 的高度。
		*text.italic=true;//设置 text 的文本显示为斜体。
		*text.borderColor="#fff000";//设置 text 的文本边框颜色。
		*Laya.stage.addChild(text);//将 text 添加到显示列表。
		*}
	*</listing>
	*<listing version="3.0">
	*class Text_Example {
		*constructor(){
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*this.onInit();
			*}
		*private onInit():void {
			*var text:laya.display.Text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
			*text.text="这个是一个 Text 文本示例。";
			*text.color="#008fff";//设置 text 的文本颜色。
			*text.font="Arial";//设置 text 的文本字体。
			*text.bold=true;//设置 text 的文本显示为粗体。
			*text.fontSize=30;//设置 text 的字体大小。
			*text.wordWrap=true;//设置 text 的文本自动换行。
			*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
			*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
			*text.width=300;//设置 text 的宽度。
			*text.height=200;//设置 text 的高度。
			*text.italic=true;//设置 text 的文本显示为斜体。
			*text.borderColor="#fff000";//设置 text 的文本边框颜色。
			*Laya.stage.addChild(text);//将 text 添加到显示列表。
			*}
		*}
	*</listing>
	*@author yung
	*/
	//class laya.display.Text extends laya.display.Sprite
	var Text=(function(_super){
		function Text(){
			this._text=null;
			this._isChanged=false;
			this._textWidth=0;
			this._textHeight=0;
			this._lines=[];
			this._startX=NaN;
			this._startY=NaN;
			this._lastVisibleLineIndex=-1;
			this._clipPoint=null;
			this._currBitmapFont=null;
			Text.__super.call(this);
			this._style=new CSSStyle(this);
			(this._style).wordWrap=false;
		}

		__class(Text,'laya.display.Text',_super);
		var __proto=Text.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._lines=null;
		}

		/**
		*@private
		*@inheritDoc
		*
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec._getBoundPoints();
		}

		/**@inheritDoc */
		__proto.getGraphicBounds=function(){
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec;
		}

		/**
		*@private
		*@inheritDoc
		**/
		__proto._getCSSStyle=function(){
			return this._style;
		}

		/**
		*设置语言包
		*@param text 文本，可以增加参数，比如"abc{0}efg{1}ijk,123{2}"
		*@param ...args 文本参数，比如"d","h",4
		*/
		__proto.lang=function(text,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10){
			if (arguments.length < 2){
				this._text=Text.langPacks ? Text.langPacks[text] :text;
				}else {
				for (var i=0,n=arguments.length;i < n;i++){
					text=text.replace("{"+i+"}",arguments[i+1]);
				}
				this._text=text;
			}
		}

		/**
		*渲染文字
		*@param begin 从begin行开始
		*@param visibleLineCount 渲染visibleLineCount行
		*/
		__proto.renderTextAndBg=function(begin,visibleLineCount){
			var graphics=this.graphics;
			graphics.clear();
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.ctx.font=ctxFont;
			var padding=this.padding;
			var startX=padding[3];
			var textAlgin="left";
			var lines=this._lines;
			var lineHeight=this.leading+this.fontSize;
			var tCurrBitmapFont=this._currBitmapFont;
			if (tCurrBitmapFont){
				lineHeight=this.leading+tCurrBitmapFont.getWordHeight();
			};
			var startY=padding[0];
			if ((!tCurrBitmapFont)&& this._width > 0 && this._textWidth <=this._width){
				if (this.align=="right"){
					textAlgin="right";
					startX=this._width-padding[1];
					}else if (this.align=="center"){
					textAlgin="center";
					startX=this._width *0.5+padding[3]-padding[1];
				}
			}
			if (this._height > 0){
				var tempVAlign=(this._textHeight > this._height)? "top" :this.valign;
				if (tempVAlign==="middle")startY=(this._height-visibleLineCount *lineHeight)*0.5+padding[0]-padding[2];
				else if (tempVAlign==="bottom")startY=this._height-visibleLineCount *lineHeight-padding[2];
			};
			var style=this._style;
			if (tCurrBitmapFont && tCurrBitmapFont.useFontScaleKey){
				var bitmapScale=tCurrBitmapFont.fontSize / this.fontSize;
			}
			if (this._clipPoint){
				graphics.save();
				if (tCurrBitmapFont && tCurrBitmapFont.useFontScaleKey){
					var tClipWidth=0;
					var tClipHeight=0;
					this._width ? tClipWidth=(this._width-padding[3]-padding[1]):tClipWidth=this._textWidth;
					this._height ? tClipHeight=(this._height-padding[0]-padding[2]):tClipHeight=this._textHeight;
					tClipWidth *=bitmapScale;
					tClipHeight *=bitmapScale;
					graphics.clipRect(padding[3],padding[0],tClipWidth,tClipHeight);
					}else {
					graphics.clipRect(padding[3],padding[0],this._width ? (this._width-padding[3]-padding[1]):this._textWidth,this._height ? (this._height-padding[0]-padding[2]):this._textHeight);
				}
			};
			var x=0,y=0;
			var end=Math.min(this._lines.length,visibleLineCount+begin)|| 1;
			for (var i=begin;i < end;i++){
				var word=lines[i];
				if (style.password){
					var len=word.length;
					word="";
					for (var j=len;j > 0;j--){
						word+="·";
					}
				}
				x=startX-(this._clipPoint ? this._clipPoint.x :0);
				y=startY+lineHeight *i-(this._clipPoint ? this._clipPoint.y :0);
				if (tCurrBitmapFont){
					var tWidth=this.width;
					if (tCurrBitmapFont.useFontScaleKey){
						tWidth=this.width *bitmapScale;;
					}
					tCurrBitmapFont.drawWords(word,this,x,y,this.align,tWidth);
					}else {
					style.stroke ? graphics.fillBorderText(word,x,y,ctxFont,this.color,style.strokeColor,style.stroke,textAlgin):graphics.fillText(word,x,y,ctxFont,this.color,textAlgin);
				}
			}
			if (tCurrBitmapFont && tCurrBitmapFont.useFontScaleKey){
				var tScale=1/bitmapScale;
				this.scale(tScale,tScale);
			}
			if (this._clipPoint)
				graphics.restore();
			this._startX=startX;
			this._startY=startY;
		}

		/**
		*<p>排版文本。</p>
		*<p>进行宽高计算，渲染、重绘文本。</p>
		*/
		__proto.typeset=function(){
			this._isChanged=false;
			if (!this._text){
				this._clipPoint=null;
				this._textWidth=this._textHeight=0;
				this.graphics.clear();
				return;
			}
			Browser.ctx.font=this._getCSSStyle().font;
			this._lines=this.parseWordWrap(this._text);
			this._textWidth=0;
			for (var n=0,len=this._lines.length;n < len;++n){
				var word=this._lines[n];
				if (this._currBitmapFont){
					this._textWidth=Math.max(this._currBitmapFont.getWordsWidth(word)+this.padding[3]+this.padding[1],this._textWidth);
					}else {
					this._textWidth=Math.max(Browser.ctx.measureText(word).width+this.padding[3]+this.padding[1],this._textWidth);
				}
			}
			if (this._currBitmapFont){
				this._textHeight=this._lines.length *(this._currBitmapFont.getWordHeight()+this.leading)+this.padding[0]+this.padding[2];
			}else this._textHeight=this._lines.length *(this.fontSize+this.leading)+this.padding[0]+this.padding[2];
			if (this.checkEnabledViewportOrNot())
				this._clipPoint || (this._clipPoint=new Point(0,0));
			else this._clipPoint=null;
			this.renderTextAndBg(0,Math.min(this._lines.length,Math.ceil((this.height-this.padding[0]-this.padding[2])/ (this.leading+this.fontSize))));
			this.repaint();
		}

		__proto.checkEnabledViewportOrNot=function(){
			return (this._width > 0 && this._textWidth > this._width)|| (this._height > 0 && this._textHeight > this._height);
		}

		/**
		*快速更改显示文本。不进行排版计算，效率较高。
		*
		*<p>如果只更改文字内容，不更改文字样式，建议使用此接口，能提高效率。</p>
		*@param text 文本内容。
		*
		*/
		__proto.changeText=function(text){
			if (this._text!==text){
				this.lang(text);
				if (this._graphics && this._graphics.replaceText(text)){
					}else {
					this.typeset();
				}
			}
		}

		/**
		*@private
		*分析文本换行。
		*/
		__proto.parseWordWrap=function(text){
			var lines=text.split(/\r|\n|\\n/);
			for (var i=0,n=lines.length;i < n-1;i++)
			lines[i]+="\n";
			var width=this._width;
			if (this._currBitmapFont && this._currBitmapFont.useFontScaleKey){
				width=this._width *(this._currBitmapFont.fontSize / this.fontSize);
			};
			var ctx=Browser.ctx;
			var wordWrap=this.wordWrap;
			if (wordWrap && width <=0)width=100;
			if (width <=0 || !wordWrap)
				return lines;
			this._lines.length=0;
			var padding=this.padding;
			var result=this._lines;
			var wordWrapWidth=width-padding[3]-padding[1];
			var maybeIndex=0;
			var execResult;
			var tCurrBitmapFont=this._currBitmapFont;
			var tWidth=0;
			for (i=0,n=lines.length;i < n;i++){
				var word=lines[i];
				var wordWidth=0;
				var startIndex=0;
				tCurrBitmapFont ? tWidth=tCurrBitmapFont.getWordsWidth(word):tWidth=ctx.measureText(word).width;
				if (tWidth <=wordWrapWidth){
					result.push(word);
					continue ;
				}
				tCurrBitmapFont ? tWidth=tCurrBitmapFont.getWordMaxWidth():tWidth=ctx.measureText("阳").width;
				maybeIndex || (maybeIndex=Math.floor(wordWrapWidth / tWidth));
				(maybeIndex==0)&& (maybeIndex=1);
				tCurrBitmapFont ? tWidth=this._currBitmapFont.getWordsWidth(word.substring(0,maybeIndex)):tWidth=ctx.measureText(word.substring(0,maybeIndex)).width;
				wordWidth=tWidth;
				for (var j=maybeIndex,m=word.length;j < m;j++){
					tCurrBitmapFont ? tWidth=this._currBitmapFont.getWordWidth(word.charAt(j)):tWidth=ctx.measureText(word.charAt(j)).width;
					wordWidth+=tWidth;
					if (wordWidth > wordWrapWidth){
						var lineString=word.substring(startIndex,j);
						execResult=/\b\w+$/.exec(lineString);
						if (execResult){
							j=execResult.index+startIndex;
							if (execResult.index==0)j+=lineString.length;
							else lineString=word.substring(startIndex,j);
						}
						result.push(lineString);
						startIndex=j;
						if (j+maybeIndex < m){
							j+=maybeIndex;
							tCurrBitmapFont ? tWidth=this._currBitmapFont.getWordsWidth(word.substring(startIndex,j)):tWidth=ctx.measureText(word.substring(startIndex,j)).width;
							wordWidth=tWidth;
							j--;
							}else {
							result.push(word.substring(startIndex,m));
							startIndex=-1;
							break ;
						}
					}
				}
				if (startIndex !=-1)result.push(word.substring(startIndex,m));
			}
			return result;
		}

		/**
		*返回字符的位置信息。
		*@param charIndex 索引位置
		*@param out 输出的Point引用
		*@return 返回Point位置信息
		*/
		__proto.getCharPoint=function(charIndex,out){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			var len=0,lines=this._lines,startIndex=0;
			for (var i=0,n=lines.length;i < n;i++){
				len+=lines[i].length;
				if (charIndex < len){
					var line=i;
					break ;
				}
				startIndex=len;
			};
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.ctx.font=ctxFont;
			var width=Browser.ctx.measureText(this._text.substring(startIndex,charIndex)).width;
			var point=out || new Point();
			return point.setTo(this._startX+width-(this._clipPoint ? this._clipPoint.x :0),this._startY+line *(this.fontSize+this.leading)-(this._clipPoint ? this._clipPoint.y :0));
		}

		/**
		*表示文本的高度，以像素为单位。
		*@return
		*
		*/
		__getset(0,__proto,'textHeight',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textHeight;
		});

		/**
		*@inheritDoc
		*@return
		*
		*/
		__getset(0,__proto,'width',function(){
			if (this._width)return this._width;
			return this.textWidth;
			},function(value){
			_super.prototype._$set_width.call(this,value);
			this.isChanged=true;
		});

		/**
		*文本的字体名称，以字符串形式表示。
		*
		*<p>默认值为："Arial"，可以通过Text.defaultFont设置默认字体。</p>
		*
		*@see Text.defaultFont
		*@return
		*
		*/
		__getset(0,__proto,'font',function(){
			return this._getCSSStyle().fontFamily;
			},function(value){
			if (this._currBitmapFont){
				this._currBitmapFont=null;
				this.scale(1,1);
			}
			if (Text.BITMAPFONTS && Text.BITMAPFONTS[value]){
				this._currBitmapFont=Text.BITMAPFONTS[value];
			}
			this._getCSSStyle().fontFamily=value;
			this.isChanged=true;
		});

		/**
		*@inheritDoc
		*@return
		*
		*/
		__getset(0,__proto,'height',function(){
			if (this._height)return this._height;
			return this.textHeight;
			},function(value){
			_super.prototype._$set_height.call(this,value);
			this.isChanged=true;
		});

		/**
		*垂直行间距（以像素为单位）。
		*@return
		*
		*/
		__getset(0,__proto,'leading',function(){
			return this._getCSSStyle().leading;
			},function(value){
			this._getCSSStyle().leading=value;
			this.isChanged=true;
		});

		/**当前文本的内容字符串。*/
		__getset(0,__proto,'text',function(){
			return this._text;
			},function(value){
			if (this._text!==value){
				this.lang(value+"");
				this.isChanged=true;
				this.event("change");
			}
		});

		/**
		*表示文本的宽度，以像素为单位。
		*@return
		*
		*/
		__getset(0,__proto,'textWidth',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textWidth;
		});

		/**
		*指定文本的字体大小（以像素为单位）。
		*
		*<p>默认为20像素，可以通过 <code>Text.defaultSize</code> 设置默认大小。</p>
		*@return
		*
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._getCSSStyle().fontSize;
			},function(value){
			this._getCSSStyle().fontSize=value;
			this.isChanged=true;
		});

		/**
		*指定文本是否为粗体字。
		*
		*<p>默认值为 false，这意味着不使用粗体字。如果值为 true，则文本为粗体字。</p>
		*
		*@return
		*
		*/
		__getset(0,__proto,'bold',function(){
			return this._getCSSStyle().bold;
			},function(value){
			this._getCSSStyle().bold=value;
			this.isChanged=true;
		});

		/**
		*表示文本的颜色值。可以通过 <code>Text.defaultColor</code> 设置默认颜色。
		*<p>默认值为黑色。</p>
		*@return
		*
		*/
		__getset(0,__proto,'color',function(){
			return this._getCSSStyle().color;
			},function(value){
			this._getCSSStyle().color=value;
			if (!this._isChanged && this._graphics){
				this._graphics.replaceTextColor(this.color)
				}else {
				this.isChanged=true;
			}
		});

		/**
		*<p>描边颜色，以字符串表示。</p>
		*默认值为 "#000000"（黑色）;
		*@return
		*
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._getCSSStyle().strokeColor;
			},function(value){
			this._getCSSStyle().strokeColor=value;
			this.isChanged=true;
		});

		/**
		*表示使用此文本格式的文本是否为斜体。
		*
		*<p>默认值为 false，这意味着不使用斜体。如果值为 true，则文本为斜体。</p>
		*@return
		*
		*/
		__getset(0,__proto,'italic',function(){
			return this._getCSSStyle().italic;
			},function(value){
			this._getCSSStyle().italic=value;
			this.isChanged=true;
		});

		/**
		*表示文本的水平显示方式。
		*
		*<p><b>取值：</b>
		*<li>"left"： 居左对齐显示。</li>
		*<li>"center"： 居中对齐显示。</li>
		*<li>"right"： 居右对齐显示。</li>
		*</p>
		*@return
		*
		*/
		__getset(0,__proto,'align',function(){
			return this._getCSSStyle().align;
			},function(value){
			this._getCSSStyle().align=value;
			this.isChanged=true;
		});

		/**
		*表示文本的垂直显示方式。
		*
		*<p><b>取值：</b>
		*<li>"top"： 居顶部对齐显示。</li>
		*<li>"middle"： 居中对齐显示。</li>
		*<li>"bottom"： 居底部对齐显示。</li>
		*</p>
		*@return
		*
		*/
		__getset(0,__proto,'valign',function(){
			return this._getCSSStyle().valign;
			},function(value){
			this._getCSSStyle().valign=value;
			this.isChanged=true;
		});

		/**
		*表示文本是否自动换行，默认为false。
		*
		*<p>若值为true，则自动换行；否则不自动换行。</p>
		*@return
		*
		*/
		__getset(0,__proto,'wordWrap',function(){
			return this._getCSSStyle().wordWrap;
			},function(value){
			this._getCSSStyle().wordWrap=value;
			this.isChanged=true;
		});

		/**
		*边距信息。
		*
		*<p>[上边距，右边距，下边距，左边距]（边距以像素为单位）。</p>
		*@return
		*
		*/
		__getset(0,__proto,'padding',function(){
			return this._getCSSStyle().padding;
			},function(value){
			this._getCSSStyle().padding=value;
			this.isChanged=true;
		});

		/**
		*文本背景颜色，以字符串表示。
		*@return
		*
		*/
		__getset(0,__proto,'bgColor',function(){
			return this._getCSSStyle().backgroundColor;
			},function(value){
			this._getCSSStyle().backgroundColor=value;
			this.isChanged=true;
		});

		/**
		*文本边框背景颜色，以字符串表示。
		*@return
		*
		*/
		__getset(0,__proto,'borderColor',function(){
			return this._getCSSStyle().borderColor;
			},function(value){
			this._getCSSStyle().borderColor=value;
			this.isChanged=true;
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*@return
		*
		*/
		__getset(0,__proto,'stroke',function(){
			return this._getCSSStyle().stroke;
			},function(value){
			this._getCSSStyle().stroke=value;
			this.isChanged=true;
		});

		/**
		*<p>指定文本字段是否是密码文本字段。</p>
		*<p>如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。</p>
		*<p>默认值为false。</p>
		*@return
		*
		*/
		__getset(0,__proto,'asPassword',function(){
			return this._getCSSStyle().password;
			},function(value){
			this._getCSSStyle().password=value;
			this.isChanged=true;
		});

		/**
		*一个布尔值，表示文本的属性是否有改变。
		*@param value 是否有改变。若为true表示有改变。
		*
		*/
		__getset(0,__proto,'isChanged',null,function(value){
			if (this._isChanged!==value){
				this._isChanged=value;
				value && Laya.timer.callLater(this,this.typeset);
			}
		});

		/**
		*设置横向滚动量。
		*<p>即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。</p>
		*/
		/**
		*获取横向滚动量。
		*/
		__getset(0,__proto,'scrollX',function(){
			if (!this._clipPoint)return 0;
			return this._clipPoint.x;
			},function(value){
			if (this.textWidth < this._width || !this._clipPoint)return;
			value=value < this.padding[3] ? this.padding[3] :value;
			var maxScrollX=this._textWidth-this._width;
			value=value > maxScrollX ? maxScrollX :value;
			var visibleLineCount=this._height / (this.fontSize+this.leading)| 0+1;
			this._clipPoint.x=value;
			this.renderTextAndBg(this._lastVisibleLineIndex,visibleLineCount);
		});

		/**
		*设置纵向滚动量（px)。即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。
		*/
		/**
		*获取纵向滚动量。
		*/
		__getset(0,__proto,'scrollY',function(){
			if (!this._clipPoint)return 0;
			return this._clipPoint.y;
			},function(value){
			if (this.textHeight < this._height || !this._clipPoint)return;
			value=value < this.padding[0] ? this.padding[0] :value;
			var maxScrollY=this._textHeight-this._height;
			value=value > maxScrollY ? maxScrollY :value;
			var startLine=value / (this.fontSize+this.leading)| 0;
			this._lastVisibleLineIndex=startLine;
			var visibleLineCount=(this._height / (this.fontSize+this.leading)| 0)+1;
			this._clipPoint.y=value;
			this.renderTextAndBg(startLine,visibleLineCount);
		});

		/**
		*获取横向可滚动最大值。
		*/
		__getset(0,__proto,'maxScrollX',function(){
			return (this.textWidth < this._width)? 0 :this._textWidth-this._width;
		});

		/**
		*获取纵向可滚动最大值。
		*/
		__getset(0,__proto,'maxScrollY',function(){
			return (this.textHeight < this._height)? 0 :this._textHeight-this._height;
		});

		Text.registerBitmapFont=function(name,bitmapFont){
			if (Text.BITMAPFONTS==null){
				Text.BITMAPFONTS={};
			}
			Text.BITMAPFONTS[name]=bitmapFont;
		}

		Text.unregisterBitmapFont=function(name,destory){
			(destory===void 0)&& (destory=true);
			if (Text.BITMAPFONTS && Text.BITMAPFONTS[name]){
				var tBitmapFont=Text.BITMAPFONTS[name];
				if (destory){
					tBitmapFont.destory();
				}
				delete Text.BITMAPFONTS[name]
			}
		}

		Text.langPacks=null
		Text.BITMAPFONTS=null
		return Text;
	})(Sprite)


	/**
	*<p> <code>Stage</code> 类是显示对象的根节点。</p>
	*可以通过Laya.stage访问。
	*/
	//class laya.display.Stage extends laya.display.Sprite
	var Stage=(function(_super){
		function Stage(){
			this.focus=null;
			this.frameRate="fast";
			this.canvasRotation=false;
			this._screenMode="none";
			this._scaleMode="noscale";
			this._sizeMode="none";
			this._alignV="top";
			this._alignH="left";
			this._bgColor="black";
			this._useHDRendering=true;
			this._mouseMoveTime=0;
			this._oldSize=null;
			this._renderCount=0;
			Stage.__super.call(this);
			this.offset=new Point();
			this.now=Browser.now();
			this._canvasTransform=new Matrix();
			this._preLoopTime=Browser.now();
			var _$this=this;
			this.mouseEnabled=true;
			this._displayInStage=true;
			var _this=this;
			var window=Browser.window;
			window.addEventListener("resize",function(){
				if (!Input.isInputting){
					_$this.resetCanvas();
					Laya.timer.once(100,_this,_this._changeCanvasSize,null,true);
				}
			})
			window.addEventListener("focus",function(){
				_this.event("focus");
			})
			window.addEventListener("blur",function(){
				_this.event("blur");
			})
			window.addEventListener("orientationchange",function(e){
				_$this.resetCanvas();
				Laya.timer.once(100,_this,_this._changeCanvasSize,null,true);
			})
			this.on("mousemove",this,this._onmouseMove);
		}

		__class(Stage,'laya.display.Stage',_super);
		var __proto=Stage.prototype;
		/**@inheritDoc */
		__proto.size=function(width,height){
			this.width=width;
			this.height=height;
			Laya.timer.callLater(this,this._changeCanvasSize);
			return this;
		}

		/**@private */
		__proto._changeCanvasSize=function(){
			this.setCanvasSize(Browser.clientWidth,Browser.clientHeight);
		}

		__proto.resetCanvas=function(){
			var canvas=Render.canvas;
			var canvasStyle=canvas.source.style;
			canvas.size(1,1);
			canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="";
			this.visible=false;
		}

		/**
		*设置画布大小。
		*@param canvasWidth 画布宽度。
		*@param canvasHeight 画布高度。
		*/
		__proto.setCanvasSize=function(canvasWidth,canvasHeight){
			this._oldSize || (this._oldSize=new Point(this._width,this._height));
			var rotation=false;
			if (this._screenMode!=="none"){
				var screenType=canvasWidth / canvasHeight < 1 ? "vertical" :"horizontal";
				rotation=screenType!==this._screenMode;
				if (rotation){
					var temp=canvasHeight;
					canvasHeight=canvasWidth;
					canvasWidth=temp;
				}
			}
			this.canvasRotation=rotation;
			var pixelRatio=this._useHDRendering ? Browser.pixelRatio :1;
			var canvas=Render.canvas;
			var canvasStyle=canvas.source.style;
			var mat=this._canvasTransform.identity();
			var pixelWidth=canvasWidth *pixelRatio;
			var pixelHeight=canvasHeight *pixelRatio;
			var screenRatio=canvasWidth / canvasHeight;
			var width=this._oldSize.x;
			var height=this._oldSize.y;
			if (this._sizeMode==="full"){
				width=pixelWidth;
				height=pixelHeight;
				}else if (this._sizeMode==="fullwidth"){
				height=this._oldSize.y;
				width=this._height *screenRatio;
				}else if (this._sizeMode==="fullheight"){
				width=this._oldSize.x;
				height=this._width / screenRatio;
			}
			this._width=width;
			this._height=height;
			canvas.size(width,height);
			System.changeWebGLSize(width,height);
			var scaleX=pixelWidth / this._oldSize.x;
			var scaleY=pixelHeight / this._oldSize.y;
			if (this._scaleMode==="showall"){
				scaleX=scaleY=Math.min(scaleX,scaleY);
				}else if (this._scaleMode==="noborder"){
				scaleX=scaleY=Math.max(scaleX,scaleY);
				}else if (this._scaleMode==="noscale"){
				scaleX=scaleY=1;
			}
			if (scaleX===1 && scaleY===1){
				this.transform && this.transform.identity();
				}else {
				this.transform || (this.transform=new Matrix());
				this.transform.a=scaleX;
				this.transform.d=scaleY;
			}
			if (this._sizeMode==="none"){
				canvas.size(this._oldSize.x *scaleX,this._oldSize.y *scaleY);
				System.changeWebGLSize(canvas.width,canvas.height);
				mat.scale(1 / pixelRatio,1 / pixelRatio);
				if (this._alignH==="left")this.offset.x=0;
				else if (this._alignH==="right")this.offset.x=pixelWidth-canvas.width / pixelRatio;
				else this.offset.x=(pixelWidth-canvas.width)*0.5 / pixelRatio;
				if (this._alignV==="top")this.offset.y=0;
				else if (this._alignV==="bottom")this.offset.y=pixelHeight-canvas.height / pixelRatio;
				else this.offset.y=(pixelHeight-canvas.height)*0.5 / pixelRatio;
				mat.translate(this.offset.x,this.offset.y);
				}else {
				this._width=width / scaleX;
				this._height=height / scaleY;
				mat.scale(canvasWidth / canvas.width,canvasHeight / canvas.height);
			}
			if (rotation){
				if (this._screenMode==="horizontal"){
					mat.rotate(Math.PI / 2);
					mat.translate(canvasHeight,0);
					}else {
					mat.rotate(-Math.PI / 2);
					mat.translate(0,canvasWidth);
				}
			}
			if (mat.a < 0.00000000000001)mat.a=mat.d=0;
			canvasStyle.transformOrigin=canvasStyle.webkitTransformOrigin=canvasStyle.msTransformOrigin=canvasStyle.mozTransformOrigin=canvasStyle.oTransformOrigin="0px 0px 0px";
			canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="matrix("+mat.toString()+")";
			this.visible=true;
			this._repaint=1;
			this.event("resize");
		}

		/**@inheritDoc */
		__proto.repaint=function(){
			this._repaint=1;
		}

		/**@inheritDoc */
		__proto.parentRepaint=function(child){}
		/**@private */
		__proto._loop=function(){
			this.render(Render.context,0,0);
			return true;
		}

		/**@private */
		__proto._onmouseMove=function(e){
			this._mouseMoveTime=Browser.now();
		}

		/**@inheritDoc */
		__proto.render=function(context,x,y){
			var loopTime=Browser.now();
			if (Log.enable()&& (loopTime-this.now)> 500){
				Log.print("-------------render delay:"+(Browser.now()-this.now)+"  cound:"+this._renderCount);
			}
			this.now=loopTime;
			this._renderCount++;
			var delay=loopTime-this._preLoopTime;
			var isFastMode=(this.frameRate!=="slow");
			var isDoubleLoop=(this._renderCount % 2===0);
			var ctx=Render.context;
			var renderFlag=this._style.visible;
			Stat.renderSlow=!isFastMode;
			if (isFastMode || isDoubleLoop){
				Stat.loopCount++;
				MouseManager.instance.runEvent();
				Laya.timer._update();
				if (renderFlag){
					Render.isWebGl ? ctx.clear():Render.clear(this._bgColor);
					_super.prototype.render.call(this,context,x,y);
				}
			}
			if (renderFlag && (isFastMode || !isDoubleLoop)){
				Render.isWebGl && Render.clear(this._bgColor);
				context.flush();
				Render.finish();
			}
			this._preLoopTime=loopTime;
		}

		/**
		*<p>缩放模式。</p>
		*
		*<p><ul>取值范围：
		*<li>"noScale" ：不缩放；</li>
		*<li>"exactFit" ：全屏不等比缩放；</li>
		*<li>"showAll" ：最小比例缩放；</li>
		*<li>"noBorder" ：最大比例缩放；</li>
		*</ul></p>
		*默认值为"noScale"。
		**/
		__getset(0,__proto,'scaleMode',function(){
			return this._scaleMode;
			},function(value){
			this._scaleMode=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**舞台的背景颜色，默认为黑色，null为透明。*/
		__getset(0,__proto,'bgColor',function(){
			return this._bgColor;
			},function(value){
			this._bgColor=value;
			if (value){
				Render.canvas.source.style.background=value;
				}else {
				Render.canvas.source.style.background="none";
			}
		});

		/**
		*应用程序大小模式。
		*<p><ul>取值范围：
		*<li>"full"；</li>
		*<li>"none"；</li>
		*</ul></p>
		*默认值为"none"。
		**/
		__getset(0,__proto,'sizeMode',function(){
			return this._sizeMode;
			},function(value){
			this._sizeMode=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*水平对齐方式。
		*<p><ul>取值范围：
		*<li>"left" ：居左对齐；</li>
		*<li>"center" ：居中对齐；</li>
		*<li>"right" ：居右对齐；</li>
		*</ul></p>
		*默认值为"left"。
		**/
		__getset(0,__proto,'alignH',function(){
			return this._alignH;
			},function(value){
			this._alignH=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*垂直对齐方式。
		*<p><ul>取值范围：
		*<li>"top" ：居顶部对齐；</li>
		*<li>"middle" ：居中对齐；</li>
		*<li>"bottom" ：居底部对齐；</li>
		*</ul></p>
		**/
		__getset(0,__proto,'alignV',function(){
			return this._alignV;
			},function(value){
			this._alignV=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**当前视窗X轴缩放大小。*/
		__getset(0,__proto,'clientScaleX',function(){
			return this._transform ? this._transform.a :1;
		});

		/**使用高清渲染，默认为true*/
		__getset(0,__proto,'useHDRendering',function(){
			return this._useHDRendering;
			},function(value){
			this._useHDRendering=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**鼠标在 Stage 上的X坐标。*/
		__getset(0,__proto,'mouseX',function(){
			return Math.round(MouseManager.instance.mouseX / (this._transform ? this._transform.a :1));
		});

		/**鼠标在 Stage 上的Y坐标。*/
		__getset(0,__proto,'mouseY',function(){
			return Math.round(MouseManager.instance.mouseY / (this._transform ? this._transform.d :1));
		});

		/**当前视窗Y轴缩放大小。*/
		__getset(0,__proto,'clientScaleY',function(){
			return this._transform ? this._transform.d :1;
		});

		/**
		*场景布局类型
		*<p><ul>取值范围：
		*<li>"none" ：不更改屏幕</li>
		*<li>"horizontal" ：自动横屏</li>
		*<li>"vertical" ：自动竖屏</li>
		*</ul></p>
		**/
		__getset(0,__proto,'screenMode',function(){
			return this._screenMode;
			},function(value){
			this._screenMode=value;
		});

		Stage.SCALE_NOSCALE="noscale";
		Stage.SCALE_EXACTFIT="exactfit";
		Stage.SCALE_SHOWALL="showall";
		Stage.SCALE_NOBORDER="noborder";
		Stage.SIZE_NONE="none";
		Stage.SIZE_FULL="full";
		Stage.SIZE_FULL_WIDTH="fullwidth";
		Stage.SIZE_FULL_HEIGHT="fullheight";
		Stage.ALIGN_LEFT="left";
		Stage.ALIGN_RIGHT="right";
		Stage.ALIGN_CENTER="center";
		Stage.ALIGN_TOP="top";
		Stage.ALIGN_MIDDLE="middle";
		Stage.ALIGN_BOTTOM="bottom";
		Stage.SCREEN_NONE="none";
		Stage.SCREEN_HORIZONTAL="horizontal";
		Stage.SCREEN_VERTICAL="vertical";
		Stage.FRAME_FAST="fast";
		Stage.FRAME_SLOW="slow";
		Stage.FRAME_MOUSE="mouse";
		Stage.FRAME_AUTO="auto";
		return Stage;
	})(Sprite)


	/**
	*...
	*@author
	*/
	//class laya.resource.FileBitmap extends laya.resource.Bitmap
	var FileBitmap=(function(_super){
		function FileBitmap(){
			this._src=null;
			this._onload=null;
			this._onerror=null;
			FileBitmap.__super.call(this);
		}

		__class(FileBitmap,'laya.resource.FileBitmap',_super);
		var __proto=FileBitmap.prototype;
		/***
		*设置onload函数,override it!
		*@param value onload函数
		*/
		__getset(0,__proto,'onload',null,function(value){
		});

		/**
		*设置文件路径全名
		*@param 文件路径全名
		*/
		/**
		*获取文件路径全名
		*@return 文件路径全名
		*/
		__getset(0,__proto,'src',function(){
			return this._src;
			},function(value){
			this._src=value;
		});

		/***
		*设置onerror函数,override it!
		*@param value onerror函数
		*/
		__getset(0,__proto,'onerror',null,function(value){
		});

		return FileBitmap;
	})(Bitmap)


	/**
	*...
	*@author laya
	*/
	//class laya.resource.HTMLCanvas extends laya.resource.Bitmap
	var HTMLCanvas=(function(_super){
		function HTMLCanvas(type){
			//this._ctx=null;
			this._is2D=false;
			HTMLCanvas.__super.call(this);
			var _$this=this;
			this._source=this;
			if (type==="2D" || (type==="AUTO" && !Render.isWebGl)){
				this._is2D=true;
				this._source=Browser.createElement("canvas");
				var o=this;
				o.getContext=function (contextID,other){
					if (_$this._ctx)return _$this._ctx;
					var ctx=_$this._ctx=_$this._source.getContext(contextID,other);
					if (ctx){
						ctx._canvas=o;
						ctx.size=function (){
						};
					}
					contextID==="2d" && Context._init(o,ctx);
					return ctx;
				}
			}else this._source={};
		}

		__class(HTMLCanvas,'laya.resource.HTMLCanvas',_super);
		var __proto=HTMLCanvas.prototype;
		__proto.clear=function(){
			this._ctx && this._ctx.clear();
		}

		__proto.destroy=function(){
			this._ctx && this._ctx.destroy();
			this._ctx=null;
		}

		__proto.release=function(){}
		__proto._setContext=function(context){
			this._ctx=context;
		}

		__proto.getContext=function(contextID,other){
			return this._ctx ? this._ctx :(this._ctx=HTMLCanvas._createContext(this));
		}

		__proto.copyTo=function(dec){
			_super.prototype.copyTo.call(this,dec);
			(dec)._ctx=this._ctx;
		}

		__proto.getMemSize=function(){
			return 0;
		}

		__proto.size=function(w,h){
			if (this._w !=w || this._h !=h){
				this._w=w;
				this._h=h;
				this._ctx && this._ctx.size(w,h);
				this._source && (this._source.height=h,this._source.width=w);
			}
		}

		__getset(0,__proto,'context',function(){
			return this._ctx;
		});

		//待调整
		__getset(0,__proto,'asBitmap',null,function(value){
		});

		HTMLCanvas.TYPE2D="2D";
		HTMLCanvas.TYPE3D="3D";
		HTMLCanvas.TYPEAUTO="AUTO";
		HTMLCanvas._createContext=null
		return HTMLCanvas;
	})(Bitmap)


	/**
	*...
	*@author ...
	*/
	//class laya.resource.HTMLSubImage extends laya.resource.Bitmap
	var HTMLSubImage=(function(_super){
		function HTMLSubImage(canvas,offsetX,offsetY,width,height,atlasImage,src,createOwnSource){
			HTMLSubImage.__super.call(this);
			(createOwnSource===void 0)&& (createOwnSource=false);
			throw new Error("不允许new！");
		}

		__class(HTMLSubImage,'laya.resource.HTMLSubImage',_super);
		return HTMLSubImage;
	})(Bitmap)


	//class laya.webgl.atlas.AtlasWebGLCanvas extends laya.resource.Bitmap
	var AtlasWebGLCanvas=(function(_super){
		function AtlasWebGLCanvas(){
			AtlasWebGLCanvas.__super.call(this);
			this._resourceManager.removeResource(this);
		}

		__class(AtlasWebGLCanvas,'laya.webgl.atlas.AtlasWebGLCanvas',_super);
		var __proto=AtlasWebGLCanvas.prototype;
		/***重新创建资源*/
		__proto.recreateResource=function(){
			var gl=WebGL.mainContext;
			var glTex=this._source=gl.createTexture();
			gl.bindTexture(0x0DE1,glTex);
			gl.texImage2D(0x0DE1,0,0x1908,this._w,this._h,0,0x1908,0x1401,null);
			gl.texParameteri(0x0DE1,0x2801,0x2601);
			gl.texParameteri(0x0DE1,0x2800,0x2601);
			gl.texParameteri(0x0DE1,0x2802,0x812F);
			gl.texParameteri(0x0DE1,0x2803,0x812F);
			gl.bindTexture(0x0DE1,null);
			this.memorySize=this._w *this._h *4;
			laya.resource.Resource.prototype.recreateResource.call(this);
		}

		/***销毁资源*/
		__proto.detoryResource=function(){
			if (this._source){
				WebGL.mainContext.deleteTexture(this._source);
				this._source=null;
				this.memorySize=0;
			}
		}

		/**采样image到WebGLTexture的一部分*/
		__proto.texSubImage2D=function(source,xoffset,yoffset,bitmap){
			var gl=WebGL.mainContext;
			gl.bindTexture(0x0DE1,this._source);
			(xoffset-1 >=0)&& (gl.texSubImage2D(0x0DE1,0,xoffset-1,yoffset,0x1908,0x1401,bitmap));
			(xoffset+1 <=source.width)&& (gl.texSubImage2D(0x0DE1,0,xoffset+1,yoffset,0x1908,0x1401,bitmap));
			(yoffset-1 >=0)&& (gl.texSubImage2D(0x0DE1,0,xoffset,yoffset-1,0x1908,0x1401,bitmap));
			(yoffset+1 <=source.height)&& (gl.texSubImage2D(0x0DE1,0,xoffset,yoffset+1,0x1908,0x1401,bitmap));
			gl.texSubImage2D(0x0DE1,0,xoffset,yoffset,0x1908,0x1401,bitmap);
			gl.bindTexture(0x0DE1,null);
		}

		/**采样image到WebGLTexture的一部分*/
		__proto.texSubImage2DPixel=function(source,xoffset,yoffset,width,height,pixel){
			var gl=WebGL.mainContext;
			gl.bindTexture(0x0DE1,this._source);
			var pixels=new Uint8Array(pixel.data);
			gl.texSubImage2D(0x0DE1,0,xoffset,yoffset,width,height,0x1908,0x1401,pixels);
			gl.bindTexture(0x0DE1,null);
		}

		/***
		*设置图片宽度
		*@param value 图片宽度
		*/
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			this._w=value;
		});

		/***
		*设置图片高度
		*@param value 图片高度
		*/
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			this._h=value;
		});

		return AtlasWebGLCanvas;
	})(Bitmap)


	/**
	*...
	*@author
	*/
	//class laya.webgl.resource.WebGLCanvas extends laya.resource.Bitmap
	var WebGLCanvas=(function(_super){
		function WebGLCanvas(type){
			//this._ctx=null;
			this._is2D=false;
			//this._canvas=null;
			//this.createOwnSource=false;
			var _$this=this;
			WebGLCanvas.__super.call(this);
			this._canvas=this;
			if (type==="2D" || (type==="AUTO" && !Render.isWebGl)){
				this._is2D=true;
				this._canvas=this._source=Browser.createElement("canvas");
				var o=this;
				o.getContext=function (contextID,other){
					if (_$this._ctx)return _$this._ctx;
					var ctx=_$this._ctx=_$this._canvas.getContext(contextID,other);
					if (ctx){
						ctx._canvas=o;
						ctx.size=function (){
						};
					}
					contextID==="2d" && Context._init(o,ctx);
					return ctx;
				}
			}else this._canvas={};
			this.createOwnSource=true;
			this.lock=true;
		}

		__class(WebGLCanvas,'laya.webgl.resource.WebGLCanvas',_super);
		var __proto=WebGLCanvas.prototype;
		__proto.clear=function(){
			this._ctx && this._ctx.clear();
		}

		__proto.destroy=function(){
			this._ctx && this._ctx.destroy();
			this._ctx=null;
		}

		__proto._setContext=function(context){
			this._ctx=context;
		}

		__proto.getContext=function(contextID,other){
			return this._ctx ? this._ctx :(this._ctx=WebGLCanvas._createContext(this));
		}

		__proto.copyTo=function(dec){
			_super.prototype.copyTo.call(this,dec);
			(dec)._ctx=this._ctx;
		}

		__proto.size=function(w,h){
			if (this._w !=w || this._h !=h){
				this._w=w;
				this._h=h;
				this._ctx && this._ctx.size(w,h);
				this._canvas && (this._canvas.height=h,this._canvas.width=w);
			}
		}

		__proto.recreateResource=function(){
			this.createWebGlTexture();
			laya.resource.Resource.prototype.recreateResource.call(this);
		}

		__proto.detoryResource=function(){
			if (this._source){
				WebGL.mainContext.deleteTexture(this._source);
				this._source=null;
				this.memorySize=0;
			}
		}

		__proto.createWebGlTexture=function(){
			var gl=WebGL.mainContext;
			if (!this._canvas){
				debugger;
				throw "create GLTextur err:no data:"+this._canvas;
			};
			var glTex=this._source=gl.createTexture();
			gl.bindTexture(0x0DE1,glTex);
			gl.texImage2D(0x0DE1,0,0x1908,this._w,this._h,0,0x1908,0x1401,null);
			gl.texParameteri(0x0DE1,0x2800,0x2601);
			gl.texParameteri(0x0DE1,0x2801,0x2601);
			gl.texParameteri(0x0DE1,0x2802,0x812F);
			gl.texParameteri(0x0DE1,0x2803,0x812F);
			this.memorySize=this._w *this._h *4;
			gl.bindTexture(0x0DE1,null);
			this._canvas=null;
		}

		__proto.texSubImage2D=function(webglCanvas,xoffset,yoffset){
			var gl=WebGL.mainContext;
			gl.bindTexture(0x0DE1,this._source);
			gl.texSubImage2D(0x0DE1,0,xoffset,yoffset,0x1908,0x1401,webglCanvas._source);
		}

		/**
		*返回HTML Image,as3无internal货friend，通常禁止开发者修改image内的任何属性
		*@param HTML Image
		*/
		__getset(0,__proto,'canvas',function(){
			return this._canvas;
		});

		__getset(0,__proto,'context',function(){
			return this._ctx;
		});

		__getset(0,__proto,'asBitmap',null,function(value){
			this._ctx && (this._ctx.asBitmap=value);
		});

		WebGLCanvas._createContext=null
		return WebGLCanvas;
	})(Bitmap)


	/**
	*...
	*@author
	*/
	//class laya.webgl.resource.WebGLCharImage extends laya.resource.Bitmap
	var WebGLCharImage=(function(_super){
		function WebGLCharImage(canvas,char){
			//this._ctx=null;
			//this.canvas=null;
			//this.char=null;
			//this.createOwnSource=false;
			WebGLCharImage.__super.call(this);
			this.canvas=canvas;
			this.char=char;
			var bIsConchApp=System.isConchApp;
			if (bIsConchApp){
				ctx=ConchTextCanvas;
				}else {
				this._ctx=canvas.getContext('2d',undefined);
			}
			this.activeResource();
		}

		__class(WebGLCharImage,'laya.webgl.resource.WebGLCharImage',_super);
		var __proto=WebGLCharImage.prototype;
		//无异步加载，可立即创建资源
		__proto.size=function(w,h){
			this._w=w;
			this._h=h;
			this.canvas && (this.canvas.height=h,this.canvas.width=w);
		}

		//canvas为公用，其它地方也可能修改其尺寸
		__proto.recreateResource=function(){
			var char=this.char;
			var bIsConchApp=System.isConchApp;
			var xs=char.xs,ys=char.ys;
			var t=null;
			if (bIsConchApp){
				this._ctx.font=char.font;
				t=this._ctx.measureText(char.char);
				char.width=t.width1 *xs;
				char.height=t.height *ys;
				}else {
				t=Utils1.measureText(char.char,char.font);
				char.width=t.width *xs;
				char.height=t.height *ys;
			};
			var borderSize=4;
			this.size(char.width+borderSize *2,char.height+borderSize *2);
			if (bIsConchApp){
				var sFont="normal 100 "+char.fontSize+"px Arial";
				if (char.borderColor){
					sFont+=" 1 "+char.borderColor;
				}
				this._ctx.font=sFont;
				this._ctx.textBaseline="top";
				this._ctx.fillStyle=char.fillColor;
				this._ctx.fillText(char.char,borderSize,borderSize,null,null,null);
				}else {
				this._ctx.save();
				(this._ctx).clearRect(0,0,char.width+borderSize *4,char.height+borderSize *4);
				this._ctx.font=char.font;
				this._ctx.textBaseline="top";
				if (xs !=1 || ys !=1){
					alert("xs="+xs+",ys="+ys);
					this._ctx.scale(xs,ys);
				}
				this._ctx.translate(borderSize,borderSize);
				if (char.fillColor && char.borderColor){
					this._ctx.strokeStyle=char.borderColor;
					this._ctx.lineWidth=char.lineWidth;
					this._ctx.strokeText(char.char,0,0,null,null,0,null);
					this._ctx.fillStyle=char.fillColor;
					this._ctx.fillText(char.char,0,0,null,null,null);
					}else {
					if (char.lineWidth===-1){
						this._ctx.fillStyle=char.fillColor?char.fillColor:"white";
						this._ctx.fillText(char.char,0,0,null,null,null);
						}else {
						this._ctx.strokeStyle=char.borderColor?char.borderColor:'white';
						this._ctx.lineWidth=char.lineWidth;
						this._ctx.strokeText(char.char,0,0,null,null,0,null);
					}
				}
				this._ctx.restore();
			}
			char.borderSize=borderSize;
			laya.resource.Resource.prototype.recreateResource.call(this);
		}

		__proto.copyTo=function(dec){
			var d=dec;
			d._ctx=this._ctx;
			d.canvas=this.canvas;
			d.char=this.char;
			_super.prototype.copyTo.call(this,dec);
		}

		return WebGLCharImage;
	})(Bitmap)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.resource.WebGLRenderTarget extends laya.resource.Bitmap
	var WebGLRenderTarget=(function(_super){
		function WebGLRenderTarget(width,height,mipMap,surfaceFormat,surfaceType,depthFormat){
			//this._frameBuffer=null;
			//this._depthBuffer=null;
			//this._surfaceFormat=0;
			//this._surfaceType=0;
			//this._depthFormat=0;
			//this._mipMap=false;
			(mipMap===void 0)&& (mipMap=false);
			(surfaceFormat===void 0)&& (surfaceFormat=0x1908);
			(surfaceType===void 0)&& (surfaceType=0x1401);
			(depthFormat===void 0)&& (depthFormat=0x81A5);
			WebGLRenderTarget.__super.call(this);
			this._w=width;
			this._h=height;
			this._mipMap=mipMap;
			this._surfaceFormat=surfaceFormat;
			this._surfaceType=surfaceType;
			this._depthFormat=depthFormat;
			this.lock=true;
		}

		__class(WebGLRenderTarget,'laya.webgl.resource.WebGLRenderTarget',_super);
		var __proto=WebGLRenderTarget.prototype;
		__proto.recreateResource=function(){
			var gl=WebGL.mainContext;
			this._frameBuffer || (this._frameBuffer=gl.createFramebuffer());
			this._source || (this._source=gl.createTexture());
			gl.bindTexture(0x0DE1,this._source);
			gl.texImage2D(0x0DE1,0,0x1908,this._w,this._h,0,this._surfaceFormat,this._surfaceType,null);
			gl.texParameteri(0x0DE1,0x2801,0x2601);
			gl.texParameteri(0x0DE1,0x2802,0x812F);
			gl.texParameteri(0x0DE1,0x2803,0x812F);
			var isPot=Arith.isPOT(this._w,this._h);
			if (this._mipMap && isPot){
				gl.texParameteri(0x0DE1,0x2800,0x2703);
				gl.generateMipmap(0x0DE1);
			}
			else{
				gl.texParameteri(0x0DE1,0x2800,0x2601);
				(this._mipMap)&& (this._mipMap=false);
			}
			gl.bindFramebuffer(0x8D40,this._frameBuffer);
			gl.framebufferTexture2D(0x8D40,0x8CE0,0x0DE1,this._source,0);
			if (this._depthFormat){
				this._depthBuffer || (this._depthBuffer=gl.createRenderbuffer());
				gl.bindRenderbuffer(0x8D41,this._depthBuffer);
				gl.renderbufferStorage(0x8D41,this._depthFormat,this._w,this._h);
				gl.framebufferRenderbuffer(0x8D40,0x8D00,0x8D41,this._depthBuffer);
			}
			gl.bindFramebuffer(0x8D40,null);
			gl.bindTexture(0x0DE1,null);
			gl.bindRenderbuffer(0x8D41,null);
			this.memorySize=this._w *this._h *4;
			laya.resource.Resource.prototype.recreateResource.call(this);
		}

		__proto.detoryResource=function(){
			if (this._frameBuffer){
				WebGL.mainContext.deleteTexture(this._source);
				WebGL.mainContext.deleteFramebuffer(this._frameBuffer);
				WebGL.mainContext.deleteRenderbuffer(this._depthBuffer);
				this._source=null;
				this._frameBuffer=null;
				this._depthBuffer=null;
				this.memorySize=0;
			}
		}

		__getset(0,__proto,'frameBuffer',function(){
			return this._frameBuffer;
		});

		__getset(0,__proto,'depthBuffer',function(){
			return this._depthBuffer;
		});

		return WebGLRenderTarget;
	})(Bitmap)


	/**
	*...
	*@author
	*/
	//class laya.webgl.resource.WebGLSubImage extends laya.resource.Bitmap
	var WebGLSubImage=(function(_super){
		function WebGLSubImage(canvas,offsetX,offsetY,width,height,atlasImage,src,createOwnSource){
			//this._ctx=null;
			//this.canvas=null;
			//this.repeat=false;
			//this.mipmap=false;
			//this.minFifter=0;
			//this.magFifter=0;
			//this.createOwnSource=false;
			//this.atlasImage=null;
			this.offsetX=0;
			this.offsetY=0;
			//this.src=null;
			(createOwnSource===void 0)&& (createOwnSource=false);
			WebGLSubImage.__super.call(this);
			this.repeat=true;
			this.mipmap=false;
			this.minFifter=-1;
			this.magFifter=-1;
			this.atlasImage=atlasImage;
			this.canvas=canvas;
			this._ctx=canvas.getContext('2d',undefined);
			this.createOwnSource=createOwnSource;
			this._w=width;
			this._h=height;
			this.offsetX=offsetX;
			this.offsetY=offsetY;
			this.src=src;
			this.activeResource();
		}

		__class(WebGLSubImage,'laya.webgl.resource.WebGLSubImage',_super);
		var __proto=WebGLSubImage.prototype;
		__proto.copyTo=function(dec){
			var d=dec;
			_super.prototype.copyTo.call(this,dec);
			d._ctx=this._ctx;
		}

		__proto.size=function(w,h){
			this._w=w;
			this._h=h;
			this._ctx && this._ctx.size(w,h);
			this.canvas && (this.canvas.height=h,this.canvas.width=w);
		}

		__proto.recreateResource=function(){
			this.size(this._w,this._h);
			this._ctx.drawImage(this.atlasImage,this.offsetX,this.offsetY,this._w,this._h,0,0,this._w,this._h);
			(this.createOwnSource)&& (this.createWebGlTexture());
			laya.resource.Resource.prototype.recreateResource.call(this);
		}

		__proto.createWebGlTexture=function(){
			var gl=WebGL.mainContext;
			if (!this.canvas){
				debugger;
				throw "create GLTextur err:no data:"+this.canvas;
			};
			var glTex=this._source=gl.createTexture();
			gl.bindTexture(0x0DE1,glTex);
			gl.texImage2D(0x0DE1,0,0x1908,0x1908,0x1401,this.canvas);
			var minFifter=this.minFifter;
			var magFifter=this.magFifter;
			var repeat=this.repeat ? 0x2901 :0x812F;
			var isPOT=Arith.isPOT(this.width,this.height);
			if (isPOT){
				if (this.mipmap)
					(minFifter!==-1)|| (minFifter=0x2703);
				else
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2802,repeat);
				gl.texParameteri(0x0DE1,0x2803,repeat);
				this.mipmap && gl.generateMipmap(0x0DE1);
				}else {
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2802,0x812F);
				gl.texParameteri(0x0DE1,0x2803,0x812F);
			}
			gl.bindTexture(0x0DE1,null);
			this.canvas=null;
			this.memorySize=this._w *this._h *4;
		}

		__proto.detoryResource=function(){
			if (this.createOwnSource && this._source){
				WebGL.mainContext.deleteTexture(this._source);
				this._source=null;
				this.memorySize=0;
			}
		}

		return WebGLSubImage;
	})(Bitmap)


	//class laya.webgl.shader.d2.value.TextSV extends laya.webgl.shader.d2.value.TextureSV
	var TextSV=(function(_super){
		function TextSV(){
			TextSV.__super.call(this,0x40);
			this.defines.add(0x40);
		}

		__class(TextSV,'laya.webgl.shader.d2.value.TextSV',_super);
		var __proto=TextSV.prototype;
		__proto.release=function(){
			TextSV.pool[TextSV._length++]=this;
			this.clear();
		}

		__proto.clear=function(){
			_super.prototype.clear.call(this);
		}

		TextSV.create=function(){
			if (TextSV._length)return TextSV.pool[--TextSV._length];
			else return new TextSV();
		}

		TextSV.pool=[];
		TextSV._length=0;
		return TextSV;
	})(TextureSV)


	/**
	*<p><code>Input</code> 类用于创建显示对象以显示和输入文本。</p>
	*
	*@example 以下示例代码，创建了一个 <code>Text</code> 实例。
	*<p>[EXAMPLE-AS-BEGIN]</p>
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Input;
		*import laya.events.Event;
		*
		*public class Input_Example
		*{
			*private var input:Input;
			*public function Input_Example()
			*{
				*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
				*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
				*onInit();
				*}
			*
			*private function onInit():void
			*{
				*input=new Input();//创建一个 Input 类的实例对象 input 。
				*input.text="这个是一个 Input 文本示例。";
				*input.color="#008fff";//设置 input 的文本颜色。
				*input.font="Arial";//设置 input 的文本字体。
				*input.bold=true;//设置 input 的文本显示为粗体。
				*input.fontSize=30;//设置 input 的字体大小。
				*input.wordWrap=true;//设置 input 的文本自动换行。
				*input.x=100;//设置 input 对象的属性 x 的值，用于控制 input 对象的显示位置。
				*input.y=100;//设置 input 对象的属性 y 的值，用于控制 input 对象的显示位置。
				*input.width=300;//设置 input 的宽度。
				*input.height=200;//设置 input 的高度。
				*input.italic=true;//设置 input 的文本显示为斜体。
				*input.borderColor="#fff000";//设置 input 的文本边框颜色。
				*Laya.stage.addChild(input);//将 input 添加到显示列表。
				*input.on(Event.FOCUS,this,onFocus);//给 input 对象添加获得焦点事件侦听。
				*input.on(Event.BLUR,this,onBlur);//给 input 对象添加失去焦点事件侦听。
				*input.on(Event.INPUT,this,onInput);//给 input 对象添加输入字符事件侦听。
				*input.on(Event.ENTER,this,onEnter);//给 input 对象添加敲回车键事件侦听。
				*}
			*
			*private function onFocus():void
			*{
				*trace("输入框 input 获得焦点。");
				*}
			*
			*private function onBlur():void
			*{
				*trace("输入框 input 失去焦点。");
				*}
			*
			*private function onInput():void
			*{
				*trace("用户在输入框 input 输入字符。文本内容：",input.text);
				*}
			*
			*private function onEnter():void
			*{
				*trace("用户在输入框 input 内敲回车键。");
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*var input;
	*Input_Example();
	*function Input_Example()
	*{
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*onInit();
		*}
	*function onInit()
	*{
		*input=new laya.display.Input();//创建一个 Input 类的实例对象 input 。
		*input.text="这个是一个 Input 文本示例。";
		*input.color="#008fff";//设置 input 的文本颜色。
		*input.font="Arial";//设置 input 的文本字体。
		*input.bold=true;//设置 input 的文本显示为粗体。
		*input.fontSize=30;//设置 input 的字体大小。
		*input.wordWrap=true;//设置 input 的文本自动换行。
		*input.x=100;//设置 input 对象的属性 x 的值，用于控制 input 对象的显示位置。
		*input.y=100;//设置 input 对象的属性 y 的值，用于控制 input 对象的显示位置。
		*input.width=300;//设置 input 的宽度。
		*input.height=200;//设置 input 的高度。
		*input.italic=true;//设置 input 的文本显示为斜体。
		*input.borderColor="#fff000";//设置 input 的文本边框颜色。
		*Laya.stage.addChild(input);//将 input 添加到显示列表。
		*input.on(laya.events.Event.FOCUS,this,onFocus);//给 input 对象添加获得焦点事件侦听。
		*input.on(laya.events.Event.BLUR,this,onBlur);//给 input 对象添加失去焦点事件侦听。
		*input.on(laya.events.Event.INPUT,this,onInput);//给 input 对象添加输入字符事件侦听。
		*input.on(laya.events.Event.ENTER,this,onEnter);//给 input 对象添加敲回车键事件侦听。
		*}
	*function onFocus()
	*{
		*console.log("输入框 input 获得焦点。");
		*}
	*function onBlur()
	*{
		*console.log("输入框 input 失去焦点。");
		*}
	*function onInput()
	*{
		*console.log("用户在输入框 input 输入字符。文本内容：",input.text);
		*}
	*function onEnter()
	*{
		*console.log("用户在输入框 input 内敲回车键。");
		*}
	*</listing>
	*<listing version="3.0">
	*import Input=laya.display.Input;
	*class Input_Example {
		*private input:Input;
		*constructor(){
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*this.onInit();
			*}
		*private onInit():void {
			*this.input=new Input();//创建一个 Input 类的实例对象 input 。
			*this.input.text="这个是一个 Input 文本示例。";
			*this.input.color="#008fff";//设置 input 的文本颜色。
			*this.input.font="Arial";//设置 input 的文本字体。
			*this.input.bold=true;//设置 input 的文本显示为粗体。
			*this.input.fontSize=30;//设置 input 的字体大小。
			*this.input.wordWrap=true;//设置 input 的文本自动换行。
			*this.input.x=100;//设置 input 对象的属性 x 的值，用于控制 input 对象的显示位置。
			*this.input.y=100;//设置 input 对象的属性 y 的值，用于控制 input 对象的显示位置。
			*this.input.width=300;//设置 input 的宽度。
			*this.input.height=200;//设置 input 的高度。
			*this.input.italic=true;//设置 input 的文本显示为斜体。
			*this.input.borderColor="#fff000";//设置 input 的文本边框颜色。
			*Laya.stage.addChild(this.input);//将 input 添加到显示列表。
			*this.input.on(laya.events.Event.FOCUS,this,this.onFocus);//给 input 对象添加获得焦点事件侦听。
			*this.input.on(laya.events.Event.BLUR,this,this.onBlur);//给 input 对象添加失去焦点事件侦听。
			*this.input.on(laya.events.Event.INPUT,this,this.onInput);//给 input 对象添加输入字符事件侦听。
			*this.input.on(laya.events.Event.ENTER,this,this.onEnter);//给 input 对象添加敲回车键事件侦听。
			*}
		*private onFocus():void {
			*console.log("输入框 input 获得焦点。");
			*}
		*private onBlur():void {
			*console.log("输入框 input 失去焦点。");
			*}
		*private onInput():void {
			*console.log("用户在输入框 input 输入字符。文本内容：",this.input.text);
			*}
		*private onEnter():void {
			*console.log("用户在输入框 input 内敲回车键。");
			*}
		*}
	*</listing>
	*@author yung
	*/
	//class laya.display.Input extends laya.display.Text
	var Input=(function(_super){
		function Input(){
			this._focus=false;
			this._multiline=false;
			this._editable=true;
			this._restrictPattern=null;
			this.inputElementXAdjuster=0;
			this.inputElementYAdjuster=0;
			this.title='';
			Input.__super.call(this);
			this._maxChars=1E5;
			this._width=100;
			this._height=20;
			this.multiline=false;
			this.on("mousedown",this,this.onMouseDown);
			this.on("undisplay",this,this.onUnDisplay);
		}

		__class(Input,'laya.display.Input',_super);
		var __proto=Input.prototype;
		/**@private */
		__proto.onStageDown=function(e){
			if (e.target==this)
				return;
			if ((e.target instanceof laya.display.Input )){
				this.focusOut();
				this.removeNeedlessInputMethod();
			}else
			this.focus=false;
			Laya.stage.off("mousedown",this,this.onStageDown);
		}

		/**@private */
		__proto.onUnDisplay=function(e){
			this.focus=false;
		}

		/**@private */
		__proto.onMouseDown=function(e){
			this.focus=true;
			if (!Browser.onMobile)
				Laya.stage.on("mousedown",this,this.onStageDown);
		}

		/**@inheritDoc */
		__proto.render=function(context,x,y){
			laya.display.Sprite.prototype.render.call(this,context,x,y);
		}

		/**
		*在输入期间，如果Input实例的位置改变，调用该方法同步输入框的位置
		*/
		__proto.syncInputPosition=function(){
			var style=this.nativeInput.style;
			var stage=Laya.stage;
			var rec;
			rec=Utils1.getGlobalPosAndScale(this);
			style.left=(rec.x+this.padding[3]+this.inputElementXAdjuster)*stage.clientScaleX+stage.offset.x+"px";
			style.top=(rec.y+this.padding[0]+this.inputElementYAdjuster)*stage.clientScaleY+stage.offset.y+"px";
			if (!this._getVisible())this.focus=false;
			if (stage.transform || rec.width !=1 || rec.height !=1){
				var ts="scale("+stage.clientScaleX *rec.width+","+stage.clientScaleY *rec.height+")";
				if (ts !=style.transform){
					style.transformOrigin="0 0";
					style.transform=ts;
				}
			}
		}

		/**@private */
		__proto._getVisible=function(){
			var target=this;
			while (target){
				if (target.visible===false)return false;
				target=target.parent;
			}
			return true;
		}

		/**选中所有文本*/
		__proto.select=function(){
			this.nativeInput.select();
		}

		__proto.focusIn=function(){
			var input=this.nativeInput;
			this._focus=true;
			var cssText=Input.cssStyle;
			cssText+=";white-space:"+(this.wordWrap ? "normal" :"nowrap");
			input.readOnly=!this._editable;
			input.maxLength=this._maxChars;
			var padding=this.padding;
			var inputWid=this._width-padding[1]-padding[3];
			var inputHei=this._height-padding[0]-padding[2];
			cssText+=";width:"+inputWid+"px";
			cssText+=";height:"+inputHei+"px";
			cssText+=";color:"+this.color;
			cssText+=";font-size:"+this.fontSize+"px";
			cssText+=";font-family:"+this.font;
			cssText+=";line-height:"+(this.leading+this.fontSize)+"px";
			cssText+=";font-style:"+(this.italic ? "italic" :"normal");
			cssText+=";font-weight:"+(this.bold ? "bold" :"normal");
			cssText+=";text-align:"+this.align;
			var temp=this._text;
			input.value=temp;
			this._text="";
			this.typeset();
			this._text=temp;
			input.style.cssText=cssText;
			input.type=this.asPassword ? "password" :"input";
			input.focus();
			Laya.stage.off("keydown",this,this.onKeyDown);
			Laya.stage.on("keydown",this,this.onKeyDown);
			Laya.stage.focus=this;
			this.event("focus");
			Laya.timer.frameLoop(1,this,this.syncInputPosition);
		}

		__proto.focusOut=function(){
			this._focus=false;
			var temp=this._text || "";
			this._text="";
			_super.prototype._$set_text.call(this,temp);
			Laya.stage.off("keydown",this,this.onKeyDown);
			Laya.stage.focus=null;
			this.event("blur");
			Browser.document.body.scrollTop=0;
			Laya.timer.clear(this,this.syncInputPosition);
		}

		__proto.removeNeedlessInputMethod=function(){
			var body=Browser.document.body;
			if (!this._multiline && body.contains(Input.input)&& body.contains(Input.area))
				Browser.document.body.removeChild(Input.input);
			else if (this._multiline && body.contains(Input.area)&& body.contains(Input.input))
			Browser.document.body.removeChild(Input.area);
		}

		/**@private */
		__proto.onKeyDown=function(e){
			if (e.keyCode===13)this.event("enter");
		}

		/**表示是否是多行输入框。*/
		__getset(0,__proto,'multiline',function(){
			return this._multiline;
			},function(value){
			this._multiline=value;
			this.valign=value ? "top" :"middle";
			if (!Browser.onMobile){
				if (value){
					Input.area || Input.initInput(Input.area=Browser.createElement("textarea"));
					}else {
					Input.input || Input.initInput(Input.input=Browser.createElement("input"));
				}
			}
		});

		__getset(0,__proto,'color',_super.prototype._$get_color,function(value){
			if (this._focus)
				this.nativeInput.style.color=value;
			_super.prototype._$set_color.call(this,value);
		});

		/**
		*获取对输入框的引用实例。
		*/
		__getset(0,__proto,'nativeInput',function(){
			return this._multiline ? Input.area :Input.input;
		});

		// 因此 调用focus接口是无法都在移动平台立刻弹出键盘的
		/**
		*表示焦点是否在显示对象上。
		*/
		__getset(0,__proto,'focus',function(){
			return this._focus;
			},function(value){
			if (Browser.onMobile){
				if (value && this._editable){
					var str=Browser.window.prompt(this.title,this._text || '');
					if (str !=null){
						if (this._restrictPattern)
							str=str.replace(this._restrictPattern,'');
						this.text=str;
						this.event("focus");
					}
				}
				return;
			};
			var input=this.nativeInput;
			if (this._focus!==value){
				laya.display.Input.isInputting=value;
				if (value){
					input.target && (input.target.focus=false);
					input.target=this;
					Browser.document.body.appendChild(input);
					this.focusIn();
					}else {
					input.target=null;
					this.focusOut();
					Browser.document.body.removeChild(input);
				}
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'text',function(){
			if (this._focus)
				return this.nativeInput.value;
			else
			return this._text;
			},function(value){
			if (this._focus){
				this.nativeInput.value=value || '';
			}
			_super.prototype._$set_text.call(this,value);
		});

		/**
		*获取字符数量限制，默认为10000
		*设置字符数量限制，小于等于0的值将会限制字符数量为10000
		*/
		__getset(0,__proto,'maxChars',function(){
			return this._maxChars;
			},function(value){
			if (value <=0)
				value=1E5;
			this._maxChars=value;
		});

		/**限制输入的字符*/
		__getset(0,__proto,'restrict',function(){
			return this._restrictPattern.source;
			},function(pattern){
			if (pattern){
				pattern="[^"+pattern+"]";
				if (pattern.indexOf("^^")>-1)
					pattern=pattern.replace("^^","");
				this._restrictPattern=new RegExp(pattern,"g");
			}else
			this._restrictPattern=null;
		});

		/**
		*设置可编辑状态。
		*/
		__getset(0,__proto,'editable',function(){
			return this._editable;
			},function(value){
			this._editable=value;
		});

		Input.getActiveInput=function(){
			if (Browser.document.body.contains(Input.input))
				return Input.input;
			else if (Browser.document.body.contains(Input.area))
			return Input.area;
			return null;
		}

		Input.initInput=function(input){
			var style=input.style;
			style.cssText=Input.cssStyle;
			input.addEventListener('input',function(e){
				var target=input.target;
				if (!target)
					return;
				var value=input.value;
				if (target._restrictPattern){
					value=value.replace(target._restrictPattern,"");
					input.value=value;
				}
				target._text=value;
				target.event("input");
			});
			input.addEventListener('mousemove',Input._stopEvent);
			input.addEventListener('mousedown',Input._stopEvent);
			input.addEventListener('touchmove',Input._stopEvent);
		}

		Input._stopEvent=function(e){
			e.stopPropagation();
		}

		Input.cssStyle="position:absolute;background-color:transparent;border:none;outline:none;resize:none;overflow:hidden;z-index:999";
		Input.input=null
		Input.area=null
		Input.inputHeight=50;
		Input.textAreaHeight=75;
		Input.inputFontSize=25;
		Input.borderStyle="3px solid orange";
		Input.backgroundStyle="Linen";
		Input.isInputting=false;
		return Input;
	})(Text)


	//class laya.ani.bone.Skeleton extends laya.display.Animation
	var Skeleton=(function(_super){
		function Skeleton(tmplete){
			this._tp_=null;
			Skeleton.__super.call(this);
			if (!tmplete)return;
			this._tp_=tmplete;this._count=tmplete.frameCount;
			this.interval=1000 / tmplete.frameRate;
			this.setGraphics(this._clips=this._tp_._graphicsArrs_[0]);
		}

		__class(Skeleton,'laya.ani.bone.Skeleton',_super);
		var __proto=Skeleton.prototype;
		__proto.setTpl=function(tpl){
			this._tp_=tpl;this._count=tpl.frameCount;
			this.interval=1000 / tpl.frameRate;
			this.setAnim(0);
		}

		__proto.setAnim=function(index){
			this.setGraphics(this._clips=this._tp_._graphicsArrs_[index]);
		}

		__proto.stAnimName=function(str){
			this.setGraphics(this._clips=this._tp_._graphicsArrs_[this._tp_.animNames[str]]);
		}

		__proto.setGraphics=function(graphics){
			this._clips=graphics;
			this._renderType |=0x100;
			this.repaint();
		}

		__proto.pause=function(frame){
			(frame===void 0)&& (frame=-1);
			frame >-1 && (this.index=frame);
			this.stop();
		}

		__getset(0,__proto,'index',_super.prototype._$get_index,function(value){
			this._index=value;
			if ((this._graphics=this._clips[value])!=null){
				this.repaint();
				return;
			}
			this._graphics=this._clips[value]=this._tp_.planish(value,this._clips._index_);
			this.repaint();
		});

		return Skeleton;
	})(Animation)


	/**
	*...
	*@author laya
	*/
	//class laya.resource.HTMLImage extends laya.resource.FileBitmap
	var HTMLImage=(function(_super){
		function HTMLImage(im){
			this._recreateLock=false;
			this._needReleaseAgain=false;
			this._source=im || new Browser.window.Image();
			HTMLImage.__super.call(this);
		}

		__class(HTMLImage,'laya.resource.HTMLImage',_super);
		var __proto=HTMLImage.prototype;
		/***重新创建资源*/
		__proto.recreateResource=function(){
			var _$this=this;
			if (this._src==="")
				throw new Error("src不能为空！");
			if (!this._source){
				this._recreateLock=true;
				var _this=this;
				this._source=new Browser.window.Image();
				this._source.onload=function (){
					_this._source.onload=null;
					if (_this._needReleaseAgain){
						_this._needReleaseAgain=false;
						_this._source=null;
						return;
					}
					_this.memorySize=_$this._w *_$this._h *4;
					_this._recreateLock=false;
					_this.compoleteCreate();
				};
				this._source.src=this._src;
			}
		}

		/***销毁资源*/
		__proto.detoryResource=function(){
			if (this._recreateLock)
				this._needReleaseAgain=true;
			(this._source)&& (this._source=null,this.memorySize=0);
		}

		/***调整尺寸*/
		__proto.onresize=function(){
			this._w=this._source.width;
			this._h=this._source.height;
		}

		/***
		*获取HTML Image
		*@return HTML Image
		*/
		__getset(0,__proto,'source',function(){
			return this._source;
		});

		/***
		*设置onload函数
		*@param value onload函数
		*/
		__getset(0,__proto,'onload',null,function(value){
			var _$this=this;
			this._onload=value;
			this._source && (this._source.onload=this._onload !=null ? (function(){
				_$this.onresize();
				_$this._onload();
			}):null);
		});

		/**
		*设置文件路径全名
		*@param 文件路径全名
		*/
		__getset(0,__proto,'src',_super.prototype._$get_src,function(value){
			this._src=value;
			this._source && (this._source.src=this._src);
		});

		/***
		*设置onerror函数
		*@param value onerror函数
		*/
		__getset(0,__proto,'onerror',null,function(value){
			var _$this=this;
			this._onerror=value;
			this._source && (this._source.onerror=this._onerror !=null ? (function(){
				_$this._onerror()
			}):null);
		});

		return HTMLImage;
	})(FileBitmap)


	/**
	*...
	*@author
	*/
	//class laya.webgl.resource.WebGLImage extends laya.resource.FileBitmap
	var WebGLImage=(function(_super){
		function WebGLImage(im){
			this._recreateLock=false;
			this._needReleaseAgain=false;
			this._image=null;
			this.repeat=false;
			this.mipmap=false;
			this.minFifter=0;
			this.magFifter=0;
			this.createOwnSource=false;
			WebGLImage.__super.call(this);
			this.repeat=true;
			this.mipmap=false;
			this.minFifter=-1;
			this.magFifter=-1;
			this._image=im || new Browser.window.Image();
			this.createOwnSource=true;
		}

		__class(WebGLImage,'laya.webgl.resource.WebGLImage',_super);
		var __proto=WebGLImage.prototype;
		/***重新创建资源*/
		__proto.recreateResource=function(){
			if (this._src==="")
				throw new Error("src不能为空！");
			var isPOT=Arith.isPOT(this.width,this.height);
			if (!this._image){
				this._recreateLock=true;
				var _this=this;
				this._image=new Browser.window.Image();
				this._image.onload=function (){
					_this._image.onload=null;
					if (_this._needReleaseAgain){
						_this._needReleaseAgain=false;
						_this._image=null;
						return;
					}
					(_this.createOwnSource)&& (_this.createWebGlTexture());
					_this.compoleteCreate();
				};
				_this._image.src=this._src;
				}else {
				if (this._recreateLock)
					return;
				(this.createOwnSource)&& (this.createWebGlTexture());
				this.compoleteCreate();
			}
		}

		/***复制资源,此方法为浅复制*/
		__proto.copyTo=function(dec){
			var webglImage=dec;
			webglImage._image=this._image;
			laya.resource.Bitmap.prototype.copyTo.call(this,webglImage);
		}

		/***销毁资源*/
		__proto.detoryResource=function(){
			if (this._recreateLock)
				this._needReleaseAgain=true;
			if (this._source){
				(this.createOwnSource)&& (WebGL.mainContext.deleteTexture(this._source));
				this._source=null;
				this.memorySize=0;
			}
		}

		__proto.createWebGlTexture=function(){
			var gl=WebGL.mainContext;
			if (!this._image){
				throw "create GLTextur err:no data:"+this._image;
			};
			var glTex=this._source=gl.createTexture();
			gl.bindTexture(0x0DE1,glTex);
			gl.texImage2D(0x0DE1,0,0x1908,0x1908,0x1401,this._image);
			var minFifter=this.minFifter;
			var magFifter=this.magFifter;
			var repeat=this.repeat ? 0x2901 :0x812F;
			var isPOT=Arith.isPOT(this.width,this.height);
			if (isPOT){
				if (this.mipmap)
					(minFifter!==-1)|| (minFifter=0x2703);
				else
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2802,repeat);
				gl.texParameteri(0x0DE1,0x2803,repeat);
				this.mipmap && gl.generateMipmap(0x0DE1);
				}else {
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2802,0x812F);
				gl.texParameteri(0x0DE1,0x2803,0x812F);
			}
			gl.bindTexture(0x0DE1,null);
			this._image=null;
			if (this.createOwnSource && isPOT)
				this.memorySize=this._w *this._h *4 *(1+1 / 3);
			else
			this.memorySize=this._w *this._h *4;
			this._recreateLock=false;
		}

		/***调整尺寸*/
		__proto.onresize=function(){
			this._w=this._image.width;
			this._h=this._image.height;
		}

		/**
		*返回HTML Image,as3无internal货friend，通常禁止开发者修改image内的任何属性
		*@param HTML Image
		*/
		__getset(0,__proto,'image',function(){
			return this._image;
		});

		/***
		*设置onload函数
		*@param value onload函数
		*/
		__getset(0,__proto,'onload',null,function(value){
			var _$this=this;
			this._onload=value;
			this._image && (this._image.onload=this._onload !=null ? (function(){
				_$this.onresize();
				_$this._onload();
			}):null);
		});

		/**
		*设置文件路径全名
		*@param 文件路径全名
		*/
		__getset(0,__proto,'src',_super.prototype._$get_src,function(value){
			this._src=value;
			this._image && (this._image.src=value);
		});

		/***
		*设置onerror函数
		*@param value onerror函数
		*/
		__getset(0,__proto,'onerror',null,function(value){
			var _$this=this;
			this._onerror=value;
			this._image && (this._image.onerror=this._onerror !=null ? (function(){
				_$this._onerror()
			}):null);
		});

		return WebGLImage;
	})(FileBitmap)


	Laya.__init([LoaderManager,EventDispatcher,Timer,ShaderCompile,Browser,WebGLContext2D,WebGLContext,AtlasGrid,RenderTargetMAX]);
	new PerformanceTest_Robots();

})(window,document,Laya);
