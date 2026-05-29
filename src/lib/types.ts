export type Role = "student" | "tuddor";

export type TeachingMode = "online" | "one-to-one" | "group" | "home";

export interface Tuddor {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  bio: string;
  subjects: string[];
  skills: string[];
  education: string;
  experienceYears: number;
  modes: TeachingMode[];
  rating: number;
  reviews: number;
  pricePerHour: number;
  city: string;
  pincode: string;
  online: boolean;
  // hidden until unlocked
  phone: string;
  whatsapp: string;
  contactUnlocked?: boolean;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  city: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  contactUnlocked?: boolean;
}

export type PostKind = "announcement" | "requirement";

export interface FeedPost {
  id: string;
  kind: PostKind;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: Role;
  title: string;
  body: string;
  tags: string[];
  budget?: string;
  mode?: TeachingMode;
  city?: string;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface Bid {
  id: string;
  requirementId: string;
  tuddorId: string;
  tuddorName: string;
  tuddorAvatar: string;
  price: number;
  note: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  kind: "request" | "bid" | "system" | "message";
}
