//chatRoom picture Change
var pictureChange = (function () {
    var myPictureChange = function () {
        var myMessage = document.getElementsByClassName('myMessage'),
            myMessageLength = myMessage.length,
            myPicture;
        // set curUserPicture (prevent Error)
        if (document.getElementById('userPic').innerHTML)
            myPicture = document.getElementById('userPic').innerHTML;
        else
            myPicture = "<img src = \"images/Anonyprofile.png\">";

        for (var i = 0; i < myMessageLength; i++) {
            myMessage[i].firstChild.innerHTML = myPicture;
        }
    };

    var otherPictureChange_Anony = function () {
        var otherMessage = document.getElementsByClassName('otherMessage'),
            otherMessageLength = otherMessage.length,
            anonyPicture = "<img src = \"images/Anonyprofile.png\">";
        for (var j = 0; j < otherMessageLength; j++) {
            otherMessage[j].firstChild.innerHTML = anonyPicture;
        }
    };

    return {
        my: myPictureChange,
        otherAnony: otherPictureChange_Anony
    }
})();

//for chatMenu
var button = (function () {
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

    var detailAction = {
        leaveChat: function () {
            window.location = '/randomChat';
        },

        askOpposite: function () {
            if (chatCount.getChatTime() >= 14) {
                alert('15분이 지나면 상대방을 물어볼 수 있습니다.');
            }
            else {
                socket.emit('randomChatAskOppositeSend', userInfo.getId());
            }
        },

        receiveOpposite: function () {
            //when opposite user ask cur user
            socket.on('randomChatAskOppositeReceive', function (reqUser) {
                var curUser = userInfo.getId(),
                    alertWindow = document.getElementById('alert');
                
                console.log('랜덤채팅요청');
                
                if (curUser === reqUser) {
                    alertWindow.style.display = 'block';
                }
                else {
                    alert('성공적으로 요청을 보냈습니다.');
                }
            });
        }
    };

    // addEvent
    var addEvent = function () {
        var chatMenuButton = document.getElementById('chatMenu'),
            info = document.getElementById('info'),
            chatInfo = document.getElementById('chatInfo'),
            leaveChat = document.getElementById('leaveChat'),
            findFriend = document.getElementById('findFriend');

        info.style.display = 'none';
        chatInfo.style.display = 'none';
        chatMenuButton.addEventListener('click', menuPopup, true);
        leaveChat.addEventListener('click', detailAction.leaveChat, true);
        findFriend.addEventListener('click', detailAction.askOpposite, true);
        
        detailAction.receiveOpposite();
    };

    return {
        addEvent: addEvent
    }
})();

//for chatField resize
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

//for chatInputFunction
var chatInputFunction = (function () {
    //receive data and insert chatNode
    socket.on('randomChatMessageReceive', function (data, userId) {
        chatInsert(data, userId);
    });

    var chatInsert = function (data, userId) {
        //create HTML element
        var messageFragment = document.createDocumentFragment(),
            articleMessage = document.createElement('article'),
            profileDiv = document.createElement('div'),
            blockDiv = document.createElement('div'),
            textSpan = document.createElement('span'),
            messageField = document.getElementById('messages'),
            curUserId = userInfo.getId();

        var createChatNode = function () {
            //add class property
            profileDiv.className = 'profile';
            blockDiv.className = 'block';
            textSpan.innerText = data;

            //add Value
            blockDiv.appendChild(textSpan);
            articleMessage.appendChild(profileDiv);
            articleMessage.appendChild(blockDiv);
            messageFragment.appendChild(articleMessage);

            //add messageField
            messageField.appendChild(messageFragment);
        };

        //add class by author
        if (curUserId === userId) {
            articleMessage.className = 'myMessage';
            createChatNode();

            //change profile picture
            pictureChange.my();
        }
        else {
            articleMessage.className = 'otherMessage';
            createChatNode();

            //change profile picture
            pictureChange.otherAnony();
        }

        //reset TextFieldValue
        document.getElementById('chatInput').value = '';

        //move scroll to latest chat (to bottom)
        var chatField = document.getElementById("messages");
        chatField.scrollTop = chatField.scrollHeight;
    };

    var emitChatEvent = function (userId) {
        var rowChatInputText = document.getElementById('chatInput').value,
            curChatRoom = socketFunction.getChatRoom();

        if (rowChatInputText === "") {
            return;
        }
        if (curChatRoom === null || curChatRoom === undefined) {
            //alert('아직 연결이 되지 않았습니다.')
            return;
        }
        else {
            socket.emit('randomChatMessageSend', rowChatInputText, userId, curChatRoom);
        }
    };

    // addEvent
    var addEvent = {
        clickSend: function () {
            var userId = userInfo.getId(),
                chatSendButton = document.getElementById('chatSend');

            //to pass parameter at addEventListener
            chatSendButton.addEventListener("click", function () {
                emitChatEvent(userId);
            }, true);
        },

        enterSend: function () {
            var chatInput = document.getElementById('chatInput'),
                userId = userInfo.getId();

            chatInput.onkeypress = function (event) {
                event = event || window.event;
                if (event.keyCode === 13) {
                    emitChatEvent(userId);
                }
            }
        }
    };

    return {
        input: chatInsert,
        addEvent: addEvent
    }
})();


//execute when loaded
(function () {
    //resize chatField
    dynamicResize.changeChatFieldHeight();

    //popup chatMenu
    button.addEvent();

    //sendChatFunction
    //set user picture when window loaded
    pictureChange.my();
    //add chatFunction event
    chatInputFunction.addEvent.clickSend();
    chatInputFunction.addEvent.enterSend();

    //resize chatField
    window.onresize = dynamicResize.changeChatFieldHeight;
})();