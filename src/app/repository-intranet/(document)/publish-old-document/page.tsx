"use client";

import AuthorsForm from "@/components/publish-document/authors-form";
import GroupForm from "@/components/publish-document/group-form";
import RegisterFormOld from "@/components/publish-document/register-form-old";

import { useState } from "react";

export default function PublishOldDocumentPage() {
    const [groupId, setGroupId] = useState<number | null>(null);
    const [stateForm, setStateForm] = useState<boolean>(false);
    const [selectedProfesor, setSelectedProfesor] = useState<number>(0);

    return (
        <div className="flex justify-center items-center h-screen">
        

            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="flex items-center justify-center space-y-8 w-full">
                    {stateForm ? (
                        <RegisterFormOld idGroup={groupId ?? 0} method="post" selectedProfesor={selectedProfesor}/>
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
      </div>
    )

}