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

// returns a jQuery DIV obj containing a username, their message, and time
function msgOutput (username, msg, timeCreated) {

    // USER NAME
    var $user = $('<p></p>').addClass(username + ' username').text(username);

    // MESSAGE
    var $message = $('<p></p>').addClass('message').text(msg);

    // TIME
    var $time = $('<time></time>').addClass('time');
    $time.attr('datetime', timeCreated).text(timeCreated);

    // all information are children of $msgContainer, a jQuery DIV object
    var $msgContainer = $('<div></div>').addClass('messageContainer');    
    $msgContainer.append($user).append($message).append($time);

    return $msgContainer;
}

// does not return a value, calls function 'msgOutput' on each extracted msg
function msgExtract (numberOfMsgs) {
    // 10 messages are extracted by default
    numberOfMsgs = numberOfMsgs || 10;
    
    var $newMsgs = streams.home.slice(-numberOfMsgs);

        // iterates through each message, add
	for (var i = 0; i < numberOfMsgs; i++) {
	    var name = $newMsgs[i].user;
	    var msg  = $newMsgs[i].message;
	    var time = $newMsgs[i].created_at;
	    $('.allMessages').prepend(msgOutput(name, msg, time));
	}    
}

$(document).ready(function() {
    // add a refresh button to show latest tweets
    $('<button>').addClass('refresh').text('refresh tweets').prependTo($('body'));

    // add a counter to display current number of msgs and newly generated
    $('<p></p>').addClass('current').appendTo($('body'));
    $('<p></p>').addClass('newly').appendTo($('body'));

    setInterval(function () {
	$('.newly').text(streams.home.length - $('.current').text());
    }, 200);

    // add a div for message only, after button
    $('<div></div>').addClass('allMessages').appendTo($('body'));

    // initial population of page with already generated msgs
    $('.current').text(streams.home.length);
    msgExtract(streams.home.length);

    // when the refresh button is clicked, the most recently generated msgs and
    // their username + time stamp are extracted 
    $('.refresh').on('click', function () {
	msgExtract();
    });
      
});
