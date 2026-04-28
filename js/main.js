const ANCHO_MENU = window.innerWidth*0.85;
const ALTO_MENU = window.innerHeight*0.85;
const COLUMNA_1 = ANCHO_MENU*0.4;
const COLUMNA_2 = ANCHO_MENU*0.60;
const ALTURA_1= ALTO_MENU*0.5;
const ALTURA_2=ALTO_MENU*0.65;

let menuState={
    preload: function(){
        
        game.load.image("fondo","assets/fondo.jpg");
        game.load.image("fondoC","assets/fondoC.jpg");
        game.load.image("fondoN","assets/fondoN.jpg");
        game.load.image("fondoR","assets/fondoR.jpg");
        game.load.image("play","assets/play.png");
        game.load.image("cred","assets/cred.png");
        game.load.image("rank","assets/rank.png");
        game.load.image("nivel","assets/nivel.png");
        game.load.image("nom","assets/nom.png");
        game.load.image("volver","assets/volver1.png");
    },
    create: function(){
       // game.scale.setGameSize(window.innerWidth, window.innerHeight);
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = ANCHO_MENU;   
        fondo.height = ALTO_MENU;
        // fondo.scale.setTo()
        let botonplay = game.add.button(COLUMNA_1, ALTURA_1, 'play', this.iniciarJuego, this);
        botonplay.anchor.setTo(0.5,0.5);
        
        let botoncred=game.add.button(COLUMNA_1, ALTURA_2, 'cred', this.verCreditos, this);
        botoncred.anchor.setTo(0.5,0.5);

        let botonniv=game.add.button(COLUMNA_2, ALTURA_1 , 'nivel', this.verNiveles, this);
        botonniv.anchor.setTo(0.5,0.5);

        let botonrank=game.add.button(COLUMNA_2, ALTURA_2 , 'rank', this.verRanking, this);
        botonrank.anchor.setTo(0.5,0.5);
        
        let botonnom=game.add.button(COLUMNA_2+300, ALTURA_2+78 , 'nom');
        botonnom.anchor.setTo(0.5,0.5);

        

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
    },

};
let creditosState={
    create : function(){
        //game.scale.setGameSize(window.innerWidth, window.innerHeight);
        let fondo = game.add.sprite(0, 0, "fondoC");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        let botonVolver = game.add.button(game.world.width * 0.5, game.world.height * 0.8548387096774194, 'volver', this.volverMenu, this);
        botonVolver.anchor.setTo(0.5,0.5);

    },
    volverMenu : function(){
        game.state.start('Menu'); 
    }
};
let nivelesState={
    create : function(){
        let fondo = game.add.sprite(0, 0, "fondoN");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;

        let botonVolver2 = game.add.button(game.world.width * 0.5, game.world.height * 0.8548387096774194, 'volver', this.volverMenu, this);
        botonVolver2.anchor.setTo(0.5,0.5);
    },
    volverMenu : function(){
        game.state.start('Menu'); 
    }
};
let rankingState={
     create : function(){
        let fondo = game.add.sprite(0, 0, "fondoR");
        fondo.width = ANCHO_MENU;
        fondo.height = ALTO_MENU;
        
        let botonVolver2 = game.add.button(game.world.width * 0.5, game.world.height * 0.8548387096774194, 'volver', this.volverMenu, this);
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
