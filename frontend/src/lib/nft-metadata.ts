import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { ProjectType } from "@/types";

const NFT_METADATA_COLLECTION = "nftMetadata";

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

export interface NFTMetadataStored extends NFTMetadataInput {
  projectId: string;
  savedAt: Date;
}

/**
 * Save NFT metadata to Firestore under the `nftMetadata` collection.
 * Document ID is the projectId. Returns a data URL for use as tokenURI in the contract.
 */
export async function saveNFTMetadata(
  projectId: string,
  metadata: NFTMetadataInput
): Promise<string> {
  const docRef = doc(db, NFT_METADATA_COLLECTION, projectId);
  await setDoc(docRef, {
    projectId,
    ...metadata,
    savedAt: new Date(),
  });

  // Return a data URL so the contract tokenURI works without HTTP (ERC-721 compatible).
  const json = JSON.stringify(metadata);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return `data:application/json;base64,${base64}`;
}

/**
 * Retrieve NFT metadata from Firestore by projectId.
 */
export async function getNFTMetadata(projectId: string): Promise<NFTMetadataStored | null> {
  const docRef = doc(db, NFT_METADATA_COLLECTION, projectId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    projectId: snap.id,
    savedAt: data.savedAt?.toDate?.() ?? data.savedAt,
  } as NFTMetadataStored;
}

/**
 * @deprecated Use saveNFTMetadata. Kept for backward compatibility with minting flow.
 * Saves metadata to Firestore and returns a data URL for tokenURI.
 */
export async function uploadNFTMetadata(
  projectId: string,
  metadata: NFTMetadataInput
): Promise<string> {
  return saveNFTMetadata(projectId, metadata);
}
