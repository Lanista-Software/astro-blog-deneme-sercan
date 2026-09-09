// jQuery(document).ready(function($) {
//     $('#close').click(function() {
//         $(this).closest('#ps-dismissible-left').fadeOut('slow', function() {
//             $(this).remove();
//         });
//     });
// });

jQuery(document).ready(function($) {
    $('#close-left').click(function() {
        $(this).closest('#ps-dismissible-left').fadeOut('slow', function() {
            $(this).remove();
        });
    });

    $('#close-right').click(function() {
        $(this).closest('#ps-dismissible-right').fadeOut('slow', function() {
            $(this).remove();
        });
    });
});
