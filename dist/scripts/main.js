var serverURL = '//tiny-pizza-server.herokuapp.com/collections/NicerHugs-chat-app',
    lastUpdated = 1411527859463;

function renderTemplate(templateId, location, model) {
    var templateString = $(templateId).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(model);
    $(location).append(renderedTemplate);
}

function buildChatList(chatModel) {
    chatModel.createdAt = moment(+chatModel.createdAt).fromNow();
    renderTemplate('#templates-chat-item', '#chat-list', chatModel);
    var chatListHeight = $('#chat-list').prop('scrollHeight');
    $('#chat-list').scrollTop(chatListHeight);
}

function sendChat(e) {
    e.preventDefault();
    var chatData =  {
        username: $('#chat-message').attr('username'),
        createdAt: Date.now(),
        message: $('#chat-message').val(),
    };
    $('#chat-message').val("");
    $.ajax({
        url: serverURL,
        type: 'POST',
        data: chatData
    })
    .done(function() {
        getChats();
    });
}

function getChats() {
    $.ajax({
        url: serverURL,
        type: 'GET'
    })
    .done(makeChatModel);
}

function makeChatModel(chatData) {
    var dateSorted = _.sortBy(chatData, function(chat) {
        return chat.createdAt;
    });
    var filterByNew = _.filter(dateSorted, function(chat) {
        return chat.createdAt >= lastUpdated;
    });
    lastUpdated = Date.now();
    var chatModel = filterByNew.slice(filterByNew.length-20, filterByNew.length);
    _.each(chatModel, buildChatList);
}

$('#username').on('click', function(e){
    e.preventDefault();
    $('#login').addClass('hidden');
    $('#chat-app').removeClass('hidden');
    $('#chat-message').attr('username', $('#username-field').val());
    getChats();
});

$('#send-chat').on('click', function(e){
    sendChat(e);
});

setInterval(getChats, 1000);






//
