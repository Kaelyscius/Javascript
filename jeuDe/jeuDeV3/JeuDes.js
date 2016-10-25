
document.getElementById('btnAjout').onclick = function() {

    jeuDeDes.ajoutJoueur(document.getElementById('nom').value);
    document.getElementById('nom').value="";
}

document.getElementById('btnJouer').onclick = function() {

    jeuDeDes.jeu(30);
}


document.getElementById('btnLoad').onclick = function() {

    jeuDeDes.loadJoueurs();
}

var jeuDeDes = {

    joueurs: [],
    des : [$('#de1'),$('#de2')],
    ajoutJoueur : function(nom,score) {
        score = score || 0;

        if (nom) {
            this.joueurs.push({nom: nom, score: score});
            var tr = document.createElement('tr');
            tr.innerHTML= "<td>"+nom+"</td><td id=score"+this.joueurs.length+">"+score+"</td>";
            document.querySelector('#players table').appendChild(tr);
        }
        else {
            alert('Rentrez un nom !!');
        }

    },
    lancer: function () {
        return parseInt(Math.random() * 6 + 1);
    },
    loadJoueurs : function() {
        var that = this;
        $.ajax({
           dataType : "json",
            url : "../data/players.json",
            success : function(players) {
                $.each(players, function(i,player) {
                   that.ajoutJoueur(player.nom,player.score);
                });
            },
            error : function(event, xhr, settings, thrown) {

                switch (event.status) {
                    case 404 :
                        alert('Probleme de connexion, entrez les joueurs manuellement ou réessayez plus tard')
                        break;
                    case 500 :
                        alert('Le serveur est down');
                        break;
                    default : {
                        alert('oups !!!');
                    }
                }
            }
        });
    },

    jeu: function (nbrTours) {
       if( this.joueurs.length <2 ) {
           alert('pas assez de jouers');
           return;
       }

        var de1 = 1, de2 = 1, i=0,j=0;
      //  var that = this;
        var lines =  $('tr');
        var timer = setInterval($.proxy(function() {

            var prec =(j==0)?this.joueurs.length:j;

            lines.eq(prec).removeClass('joueur');
            de1 = this.lancer();
            this.des[0].attr('src','images/DES'+de1+'.jpg');
            de2 = this.lancer();
            this.des[1].attr('src','images/DES'+de2+'.jpg');
            lines.eq(j+1).addClass('joueur');
            if (de1 == de2) {
                this.joueurs[j].score ++;
                $('#score'+(j+1)).text(this.joueurs[j].score);
            }

            j++;
            if (j==this.joueurs.length) {
                j=0;i++
            }
            if (i == nbrTours) {
                clearInterval(timer);
            }
        },this),500);


    },
    gagnant: function () {
        var max = 0, winners = [];
        for (var i = 0; i <  this.joueurs.length; i++) {
            if (max < this.joueurs[i].score ) {
                max =this.joueurs[i].score;
            }
        }
        for (i = 0; i < this.joueurs.length; i++) {
            if (max == this.joueurs[i].score) {
                winners.push(this.joueurs[i]);
            }
        }
        return winners;
    }
}


