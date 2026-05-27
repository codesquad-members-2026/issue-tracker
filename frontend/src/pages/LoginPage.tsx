import type { FC } from 'react';
import Title from '../components/common/Title';
import Button from '../components/common/Button';
import Divider from '../components/common/Divider';
import LoginForm from '../components/login/LoginForm';
import TextLink from '../components/common/TextLink';

const LoginPage: FC = () => {
    const handleGithubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
        
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
        
        window.location.href = githubAuthUrl;
    };

    const handleLocalLogin = (id: string, pw: string) => {
        console.log('Local login attempt:', { id, pw });
        alert('로컬 로그인은 아직 준비 중입니다. 깃허브 로그인을 이용해 주세요!');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 px-4">
            <div className="w-full max-w-[400px] flex flex-col items-center gap-12">
                <Title />

                <div className="w-full flex flex-col gap-6">
                    {/* 소셜 로그인 영역 */}
                    <Button variant="outline" onClick={handleGithubLogin}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        GitHub 계정으로 로그인
                    </Button>

                    <Divider text="or" />

                    {/* 로컬 로그인 영역 */}
                    <LoginForm onSubmit={handleLocalLogin} />

                    <TextLink to="/signup" className="mx-auto mt-2">
                        회원가입
                    </TextLink>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
