package laya.webgl.shader.d2 {
	import laya.webgl.shader.Shader;
	import laya.webgl.shader.ShaderValue;
	import laya.webgl.shader.d2.value.Value2D;
	/**
	 * ...
	 * @author laya
	 */
	public class Shader2X extends Shader 
	{
		public var _params2dQuick1:Array = null;
		public var _params2dQuick2:Array = null;
		
		public  var  _shaderValueWidth:Number;
		public  var  _shaderValueHeight:Number;
		//public  var  _shaderValueWidth:Number;
		
		public function Shader2X(vs:String, ps:String, saveName:*=null, nameMap:*=null) 
		{
			super(vs, ps, saveName, nameMap);
		}
		
		public function upload2dQuick1(shaderValue:ShaderValue):void
		{
			upload(shaderValue,_params2dQuick1 || _make2dQuick1() );
		}
		
		public function _make2dQuick1():Array
		{
			try{
				if (!_params2dQuick1)
				{
					activeResource();
					
					_params2dQuick1 = [];
					
					var params:Array = _params, one:*;
					for (var i:int = 0, n:int = params.length; i < n; i++)
					{
						one = params[i];
						if (one.name === "size" || one.name === "al2pha" || one.name==="mmat" || one.name === "position" || one.name ==="texcoord") continue;
						_params2dQuick1.push(one);
					}
				}
				return _params2dQuick1;
			}
			catch (e:*)
			{
			}
			return null;
		}
		
		override protected function detoryResource():void 
		{
			super.detoryResource();
			_params2dQuick1 = null;
			_params2dQuick2 = null;
		}

		public function upload2dQuick2(shaderValue:ShaderValue):void
		{
			upload(shaderValue,_params2dQuick2 || _make2dQuick2() );
		}
		
		public function _make2dQuick2():Array
		{
			try{
				if (!_params2dQuick2)
				{
					activeResource();
					
					_params2dQuick2 = [];
					
					var params:Array = _params, one:*;
					for (var i:int = 0, n:int = params.length; i < n; i++)
					{
						one = params[i];
						if (one.name === "size"|| one.name === "al2pha") continue;
						_params2dQuick2.push(one);
					}
				}
				return _params2dQuick2;
			}
			catch (e:*)
			{
			}
			return null;
		}
		
		public static function create(vs:String, ps:String, saveName:*= null, nameMap:*= null):Shader
		{
			return new Shader2X(vs, ps, saveName, nameMap);
		}
	}

}