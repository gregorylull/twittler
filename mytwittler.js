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

/*

OBJECTIVES:

  1. display msgs (auto or button)
  2. display timestamp
  3. design interface
  4. click on username to show their msgs (follow)
     - username background color change on hover
     - display options:
         a. hide other tweets? changes flow of page
	 b. create new vertical division to the right with close button?
	   
  5. time shown in convenient format
     - time display: difference between current time and time generated
     - so, message time has to be constantly updated
     - local time: timeObj.toLocaleTimeString();
     
  6. tweet messages
     - create a text box and a tweet button
     - prompt for username? // login screen
*/

// returns a jQuery DIV obj containing a username, their message, and time
function msgOutput (username, msg, timeCreated) {

    // USER NAME
    var $user = $('<p></p>').addClass(username + ' username').text('@' + username);

    // MESSAGE
    var $message = $('<p></p>').addClass('message').text(msg);

    // TIME
    var $time = $('<time></time>').addClass('time');
    $time.attr('datetime', timeCreated).text(friendlyTimeOutput(timeCreated));

    // all information are children of $msgContainer, a jQuery DIV object
    var $msgContainer = $('<div></div>').addClass('messageContainer');    
    $msgContainer.append($user).append($message).append($time);

    return $msgContainer;
}

// does not return a value, calls function 'msgOutput' on each extracted msg
function msgExtract (numberOfMsgs) {
    // 10 messages are extracted by default
    numberOfMsgs = numberOfMsgs || 10;
    
    // the last messages in the streams.home array are the newest
    var $newMsgs = streams.home.slice(-numberOfMsgs);

        // iterates through each message, add
	for (var i = 0; i < numberOfMsgs; i++) {
	    var name = $newMsgs[i].user;
	    var msg  = $newMsgs[i].message;
	    var time = $newMsgs[i].created_at;
            
            // prepends the newest messages to the body.div element
	    $('.allMessages').prepend(msgOutput(name, msg, time));
	}    
}

/*
  friendly output of time
     - if diff between time generated and current time is:
         1 min <    // 'less than a minute ago'     // 
	 1 hr <=    // ' __ mins ago'
	 12 hr <=   // ' __ hrs ago'
         1 day <=   // ' today @ time '
	 2 days <=  // 'yesterday @ time'
	 all else   // 'day @ time'

     - *note* does not account for plural, e.g. hour vs hours

*/
function friendlyTimeOutput(dateObj) {
    var currentTime = new Date();
    var timeDiff    = (currentTime - dateObj) / 1000;

    // times
    var oneSec    = 1
        oneMin    = oneSec * 60,
        oneHour   = oneMin * 60,
        halfDay   = oneHour * 12,
        oneDay    = oneHour * 24,
        twoDays   = oneDay * 2;

    // return message to use 
    var outputMsg = {
	oneMin   : "less than a minute ago",
	oneHour  : " minutes ago",
	halfDay  : " hours ago",
        oneDay   : "earlier today at: ",
        twoDays  : "yesterday at: ",
        allElse  : "posted: "
    };
    
    // < 1 min
    if (timeDiff < oneMin) {
	return outputMsg.oneMin;

    // < 1 hour, prepend timeDiff in hours
    } else if ( timeDiff < oneHour) {
	return '' + Math.floor( timeDiff / oneMin ) +  outputMsg.oneHour;

    // < half a day, 12 hours
    } else if ( timeDiff < halfDay ) {
	return '' + Math.floor(timeDiff / oneHour) + outputMsg.halfDay;

    // < one day, 24 hours
    } else if ( timeDiff < oneDay ) {
	return outputMsg.oneDay + Math.floor(timeDiff / oneHour);

    // < two days
    } else if (timeDiff < twoDays) {
	return outputMsg.twoDays + dateObj.toLocaleTimeString();

    // all else
    } else {
	return dateObj.toLocaleTimeString();
    }
     
}

// testing out page creation using jQuery only with content-less html file
$(document).ready(function() {

    /*******************************************************************************
        BODY STRUCTURE
    *******************************************************************************/

    // add a refresh button to show latest tweets
    $('<button>').addClass('refresh').text('refresh tweets').prependTo($('body'));

    // add counters to display current number of msgs and newly generated
    $('<p></p>').addClass('current').appendTo($('body'));    
    $('<p></p>').addClass('newly').appendTo($('body'));

    // add a div for messages only, after buttons and counters
    $('<div></div>').addClass('allMessages').appendTo($('body'));

    /*******************************************************************************
        INITIALIZE VALUES
    *******************************************************************************/
   
     // initial population of page with already generated msgs
    msgExtract(streams.home.length);

    // number of newly created messages AFTER initial message population
 
    setInterval(function () {
	$('.newly').text(streams.home.length - $('.current').text());
    }, 200);

    // number of messages currently displayed AFTEr initial message population
    $('.current').text("current messages: " + streams.home.length);
  
    /*******************************************************************************   
        LOGIC
    *******************************************************************************/

    // when the refresh button is clicked, the most recently generated msgs and
    // their username + time stamp are extracted 
    $('.refresh').on('click', function () {
	msgExtract();
    });
      
});
