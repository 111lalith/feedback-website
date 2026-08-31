import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Student, Review, StreamType, DeletedHistoryItem } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Storage keys
const LOCAL_STUDENT_KEY = 'chathurya_student_id';
const LOCAL_ADMIN_KEY = 'chathurya_admin_demo_session';

// --- Student Operations ---

export function getLocalStudentId(): string | null {
  return localStorage.getItem(LOCAL_STUDENT_KEY);
}

export function setLocalStudentId(id: string): void {
  localStorage.setItem(LOCAL_STUDENT_KEY, id);
}

export function clearLocalStudentId(): void {
  localStorage.removeItem(LOCAL_STUDENT_KEY);
}

export async function registerStudent(studentData: Omit<Student, 'id' | 'registeredAt'>): Promise<Student> {
  const normalizedIdCard = studentData.idCardNo.trim().toUpperCase();
  
  // Check if student with this ID card number already exists
  const existing = await getStudentByIdCard(normalizedIdCard);
  if (existing) {
    setLocalStudentId(existing.id);
    return existing;
  }

  // Generate ID using clean timestamp + idCard
  const studentId = `std_${Date.now()}_${normalizedIdCard.replace(/[^a-zA-Z0-9]/g, '')}`;
  const now = Date.now();

  const formattedClass = studentData.classSection 
    || `${studentData.course} - ${studentData.year} (Sec ${studentData.section})`;

  const newStudent: Student = {
    id: studentId,
    name: studentData.name.trim(),
    phone: studentData.phone.trim(),
    idCardNo: normalizedIdCard,
    email: studentData.email.trim().toLowerCase(),
    course: studentData.course,
    year: studentData.year,
    section: studentData.section,
    classSection: formattedClass,
    stream: studentData.stream,
    laptopStatus: studentData.laptopStatus,
    hasLaptop: studentData.laptopStatus === 'I have laptop',
    registeredAt: now
  };

  const studentRef = doc(db, 'students', studentId);
  await setDoc(studentRef, newStudent);
  
  // Store local reference
  setLocalStudentId(studentId);
  return newStudent;
}

export async function getStudent(studentId: string): Promise<Student | null> {
  try {
    const docRef = doc(db, 'students', studentId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Student;
    }
    return null;
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    return null;
  }
}

export async function getStudentByIdCard(idCardNo: string): Promise<Student | null> {
  try {
    const normalized = idCardNo.trim().toUpperCase();
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('idCardNo', '==', normalized));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      return firstDoc.data() as Student;
    }
    return null;
  } catch (error) {
    console.error('Error finding student by ID card:', error);
    return null;
  }
}

export async function getAllStudents(): Promise<Student[]> {
  try {
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    const students: Student[] = [];
    snapshot.forEach(docSnap => {
      students.push(docSnap.data() as Student);
    });
    // Sort by registration date descending
    return students.sort((a, b) => b.registeredAt - a.registeredAt);
  } catch (error) {
    console.error('Error fetching all students:', error);
    return [];
  }
}

// --- Review Operations ---

export async function submitReview(reviewData: Omit<Review, 'id' | 'submittedAt'>): Promise<Review> {
  const reviewId = `rev_${reviewData.studentId}_day${reviewData.day}`;
  const now = Date.now();

  const review: Review = {
    ...reviewData,
    id: reviewId,
    submittedAt: now
  };

  const reviewRef = doc(db, 'reviews', reviewId);
  await setDoc(reviewRef, review);
  return review;
}

export async function getStudentReviews(studentId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    const reviews: Review[] = [];
    snapshot.forEach(docSnap => {
      reviews.push(docSnap.data() as Review);
    });
    return reviews.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error('Error fetching student reviews:', error);
    return [];
  }
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    const reviews: Review[] = [];
    snapshot.forEach(docSnap => {
      reviews.push(docSnap.data() as Review);
    });
    return reviews.sort((a, b) => b.submittedAt - a.submittedAt);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
}

