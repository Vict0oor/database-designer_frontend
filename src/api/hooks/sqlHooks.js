import { useQuery } from "@tanstack/react-query";
import api from "../../api/axioInstance"

const fetchSqlCode = async (jsonSchema) => {
  const { data } = await api.post('/generate-sql', jsonSchema)
  return data
}

export const useSqlCode = (jsonSchema, enabled = true) => {
  return useQuery({
    queryKey: ['g-sql-code', jsonSchema],
    queryFn: () => fetchSqlCode(jsonSchema),
    enabled,
  })
}