/**
 * Attaches a click event listener to each link in the job manager table footer.
 * When a link is clicked, the URL is modified to include a hash fragment that
 * will cause the page to scroll to the job submission form.
 */
// jQuery(document).ready(function ($) {
//   // Find all links in the job manager table footer
//   $("table.job-manager-jobs tfoot a").each(function () {
//     var href = $(this).attr("href");
//     if (href) {
//       // Append a hash fragment to the link's URL
//       $(this).attr("href", href + "#submit");
//     }
//   });
// });

/**
 * Attaches a click event listener to each link that contains 'action=continue' in href.
 * When a link is clicked, the URL is modified to include a hash fragment that
 * will cause the page to scroll to the job submission form.
 */
jQuery(document).ready(function ($) {
  // console.log("job-manager.js executed");

  // Find all links in the job manager table footer
  $("table.job-manager-jobs tfoot a").each(function () {
    var href = $(this).attr("href");
    if (href) {
      // Append a hash fragment to the link's URL
      $(this).attr("href", href + "#submit");
    }
  });

  // Add event listener for appending #submit to URLs that include 'action=continue'
  $('a[href*="action=continue"]').each(function () {
    var href = $(this).attr("href");
    if (href.indexOf("#submit") === -1) {
      // Append #submit to the link's URL if it doesn't already contain it
      $(this).attr("href", href + "#submit");
    }
  });

  // Add event listener for appending #dashboard to URLs that include 'action=edit'
  $('a[href*="action=edit"]').each(function () {
    var href = $(this).attr("href");
    if (href.indexOf("#dashboard") === -1) {
      // Append #dashboard to the link's URL if it doesn't already contain it
      $(this).attr("href", href + "#dashboard");
    }
  });

  /**
   * Attaches a click event listener to the "Preview" button.
   * When the button is clicked, the form's action URL is modified to include a hash fragment that
   * will cause the page to scroll to the job submission form.
   */
  $(
    'input[name="submit_job"], input[name="save_draft"], input[name="edit_job"]'
  ).on("click", function (e) {
    var form = $(this).closest("form");
    var action = form.attr("action");
    var currentUrl = window.location.href;

    // Check if the URL contains 'action=edit'
    if (currentUrl.indexOf("action=edit") === -1) {
      // If 'action=edit' is not in the URL, append #submit
      if (action.indexOf("#submit") === -1) {
        // Append #submit to the form's action URL if it doesn't already contain it
        form.attr("action", action + "#submit");
      }
    }
  });

  // $('input[name="submit_job"]').on("click", function (e) {
  //   var form = $(this).closest("form");
  //   var action = form.attr("action");
  //   if (action.indexOf("#submit") === -1) {
  //     // Append #submit to the form's action URL if it doesn't already contain it
  //     form.attr("action", action + "#submit");
  //   }
  // });

  // Add event listener to the "Dashboard" button
  $(
    "button.gb-button.gb-button-08e070ed.gb-button-text.gb-tabs__button.gb-block-is-current.ps-acc-dashboard"
  ).on("click", function (e) {
    var currentUrl = window.location.href;
    // Check if the URL contains 'action=edit'
    if (currentUrl.indexOf("action=edit") !== -1) {
      // If 'action=edit' is in the URL, navigate to the dashboard URL
      window.location.href =
        "https://poststatus.com/my-account/jobs-dashboard/#dashboard";
    }
  });
  // });

  /**
   * Attaches click event listeners to each button in the "My Account" tab menu.
   * When a button is clicked, the location hash is changed to the corresponding anchor,
   * and the page is scrolled to the anchor's position.
   */
  // jQuery(document).ready(function ($) {
  var buttons = {
    ".ps-acc-dashboard": "#dashboard",
    ".ps-acc-account": "#account",
    ".ps-acc-membership": "#membership",
    ".ps-acc-profile": "#profile",
    ".ps-acc-team": "#team",
    ".ps-acc-members": "#members",
    ".ps-acc-jobs": "#jobs",
    ".ps-acc-slack": "#slack",
    ".ps-acc-newsletter": "#newsletter",
    ".ps-acc-company": "#company",
    ".ps-acc-submit": "#submit",
    ".ps-acc-edit": "#edit",
  };

  var headerOffset = 100;

  $.each(buttons, function (button, anchor) {
    $(button).on("click", function (e) {
      e.preventDefault();
      var $parent = $(anchor).parent();
      $parent.addClass("my-account-tabs-clicked"); // Apply CSS to the parent div of the anchor

      // Change the location hash and scroll
      history.pushState(null, null, anchor);
      $("html, body").animate(
        {
          scrollTop: $(anchor).offset().top - headerOffset,
        },
        200
      );
    });
  });

  //
  $("a:contains('Manage Group')").each(function () {
    $(this)
      .html("<span>Manage team</span>")
      .after(
        "<span class='gb-icon'><svg height='15' width='15' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 15 15'><path stroke='currentColor' d='M13.5 7.5l-4-4m4 4l-4 4m4-4H1'></path></svg></span>"
      );
  });
});
