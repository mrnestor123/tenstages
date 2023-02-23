const { getUser, db, storage, FieldValue, create_UUID } = require("./helpers");

async function getUserMessages(req, res, next){
    let coduser = req.params.userId;

    let groupedMessages = {}

    let toupdate = false;

    // HACE FALTA SACAR EL USER EN LOS MENSAJES ????? CREO QUE SI !!!
    async function groupMessages(messages, isMe){
        if(messages && messages.docs){
            for(var doc of messages.docs){
                let message = doc.data()
                let key = isMe ? message.receiver : message.sender

                if(!message.deleted){
                    if(!groupedMessages[key]){
                        groupedMessages[key] = {}
                        // EL USUARIO LO SACAMOS DE OTRA FORMA ?????
                        groupedMessages[key].user = await getUser(key)
                        toupdate = true;
                        groupedMessages[key].messages = [] 
                    }
                    groupedMessages[key].messages.push(message)
                }   
            }
        }
    }
    
    let usermessages = await db.collection('messages').where('receiver','==', coduser).get()
    let sentmessages = await db.collection('messages').where('sender','==', coduser).get()
    let broadcasts = await db.collection('messages').where('receiver','array-contains-any',[coduser]).get()
    let broadcastsSent = await db.collection('messages').where('sender','array-contains-any',[coduser]).get()


    await groupMessages(sentmessages,true)
    await groupMessages(usermessages)
    await groupMessages(broadcasts)
    await groupMessages(broadcastsSent)
    

    Object.keys(groupedMessages).map((key)=>{
        let messages = groupedMessages[key]

    })
    
    return res.status(200).json(groupedMessages);
};

// EN ESTE BORRAMOS LO QUE NOS SOBRA ???
async function sendMessageNew(req, res, next){
    let message = req.body
    let chat = await db.collection('chats').where(`shortusers.${message.sender}`,
     '==', true).where(`shortusers.${message.receiver}`,'==',true).get()

    if(chat.docs && chat.docs.length){
        await db.collection('chats').doc(chat.docs[0].id).update({
            'lastMessage': message,
            [`users.${message.receiver}.unreadmessages`]: FieldValue.arrayUnion(message.cod),
        });

        await db.collection('chats').doc(chat.docs[0].id).collection('messages').add(message);
    }else {

        let user1 = await getUser(message.sender)
        let user2 = await getUser(message.receiver)
        

        // HAY QUE CREAR EL CHAT EN  OTRO SITIO !!!!!
        let sender = {
            coduser: message.sender,
            nombre: user1.nombre,
            userimage: user1.image,
            unreadmessages:[]
        }

        let receiver = {
            coduser: message.receiver,
            nombre: user2.nombre,
            userimage: user2.image,
            unreadmessages:[message.cod]
        }

        let chat ={
            cod: create_UUID(),
            users:  {},
            shortusers:{},
            lastMessage: message
        }
        
        chat.users[message.sender] = sender
        chat.users[message.receiver] = receiver
        chat.shortusers[message.sender] = true
        chat.shortusers[message.receiver] = true

        let document = await db.collection('chats').add(chat);

        await db.collection('chats').doc(document.id).collection('messages').add(message);
    }
    
    return res.status(200);
};

async function getChatNew(req, res, next){

    let sender = req.params.sender;
    let receiver = req.params.receiver;

    let dbresponse = await db.collection('chats').where(`shortusers.${sender}`,
    '==', true).where(`shortusers.${receiver}`,'==',true).get()

    let chat = {}

    if(dbresponse.docs && dbresponse.docs.length){
        console.log('got chat',chat)
        
        chat = dbresponse.docs[0].data();


        let messagesquery = await db.collection('chats').doc(dbresponse.docs[0].id).collection('messages').get()

        if(messagesquery.docs && messagesquery.docs.length){
            chat.messages = []
            for(var doc of  messagesquery.docs){
                chat.messages.push(doc.data())
            }
        }
        
        return res.status(200).json(chat);
    }

    
    
    return res.status(400).json({'error':'not found'});
};

async function getUserMessagesNew(req, res, next){
    let chats = []
    let msgquery = await db.collection('chats').where(`shortusers.${req.params.userId}`,'==', true).get()

    // SACAMOS LOS CHATS DE CADA UNO 
    if(msgquery.docs.length){
        for(var doc of msgquery.docs){
            let chat = doc.data()


            chats.push(chat)
        }
    }


    console.log('got chats ',chats)
    
    return res.status(200).json(chats);
};

module.exports = {
    getUserMessages,
    getChatNew,
    sendMessageNew,
    getUserMessagesNew
};