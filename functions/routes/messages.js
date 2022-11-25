



app.get("/messages/:userId", getUserMessages);
app.get("/messages/:userId/new", getUserMessagesNew);
app.get("/messages/:sender/:receiver/new", getChatNew);
app.post('/sendmessage/new',sendMessageNew);