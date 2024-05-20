import { CollectionConfig } from 'payload/types'


const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name'
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'BirthDate'
    },
    {
      name: 'coordinates',
      type: 'point',
      label: 'Coordinates'
    },
    {
      name: 'chats',
      type: 'relationship',
      relationTo: 'chats',
      hasMany: true,
      label: 'Chats'
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Gender',
      options: [
        {
          label: "Male",
          value: "MALE"
        },
        {
          label: "Female",
          value: "FEMALE"
        }
      ]
    },
    {
      name: 'lookingGender',
      type: 'select',
      label: 'Looking Gender',
      options: [
        {
          label: "Male",
          value: "MALE"
        },
        {
          label: "Female",
          value: "FEMALE"
        }
      ]
    },
    {
      name: 'passions',
      type: 'select',
      hasMany: true,
      label: 'Passions',
      options: [
        {
          label: "Art",
          value: "ART"
        },
        {
          label: "Extreme",
          value: "EXTREME"
        },
        {
          label: "Gym",
          value: "GYM"
        },
        {
          label: "Cinema",
          value: "CINEMA"
        },
        {
          label: "Cooking",
          value: "COOKING"
        },
        {
          label: "Games",
          value: "GAMES"
        },
        {
          label: "Parties",
          value: "PARTIES"
        },
      ]
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number'
    },
  ],
  endpoints: [
    {
      path: '/getTenUsers',
      method: 'get',
      handler: async (req, res, next) => {
        const users = await req.payload.find({
          collection: 'users',
          limit: 10,
        })


        const newObject = await req.payload.create({
          collection: 'names',
          data: {
            name: req.body.name
          },
        })

        res.status(200).json({ users, newObject })
      },
    },
  ],
}

export default Users
