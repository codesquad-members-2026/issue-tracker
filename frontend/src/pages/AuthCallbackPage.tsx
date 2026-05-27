import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRequested = useRef(false);

    useEffect(() => {
        const code = searchParams.get('code');

        if (!code) {
            alert('인증 코드가 없습니다.');
            navigate('/login', { replace: true });
            return;
        }

        // React.StrictMode 환경에서 두 번 요청되는 것을 방지
        if (hasRequested.current) return;
        hasRequested.current = true;

        const exchangeCodeForToken = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login/github`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                });

                const result = await response.json();

                if (result.success) {
                    // 백엔드 응답 구조: result.data.token.accessToken
                    const token = result.data.token.accessToken;
                    localStorage.setItem('accessToken', token);
                    
                    // 로그인 성공 후 메인 페이지로 이동
                    navigate('/', { replace: true });
                } else {
                    alert('로그인에 실패했습니다: ' + result.message);
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('로그인 처리 중 에러 발생:', error);
                alert('로그인 처리 중 문제가 발생했습니다.');
                navigate('/login', { replace: true });
            }
        };

        void exchangeCodeForToken();
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="text-xl font-bold text-slate-600">
                로그인 처리 중입니다...
            </div>
        </div>
    );
}