// --- Admin Authentication ---

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem(LOCAL_ADMIN_KEY, 'true');
    return { success: true };
  } catch (err: any) {
    // If Firebase Auth fails because user has not yet been registered in Firebase console
    // Provide developer-friendly fallback matching prompt requirements
    if (email.trim().toLowerCase() === 'chathuryastdclub@gmail.com' && password === 'Studentdev') {
      try {
        await signInAnonymously(auth);
      } catch (authErr) {
        console.warn('Anonymous auth fallback notice:', authErr);
      }
      localStorage.setItem(LOCAL_ADMIN_KEY, 'true');
      return { success: true };
    }
    return { 
      success: false, 
      error: err?.message || 'Invalid administrator credentials.' 
    };
  }
}

export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem(LOCAL_ADMIN_KEY);
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Sign out notice:', e);
  }
}

export function isAdminAuthenticated(): boolean {
  if (auth.currentUser) return true;
  return localStorage.getItem(LOCAL_ADMIN_KEY) === 'true';
}

// Seed Demo Data for Instant Admin Exploration if Empty
export async function seedSampleData(): Promise<{ studentsCount: number; reviewsCount: number }> {
  const sampleStudents: Omit<Student, 'id' | 'registeredAt'>[] = [
    { name: "Aarav Sharma", phone: "9876543210", idCardNo: "21BCA042", email: "aarav.sharma@campus.edu", course: "BCA", year: "Year 2", section: "A", classSection: "BCA - Year 2 - Sec A", stream: "Full Stack Development", laptopStatus: "I have laptop", hasLaptop: true },
    { name: "Sneha Reddy", phone: "9876543211", idCardNo: "21BBA019", email: "sneha.reddy@campus.edu", course: "BBA", year: "Year 1", section: "B", classSection: "BBA - Year 1 - Sec B", stream: "Data Analytics", laptopStatus: "I have laptop", hasLaptop: true },
    { name: "Rahul Varma", phone: "9876543212", idCardNo: "21BCM104", email: "rahul.varma@campus.edu", course: "BCOM", year: "Year 3", section: "C", classSection: "BCOM - Year 3 - Sec C", stream: "Full Stack Development", laptopStatus: "I have at home", hasLaptop: true },
    { name: "Ananya Iyer", phone: "9876543213", idCardNo: "21BAF055", email: "ananya.iyer@campus.edu", course: "BCOM (A & F)", year: "Year 2", section: "D", classSection: "BCOM (A & F) - Year 2 - Sec D", stream: "Data Analytics", laptopStatus: "I don't have laptop", hasLaptop: false },
    { name: "Vikram Malhotra", phone: "9876543214", idCardNo: "21BCA088", email: "vikram.m@campus.edu", course: "BCA", year: "Year 1", section: "E", classSection: "BCA - Year 1 - Sec E", stream: "Full Stack Development", laptopStatus: "I have laptop", hasLaptop: true },
    { name: "Pooja Hegde", phone: "9876543215", idCardNo: "21BBA023", email: "pooja.h@campus.edu", course: "BBA", year: "Year 2", section: "F", classSection: "BBA - Year 2 - Sec F", stream: "Data Analytics", laptopStatus: "I have laptop", hasLaptop: true },
    { name: "Karthik Raja", phone: "9876543216", idCardNo: "21BCM091", email: "karthik.raja@campus.edu", course: "BCOM", year: "Year 3", section: "G", classSection: "BCOM - Year 3 - Sec G", stream: "Full Stack Development", laptopStatus: "I have at home", hasLaptop: true },
    { name: "Divya Patel", phone: "9876543217", idCardNo: "21BAF012", email: "divya.p@campus.edu", course: "BCOM (A & F)", year: "Year 1", section: "H", classSection: "BCOM (A & F) - Year 1 - Sec H", stream: "Data Analytics", laptopStatus: "I have laptop", hasLaptop: true },
    { name: "Mohammed Zaid", phone: "9876543218", idCardNo: "21BCA115", email: "zaid.m@campus.edu", course: "BCA", year: "Year 3", section: "I", classSection: "BCA - Year 3 - Sec I", stream: "Full Stack Development", laptopStatus: "I don't have laptop", hasLaptop: false },
    { name: "Tanvi Kulkarni", phone: "9876543219", idCardNo: "21BBA044", email: "tanvi.k@campus.edu", course: "BBA", year: "Year 2", section: "J", classSection: "BBA - Year 2 - Sec J", stream: "Data Analytics", laptopStatus: "I have laptop", hasLaptop: true }
  ];

  let addedStudents = 0;
  let addedReviews = 0;

  for (const s of sampleStudents) {
    const student = await registerStudent(s);
    addedStudents++;

    // Add 1 to 10 sample reviews per student
    const daysToSubmit = Math.floor(Math.random() * 8) + 4; // 4 to 12 days
    for (let day = 1; day <= daysToSubmit; day++) {
      const isPositive = Math.random() > 0.15;
      const contentRating = isPositive ? (Math.random() > 0.3 ? 5 : 4) : 3;
      const trainerRating = isPositive ? (Math.random() > 0.2 ? 5 : 4) : 3;
      const paceRating = Math.random() > 0.3 ? 4 : (Math.random() > 0.5 ? 5 : 3);
      const practicalRating = isPositive ? 5 : 4;
      const overallRatingRaw = Math.round((contentRating + trainerRating + paceRating + practicalRating) / 4);
      const overallRating = Math.max(1, Math.min(5, overallRatingRaw));

      const likes = [
        "Interactive live coding exercises were super helpful and clear!",
        "The trainer explained core concepts with practical real-world industry examples.",
        "Step-by-step code walkthrough made challenging concepts really easy to grasp.",
        "Loved the hands-on debugging challenge and responsive mentor support.",
        "Clear slides, thorough repository documentation, and friendly doubts clearing."
      ];

      const improvements = [
        "More time for independent practice before jumping to next topic would be great.",
        "Share code snippets repository 5 minutes before the session starts.",
        "A 5-minute break in the middle of long hands-on exercises.",
        "Provide additional optional take-home challenge assignments.",
        "Everything was great! Pace was well balanced."
      ];

      await submitReview({
        studentId: student.id,
        day,
        contentRating,
        trainerRating,
        paceRating,
        practicalRating,
        overallRating,
        liked: likes[Math.floor(Math.random() * likes.length)],
        improve: improvements[Math.floor(Math.random() * improvements.length)],
        recommend: Math.random() > 0.08,
        studentName: student.name,
        studentStream: student.stream,
        idCardNo: student.idCardNo
      });
      addedReviews++;
    }
  }

  return { studentsCount: addedStudents, reviewsCount: addedReviews };
}

