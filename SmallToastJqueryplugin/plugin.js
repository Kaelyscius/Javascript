(function($){

    $.pluglog = function(message) {
        var container = $('#log');
        if (container.length ==0) {

            container = $('<div />',{'id':'log'});
            $('body').append(container);
        }
        var divmsg = $('<div />',{'class':'msg'}).html(message);
        divmsg.appendTo(container);
        console.log(divmsg);

        divmsg.delay(3000).fadeOut(1000, function() {
            this.remove();
        });
    }

})(jQuery);