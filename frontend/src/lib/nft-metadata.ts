import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import type { ProjectType } from "@/types";

export interface NFTMetadataInput {
  name: string;
  description: string;
  image: string;
  projectType: ProjectType;
  volumeTCO2e: number;
  verificationProof: string;
  vintage: number;
  location: string;
}

/**
 * Upload NFT metadata JSON to Firebase Storage using the official SDK only (no REST).
 * Uses uploadBytes with application/json to avoid CORS issues from direct REST POST.
 */
export async function uploadNFTMetadata(
  projectId: string,
  metadata: NFTMetadataInput
): Promise<string> {
  const path = `nft-metadata/${projectId}.json`;
  const storageRef = ref(storage, path);
  const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
  await uploadBytes(storageRef, blob, { contentType: "application/json" });
  const url = await getDownloadURL(storageRef);
  return url;
}
