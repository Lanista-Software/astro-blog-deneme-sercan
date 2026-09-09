jQuery(document).ready(function ($) {
  // console.log("custom-pagination.js executed");

  $("a.next").each(function () {
    var dynamicLink = $(this).attr("href");
    $(this).attr("class", "next page-numbers");
    $(this).html('Next <span aria-hidden="true">→</span>');
    $(this).attr("href", dynamicLink);
  });

  $("a.prev").each(function () {
    var dynamicLink = $(this).attr("href");
    $(this).attr("class", "prev page-numbers");
    $(this).html('<span aria-hidden="true">←</span> Previous');
    $(this).attr("href", dynamicLink);
  });
});
