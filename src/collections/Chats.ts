import { CollectionConfig } from "payload/types";

const Chats: CollectionConfig = {
    slug: 'chats',
    fields: [
        {
            name: 'lastMessage',
            type: 'relationship',
            relationTo: 'messages',
            label: 'Last Message'
        },
        {
            name: 'members',
            type: 'relationship',
            relationTo: 'users',
            hasMany: true,
            label: 'Members'
        },
        {
            name: 'messages',
            type: 'relationship',
            relationTo: 'messages',
            hasMany: true,
            label: 'Messages'
        },
    ],
    endpoints: [
        {
            path: '/getAllChats',
            method: 'get',
            handler: async (req, res, next) => {
                const { userId } = req.body;

                if (!userId) {
                    return res.status(400).json({ error: 'Missing required parameter: userId' })
                }

                const chats = await req.payload.find({
                    collection: 'chats',
                    where: {
                        members: {
                            equals: userId
                        }
                    }
                })
                res.status(200).json({ chats })
            },
        },
        {
            path: '/createChat',
            method: 'post',
            handler: async (req, res, next) => {
                const { user_1, user_2 } = req.body;

                if (!user_1 || !user_2) {
                    return res.status(400).json({ error: 'Missing required parameter: user_1 or user_2' })
                }
                const chats = await req.payload.find({
                    collection: 'chats',
                    where: {
                        members: {
                            equals: user_1
                        }
                    },
                    depth: 2
                })

                const chates = chats.docs;
                let findChat;
                for (const chat of chates) {
                    if (chat.members) {
                        if ((chat.members[0].id === user_1 && chat.members[1].id === user_2) || (chat.members[0].id === user_2 && chat.members[1].id === user_1)) {
                            findChat = chat;
                        }
                    }
                }
                if (!findChat) {
                    const newChat = await req.payload.create({
                        collection: 'chats',
                        data: {
                            members: [user_1, user_2]
                        },
                    })
                    res.status(200).json({ newChat })
                }
                res.status(200).json({ findChat })
            },
        },
    ],
}

export default Chats;