import { useMutation } from "@tanstack/react-query";
import api from "../../api/axioInstance"

const generateSqlCode = async (jsonSchema) => {
  const { data } = await api.post('/generate-sql', jsonSchema)
  return data
}

export const useSqlCode = (onSuccess, onError) => {
  return useMutation({
    mutationFn: generateSqlCode,
    onSuccess,
    onError
  });
};