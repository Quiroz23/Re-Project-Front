import { useGetPublishFormsQuery } from "@/redux/features/apiDocument";

export default function PublishFormPending() {
  // Obtener datos y función refetch desde el query
  const { data: publishForms, isLoading, refetch } = useGetPublishFormsQuery();

  // Filtrar los formularios en estado "Pendiente"
  const publishFormsData = publishForms?.filter(
    (publishForm) => publishForm.state === "1"
  );

  return { publishFormsData, isLoading, refetch };
}
