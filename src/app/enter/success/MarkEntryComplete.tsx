"use client";

import { useEffect } from "react";

export default function MarkEntryComplete() {
  useEffect(() => {
    sessionStorage.setItem("maya_entry_complete", "true");
  }, []);
  return null;
}
