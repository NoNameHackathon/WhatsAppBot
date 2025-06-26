import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users'
  }
})
export class UserModel {
  @prop({ required: true, unique: true })
  public userId!: string;

  @prop()
  public username?: string;

  @prop()
  public pushname?: string;

  @prop({ default: 0 })
  public messageCount!: number;

  @prop({ default: Date.now })
  public lastSeen!: Date;

  @prop({ type: () => [String], default: [] })
  public joinedGroups!: string[];

  @prop({ default: false })
  public isBlocked!: boolean;

  @prop()
  public profilePicUrl?: string;

  @prop()
  public about?: string;

  @prop()
  public country?: string;

  @prop({ default: true })
  public isActive!: boolean;
}

export const User = getModelForClass(UserModel); 