import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CarbonProject, ProjectType, VerificationStatus } from "@/types";

const PROJECTS_COLLECTION = "projects";
const PROJECT_FILES_COLLECTION = "projectFiles";
const REPORTS_COLLECTION = "acvaReports";

/** Firestore document for a project file (base64). Firestore doc max ~1MB; keep files small. */
export interface ProjectFileDoc {
  id: string;
  projectId: string;
  fileName: string;
  contentType: string;
  base64: string;
  createdAt?: Date;
}

export interface ProjectCreateInput {
  sellerId: string;
  name: string;
  description: string;
  type: ProjectType;
  location: { country: string; region: string };
  startDate: Date;
  volumeTCO2e: number;
  monitoringPlan: string;
  /** Firestore document IDs in projectFiles collection */
  governmentApprovalDocFileId?: string;
  complianceDocFileId?: string;
  /** Array of Firestore document IDs (projectFiles) for photos */
  photoFileIds: string[];
  complianceStatus: "compliant" | "non_compliant" | "pending";
}

/**
 * Read a File as base64. Firestore document limit ~1MB; use for small files only.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Save a project file to Firestore (base64) under the `projectFiles` collection.
 * Returns the Firestore document ID to store in the project (e.g. photos array or doc ref).
 */
export async function saveProjectFile(
  projectId: string,
  fileName: string,
  file: File
): Promise<string> {
  const base64 = await fileToBase64(file);
  const fileId = doc(collection(db, PROJECT_FILES_COLLECTION)).id;
  const docRef = doc(db, PROJECT_FILES_COLLECTION, fileId);
  await setDoc(docRef, {
    id: fileId,
    projectId,
    fileName,
    contentType: file.type || "application/octet-stream",
    base64,
    createdAt: serverTimestamp(),
  });
  return fileId;
}

/**
 * Get a project file by (projectId, fileName). Returns first match if multiple exist.
 */
export async function getProjectFile(
  projectId: string,
  fileName: string
): Promise<{ base64: string; contentType: string } | null> {
  const q = query(
    collection(db, PROJECT_FILES_COLLECTION),
    where("projectId", "==", projectId),
    where("fileName", "==", fileName)
  );
  const snap = await getDocs(q);
  const first = snap.docs[0];
  if (!first) return null;
  const data = first.data();
  return { base64: data.base64, contentType: data.contentType || "application/octet-stream" };
}

/**
 * Get a project file by its Firestore document ID (e.g. from project.photos[0]).
 */
export async function getProjectFileById(
  fileId: string
): Promise<{ base64: string; contentType: string } | null> {
  const docRef = doc(db, PROJECT_FILES_COLLECTION, fileId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return { base64: data.base64, contentType: data.contentType || "application/octet-stream" };
}

/**
 * Get a data URL for use in img src or token metadata, by file document ID.
 */
export async function getProjectFileDataUrl(fileId: string): Promise<string | null> {
  const file = await getProjectFileById(fileId);
  if (!file) return null;
  return `data:${file.contentType};base64,${file.base64}`;
}

/**
 * Resolve an image reference to a URL. If it's already a URL (http/https/data), return as-is.
 * Otherwise treat as a Firestore projectFiles document ID and return a data URL.
 */
export async function resolveImageUrl(imageRef: string | undefined): Promise<string> {
  if (!imageRef) return "";
  if (
    imageRef.startsWith("http:") ||
    imageRef.startsWith("https:") ||
    imageRef.startsWith("data:")
  ) {
    return imageRef;
  }
  const dataUrl = await getProjectFileDataUrl(imageRef);
  return dataUrl ?? "";
}

export async function createProject(
  input: ProjectCreateInput,
  projectId?: string
): Promise<string> {
  const id = projectId || doc(collection(db, PROJECTS_COLLECTION)).id;
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await setDoc(docRef, {
    id,
    sellerId: input.sellerId,
    name: input.name,
    description: input.description,
    type: input.type,
    location: {
      country: input.location.country,
      region: input.location.region,
    },
    startDate: input.startDate,
    volumeTCO2e: input.volumeTCO2e,
    verificationStatus: "pending",
    governmentApprovalDoc: input.governmentApprovalDocFileId ?? null,
    monitoringPlan: input.monitoringPlan,
    photos: input.photoFileIds,
    complianceStatus: input.complianceStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function getProject(projectId: string): Promise<CarbonProject | null> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    id: snap.id,
    startDate: data.startDate?.toDate?.() ?? data.startDate,
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
  } as CarbonProject;
}

export async function getProjectsBySeller(sellerId: string): Promise<CarbonProject[]> {
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where("sellerId", "==", sellerId),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      startDate: data.startDate?.toDate?.() ?? data.startDate,
      endDate: data.endDate?.toDate?.() ?? data.endDate,
      createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
    } as CarbonProject;
  });
}

export async function getVerifiedProjects(sellerId: string): Promise<CarbonProject[]> {
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where("sellerId", "==", sellerId),
    where("verificationStatus", "==", "verified")
  );
  const snap = await getDocs(q);
  const projects = snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      startDate: data.startDate?.toDate?.() ?? data.startDate,
      endDate: data.endDate?.toDate?.() ?? data.endDate,
      createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
    } as CarbonProject;
  });
  return projects.sort((a, b) => {
    const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0;
    const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0;
    return bTime - aTime;
  });
}

export async function updateProjectVerification(
  projectId: string,
  status: VerificationStatus,
  acvaReportId?: string
): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await updateDoc(docRef, {
    verificationStatus: status,
    ...(acvaReportId ? { acvaReportId } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function saveACVAReport(
  projectId: string,
  content: string,
  status: "draft" | "submitted" | "approved" | "rejected"
): Promise<string> {
  const reportId = doc(collection(db, REPORTS_COLLECTION)).id;
  await setDoc(doc(db, REPORTS_COLLECTION, reportId), {
    id: reportId,
    projectId,
    content,
    status,
    generatedAt: serverTimestamp(),
    submittedAt: status === "submitted" ? serverTimestamp() : null,
  });
  return reportId;
}

export async function updateProjectWithReport(
  projectId: string,
  reportId: string,
  verificationStatus: VerificationStatus
): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await updateDoc(docRef, {
    acvaReportId: reportId,
    verificationStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateProjectNftId(
  projectId: string,
  tokenId: number,
  contractAddress: string
): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await updateDoc(docRef, {
    nftId: String(tokenId),
    nftContractAddress: contractAddress,
    updatedAt: serverTimestamp(),
  });
}

export async function saveProjectContract(
  projectId: string,
  contractAddress: string
): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await updateDoc(docRef, {
    nftContractAddress: contractAddress,
    updatedAt: serverTimestamp(),
  });
}
