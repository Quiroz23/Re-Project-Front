import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAuthor from "@/hooks/use-author";
import { useGetSectionQuery } from "@/redux/features/apiAcademic";
import {
  useGetGroupQuery,
  useGetStudentsSectionQuery,
} from "@/redux/features/apiUser";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Label } from "../ui/label";

interface Props {
  selectedGroupId: number | null;
  setStateForm: (data: boolean) => void;
}

export default function AuthorsForm({ selectedGroupId, setStateForm }: Props) {
  const {
    onSubmit,
    onChange,
    formData,
    errors,
    handleButtonClick,
    showSecondStudent,
    setShowSecondStudent,
    showThirdStudent,
    setShowThirdStudent,
  } = useAuthor(selectedGroupId, setStateForm);

  const { data: user } = useRetrieveUserQuery();
  const { data: group } = useGetGroupQuery(selectedGroupId ?? 0);
  const { data: section } = useGetSectionQuery(group?.section ?? 0);
  const { data: students } = useGetStudentsSectionQuery(section?.id ?? 0);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Agrega autores</CardTitle>
          <CardDescription>
            Agrega el nombre de los autores del documento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.group?.name === "Director de Carrera" ? (
            <form onSubmit={onSubmit}>
              {/* Primer integrante (obligatorio) */}
              <div className="flex items-center gap-3 mb-5">
                <Input
                  type="text"
                  name="studentOne"
                  placeholder="Nombre del primer integrante"
                  value={formData.studentOne}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  onChange={onChange}
                />
                <Button
                  type="button"
                  onClick={(event) =>
                    handleButtonClick(event, formData.studentOne, "studentOne")
                  }
                >
                  Enviar
                </Button>
              </div>
              {errors.studentOne && (
                <p className="text-red-500 mb-2">{errors.studentOne}</p>
              )}

              {/* Botón para mostrar el segundo autor */}
              {!showSecondStudent && (
                <Button
                  type="button"
                  className="w-full mb-4"
                  onClick={() => setShowSecondStudent(true)}
                >
                  Agregar otro autor
                </Button>
              )}

              {/* Segundo integrante (opcional) */}
              {showSecondStudent && (
                <div className="flex items-center gap-3 mb-5">
                  <Input
                    type="text"
                    name="studentTwo"
                    value={formData.studentTwo}
                    placeholder="Nombre del segundo integrante"
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    onChange={onChange}
                  />
                  <Button
                    type="button"
                    onClick={(event) =>
                      handleButtonClick(
                        event,
                        formData.studentTwo,
                        "studentTwo"
                      )
                    }
                  >
                    Enviar
                  </Button>
                </div>
              )}
              {errors.studentTwo && (
                <p className="text-red-500 mb-2">{errors.studentTwo}</p>
              )}

              {/* Botón para mostrar el tercer autor si el segundo ya está visible */}
              {showSecondStudent && !showThirdStudent && (
                <Button
                  type="button"
                  className="w-full mb-4"
                  onClick={() => setShowThirdStudent(true)}
                >
                  Agregar otro autor
                </Button>
              )}

              {/* Tercer integrante (opcional) */}
              {showThirdStudent && (
                <div className="flex items-center gap-3 mb-5">
                  <Input
                    type="text"
                    name="studentTree"
                    value={formData.studentTree}
                    placeholder="Nombre del tercer integrante"
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    onChange={onChange}
                  />
                  <Button
                    type="button"
                    onClick={(event) =>
                      handleButtonClick(
                        event,
                        formData.studentTree,
                        "studentTree"
                      )
                    }
                  >
                    Enviar
                  </Button>
                </div>
              )}
              {errors.studentTree && (
                <p className="text-red-500 mb-2">{errors.studentTree}</p>
              )}

              <Button type="submit" className="w-full">
                Confirmar
              </Button>
            </form>
          ) : (
            <form onSubmit={onSubmit}>
              {/* Primer integrante (obligatorio) */}
              <div className="flex items-center gap-3 mb-5">
                <Label htmlFor="studentOne">Primer Integrante</Label>
                <select
                  name="studentOne"
                  value={formData.studentOne}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  onChange={onChange} // Pasar el evento directamente
                >
                  <option value="" disabled>
                    Seleccione un estudiante
                  </option>
                  {(students || []).map((student) => (
                    <option
                      key={student.id}
                      value={`${student.first_name} ${student.last_name}`}
                    >
                      {student.email}
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  onClick={(event) =>
                    handleButtonClick(event, formData.studentOne, "studentOne")
                  }
                >
                  Enviar
                </Button>
              </div>
              {errors.studentOne && (
                <p className="text-red-500 mb-2">{errors.studentOne}</p>
              )}
              {/* Botón para mostrar el segundo autor */}
              {!showSecondStudent && (
                <Button
                  type="button"
                  className="w-full mb-4"
                  onClick={() => setShowSecondStudent(true)}
                >
                  Agregar otro autor
                </Button>
              )}
              {/* Segundo integrante (opcional) */}
              {showSecondStudent && (
                <div className="flex items-center gap-3 mb-5">
                  <Label htmlFor="studentTwo">Segundo Integrante</Label>
                  <select
                    name="studentTwo"
                    value={formData.studentTwo}
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    onChange={onChange}
                  >
                    <option value="" disabled>
                      Seleccione un estudiante
                    </option>
                    {(students || []).map((student) => (
                      <option
                        key={student.id}
                        value={`${student.first_name} ${student.last_name}`}
                      >
                        {student.email}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={(event) =>
                      handleButtonClick(
                        event,
                        formData.studentTwo,
                        "studentTwo"
                      )
                    }
                  >
                    Enviar
                  </Button>
                </div>
              )}
              {errors.studentTwo && (
                <p className="text-red-500 mb-2">{errors.studentTwo}</p>
              )}
              {/* Botón para mostrar el tercer autor si el segundo ya está visible */}
              {showSecondStudent && !showThirdStudent && (
                <Button
                  type="button"
                  className="w-full mb-4"
                  onClick={() => setShowThirdStudent(true)}
                >
                  Agregar otro autor
                </Button>
              )}
              {/* Tercer integrante */}
              {showThirdStudent && (
                <div className="flex items-center gap-3 mb-5">
                  <Label htmlFor="studentTree">Tercer Integrante</Label>
                  <select
                    name="studentTree"
                    value={formData.studentTree}
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    onChange={onChange}
                  >
                    <option value="" disabled>
                      Seleccione un estudiante
                    </option>
                    {(students || []).map((student) => (
                      <option
                        key={student.id}
                        value={`${student.first_name} ${student.last_name}`}
                      >
                        {student.email}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={(event) =>
                      handleButtonClick(
                        event,
                        formData.studentTree,
                        "studentTree"
                      )
                    }
                  >
                    Enviar
                  </Button>
                </div>
              )}
              {errors.studentTree && (
                <p className="text-red-500 mb-2">{errors.studentTree}</p>
              )}

              <Button type="submit" className="w-full">
                Confirmar
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
