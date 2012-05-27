$('#gallery img').click(function(e) {
  e.preventDefault();
  $('#gallery img').first().attr('src', $(this).attr('src'));
});

$(function() {
  // make code pretty
  window.prettyPrint && prettyPrint();
});