// --- Deletion & History Management ---

export async function deleteStudent(studentId: string): Promise<{ success: boolean; deletedStudent: Student | null }> {
  try {
    const student = await getStudent(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    // Fetch all reviews by this student
    const reviews = await getStudentReviews(studentId);

    // Save to deleted_history collection
    const historyId = `hist_std_${studentId}_${Date.now()}`;
    const historyItem: DeletedHistoryItem = {
      id: historyId,
      type: 'single_student',
      description: `Deleted student: ${student.name} (${student.idCardNo} - ${student.classSection}) with ${reviews.length} reviews`,
      deletedAt: Date.now(),
      deletedBy: auth.currentUser?.email || 'Admin',
      studentCount: 1,
      reviewCount: reviews.length,
      studentName: student.name,
      idCardNo: student.idCardNo,
      studentsData: [student],
      reviewsData: reviews
    };

    const historyRef = doc(db, 'deleted_history', historyId);
    await setDoc(historyRef, historyItem);

    // Delete reviews from active database
    for (const rev of reviews) {
      const revRef = doc(db, 'reviews', rev.id);
      await deleteDoc(revRef);
    }

    // Delete student record
    const studentRef = doc(db, 'students', studentId);
    await deleteDoc(studentRef);

    // Clear local storage if currently active student
    if (getLocalStudentId() === studentId) {
      clearLocalStudentId();
    }

    return { success: true, deletedStudent: student };
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

export async function clearEntireDatabase(): Promise<{ success: boolean; studentsCount: number; reviewsCount: number }> {
  try {
    const allStudents = await getAllStudents();
    const allReviews = await getAllReviews();

    // Save backup to deleted_history before clearing
    const historyId = `hist_wipe_${Date.now()}`;
    const historyItem: DeletedHistoryItem = {
      id: historyId,
      type: 'entire_database',
      description: `Full Database Wipe: ${allStudents.length} students and ${allReviews.length} reviews archived`,
      deletedAt: Date.now(),
      deletedBy: auth.currentUser?.email || 'Admin',
      studentCount: allStudents.length,
      reviewCount: allReviews.length,
      studentsData: allStudents,
      reviewsData: allReviews
    };

    const historyRef = doc(db, 'deleted_history', historyId);
    await setDoc(historyRef, historyItem);

    // Delete all review documents
    for (const rev of allReviews) {
      const revRef = doc(db, 'reviews', rev.id);
      await deleteDoc(revRef);
    }

    // Delete all student documents
    for (const std of allStudents) {
      const stdRef = doc(db, 'students', std.id);
      await deleteDoc(stdRef);
    }

    // Clear active local student
    clearLocalStudentId();

    return {
      success: true,
      studentsCount: allStudents.length,
      reviewsCount: allReviews.length
    };
  } catch (error) {
    console.error('Error clearing entire database:', error);
    throw error;
  }
}

export async function getDeletedHistory(): Promise<DeletedHistoryItem[]> {
  try {
    const historyRef = collection(db, 'deleted_history');
    const snapshot = await getDocs(historyRef);
    const historyItems: DeletedHistoryItem[] = [];
    snapshot.forEach(docSnap => {
      historyItems.push(docSnap.data() as DeletedHistoryItem);
    });
    return historyItems.sort((a, b) => b.deletedAt - a.deletedAt);
  } catch (error) {
    console.error('Error fetching deleted history:', error);
    return [];
  }
}

export async function restoreDeletedHistory(historyId: string): Promise<{ success: boolean; restoredStudents: number; restoredReviews: number }> {
  try {
    const historyRef = doc(db, 'deleted_history', historyId);
    const snap = await getDoc(historyRef);
    if (!snap.exists()) {
      throw new Error('History record not found');
    }

    const item = snap.data() as DeletedHistoryItem;
    let restoredStudents = 0;
    let restoredReviews = 0;

    // Restore students
    if (item.studentsData && item.studentsData.length > 0) {
      for (const std of item.studentsData) {
        const studentRef = doc(db, 'students', std.id);
        await setDoc(studentRef, std);
        restoredStudents++;
      }
    }

    // Restore reviews
    if (item.reviewsData && item.reviewsData.length > 0) {
      for (const rev of item.reviewsData) {
        const revRef = doc(db, 'reviews', rev.id);
        await setDoc(revRef, rev);
        restoredReviews++;
      }
    }

    // Remove or keep history item
    await deleteDoc(historyRef);

    return { success: true, restoredStudents, restoredReviews };
  } catch (error) {
    console.error('Error restoring history item:', error);
    throw error;
  }
}

export async function deleteHistoryItem(historyId: string): Promise<boolean> {
  try {
    const historyRef = doc(db, 'deleted_history', historyId);
    await deleteDoc(historyRef);
    return true;
  } catch (error) {
    console.error('Error permanently deleting history item:', error);
    throw error;
  }
}

