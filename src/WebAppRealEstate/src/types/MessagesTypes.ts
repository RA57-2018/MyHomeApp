export type ResponseProps = {
    responseMessage: string;
};

export type ResponseToProps = {
    responseMessage: string;
};

export type RequestToProps = {
    requestMessage: string;
};

export type RequestProps = {
    request: string;
};

export type MessageProps = {
    requestMessage: string;
};

export type EditMessageProps = {
    sender: string;
    responser: string;
    requestMessage: string;
    responseMessage: string;
};

export type MessageResponseProps = {
    requestMessage: string;
    responseMessage: string;
};

export type Message = {
    sender: string;
    requestMessage: string;
    responseMessage: string;
};
