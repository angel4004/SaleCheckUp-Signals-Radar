import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ComparisonPage } from "./pages/ComparisonPage";
import { FeedbackQueuePage } from "./pages/FeedbackQueuePage";
import { RunDetailPage } from "./pages/RunDetailPage";
import { RunInboxPage } from "./pages/RunInboxPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/runs" replace />} />
        <Route path="runs" element={<RunInboxPage />} />
        <Route path="runs/:runId" element={<RunDetailPage />} />
        <Route path="compare" element={<ComparisonPage />} />
        <Route path="feedback" element={<FeedbackQueuePage />} />
      </Route>
    </Routes>
  );
}
