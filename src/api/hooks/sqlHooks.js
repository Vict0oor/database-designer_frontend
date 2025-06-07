import { useMutation } from "@tanstack/react-query";
import api from "../../api/axioInstance"

const generateSqlCode = async (jsonSchema) => {
  const { data } = await api.post('/generate-sql', jsonSchema)
  return data
}

const generateQuery = async (jsonSchema)=> {
  const { data } = await api.post('/plsql/generate/query', jsonSchema)
  return data
}

const generateProcedure = async (jsonSchema)=> {
  const { data } = await api.post('/plsql/generate/procedure', jsonSchema)
  return data
}

const generateFunction = async (jsonSchema)=> {
  const { data } = await api.post('/plsql/generate/function', jsonSchema)
  return data
}

export const useSqlCode = (onSuccess, onError) => {
  return useMutation({
    mutationFn: generateSqlCode,
    onSuccess,
    onError
  });
};

export const useGenerateQuery = (onSuccess, onError) => {
  return useMutation({
    mutationFn: generateQuery,
    onSuccess,
    onError
  });
};

export const useGenerateProcedure = (onSuccess, onError) => {
  return useMutation({
    mutationFn: generateProcedure,
    onSuccess,
    onError
  });
};
export const useGenerateFunction = (onSuccess, onError) => {
  return useMutation({
    mutationFn: generateFunction,
    onSuccess,
    onError
  });
};