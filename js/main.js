const ANCHO_MENU=1200;
const ALTO_MENU= 620;
let menuState={
    preload: function(){
        
        game.load.image("fondo","assets/fondo.jpg");
        game.load.image("play1","assets/play1.png");
    },
    create: function(){
       // game.scale.setGameSize(window.innerWidth, window.innerHeight);
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        let botonplay = game.add.button(game.world.centerX-250, game.world.centerY-50, 'play1', this.iniciarJuego, this);
        botonplay.anchor.setTo(0.5,0.5);
        
        let botoncred=game.add.button(game.world.centerX-250, game.world.centerY +80, 'play1', this.verCreditos, this);
        botoncred.anchor.setTo(0.5,0,5);

        let botonniv=game.add.button(game.world.centerX+250, game.world.centerY-110 , 'play1', this.verNiveles, this);
        botonniv.anchor.setTo(0.5,0,5);

        let botonrank=game.add.button(game.world.centerX+250, game.world.centerY +80, 'play1', this.verCreditos, this);

        
        let estitulo = {font: "100px Arial", fill:"#FF00FF" , align:"center"}
        let titulo= game.add.text(game.world.centerX - 100, 100,"TETRIS",estitulo);
        titulo.anchor.setTo(0.2, 0.5);

    },
    iniciarJuego : function(){
        game.scale.setGameSize(gameWidth+gameWidthExtra, gameHeight);
        game.state.start('Game');
    },
    verCreditos: function(){
        game.state.start('Creditos');
    },

};
let creditosState={
    create : function(){
        //game.scale.setGameSize(window.innerWidth, window.innerHeight);
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        let estitulo = {font: "100px Arial", fill:"#1be6f5" , align:"center"}
        let titulo= game.add.text(game.world.centerX - 100, 100,"CRÉDITOS",estitulo);
        titulo.anchor.setTo(0.2, 0.5);
        let botonVolver = game.add.button(game.world.centerX, game.world.centerY+220, 'play1', this.volverMenu, this);
        botonVolver.anchor.setTo(0.5,0.5);
        let txtCred = game.add.text(game.world.centerX, game.world.centerY, "Adolfo A. Martinez García\nIker Bélles Barreda\nValeria F. Berrospi Escobar ", { font: "20px Arial", fill: "#000" });
        txtCred.anchor.setTo(0.5,0.5);
    },
    volverMenu : function(){
        game.state.start('Menu'); 
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        let estitulo = {font: "100px Arial", fill:"#f5ee1b" , align:"center"}
        let titulo= game.add.text(game.world.centerX - 100, 100,"NIVELES",estitulo);
        titulo.anchor.setTo(0.2, 0.5);
        let botonVolver2 = game.add.button(game.world.centerX, game.world.centerY+220, 'play1', this.volverMenu, this);
        botonVolver2.anchor.setTo(0.5,0.5);

    }
};
let nivelesState={
    create : function(){

    }
}

let game = new Phaser.Game(ANCHO_MENU, ALTO_MENU, Phaser.CANVAS, 'game');
game.state.add("Menu",menuState);
game.state.add('Game', gameState);
game.state.add("Creditos",creditosState);

game.state.start("Menu");

