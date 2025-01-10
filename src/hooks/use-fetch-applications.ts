
import { useGetApplicationFormsQuery } from "@/redux/features/apiDocument";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";



export default function FetchApplicationForms() {

const { data: applicationForms, isLoading, refetch } = useGetApplicationFormsQuery();
const { data: user } = useRetrieveUserQuery();

const applicationFormsData = applicationForms?.filter((applicationForm) => applicationForm.student === user?.profile?.id);


console.log(applicationFormsData)
return { applicationFormsData, isLoading, refetch };

}
 