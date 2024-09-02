import UserModel, { type User } from "../models/user.model"

export function createUser(input: Partial<User>) {
  return UserModel.create(input)
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email })
}

export function findUserById(id: string) {
  return UserModel.findById(id)
}
