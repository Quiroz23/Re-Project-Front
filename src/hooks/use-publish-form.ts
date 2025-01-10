
import { useGetPublishFormsQuery } from "@/redux/features/apiDocument";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";



export default function PublishForm() {

const { data: publishForms, isLoading, refetch } = useGetPublishFormsQuery();
const { data: user } = useRetrieveUserQuery();

const publishFormsData = publishForms?.filter((publishForm) => publishForm.teacher_guide === user?.profile?.id);





console.log(publishFormsData)
return { publishFormsData, isLoading, refetch };

}
 