//chatRoom picture Change
var pictuerChange = (function () {
    var myPicture = function () {
        var myMessage = document.getElementsByClassName('myMessage'),
            myMessageLength = myMessage.length,
            myPicture = userPic = document.getElementById('userPic').innerHTML;

        for (var i = 0; i < myMessageLength; i++) {
            myMessage[i].firstChild.innerHTML = myPicture;
        }
    };

    var otherPicture = function () {
        var otherMessage = document.getElementsByClassName('otherMessage'),
            otherMessageLength = otherMessage.length;
        for (var j = 0; j < otherMessageLength; j++) {

        }
    };

    return {
        my: myPicture,
        other: otherPicture
    }
})();

//for chatMenu buttonToggle
var buttonToggle = (function () {
    var menuPopup = function () {
        var info = document.getElementById('info'),
            chatInfo = document.getElementById('chatInfo'),
            body = document.body,
            chatScroller = document.getElementById('chatScroller');

        if (info.style.display === "none") {
            info.style.display = 'block';
            chatInfo.style.display = 'block';
            body.addEventListener('click', menuPopup, true);
            chatScroller.addEventListener('click', menuPopup, true);

        }
        else {
            info.style.display = 'none';
            chatInfo.style.display = 'none';
            body.removeEventListener('click', menuPopup, true);
            chatScroller.removeEventListener('click', menuPopup, true);
        }

    };

    // addEvent
    var addEvent = function () {
        var chatMenuButton = document.getElementById('chatMenu'),
            info = document.getElementById('info'),
            chatInfo = document.getElementById('chatInfo');

        info.style.display = 'none';
        chatInfo.style.display = 'none';
        chatMenuButton.addEventListener('click', menuPopup, true);
    };

    return {
        addEvent: addEvent
    }
})();

var dynamicResize = (function () {
    var changeChatFieldHeight = function () {
        var chatField = document.getElementById('chatContainer');
        var chatScroller = document.getElementById('chatScroller');
        chatField.style.height = window.innerHeight - 215;
        chatScroller.style.height = window.innerHeight - 259;
    };

    return {
        changeChatFieldHeight: changeChatFieldHeight
    }
})();

//execute when loaded
(function () {
    dynamicResize.changeChatFieldHeight();
    buttonToggle.addEvent();
    pictuerChange.my();
    window.onresize = dynamicResize.changeChatFieldHeight;
})();