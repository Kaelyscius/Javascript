$(function() {


    function De(id) {

        this.id = id;
        this.node = $('#de'+id);
        this.selected = false;
        this.valeur =1;

        this.lancer = function() {
            this.valeur = parseInt(Math.random()*6+1);
            this.node.children(':first').attr('src',"images/DES"+this.valeur+".jpg");
        };

        var that = this;
        this.node.on('click', function() {
            $(this).toggleClass('rollnot');
            that.selected = !that.selected;
        });

    }
    var jeu = {
        tour : 1,
        des : [],
        init : function() {
            for (var i=1;i<6;i++) {
                this.des.push(new De(i));
            }

            $('#roll').on('click', $.proxy(this.jouerTour,this));
        },
        jouerTour : function() {

            if (this.tour==1) {
                $.each(this.des, function(index,de) {
                    de.node.removeClass("rollnot");
                    de.selected = false;
                    de.lancer();
                });
            }
            else if (this.tour <5) {
                $.each(this.des, function(index,de) {
                    if (!de.selected) {
                        de.lancer();
                    }
                });
            }
            else {
                alert('perdu');

                return;
            }
            var deun = this.des[0].valeur;
            if ($.grep(this.des, function(item) {  return item.valeur==deun; }).length === 5) {
                alert('gagné');
            }
            this.tour++;
        }

    }

    jeu.init();


});