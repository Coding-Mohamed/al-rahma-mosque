// lib/checkAdmin.js
// TEMPORARY DEBUG VERSION - Enhanced logging

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function isAdmin(uid) {
  console.log("🔍 [isAdmin] Starting check...");
  console.log("  UID received:", uid);

  if (!uid) {
    console.log("❌ [isAdmin] No UID provided");
    return false;
  }

  try {
    console.log("  Fetching document: admins/" + uid);
    const userDoc = await getDoc(doc(db, "admins", uid));

    console.log("  Document exists:", userDoc.exists());

    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log("  Document data:", {
        email: data?.email,
        isAdmin: data?.isAdmin,
        isSuperAdmin: data?.isSuperAdmin,
        hasIsAdminField: "isAdmin" in data,
        isAdminValue: data?.isAdmin,
        isAdminType: typeof data?.isAdmin,
      });

      const result = data?.isAdmin === true;
      console.log("  Final result:", result);
      return result;
    } else {
      console.log("❌ [isAdmin] Document does not exist!");
      console.log("  Trying to list all documents in admins collection...");

      try {
        const adminsSnapshot = await getDocs(collection(db, "admins"));
        console.log("  Total admin documents:", adminsSnapshot.size);
        adminsSnapshot.forEach((doc) => {
          console.log("    - Doc ID:", doc.id);
          console.log("      Email:", doc.data().email);
        });
      } catch (listError) {
        console.log("  Could not list admins:", listError.message);
      }

      return false;
    }
  } catch (error) {
    console.error("❌ [isAdmin] Error:", error);
    console.error("  Error code:", error.code);
    console.error("  Error message:", error.message);
    return false;
  }
}

export async function getAdminUsers() {
  try {
    const adminsSnapshot = await getDocs(collection(db, "admins"));
    return adminsSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
}

export async function isSuperAdmin(uid) {
  if (!uid) return false;

  try {
    const userDoc = await getDoc(doc(db, "admins", uid));
    return userDoc.exists() && userDoc.data()?.isSuperAdmin === true;
  } catch (error) {
    console.error("Error checking super admin status:", error);
    return false;
  }
}
