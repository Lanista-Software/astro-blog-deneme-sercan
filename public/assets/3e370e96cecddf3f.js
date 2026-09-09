/**
 * Initializes the hover effect for the company type on profile cards, and disables the join button if the URL parameter 'status' is set to 'signup'.
 *
 * @return void
 */
jQuery(document).ready(function () {
  // console.log("index.js executed");
  // console.log("Filter Everything Pro AJAX operation finished");

  // Add hover effect to company type on profile cards
  jQuery(".ps-profile").hover(
    function () {
      var companyType = jQuery(this).find(".company-type").text();
      switch (companyType) {
        case "Host":
          jQuery(this).find(".company-type").css({
            backgroundColor: "var(--ps-blue)",
            color: "var(--white)",
          });
          break;
        case "Agency":
          jQuery(this).find(".company-type").css({
            backgroundColor: "var(--ps-orange)",
            color: "var(--white)",
          });
          break;
        default:
          jQuery(this).find(".company-type").css({
            backgroundColor: "var(--contrast)",
            color: "var(--white)",
          });
          break;
      }
    },
    function () {
      // Remove the background color once hover is over
      jQuery(this).find(".company-type").css({
        backgroundColor: "var(--white)",
        color: "var(--contrast)",
      });
    }
  );

  // disable join button if URL has status=signup
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");
  // console.log("status: ", status); // This should log 'signup' if the URL parameter is set correctly
  const joinBtn = jQuery(".freelance-btn");

  if (status === "signup") {
    // console.log("Disabling join button..."); // This should log if the condition is met
    joinBtn.addClass("disabled");
    joinBtn.attr("href", "#");
    joinBtn.css("opacity", "0.6");
  }

  // disable sticky sidebar on the Directory if viewport is too small
  var sidebar = jQuery(
    ".post-type-archive-ps_member_company .inside-left-sidebar, .page-template-page-wordpress_deals .inside-left-sidebar"
  );
  var checkSidebar = function () {
    // Check if viewport height is less than sidebar height
    if (jQuery(window).height() < sidebar.outerHeight()) {
      sidebar.css("position", "initial");
    } else {
      sidebar.css("position", "sticky");
    }
  };
  // Execute when the window is resized
  jQuery(window).resize(checkSidebar);
  // Execute on page load
  checkSidebar();

  /**
   * Initializes the accordion effect for the filters on the Directory page.
   */
  // Define SVG_PLUS and SVG_MINUS here with your actual SVG markup.
  var SVG_PLUS = `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.5 1v13M1 7.5h13" stroke="currentColor"></path></svg>`;

  var SVG_MINUS = `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M1 7.5h13" stroke="currentColor"></path></svg>`;

  // Add the '+' symbol to the headers
  jQuery(
    ".wpc-filters-section:not(.wpc-filters-section-150768, .wpc-filters-section-151030, .wpc-filters-section-155905, .wpc-filters-section-155904s, .wpc-filters-section-161083, .wpc-filters-section-161082s) .wpc-filter-header"
  ).append('<span class="accordion-symbol">' + SVG_PLUS + "</span>");

  jQuery(document).on(
    "click",
    ".wpc-filters-section:not(.wpc-filters-section-150768, .wpc-filters-section-151030, .wpc-filters-section-155905, .wpc-filters-section-155904s, .wpc-filters-section-161083, .wpc-filters-section-161082s) .wpc-filter-header",
    function () {
      jQuery(this)
        .siblings(".wpc-filter-content")
        .slideToggle("slow", function () {
          // Toggle the '+' and '-' symbols based on visibility
          if (jQuery(this).is(":visible")) {
            jQuery(this)
              .siblings(".wpc-filter-header")
              .find(".accordion-symbol")
              .html(SVG_MINUS);
          } else {
            jQuery(this)
              .siblings(".wpc-filter-header")
              .find(".accordion-symbol")
              .html(SVG_PLUS);
          }
        });
    }
  );

  // Hide all .wpc-filter-content sections that are NOT descendants of .wpc-filters-section-150768
  jQuery(
    ".wpc-filters-section:not(.wpc-filters-section-150768, .wpc-filters-section-151030, .wpc-filters-section-155905, .wpc-filters-section-155904s, .wpc-filters-section-161083, .wpc-filters-section-161082s) .wpc-filter-content"
  ).hide();

  // Set up a global AJAX complete handler to hide new .wpc-filter-content sections
  jQuery(document).ajaxComplete(function () {
    jQuery(
      ".wpc-filters-section:not(.wpc-filters-section-150768, .wpc-filters-section-151030, .wpc-filters-section-155905, .wpc-filters-section-155904s, .wpc-filters-section-161083, .wpc-filters-section-161082s) .wpc-filter-content"
    ).hide();
    // Add the '+' symbol to the new headers
    jQuery(
      ".wpc-filters-section:not(.wpc-filters-section-150768, .wpc-filters-section-151030, .wpc-filters-section-155905, .wpc-filters-section-155904s, .wpc-filters-section-161083, .wpc-filters-section-161082s) .wpc-filter-header:not(:has(.accordion-symbol))"
    ).append('<span class="accordion-symbol">' + SVG_PLUS + "</span>");
  });

  // ps-left-container width 100% if ps-right-container is not present
  if (jQuery(".ps-right-container").length === 0) {
    jQuery(".ps-left-container").css("width", "100%");
  }

  // prefix WordPress Companies with 'Partner' on the Directory page
  function prefixTitle() {
    var title = jQuery(".ps-page-title");

    // Only prefix the title with 'Partner ' on the '/wordpress-companies/' page
    if (window.location.pathname === "/wordpress-companies/") {
      title.text("Partner " + title.text());
    } else {
      title.text(title.text().replace("Partner ", ""));
    }

    // Show the title on every page
    title.addClass("show-title");
  }

  // Run the function on page load
  prefixTitle();

  // Run the function when the URL changes
  jQuery(window).on("popstate", function () {
    prefixTitle();
  });

  // Run the function after an AJAX call is complete
  jQuery(document).ajaxComplete(function () {
    var checkExist = setInterval(function () {
      var title = jQuery(".ps-page-title");
      if (title.length) {
        prefixTitle();
        clearInterval(checkExist);
      }
    }, 100); // check every 100ms
  });

  // open bootsrap modal on page load
  if (urlParams.get("show_modal") === "true") {
    jQuery("#frm-modal-0").modal("show");
  }

  // assign a value to hthe hidden field in the sign up form
  jQuery(document).ready(function () {
    var claimedPostId =
      new URLSearchParams(window.location.search).get("claimed_post_id") || "";
    jQuery(".claimed_post_id").val(claimedPostId);
  });

  // show sucess message on the sign up form
  if (window.location.search.indexOf("show_modal=true") > -1) {
    jQuery(
      '<div class="welcome-message">Welcome, you may now claim this profile</div>'
    ).prependTo("#frm_form_73_container");
  }

  // change the text of the billing details on the checkout page
  // Change the text to 'Billing Details'
  jQuery(".ps-rcp-company-details-container h3").text("Billing Details");

  // Show the h3 after the change
  jQuery(".ps-rcp-company-details-container h3").css("visibility", "visible");

  // initialize modal
  jQuery(".sp_sub_details_upgrade").click(function () {
    var target = $(this).data("target");
    jQuery(target).modal("show");
  });

  /**
   * Initialize jQuery to listen for clicks on elements with the class .deal-link
   */
  jQuery(document).ready(function($) {
    // Attach click event listener to elements with class .deal-link
    jQuery('.deal-link').on('click', function() {
        // Retrieve post ID from data attribute
        var postId = $(this).data('post-id');
        
        // Log click event for debugging
        // console.log("Deal link clicked for post ID: " + postId);

        /**
         * Send custom event to Google Analytics 4
         * - Event Name: wp_deal_link
         * - Event Category: deal-link
         * - Event Label: Concatenation of "Post ID " and the actual Post ID
         */
        gtag('event', 'wp_deal_link', {'event_category': 'deal-link', 'event_label': 'Post ID ' + postId});
    });
  });

  // Remove empty blocks
  jQuery(document).ready(function($) {
    // Remove empty widget blocks
    $('aside.widget_block').each(function() {
        if ($.trim($(this).text()) === '' && $(this).children().length === 0) {
            $(this).remove();
        }
    });
  });

  // Black Firday / Cyber Monday banner
  // Function to handle closing the banner and setting the cookie
  function closeBanner() {
    jQuery('#ps-dismissible-banner').fadeOut('slow', function() {
      jQuery(this).remove();
      // Set a cookie to keep the banner closed for 14 days
      Cookies.set('banner-closed', 'true', { expires: 14 });
    });
  }

  // Check if the cookie exists
  if (Cookies.get('banner-closed') !== 'true') {
    // If the cookie does not exist or is not set to true, show the banner
    jQuery('#ps-dismissible-banner').css('display', 'flex').hide().fadeIn('slow');
  }

  // Bind the click event of #close-banner to closeBanner function
  jQuery('#close-banner').click(closeBanner);

  // prevent line breaks in the contact form `your message` field
  jQuery('#field_dfvai, #field_enterprise_partnering').on('keydown', function(e) {
    if (e.which === 13) {  // 13 is the keycode for the "Enter" key
        e.preventDefault();  // Prevent the default action (i.e., inserting a line break)
    }
  }).on('input', function() {
      var text = jQuery(this).val();
      var formattedText = text.replace(/(\r\n|\n|\r)/gm, ' ');  // Replace newline characters with spaces
      jQuery(this).val(formattedText);
  });

});
