import mongoose, { Schema } from "mongoose";

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  accessToken?: string;
  resetToken?: string;
}

const UserSchema: Schema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true },
  accessToken: { type: String, default: null },
  resetToken: { type: String, default: null },
});

const UserModel = mongoose.model<User>("User", UserSchema);
export default UserModel;
