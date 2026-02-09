export const handleApiError = (err, fallbackMessage) => {
  // 1. api.js 인터셉터에서 이미 { message } 형태로 온 경우
  if (typeof err === "object" && err.message) {
    throw new Error(err.message);
  }

  // 2. axios 원본 에러 구조가 남아있는 경우
  if (err?.response?.data?.message) {
    throw new Error(err.response.data.message);
  }

  // 3. 네트워크 오류 (response 자체가 없는 진짜 연결 실패)
  if (!err?.response) {
    throw new Error("서버에 연결할 수 없습니다.");
  }

  // 4. 그 외
  throw new Error(fallbackMessage);
};
