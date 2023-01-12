# Live Chat

Full-stack real-time text and video chat application built using React & Redux, Material UI, Nodejs & Express, Socket.io, MongoDB, Peer.js and more.

Socket.io module was used for bi-directional and low latency communication.

## Authors

-   [@i-zokirov](https://github.com/i-zokirov)

## Demo

Live demo can be viewed with the following link: [https://livechat-izokirov.herokuapp.com](https://livechat-izokirov.herokuapp.com)

Feel free to register with a dummy account to test the application features.

## Tech Stack

**Client:** React, Redux, Material UI, Peerjs, Axios

**Server:** Node, Express, Mongoose, Socket.io, JWT, Bcryptjs, Cors

**Database:** MongoDB

**Deployment:** Heroku - [https://livechat-izokirov.herokuapp.com](https://livechat-izokirov.herokuapp.com)

## Features

-   Live & Offline bidirectional chat with socket.io
-   MondoDB database for chat histories and user records
-   User authentication && token status verification on each page reload
-   All users/contacts view
-   DM (direct message) contacts view
-   Archived chats/contacts view
-   Features to add user to chat, archive existing chat, and delete existing chat
-   Video conference support with integrated chat interface (requires further enhancement)
-   Light/dark mode toggle
-   Avatar set-up
-   User statuses

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`

`JWT_SECRET`

## Run Locally

Clone the project

```bash
  git clone https://github.com/i-zokirov/live-chat.git
```

Go to the project directory

```bash
  cd live-chat
```

Install dependencies (run npm install in root folder as well as frontend folder)

```bash
  npm install
```

Start the server

```bash
  npm run server
```

Start the frontend

```bash
  npm run frontend
```

Start the server and frontend simultenously

```bash
  npm run dev
```

Change socket connection url to the localhost url/port on **./frontend/src/socket.js** and change exported variable on **./frontend/src/baseUrl.js** file to **devUrl**.

Finally, uncomment line 12 and 13 on **./backend/index.js** file to allow reading env variables locally.

## Data models

#### userSchema

```js
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        avatar: {
            type: String,
            default: "",
        },
        dms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        archives: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);
```

#### messageSchema

```js
const messageSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Text", "Image", "File", "Call"],
            default: "Text",
            required: true,
        },
        message: {
            type: String,
        },
        participants: {
            type: Array,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            default: new Date(),
            required: true,
        },
    },
    {
        timesamps: true,
    }
);
```

## Roadmap

-   Make further enhancements on video/audio chatting
-   Build custom peerjs server
-   Add group chat support
-   Implement on-demand messages loading
-   Add attachment/image support for messages

## License

[MIT](https://choosealicense.com/licenses/mit/)
