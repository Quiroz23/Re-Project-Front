import { useGetApplicationFormsQuery } from "@/redux/features/apiDocument";



export default function ApplicationFormPending() {
  // Obtener datos y función refetch desde el query
  const { data: applicationForms, isLoading, refetch } = useGetApplicationFormsQuery();

  // Filtrar los formularios en estado "Pendiente"
  const applicationFormsData = applicationForms?.filter(
    (applicationForm) => applicationForm.state === "1"
  );

  return { applicationFormsData, isLoading, refetch };
}
