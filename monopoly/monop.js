window.onload = function() {
    Monopoly.init();

    Monopoly.play();
}

var Monopoly = {

    gobelet : {
        de1 : 1,
        de2 : 1,
        lancer : function() {
            this.de1 = parseInt(Math.random()*6+1);
            this.de2 = parseInt(Math.random()*6+1);
            return this.de1+this.de2;
        },
        isDouble : function() {

            return (this.de1 == this.de2);
        }

    },
    plateau : [],
    joueurs : [],
    init : function() {

        // Créer les cases (les relier) et remplir le plateau
        // creation case 0




        //création du plateau
        for (var i = 0; i < 40; i++) {

            switch (i) {
                case 0 :
                    this.plateau[i] = new Monopoly.CaseDepart();
                    break;
                default :
                    if (cases[i].prix) {
                        this.plateau[i] = new Monopoly.Propriete(i,cases[i].nom,cases[i].prix);

                    }
                    else {
                        this.plateau[i] = new Monopoly.Case(i,cases[i].nom);
                    }
            }
        }

        for (var i=0;i<39;i++) {
            // relier case i et case i+1
            this.plateau[i].suivante = this.plateau[i+1];
        }

        // relier deniere case et premiere case
        this.plateau[39].suivante = this.plateau[0];


        // creation des joueurs
        for (var i=0;i<3;i++) {
            this.joueurs.push(new Monopoly.Joueur("Joueur"+(i+1)));
        }

    },
    play : function() {

        for (var i=0;i<50;i++) {
            for (var j=0;j<this.joueurs.length;j++) {
                this.joueurs[j].jouerTour();
            }

        }

    }

}

Monopoly.Joueur = function(nom) {
    this.nom = nom;
    this.solde = 200;
    this.position = Monopoly.plateau[0];

}
Monopoly.Joueur.prototype.jouerTour = function() {

    var res = Monopoly.gobelet.lancer();
    for (var i = 0; i < res-1; i++) {
        this.position = this.position.suivante;
        this.position.passer(this);
    }
    this.position = this.position.suivante;
    this.position.arret(this);
}

Monopoly.Joueur.prototype.depotOuRetrait = function (montant) {
    if (montant < 0) {

        if ( this.solde >= -montant ) {
            this.solde += montant;
        }
        else {

            this.perdu();
            // throw this;
        }

    }
    else { this.solde += montant;}
}

Monopoly.Joueur.prototype.perdu = function () {
    for (var i=0; i< Monopoly.plateau.length; i++) {
        if (Monopoly.plateau[i].proprietaire == this) {
            Monopoly.plateau[i].proprietaire == null;
        }
    }
    Monopoly.joueurs.splice(Monopoly.joueurs.indexOf(this),1);
    console.log(this.nom + " a perdu");
}
Monopoly.Case = function(num,nom) {
    this.num = num;
    this.nom = nom;
    this.suivante = null;

};
Monopoly.Case.prototype.arret = function(joueur) {

    console.log('le joueur ' + joueur.nom + ' s\'arrete sur '+this.nom+
        ' et possede '+joueur.solde+' euros');

};

Monopoly.Case.prototype.passer = function(joueur) {

    // console.log('le joueur ' + joueur.nom + ' passe sur '+this.nom);

};
Monopoly.CaseDepart = function() {

    Monopoly.Case.apply(this,[0,"Depart"]);

    this.arret = function(joueur) {
        joueur.solde += 400;
    };
    this.passer = function(joueur) {
        joueur.solde += 200;
    };

}

Monopoly.Propriete = function(num,nom, prix) {

    Monopoly.Case.apply(this,[num,nom]);

    this.proprietaire = null;
    this.prix = prix;
}

Monopoly.Propriete.prototype = new Monopoly.Case();

Monopoly.Propriete.prototype.arret = function(joueur) {

    if (this.proprietaire== null && joueur.solde > this.prix) {
        joueur.depotOuRetrait(- this.prix);
        this.proprietaire = joueur;
    }
    else {
        if (this.proprietaire!= null && this.proprietaire!= joueur ) {
            joueur.depotOuRetrait(- this.prix);
            this.proprietaire.depotOuRetrait( this.prix);
        }
    }

}