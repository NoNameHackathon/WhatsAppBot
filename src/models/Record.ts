import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose';

export interface SummaryItem {
    productName: string;
    productPrice: number;
    productURL: string;
}

export enum RecordStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'conversation_records'
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class ConversationRecordModel {
  @prop({ required: true })
  public chatId!: string;

  @prop()
  public chatName?: string;

  @prop({ required: false })
  public startMessageId?: string;

  @prop({ required: false })
  public endMessageId?: string;

  @prop({ required: false })
  public startTimestamp?: number;

  @prop({ required: false })
  public endTimestamp?: number;

  @prop({ type: () => [Object], default: [] })
  public items!: string[];

  @prop()
  public summary?: string;

  @prop()
  public additionalInfo?: Record<string, unknown>;

  @prop({ enum: RecordStatus, default: RecordStatus.PENDING })
  public status!: RecordStatus;

}

export const ConversationRecord = getModelForClass(ConversationRecordModel); 