$('#gallery img').click(function(e) {
  e.preventDefault();
  $('#gallery img').first().attr('src', $(this).attr('src'));
});


