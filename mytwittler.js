/*
$(document).ready(function(){
  var $body = $('body');
  $body.html('');

  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    var $tweet = $('<div></div>');
    $tweet.text('@' + tweet.user + ': ' + tweet.message);
    $tweet.appendTo($body);
    index -= 1;
  }

});
*/

function msgOutput (username, msg, timeCreated) {
    
    var $msgContainer = $('<div></div>').addClass('messageContainer');
    var $user = $('<div></div>').addClass(username).text(username);
    var $message = $('<p></p>').addClass('message').text(msg);
    var $time = $('<time></time>').addClass('time').attr('datetime', timeCreated).text(timeCreated);

    $user.prepend($message);
    $msgContainer.prepend($user).append($time);

    return $msgContainer;
    console.log($msgContainer);
}

$(document).ready(function() {
    // add a button to show latest tweets
    $('<button>').addClass('refresh').text('refresh tweets').prependTo($('body'));

    // create a container for user

    $('.refresh').on('click', function () {
	var $newMsgs = streams.home.slice(-10);

	for (var i = 0; i < 10; i++) {
	    var name = $newMsgs[i].user;
	    var msg  = $newMsgs[i].message;
	    var time = $newMsgs[i].created_at;
	    $('body').append(msgOutput(name, msg, time));
	}
    });
      
});
