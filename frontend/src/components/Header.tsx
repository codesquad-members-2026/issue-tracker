// src/Header.tsx
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem('accessToken');
        // 2. 로그인 페이지로 튕겨내기
        navigate('/login', { replace: true });
    };

    return (
        // 1. 전체 컨테이너: 높이 94px, 플렉스 박스로 양끝 정렬, 중앙 배치
        <header className="flex items-center justify-between w-full max-w-[1440px] mx-auto h-[94px] px-6">

            {/* 2. 로고 영역: Link를 추가하여 메인('/')으로 이동 가능하게 수정 */}
            <Link to="/">
                <h1 className="font-['Montserrat'] font-medium text-[32px] text-[#14142B] tracking-[-0.04em] leading-[40px] cursor-pointer hover:opacity-80 transition-opacity">
                    Issue Tracker
                </h1>
            </Link>

            {/* 3. 프로필 이미지 & 로그아웃 영역 */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleLogout}
                    className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    로그아웃
                </button>
                <div className="w-8 h-8 rounded-full bg-slate-300 border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                    {/* TODO: 임시 더미 이미지 삽입 (나중에 실제 유저 프로필 URL로 교체) */}
                    <img
                        src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
                        alt="User Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}