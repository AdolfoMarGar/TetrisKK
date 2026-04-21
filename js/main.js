const ANCHO_MENU = window.innerWidth;
const ALTO_MENU = window.innerHeight;
const COLUMNA_1 = ANCHO_MENU*0.3;
const COLUMNA_2 = ANCHO_MENU*0.65;
const ALTURA_1= ALTO_MENU*0.4;
const ALTURA_2=ALTO_MENU*0.62;
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
        // fondo.scale.setTo()
        let botonplay = game.add.button(COLUMNA_1, ALTURA_1, 'play1', this.iniciarJuego, this);
        botonplay.anchor.setTo(0.5,0.5);
        
        let botoncred=game.add.button(COLUMNA_1, ALTURA_2, 'play1', this.verCreditos, this);
        botoncred.anchor.setTo(0.5,0.5);

        let botonniv=game.add.button(COLUMNA_2, ALTURA_1 , 'play1', this.verNiveles, this);
        botonniv.anchor.setTo(0.5,0.5);

        let botonrank=game.add.button(COLUMNA_2, ALTURA_2 , 'play1', this.verRanking, this);
        botonrank.anchor.setTo(0.5,0.5);

        
        let estitulo = {font: "100px Arial", fill:"#FF00FF" , align:"center"}
        let titulo= game.add.text(game.world.width * 0.5, game.world.height * 0.15,"TETRIS",estitulo);
        titulo.anchor.setTo(0.5, 0.5);

    },
    iniciarJuego : function(){
        game.scale.setGameSize(gameWidth+gameWidthExtra, gameHeight);
        game.state.start('Game');
    },
    verCreditos: function(){
        game.state.start('Creditos');
    },
    verNiveles: function(){
        game.state.start('Niveles');
    },
    verRanking:function(){
        game.state.start('Ranking')
    }
};
let creditosState={
    create : function(){
        //game.scale.setGameSize(window.innerWidth, window.innerHeight);
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        let estitulo = {font: "100px Arial", fill:"#1be6f5" , align:"center"}
        let titulo= game.add.text(game.world.width * 0.5, game.world.height * 0.15,"CRÉDITOS",estitulo);
        titulo.anchor.setTo(0.5, 0.5);
        let botonVolver = game.add.button(game.world.width * 0.5, game.world.height * 0.8548387096774194, 'play1', this.volverMenu, this);
        botonVolver.anchor.setTo(0.5,0.5);
        let txtCred = game.add.text(game.world.width * 0.5, game.world.height * 0.5, "Adolfo A. Martinez García\nIker Bélles Barreda\nValeria F. Berrospi Escobar ", { font: "20px Arial", fill: "#000" });
        txtCred.anchor.setTo(0.5,0.5);
    },
    volverMenu : function(){
        game.state.start('Menu'); 
    }
};
let nivelesState={
    create : function(){
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        let estitulo = {font: "100px Arial", fill:"#f5ee1b" , align:"center"}
        let titulo= game.add.text(game.world.width * 0.5, game.world.height * 0.15,"NIVELES",estitulo);
        titulo.anchor.setTo(0.5, 0.5);
        let botonVolver2 = game.add.button(game.world.width * 0.5, game.world.height * 0.8548387096774194, 'play1', this.volverMenu, this);
        botonVolver2.anchor.setTo(0.5,0.5);
    },
    volverMenu : function(){
        game.state.start('Menu'); 
    }
};
let rankingState={
     create : function(){
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        let estitulo = {font: "100px Arial", fill:"#671bf5" , align:"center"}
        let titulo= game.add.text(game.world.width * 0.5, game.world.height * 0.15,"RANKING",estitulo);
        titulo.anchor.setTo(0.5, 0.5);
        let botonVolver2 = game.add.button(game.world.width * 0.5, game.world.height * 0.8548387096774194, 'play1', this.volverMenu, this);
        botonVolver2.anchor.setTo(0.5,0.5);
    },
    volverMenu : function(){
        game.state.start('Menu'); 
    }
}

let game = new Phaser.Game(ANCHO_MENU, ALTO_MENU, Phaser.CANVAS, 'game');
game.state.add("Menu",menuState);
game.state.add('Game', gameState);
game.state.add("Creditos",creditosState);
game.state.add("Niveles",nivelesState);
game.state.add("Ranking",rankingState);

game.state.start("Menu");

