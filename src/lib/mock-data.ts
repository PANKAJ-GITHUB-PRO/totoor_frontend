import type { Tuddor, Student, FeedPost, Bid, NotificationItem } from "./types";

export const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English",
  "Computer Science", "Coding", "Design", "Languages", "MBA", "Economics",
];

export const CITIES = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"];

export const TUDDORS: Tuddor[] = [
  {
    id: "t1",
    name: "Maya Sharma",
    avatar: "https://i.pravatar.cc/200?img=47",
    headline: "Calculus & JEE Mathematics mentor",
    bio: "IIT Bombay alum. 8+ years helping students crack JEE & board exams with clarity-first teaching.",
    subjects: ["Mathematics", "Physics"],
    skills: ["JEE Advanced", "Calculus", "Algebra"],
    education: "B.Tech, IIT Bombay",
    experienceYears: 8,
    modes: ["online", "one-to-one"],
    rating: 4.9, reviews: 214, pricePerHour: 800,
    city: "Bangalore", pincode: "560001", online: true,
    phone: "+91 98765 43210", whatsapp: "+91 98765 43210",
  },
  {
    id: "t2",
    name: "Arjun Verma",
    avatar: "https://i.pravatar.cc/200?img=12",
    headline: "Full-stack coding coach",
    bio: "Ex-Google engineer. Teaches React, TypeScript and system design with project-based learning.",
    subjects: ["Computer Science", "Coding"],
    skills: ["React", "TypeScript", "DSA"],
    education: "M.S. Computer Science, BITS Pilani",
    experienceYears: 6,
    modes: ["online", "group"],
    rating: 4.8, reviews: 132, pricePerHour: 1200,
    city: "Hyderabad", pincode: "500081", online: true,
    phone: "+91 90000 12121", whatsapp: "+91 90000 12121",
  },
  {
    id: "t3",
    name: "Neha Iyer",
    avatar: "https://i.pravatar.cc/200?img=32",
    headline: "IELTS & spoken English",
    bio: "Cambridge-certified trainer. Helps learners get to band 8+ with focused weekly sprints.",
    subjects: ["English", "Languages"],
    skills: ["IELTS", "Spoken English", "Grammar"],
    education: "M.A. English Literature",
    experienceYears: 5,
    modes: ["online", "one-to-one", "group"],
    rating: 4.95, reviews: 308, pricePerHour: 700,
    city: "Pune", pincode: "411001", online: true,
    phone: "+91 99887 76655", whatsapp: "+91 99887 76655",
  },
  {
    id: "t4",
    name: "Rahul Khanna",
    avatar: "https://i.pravatar.cc/200?img=15",
    headline: "Physics & NEET coach",
    bio: "AIIMS rank 142. Loves making mechanics intuitive with real-world demos.",
    subjects: ["Physics", "Biology"],
    skills: ["NEET", "Mechanics", "Thermodynamics"],
    education: "MBBS, AIIMS Delhi",
    experienceYears: 4,
    modes: ["home", "one-to-one"],
    rating: 4.7, reviews: 88, pricePerHour: 900,
    city: "Delhi", pincode: "110001", online: false,
    phone: "+91 98111 22233", whatsapp: "+91 98111 22233",
  },
];

export const STUDENTS: Student[] = [
  {
    id: "s1", name: "Ananya Roy", avatar: "https://i.pravatar.cc/200?img=5",
    grade: "Class 12 — Science", city: "Bangalore", pincode: "560034",
    phone: "+91 90000 10101", whatsapp: "+91 90000 10101",
  },
];

export const FEED: FeedPost[] = [
  {
    id: "p1", kind: "announcement", authorId: "t1", authorName: "Maya Sharma",
    authorAvatar: "https://i.pravatar.cc/200?img=47", authorRole: "tuddor",
    title: "Weekend JEE crash batch starting Dec 1",
    body: "Live online intensive: 12 sessions covering calculus + coordinate geometry. Limited to 15 seats.",
    tags: ["JEE", "Mathematics", "Online"],
    mode: "online", city: "Online",
    createdAt: "2h", likes: 42, comments: 8,
  },
  {
    id: "p2", kind: "requirement", authorId: "s1", authorName: "Ananya Roy",
    authorAvatar: "https://i.pravatar.cc/200?img=5", authorRole: "student",
    title: "Need a Chemistry Tuddor for class 12 boards",
    body: "Looking for 3 sessions/week, organic chemistry focus. Preferably home tuition near Koramangala.",
    tags: ["Chemistry", "Class 12", "Home"],
    budget: "₹600–₹900/hr", mode: "home", city: "Bangalore",
    createdAt: "5h", likes: 6, comments: 4,
  },
  {
    id: "p3", kind: "announcement", authorId: "t3", authorName: "Neha Iyer",
    authorAvatar: "https://i.pravatar.cc/200?img=32", authorRole: "tuddor",
    title: "Free IELTS speaking workshop this Saturday",
    body: "Join a 90-min live session with mock interviews and personalised feedback.",
    tags: ["IELTS", "English", "Free"],
    mode: "online",
    createdAt: "1d", likes: 121, comments: 23,
  },
];

export const BIDS: Bid[] = [
  {
    id: "b1", requirementId: "p2", tuddorId: "t2", tuddorName: "Arjun Verma",
    tuddorAvatar: "https://i.pravatar.cc/200?img=12",
    price: 750, note: "I can do 3 sessions/week, organic-first approach.",
    status: "pending", createdAt: "1h",
  },
  {
    id: "b2", requirementId: "p2", tuddorId: "t1", tuddorName: "Maya Sharma",
    tuddorAvatar: "https://i.pravatar.cc/200?img=47",
    price: 800, note: "Available Mon/Wed/Fri evenings. First class free.",
    status: "accepted", createdAt: "3h",
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "New review on your profile", body: "“Maya explains complex topics so clearly.”", time: "2m", unread: true, kind: "system" },
  { id: "n2", title: "Calculus session in 30 minutes", body: "with Arjun · Zoom link ready", time: "30m", unread: true, kind: "message" },
  { id: "n3", title: "Bid accepted", body: "Ananya accepted your bid on Chemistry requirement.", time: "1h", unread: false, kind: "bid" },
  { id: "n4", title: "Monthly payout processed", body: "₹1,248 deposited to your account.", time: "1h", unread: false, kind: "system" },
];
