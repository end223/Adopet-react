export const handleApiError = (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro (por exemplo, 400, 401, 500)
      if (error.response.data && error.response.data.error) {
        return error.response.data.error;
      } else {
        return 'Ocorreu um erro inesperado no servidor.';
      }
    } else if (error.request) {
      // A solicitação foi feita, mas não houve resposta do servidor
      return 'Não foi possível conectar ao servidor.';
    } else {
      // Ocorreu um erro ao configurar a solicitação
      return 'Ocorreu um erro ao enviar a solicitação.';
    }
  };
  