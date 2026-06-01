export type Role = "student" | "tutor";

export type TeachingMode = "online" | "one-to-one" | "group" | "home";

export interface IndiaLocation {
  state: string;
  district: string;
  city: string;
  pincode: string;
}

export interface Tutor {
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
  minimumFee?: number;
  city: string;
  state?: string;
  district?: string;
  pincode: string;
  online: boolean;
  // hidden until unlocked
  phone: string;
  whatsapp: string;
  contactUnlocked?: boolean;
  requestStatus?: "pending" | "accepted" | "rejected" | null;
  isConnected?: boolean;
  myRating?: { stars: number; review: string; createdAt: string } | null;
  ratingBreakdown?: Record<1 | 2 | 3 | 4 | 5, number> | null;
  ratingTotal?: number;
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
  requestStatus?: "pending" | "accepted" | "rejected" | null;
}

export type PostKind = "general" | "announcement" | "requirement";

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
  status?: "active" | "completed" | "expired";
  createdAt: string;
  likes: number;
  comments: number;
  bidCount?: number;
  highestBid?: number | null;
  lowestBid?: number | null;
  latestBid?: { price: number; createdAt: string; tutorName: string } | null;
  authorRequestStatus?: "pending" | "accepted" | "rejected" | null;
  requestDirection?: "sent" | "incoming" | null;
  incomingRequestCount?: number;
  hasMyBid?: boolean;
  myBidStatus?: "pending" | "accepted" | "rejected" | null;
  commentItems?: Array<{
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    body: string;
    createdAt: string;
  }>;
}

export interface Bid {
  id: string;
  requirementId: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorPhone?: string;
  tutorWhatsapp?: string;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  studentPhone?: string;
  studentWhatsapp?: string;
  requirementTitle?: string;
  requirementBody?: string;
  requirementBudget?: string;
  requirementMode?: string;
  requirementCity?: string;
  requirementTags?: string[];
  tutorHeadline?: string;
  tutorBio?: string;
  tutorEducation?: string;
  tutorExperienceYears?: number;
  tutorRating?: number;
  tutorReviews?: number;
  tutorSubjects?: string[];
  contactUnlocked?: boolean;
  price: number;
  note: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
