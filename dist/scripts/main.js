var serverURL = '//tiny-pizza-server.herokuapp.com/collections/NicerHugs-chat-app',
    lastUpdated = null;

function renderTemplate(templateId, location, model) {
    var templateString = $(templateId).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(model);
    $(location).append(renderedTemplate);
}

function buildChatList(chatModel) {
    renderTemplate('#templates-chat-item', '#chat-list', chatModel);
}

function sendChat(e) {
    e.preventDefault();
    var chatData =  {
        username: $('#chat-message').attr('username'),
        createdAt: new Date.now(),
        message: $('#chat-message').val(),
    };
    lastUpdated = chatData.createdAt;
    $('#chat-message').val("");
    $.ajax({
        url: serverURL,
        type: 'POST',
        data: chatData
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
    var chatModel = dateSorted.slice(0, 19);
    _.each(chatModel, buildChatList);
}

$('#username').on('click', function(e){
  e.preventDefault();
  $('#login').addClass('hidden');
  $('#chat-app').removeClass('hidden');
  $('#chat-message').attr('username', $('#username-field').val());
  getChats();
});

$('#send-chat').on('click', sendChat);
