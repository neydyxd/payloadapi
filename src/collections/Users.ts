import { CollectionConfig } from 'payload/types'
import payload from 'payload'
import { generateVerificationCode } from '../utils/generateVerificationCode'

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
      name: 'coordinates',
      type: 'point',
      label: 'Coordinates'
    },
    {
      name: 'birth',
      type: 'date',
      label: 'BirthDate'
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
    {
      path: '/sendMessage',
      method: 'post',
      handler: async (req, res, next) => {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
          return res.status(400).json({ error: 'Missing required parameters' })
        }

        const user = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: phoneNumber + "@mail.ru"
            },
          }
        });

        if (user.docs.length !== 0) {
          var id;
          if (typeof user.docs[0].id === "string") {
            id = user.docs[0].id;
          }
          const messageCode = generateVerificationCode();
          const updatedUser = await payload.update({
            collection: 'users',
            id,
            data: {
              password: messageCode,
            }
          });
          fetch(`https://sms.ru/sms/send?api_id=7E0FBE78-AA59-8876-9E4C-A4904B014E50&to=${phoneNumber}&msg=Ваш+код:+${messageCode}&json=1`)
            .then(() => {
              res.status(200).json({ updatedUser, messageCode })
            })
            .catch((error) => {
              res.status(400).send(error)
            })
        } else {
          const messageCode = generateVerificationCode();
          const newUser = await payload.create({
            collection: 'users',
            data: {
              email: phoneNumber + "@mail.ru",
              password: messageCode,
            }
          });
          fetch(`https://sms.ru/sms/send?api_id=7E0FBE78-AA59-8876-9E4C-A4904B014E50&to=${phoneNumber}&msg=Ваш+код:+${messageCode}&json=1`)
            .then(() => {
              res.status(200).json({ newUser, messageCode })
            })
            .catch((error) => {
              res.status(400).send(error)
            })
        }

      },
    },
    {
      path: '/customLogin',
      method: 'post',
      handler: async (req, res, next) => {
        const { phoneNumber, code } = req.body;
        if (!phoneNumber) {
          return res.status(400).json({ error: 'Missing required parameters' })
        }

        if (typeof phoneNumber === "string" && typeof code === "string") {
          const logginedUser = await payload.login({
            collection: 'users',
            data: {
              email: phoneNumber + '@mail.ru',
              password: code
            }
          })
          res.status(200).json({ logginedUser })
        }
      },
    },
  ],
}

export default Users
