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
    
    // JSON 요청인 경우 Content-Type 설정 (따로 설정되지 않은 경우만, FormData인 경우는 브라우저가 자동으로 설정하게 둠)
    if (!headers.has('Content-Type') && 
        (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') &&
        !(options.body instanceof FormData)
    ) {
        headers.set('Content-Type', 'application/json');
    }

    let response = await fetch(url, {
        ...options,
        headers,
    });

    // 만약 401(Unauthorized) 에러가 나면 Access Token 만료를 의심하고 Refresh 시도
    if (response.status === 401) {
        try {
            // 1. Refresh Token API 호출 (브라우저가 HttpOnly 쿠키를 자동으로 보냄)
            // credentials: 'include' 옵션이 있어야 쿠키가 전송됩니다.
            const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include', // 크로스 도메인일 경우 쿠키 전송을 위해 필수 (로컬에서도 명시해주는 것이 좋음)
            });

            if (refreshResponse.ok) {
                const result = await refreshResponse.json();
                
                if (result.success && result.data && result.data.accessToken) {
                    // 2. 재발급 성공 시 새 Access Token을 로컬 스토리지에 덮어쓰기
                    const newAccessToken = result.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // 3. 실패했던 원래 요청의 헤더에 새 토큰을 끼워 넣고 다시 요청(Retry)
                    headers.set('Authorization', `Bearer ${newAccessToken}`);
                    response = await fetch(url, {
                        ...options,
                        headers,
                    });
                    
                    return response; // 재시도한 요청의 결과를 반환
                }
            }
            
            // Refresh API 응답이 ok가 아니거나 토큰이 없는 경우 (RT도 만료/삭제됨)
            throw new Error('Refresh Token is invalid or expired.');

        } catch {
            // 4. 재발급 실패 시: 완전한 로그아웃 상태로 간주
            console.warn('인증이 만료되었습니다. 다시 로그인해 주세요.');
            localStorage.removeItem('accessToken');
            window.location.href = '/login'; // 로그인 페이지로 강제 이동
            return response; // 에러가 나도 원래의 401 응답을 일단 반환 (의미는 없지만 타입 맞추기 위함)
        }
    }

    return response;
};
