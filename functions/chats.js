
const { getUser, db, storage, FieldValue } = require("./helpers");

async function getChat(req,res,next){
    let sender = req.params.sender;
    let receiver = req.params.receiver;


    let respmessages = []

    // HACE FALTA SACAR EL USER EN LOS MENSAJES ????? CREO QUE SI !!!
    async function groupMessages(messages, isMe){
        if(messages && messages.docs){
            for(var doc of messages.docs){
                let message = doc.data()
               
                if(!message.deleted){
                    respmessages.push(message)
                }   
            }
        }
    }
    
    // ESTO ES MUCHO DOCUMENTO !!!!!!!!!
    let sentmessages = await db.collection('messages').where('sender','==', sender).where('receiver','==',receiver).get()
    let receivedmessages = await db.collection('messages').where('sender','==', receiver).where('receiver','==',sender).get()

    await groupMessages(sentmessages)
    await groupMessages(receivedmessages)


    let createdChat = await db.collection('messages').where('cod','==', sender+'-'+receiver).get()

    if(!createdChat.docs.length){
        console.log('que pasa')
        let userSender = await getUser(sender)
        let userReceiver = await getUser(receiver)

        if(respmessages && respmessages.length){
            respmessages.sort(((a,b)=> new Date(b.date) - (new Date(a.date))))
        }

        // ESTO SE PODRÍA PASAR A REALTIME DATABASE !!!!!!!
        let chat = {
            cod: sender + '-' + receiver,
            users:[sender,receiver],
            user1: {
                coduser: sender,
                username: userSender.nombre,
                userimage: userSender.image
            },
            user2:{
                coduser: receiver,
                username: userReceiver.nombre,
                userimage: userReceiver.image
            },
            lastMessage: respmessages[0] || ''
        }

    }



    
    return res.status(200).json(respmessages);
}

function normalizeMessages(){



}

async function getUserMessages(req,res,next){
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
}


// HAY QUE MIRAR SI SE HA SUBIDO BIEN
async function sendMessage(req,res,next){
    let message = req.body
    await db.collection('messages').add(message); 
    
    /*await db.collection('users').doc(message.userid).set({
        'unreadmessages': FieldValue.arrayUnion(message.cod)
    });*/

    return res.status(200);

}

// PARA LEER LOS MENSAJES QUE NO SE HAN LEIDO   
async function readMessages(){

}

// EN ESTE BORRAMOS LO QUE NOS SOBRA ???
async function sendMessageNew(req,res,next){
    let message = req.body
    let chat = await db.collection('chats').where(`shortusers.${message.sender}`,
     '==', true).where(`shortusers.${message.receiver}`,'==',true).get()

    if(chat.docs && chat.docs.length){
        await db.collection('chats').doc(chat.docs[0].id).update({
            'lastMessage': message,
            [`users.${message.receiver}.unreadmessages`]: FieldValue.arrayUnion(message.cod)
        });
        await db.collection('chats').doc(chat.docs[0].id).collection('messages').add(message);
    }else {
        // se podría crear el chat en otro sitio ???????????????????
        let user1 = await getUser(message.sender)
        let user2 = await getUser(message.receiver)

        let sender =  {
            coduser: message.sender,
            username: user1.nombre,
            userimage: user1.image,
            unreadmessages:[]
        }

        let receiver = {
            coduser: message.receiver,
            username: user2.nombre,
            userimage: user2.image,
            unreadmessages:[message.cod]
        }

        let chat ={
            cod: message.sender + '-' + message.receiver,
            users:  {},
            shortusers:{},
            lastMessage: message
        }
        
        //guardar unreadmessages aqui???
        chat.users[message.sender] = sender
        chat.users[message.receiver] = receiver
        chat.shortusers[message.sender] = true
        chat.shortusers[message.receiver] = true


        console.log('el chat no existe lo creamos', chat)

        let document = await db.collection('chats').add(chat);

        await db.collection('chats').doc(document.id).collection('messages').add(message);
    }
    

    return res.status(200);

}

async function getChatNew(req,res,next){
    let sender = req.params.sender;
    let receiver = req.params.receiver;

    let dbresponse = await db.collection('chats').where(`shortusers.${sender}`,
    '==', true).where(`shortusers.${receiver}`,'==',true).get()
    
    let chat = {}
    if(dbresponse.docs && dbresponse.docs.length){
        chat = dbresponse.docs[0].data();
        console.log('got chat',chat)
        return res.status(200).json(chat);
    }
    
    return res.status(400).json({'error':'not found'});
}

async function getUserMessagesNew(req,res,next){
    let chats = []
    let msgquery = await db.collection('chats').where(`shortusers.${req.params.userId}`,
    '==', true).get()

    // SACAMOS LOS CHATS DE CADA UNO 
    if(msgquery.docs.length){
        for(var doc of msgquery.docs){
            let chat = doc.data()
            chats.push(chat)
        }
    }
    
    return res.status(200).json(chats);
}


module.exports = {
    sendMessage, 
    getUserMessages,
    getChat,
    getChatNew,
    sendMessageNew,
    getUserMessagesNew
}