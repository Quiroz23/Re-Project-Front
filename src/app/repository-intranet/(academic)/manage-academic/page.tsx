"use client";

import CardArea from "@/components/academic/CardArea";

export default function ManageAcademicPage() {
  return (
    <>
      <div className="flex justify-center my-8 text-4xl font-medium">
        <p>Gestionar Área</p>
      </div>
      <div className="flex justify-center p-2">
        <CardArea />
      </div>
    </>
  );
}
