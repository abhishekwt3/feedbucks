import './globals.css'
import { Inter } from 'next/font/google'
import '@shopify/polaris/build/esm/styles.css'
import { AppProvider } from '@shopify/polaris'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shopify Feedback Collector',
  description: 'Collect and analyze customer feedback for your Shopify store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider i18n={{}}>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

