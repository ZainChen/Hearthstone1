//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

"use strict"  //严格模式

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
                console.log('hello,world')
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.bgSet("bg_jpg", 0, 0);  //设置背景
        this.gamePlay();  //游戏开始执行函数
    }

    /*========自定义函数================================*/
    //-------图片放置函数-------
    private bgSet(pictureName: string, px: number, py: number) {
        let picture:egret.Bitmap = new egret.Bitmap( RES.getRes(pictureName) );
        picture.x = px;
        picture.y = py;
        console.log(picture.$getHeight);
        this.addChild( picture );
        console.log( "createGameScene", RES.getRes(pictureName) );  //查看bg.jpg是否加载成功
    }

    //出牌方标记变量：值为1时是我方，值为0时是敌方\
    private cpf: Hero;  //出牌方标记图片

    private shaman: Hero;  //萨满对象
    private e1: Hero;  //对方随从1
    private e2: Hero;  //对方随从2
    private e3: Hero;  //对方随从3

    private rouge: Hero;  //刺客对象
    private w1: Hero;  //我方随从1
    private w2: Hero;  //我方随从2
    private w3: Hero;  //我方随从3

    //-------游戏开始执行函数-------
    private gamePlay() {
        //出牌方标记图片
        this.cpf = new Hero("cpf", "cpf_png", 0, 0, 900, 590, 0);
        this.heroSet(this.cpf);
        this.onTouch(this.cpf);

        //以下为所有英雄生成和功能实现
        this.rouge = new Hero("rouge", "rouge_png", 1, 30, 625, 518, 0);  //创建盗贼对象
        this.heroSet(this.rouge);
        this.onTouch(this.rouge);
        this.w1 = new Hero("w1", "w1_png", 5, 9, 200, 600, 0);
        this.heroSet(this.w1);
        this.onTouch(this.w1);
        this.w2 = new Hero("w2", "w2_png", 1, 2, 305, 600, 0);
        this.heroSet(this.w2);
        this.onTouch(this.w2);
        this.w3 = new Hero("w3", "w3_png", 10, 5, 410, 600, 0);
        this.heroSet(this.w3);
        this.onTouch(this.w3);


        this.shaman = new Hero("shaman", "shaman_png", 1, 30, 625, 68, 0);  //创建萨满对象
        this.heroSet( this.shaman);
        this.onTouch( this.shaman);
        this.e1 = new Hero("e1", "e1_png", 3, 8, 200, 1, 0);
        this.heroSet(this.e1);
        this.onTouch(this.e1);
        this.e2 = new Hero("e2", "e2_png", 1, 3, 305, 1, 0);
        this.heroSet(this.e2);
        this.onTouch(this.e2);
        this.e3 = new Hero("e3", "e3_png", 5, 2, 410, 1, 0);
        this.heroSet(this.e3);
        this.onTouch(this.e3);
    }

    //------返回英雄属性函数-------
    private printInfo(hero : Heroproperty) {
        return hero.heroHurt+" "+hero.heroBlood+" "+hero.herX+" "+hero.herY;
    }
    //------英雄放置-------
    private heroSet(hero : Heroproperty) {
        //英雄图片绘制
        hero.phero = new egret.Bitmap( RES.getRes(hero.pname) );
        hero.phero.x = hero.herX;
        hero.phero.y = hero.herY;
        console.log(hero.phero.$getHeight);
        this.addChild( hero.phero );
        console.log( "createGameScene", RES.getRes(hero.pname) );  //查看bg.jpg是否加载成功

        if(hero.heroName != "cpf") {
            //-------文字显示-------
            //显示名字
            hero.egname = new egret.TextField();
            hero.egname.text = hero.heroName;
            hero.egname.textColor = 0xffff00;
            hero.egname.size = 35;
            hero.egname.x = hero.herX;
            hero.egname.y = hero.herY;
            this.addChild( hero.egname );
            
            //显示伤害值
            hero.eghurt = new egret.TextField();
            hero.eghurt.text = hero.heroHurt+"  ";
            hero.eghurt.textColor = 0xFF0000;
            hero.eghurt.size = 45;
            hero.eghurt.x = hero.herX;
            hero.eghurt.y = hero.herY+97;
            this.addChild( hero.eghurt );

            //显示血量
            hero.egblood = new egret.TextField();
            hero.egblood.text = "  "+hero.heroBlood;
            hero.egblood.textColor = 0x00FF00;
            hero.egblood.size = 45;
            hero.egblood.x = hero.herX+50;
            hero.egblood.y = hero.herY+97;
            this.addChild( hero.egblood );
        }
    }
    //-------点击英雄事件-------
    private onTouch(hero : Heroproperty) {
        //设置显示对象可以相应触摸事件
        hero.phero.touchEnabled = true;
        //注册事件
        hero.phero.addEventListener( egret.TouchEvent.TOUCH_TAP, 
        function( evt:egret.TouchEvent ):void{
            this.positionReset(hero);
            if(hero.heroName == "cpf") {
                if(this.cpf.herY == 590) {
                    this.cpf.herY -= 520;
                    egret.Tween.get( hero.phero ).to( { y:hero.herY }, 300, egret.Ease.circIn );
                } else {
                    this.cpf.herY += 520;
                    egret.Tween.get( hero.phero ).to( { y:hero.herY }, 300, egret.Ease.circIn );
                }
            } else {
                if(this.cpf.herY == 590) {  //我方出牌情况
                    if(hero.heroName == "rouge") {  //刺客事件
                        if(hero.herX == 625) {
                            hero.clickNum++;
                            hero.herX += 20;
                            hero.herY -= 20;
                        } else {
                            hero.clickNum--;
                            hero.herX -= 20;
                            hero.herY += 20;
                        }
                    } else {
                        if(hero.herY == 600) {
                            hero.clickNum++;
                            hero.herX += 320;
                            hero.herY -= 230;
                        } else if(hero.herY == 600-230) {
                            hero.clickNum++;
                            hero.herY -= 50;
                        } else if(hero.herY == 600-230-50) {
                            hero.clickNum--;
                            hero.herY += 50;
                        }
                    }
                } else {  //敌方出牌情况
                    if(hero.heroName == "shaman") {
                        if(hero.herX == 625) {
                            hero.clickNum++;
                            hero.herX += 20;
                            hero.herY += 20;
                        } else {
                            hero.clickNum--;
                            hero.herX -= 20;
                            hero.herY -= 20;
                        }
                    } else {
                        if(hero.herY == 1) {
                            hero.clickNum++;
                            hero.herX += 320;
                            hero.herY += 230;
                        } else if(hero.herY == 1+230) {
                            hero.clickNum++;
                            hero.herY += 50;
                        } else if(hero.herY == 1+230+50) {
                            hero.clickNum--;
                            hero.herY -= 50;
                        }
                    }
                }
                egret.Tween.get( hero.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                egret.Tween.get( hero.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                egret.Tween.get( hero.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                egret.Tween.get( hero.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
            }
        },  this );
    }

    //-------英雄攻击或未攻击后位置重置-------
    private positionReset(hero : Heroproperty) {  //重置除借口内英雄外其它所有英雄位置
        //判断对方英雄是否被攻击
        if(hero.heroName == "shaman" || hero.heroName == "e1" || hero.heroName == "e2" || hero.heroName == "e3") {
            if(this.rouge.herY == 498) {  //刺客攻击
                if(hero.heroName == "shaman") {  //攻击萨满
                    egret.Tween.get( this.rouge.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.rouge.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.rouge.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.rouge.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.shaman.heroBlood -= this.rouge.heroHurt;
                    this.shaman.egblood.text = "  "+this.shaman.heroBlood;
                    this.addChild( this.shaman.egblood );

                    this.rouge.heroBlood -= this.shaman.heroHurt;
                    this.rouge.egblood.text = "  "+this.rouge.heroBlood;
                    this.addChild( this.rouge.egblood );
    
                    egret.Tween.get( this.rouge.phero ).to( { x: 625, y: 518 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.rouge.egname ).to( { x: 625, y: 518 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.rouge.eghurt ).to( { x: 625, y: 518+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.rouge.egblood ).to( { x: 625+50, y: 518+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从e1,e2,e3
                    if(hero.herY == 1+230) {
                        egret.Tween.get( this.rouge.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.rouge.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.rouge.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.rouge.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        hero.heroBlood -= this.rouge.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );

                        this.rouge.heroBlood -= hero.heroHurt;
                        this.rouge.egblood.text = "  "+this.rouge.heroBlood;
                        this.addChild( this.rouge.egblood );
        
                        egret.Tween.get( this.rouge.phero ).to( { x: 625, y: 518 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.rouge.egname ).to( { x: 625, y: 518 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.rouge.eghurt ).to( { x: 625, y: 518+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.rouge.egblood ).to( { x: 625+50, y: 518+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
           else if(this.w1.herY == 600-230-50) {  //刺客随从w1攻击
               if(hero.heroName == "shaman") {  //攻击萨满
                    egret.Tween.get( this.w1.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w1.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w1.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w1.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.shaman.heroBlood -= this.w1.heroHurt;
                    this.shaman.egblood.text = "  "+this.shaman.heroBlood;
                    this.addChild( this.shaman.egblood );

                    this.w1.heroBlood -= this.shaman.heroHurt;
                    this.w1.egblood.text = "  "+this.w1.heroBlood;
                    this.addChild( this.w1.egblood );
    
                    egret.Tween.get( this.w1.phero ).to( { x: this.w1.herX, y: this.w1.herY+50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w1.egname ).to( { x: this.w1.herX, y: this.w1.herY+50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w1.eghurt ).to( { x: this.w1.herX, y: this.w1.herY+50+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w1.egblood ).to( { x: this.w1.herX+50, y: this.w1.herY+50+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从e1,e2,e3
                    if(hero.herY == 1+230) {
                        egret.Tween.get( this.w1.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w1.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w1.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w1.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        hero.heroBlood -= this.w1.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );

                        this.w1.heroBlood -= hero.heroHurt;
                        this.w1.egblood.text = "  "+this.w1.heroBlood;
                        this.addChild( this.w1.egblood );
        
                        egret.Tween.get( this.w1.phero ).to( { x: this.w1.herX, y: this.w1.herY+50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w1.egname ).to( { x: this.w1.herX, y: this.w1.herY+50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w1.eghurt ).to( { x: this.w1.herX, y: this.w1.herY+50+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w1.egblood ).to( { x: this.w1.herX+50, y: this.w1.herY+50+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
           else if(this.w2.herY == 600-230-50) {  //刺客随从w2攻击
               if(hero.heroName == "shaman") {  //攻击萨满
                    egret.Tween.get( this.w2.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w2.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w2.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w2.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.shaman.heroBlood -= this.w2.heroHurt;
                    this.shaman.egblood.text = "  "+this.shaman.heroBlood;
                    this.addChild( this.shaman.egblood );

                    this.w2.heroBlood -= this.shaman.heroHurt;
                    this.w2.egblood.text = "  "+this.w2.heroBlood;
                    this.addChild( this.w2.egblood );
    
                    egret.Tween.get( this.w2.phero ).to( { x: this.w2.herX, y: this.w2.herY+50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w2.egname ).to( { x: this.w2.herX, y: this.w2.herY+50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w2.eghurt ).to( { x: this.w2.herX, y: this.w2.herY+50+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w2.egblood ).to( { x: this.w2.herX+50, y: this.w2.herY+50+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从e1,e2,e3
                    if(hero.herY == 1+230) {
                        egret.Tween.get( this.w2.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w2.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w2.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w2.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        hero.heroBlood -= this.w2.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );

                        this.w2.heroBlood -= hero.heroHurt;
                        this.w2.egblood.text = "  "+this.w2.heroBlood;
                        this.addChild( this.w2.egblood );
        
                        egret.Tween.get( this.w2.phero ).to( { x: this.w2.herX, y: this.w2.herY+50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w2.egname ).to( { x: this.w2.herX, y: this.w2.herY+50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w2.eghurt ).to( { x: this.w2.herX, y: this.w2.herY+50+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w2.egblood ).to( { x: this.w2.herX+50, y: this.w2.herY+50+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
           else if(this.w3.herY == 600-230-50) {  //刺客随从w3攻击
               if(hero.heroName == "shaman") {  //攻击萨满
                    egret.Tween.get( this.w3.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w3.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w3.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w3.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.shaman.heroBlood -= this.w3.heroHurt;
                    this.shaman.egblood.text = "  "+this.shaman.heroBlood;
                    this.addChild( this.shaman.egblood );

                    this.w3.heroBlood -= this.shaman.heroHurt;
                    this.w3.egblood.text = "  "+this.w3.heroBlood;
                    this.addChild( this.w3.egblood );
    
                    egret.Tween.get( this.w3.phero ).to( { x: this.w3.herX, y: this.w3.herY+50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w3.egname ).to( { x: this.w3.herX, y: this.w3.herY+50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w3.eghurt ).to( { x: this.w3.herX, y: this.w3.herY+50+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.w3.egblood ).to( { x: this.w3.herX+50, y: this.w3.herY+50+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从e1,e2,e3
                    if(hero.herY == 1+230) {
                        egret.Tween.get( this.w3.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w3.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w3.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.w3.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        hero.heroBlood -= this.w3.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );

                        this.w3.heroBlood -= hero.heroHurt;
                        this.w3.egblood.text = "  "+this.w3.heroBlood;
                        this.addChild( this.w3.egblood );
        
                        egret.Tween.get( this.w3.phero ).to( { x: this.w3.herX, y: this.w3.herY+50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w3.egname ).to( { x: this.w3.herX, y: this.w3.herY+50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w3.eghurt ).to( { x: this.w3.herX, y: this.w3.herY+50+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.w3.egblood ).to( { x: this.w3.herX+50, y: this.w3.herY+50+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
        }

        //判断我方英雄是否被攻击
        if(hero.heroName == "rouge" || hero.heroName == "w1" || hero.heroName == "w2" || hero.heroName == "w3") {
            if(this.shaman.herY == 88) {  //萨满攻击
                if(hero.heroName == "rouge") {  //攻击刺客
                    egret.Tween.get( this.shaman.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.shaman.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.shaman.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.shaman.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.shaman.heroBlood -= hero.heroHurt;
                    this.shaman.egblood.text = "  "+this.shaman.heroBlood;
                    this.addChild( this.shaman.egblood );

                    hero.heroBlood -= this.shaman.heroHurt;
                    hero.egblood.text = "  "+hero.heroBlood;
                    this.addChild( hero.egblood );
    
                    egret.Tween.get( this.shaman.phero ).to( { x: 625, y: 68 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.shaman.egname ).to( { x: 625, y: 68 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.shaman.eghurt ).to( { x: 625, y: 68+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.shaman.egblood ).to( { x: 625+50, y: 68+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从w1,w2,w3
                    if(hero.herY == 600-230) {
                        egret.Tween.get( this.shaman.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.shaman.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.shaman.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.shaman.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        this.shaman.heroBlood -= hero.heroHurt;
                        this.shaman.egblood.text = "  "+this.shaman.heroBlood;
                        this.addChild( this.shaman.egblood );

                        hero.heroBlood -= this.shaman.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );
        
                        egret.Tween.get( this.shaman.phero ).to( { x: 625, y: 68 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.shaman.egname ).to( { x: 625, y: 68 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.shaman.eghurt ).to( { x: 625, y: 68+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.shaman.egblood ).to( { x: 625+50, y: 68+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
           else if(this.e1.herY == 1+230+50) {  //萨满的随从e1攻击
                if(hero.heroName == "rouge") {  //攻击刺客
                    egret.Tween.get( this.e1.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e1.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e1.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e1.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.e1.heroBlood -= hero.heroHurt;
                    this.e1.egblood.text = "  "+this.e1.heroBlood;
                    this.addChild( this.e1.egblood );

                    hero.heroBlood -= this.e1.heroHurt;
                    hero.egblood.text = "  "+hero.heroBlood;
                    this.addChild( hero.egblood );
    
                    egret.Tween.get( this.e1.phero ).to( { x: this.e1.herX, y: this.e1.herY-50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e1.egname ).to( { x: this.e1.herX, y: this.e1.herY-50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e1.eghurt ).to( { x: this.e1.herX, y: this.e1.herY-50+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e1.egblood ).to( { x: this.e1.herX+50, y: this.e1.herY-50+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从w1,w2,w3
                    if(hero.herY == 600-230) {
                        egret.Tween.get( this.e1.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e1.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e1.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e1.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        this.e1.heroBlood -= hero.heroHurt;
                        this.e1.egblood.text = "  "+this.e1.heroBlood;
                        this.addChild( this.e1.egblood );

                        hero.heroBlood -= this.e1.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );
        
                        egret.Tween.get( this.e1.phero ).to( { x: this.e1.herX, y: this.e1.herY-50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e1.egname ).to( { x: this.e1.herX, y: this.e1.herY-50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e1.eghurt ).to( { x: this.e1.herX, y: this.e1.herY-50+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e1.egblood ).to( { x: this.e1.herX+50, y: this.e1.herY-50+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
           else if(this.e2.herY == 1+230+50) {  //萨满的随从e2攻击
                if(hero.heroName == "rouge") {  //攻击刺客
                    egret.Tween.get( this.e2.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e2.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e2.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e2.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.e2.heroBlood -= hero.heroHurt;
                    this.e2.egblood.text = "  "+this.e2.heroBlood;
                    this.addChild( this.e2.egblood );

                    hero.heroBlood -= this.e2.heroHurt;
                    hero.egblood.text = "  "+hero.heroBlood;
                    this.addChild( hero.egblood );
    
                    egret.Tween.get( this.e2.phero ).to( { x: this.e2.herX, y: this.e2.herY-50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e2.egname ).to( { x: this.e2.herX, y: this.e2.herY-50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e2.eghurt ).to( { x: this.e2.herX, y: this.e2.herY-50+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e2.egblood ).to( { x: this.e2.herX+50, y: this.e2.herY-50+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从w1,w2,w3
                    if(hero.herY == 600-230) {
                        egret.Tween.get( this.e2.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e2.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e2.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e2.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        this.e2.heroBlood -= hero.heroHurt;
                        this.e2.egblood.text = "  "+this.e2.heroBlood;
                        this.addChild( this.e2.egblood );

                        hero.heroBlood -= this.e2.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );
        
                        egret.Tween.get( this.e2.phero ).to( { x: this.e2.herX, y: this.e2.herY-50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e2.egname ).to( { x: this.e2.herX, y: this.e2.herY-50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e2.eghurt ).to( { x: this.e2.herX, y: this.e2.herY-50+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e2.egblood ).to( { x: this.e2.herX+50, y: this.e2.herY-50+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
           else if(this.e3.herY == 1+230+50) {  //萨满的随从e3攻击
                if(hero.heroName == "rouge") {  //攻击刺客
                    egret.Tween.get( this.e3.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e3.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e3.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e3.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                    
                    //改变血量
                    this.e3.heroBlood -= hero.heroHurt;
                    this.e3.egblood.text = "  "+this.e3.heroBlood;
                    this.addChild( this.e3.egblood );

                    hero.heroBlood -= this.e3.heroHurt;
                    hero.egblood.text = "  "+hero.heroBlood;
                    this.addChild( hero.egblood );
    
                    egret.Tween.get( this.e3.phero ).to( { x: this.e3.herX, y: this.e3.herY-50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e3.egname ).to( { x: this.e3.herX, y: this.e3.herY-50 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e3.eghurt ).to( { x: this.e3.herX, y: this.e3.herY-50+97 }, 600, egret.Ease.circIn );
                    egret.Tween.get( this.e3.egblood ).to( { x: this.e3.herX+50, y: this.e3.herY-50+97 }, 600, egret.Ease.circIn );
                } else  {  //攻击萨满的随从w1,w2,w3
                    if(hero.herY == 600-230) {
                        egret.Tween.get( this.e3.phero ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e3.egname ).to( { x: hero.herX, y:hero.herY }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e3.eghurt ).to( { x: hero.herX, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        egret.Tween.get( this.e3.egblood ).to( { x: hero.herX+50, y:hero.herY+97 }, 300, egret.Ease.circIn );
                        
                        //改变血量
                        this.e3.heroBlood -= hero.heroHurt;
                        this.e3.egblood.text = "  "+this.e3.heroBlood;
                        this.addChild( this.e3.egblood );

                        hero.heroBlood -= this.e3.heroHurt;
                        hero.egblood.text = "  "+hero.heroBlood;
                        this.addChild( hero.egblood );
        
                        egret.Tween.get( this.e3.phero ).to( { x: this.e3.herX, y: this.e3.herY-50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e3.egname ).to( { x: this.e3.herX, y: this.e3.herY-50 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e3.eghurt ).to( { x: this.e3.herX, y: this.e3.herY-50+97 }, 600, egret.Ease.circIn );
                        egret.Tween.get( this.e3.egblood ).to( { x: this.e3.herX+50, y: this.e3.herY-50+97 }, 600, egret.Ease.circIn );
                    }
                }
           }
        }

            if(hero.heroName != "shaman") {
                //重置萨满位置
                this.shaman.herX = 625;
                this.shaman.herY = 68;
                egret.Tween.get( this.shaman.phero ).to( { x: this.shaman.herX, y:this.shaman.herY }, 300, egret.Ease.circIn );
                egret.Tween.get( this.shaman.egname ).to( { x: this.shaman.herX, y:this.shaman.herY }, 300, egret.Ease.circIn );
                egret.Tween.get( this.shaman.eghurt ).to( { x: this.shaman.herX, y:this.shaman.herY+97 }, 300, egret.Ease.circIn );
                egret.Tween.get( this.shaman.egblood ).to( { x: this.shaman.herX+50, y:this.shaman.herY+97 }, 300, egret.Ease.circIn );
            }
            //重置萨满随从位置

            if(hero.heroName != "rouge") {
                //重置刺客位置
                this.rouge.herX = 625;
                this.rouge.herY = 518;
                egret.Tween.get( this.rouge.phero ).to( { x: this.rouge.herX, y:this.rouge.herY }, 300, egret.Ease.circIn );
                egret.Tween.get( this.rouge.egname ).to( { x: this.rouge.herX, y:this.rouge.herY }, 300, egret.Ease.circIn );
                egret.Tween.get( this.rouge.eghurt ).to( { x: this.rouge.herX, y:this.rouge.herY+97 }, 300, egret.Ease.circIn );
                egret.Tween.get( this.rouge.egblood ).to( { x: this.rouge.herX+50, y:this.rouge.herY+97 }, 300, egret.Ease.circIn );
            }

            if(hero.heroName != "w1") {
                if(this.w1.herY == 600-230-50) {
                    this.w1.herY = 600-230;
                    egret.Tween.get( this.w1.phero ).to( { x: this.w1.herX, y:this.w1.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w1.egname ).to( { x: this.w1.herX, y:this.w1.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w1.eghurt ).to( { x: this.w1.herX, y:this.w1.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w1.egblood ).to( { x: this.w1.herX+50, y:this.w1.herY+97 }, 300, egret.Ease.circIn );
                }
            }
            if(hero.heroName != "w2") {
                if(this.w2.herY == 600-230-50) {
                    this.w2.herY = 600-230;
                    egret.Tween.get( this.w2.phero ).to( { x: this.w2.herX, y:this.w2.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w2.egname ).to( { x: this.w2.herX, y:this.w2.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w2.eghurt ).to( { x: this.w2.herX, y:this.w2.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w2.egblood ).to( { x: this.w2.herX+50, y:this.w2.herY+97 }, 300, egret.Ease.circIn );
                }
            }
            if(hero.heroName != "w3") {
                if(this.w3.herY == 600-230-50) {
                    this.w3.herY = 600-230;
                    egret.Tween.get( this.w3.phero ).to( { x: this.w3.herX, y:this.w3.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w3.egname ).to( { x: this.w3.herX, y:this.w3.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w3.eghurt ).to( { x: this.w3.herX, y:this.w3.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.w3.egblood ).to( { x: this.w3.herX+50, y:this.w3.herY+97 }, 300, egret.Ease.circIn );
                }
            }

            if(hero.heroName != "e1") {
                if(this.e1.herY == 1+230+50) {
                    this.e1.herY = 1+230;
                    egret.Tween.get( this.e1.phero ).to( { x: this.e1.herX, y:this.e1.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e1.egname ).to( { x: this.e1.herX, y:this.e1.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e1.eghurt ).to( { x: this.e1.herX, y:this.e1.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e1.egblood ).to( { x: this.e1.herX+50, y:this.e1.herY+97 }, 300, egret.Ease.circIn );
                }
            }
            if(hero.heroName != "e2") {
                if(this.e2.herY == 1+230+50) {
                    this.e2.herY = 1+230;
                    egret.Tween.get( this.e2.phero ).to( { x: this.e2.herX, y:this.e2.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e2.egname ).to( { x: this.e2.herX, y:this.e2.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e2.eghurt ).to( { x: this.e2.herX, y:this.e2.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e2.egblood ).to( { x: this.e2.herX+50, y:this.e2.herY+97 }, 300, egret.Ease.circIn );
                }
            }
            if(hero.heroName != "e3") {
                if(this.e3.herY == 1+230+50) {
                    this.e3.herY = 1+230;
                    egret.Tween.get( this.e3.phero ).to( { x: this.e3.herX, y:this.e3.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e3.egname ).to( { x: this.e3.herX, y:this.e3.herY }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e3.eghurt ).to( { x: this.e3.herX, y:this.e3.herY+97 }, 300, egret.Ease.circIn );
                    egret.Tween.get( this.e3.egblood ).to( { x: this.e3.herX+50, y:this.e3.herY+97 }, 300, egret.Ease.circIn );
                }
            }
    }
}

interface Heroproperty {  //英雄的部分属性借口
    phero: egret.Bitmap;  //英雄图片绘制
    heroName: string;  //英雄名字
    egname: egret.TextField;  //英雄名字绘制
    pname: string;  //英雄图片名
    heroHurt: number;  //英雄伤害值
    eghurt: egret.TextField;  //英雄伤害值绘制
    heroBlood: number;  //英雄血量
    egblood: egret.TextField;  //英雄血量绘制
    herX: number;  //英雄横坐标
    herY: number;  //英雄纵坐标
    clickNum: number;  //英雄被点击次数（用来判断该英雄位置和选中状态）
}
//英雄类
class Hero extends Main {
    public phero: egret.Bitmap;  //英雄图片绘制
    public heroName: string;  //英雄名字
    public egname: egret.TextField;  //英雄名字绘制
    public pname: string;  //英雄图片名
    public heroHurt: number;  //英雄伤害值
    public eghurt: egret.TextField;  //英雄伤害值绘制
    public heroBlood: number;  //英雄血量
    public egblood: egret.TextField;  //英雄血量绘制
    public herX: number;  //英雄横坐标
    public herY: number;  //英雄纵坐标
    public clickNum: number;  //英雄被点击次数（用来判断该英雄位置和选中状态）

    public constructor(name: string, pname: string, hurt: number, blood: number, x: number, y: number, cn: number) {  //构造函数
        super();
        this.heroName = name;
        this.pname = pname;
        this.heroHurt = hurt;
        this.heroBlood = blood;
        this.herX = x;
        this.herY = y;
        this.clickNum = cn;
    }
}