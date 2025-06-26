import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose';
import { MessageDirection } from '../types';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'messages'
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class MessageModel {
  @prop({ required: true })
  public messageId!: string;

  @prop({ required: true })
  public body!: string;

  @prop({ required: true })
  public from!: string;

  @prop({ required: true })
  public to!: string;

  @prop({ required: true })
  public chatId!: string;

  @prop()
  public chatName?: string;

  @prop()
  public author?: string;

  @prop({ required: true })
  public timestamp!: number;

  @prop({ required: true, enum: MessageDirection })
  public direction!: MessageDirection;

  @prop({ required: true })
  public isGroup!: boolean;

  @prop({ required: true })
  public messageType!: string;

  @prop({ default: false })
  public hasMedia!: boolean;

  @prop({ default: false })
  public isForwarded!: boolean;

  @prop()
  public quotedMessage?: string;

  @prop()
  public mentions?: string[];

  @prop()
  public mediaData?: {
    mimetype?: string;
    filename?: string;
    filesize?: number;
  };

  @prop()
  public location?: {
    latitude: number;
    longitude: number;
    description?: string;
  };

  @prop()
  public rawData?: Record<string, unknown>;
}

export const Message = getModelForClass(MessageModel); 