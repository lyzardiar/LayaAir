Laya.init(550, 400);
Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
Laya.Stat.show();

var textBox = new Laya.Sprite();

// 5000个随机摆放的文本
var text;
for (var i = 0; i < 5000; i++)
{
	text = new Laya.Text();
	text.text = (Math.random() * 100).toFixed(0);
	text.color = "#CCCCCC";
	
	text.x = Math.random() * 550;
	text.y = Math.random() * 400;
	
	textBox.addChild(text);
}

//缓存为静态图像
textBox.cacheAsBitmap = true;

Laya.stage.addChild(textBox);
