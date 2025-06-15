import { useMutation } from "@tanstack/react-query";
import api from "../../api/axioInstance"

const executeSqlCode = async ({dbConnection, sqlCode}) => {

    const databaseUploadRequest = {
        sqlCode,
        databaseConnectionRequest: {
          host: dbConnection.host,
          port: dbConnection.port,
          databaseName: dbConnection.database,
          username: dbConnection.username,
          password: dbConnection.password,
        },
      };

    const { data } = await api.post('/database-connection/execute-sql-script',databaseUploadRequest)
    return data
} 

const fetchTables = async (dbConnection) => {
  const databaseConnectionRequest ={
     host: dbConnection.host,
      port: dbConnection.port,
      databaseName: dbConnection.database,
      username: dbConnection.username,
      password: dbConnection.password,
  };
  
  const { data } = await api.post('/database-connection/get-tables', databaseConnectionRequest);
  return data;
};

const fetchRoutines = async (dbConnection) => {
  const databaseConnectionRequest ={
     host: dbConnection.host,
      port: dbConnection.port,
      databaseName: dbConnection.database,
      username: dbConnection.username,
      password: dbConnection.password,
  };
  
  const { data } = await api.post('/database-connection/get-routines', databaseConnectionRequest);
  return data;
};

const executePLSqlCode = async (payload) => {
    const { data } = await api.post('/database-connection/execute-code',payload)
    return data
} 

export const useExecutePLSqlCode = ({ onSuccess, onError })  => {
    return useMutation({
      mutationFn: executePLSqlCode,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        if (onError) {
          onError(error);
        }
      },
    });
  };
  

export const useExecuteSqlCode = ({ onSuccess, onError })  => {
    return useMutation({
      mutationFn: executeSqlCode,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        if (onError) {
          onError(error);
        }
      },
    });
  };
  
  export const useLoadTables = ({ onSuccess, onError } = {}) => {
    return useMutation({
      mutationFn: fetchTables,
      onSuccess: (data) => {
        onSuccess(data);
      },
      onError: (error) => {
        onError(error);
      },
    });
  };

    export const useLoadRoutines = ({ onSuccess, onError } = {}) => {
    return useMutation({
      mutationFn: fetchRoutines,
      onSuccess: (data) => {
        onSuccess(data);
      },
      onError: (error) => {
        onError(error);
      },
    });
  };