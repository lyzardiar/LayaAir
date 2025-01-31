package laya.particle
{
	import laya.display.Sprite;
	import laya.particle.emitter.Emitter2D;
	import laya.particle.emitter.EmitterBase;
	import laya.renders.Render;
	import laya.renders.RenderContext;
	import laya.renders.RenderSprite;
	
	public class Particle2D extends Sprite
	{
		private var _particleTemplate:ParticleTemplateBase;
		private var _canvasTemplate:ParticleTemplateCanvas;
		private var _emitter:EmitterBase;
		public function Particle2D(setting:ParticleSettings)
		{
			if (Render.isWebGl)
			{
				_particleTemplate=new ParticleTemplate2D(setting);
			    this.graphics._saveToCmd(Render.context.drawParticle, [_particleTemplate]);
			}else
			{
				_particleTemplate =_canvasTemplate= new ParticleTemplateCanvas(setting);
				_renderType |= RenderSprite.CUSTOM;	
			}
			_emitter = new Emitter2D(_particleTemplate);
		}
		public function get emitter():EmitterBase
		{
			return _emitter;
		}
		public function play():void
		{
			Laya.timer.frameLoop(1,this,loop);
		}
		
		public function stop():void
		{
			Laya.timer.clear(this,loop);
		}
		private function loop():void
		{
			advanceTime(1/60);
		}
		public function advanceTime(passedTime:Number=1):void
		{
			if(_canvasTemplate)
			{
				_canvasTemplate.advanceTime(passedTime);
			}
			if (_emitter)
			{
				_emitter.advanceTime(passedTime);
			}	
		}
		public override function customRender(context:RenderContext, x:Number, y:Number):void 
		{
            if (_canvasTemplate)
			{
				_canvasTemplate.render(context, x, y);
			}
		}
	}
}