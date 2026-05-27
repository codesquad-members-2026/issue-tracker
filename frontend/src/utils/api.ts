/**
 * 인증 토큰을 자동으로 포함하여 API 요청을 보내는 공통 함수
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem('accessToken');
    
    // 기본 헤더 설정
    const headers = new Headers(options.headers || {});
    
    // 토큰이 있으면 Authorization 헤더 추가
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    
    // JSON 요청인 경우 Content-Type 설정 (따로 설정되지 않은 경우만)
    if (!headers.has('Content-Type') && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // 만약 401(Unauthorized) 에러가 나면 로그아웃 처리가 필요할 수 있음
    if (response.status === 401) {
        console.warn('인증이 만료되었습니다. 다시 로그인해 주세요.');
        localStorage.removeItem('accessToken');
        // 필요 시 여기서 /login으로 리다이렉트 시키는 로직을 추가할 수 있습니다.
    }

    return response;
};
