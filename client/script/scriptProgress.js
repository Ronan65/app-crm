$(function() {
  
  $('input[type="submit"]').on('click', function(evt) {
    evt.preventDefault();
    var formData = new FormData();
    var file = document.getElementById('loadDB').files[0];
    formData.append('loadDB', file);
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('post', '/db/upload', true);
    
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        $('div.progress div.progress-bar').css('width', percentage + '%');

      }
    };
    
    xhr.send(formData);
    
  });
  
});