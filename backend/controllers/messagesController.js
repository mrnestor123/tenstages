import { getUser } from './usersController.js';
import { db, FieldValue } from '../app.js';
import { create_UUID } from '../util.js';

export const getUserChats = async (userId) => {
    try {
        let chats = [];
        let query = await db
            .collection('chats')
            .where(`shortusers.${userId}`, '==', true)
            .get();

        // SACAMOS LOS CHATS DE CADA UNO
        if (query.docs.length) {
            for (var doc of query.docs) {
                let chat = doc.data();
                chats.push(chat);
            }
        }

        return chats;
    } catch (e) {
        throw new Error(e);
    }
};

export const getChat = async (sender, receiver) => {
    try {
        // HAY QUE HACER UN ÍNDICE CON ESTO ??
        let dbResponse = await db
            .collection('chats')
            .where(`shortusers.${sender}`, '==', true)
            .where(`shortusers.${receiver}`, '==', true)
            .get();

        let chat = {};

        if (dbResponse.docs && dbResponse.docs.length) {
            chat = dbResponse.docs[0].data();

            let query = await db
                .collection('chats')
                .doc(dbResponse.docs[0].id)
                .collection('messages')
                .get();

            if (query.docs && query.docs.length) {
                chat.messages = [];
                for (var doc of query.docs) {
                    chat.messages.push(doc.data());
                }
            }

            return chat;
        } else {
            throw new Error({ message: 'Chat not found' });
        }
    } catch (e) {
        throw new Error(e);
    }
};

// EN ESTE BORRAMOS LO QUE NOS SOBRA ???
export const sendMessage = async (message) => {
    try {
        let chat = await db
            .collection('chats')
            .where(`shortusers.${message.sender}`, '==', true)
            .where(`shortusers.${message.receiver}`, '==', true)
            .get();

        // si el chat ya existe añadimos el mensaje
        if (chat.docs && chat.docs.length) {
            await db
                .collection('chats')
                .doc(chat.docs[0].id)
                .update({
                    lastMessage: message,
                    [`users.${message.receiver}.unreadmessages`]: FieldValue.arrayUnion(message.cod),
                });

            await db
                .collection('chats')
                .doc(chat.docs[0].id)
                .collection('messages')
                .add(message);

        } else {
            let user1 = await getUser(message.sender);
            let user2 = await getUser(message.receiver);

            // HAY QUE CREAR EL CHAT EN  OTRO SITIO ??
            let sender = {
                coduser: message.sender,
                nombre: user1.nombre,
                userimage: user1.image,
                unreadmessages: [],
            };

            // REALMENTE HABRÍA QUE ACTUALIZAR MEJOR EL USUARIO ???
            let receiver = {
                coduser: message.receiver,
                nombre: user2.nombre,
                userimage: user2.image,
                unreadmessages: [],
            };

            let chat = {
                cod: create_UUID(),
                users: {},
                shortusers: {},
                lastMessage: message,
            };

            // ESTO ES UN POCO  REDUNDANTE
            chat.users[message.sender] = sender;
            chat.users[message.receiver] = receiver;
            chat.shortusers[message.sender] = true;
            chat.shortusers[message.receiver] = true;

            let document = await db.collection('chats').add(chat);

            await db
                .collection('chats')
                .doc(document.id)
                .collection('messages')
                .add(message);
        }
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

async function getChatNew(req, res, next) {}

async function getUserMessagesNew(req, res, next) {}

export const newMessage = async (message) => {};

export const deleteMessage = async (codmessage) => {};
