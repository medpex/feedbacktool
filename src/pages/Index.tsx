
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomerFeedback from '@/components/CustomerFeedback';

const Index = () => {
  const [searchParams] = useSearchParams();
  const refId = searchParams.get('ref');

  return <CustomerFeedback refId={refId || undefined} />;
};

export default Index;
