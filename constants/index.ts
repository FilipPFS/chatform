import { Models } from "node-appwrite";

export const avatarUrl =
  "https://thumbs.dreamstime.com/b/avatar-par-d%C3%A9faut-ic%C3%B4ne-profil-vectoriel-m%C3%A9dias-sociaux-utilisateur-portrait-176256935.jpg";

export interface UserType extends Models.Document {
  fullName: string;
  avatar: string;
  email: string;
}
