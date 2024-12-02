import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Install = () => {
  const router = useRouter();

  useEffect(() => {
    const shop = router.query.shop;
    if (shop) {
      router.push(`/api/auth?shop=${shop}`);
    }
  }, [router]);

  return <p>Preparing to install...</p>;
};

export default Install;

