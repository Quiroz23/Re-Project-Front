"use client";

import AuthorsForm from "@/components/publish-document/authors-form";
import DocumentFormRe from "@/components/publish-document/document-form-re";
import GroupForm from "@/components/publish-document/group-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";
import { useState } from "react";

export default function PublishDocumentPage() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [stateForm, setStateForm] = useState<boolean>(false);

  return (
    <>
      <ProtectedRoute allowedRoles={[UserRole.ProfesorGuía]}>
      <div className="flex items-center justify-center min-h-screen w-full">
             <div className="flex items-center justify-center space-y-8 w-full">
                {stateForm ? (
                    <DocumentFormRe idGroup={groupId ?? 0} method="post"/>
                ) : (
                    <>
                        {groupId === null && <GroupForm onGroupSelect={setGroupId} />}
                        {groupId !== null && (
                            <AuthorsForm selectedGroupId={groupId} setStateForm={setStateForm} />
                        )}
                    </>
                )}
            </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
 
