// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 라우터 컴포넌트 임포트
import Header from './components/Header.tsx';
import IssueListPage from './pages/IssueListPage.tsx';
import IssueWritePage from './pages/IssueWritePage.tsx'; // 작성 페이지 임포트
import IssueDetailPage from './pages/IssueDetailPage.tsx';

function App() {
    return (
        <BrowserRouter> {/* 브라우저 라우터로 전체를 감쌉니다 */}
            <div className="min-h-screen bg-slate-100 font-sans">
                <div className={"w-full pt-4"}>
                    <Header />
                </div>

                <Routes>
                    {/* 메인 목록 페이지 */}
                    <Route path="/" element={<IssueListPage />} />

                    {/* 이슈 작성 페이지 */}
                    <Route path="/issues/new" element={<IssueWritePage />} />

                    {/* 이슈 상세 페이지 */}
                    <Route path="/issues/:id" element={<IssueDetailPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;