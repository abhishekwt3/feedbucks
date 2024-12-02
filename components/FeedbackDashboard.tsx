import React, { useEffect, useState } from 'react';
import {
  Page,
  Layout,
  Card,
  DataTable,
  Pagination,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

interface Feedback {
  id: string;
  message: string;
  email: string | null;
  rating: number;
  createdAt: string;
}

const FeedbackDashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const app = useAppBridge();

  useEffect(() => {
    fetchFeedbacks();
  }, [page]);

  const fetchFeedbacks = async () => {
    const sessionToken = await getSessionToken(app);
    const response = await fetch(`/api/feedback?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    const data = await response.json();
    if (data.success) {
      setFeedbacks(data.feedbacks);
    } else {
      console.error('Error fetching feedbacks:', data.error);
    }
  };

  const rows = feedbacks.map((feedback) => [
    feedback.id,
    feedback.message,
    feedback.email || 'Anonymous',
    feedback.rating,
    new Date(feedback.createdAt).toLocaleString(),
  ]);

  return (
    <Page title="Feedback Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'numeric', 'text']}
              headings={['ID', 'Message', 'Email', 'Rating', 'Created At']}
              rows={rows}
            />
            <Pagination
              hasPrevious={page > 1}
              onPrevious={() => setPage(p => p - 1)}
              hasNext={feedbacks.length === pageSize}
              onNext={() => setPage(p => p + 1)}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default FeedbackDashboard;

