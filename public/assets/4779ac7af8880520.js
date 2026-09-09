jQuery(document).ready(function ($) {
  // console.log("rcp-registration.js executed");

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        $(mutation.addedNodes).each(function () {
          var element = $(this);
          if (element.hasClass("rcp_gateway_stripe_fields")) {
            element.prepend(
              "<h3 class='rcp_gateway_stripe_title'>Card Details</h3>"
            );
            observer.disconnect(); // Stop observing once we've made our modification
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true, // observe all descendants of body
  });

  //
  $(document).ready(function () {
    // Add keyup event listener to Company Name field
    $("#field_q25j2205kehk").on("input", function () {
      // Update Team Name with Company Name's value
      $("#rcpga-group-name").val($(this).val());
    });
  });

  // make upgrade notices full width
  jQuery(".ps-rcp-company-details p:not([class])").addClass(
    "ps-grid-column-full"
  );
});
