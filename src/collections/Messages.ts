import { CollectionConfig } from "payload/types";

const Messages: CollectionConfig = {
    slug: 'messages',
    fields: [
        {
            name: 'lastMessage',
            type: 'text',
            label: 'Last Message'
        },
        {
            name: 'content',
            type: 'json',
            label: 'Content'
        },
        {
            name: 'from',
            type: 'relationship',
            relationTo: 'users',
            label: 'From'
        },
        {
            name: 'to',
            type: 'relationship',
            relationTo: 'users',
            label: 'To'
        },
        {
            name: 'messageId',
            type: 'text',
            label: 'Message Id'
        },
        {
            name: 'isRead',
            type: 'checkbox',
            label: 'Is Read'
        },
    ]
}

export default Messages;