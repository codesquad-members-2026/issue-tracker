// src/App.tsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.tsx';
import IssueListPage from './pages/IssueListPage.tsx';
import IssueWritePage from './pages/IssueWritePage.tsx';
import IssueDetailPage from './pages/IssueDetailPage.tsx';
import LabelPage from './pages/LabelPage.tsx';
import MilestonePage from './pages/MilestonePage.tsx';
import LoginPage from './pages/LoginPage.tsx';

// 헤더를 포함하는 공통 레이아웃 컴포넌트
const MainLayout = () => {
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
                    {/* 로그인 페이지는 헤더가 필요 없으므로 MainLayout 밖에 둡니다. */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* 메인 영역: 아래의 모든 페이지는 MainLayout(헤더 포함) 안에서 보입니다. */}
                    <Route element={<MainLayout />}>
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