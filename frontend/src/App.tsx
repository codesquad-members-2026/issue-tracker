// src/App.tsx
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import IssueListPage from './pages/IssueListPage.tsx';
import IssueWritePage from './pages/IssueWritePage.tsx';
import IssueDetailPage from './pages/IssueDetailPage.tsx';
import LabelPage from './pages/LabelPage.tsx';
import MilestonePage from './pages/MilestonePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import AuthCallbackPage from './pages/AuthCallbackPage.tsx';

// 헤더를 포함하며 토큰 유무를 검사하는 보호된 레이아웃 컴포넌트
const ProtectedLayout = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <div className="w-full pt-4">
                <Header />
            </div>
            <Outlet /> {/* 이 자리에 아래의 하위 라우트들이 갈아끼워집니다. */}
        </>
    );
};

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-100 font-sans">
                <Routes>
                    {/* 로그인 페이지는 헤더가 필요 없으므로 ProtectedLayout 밖에 둡니다. */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* 깃허브 로그인 콜백 페이지 (환경 변수의 리다이렉트 경로와 맞춤) */}
                    <Route path="/login/oauth2/code/github" element={<AuthCallbackPage />} />

                    {/* 메인 영역: 아래의 모든 페이지는 ProtectedLayout(헤더+보안) 안에서 보입니다. */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/" element={<IssueListPage />} />
                        <Route path="/issues/new" element={<IssueWritePage />} />
                        <Route path="/issues/:id" element={<IssueDetailPage />} />
                        <Route path="/labels" element={<LabelPage />} />
                        <Route path="/milestones" element={<MilestonePage />} />
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;