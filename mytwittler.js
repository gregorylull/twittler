/*

OBJECTIVES:

        Required: 
done    1. display msgs (auto or button)                      
done    2. display timestamp
so-so   3. design interface
done    4. click on username to show their msgs (follow)
           - username background color change on hover
           - display options:
               a. hide other tweets? changes flow of page
      	 b. create new vertical division to the right with close button?

        Optional: 	   
done    5. time shown in convenient format
           - time display: difference between current time and time generated
           - so, message time has to be constantly updated
           - local time: timeObj.toLocaleTimeString();
           
        6. tweet messages
           - create a text box and a tweet button
           - prompt for username? // login screen
*/


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

    // add a div for ALL messages only, after buttons and counters
    $('<div></div>').addClass('allMessages').appendTo($('body'));

    // add a div for following users, after ALL messages
    $('<div></div>').addClass('followMessages').appendTo($('body'));

    /*******************************************************************************
        INITIALIZE VALUES
    *******************************************************************************/
    // current number of message objects in streams.home
    var currentlyDisplayed = streams.home.length;

    // initial population of page with already generated msgs
    msgExtract(currentlyDisplayed);

    // number of newly created messages AFTER initial message population
    // newly generated msgs  = streams TOTAL messages - currently displayed
    var newly = streams.home.length - currentlyDisplayed;
    setInterval(function () {
        newly = streams.home.length - currentlyDisplayed;
	$('.newly').text("new messages:     " + newly);
    }, 200);

    // number of messages currently displayed AFTEr initial message population
    var $currentCount = $('.current').text("current messages: " + streams.home.length);
  
    /*******************************************************************************   
        LOGIC
    *******************************************************************************/

    // when the refresh button is clicked, the most recently generated msgs and
    // their username + time stamp are extracted 
    $('.refresh').on('click', function () {
	newly = streams.home.length - $('.allMessages div').length;
	msgExtract(newly);
        currentlyDisplayed += newly;
        $currentCount.text("current messages: " + currentlyDisplayed);   
    });

    // TIME output will be refreshed every 5 seconds to display user friendly time
    setInterval(function () {
        $('time', $('.allMessages')).each( function () {
	    var $self = $(this);
	    var newTime = friendlyTimeOutput(new Date($self.attr('datetime')));
            $self.text(newTime);
	});
    }, 5000);

    // Follow a user:
    // When a username is clicked, the right side of the page will be populated
    // with that user's messages
    $('.allMessages').on('click', '.username', function (event) {
	var username = $(this).attr('class').split(' ')[0];
        console.log("on click : " + username); 
	userExtract(username);
    });

    // the following two event statements are for mouse hovering
    // change username div color on mouse enter
    $('.allMessages').on('mouseenter', '.username', function (event) {
	$(this).css('background-color', 'orange');
    });
    
    // change username div color on mouse leave
    $('.allMessages').on('mouseleave', '.username', function (event) {
	$(this).css('background-color', 'yellow');
    });

});
/*******************************************************************************

    helper functions

notetoself: 
$('.time').on('click', function (event) { event.target.innerHTML = 'test';});

friendlyTimeOutput(new Date($('time').attr('datetime')));

*******************************************************************************/

// does not return a value, calls function 'msgOutput' on each extracted msg
function msgExtract (numberOfMsgs) {
    // all messages are extracted by default
    numberOfMsgs = numberOfMsgs || streams.home.length;
    
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


// Follow a user, extracts messages from streams.user instead.
// all messages are extracted by default
function userExtract (username) {       
    // the last messages in the streams.home array are the newest
    var userMsgs = streams.users[username];

    $('.followMessages').html('');
    $('div.followMessages').css('background-color', 'maroon');

    // iterates through each message, add
    for (var i = 0, len = userMsgs.length; i < len; i++) {
        var name = userMsgs[i].user;
        var msg  = userMsgs[i].message;
        var time = userMsgs[i].created_at;
        
        // prepends the newest messages to the body.div element
        $('.followMessages').prepend(msgOutput(name, msg, time));
    }    
}

// *******************************************************************************
// EXTRA CREDIT
// *******************************************************************************

/*
  takes in an Date() object, compares it to the current time, and returns a 
  string message stating how long ago the Date() object was created

  logic (message not exact)
     - if diff between time generated and current time is:
         1 min <    // 'less than a minute ago'     // 
	 1 hr <=    // ' __ mins ago'
	 12 hr <=   // ' __ hrs ago'
         1 day <=   // ' today @ time '
	 2 days <=  // 'yesterday @ time'
	 all else   // 'day @ time'

     - *note* does not account for plural, e.g. hour vs hours

  future revision: 
     - days ago    . at time
     - weeks ago   . on day at time
     - months ago  . on date at time
     - years ago   - on date at time

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
	oneMin    : "less than a minute ago",
	oneHour   : " minutes ago",
	halfDay   : " hours ago",
        oneDay    : "earlier today at: ",
        yesterday : "yesterday at: ",
        allElse   : "posted: "
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
	return outputMsg.oneDay + dateObj.toLocaleTimeString();

    // yesterday
    } else if (timeDiff < twoDays) {
	return outputMsg.yesterday + dateObj.toLocaleTimeString();

    // all else
    } else {
	return outputMsg.allElse + dateObj.toString();
    }    
}
