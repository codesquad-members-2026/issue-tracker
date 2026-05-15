// src/App.tsx
import Header from './components/Header.tsx';
import IssueListPage from './pages/IssueListPage.tsx';

function App() {
    const currentPage = 'list';

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <div className={"w-full pt-4"}>
                <Header />
            </div>

            {currentPage === 'list' && <IssueListPage />}
        </div>
    );
}

export default App;