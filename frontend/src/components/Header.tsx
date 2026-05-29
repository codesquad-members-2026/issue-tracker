// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api.ts";

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 백엔드 로그아웃 API 호출 (DB에서 RT 삭제 및 쿠키 만료)
            await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('로그아웃 요청 실패:', error);
        } finally {
            // 1. 로컬 스토리지에서 토큰 및 유저 정보 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            // 2. 로그인 페이지로 튕겨내기
            navigate('/login', { replace: true });
        }
    };

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.userId || 'unknown';

    return (
        // 1. 전체 컨테이너: 높이 94px, 플렉스 박스로 양끝 정렬, 중앙 배치
        <header className="flex items-center justify-between w-full max-w-[1440px] mx-auto h-[94px] px-6">

            {/* 2. 로고 영역: Link를 추가하여 메인('/')으로 이동 가능하게 수정 */}
            <Link to="/">
                <h1 className="font-['Montserrat'] font-medium text-[32px] text-[#14142B] tracking-[-0.04em] leading-[40px] cursor-pointer hover:opacity-80 transition-opacity">
                    Issue Tracker
                </h1>
            </Link>

            {/* 3. 프로필 이미지 & 유저 정보 & 로그아웃 영역 */}
            <div className="flex items-center gap-6">
                {/* 유저 정보 뱃지 */}
                <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img
                            src={`https://avatars.githubusercontent.com/${userId}?s=40&v=4`}
                            alt={`${userId} Profile`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                            }}
                        />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                        {userId}
                    </span>
                </div>

                {/* 로그아웃 버튼 */}
                <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                >
                    로그아웃
                </button>
            </div>
        </header>
    );
    }