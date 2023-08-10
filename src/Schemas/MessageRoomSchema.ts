
type PatientDataInMessageRoomType = {
    ID: String,
    Image: String,
    IsTyping: Boolean,
    FCM?: String
}

type ProviderDataInMessageRoomType = {
    ID: String,
    Image: String,
    IsTyping: Boolean,
    UserType: String,
    FCM?: String
}

type MessageType = {
    Milliseconds: Number,
    SenderID: String,
    ReceiverID: String,
    ReadBit: Number,
    SYSTEM: Boolean,
    NumChars: Number,
    Shown: Boolean,
    DateTime: Date,
    Body: String,
    ImagePaths: Array<String>,
    DocPaths: Array<String>,
}

type MessageRoomType = {
    Created: Date,
    Expired: Boolean,
    LastOpened: Date,
    ID: String,
    AppointmentID: String,
    Patient: PatientDataInMessageRoomType,
    Provider: ProviderDataInMessageRoomType,
    Messages: Array<MessageType>
}

const NewMessageRoom: MessageRoomType = {
    Created: new Date(),
    Expired: false,
    ID: '',
    LastOpened: new Date(),
    AppointmentID: '',
    Messages: [],
    Patient: {
        ID: '',
        Image: '',
        IsTyping: false
    },
    Provider: {
        ID: '',
        Image: '',
        IsTyping: false,
        UserType: ''
    }
}


export class Message {
    MessageDetails: MessageType

    constructor(Message: MessageType) {
        this.MessageDetails = Message
    }

    isSentByMe = (myID: String): Boolean => {
        console.log({myID});
        
        return (this.MessageDetails.SenderID === myID)
    }
}

export class MessageRoom {
    MessageRoomDetails: MessageRoomType

    constructor(MessageRoomResponse: MessageRoomType) {
        if (MessageRoomResponse) this.MessageRoomDetails = MessageRoomResponse
        else this.MessageRoomDetails = NewMessageRoom
    }
}
