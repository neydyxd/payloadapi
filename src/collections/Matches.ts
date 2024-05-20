import { CollectionConfig } from "payload/types";

const Matches: CollectionConfig = {
    slug: 'matches',
    fields: [
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
            name: 'isShow',
            type: 'checkbox',
            label: 'Is Show'
        },
        {
            name: 'status',
            type: 'select',
            options: [
                {
                    label: "Like",
                    value: "LIKE"
                },
                {
                    label: "Reject",
                    value: "REJECT"
                }
            ]
        },
    ],
    endpoints: [
        {
            path: '/getDiscoveryData',
            method: 'get',
            handler: async (req, res, next) => {
                const { gender, lookingGender, userId, ageFrom, ageTo, latitude, longitude, radius} = req.body;

                if (!ageFrom || !ageTo) {
                    return res.status(400).json({ error: 'Missing required parameters' })
                }

                const currentDate = new Date();
                const fromDate = new Date(currentDate.getFullYear() - ageFrom, currentDate.getMonth(), currentDate.getDate());
                const toDate = new Date(currentDate.getFullYear() - ageTo - 1, currentDate.getMonth(), currentDate.getDate());

                const findData = await req.payload.find({
                    collection: 'users',
                    where: {
                        birthDate: {
                            greater_than_equal:  toDate,
                            less_than_equal: fromDate
                        },
                    },
                })

                res.status(200).json({findData})
            },
        },
        {
            path: '/handleLike',
            method: 'post',
            handler: async (req, res, next) => {
                const { from, to } = req.body;

                if (!from || !to) {
                    return res.status(400).json({ error: 'Missing required parameter: from or to' })
                }

                const findMatches = await req.payload.find({
                    collection: 'matches',
                    where: {
                        from: {
                            equals: from
                        },
                        to: {
                            equals: to
                        },
                        status: {
                            equals: "LIKE"
                        },
                    },
                })

                if (findMatches.docs.length === 0) {
                    const newMatch = await req.payload.create({
                        collection: 'matches',
                        data: {
                            from: from,
                            to: to,
                            status: "LIKE",
                            isShow: false
                        },
                    })
                }

                const matches = await req.payload.find({
                    collection: 'matches',
                    where: {
                        from: {
                            equals: to
                        },
                        to: {
                            equals: from
                        },
                        status: {
                            equals: "LIKE"
                        },
                        isShow: {
                            equals: false
                        },
                    },
                })



                res.status(200).json({ matches })
            },
        },
        {
            path: '/handleReject',
            method: 'post',
            handler: async (req, res, next) => {
                const { from, to } = req.body;

                if (!from || !to) {
                    return res.status(400).json({ error: 'Missing required parameter: from or to' })
                }

                const findMatches = await req.payload.find({
                    collection: 'matches',
                    where: {
                        from: {
                            equals: from
                        },
                        to: {
                            equals: to
                        },
                        status: {
                            equals: "REJECT"
                        },
                    },
                })

                if (findMatches.docs.length === 0) {
                    const newMatch = await req.payload.create({
                        collection: 'matches',
                        data: {
                            from: from,
                            to: to,
                            status: "REJECT",
                            isShow: false
                        },
                    })
                }

                res.status(200).send('ok')
            },
        },
    ],
}

export default Matches;