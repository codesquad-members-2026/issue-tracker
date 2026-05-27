import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/common/Title';
import SignupForm from '../components/login/SignupForm';
import TextLink from '../components/common/TextLink';

const SignupPage: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (userId: string, password: string, name: string, email: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    password,
                    name: name || null,
                    email: email || null
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('회원가입이 완료되었습니다! 로그인해 주세요.');
                navigate('/login');
            } else {
                // 에러 발생 시
                let errorMessage = '회원가입에 실패했습니다.';
                
                // 스프링 Validation 에러 처리 로직 (필요 시)
                if (result.errorCode) {
                    errorMessage = result.message;
                } else if (result.errors && result.errors.length > 0) {
                    errorMessage = result.errors[0].defaultMessage;
                }
                
                alert(errorMessage);
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            alert('서버와 통신 중 문제가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 px-4">
            <div className="w-full max-w-[400px] flex flex-col items-center gap-10">
                <Title />

                <div className="w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-slate-800 text-center">회원가입</h2>
                    
                    <SignupForm onSubmit={handleSignup} isLoading={isLoading} />

                    <div className="flex flex-col items-center justify-center mt-2 pt-6 border-t border-slate-100 gap-3">
                        <span className="text-sm font-medium text-slate-500">이미 계정이 있으신가요?</span>
                        <TextLink to="/login" className="w-full text-center py-3 rounded-xl bg-blue-50 text-[#007AFF] hover:bg-blue-100">
                            로그인 페이지로 돌아가기
                        </TextLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
