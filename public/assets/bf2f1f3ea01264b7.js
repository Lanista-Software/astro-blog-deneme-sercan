jQuery(document).ready(function($) {
    // Find all <div> elements with the class 'ps-modal'
    const modalDivs = jQuery('.ps-modal');
  
    // Process each found <div>
    modalDivs.each(function() {
      // Set up the click event for the <div> to open the modal
      jQuery(this).on('click', function(event) {
        // Prevent the default behavior if the click is on the <a> tag
        if (event.target.tagName.toLowerCase() === 'a') {
          event.preventDefault();
        }
  
        // Trigger the modal
        // Adjust these attributes to match your modal link's configuration
        jQuery('#frm-modal-0').modal('show');
      });
  
      // Optional: Change cursor to pointer on <div>, <h3>, and <a> to indicate clickable elements
      jQuery(this).css('cursor', 'pointer');
      jQuery(this).find('h3, a').css('cursor', 'pointer');
    });
  
    // add the `project-expired` class if the projects expiry date is prior to today
      // Prepare the current date with the time reset to midnight for comparison
      var currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // Process each element with the class 'expiry-date'
      $('.expiry-date').each(function() {
          // Extract the date text and parse it into components
          var expiryDateText = $(this).text();
          var parts = expiryDateText.match(/(\w+) (\d+), (\d+)/);
  
          // Proceed only if the date text is in the expected format
          if (parts) {
              var month = parts[1];
              var day = parseInt(parts[2], 10);
              var year = parseInt(parts[3], 10);
  
              // Convert the month name to its numerical representation (0-11)
              var monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
              var monthNumber = monthNames.indexOf(month);
  
              // Create a Date object from the parsed components
              var expiryDate = new Date(year, monthNumber, day);
  
              // If the current date is beyond the expiry date, add the 'project-expired' class
              if (currentDate > expiryDate) {
                  $(this).addClass('project-expired');
              }
          } else {
              // Log an error if the date text could not be parsed
              console.error('Unable to parse expiry date:', expiryDateText);
          }
      });
  });
