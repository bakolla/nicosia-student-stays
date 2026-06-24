import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Inquiry, InquiryStatus, Listing, ListingStatus } from "./types";
import { SEED_LISTINGS } from "./types";

type State = {
  listings: Listing[];
  inquiries: Inquiry[];
  isOwnerAuthed: boolean;
  loginOwner: (email: string, password: string) => boolean;
  logoutOwner: () => void;
  addListing: (l: Omit<Listing, "id">) => string;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  setListingStatus: (id: string, status: ListingStatus) => void;
  addInquiry: (i: Omit<Inquiry, "id" | "createdAt" | "status">) => string;
  setInquiryStatus: (id: string, status: InquiryStatus) => void;
  setInquiryNote: (id: string, note: string) => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      listings: SEED_LISTINGS,
      inquiries: [],
      isOwnerAuthed: false,
      loginOwner: (email, password) => {
        const ok = email === "owner@nicosiastays.demo" && password === "demo123";
        if (ok) set({ isOwnerAuthed: true });
        return ok;
      },
      logoutOwner: () => set({ isOwnerAuthed: false }),
      addListing: (l) => {
        const id = uid();
        set({ listings: [{ ...l, id }, ...get().listings] });
        return id;
      },
      updateListing: (id, patch) =>
        set({
          listings: get().listings.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        }),
      deleteListing: (id) => set({ listings: get().listings.filter((l) => l.id !== id) }),
      setListingStatus: (id, status) =>
        set({
          listings: get().listings.map((l) => (l.id === id ? { ...l, status } : l)),
        }),
      addInquiry: (i) => {
        const id = uid();
        set({
          inquiries: [
            { ...i, id, status: "new", createdAt: new Date().toISOString() },
            ...get().inquiries,
          ],
        });
        return id;
      },
      setInquiryStatus: (id, status) =>
        set({
          inquiries: get().inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
        }),
      setInquiryNote: (id, note) =>
        set({
          inquiries: get().inquiries.map((i) => (i.id === id ? { ...i, ownerNote: note } : i)),
        }),
    }),
    {
      name: "nicosia-stays-v2",
      partialize: (s) => ({
        listings: s.listings,
        inquiries: s.inquiries,
        isOwnerAuthed: s.isOwnerAuthed,
      }),
    },
  ),
);
